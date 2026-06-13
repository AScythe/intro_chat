// organizerFlow.spec.ts
// Description: E2E tests for organizer flow — create event via UI, configure rooms/topics, re-edit, test event with full user flow

import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.describe('Organizer Flow', () => {
  let eventId: string;

  test('1: Create event via UI, configure rooms/topics, save', async ({ page }) => {
    await page.goto('/');

    // Create event on home page
    await page.locator('#eventName').fill('Organizer E2E Test');
    await page.getByRole('button', { name: 'Create Event' }).click();
    await expect(page.getByText('Event Created!')).toBeVisible({ timeout: 10000 });

    // Click Organize Event — captures eventId from URL
    await page.getByRole('button', { name: 'Organize Event' }).click();
    await page.waitForURL(/\/organize\//);
    eventId = page.url().split('/organize/')[1] || '';

    // Configure rooms/topics
    await expect(page.getByText('Organize Event')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Main Hall')).toBeVisible();

    // Deselect 1 default room
    await page.getByRole('button', { name: 'Table 1' }).click();

    // Deselect 1 default topic
    await page.getByRole('button', { name: 'DevOps' }).click();

    // Add custom room
    await page.getByPlaceholder('Add new room...').fill('Chill Zone');
    await page.getByRole('button', { name: 'Add' }).first().click();
    await expect(page.getByText('Chill Zone')).toBeVisible();

    // Add custom topic
    await page.getByPlaceholder('Add new topic...').fill('Photography');
    await page.getByRole('button', { name: 'Add' }).nth(1).click();
    await expect(page.getByText('Photography')).toBeVisible();

    // Save
    await page.getByText('Save Configuration').click();
    await expect(page.getByText('Event configuration saved!')).toBeVisible({ timeout: 10000 });
  });

  test('2: Edit event — verify state persists, remove defaults, save again', async ({ page }) => {
    await page.goto('/');
    await page.locator('#editEventCode').fill(eventId);
    await page.getByRole('button', { name: 'Edit Event' }).click();

    await expect(page.getByText('Organize Event')).toBeVisible({ timeout: 10000 });

    // Custom room and topic should be present
    await expect(page.getByText('Chill Zone')).toBeVisible();
    await expect(page.getByText('Photography')).toBeVisible();

    // Table 1 should be deselected (opacity-50 class)
    const table1 = page.getByRole('button', { name: 'Table 1' });
    await expect(table1).toBeVisible();
    await expect(table1).toHaveClass(/opacity-50/);

    // Deselect another default room
    await page.getByRole('button', { name: 'Table 2' }).click();

    // Deselect another default topic
    await page.getByRole('button', { name: 'Swimming' }).click();

    // Save
    await page.getByText('Save Configuration').click();
    await expect(page.getByText('Event configuration saved!')).toBeVisible({ timeout: 10000 });
  });

  test('3: Test event — full user flow through join, room, people, chat', async ({ page }) => {
    await page.goto('/');
    await page.locator('#editEventCode').fill(eventId);
    await page.getByRole('button', { name: 'Test This Event' }).click();

    // UserInfoPage — fill profile
    await expect(page.getByText('Your Profile')).toBeVisible({ timeout: 10000 });
    await page.locator('#nameInput').fill('E2E Tester');
    await page.locator('#linkedinInput').fill('https://linkedin.com/in/e2etester');
    await page.locator('#slackInput').fill('@e2etester');

    // Verify only selected topics appear (not deselected ones)
    await page.getByRole('combobox').first().click();
    await expect(page.getByRole('option', { name: 'AI Development' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Photography' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'DevOps' })).not.toBeVisible();
    await page.getByRole('option', { name: 'AI Development' }).click();
    await page.keyboard.press('Escape');

    // Save profile
    await page.getByText('Save Profile').click();
    await expect(page.getByText(/Profile saved/i)).toBeDisabled({ timeout: 10000 });

    // Navigate to room selection
    await page.getByText('Select Room / Area').click();
    await expect(page.getByText('Where are you?')).toBeVisible({ timeout: 10000 });

    // Verify only configured rooms appear (not deselected ones)
    await page.getByRole('combobox').click();
    await expect(page.getByRole('option', { name: 'Main Hall' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Chill Zone' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Table 1' })).not.toBeVisible();
    await page.getByRole('option').first().click();
    await page.getByText('Select Room').click();

    // PeoplePage — should show users from API
    await expect(page.getByText('Find Chat Partners')).toBeVisible({ timeout: 10000 });

    // Wait for a user card to render, then click first one
    await expect(page.getByText(/Available|people/)).toBeVisible({ timeout: 15000 });
    await page.locator('[class*="cursor-pointer"]').first().click();

    // Request chat — button enabled when person selected
    const requestButton = page.getByRole('button', { name: /Request chat with/ });
    await expect(requestButton).toBeEnabled({ timeout: 10000 });
    await requestButton.click();

    // Wait for acceptance — sample user responds via HTTP, shows {name} accepted! with ready buttons
    await expect(page.getByRole('heading', { name: /accepted/i })).toBeVisible({ timeout: 15000 });

    // Click "I'm Ready to Chat!" button
    await page.getByRole('button', { name: /ready to chat/i }).click();

    // Wait for both ready and click "Start Chat" button
    await expect(page.getByRole('button', { name: /start chat/i })).toBeVisible({ timeout: 15000 });
    await page.getByRole('button', { name: /start chat/i }).click();

    // Should be on chat page
    await expect(page).toHaveURL(/\/chat\//, { timeout: 10000 });

    // Back to home
    await page.getByText('Back to Home').click();
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });
});
