import { request, test } from '@playwright/test';
import { config } from "dotenv";

config();
let context;

test.beforeAll(async () => {
  context = await request.newContext({
    timeout: 30000,
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
  });
});

test.afterAll(async () => {
  await context.dispose();
});

export async function httpGet(url, headers) {
  const response = await context.get(url, { headers });
  return response;
}

export async function httpPost(
  url,
  data,
  headers
) {
  const response = await context.post(url, { data, headers });
  return response;
}

export async function httpPatch(
  url,
  data,
  headers
) {
  const response = await context.patch(url, { data, headers });
  return response;
}

export async function httpPut(
  url,
  data,
  headers
) {
  const response = await context.put(url, { data, headers });
  return response;
}

export async function httpDelete(
  url,
  headers
) {
  const response = await context.delete(url, { headers });
  return response;
}