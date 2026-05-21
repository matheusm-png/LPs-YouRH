/**
 * form.js
 * Validação em tempo real, máscara telefone BR e submit com preparação de Lead.
 * O envio ao RD Station é feito pelo script loader oficial (corpo da página).
 * Os UTMs são persistidos em localStorage e injetados nos campos hidden antes do submit.
 * O Lead oficial dispara em obrigado.html — aqui apenas lead_pending via GTMEvents.prepareLead().
 */

(function () {
  'use strict';

  var UTM_STORAGE_KEY = 'yourh_utm_params';
  var UTM_EXPIRY_MS   = 30 * 24 * 60 * 60 * 1000; // 30 dias
  var UTM_KEYS        = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_marketing_tactic'];

  // ── UTM PERSISTENCE ──────────────────────────────────────────────
  function readUtmsFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var utms   = {};
    var hasAny = false;
    UTM_KEYS.forEach(function (k) {
      var val = params.get(k);
      if (val && val.trim()) { utms[k] = val.trim().toLowerCase(); hasAny = true; }
    });
    return hasAny ? utms : null;
  }

  function saveUtms(utms) {
    try {
      localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify({
        data:    utms,
        expires: Date.now() + UTM_EXPIRY_MS
      }));
    } catch (e) {}
  }

  function loadUtms() {
    try {
      var raw = localStorage.getItem(UTM_STORAGE_KEY);
      if (!raw) return null;
      var stored = JSON.parse(raw);
      if (!stored || Date.now() > stored.expires) {
        localStorage.removeItem(UTM_STORAGE_KEY);
        return null;
      }
      return stored.data || null;
    } catch (e) {
      return null;
    }
  }

  var _utms = (function () {
    var fromUrl = readUtmsFromUrl();
    if (fromUrl) { saveUtms(fromUrl); return fromUrl; }
    return loadUtms() || {};
  })();

  function populateHiddenUtmFields(form) {
    UTM_KEYS.forEach(function (k) {
      var el = form.querySelector('#' + k);
      if (el && _utms[k]) el.value = _utms[k];
    });
  }

  // ── VALIDADORES ──────────────────────────────────────────────────
  var validators = {
    nome:         function (v) { return v.trim().length >= 3 && v.trim().split(' ').length >= 2 && v.trim().split(' ')[1].length >= 1; },
    email:        function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
    telefone:     function (v) { var d = v.replace(/\D/g, ''); return d.length >= 10 && d.length <= 11; },
    empresa:      function (v) { return v.trim().length >= 2; },
    funcionarios: function (v) { return v !== '' && v !== null; },
    cargo:        function (v) { return v !== '' && v !== null; },
    site:         function (v) { return v.trim().length >= 2; },
    lgpd:         function (v, el) { return el ? el.checked : false; }
  };

  var errorMessages = {
    nome:         'Informe seu nome completo (nome e sobrenome).',
    email:        'Informe um e-mail válido.',
    telefone:     'Informe um telefone válido com DDD.',
    empresa:      'Informe o nome da empresa.',
    funcionarios: 'Selecione o número de funcionários.',
    cargo:        'Selecione seu cargo.',
    site:         'Informe seu site ou rede social.',
    lgpd:         'Você precisa aceitar a Política de Privacidade.'
  };

  // ── MÁSCARA TELEFONE BR ──────────────────────────────────────────
  function maskPhone(value) {
    var d = value.replace(/\D/g, '').slice(0, 11);
    if (!d.length)  return '';
    if (d.length <= 2)  return '(' + d;
    if (d.length <= 6)  return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  // ── HELPERS DE ESTADO ────────────────────────────────────────────
  function setError(groupEl, inputEl, msg) {
    groupEl.classList.add('has-error');
    inputEl.classList.remove('is-valid');
    var errorEl = groupEl.querySelector('.form-error');
    if (errorEl) errorEl.textContent = msg;
    inputEl.classList.remove('is-error');
    void inputEl.offsetWidth;
    inputEl.classList.add('is-error');
  }

  function setValid(groupEl, inputEl) {
    groupEl.classList.remove('has-error');
    inputEl.classList.remove('is-error');
    inputEl.classList.add('is-valid');
  }

  function clearState(groupEl, inputEl) {
    groupEl.classList.remove('has-error');
    inputEl.classList.remove('is-error', 'is-valid');
  }

  function validateField(name, inputEl) {
    var groupEl = inputEl.closest('.form-group');
    if (!groupEl) return true;
    var value   = inputEl.value;
    var isValid = (name === 'lgpd')
      ? inputEl.checked
      : (value.trim() !== '' && validators[name] && validators[name](value, inputEl));

    if (!isValid) { setError(groupEl, inputEl, errorMessages[name] || 'Campo obrigatório.'); return false; }
    setValid(groupEl, inputEl);
    return true;
  }

  // ── LOADING ──────────────────────────────────────────────────────
  function showLoading(btn) {
    if (!btn) return;
    btn.disabled      = true;
    btn.dataset.original = btn.innerHTML;
    btn.innerHTML     = '<span class="spinner"></span> Enviando...';
  }

  // ── INIT ─────────────────────────────────────────────────────────
  function init() {
    var form = document.getElementById('lp-nr1');
    if (!form) return;

    populateHiddenUtmFields(form);

    // Máscara de telefone
    var phoneInput = form.querySelector('[data-field="telefone"]');
    if (phoneInput) {
      phoneInput.addEventListener('input', function () {
        phoneInput.value = maskPhone(phoneInput.value);
      });
    }

    // Validação no blur / change
    var fields = form.querySelectorAll('[data-field]');
    fields.forEach(function (input) {
      var name = input.dataset.field;
      if (name === 'lgpd') return;

      input.addEventListener('blur', function () { validateField(name, input); });
      input.addEventListener('input', function () {
        var groupEl = input.closest('.form-group');
        if (groupEl && groupEl.classList.contains('has-error')) clearState(groupEl, input);
      });
      if (input.tagName === 'SELECT') {
        input.addEventListener('change', function () { validateField(name, input); });
      }
    });

    // Checkbox LGPD
    var lgpdInput = form.querySelector('[data-field="lgpd"]');
    if (lgpdInput) {
      lgpdInput.addEventListener('change', function () { validateField('lgpd', lgpdInput); });
    }

    // ── SUBMIT ──────────────────────────────────────────────────────
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Valida todos os campos
      var allValid    = true;
      var firstInvalid = null;
      fields.forEach(function (input) {
        var name  = input.dataset.field;
        var valid = validateField(name, input);
        if (!valid) { allValid = false; if (!firstInvalid) firstInvalid = input; }
      });

      if (!allValid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      populateHiddenUtmFields(form);
      showLoading(form.querySelector('.form-submit-btn'));

      var destination = form.getAttribute('action') || 'obrigado.html';
      var redirected  = false;

      // 1. Cronômetro de segurança absoluto de 4 segundos (fallback)
      var safetyTimer = setTimeout(function () {
        if (!redirected) {
          redirected = true;
          window.location.href = destination;
        }
      }, 4000);

      // 2. Dispara a preparação de CAPI / GTM (retorna uma Promise)
      var leadPromise = (window.GTMEvents && window.GTMEvents.prepareLead)
        ? window.GTMEvents.prepareLead(form)
        : Promise.resolve();

      // 3. Delay artificial de 2 segundos para dar tempo ao AJAX nativo do RD Station Loader completar
      var delayPromise = new Promise(function (resolve) {
        setTimeout(resolve, 2000);
      });

      // 4. Aguarda ambas as Promises terminarem
      Promise.all([leadPromise, delayPromise])
        .then(function (results) {
          if (redirected) return;
          redirected = true;
          clearTimeout(safetyTimer);

          var leadEventId = results[0];
          var dest = destination;
          if (leadEventId) {
            dest += (dest.indexOf('?') >= 0 ? '&' : '?') + 'event_id=' + leadEventId;
          }
          window.location.href = dest;
        })
        .catch(function () {
          if (redirected) return;
          redirected = true;
          clearTimeout(safetyTimer);
          window.location.href = destination;
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
