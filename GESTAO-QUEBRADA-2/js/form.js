/**
 * form.js
 * Validação em tempo real, máscara telefone BR.
 * O envio ao RD Station é feito pelo script loader oficial (não por API manual).
 * Os UTMs são persistidos em localStorage e injetados nos campos hidden antes do submit.
 */

(function () {
  'use strict';

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
    btn.disabled = true;
    btn.dataset.original = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> Enviando...';
  }

  function saveLeadToSession(data) {
    var id = 'lead_' + Date.now();
    try { sessionStorage.setItem('yourh_lead_event_id', id); } catch (e) {}
    try {
      sessionStorage.setItem('yourh_lead_data', JSON.stringify({
        cargo:                data.cargo,
        empresa:              data.empresa,
        funcionarios:         data.funcionarios,
        utm_source:           _utms.utm_source            || undefined,
        utm_medium:           _utms.utm_medium            || undefined,
        utm_campaign:         _utms.utm_campaign          || undefined,
        utm_marketing_tactic: _utms.utm_marketing_tactic  || undefined,
      }));
    } catch (e) {}
  }

  function init() {
    var form = document.getElementById('lp_gestao-quebrada_conv');
    if (!form) return;

    populateHiddenUtmFields(form);

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

      e.preventDefault();

      populateHiddenUtmFields(form);

      var phoneInput = form.querySelector('[data-field="telefone"]');
      phoneInput.value = phoneInput.value.replace(/\D/g, '');

      var honeypot = form.querySelector('[name="website"]');
      if (honeypot && honeypot.value) return;

      var data = {
        nome:         form.querySelector('[data-field="nome"]').value.trim(),
        email:        form.querySelector('[data-field="email"]').value.trim(),
        telefone:     phoneInput.value,
        empresa:      form.querySelector('[data-field="empresa"]').value.trim(),
        funcionarios: form.querySelector('[data-field="funcionarios"]').value,
        cargo:        form.querySelector('[data-field="cargo"]').value,
      };

      saveLeadToSession(data);
      showLoading(form.querySelector('.form-submit-btn'));

      // Aguarda o RD Station capturar os dados antes de redirecionar
      setTimeout(function () {
        window.location.href = form.getAttribute('action');
      }, 1500);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
