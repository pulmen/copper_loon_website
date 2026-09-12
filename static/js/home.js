/* Copper Loon — minimal homepage JS */
(function () {
  'use strict';

  var toggle = document.getElementById('nav-toggle');
  var mobileNav = document.getElementById('nav-mobile');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    mobileNav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var mq = window.matchMedia('(min-width: 1051px)');
  function onBreakpoint(e) {
    if (e.matches && mobileNav) {
      mobileNav.classList.remove('open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
  }
  if (mq.addEventListener) mq.addEventListener('change', onBreakpoint);
  else if (mq.addListener) mq.addListener(onBreakpoint);


  /* --- Fixed-header aware in-page navigation --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (!href || href === '#') return;

      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      if (mobileNav) {
        mobileNav.classList.remove('open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }

      var header = document.querySelector('.site-header');
      var headerHeight = header ? header.getBoundingClientRect().height : 0;

      /* The demo CTA benefits from a little less top offset so the
         launch button and reassurance line sit clearly in view. */
      var extraGap = href === '#demo' ? 18 : 14;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - extraGap;

      window.scrollTo({
        top: Math.max(0, top),
        behavior: 'smooth'
      });

      if (history.pushState) {
        history.pushState(null, '', href);
      }
    });
  });

  var lightbox = document.getElementById('gallery-lightbox');
  var lbImg = document.getElementById('lightbox-img');
  var lbCaption = document.getElementById('lightbox-caption');
  var lbClose = document.getElementById('lightbox-close');
  var lbBackdrop = document.getElementById('lightbox-backdrop');
  var lastFocused = null;

  function openLightbox(src, alt, caption) {
    if (!lightbox || !lbImg) return;
    lbImg.src = src;
    lbImg.alt = alt || '';
    lbCaption.textContent = caption || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lastFocused = document.activeElement;
    if (lbClose) lbClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    lbImg.src = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('.gallery-item').forEach(function (item) {
    item.addEventListener('click', function () {
      var img = item.querySelector('img');
      var caption = item.querySelector('figcaption');
      if (img) openLightbox(img.src, img.alt, caption ? caption.textContent : '');
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox();
  });
})();