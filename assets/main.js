/* NearBuddy website interactions — vanilla JS, no dependencies, accessibility-first. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- mobile nav ---- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* ---- scroll reveal ---- */
  var revs = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    revs.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    revs.forEach(function (el) { io.observe(el); });
  }

  /* ---- floating gold hearts (decorative; skipped under reduced motion) ---- */
  var HEART = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
  var golds = ['#F6D08A', '#E9B949', '#F2C75C', '#D9A441', '#FFE7A8', '#EFC65B'];
  function seedHearts(host, count) {
    if (reduce) return;
    for (var i = 0; i < count; i++) {
      var span = document.createElement('span');
      var size = 14 + Math.round(Math.random() * 22);
      var left = Math.round(Math.random() * 100);
      var dur = 9 + Math.random() * 10;
      var delay = Math.random() * 12;
      span.innerHTML = HEART;
      var svg = span.firstChild;
      svg.style.width = size + 'px'; svg.style.height = size + 'px';
      svg.style.left = left + '%';
      svg.style.fill = golds[i % golds.length];
      svg.style.animationDuration = dur.toFixed(2) + 's';
      svg.style.animationDelay = (-delay).toFixed(2) + 's';
      host.appendChild(svg);
    }
  }
  document.querySelectorAll('.hearts').forEach(function (h) { seedHearts(h, 14); });

  /* ---- accordions (category + nested Q/A). Only one category open at a time. ---- */
  function toggleItem(item, group, exclusive) {
    var open = item.classList.contains('open');
    if (exclusive && group) {
      group.forEach(function (g) { if (g !== item) { g.classList.remove('open'); var b = g.querySelector(':scope > .cat-head,:scope > .q-head'); if (b) b.setAttribute('aria-expanded', 'false'); } });
    }
    item.classList.toggle('open', !open);
    var btn = item.querySelector(':scope > .cat-head,:scope > .q-head');
    if (btn) btn.setAttribute('aria-expanded', !open ? 'true' : 'false');
  }
  var cats = Array.prototype.slice.call(document.querySelectorAll('.faq-cat'));
  cats.forEach(function (cat) {
    var head = cat.querySelector(':scope > .cat-head');
    if (head) head.addEventListener('click', function () { toggleItem(cat, cats, true); });
    var qas = Array.prototype.slice.call(cat.querySelectorAll('.qa'));
    qas.forEach(function (qa) {
      var qh = qa.querySelector(':scope > .q-head');
      if (qh) qh.addEventListener('click', function () { toggleItem(qa, qas, false); });
    });
  });

  /* ---- header shadow on scroll ---- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.style.boxShadow = window.scrollY > 8 ? '0 8px 24px rgba(20,12,28,.06)' : 'none'; };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }
})();
