(function () {
  'use strict';

  var FORM_ID        = 'lp-turnover';
  var PAGE_NAME      = 'Turnover Zero: Como Reduzir o Custo de Rotatividade | YouRH';
  var PAGE_CATEGORY  = 'Landing Page - RH';
  var SESSION_KEY    = 'lead_event_id';
  var SESSION_HASHES = 'lead_user_hashes';

  // ── EVENT ID ──────────────────────────────────────────────────────
  function generateEventId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback para ambientes sem crypto.randomUUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  // ── SHA-256 via Web Crypto API ─────────────────────────────────────
  async function sha256(value) {
    var str = (value || '').trim().toLowerCase();
    var buf = new TextEncoder().encode(str);
    var hashBuf = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hashBuf))
      .map(function (b) { return b.toString(16).padStart(2, '0'); })
      .join('');
  }

  // ── COOKIES (fbp / fbc para Meta CAPI) ───────────────────────────
  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  function trackingCookies() {
    return {
      fbp: getCookie('_fbp') || null,
      fbc: getCookie('_fbc') || null
    };
  }

  // ── BASE PAYLOAD — campos obrigatórios em todos os eventos ────────
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

  // ── PUSH ──────────────────────────────────────────────────────────
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

  // ── FORM STARTED ──────────────────────────────────────────────────
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

  // ── SCROLL DEPTH ──────────────────────────────────────────────────
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

  // ── TIME ON PAGE ──────────────────────────────────────────────────
  function fireTimeOnPage(seconds) {
    var id   = generateEventId();
    var base = basePayload('time_on_page', id);
    base.event                = 'time_on_page';
    base.time_on_page_seconds = seconds;
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

  function initTimeTracking() {
    var elapsed  = 0;
    var interval = setInterval(function () {
      elapsed += 30;
      fireTimeOnPage(elapsed);
    }, 30000);
    window.addEventListener('beforeunload', function () { clearInterval(interval); });
  }

  // ── API PÚBLICA ───────────────────────────────────────────────────
  window.GTMEvents = {
    prepareLead: async function (form) {
      var leadEventId = generateEventId();

      // Salva event_id para ser lido em obrigado.html
      sessionStorage.setItem(SESSION_KEY, leadEventId);

      // Hash de PII — NUNCA expor plain text no dataLayer
      var emailHash = await sha256((form.elements['email'] || {}).value || '');
      var phoneHash = await sha256((form.elements['phone'] || {}).value || '');

      // Salva hashes para o Lead oficial em obrigado.html
      sessionStorage.setItem(SESSION_HASHES, JSON.stringify({
        email: emailHash,
        phone: phoneHash
      }));

      // Sinaliza o submit ao GTM — não é o Lead oficial
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
