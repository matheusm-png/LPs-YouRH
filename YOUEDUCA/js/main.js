/**
 * main.js — YouEduca
 * Intersection Observer, smooth scroll, sticky header,
 * FAQ accordion, contadores animados
 */

(function () {
  'use strict';

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'pageview' });

  // ── SCROLL ANIMATIONS ────────────────────────────────────────────
  function initScrollAnimations() {
    var elements = document.querySelectorAll('.animate-on-scroll');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(function (el) { observer.observe(el); });
  }

  // ── SMOOTH SCROLL ────────────────────────────────────────────────
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      var targetId = anchor.getAttribute('href').slice(1);
      if (!targetId) return;

      var target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      var urgencyBar = document.querySelector('.urgency-bar');
      var siteHeader = document.querySelector('.site-header');
      var urgencyH   = urgencyBar ? urgencyBar.offsetHeight : 0;
      var headerH    = siteHeader ? siteHeader.offsetHeight : 0;
      var offset     = urgencyH + headerH + 16;

      var targetTop = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  }

  // ── STICKY HEADER ────────────────────────────────────────────────
  function initStickyBehavior() {
    var siteHeader = document.querySelector('.site-header');
    if (!siteHeader) return;

    var ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.pageYOffset > 10) {
            siteHeader.classList.add('is-scrolled');
          } else {
            siteHeader.classList.remove('is-scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── FAQ ACCORDION ────────────────────────────────────────────────
  function initFaq() {
    var faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var question = item.querySelector('.faq-question');
      if (!question) return;

      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        faqItems.forEach(function (i) {
          i.classList.remove('is-open');
          var q = i.querySelector('.faq-question');
          if (q) q.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('is-open');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // ── CONTADORES ANIMADOS ──────────────────────────────────────────
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);

          var el       = entry.target;
          var target   = parseInt(el.dataset.count, 10);
          var duration = 1400;
          var start    = null;

          function step(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            var eased    = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString('pt-BR');
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString('pt-BR');
          }

          requestAnimationFrame(step);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) { observer.observe(el); });
  }

  // ── INIT ─────────────────────────────────────────────────────────
  function init() {
    initScrollAnimations();
    initSmoothScroll();
    initStickyBehavior();
    initFaq();
    initCounters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
