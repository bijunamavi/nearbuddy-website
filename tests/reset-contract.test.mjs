import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../reset/index.html', import.meta.url), 'utf8');
const js = readFileSync(new URL('../reset/reset.js', import.meta.url), 'utf8');

test('reset fallback is private, self-contained, and uses the canonical backend', () => {
  assert.match(html, /name="referrer" content="no-referrer"/);
  assert.match(html, /connect-src https:\/\/dkhtjkcygbpomaummdih\.supabase\.co/);
  assert.match(js, /functions\/v1\/auth-reset/);
  assert.match(js, /params\.get\('token'\)/);
  assert.match(js, /JSON\.stringify\(\{ token, password:/);
});

test('missing, invalid, and successful states are explicit', () => {
  assert.match(js, /if \(!token\)/);
  assert.match(js, /invalid, expired, or has already been used/);
  assert.match(js, /Your password has been changed/);
  assert.match(js, /history\.replaceState\(null, '', '\/reset'\)/);
});

test('observability is stage-only and never logs URL or token', () => {
  for (const stage of ['web_reset_loaded','reset_link_received','reset_parsed','reset_submit_started','reset_submit_result']) {
    assert.ok(js.includes(`stage('${stage}')`));
  }
  assert.doesNotMatch(js, /console\.(?:log|info|warn|error)\([^\n]*(?:token|location|href)/i);
});
