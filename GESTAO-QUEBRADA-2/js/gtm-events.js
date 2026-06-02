(function () {
  'use strict';

  var FORM_ID        = 'lp-gestao-quebrada-2';
  var PAGE_NAME      = 'Gestão Quebrada | YouRH';
  var PAGE_CATEGORY  = 'Landing Page - RH';
  var SESSION_KEY    = 'lead_event_id';
  var SESSION_HASHES = 'lead_user_hashes';

  // ── EVENT ID ──────────────────────────────────────────────────────
  function generateEventId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  // ── SHA-256 (PII nunca em plain text no dataLayer) ─────────────────
  async function sha256(value) {
    var str     = (value || '').trim().toLowerCase();
    var buf     = new TextEncoder().encode(str);
    var hashBuf = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hashBuf))
      .map(function (b) { return b.toString(16).padStart(2, '0'); })
      .join('');
  }

  // ── COOKIES META (_fbp / _fbc) ────────────────────────────────────
  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  function trackingCookies() {
    return { fbp: getCookie('_fbp') || null, fbc: getCookie('_fbc') || null };
  }

  // ── BASE PAYLOAD ──────────────────────────────────────────────────
  function basePayload(eventName, eventId) {
    var cookies = trackingCookies();
    var payload = {
      event_name: eventName,
      event_id:   eventId,
      page_url:   window.location.href,
      timestamp:  Math.floor(Date.now() / 1000)
    };
    if (cookies.fbp) payload.fbp = cookies.fbp;
    if (cookies.fbc) payload.fbc = cookies.fbc;
    return payload;
  }

  function push(payload) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  }

  // ── PAGEVIEW ──────────────────────────────────────────────────────
  function firePageview() {
    var id   = generateEventId();
    var base = basePayload('PageView', id);
    base.event            = 'PageView';
    base.content_name     = PAGE_NAME;
    base.content_category = PAGE_CATEGORY;
    push(base);
  }

  // ── FORM STARTED (dispara uma vez no primeiro foco) ───────────────
  function fireFormStarted() {
    var id   = generateEventId();
    var base = basePayload('form_started', id);
    base.event   = 'form_started';
    base.form_id = FORM_ID;
    push(base);
  }

  function initFormStarted() {
    var form = document.getElementById(FORM_ID);
    if (!form) return;
    var fired  = false;
    var inputs = form.querySelectorAll('input:not([type="hidden"]), select, textarea');
    inputs.forEach(function (el) {
      el.addEventListener('focus', function () {
        if (!fired) { fired = true; fireFormStarted(); }
      });
    });
  }

  // ── SCROLL DEPTH (25 / 50 / 75 / 100%) ───────────────────────────
  function fireScrollDepth(percentage) {
    var id   = generateEventId();
    var base = basePayload('ViewContent', id);
    base.event             = 'ViewContent';
    base.content_name      = PAGE_NAME;
    base.content_category  = PAGE_CATEGORY;
    base.value             = percentage;
    base.currency          = 'BRL';
    base.scroll_percentage = percentage;
    push(base);
  }

  function initScrollTracking() {
    var milestones = { 25: false, 50: false, 75: false, 100: false };
    var ticking    = false;
    function checkScroll() {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      var pct = (window.scrollY / scrollable) * 100;
      [25, 50, 75, 100].forEach(function (mark) {
        if (!milestones[mark] && pct >= mark) {
          milestones[mark] = true;
          fireScrollDepth(mark);
        }
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(checkScroll); }
    }, { passive: true });
  }

  // ── TIME ON PAGE (a cada 30s) ─────────────────────────────────────
  function fireTimeOnPage(seconds) {
    var id   = generateEventId();
    var base = basePayload('time_on_page', id);
    base.event                = 'time_on_page';
    base.time_on_page_seconds = seconds;
    push(base);
  }

  function initTimeTracking() {
    var elapsed  = 0;
    var interval = setInterval(function () {
      elapsed += 30;
      fireTimeOnPage(elapsed);
    }, 30000);
    window.addEventListener('beforeunload', function () { clearInterval(interval); });
  }

  // ── PREPARE LEAD (chamado pelo form.js no submit) ─────────────────
  window.GTMEvents = {
    getCookie: getCookie,
    prepareLead: async function (form) {
      var leadEventId = generateEventId();

      sessionStorage.setItem(SESSION_KEY, leadEventId);

      var emailHash = await sha256((form.elements['email'] || {}).value || '');
      var phoneHash = await sha256((form.elements['phone'] || {}).value || '');

      sessionStorage.setItem(SESSION_HASHES, JSON.stringify({
        email: emailHash,
        phone: phoneHash
      }));

      var base = basePayload('lead_pending', leadEventId);
      base.event        = 'lead_pending';
      base.content_name = FORM_ID;
      base.user_data    = { email: emailHash, phone_number: phoneHash };
      push(base);

      return leadEventId;
    }
  };

  // ── INIT ──────────────────────────────────────────────────────────
  function boot() {
    firePageview();
    initFormStarted();
    initScrollTracking();
    initTimeTracking();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
