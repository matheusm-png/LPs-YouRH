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
    });
  } else {
    firePageview();
    initFormStarted();
  }

})();
