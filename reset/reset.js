(() => {
  'use strict';
  const stage = (name) => console.info('[password-reset-stage]', name);
  stage('web_reset_loaded');

  const params = new URLSearchParams(window.location.search);
  const tokens = params.getAll('token');
  const token = tokens.length === 1 && tokens[0].length > 0 ? tokens[0] : null;
  const status = document.getElementById('reset-status');
  const openInApp = document.getElementById('open-in-app');

  const show = (message) => {
    status.textContent = message;
  };

  if (!token) {
    show('This reset link is incomplete. Request a new password-reset link in NearBuddy.');
    return;
  }
  stage('reset_link_received');
  stage('reset_parsed');

  // Explicit user gesture only: never auto-open the app. The package-pinned Android
  // intent carries the same canonical HTTPS URL/token, and returns to this exact web
  // page when the app is unavailable. Other platforms keep the control hidden.
  if (/Android/i.test(navigator.userAgent)) {
    const fallback = encodeURIComponent(window.location.href);
    openInApp.href = `intent://near-buddy.com/reset?token=${encodeURIComponent(token)}#Intent;scheme=https;package=com.nearbuddy.mobile;S.browser_fallback_url=${fallback};end`;
    openInApp.hidden = false;
  } else {
    show('Open this link on an Android device with NearBuddy installed.');
  }
})();
