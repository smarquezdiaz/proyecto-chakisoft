export const shortWait = async (page) => {
  await page.waitForTimeout(1000);
};

export const mediumWait = async (page) => {
  await page.waitForTimeout(2000);
};

export const longWait = async (page) => {
  await page.waitForTimeout(5000);
};

module.exports = {
  SHORT: 1000,
  MEDIUM: 2000,
  LONG: 5000,
  ASSERTION: 10000, 
};