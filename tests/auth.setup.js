// import { test as setup, expect } from '@playwright/test';
// import path from 'path';
// import { LoginPage } from '../pages/loginPage';

// const authFile = path.join(__dirname, '../playwright/.auth/user.json');

// setup('authenticate', async ({ page }) => {
//     // Cambiar url, y credenciales como variables /?
//     const Login = new LoginPage(page);
//     await Login.goTo();
//     await Login.login('lomardiego17@gmail.com', 'Aa123456789-1');
//     await page.waitForURL('https://trello.com/u/lomardiego17/boards');
//     await expect(page.locator('[data-testid="header-create-menu-button"]')).toBeVisible();
//     await page.context().storageState({ path: authFile });
// });
// import { test as setup } from '@playwright/test';
// import path from 'path';

// const authFile = path.join(__dirname, '../playwright/.auth/user.json');

// setup('authenticate with Trello cookie', async ({ browser }) => {
//   const context = await browser.newContext();

//   await context.addCookies([{
//     name: 'cloud.session.token',   
//     value: 'ATTA5b7ff9373f9a61301f5dc68f630a7763771ea987fdd4fdc5c15e67207fb215880E09D7AD', 
//     domain: 'https://trello.com/',
//     path: '/',
//     httpOnly: true,
//     secure: true,
//     sameSite: 'Lax'
//   }, {
//     name: 'loggedIn',              
//     value: '1',
//     domain: '.trello.com',
//     path: '/',
//     httpOnly: false,
//     secure: true,
//     sameSite: 'Lax'
//   }]);
//   await context.storageState({ path: authFile });
//   await context.close();
// });