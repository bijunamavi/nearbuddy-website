import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { resolveTarget } = require('../create-account/create-account.js');
const html = readFileSync(new URL('../create-account/index.html', import.meta.url), 'utf8');
const links = readFileSync(new URL('../create-account/store-links.js', import.meta.url), 'utf8');
const PLAY = 'https://play.google.com/store/apps/details?id=com.nearbuddy.mobile';
const STORE = 'https://apps.apple.com/app/nearbuddy/id0000000000';
const ANDROID = 'Mozilla/5.0 (Linux; Android 14; SM-A156E) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36';
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148';
const IPAD = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15';
const DESKTOP = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120 Safari/537.36';

test('while the stores do not exist, nobody is sent anywhere', () => {
  assert.match(links, /window\.NEARBUDDY_STORE_LINKS = \{ android: null, ios: null \};/);
  for (const ua of [ANDROID, IPHONE, DESKTOP]) {
    const t = resolveTarget(ua, 0, { android: null, ios: null });
    assert.equal(t.store, null);
    assert.deepEqual(t.stores, []);
  }
  assert.doesNotMatch(html, /href="\/download\.html"|href="https?:\/\/(?!near-buddy\.com)/);
});

test('once the listings exist: Android goes to Google Play, iPhone/iPad to the App Store', () => {
  const both = { android: PLAY, ios: STORE };
  assert.equal(resolveTarget(ANDROID, 5, both).store, PLAY);
  assert.equal(resolveTarget(IPHONE, 5, both).store, STORE);
  assert.equal(resolveTarget(IPAD, 5, both).store, STORE);        // iPadOS reports itself as a Mac with touch
  assert.equal(resolveTarget(ANDROID, 5, both).platform, 'android');
});

test('an Android visitor never gets the App Store link, nor an iPhone the Play link', () => {
  assert.equal(resolveTarget(ANDROID, 5, { android: null, ios: STORE }).store, null);
  assert.equal(resolveTarget(IPHONE, 5, { android: PLAY, ios: null }).store, null);
});

test('desktop visitors are offered whichever store links exist, never a guess', () => {
  assert.deepEqual(resolveTarget(DESKTOP, 0, { android: PLAY, ios: STORE }).stores, [PLAY, STORE]);
  assert.deepEqual(resolveTarget(DESKTOP, 0, { android: PLAY, ios: null }).stores, [PLAY]);
});

test('only the real store hosts over https are accepted; anything else is ignored', () => {
  for (const bad of ['http://play.google.com/store/apps/details?id=x', 'https://evil.example/play', 'https://play.google.com.evil.com/x',
    'https://user@play.google.com/x', 'javascript:alert(1)', '', 5, undefined]) {
    assert.equal(resolveTarget(ANDROID, 5, { android: bad, ios: null }).store, null, String(bad));
  }
  assert.equal(resolveTarget(IPHONE, 5, { android: null, ios: 'https://play.google.com/x' }).store, null);
});

test('the page keeps a strict CSP and carries the honest not-yet-available message', () => {
  assert.match(html, /script-src 'self'/);
  assert.match(html, /NearBuddy is not available in the Google Play Store or the Apple App Store yet/);
  assert.match(html, /id="open-in-app"[^>]+hidden/);
});

test('hidden controls really stay hidden (the shared button style must not override [hidden])', () => {
  const css = readFileSync(new URL('../create-account/create-account.css', import.meta.url), 'utf8');
  assert.match(css, /\[hidden\]\s*\{\s*display:\s*none\s*!important/);
  assert.match(html, /href="create-account\.css"/);
});
