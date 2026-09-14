import test from 'node:test';
import assert from 'node:assert/strict';
import { cursorFailure, ModelTransportError, publicModelFailure } from '../product/model-errors.mjs';

test('Cursor terminal quota failure is actionable without relaying provider text', () => {
  const error = cursorFailure({ message: "private-key: You're out of usage. Switch to Auto or Composer 2.5" });
  assert.equal(error.code, 'MODEL_QUOTA');
  assert.ok(!error.message.includes('private-key'));
  assert.ok(!error.message.includes('Composer'));
});

test('authentication, network and unavailable models have fixed public errors', () => {
  for (const [input, code] of [[{ name: 'AuthenticationError' }, 'MODEL_AUTH'], [{ status: 429 }, 'MODEL_QUOTA'],
    [{ name: 'NetworkError' }, 'MODEL_NETWORK'], [new ModelTransportError('MODEL_UNAVAILABLE'), 'MODEL_UNAVAILABLE']]) {
    assert.equal(cursorFailure(input).code, code);
  }
  assert.equal(cursorFailure({ message: 'private stack or credential' }).code, 'MODEL_FAILED');
});

test('arbitrary error codes and messages are not trusted by the product pipeline', () => {
  const result = publicModelFailure({ code: 'MODEL_AUTH', message: 'secret' });
  assert.equal(result.code, 'MODEL_FAILED');
  assert.ok(!result.message.includes('secret'));
  assert.equal(new ModelTransportError('secret').code, 'MODEL_FAILED');
});
