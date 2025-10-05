import { test as setup, expect } from "@playwright/test";
import path from "path";
import { LoginPage } from "../pages/LoginPage";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

<<<<<<< HEAD
setup('authenticate', async ({ page }) => {
    // TODO Cambiar url, y credenciales como variables /?
    const Login = new LoginPage(page);
    await Login.goTo();
    await Login.login('lomardiego17@gmail.com', 'Aa123456789-1');
    await page.waitForURL('https://trello.com/u/lomardiego17/boards');
    await expect(page.locator('[data-testid="header-create-menu-button"]')).toBeVisible();
    await page.context().storageState({ path: authFile });
});
=======
setup("authenticate", async ({ page }) => {
  // Cambiar url, y credenciales como variables /?
  const Login = new LoginPage(page);
  await Login.goTo();
  await Login.login("lomardiego17@gmail.com", "Aa123456789-1");
  await page.waitForURL("https://trello.com/u/lomardiego17/boards");
  await expect(
    page.locator('[data-testid="header-create-menu-button"]')
  ).toBeVisible();
  await page.context().storageState({ path: authFile });
});
>>>>>>> 3b861a3a341ce449732aac4e59a9d98b0f76dfb1
