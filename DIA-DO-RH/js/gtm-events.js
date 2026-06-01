(function () {
  'use strict';

  var FORM_ID        = 'lp-dia-do-rh';
  var PAGE_NAME      = 'Dia do RH: Autodiagnóstico de Maturidade | YouRH';
  var PAGE_CATEGORY  = 'Landing Page - RH';
  var SESSION_KEY    = 'lead_event_id';
  var SESSION_HASHES = 'lead_user_hashes';

  function generateEventId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  async function sha256(value) {
    var str = (value || '').trim().toLowerCase();
    var buf = new TextEncoder().encode(str);
    var hashBuf = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hashBuf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  }

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  function trackingCookies() {
    return { fbp: getCookie('_fbp') || null, fbc: getCookie('_fbc') || null };
  }

  function basePayload(eventName, eventId) {
    var cookies = trackingCookies();
    var payload = { event_name: eventName, event_id: eventId, page_url: window.location.href, timestamp: Math.floor(Date.now() / 1000) };
    if (cookies.fbp) payload.fbp = cookies.fbp;
    if (cookies.fbc) payload.fbc = cookies.fbc;
    return payload;
  }

  function push(payload) { window.dataLayer = window.dataLayer || []; window.dataLayer.push(payload); }

  function firePageview() {
    var id = generateEventId();
    var base = basePayload('PageView', id);
    base.event = 'PageView'; base.content_name = PAGE_NAME; base.content_category = PAGE_CATEGORY;
    push(base);
  }

  function fireFormStarted() {
    var id = generateEventId();
    var base = basePayload('form_started', id);
    base.event = 'form_started'; base.form_id = FORM_ID;
    push(base);
  }

  function initFormStarted() {
    var form = document.getElementById(FORM_ID);
    if (!form) return;
    var fired = false;
    form.querySelectorAll('input:not([type="hidden"]), select, textarea').forEach(function (el) {
      el.addEventListener('focus', function () { if (!fired) { fired = true; fireFormStarted(); } });
    });
  }

  function fireTimeOnPage(seconds) {
    var id = generateEventId();
    var base = basePayload('time_on_page', id);
    base.event = 'time_on_page'; base.time_on_page_seconds = seconds;
    push(base);
  }

  function initTimeTracking() {
    var elapsed = 0;
    var interval = setInterval(function () { elapsed += 30; fireTimeOnPage(elapsed); }, 30000);
    window.addEventListener('beforeunload', function () { clearInterval(interval); });
  }

  window.GTMEvents = {
    prepareLead: async function (form) {
      var leadEventId = generateEventId();
      sessionStorage.setItem(SESSION_KEY, leadEventId);
      var emailHash = await sha256((form.elements['email'] || {}).value || '');
      var phoneHash = await sha256((form.elements['phone'] || {}).value || '');
      sessionStorage.setItem(SESSION_HASHES, JSON.stringify({ email: emailHash, phone: phoneHash }));
      var base = basePayload('lead_pending', leadEventId);
      base.event = 'lead_pending'; base.content_name = FORM_ID;
      base.user_data = { email: emailHash, phone_number: phoneHash };
      push(base);
      return leadEventId;
    },
    // Método para disparar o Lead sem precisar mudar de página, com os hashes que já foram criados
    fireLeadNow: function() {
      var leadEventId = sessionStorage.getItem(SESSION_KEY);
      if (!leadEventId) return;

      var hashes = {};
      try { var raw = sessionStorage.getItem(SESSION_HASHES); if (raw) hashes = JSON.parse(raw); } catch (e) {}

      var payload = {
        event:        'Lead',
        event_id:     leadEventId,
        event_name:   'Lead',
        content_name: FORM_ID,
        page_url:     window.location.href,
        timestamp:    Math.floor(Date.now() / 1000),
        user_data:    { email: hashes.email || null, phone_number: hashes.phone || null }
      };

      var cookies = trackingCookies();
      if (cookies.fbp) payload.fbp = cookies.fbp;
      if (cookies.fbc) payload.fbc = cookies.fbc;

      push(payload);
    }
  };

  function boot() {
    firePageview();
    initFormStarted();
    initTimeTracking();
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', boot); } else { boot(); }
})();
