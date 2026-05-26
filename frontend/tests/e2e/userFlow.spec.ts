// userFlow.spec.ts
// Description: E2E tests covering all app pages — home, join (optional name), save, room, two-user match + chat

import { test, expect } from '@playwright/test';

test.describe('IntroChat E2E', () => {
  let eventId: string;

  test.beforeAll(async ({ request }) => {
    const resp = await request.post('/api/events', {
      data: { name: 'E2E Test Event' },
    });
    expect(resp.ok()).toBeTruthy();
    const data = await resp.json();
    eventId = data.event_id;
  });

  test('1: Home page loads with event input and action buttons', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('IntroChat');
    await expect(page.locator('input[placeholder*="code"]').first()).toBeVisible();
    await expect(page.getByText('Create Event').first()).toBeVisible();
    await expect(page.getByText('Join Event').first()).toBeVisible();
  });

  test('2: Join page renders with optional name field', async ({ page }) => {
    await page.goto(`/join/${eventId}`);
    await expect(page.locator('#nameInput')).toBeVisible();
    await expect(page.locator('label:has-text("Your Name")')).toBeVisible();
    await expect(page.locator('label:has-text("Your Name")')).not.toContainText('*');
    await expect(page.locator('#linkedinInput')).toBeVisible();
    await expect(page.locator('#slackInput')).toBeVisible();
    await expect(page.getByText('Save Profile')).not.toBeDisabled();
  });

  test('3: Save profile with auto-generated username when name is empty', async ({ page }) => {
    await page.goto(`/join/${eventId}`);

    const postPromise = page.waitForRequest((req) =>
      req.url().includes('/join') && req.method() === 'POST'
    );

    await page.locator('#linkedinInput').fill('https://linkedin.com/in/test');
    await page.locator('#slackInput').fill('@testuser');
    await page.getByText('Save Profile').click();

    const postReq = await postPromise;
    const body = JSON.parse(postReq.postData() || '{}');
    expect(body.username).toMatch(/^User_[a-z0-9]{5}$/);

    await expect(page.getByText('Profile saved')).toBeVisible();
    await expect(page.getByText('Select Room / Area')).not.toBeDisabled();
  });

  test('4: Save profile with custom name', async ({ page }) => {
    await page.goto(`/join/${eventId}`);

    const postPromise = page.waitForRequest((req) =>
      req.url().includes('/join') && req.method() === 'POST'
    );

    await page.locator('#nameInput').fill('Alice');
    await page.locator('#linkedinInput').fill('https://linkedin.com/in/alice');
    await page.locator('#slackInput').fill('@alice');
    await page.getByText('Save Profile').click();

    const postReq = await postPromise;
    const body = JSON.parse(postReq.postData() || '{}');
    expect(body.username).toBe('Alice');

    await expect(page.getByText('Profile saved')).toBeVisible();
    await expect(page.getByText('Select Room / Area')).not.toBeDisabled();
  });

  test('5: Two-user match + chat page renders', async ({ browser, request }) => {
    // Create a dedicated event for this test
    const eventResp = await request.post('/api/events', {
      data: { name: 'Match E2E Test' },
    });
    expect(eventResp.ok()).toBeTruthy();
    const { event_id } = await eventResp.json();

    const roomsResp = await request.get(`/api/events/${event_id}/rooms`);
    expect(roomsResp.ok()).toBeTruthy();
    const rooms = await roomsResp.json();
    const roomId = rooms[0].id;

    // User A: join
    const joinRespA = await request.post(`/api/events/${event_id}/join`, {
      data: { linkedin_url: '', slack_handle: '' },
    });
    expect(joinRespA.ok()).toBeTruthy();
    const { user_id: userIdA } = await joinRespA.json();

    // User B: join
    const joinRespB = await request.post(`/api/events/${event_id}/join`, {
      data: { linkedin_url: '', slack_handle: '' },
    });
    expect(joinRespB.ok()).toBeTruthy();
    const { user_id: userIdB } = await joinRespB.json();

    // Both select room
    await request.post(`/api/users/${userIdA}/room`, { data: { room_id: roomId } });
    await request.post(`/api/users/${userIdB}/room`, { data: { room_id: roomId } });

    // A toggles available (enters waiting queue)
    await request.post(`/api/users/${userIdA}/available`, { data: { available: true } });

    // B toggles available (triggers match with A)
    await request.post(`/api/users/${userIdB}/available`, { data: { available: true } });

    // Poll for match
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

    // Launch a browser page and navigate to the chat page
    const context = await browser.newContext();
    const chatPage = await context.newPage();
    await chatPage.goto(`/chat/${matchId}`);
    await expect(chatPage).toHaveURL(/\/chat\//);
    await context.close();
  });

  test('6a: Full chat flow — connection exchanged', async ({ page, request }) => {
    const eventResp = await request.post('/api/events', {
      data: { name: 'Conn Exchange E2E' },
    });
    expect(eventResp.ok()).toBeTruthy();
    const { event_id } = await eventResp.json();

    const roomsResp = await request.get(`/api/events/${event_id}/rooms`);
    expect(roomsResp.ok()).toBeTruthy();
    const rooms = await roomsResp.json();
    const roomId = rooms[Math.floor(Math.random() * rooms.length)].id;

    const joinRespA = await request.post(`/api/events/${event_id}/join`, {
      data: { username: 'UserA', linkedin_url: 'https://linkedin.com/in/usera', slack_handle: '@usera' },
    });
    expect(joinRespA.ok()).toBeTruthy();
    const { user_id: userIdA } = await joinRespA.json();

    const joinRespB = await request.post(`/api/events/${event_id}/join`, {
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
    }, { userId: userIdA, eventId: event_id });

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
    const eventResp = await request.post('/api/events', {
      data: { name: 'Conn Decline E2E' },
    });
    expect(eventResp.ok()).toBeTruthy();
    const { event_id } = await eventResp.json();

    const roomsResp = await request.get(`/api/events/${event_id}/rooms`);
    expect(roomsResp.ok()).toBeTruthy();
    const rooms = await roomsResp.json();
    const roomId = rooms[Math.floor(Math.random() * rooms.length)].id;

    const joinRespA = await request.post(`/api/events/${event_id}/join`, {
      data: { username: 'UserA', linkedin_url: '', slack_handle: '' },
    });
    expect(joinRespA.ok()).toBeTruthy();
    const { user_id: userIdA } = await joinRespA.json();

    const joinRespB = await request.post(`/api/events/${event_id}/join`, {
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
    }, { userId: userIdA, eventId: event_id });

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
