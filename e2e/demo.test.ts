import { expect, test } from '@playwright/test';

// test('home page has expected h1', async ({ page }) => {
// 	await page.goto('/');
// 	await expect(page.locator('h1')).toBeVisible();
// });

test('there is a docs page', async ({ page }) => {
	await page.goto('/docs');
	await expect(page.locator('h1')).toBeVisible();
});
test('placeholder for /docs/0 ', async ({ page }) => {
	await page.goto('/docs/0');
	// await expect(page.locator('h1')).toBeVisible();
});
