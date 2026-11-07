import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire as cr } from 'node:module';
import test from 'node:test';

const require = cr(import.meta.url);
const { parse } = require('../referral/referral.js');
const js = readFileSync(new URL('../referral/referral.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../404.html', import.meta.url), 'utf8');

test('/r/<CODE> is recognised exactly: 8 letters/digits, optional trailing slash, upper-cased; nothing else', () => {
  assert.equal(parse('/r/ABCDEFGH'), 'ABCDEFGH');
  assert.equal(parse('/r/abcdefgh/'), 'ABCDEFGH');
  for (const bad of ['/r/ABCDEFG', '/r/ABCDEFGHI', '/r/ABCDEFG!', '/r/', '/x/ABCDEFGH', '/r/ABCDEFGH/extra', '/R/ABCDEFGH']) assert.equal(parse(bad), null, bad);
});
test('the page is a no-script-injection, no-form, no-network fallback with a package-pinned Android intent', () => {
  assert.match(html, /script-src 'self'/);
  assert.match(html, /name="referrer" content="no-referrer"/);
  assert.doesNotMatch(html, /<form|<input|inline/i);
  assert.match(js, /intent:\/\/near-buddy\.com\/r\/\$\{code\}#Intent;scheme=https;package=com\.nearbuddy\.mobile/);
  assert.doesNotMatch(js, /fetch\(|XMLHttpRequest|sendBeacon|innerHTML/);   // the code is never sent anywhere, no HTML injection
  assert.match(html, /id="open-in-app"[^>]+hidden/);
});
test('any other unknown path stays a plain "Page not found"', () => {
  assert.match(html, /<h1 id="handoff-heading">Page not found<\/h1>/);
  assert.match(js, /if \(!code\) \{ return; \}/);
});
