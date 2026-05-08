/**
 * webinar.js
 * Inscrição no webinar NR-1 — envia direto para Google Sheets via Apps Script.
 * Não dispara nada para o RD Station.
 *
 * SETUP: substitua APPS_SCRIPT_URL pela URL gerada após deployar o código
 * em google-apps-script.js como "Web app" no Google Apps Script.
 */

(function () {
  'use strict';

  var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwu3u8ClIHgkPCDWKExTnrCwMu_ATmPmkbU3NwTScpLA0nSc2t9nMHpyaefot2zyiPr/exec';

  var validators = {
    nome: function (v) {
      var parts = v.trim().split(/\s+/);
      return parts.length >= 2 && parts[1].length >= 1;
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
    cargo: function (v) {
      return v.trim().length >= 2;
    },
  };

  var errorMessages = {
    nome:     'Informe seu nome completo (nome e sobrenome).',
    email:    'Informe um e-mail válido.',
    telefone: 'Informe um telefone com DDD.',
    empresa:  'Informe o nome da empresa.',
    cargo:    'Informe seu cargo.',
  };

  function maskPhone(value) {
    var d = value.replace(/\D/g, '').slice(0, 11);
    if (!d.length) return '';
    if (d.length <= 2)  return '(' + d;
    if (d.length <= 6)  return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  function setError(inputEl, msg) {
    var group = inputEl.closest('.form-group');
    if (!group) return;
    group.classList.add('has-error');
    inputEl.classList.remove('is-valid');
    inputEl.classList.remove('is-error');
    void inputEl.offsetWidth;
    inputEl.classList.add('is-error');
    var errorEl = group.querySelector('.form-error');
    if (errorEl) errorEl.textContent = msg;
  }

  function setValid(inputEl) {
    var group = inputEl.closest('.form-group');
    if (!group) return;
    group.classList.remove('has-error');
    inputEl.classList.remove('is-error');
    inputEl.classList.add('is-valid');
  }

  function clearState(inputEl) {
    var group = inputEl.closest('.form-group');
    if (!group) return;
    group.classList.remove('has-error');
    inputEl.classList.remove('is-error', 'is-valid');
  }

  function validateField(name, inputEl) {
    var value = inputEl.value;
    var valid = value.trim() !== '' && validators[name] && validators[name](value);
    if (!valid) {
      setError(inputEl, errorMessages[name] || 'Campo obrigatório.');
      return false;
    }
    setValid(inputEl);
    return true;
  }

  function openModal() {
    var modal = document.getElementById('webinar-modal');
    if (!modal) return;
    modal.removeAttribute('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('omodal-open');
    var dialog = modal.querySelector('.wmodal__dialog');
    if (dialog) dialog.focus();
  }

  function closeModal() {
    var modal = document.getElementById('webinar-modal');
    if (!modal) return;
    modal.setAttribute('hidden', '');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('omodal-open');
  }

  function showSuccess() {
    var formBody = document.getElementById('wmodal-form-body');
    var success  = document.getElementById('wmodal-success');
    if (formBody) formBody.hidden = true;
    if (success)  success.hidden  = false;
  }

  function resetModal() {
    var form     = document.getElementById('webinar-form');
    var formBody = document.getElementById('wmodal-form-body');
    var success  = document.getElementById('wmodal-success');
    if (form)     form.reset();
    if (formBody) formBody.hidden = false;
    if (success)  success.hidden  = true;
    if (form) {
      form.querySelectorAll('.form-input').forEach(function (el) {
        clearState(el);
      });
    }
  }

  function submitToSheets(data, btn) {
    btn.disabled = true;
    var original = btn.textContent;
    btn.innerHTML = '<span class="spinner"></span> Enviando...';

    fetch(APPS_SCRIPT_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'text/plain' },
      body:    JSON.stringify(data),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (json) {
        if (json.status === 'ok') {
          showSuccess();
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: 'webinar_inscricao', cargo: data.cargo, empresa: data.empresa });
        } else {
          throw new Error('Apps Script retornou erro');
        }
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = original;
        alert('Ops! Não foi possível confirmar sua inscrição. Tente novamente em instantes.');
      });
  }

  function init() {
    var ctaBtn    = document.getElementById('webinar-cta-btn');
    var modal     = document.getElementById('webinar-modal');
    var closeBtn  = document.getElementById('wmodal-close');
    var form      = document.getElementById('webinar-form');
    var successCloseBtn = document.getElementById('wmodal-success-close');

    if (!modal) return;

    if (ctaBtn) {
      ctaBtn.addEventListener('click', openModal);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        closeModal();
        setTimeout(resetModal, 300);
      });
    }

    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeModal();
        setTimeout(resetModal, 300);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
        closeModal();
        setTimeout(resetModal, 300);
      }
    });

    if (successCloseBtn) {
      successCloseBtn.addEventListener('click', function () {
        closeModal();
        setTimeout(resetModal, 300);
      });
    }

    if (!form) return;

    var phoneInput = form.querySelector('[data-wfield="telefone"]');
    if (phoneInput) {
      phoneInput.addEventListener('input', function () {
        phoneInput.value = maskPhone(phoneInput.value);
      });
    }

    form.querySelectorAll('[data-wfield]').forEach(function (input) {
      var name = input.dataset.wfield;
      input.addEventListener('blur', function () {
        validateField(name, input);
      });
      input.addEventListener('input', function () {
        var group = input.closest('.form-group');
        if (group && group.classList.contains('has-error')) clearState(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var allValid = true;
      var firstInvalid = null;

      form.querySelectorAll('[data-wfield]').forEach(function (input) {
        var valid = validateField(input.dataset.wfield, input);
        if (!valid) {
          allValid = false;
          if (!firstInvalid) firstInvalid = input;
        }
      });

      if (!allValid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var data = {
        nome:     form.querySelector('[data-wfield="nome"]').value.trim(),
        email:    form.querySelector('[data-wfield="email"]').value.trim(),
        telefone: form.querySelector('[data-wfield="telefone"]').value.trim(),
        empresa:  form.querySelector('[data-wfield="empresa"]').value.trim(),
        cargo:    form.querySelector('[data-wfield="cargo"]').value.trim(),
      };

      submitToSheets(data, document.getElementById('webinar-submit-btn'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
