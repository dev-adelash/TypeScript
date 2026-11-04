import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { NestFactory } from '@nestjs/core';
import type { INestApplication } from '@nestjs/common';
import { DemoModule } from './server';

let app: INestApplication;
let base: string;

before(async () => {
  app = await NestFactory.create(DemoModule, { logger: false });
  await app.listen(0, '127.0.0.1');
  base = await app.getUrl();
});

after(async () => {
  if (app) await app.close();
});

for (const token of ['toString', 'constructor', '__proto__', 'hasOwnProperty', 'valueOf', 'Bearer unknown', '', undefined]) {
  test(`rejects unrecognized authorization ${JSON.stringify(token)} before executing commands`, async () => {
    const response = await fetch(`${base}/api/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token === undefined ? {} : { Authorization: token }) },
      body: JSON.stringify({ action: 'reserve', payload: { id: `invalid-${token}`, sku: 'BOOK', quantity: 1, version: 0 } }),
    });
    assert.equal(response.status, 401);

    const state = await fetch(`${base}/api/state`, { headers: { Authorization: 'Bearer local-operator' } });
    assert.equal(state.status, 200);
    const workflow = await state.json();
    assert.equal(workflow.stock, 10);
    assert.deepEqual(workflow.orders, []);
    assert.deepEqual(workflow.audit, []);
  });
}

test('registered learner and operator tokens retain their workflow permissions', async () => {
  const response = await fetch(`${base}/api/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer local-learner' },
    body: JSON.stringify({ action: 'reserve', payload: { id: 'valid-order', sku: 'BOOK', quantity: 1, version: 0 } }),
  });
  assert.equal(response.status, 201);
  assert.equal((await response.json()).status, 'reserved');

  const relay = await fetch(`${base}/api/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer local-operator' },
    body: JSON.stringify({ action: 'relay', payload: {} }),
  });
  assert.equal(relay.status, 201);
  assert.equal((await relay.json()).delivered.length, 1);
});
