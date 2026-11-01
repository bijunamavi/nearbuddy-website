(() => {
  'use strict';
  // Pure decision: which store (if any) should this visitor be sent to?
  const ANDROID_HOST = 'play.google.com';
  const IOS_HOST = 'apps.apple.com';
  const valid = (value, host) => {
    if (typeof value !== 'string') return null;
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && url.hostname === host && url.username === '' && url.password === '' ? url.href : null;
    } catch { return null; }
  };
  function resolveTarget(userAgent, maxTouchPoints, links) {
    const android = valid(links && links.android, ANDROID_HOST);
    const ios = valid(links && links.ios, IOS_HOST);
    const isAndroid = /Android/i.test(userAgent);
    const isIos = /iPhone|iPad|iPod/i.test(userAgent) || (/Macintosh/i.test(userAgent) && maxTouchPoints > 1);
    if (isAndroid) return { platform: 'android', store: android, stores: [] };
    if (isIos) return { platform: 'ios', store: ios, stores: [] };
    return { platform: 'other', store: null, stores: [android, ios].filter(Boolean) };
  }
  if (typeof module !== 'undefined' && module.exports) { module.exports = { resolveTarget }; return; }

  const target = resolveTarget(navigator.userAgent, navigator.maxTouchPoints || 0, window.NEARBUDDY_STORE_LINKS);
  const status = document.getElementById('store-status');
  const storeButton = document.getElementById('store-button');
  const openInApp = document.getElementById('open-in-app');
  const alsoAndroid = document.getElementById('store-android');
  const alsoIos = document.getElementById('store-ios');

  const live = (value, host) => valid(value, host);
  if (target.store) {
    storeButton.href = target.store;
    storeButton.textContent = target.platform === 'android' ? 'Get NearBuddy on Google Play' : 'Get NearBuddy on the App Store';
    storeButton.hidden = false;
    status.textContent = 'Install NearBuddy, then open it to register.';
  } else if (target.platform === 'other' && target.stores.length > 0) {
    const links = window.NEARBUDDY_STORE_LINKS;
    const a = live(links.android, ANDROID_HOST), i = live(links.ios, IOS_HOST);
    if (a) { alsoAndroid.href = a; alsoAndroid.hidden = false; }
    if (i) { alsoIos.href = i; alsoIos.hidden = false; }
    status.textContent = 'Open this page on your phone, or choose your store below.';
  } else {
    // Not in the stores yet: be honest, show no download button.
    status.textContent = 'NearBuddy is not available in the Google Play Store or the Apple App Store yet. Registration will open in the app as soon as it is released.';
  }

  // Android only: an explicit, package-pinned way to reopen the app that is already installed.
  if (target.platform === 'android') {
    const fallback = target.store ? `;S.browser_fallback_url=${encodeURIComponent(target.store)}` : '';
    openInApp.href = `intent://near-buddy.com/create-account#Intent;scheme=https;package=com.nearbuddy.mobile${fallback};end`;
    openInApp.hidden = false;
  }
})();
