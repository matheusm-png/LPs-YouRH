(function () {
  'use strict';

  var SESSION_KEY    = 'lead_event_id';
  var SESSION_HASHES = 'lead_user_hashes';

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  function push(payload) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  }

  function fireLead() {
    var urlParams   = new URLSearchParams(window.location.search);
    var leadEventId = urlParams.get('event_id') || sessionStorage.getItem(SESSION_KEY);
    if (!leadEventId) return;

    var hashes = {};
    try {
      var raw = sessionStorage.getItem(SESSION_HASHES);
      if (raw) hashes = JSON.parse(raw);
    } catch (e) {}

    var payload = {
      event:        'Lead',
      event_id:     leadEventId,
      event_name:   'Lead',
      content_name: 'lp-gestao-quebrada-2',
      page_url:     window.location.href,
      timestamp:    Math.floor(Date.now() / 1000),
      user_data: {
        email:        hashes.email || null,
        phone_number: hashes.phone || null
      }
    };

    var fbp = getCookie('_fbp');
    var fbc = getCookie('_fbc');
    if (fbp) payload.fbp = fbp;
    if (fbc) payload.fbc = fbc;

    push(payload);

    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_HASHES);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fireLead);
  } else {
    fireLead();
  }
})();
