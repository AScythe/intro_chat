// participantFlow.spec.ts
// Description: E2E tests for participant flow — join existing event via home page, fill profile, select room, match, chat

import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test.describe.configure({ mode: 'serial' });

let eventId: string;

test.beforeAll(() => {
  const scriptPath = path.resolve(__dirname, 'helpers', 'get_event.py');
  const rawId = execSync(`uv run python "${scriptPath}"`, { encoding: 'utf-8' }).trim();
  eventId = rawId.toUpperCase();
  expect(eventId).toHaveLength(8);
});

test.describe('Participant Flow', () => {
  test('1: Home page — join via event code input', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('IntroChat');

    await page.locator('#eventCode').fill(eventId);
    await page.getByRole('button', { name: 'Join Event' }).click();

    await expect(page).toHaveURL(`/join/${eventId}`);
    await expect(page.locator('#nameInput')).toBeVisible();
  });

  test('2: Save profile with auto-generated username', async ({ page }) => {
    await page.goto(`/join/${eventId}`);

    const postPromise = page.waitForRequest((req) =>
      req.url().includes('/join') && req.method() === 'POST'
    );

    await page.locator('#linkedinInput').fill('https://linkedin.com/in/test');
    await page.locator('#slackInput').fill('@testuser');

    await page.getByRole('combobox').first().click();
    await page.getByRole('option').first().click();
    await page.keyboard.press('Escape');

    await page.getByText('Save Profile').click();

    const postReq = await postPromise;
    const body = JSON.parse(postReq.postData() || '{}');
    expect(body.username).toMatch(/^User_[a-z0-9]{5}$/);

    await expect(page.getByRole('button', { name: /Profile saved/i })).toBeDisabled();
    await expect(page.getByText('Select Room / Area')).not.toBeDisabled();
  });

  test('3: Save profile with custom name', async ({ page }) => {
    await page.goto(`/join/${eventId}`);

    const postPromise = page.waitForRequest((req) =>
      req.url().includes('/join') && req.method() === 'POST'
    );

    await page.locator('#nameInput').fill('Alice');
    await page.locator('#linkedinInput').fill('https://linkedin.com/in/alice');
    await page.locator('#slackInput').fill('@alice');

    await page.getByRole('combobox').first().click();
    await page.getByRole('option').first().click();
    await page.keyboard.press('Escape');

    await page.getByText('Save Profile').click();

    const postReq = await postPromise;
    const body = JSON.parse(postReq.postData() || '{}');
    expect(body.username).toBe('Alice');

    await expect(page.getByRole('button', { name: /Profile saved/i })).toBeDisabled();
    await expect(page.getByText('Select Room / Area')).not.toBeDisabled();
  });

  test('4: Save profile, select room, verify people page', async ({ page }) => {
    await page.goto(`/join/${eventId}`);

    await page.locator('#nameInput').fill('Room Tester');
    await page.getByRole('combobox').first().click();
    await page.getByRole('option').first().click();
    await page.keyboard.press('Escape');

    await page.getByText('Save Profile').click();
    await expect(page.getByRole('button', { name: /Profile saved/i })).toBeDisabled({ timeout: 10000 });

    await page.getByText('Select Room / Area').click();
    await expect(page.getByText('Where are you?')).toBeVisible({ timeout: 10000 });

    await page.getByRole('combobox').click();
    await page.getByRole('option').first().click();
    await page.getByText('Select Room').click();

    await expect(page.getByText('Find Chat Partners')).toBeVisible({ timeout: 10000 });
  });

  test('5: Two-user match + chat page renders', async ({ browser, request }) => {
    const roomsResp = await request.get(`/api/events/${eventId}/rooms`);
    expect(roomsResp.ok()).toBeTruthy();
    const rooms = await roomsResp.json();
    const roomId = rooms[0].id;

    const joinRespA = await request.post(`/api/events/${eventId}/join`, {
      data: { linkedin_url: '', slack_handle: '' },
    });
    expect(joinRespA.ok()).toBeTruthy();
    const { user_id: userIdA } = await joinRespA.json();

    const joinRespB = await request.post(`/api/events/${eventId}/join`, {
      data: { linkedin_url: '', slack_handle: '' },
    });
    expect(joinRespB.ok()).toBeTruthy();
    const { user_id: userIdB } = await joinRespB.json();

    await request.post(`/api/users/${userIdA}/room`, { data: { room_id: roomId } });
    await request.post(`/api/users/${userIdB}/room`, { data: { room_id: roomId } });
    await request.post(`/api/users/${userIdA}/available`, { data: { available: true } });
    await request.post(`/api/users/${userIdB}/available`, { data: { available: true } });

    let matchId: string | null = null;
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 500));
      const matchResp = await request.get(`/api/users/${userIdA}/match`);
      if (matchResp.ok()) {
        const matchData = await matchResp.json();
        matchId = matchData.match_id;
        break;
      }
    }
    expect(matchId).toBeTruthy();

    const context = await browser.newContext();
    const chatPage = await context.newPage();
    await chatPage.goto(`/chat/${matchId}`);
    await expect(chatPage).toHaveURL(/\/chat\//);
    await context.close();
  });

  test('6a: Full chat flow — connection exchanged', async ({ page, request }) => {
    const roomsResp = await request.get(`/api/events/${eventId}/rooms`);
    expect(roomsResp.ok()).toBeTruthy();
    const rooms = await roomsResp.json();
    const roomId = rooms[Math.floor(Math.random() * rooms.length)].id;

    const joinRespA = await request.post(`/api/events/${eventId}/join`, {
      data: { username: 'UserA', linkedin_url: 'https://linkedin.com/in/usera', slack_handle: '@usera' },
    });
    expect(joinRespA.ok()).toBeTruthy();
    const { user_id: userIdA } = await joinRespA.json();

    const joinRespB = await request.post(`/api/events/${eventId}/join`, {
      data: { username: 'UserB', linkedin_url: 'https://linkedin.com/in/userb', slack_handle: '@userb' },
    });
    expect(joinRespB.ok()).toBeTruthy();
    const { user_id: userIdB } = await joinRespB.json();

    await request.post(`/api/users/${userIdA}/room`, { data: { room_id: roomId } });
    await request.post(`/api/users/${userIdB}/room`, { data: { room_id: roomId } });
    await request.post(`/api/users/${userIdA}/available`, { data: { available: true } });
    await request.post(`/api/users/${userIdB}/available`, { data: { available: true } });

    let matchId: string | null = null;
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 500));
      const matchResp = await request.get(`/api/users/${userIdA}/match`);
      if (matchResp.ok()) {
        const matchData = await matchResp.json();
        matchId = matchData.match_id;
        break;
      }
    }
    expect(matchId).toBeTruthy();

    await page.goto('/');
    await page.evaluate((args: { userId: string; eventId: string }) => {
      localStorage.setItem('introchat_user_id', args.userId);
      localStorage.setItem('introchat_event_id', args.eventId);
      localStorage.setItem('introchat_username', 'UserA');
    }, { userId: userIdA, eventId: eventId });

    await page.goto(`/chat/${matchId}`);
    await expect(page.getByText('Chatting with')).toBeVisible({ timeout: 10000 });

    await expect(page.getByText("Time's Up!")).toBeVisible({ timeout: 45000 });

    await page.getByText('End chat and connect').click();
    await expect(page.getByText('Would you like to exchange usernames')).toBeVisible({ timeout: 5000 });

    await request.post(`/api/matches/${matchId}/connect`, {
      data: { user_id: userIdB, wants_to_connect: true },
    });

    await page.getByText("Yes, let's connect!").click();
    await expect(page.getByText('Connection Exchanged!')).toBeVisible({ timeout: 10000 });

    await page.getByText('Back to Home').click();
    await expect(page).toHaveURL('/');
  });

  test('6b: Full chat flow — connection declined', async ({ page, request }) => {
    const roomsResp = await request.get(`/api/events/${eventId}/rooms`);
    expect(roomsResp.ok()).toBeTruthy();
    const rooms = await roomsResp.json();
    const roomId = rooms[Math.floor(Math.random() * rooms.length)].id;

    const joinRespA = await request.post(`/api/events/${eventId}/join`, {
      data: { username: 'UserA', linkedin_url: '', slack_handle: '' },
    });
    expect(joinRespA.ok()).toBeTruthy();
    const { user_id: userIdA } = await joinRespA.json();

    const joinRespB = await request.post(`/api/events/${eventId}/join`, {
      data: { username: 'UserB', linkedin_url: '', slack_handle: '' },
    });
    expect(joinRespB.ok()).toBeTruthy();
    const { user_id: userIdB } = await joinRespB.json();

    await request.post(`/api/users/${userIdA}/room`, { data: { room_id: roomId } });
    await request.post(`/api/users/${userIdB}/room`, { data: { room_id: roomId } });
    await request.post(`/api/users/${userIdA}/available`, { data: { available: true } });
    await request.post(`/api/users/${userIdB}/available`, { data: { available: true } });

    let matchId: string | null = null;
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 500));
      const matchResp = await request.get(`/api/users/${userIdA}/match`);
      if (matchResp.ok()) {
        const matchData = await matchResp.json();
        matchId = matchData.match_id;
        break;
      }
    }
    expect(matchId).toBeTruthy();

    await page.goto('/');
    await page.evaluate((args: { userId: string; eventId: string }) => {
      localStorage.setItem('introchat_user_id', args.userId);
      localStorage.setItem('introchat_event_id', args.eventId);
      localStorage.setItem('introchat_username', 'UserA');
    }, { userId: userIdA, eventId: eventId });

    await page.goto(`/chat/${matchId}`);
    await expect(page.getByText('Chatting with')).toBeVisible({ timeout: 10000 });

    await expect(page.getByText("Time's Up!")).toBeVisible({ timeout: 45000 });

    await page.getByText('End chat and connect').click();
    await expect(page.getByText('Would you like to exchange usernames')).toBeVisible({ timeout: 5000 });

    await request.post(`/api/matches/${matchId}/connect`, {
      data: { user_id: userIdB, wants_to_connect: false },
    });

    await page.getByText('No thanks').click();
    await expect(page.getByText('Chat Complete')).toBeVisible({ timeout: 10000 });

    await page.getByText('Back to Home').click();
    await expect(page).toHaveURL('/');
  });
});
