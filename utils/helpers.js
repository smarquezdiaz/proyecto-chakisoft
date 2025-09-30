export async function assertVisible(page, selectors, msg) {
    await expect(page.locator(selectors), msg).toBeVisible();
}