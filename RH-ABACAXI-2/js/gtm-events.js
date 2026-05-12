(function () {
  'use strict';

  var FORM_ID = 'lp_rh-abacaxi_conv';

  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function push(payload) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  }

  function firePageview() {
    push({
      event:      'pageview',
      event_id:   uuid(),
      event_name: 'pageview',
      page_url:   window.location.href
    });
  }

  function fireFormStarted() {
    push({
      event:      'form_started',
      event_id:   uuid(),
      event_name: 'form_started',
      form_id:    FORM_ID
    });
  }

  function fireLeadFormSubmit(eventData) {
    push({
      event:      'lead_form_submit',
      event_id:   uuid(),
      event_name: 'lead_form_submit',
      event_data: eventData
    });
  }

  function initFormStarted() {
    var form = document.getElementById(FORM_ID);
    if (!form) return;
    var fired = false;
    var inputs = form.querySelectorAll('input:not([type="hidden"]), select, textarea');
    inputs.forEach(function (el) {
      el.addEventListener('focus', function () {
        if (!fired) {
          fired = true;
          fireFormStarted();
        }
      });
    });
  }

  // ── SCROLL DEPTH ──────────────────────────────────────────────────

  function fireScrollDepth(percentage) {
    push({
      event:             'scroll_depth',
      event_id:          uuid(),
      event_name:        'scroll_depth',
      scroll_percentage: percentage,
      page_url:          window.location.href
    });
  }

  function initScrollTracking() {
    var milestones = { 25: false, 50: false, 75: false, 100: false };
    var ticking = false;

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
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(checkScroll);
      }
    }, { passive: true });
  }

  // ── TIME ON PAGE ───────────────────────────────────────────────────

  function fireTimeOnPage(seconds) {
    push({
      event:                'time_on_page',
      event_id:             uuid(),
      event_name:           'time_on_page',
      time_on_page_seconds: seconds,
      page_url:             window.location.href
    });
  }

  function initTimeTracking() {
    var elapsed = 0;
    var interval = setInterval(function () {
      elapsed += 30;
      fireTimeOnPage(elapsed);
    }, 30000);

    window.addEventListener('beforeunload', function () {
      clearInterval(interval);
    });
  }

  // API pública — chamada por form.js após validação aprovada
  window.GTMEvents = {
    fireLeadFormSubmit: function (form) {
      fireLeadFormSubmit({
        nome:        (form.elements['name']         || {}).value || '',
        email:       (form.elements['email']        || {}).value || '',
        telefone:    (form.elements['phone']        || {}).value || '',
        empresa:     (form.elements['company']      || {}).value || '',
        site:        (form.elements['site']         || {}).value || '',
        cargo:       (form.elements['role']         || {}).value || '',
        funcionarios:(form.elements['employees']    || {}).value || '',
        pessoas_rh:  (form.elements['rh_team_size'] || {}).value || '',
        form_id:     FORM_ID
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      firePageview();
      initFormStarted();
      initScrollTracking();
      initTimeTracking();
    });
  } else {
    firePageview();
    initFormStarted();
    initScrollTracking();
    initTimeTracking();
  }

})();
