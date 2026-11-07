(() => {
  'use strict';
  // /r/<CODE> landing (audit RF-01, 2026-11-07). GitHub Pages serves 404.html for every unknown path, so this one page answers any /r/<CODE> link.
  // It never sends the code anywhere: the Android app opens straight from the link when it is installed (verified app link); this page is the fallback,
  // with an explicit package-pinned "Open in NearBuddy" on Android and an honest "get the app" door for everyone else.
  const CODE = /^\/r\/([0-9A-Za-z]{8})\/?$/;
  const parse = (path) => { const m = CODE.exec(path); return m ? m[1].toUpperCase() : null; };
  if (typeof module !== 'undefined' && module.exports) { module.exports = { parse }; return; }
  const code = parse(window.location.pathname);
  const status = document.getElementById('handoff-status');
  const openInApp = document.getElementById('open-in-app');
  const heading = document.getElementById('handoff-heading');
  const detail = document.getElementById('referral-detail');
  const eyebrow = document.getElementById('referral-eyebrow');
  const download = document.getElementById('get-app');
  if (!code) { return; }                      // any other unknown page keeps the plain "page not found" content
  document.title = 'You are invited to NearBuddy';
  eyebrow.textContent = 'Invitation';
  heading.textContent = 'You are invited to NearBuddy';
  detail.textContent = 'A friend invited you. Open NearBuddy to continue.';
  download.hidden = false;
  if (/Android/i.test(navigator.userAgent)) {
    const fallback = encodeURIComponent(window.location.origin + '/download.html');
    openInApp.href = `intent://near-buddy.com/r/${code}#Intent;scheme=https;package=com.nearbuddy.mobile;S.browser_fallback_url=${fallback};end`;
    openInApp.hidden = false;
    status.textContent = 'Tap the button to continue in the NearBuddy app.';
  } else {
    status.textContent = 'Open this link on an Android phone with NearBuddy installed.';
  }
})();
