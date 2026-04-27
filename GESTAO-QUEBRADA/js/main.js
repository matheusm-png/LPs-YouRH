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

  // Performance: Mostrar elementos ocultos para evitar FOUC
  document.querySelectorAll('.no-fouc').forEach(function(el) { el.classList.remove('no-fouc'); });
  var hiddenGeos = document.querySelectorAll('.glass-crack-overlay, .hero__geo');
  hiddenGeos.forEach(function(el) { el.style.visibility = 'visible'; });

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
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
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
    var items = document.querySelectorAll('.proof-item');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) return;

    function startCount(el) {
      // Trava a largura do span no valor final ANTES de zerar o texto,
      // impedindo reflow/layout-shift no resto da página durante a animação.
      el.style.display  = 'inline-block';
      el.style.minWidth = el.offsetWidth + 'px';

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
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);

          var item     = entry.target;
          var counters = Array.prototype.slice.call(item.querySelectorAll('[data-count]'));
          if (!counters.length) return;

          function runAll() { counters.forEach(startCount); }

          // Se o card já está visível (reduced-motion ou já animou), conta imediatamente.
          // Caso contrário, aguarda o fim da transição de opacidade para não animar invisível.
          if (item.classList.contains('is-visible')) {
            runAll();
          } else {
            var fallback = setTimeout(runAll, 700);

            item.addEventListener('transitionend', function onEnd(e) {
              if (e.propertyName !== 'opacity') return;
              item.removeEventListener('transitionend', onEnd);
              clearTimeout(fallback);
              runAll();
            });
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
    );

    items.forEach(function (item) { observer.observe(item); });
  }

  // ── GLASS CRACK — scroll bloqueado até animação terminar ─────

  function initGlassCrack() {
    var overlay = document.querySelector('.glass-crack-overlay');
    if (!overlay) return;

    var lines  = Array.prototype.slice.call(overlay.querySelectorAll('.crack-line'));
    var shards = Array.prototype.slice.call(overlay.querySelectorAll('.crack-shard'));
    var impact = overlay.querySelector('.crack-impact');

    lines.forEach(function (line) {
      var len = line.getTotalLength ? Math.ceil(line.getTotalLength()) + 20 : 2800;
      line.style.strokeDasharray  = len;
      line.style.strokeDashoffset = len;
      line._len   = len;
      line._delay = parseFloat(line.getAttribute('data-delay') || 0);
    });

    var progress  = 0;
    var unlocked  = false;
    var unlocking = false;

    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function render(p) {
      if (p <= 0) {
        if (overlay.style.opacity !== '0') overlay.style.opacity = '0';
        return;
      }
      if (overlay.style.opacity !== '1') overlay.style.opacity = '1';

      if (impact) {
        var ip = Math.min(1, p * 5);
        var impactOpacity = ip < 0.6 ? ip / 0.6 : Math.max(0, 1 - (ip - 0.6) / 0.4);
        impact.style.opacity = impactOpacity;
      }

      // Batch reads from data attributes once, or use pre-calculated values
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (!line._delay) {
          line._delay = parseFloat(line.getAttribute('data-delay') || 0);
        }
        var lp = line._delay >= 1 ? 0 : Math.max(0, Math.min(1, (p - line._delay) / (1 - line._delay)));
        line.style.strokeDashoffset = line._len * (1 - easeOut(lp));
      }

      var sp = Math.max(0, Math.min(1, (p - 0.45) / 0.55));
      if (shards.length > 0 && shards[0].style.opacity != sp) {
        for (var j = 0; j < shards.length; j++) {
          shards[j].style.opacity = sp;
        }
      }
    }

    function lockScroll() {
      var bar = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.overflow = 'hidden';
      if (bar > 0) document.body.style.paddingRight = bar + 'px';
    }

    function unlockScroll() {
      if (unlocked) return;
      unlocked = true;
      document.documentElement.style.overflow = '';
      document.body.style.paddingRight = '';
      window.removeEventListener('wheel',      onWheel,      false);
      window.removeEventListener('touchstart', onTouchStart, false);
      window.removeEventListener('touchmove',  onTouchMove,  false);
    }

    function onComplete() {
      if (unlocking) return;
      unlocking = true;
      // Pausa curta para o usuário ver a tela completamente quebrada
      setTimeout(unlockScroll, 180);
    }

    function advance(delta) {
      progress = Math.max(0, Math.min(1, progress + delta));
      render(progress);
      if (progress >= 1) onComplete();
    }

    function onWheel(e) {
      if (unlocked) return;
      e.preventDefault();
      advance(e.deltaY / 380);
    }

    var touchY = 0;
    function onTouchStart(e) { touchY = e.touches[0].clientY; }
    function onTouchMove(e) {
      if (unlocked) return;
      var dy = touchY - e.touches[0].clientY;
      touchY = e.touches[0].clientY;
      if (dy > 0) e.preventDefault();
      advance(dy / 200);
    }

    lockScroll();
    render(0);

    window.addEventListener('wheel',      onWheel,      { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true  });
    window.addEventListener('touchmove',  onTouchMove,  { passive: false });
  }

  // ── INIT ──────────────────────────────────────────────────────

  function init() {
    initScrollAnimations();
    initSmoothScroll();
    initStickyBehavior();
    initFaq();
    animateCounters();
    initGlassCrack();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
