/**
 * form.js
 * Validação em tempo real, máscara telefone BR.
 * O envio ao RD Station é feito pelo script loader oficial (não por API manual).
 * Os UTMs são persistidos em localStorage e injetados nos campos hidden antes do submit.
 */

(function () {
  'use strict';

  var FORM_ID         = 'lp-solicite-demonstracao';
  var THANK_YOU_URL   = 'obrigado.html';

  var UTM_STORAGE_KEY = 'yourh_utm_params';
  var UTM_EXPIRY_MS   = 30 * 24 * 60 * 60 * 1000; // 30 dias
  var UTM_KEYS        = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_marketing_tactic'];

  function readUtmsFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var utms = {};
    var hasAny = false;
    UTM_KEYS.forEach(function (k) {
      var val = params.get(k);
      if (val && val.trim()) {
        utms[k] = val.trim().toLowerCase();
        hasAny = true;
      }
    });
    return hasAny ? utms : null;
  }

  function saveUtms(utms) {
    try {
      localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify({
        data:    utms,
        expires: Date.now() + UTM_EXPIRY_MS,
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
    if (fromUrl) {
      saveUtms(fromUrl);
      return fromUrl;
    }
    return loadUtms() || {};
  })();

  function populateHiddenUtmFields(form) {
    UTM_KEYS.forEach(function (k) {
      var el = form.querySelector('#' + k);
      if (el && _utms[k]) el.value = _utms[k];
    });
    var src = form.querySelector('#utm_source');
    var med = form.querySelector('#utm_medium');
    if (src && !src.value) src.value = 'direto';
    if (med && !med.value) med.value = '(none)';
  }

  function getCookieLocal(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  function readCookie(name) {
    return (window.GTMEvents && window.GTMEvents.getCookie)
      ? window.GTMEvents.getCookie(name)
      : getCookieLocal(name);
  }

  function populateHiddenMetaFields(form) {
    var fbclid = new URLSearchParams(window.location.search).get('fbclid') || null;
    var fbc    = readCookie('_fbc');
    var fbp    = readCookie('_fbp');

    if (!fbc && fbclid) {
      fbc = 'fb.1.' + Date.now() + '.' + fbclid;
    }

    var elFbclid = form.querySelector('#fbclid');
    var elFbc    = form.querySelector('#fbc');
    var elFbp    = form.querySelector('#fbp');

    if (elFbclid && fbclid) elFbclid.value = fbclid;
    if (elFbc    && fbc)    elFbc.value    = fbc;
    if (elFbp    && fbp)    elFbp.value    = fbp;
  }

  var validators = {
    nome: function (v) {
      return v.trim().length >= 3 && v.trim().split(' ').length >= 2 && v.trim().split(' ')[1].length >= 1;
    },
    email: function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
    },
    telefone: function (v) {
      var d = v.replace(/\D/g, '');
      return d.length >= 10 && d.length <= 11;
    },
    empresa: function (v) {
      return v.trim().length >= 2;
    },
    funcionarios: function (v) {
      return v !== '' && v !== null;
    },
    cargo: function (v) {
      return v !== '' && v !== null;
    },
    site: function (v) {
      return v.trim().length >= 2;
    },
    lgpd: function (v, el) {
      return el ? el.checked : false;
    },
  };

  var errorMessages = {
    nome:         'Informe seu nome completo (nome e sobrenome).',
    email:        'Informe um e-mail válido.',
    telefone:     'Informe um telefone válido com DDD.',
    empresa:      'Informe o nome da empresa.',
    funcionarios: 'Selecione o número de funcionários.',
    cargo:        'Selecione seu cargo.',
    site:         'Informe seu site ou rede social.',
    lgpd:         'Você precisa aceitar a Política de Privacidade.',
  };

  function maskPhone(value) {
    var d = value.replace(/\D/g, '').slice(0, 11);
    if (!d.length) return '';
    if (d.length <= 2)  return '(' + d;
    if (d.length <= 6)  return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  function setError(groupEl, inputEl, msg) {
    groupEl.classList.add('has-error');
    inputEl.classList.remove('is-valid', 'is-error');
    void inputEl.offsetWidth;
    inputEl.classList.add('is-error');
    var errorEl = groupEl.querySelector('.form-error');
    if (errorEl) errorEl.textContent = msg;
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
    var value = inputEl.value;
    var isValid;
    if (name === 'lgpd') {
      isValid = inputEl.checked;
    } else {
      isValid = value.trim() !== '' && validators[name] && validators[name](value, inputEl);
    }
    if (!isValid) {
      setError(groupEl, inputEl, errorMessages[name] || 'Campo obrigatório.');
      return false;
    }
    setValid(groupEl, inputEl);
    return true;
  }

  function showLoading(btn) {
    if (!btn) return;
    btn.disabled = true;
    btn.dataset.original = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> Enviando...';
  }

  function init() {
    var form = document.getElementById(FORM_ID);
    if (!form) return;

    populateHiddenUtmFields(form);
    populateHiddenMetaFields(form);

    var destination = form.getAttribute('action') || THANK_YOU_URL;
    var redirected  = false;

    // Netlify retorna 404 para POST em .html estático. Por isso bloqueamos o
    // POST nativo e fazemos o redirect por conta própria via GET.
    function goToThankYou() {
      if (redirected) return;
      redirected = true;
      window.location.href = destination;
    }

    var phoneInput = form.querySelector('[data-field="telefone"]');
    if (phoneInput) {
      phoneInput.addEventListener('input', function () {
        phoneInput.value = maskPhone(phoneInput.value);
      });
    }

    var fields = form.querySelectorAll('[data-field]');
    fields.forEach(function (input) {
      var name = input.dataset.field;
      if (name === 'lgpd') return;
      input.addEventListener('blur', function () {
        validateField(name, input);
      });
      input.addEventListener('input', function () {
        var groupEl = input.closest('.form-group');
        if (groupEl && groupEl.classList.contains('has-error')) {
          clearState(groupEl, input);
        }
      });
      if (input.tagName === 'SELECT') {
        input.addEventListener('change', function () {
          validateField(name, input);
        });
      }
    });

    var lgpdInput = form.querySelector('[data-field="lgpd"]');
    if (lgpdInput) {
      lgpdInput.addEventListener('change', function () {
        validateField('lgpd', lgpdInput);
      });
    }

    form.addEventListener('submit', function (e) {
      // 1. Valida todos os campos — único motivo para bloquear o submit
      var allValid = true;
      var firstInvalid = null;
      fields.forEach(function (input) {
        var name = input.dataset.field;
        var valid = validateField(name, input);
        if (!valid) {
          allValid = false;
          if (!firstInvalid) firstInvalid = input;
        }
      });

      if (!allValid) {
        e.preventDefault();
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // 2. Honeypot anti-spam
      var honeypot = form.querySelector('[name="website"]');
      if (honeypot && honeypot.value) {
        e.preventDefault();
        return;
      }

      // 3. Bloqueia o POST nativo — Netlify retorna 404 para POST em .html
      e.preventDefault();

      // 4. Preenche UTMs, dados Meta e limpa máscara do telefone
      populateHiddenUtmFields(form);
      populateHiddenMetaFields(form);
      if (phoneInput) phoneInput.value = phoneInput.value.replace(/\D/g, '');

      // 5. Feedback visual
      showLoading(form.querySelector('.form-submit-btn'));

      // Timeout de segurança absoluta (fallback)
      var safetyTimer = setTimeout(goToThankYou, 4000);

      // Dispara a Promise do GTM CAPI (gera event_id, salva no sessionStorage e dispara lead_pending)
      var leadPromise = (window.GTMEvents && window.GTMEvents.prepareLead)
        ? window.GTMEvents.prepareLead(form)
        : Promise.resolve();

      // Aguarda o processamento do CAPI e garante 2s de delay para o AJAX do RD Station Loader rodar
      Promise.all([
        leadPromise,
        new Promise(function (resolve) { setTimeout(resolve, 2000); })
      ])
      .then(function (results) {
        clearTimeout(safetyTimer);
        var leadEventId = results[0];
        if (leadEventId) {
          destination += (destination.indexOf('?') >= 0 ? '&' : '?') + 'event_id=' + leadEventId;
        }
        goToThankYou();
      })
      .catch(function () {
        clearTimeout(safetyTimer);
        goToThankYou();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
