import { test as setup, expect } from "@playwright/test";
import path from "path";
import { LoginPage } from "../pages/LoginPage";
import { USERNAME, PASSWORD } from "../utils/config.js";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup('authenticate', async ({ page }) => {
   const Login = new LoginPage(page);
  await Login.goTo();
  await Login.login(USERNAME, PASSWORD);
  await page.waitForURL("https://trello.com/u/lomardiego17/boards");
  await expect(
    page.locator('[data-testid="header-create-menu-button"]')
  ).toBeVisible();
  await page.context().storageState({ path: authFile });
});
