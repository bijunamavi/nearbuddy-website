// =====================================================================================================================
// LAUNCH SWITCH — store links for the "Register Now" landing page.
//
// NearBuddy is NOT on Google Play or the Apple App Store yet, so both values are intentionally null. While they are
// null this page says plainly that the app is not in the stores yet and shows NO download button — it never sends
// anyone to a wrong or unrelated link.
//
// WHEN THE LISTINGS GO LIVE: replace the null values below with the exact official listing URLs, nothing else needs to
// change (the page then sends Android visitors to Google Play and iPhone/iPad visitors to the App Store):
//   android: 'https://play.google.com/store/apps/details?id=com.nearbuddy.mobile'
//   ios:     'https://apps.apple.com/app/<official NearBuddy listing>'   (the exact URL App Store Connect gives you)
// Only these two hosts are accepted by create-account.js; anything else is ignored.
// =====================================================================================================================
window.NEARBUDDY_STORE_LINKS = { android: null, ios: null };
