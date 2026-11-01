import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const js = readFileSync(new URL('../handoff/handoff.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../handoff/handoff.css', import.meta.url), 'utf8');
for (const [dir, route] of [['verify', '/verify'], ['email-change', '/email-change']]) {
  const html = readFileSync(new URL(`../${dir}/index.html`, import.meta.url), 'utf8');
  test(`${route}: an app-handoff page, not a browser product`, () => {
    assert.match(html, new RegExp(`data-route="${route}"`));
    assert.match(html, /name="referrer" content="no-referrer"/);
    assert.match(html, /script-src 'self'/);
    assert.doesNotMatch(html, /<form|type="password"|<input/i);
    assert.match(html, /id="open-in-app"[^>]+hidden/);
    assert.match(html, /href="\.\.\/handoff\/handoff\.css"/);
  });
}
test('only Android gets an explicit, package-pinned Open in NearBuddy, carrying the same canonical route', () => {
  assert.match(js, /\/Android\/i\.test\(navigator\.userAgent\)/);
  assert.match(js, /intent:\/\/near-buddy\.com\$\{route\}\?token=/);
  assert.match(js, /package=com\.nearbuddy\.mobile/);
});
test('a link without a token is a safe message; the script never completes anything or logs the URL/token', () => {
  assert.match(js, /if \(!token\)/);
  assert.match(js, /This link is incomplete/);
  assert.doesNotMatch(js, /fetch\(|XMLHttpRequest|functions\/v1|console\./);
});
test('hidden controls stay hidden', () => {
  assert.match(css, /\[hidden\]\s*\{\s*display:\s*none\s*!important/);
});
