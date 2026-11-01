(() => {
  'use strict';
  // Shared app handoff for the email links that normally open the NearBuddy app directly (verify, email-change).
  // This page is only the fallback when the phone did not hand the link to the app: it never completes anything in the
  // browser, never logs the URL or token, and only offers an explicit, package-pinned "Open in NearBuddy" on Android.
  const route = document.body.getAttribute('data-route');
  const params = new URLSearchParams(window.location.search);
  const tokens = params.getAll('token');
  const token = tokens.length === 1 && tokens[0].length > 0 ? tokens[0] : null;
  const status = document.getElementById('handoff-status');
  const openInApp = document.getElementById('open-in-app');
  const show = (message) => { status.textContent = message; };

  if (route !== '/verify' && route !== '/email-change') return;
  if (!token) { show('This link is incomplete. Request a new link in NearBuddy.'); return; }

  if (/Android/i.test(navigator.userAgent)) {
    const fallback = encodeURIComponent(window.location.href);
    openInApp.href = `intent://near-buddy.com${route}?token=${encodeURIComponent(token)}#Intent;scheme=https;package=com.nearbuddy.mobile;S.browser_fallback_url=${fallback};end`;
    openInApp.hidden = false;
    show('Tap the button to continue in the NearBuddy app.');
  } else {
    show('Open this link on an Android device with NearBuddy installed.');
  }
})();
