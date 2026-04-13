/* =====================================================
   YouEduca — main.js  |  Light & Modern B2B SaaS
   ===================================================== */

(function () {
  'use strict';

  /* ── 1. HEADER: scroll state ── */
  function initHeader() {
    var header = document.getElementById('header');
    if (!header) return;
    function update() {
      header.classList.toggle('scrolled', window.pageYOffset > 12);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ── 2. SMOOTH SCROLL ── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = this.getAttribute('href');
        if (id === '#') return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var headerH = (document.getElementById('header') || {}).offsetHeight || 68;
        var top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 12;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ── 3. INTERSECTION OBSERVER — staggered fade-in ── */
  function initFadeIn() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.fade-in').forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -36px 0px' });

    document.querySelectorAll('.fade-in').forEach(function (el, i) {
      // Add staggered delay via inline style for sibling elements
      var parent = el.parentElement;
      if (parent) {
        var siblings = Array.from(parent.querySelectorAll(':scope > .fade-in'));
        var idx = siblings.indexOf(el);
        if (idx > 0 && !el.style.transitionDelay) {
          el.style.transitionDelay = (idx * 0.08) + 's';
        }
      }
      io.observe(el);
    });
  }

  /* ── 4. COUNTER ANIMATION ── */
  function animateCount(el, target, suffix) {
    var duration = 1600;
    var start = null;
    var from = 0;
    var isFloat = String(target).indexOf('.') !== -1;

    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      var val = from + (target - from) * eased;
      el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    var els = document.querySelectorAll('[data-counter]');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) {
        el.textContent = el.dataset.counter + (el.dataset.suffix || '');
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          animateCount(el, parseFloat(el.dataset.counter), el.dataset.suffix || '');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ── 5. PHONE MASK ── */
  function initPhoneMask() {
    var ddd = document.getElementById('ddd');
    var tel = document.getElementById('phone');
    if (ddd) {
      ddd.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 2);
        if (this.value.length === 2 && tel) tel.focus();
      });
    }
    if (tel) {
      tel.addEventListener('input', function () {
        var raw = this.value.replace(/\D/g, '').slice(0, 9);
        if (raw.length <= 8) {
          this.value = raw.replace(/(\d{4})(\d{0,4})/, function (_, a, b) { return b ? a + '-' + b : a; });
        } else {
          this.value = raw.replace(/(\d{5})(\d{0,4})/, function (_, a, b) { return b ? a + '-' + b : a; });
        }
      });
    }
  }

  /* ── 6. FORM VALIDATION ── */
  function initForm() {
    var form = document.getElementById('demo-form');
    if (!form) return;
    var formBody = document.getElementById('form-body');
    var formSuccess = document.getElementById('form-success');

    var rules = {
      'full-name': { fn: function (v) { return v.trim().length >= 3; } },
      'email':     { fn: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); } },
      'ddd':       { fn: function (v) { return /^\d{2}$/.test(v.trim()); } },
      'phone':     { fn: function (v) { return /^\d{8,9}$/.test(v.replace(/\D/g, '')); } },
      'company':   { fn: function (v) { return v.trim().length >= 2; } },
      'employees': { fn: function (v) { return v && v !== ''; } },
      'role':      { fn: function (v) { return v && v !== ''; } },
    };

    function mark(id, invalid) {
      var el = document.getElementById(id);
      if (!el) return;
      var group = el.closest('.form-group');
      el.classList.toggle('error', invalid);
      if (group) group.classList.toggle('has-error', invalid);
    }

    function validate(id) {
      var el = document.getElementById(id);
      if (!el || !rules[id]) return true;
      var ok = rules[id].fn(el.value);
      mark(id, !ok);
      return ok;
    }

    // Live feedback
    Object.keys(rules).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('blur', function () { validate(id); });
      el.addEventListener('input', function () {
        if (el.classList.contains('error')) validate(id);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = Object.keys(rules).map(validate).every(Boolean);

      var cb = document.getElementById('privacy');
      var cbWrap = cb && cb.closest('.form-checkbox');
      if (cb && !cb.checked) {
        valid = false;
        if (cbWrap) { cbWrap.style.outline = '2px solid #EF4444'; cbWrap.style.borderRadius = '6px'; }
      } else if (cbWrap) { cbWrap.style.outline = ''; }

      if (!valid) {
        var first = form.querySelector('.has-error, .error');
        if (first) {
          var top = first.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
        return;
      }

      // Hide form, show success
      if (formBody) formBody.style.display = 'none';
      if (formSuccess) formSuccess.classList.add('visible');
    });
  }

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initSmoothScroll();
    initFadeIn();
    initCounters();
    initPhoneMask();
    initForm();
  });

})();
