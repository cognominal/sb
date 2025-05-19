import { expect, test } from '@playwright/test';


test('home page has expected h2', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h2')).toBeVisible();
});

test('there is a docs page', async ({ page }) => {
	await page.goto('/docs');
	await expect(page.locator('h1')).toBeVisible();
});
test('there is an admin page', async ({ page }) => {
	await page.goto('/admin');
	const buttonCount = await page.locator('button').count();
	expect(buttonCount).toBeGreaterThan(0);
});
test('placeholder for /docs/0 ', async ({ page }) => {
	await page.goto('/docs/0');
	const liCount = await page.locator('li.breakwords').count();
	expect(liCount).toBeGreaterThan(0);
});
