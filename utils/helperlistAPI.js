import { expect } from '@playwright/test';

export async function validateResponse(response, validator, testName) {
  expect(response).toBeDefined();
  expect(response).not.toBeNull();

  const isValid = validator(response);
  if (!isValid) {
    console.error(`[${testName}]  Schema failed:`, JSON.stringify(validator.errors, null, 2));
  }
  expect(isValid, JSON.stringify(validator.errors, null, 2)).toBe(true);

  console.log(`[${testName}]  Response 200 OK - Schema validado`);
  return response;
}

export function logStep(message) {
  console.log(`${message}`);
}
