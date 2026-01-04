import { expect,test } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');

    // 1. Sanity Check: Title should not be empty
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    console.log('Page Title:', title);

    // 2. Critical Check (Cross-Platform): 
    // The Logo link (pointing to "/") is visible on both Mobile and Desktop.
    // We look for a link that goes to the root path.
    // Note: We avoid checking specific text like "AnimeModu" because the local DB might vary (e.g. "Deneme").
    const homeLink = page.locator('header a[href="/"]').first();
    await expect(homeLink).toBeVisible();
});
