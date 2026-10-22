(() => {
  'use strict';
  const ENDPOINT = 'https://dkhtjkcygbpomaummdih.supabase.co/functions/v1/auth-reset';
  const stage = (name) => console.info('[password-reset-stage]', name);
  stage('web_reset_loaded');

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const form = document.getElementById('reset-form');
  const password = document.getElementById('password');
  const confirm = document.getElementById('confirm');
  const submit = document.getElementById('reset-submit');
  const status = document.getElementById('reset-status');
  let submitted = false;

  const show = (message, success = false) => {
    status.textContent = message;
    status.classList.toggle('success', success);
  };

  if (!token) {
    form.hidden = true;
    show('This reset link is incomplete. Request a new password-reset link in NearBuddy.');
    return;
  }
  stage('reset_link_received');
  stage('reset_parsed');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitted) return;
    if (password.value.length < 6 || password.value.length > 128) {
      show('Use a password between 6 and 128 characters.');
      return;
    }
    if (password.value !== confirm.value) {
      show('The passwords do not match.');
      return;
    }
    submitted = true;
    submit.disabled = true;
    password.disabled = true;
    confirm.disabled = true;
    show('Changing your password…');
    stage('reset_submit_started');
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token, password: password.value, commitId: crypto.randomUUID() }),
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
      });
      const body = await response.json().catch(() => ({}));
      stage('reset_submit_result');
      if (!response.ok || body.ok !== true) {
        submitted = false;
        submit.disabled = false;
        password.disabled = false;
        confirm.disabled = false;
        show(response.status === 409
          ? 'This reset link is invalid, expired, or has already been used. Request a new link in NearBuddy.'
          : 'We could not change your password right now. Please try again.');
        return;
      }
      form.querySelectorAll('label,input,button').forEach((node) => { node.hidden = true; });
      show('Your password has been changed. You can now return to NearBuddy and log in.', true);
      history.replaceState(null, '', '/reset');
    } catch {
      stage('reset_submit_result');
      submitted = false;
      submit.disabled = false;
      password.disabled = false;
      confirm.disabled = false;
      show('Check your connection and try again.');
    }
  });
})();
