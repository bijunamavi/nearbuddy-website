# NearBuddy Website — static build (v1)

A production-clean, 14-page static website for NearBuddy, built on the approved
"It's a Match!" visual language and containing only the approved canonical content
(from `NEARBUDDY_STITCH_CONTENT_BUNDLE_v1_FINAL`). No external dependencies:
no CDN, no third-party fonts, no remote images, no analytics/trackers.

## Pages (14)
index.html (Home) · about.html · privacy.html · data.html · terms.html ·
payments.html · refunds.html · deletion.html · community.html · child-safety.html ·
safety.html · help.html (Help & FAQ) · contact.html · download.html
(plus delete-account.html — a copy of the Account Deletion page so the canonical
https://near-buddy.com/delete-account URL resolves.)

## Preview locally
From this folder:

    python3 -m http.server 8080

then open http://localhost:8080

## Deploy to GitHub Pages (zero recurring cost — owner-locked plan)
1. Create/choose the site repository and push the contents of this folder to it.
2. In the repo, Settings → Pages → deploy from the branch root (`/`).
3. For the custom domain near-buddy.com, keep the included `CNAME` file and point
   DNS as GitHub instructs. Remove `CNAME` if you are not using the custom domain yet.
4. `.nojekyll` is included so the `assets/` folder is served as-is.
Publish the APK separately via GitHub Releases, as per the blueprint.

## Notes
- Fonts: the CSS uses a system font stack that mirrors the intended Epilogue /
  Plus Jakarta Sans character with zero third-party requests. To use the exact
  brand fonts, drop `Epilogue.woff2` and `PlusJakartaSans.woff2` into
  `assets/fonts/` and uncomment the `@font-face` block at the top of
  `assets/styles.css`. (Self-host only — do not add a Google Fonts link, to keep
  the site tracker-free.)
- Logo: the header/footer show the NearBuddy wordmark as styled text with a gold
  heart mark. Replace with a real logo image later if desired (no fabricated logo
  image is shipped).
- Animations respect `prefers-reduced-motion` (floating hearts and large motion are
  disabled for users who ask for reduced motion).
- Effective / "Last Updated" dates on each policy page read as their approved basis
  (e.g. "the date this policy is first published on the official website"); no fixed
  date is invented.
