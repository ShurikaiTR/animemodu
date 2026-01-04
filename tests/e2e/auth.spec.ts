import { expect,test } from '@playwright/test';

test.describe('Authentication Flow', () => {

    test('login modal opens and handles invalid input', async ({ page }) => {
        await page.goto('/');

        // 1. Click "Giriş Yap" button in header
        const loginButton = page.getByRole('button', { name: 'Giriş Yap' });
        await expect(loginButton).toBeVisible();
        await loginButton.click();

        // 2. Check Modal Open
        const modalTitle = page.getByRole('heading', { name: 'Giriş Yap' });
        await expect(modalTitle).toBeVisible();

        // 3. Submit empty form / invalid form
        // Note: The Header Search button is also type="submit", so we must be specific.
        // The Login button text is "Giriş Yap", searching by role button + name is safest.
        const formSubmit = page.getByRole('button', { name: 'Giriş Yap', exact: true }).last();
        // .last() because we have the trigger button and the submit button both named "Giriş Yap" possibly visible or in DOM.
        // Actually, trigger is hidden effectively by the modal overlay? No.
        // Let's use a locator scoped to the form if possible, but we don't have a specific form ID.
        // We can rely on 'button[type="submit"]' BUT filter by accessible name.

        await formSubmit.click();

        // 4. Expect validation error 
        await page.fill('input[name="email"]', 'invalid-email');
        await page.fill('input[name="password"]', '123');
        await formSubmit.click();

        // 5. Check for error message
        // We expect "Geçerli bir email adresi giriniz" because Zod runs first.
        const errorMessage = page.locator('.text-red-500').first();
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText(/Geçerli bir email adresi giriniz/);
    });

});
