import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../reset/index.html', import.meta.url), 'utf8');
const js = readFileSync(new URL('../reset/reset.js', import.meta.url), 'utf8');

test('reset URL is a private app handoff and not a browser reset product', () => {
  assert.match(html, /name="referrer" content="no-referrer"/);
  assert.doesNotMatch(html, /type="password"|Change password|<form/i);
  assert.doesNotMatch(js, /functions\/v1\/auth-reset|fetch\(|commitId|reset_submit/);
  assert.match(html, /Password reset continues securely in the NearBuddy mobile app/);
});

test('missing token is a safe recovery message, not a browser form', () => {
  assert.match(js, /if \(!token\)/);
  assert.match(js, /This reset link is incomplete/);
});

test('observability is stage-only and never logs URL or token', () => {
  for (const stage of ['web_reset_loaded','reset_link_received','reset_parsed']) {
    assert.ok(js.includes(`stage('${stage}')`));
  }
  assert.doesNotMatch(js, /console\.(?:log|info|warn|error)\([^\n]*(?:token|location|href)/i);
});

test('Android can explicitly reopen the same canonical reset in the pinned app', () => {
  assert.match(html, /id="open-in-app"[^>]+hidden>Open in NearBuddy/);
  assert.match(js, /\/Android\/i\.test\(navigator\.userAgent\)/);
  assert.match(js, /intent:\/\/near-buddy\.com\/reset\?token=/);
  assert.match(js, /scheme=https;package=com\.nearbuddy\.mobile/);
  assert.match(js, /S\.browser_fallback_url=\$\{fallback\}/);
  assert.match(js, /openInApp\.hidden = false/);
  assert.doesNotMatch(js, /window\.location\s*=|location\.replace\(|location\.assign\(/);
});
