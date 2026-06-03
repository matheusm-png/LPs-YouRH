/**
 * main.js
 * Inicialização geral, Intersection Observer, smooth scroll,
 * sticky bar e accordion FAQ
 */

(function () {
  'use strict';

  // PIXEL META: pageview disparado aqui via dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'pageview' });

  // ── INTERSECTION OBSERVER — Animações de scroll ───────────────

  function initScrollAnimations() {
    var elements = document.querySelectorAll('.animate-on-scroll');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: torna tudo visível imediatamente
      elements.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Anima apenas uma vez
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(function (el) { observer.observe(el); });
  }

  // ── SMOOTH SCROLL para âncoras ────────────────────────────────

  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      var targetId = anchor.getAttribute('href').slice(1);
      if (!targetId) return;

      var target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      var urgencyBar  = document.querySelector('.urgency-bar');
      var siteHeader  = document.querySelector('.site-header');
      var urgencyH    = urgencyBar  ? urgencyBar.offsetHeight  : 0;
      var headerH     = siteHeader  ? siteHeader.offsetHeight  : 0;
      var offset      = urgencyH + headerH + 16;

      var targetTop = target.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  }

  // ── STICKY BAR — some ao descer, volta ao subir ───────────────

  function initStickyBehavior() {
    var urgencyBar = document.querySelector('.urgency-bar');
    var siteHeader = document.querySelector('.site-header');
    if (!urgencyBar && !siteHeader) return;

    var lastScrollY   = window.pageYOffset;
    var ticking       = false;
    var SCROLL_DELTA  = 8;   // Sensibilidade mínima (px)
    var SCROLL_OFFSET = 120; // Começa a esconder após X px de scroll

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var currentY = window.pageYOffset;
          var delta    = currentY - lastScrollY;

          // Urgency bar sempre visível

          // Sombra no header ao scrollar
          if (siteHeader) {
            if (currentY > 10) {
              siteHeader.classList.add('is-scrolled');
            } else {
              siteHeader.classList.remove('is-scrolled');
            }
          }

          lastScrollY = currentY;
          ticking     = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── FAQ — Accordion ───────────────────────────────────────────

  function initFaq() {
    var faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var question = item.querySelector('.faq-question');
      if (!question) return;

      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        // Fecha todos
        faqItems.forEach(function (i) {
          i.classList.remove('is-open');
          var q = i.querySelector('.faq-question');
          if (q) q.setAttribute('aria-expanded', 'false');
        });

        // Abre o clicado (se estava fechado)
        if (!isOpen) {
          item.classList.add('is-open');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // ── CONTADORES ANIMADOS (Proof section) ───────────────────────

  function animateCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) return;

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
            var eased    = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            el.textContent = Math.floor(eased * target).toLocaleString('pt-BR');
            if (progress < 1) requestAnimationFrame(step);
          }

          requestAnimationFrame(step);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) { observer.observe(el); });
  }

  // ── CALCULADORA DE CUSTO DE TURNOVER ─────────────────────────

  function initCalculator() {
    var empEl   = document.getElementById('calc-employees');
    var salEl   = document.getElementById('calc-salary');
    var rateEl  = document.getElementById('calc-rate');
    var lostEl  = document.getElementById('calc-lost');
    var perEl   = document.getElementById('calc-per');
    var totalEl = document.getElementById('calc-total');

    if (!empEl || !salEl || !rateEl) return;

    function fmtBRL(n) {
      return 'R$ ' + Math.round(n).toLocaleString('pt-BR');
    }

    function parseSalary(s) {
      // Aceita "3.500" ou "3500" ou "3,500"
      var clean = s.replace(/\./g, '').replace(',', '.');
      return parseFloat(clean) || 0;
    }

    function reset() {
      lostEl.textContent  = 'preencha os campos';
      lostEl.classList.add('calc-empty');
      perEl.textContent   = '—';
      totalEl.textContent = '—';
    }

    function calculate() {
      var employees = parseInt(empEl.value)        || 0;
      var salary    = parseSalary(salEl.value);
      var rate      = parseFloat(rateEl.value)     || 0;

      if (!employees || !salary || !rate) { reset(); return; }

      var annualSalary    = salary * 12;
      var costPerEmployee = annualSalary * 1.5;       // modelo Gallup 150%
      var lost            = Math.ceil(employees * (rate / 100));
      var totalCost       = lost * costPerEmployee;

      lostEl.textContent  = lost + (lost === 1 ? ' colaborador' : ' colaboradores');
      lostEl.classList.remove('calc-empty');
      perEl.textContent   = fmtBRL(costPerEmployee);
      totalEl.textContent = fmtBRL(totalCost);
    }

    // Máscara simples de moeda no campo salário
    salEl.addEventListener('input', function () {
      var raw = this.value.replace(/\D/g, '');
      if (raw) {
        this.value = parseInt(raw, 10).toLocaleString('pt-BR');
      }
      calculate();
    });

    empEl.addEventListener('input', calculate);
    rateEl.addEventListener('input', calculate);
  }

  // ── INIT ──────────────────────────────────────────────────────

  function init() {
    initScrollAnimations();
    initSmoothScroll();
    initStickyBehavior();
    initFaq();
    animateCounters();
    initCalculator();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
