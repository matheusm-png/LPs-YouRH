/**
 * form.js
 * Validação em tempo real, máscara telefone BR,
 * integração RD Station API de Conversões, Meta Pixel Lead event.
 *
 * UTM persistence: lê da URL, salva em localStorage (30 dias),
 * e reenvia no payload mesmo se o usuário navegou entre páginas.
 */

(function () {
  'use strict';

  // ── CONFIGURAÇÃO ─────────────────────────────────────────────────
  var RD_API_URL = 'https://api.rd.services/platform/conversions?api_key=2b4d5177951b2aaefe0b7f838559c2d9';
  // ⚠️ ATENÇÃO: a API key acima é fixa (YouRH). NÃO ALTERAR.

  // ⚠️ TODO: altere esta URL para o caminho correto da LP publicada
  var OBRIGADO_URL = 'https://lp.yourh.com.br/turnover/obrigado.html';

  var UTM_STORAGE_KEY = 'yourh_utm_params';
  var UTM_EXPIRY_MS   = 30 * 24 * 60 * 60 * 1000; // 30 dias

  // ── UTM PERSISTENCE ──────────────────────────────────────────────
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

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

  // Lê UTMs da URL e persiste; se não há na URL, usa o que está salvo.
  // Executa imediatamente para capturar antes de qualquer redirect interno.
  var _utms = (function () {
    var fromUrl = readUtmsFromUrl();
    if (fromUrl) {
      saveUtms(fromUrl);
      return fromUrl;
    }
    return loadUtms() || {};
  })();

  // ── VALIDADORES ─────────────────────────────────────────────────
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
    lgpd:         'Você precisa aceitar a Política de Privacidade.',
  };

  // ── MÁSCARA DE TELEFONE BR ───────────────────────────────────────
  function maskPhone(value) {
    var d = value.replace(/\D/g, '').slice(0, 11);
    if (!d.length) return '';
    if (d.length <= 2)  return '(' + d;
    if (d.length <= 6)  return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  // ── HELPERS DE ESTADO ────────────────────────────────────────────
  function setError(groupEl, inputEl, msg) {
    groupEl.classList.add('has-error');
    inputEl.classList.remove('is-valid');
    inputEl.classList.add('is-error');
    var errorEl = groupEl.querySelector('.form-error');
    if (errorEl) errorEl.textContent = msg;
    // Re-trigger shake
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

  // ── LOADING / SUCCESS ────────────────────────────────────────────
  function showLoading(btn) {
    btn.disabled = true;
    btn.dataset.original = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> Enviando...';
  }

  function hideLoading(btn) {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.original || 'quero falar com um especialista!';
  }

  // ── RD STATION API ───────────────────────────────────────────────
  function buildRdPayload(data) {
    var utms = _utms;

    var payload = {
      // ⚠️ TODO: altere o conversion_identifier para o nome desta LP
      // Formato: lp-[slug-da-lp]-yourh
      conversion_identifier: 'lp-turnover-yourh',
      name:                data.nome,
      email:               data.email,
      mobile_phone:        data.telefone,
      company_name:        data.empresa,
      number_of_employees: data.funcionarios,
      job_title:           data.cargo,
    };

    // Mapeia cada UTM para o campo correspondente da API do RD Station.
    // Apenas inclui o campo se o valor estiver presente.
    if (utms.utm_source)   payload.traffic_source   = utms.utm_source;
    if (utms.utm_medium)   payload.traffic_medium   = utms.utm_medium;
    if (utms.utm_campaign) payload.traffic_campaign = utms.utm_campaign;
    if (utms.utm_term)     payload.traffic_value    = utms.utm_term;
    if (utms.utm_content)  payload.traffic_content  = utms.utm_content;

    return payload;
  }

  function sendToRdStation(data) {
    return fetch(RD_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type:   'CONVERSION',
        event_family: 'CDP',
        payload:      buildRdPayload(data),
      }),
    });
  }

  // ── GTM + META PIXEL ─────────────────────────────────────────────
  function fireEvents(data) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event:               'lead_form_submit',
      cargo:               data.cargo,
      empresa:             data.empresa,
      numero_funcionarios: data.funcionarios,
      utm_source:          _utms.utm_source   || undefined,
      utm_medium:          _utms.utm_medium   || undefined,
      utm_campaign:        _utms.utm_campaign || undefined,
    });

    // Meta Pixel: Lead NÃO disparado aqui — disparado no obrigado.html via PageView.
    // Isso evita duplo disparo. O obrigado.html é a fonte de verdade do evento Lead.

    window.dispatchEvent(new CustomEvent('lead_form_submit', {
      bubbles: true,
      detail: { email: data.email, cargo: data.cargo, empresa: data.empresa },
    }));
  }

  // ── INIT ─────────────────────────────────────────────────────────
  function init() {
    var form = document.getElementById('conversion-form');
    if (!form) return;

    // Máscara de telefone
    var phoneInput = form.querySelector('[data-field="telefone"]');
    if (phoneInput) {
      phoneInput.addEventListener('input', function () {
        phoneInput.value = maskPhone(phoneInput.value);
      });
    }

    // Validação no blur para inputs e selects
    var fields = form.querySelectorAll('[data-field]');
    fields.forEach(function (input) {
      var name = input.dataset.field;
      if (name === 'lgpd') return; // checkbox validado no change

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

    // Checkbox LGPD
    var lgpdInput = form.querySelector('[data-field="lgpd"]');
    if (lgpdInput) {
      lgpdInput.addEventListener('change', function () {
        validateField('lgpd', lgpdInput);
      });
    }

    // Submit
    form.addEventListener('submit', function (e) {
      e.preventDefault();

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
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var data = {
        nome:         form.querySelector('[data-field="nome"]').value.trim(),
        email:        form.querySelector('[data-field="email"]').value.trim(),
        telefone:     form.querySelector('[data-field="telefone"]').value.trim(),
        empresa:      form.querySelector('[data-field="empresa"]').value.trim(),
        funcionarios: form.querySelector('[data-field="funcionarios"]').value,
        cargo:        form.querySelector('[data-field="cargo"]').value,
      };

      var submitBtn = form.querySelector('.form-submit-btn');
      showLoading(submitBtn);

      sendToRdStation(data)
        .then(function (res) {
          if (res.ok || res.status === 200 || res.status === 201) {
            fireEvents(data);
            window.location.href = OBRIGADO_URL;
          } else {
            throw new Error('Status ' + res.status);
          }
        })
        .catch(function (err) {
          console.error('[YouRH Form] Erro RD Station:', err);
          hideLoading(submitBtn);
          var errorEl = form.querySelector('.form-send-error');
          if (errorEl) {
            errorEl.textContent = 'Erro ao enviar. Tente novamente.';
            errorEl.style.display = 'block';
          }
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
