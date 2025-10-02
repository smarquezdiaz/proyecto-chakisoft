import { expect } from '@playwright/test';

export function assertObjectMatch(actual, expected) {
  for (const key in expected) {
    expect(actual[key]).toBe(expected[key]);
  }
}