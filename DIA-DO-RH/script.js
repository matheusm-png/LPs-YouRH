/* YouRH · LP Dia do RH — motion + interações
   - Reveal observers
   - Count-up para números
   - Bars progressivas
   - Nav adaptativo (claro/escuro)
   - Parallax: glows + planilhas voando + stack de capas
   - Form: validação inline + UTM persistence + GTM + submit nativo
     (RD Station é processado pelo loader script oficial)
*/

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========== Countdown até 31/05/2026 23:59 =========== */
(function () {
  const target = new Date('2026-05-31T23:59:59');
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-minutes');
  const cdSecs = document.getElementById('cd-seconds');
  const bar = document.getElementById('countdown-bar');
  if (!cdDays) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) { if (bar) bar.style.display = 'none'; return; }
    cdDays.textContent  = pad(Math.floor(diff / 86400000));
    cdHours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    cdMins.textContent  = pad(Math.floor((diff % 3600000) / 60000));
    cdSecs.textContent  = pad(Math.floor((diff % 60000) / 1000));
  }

  tick();
  setInterval(tick, 1000);
})();

/* =========== Stagger index ============ */
document.querySelectorAll('.num-list__item').forEach((el, i) => el.style.setProperty('--i', i));
document.querySelectorAll('.bgrid__item').forEach((el, i) => el.style.setProperty('--i', i));
document.querySelectorAll('.cat-grid li').forEach((el, i) => el.style.setProperty('--i', i));

/* =========== Reveal Observer ============ */
const revealSelectors = [
  '.reveal', '.reveal-zoom', '.reveal-x', '.reveal-mask',
  '.reveal-left', '.reveal-right', '.reveal-grid',
  '.reveal-lines', '.reveal-stagger',
];
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('in-view'); io.unobserve(entry.target); }
  });
}, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll(revealSelectors.join(',')).forEach((el) => io.observe(el));

/* =========== Bars ============ */
const barIO = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('is-in'); barIO.unobserve(entry.target); }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.bar').forEach((el) => barIO.observe(el));

/* =========== Count-up ============ */
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target, 10) || 0;
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))).toLocaleString('pt-BR');
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterIO.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.count').forEach((c) => counterIO.observe(c));

/* =========== Nav adaptativo ============ */
const nav = document.querySelector('.nav');
const lightSections = document.querySelectorAll('.pain--light, .testimonials--light');
const updateNavTheme = () => {
  let isLight = false;
  lightSections.forEach((sec) => {
    const r = sec.getBoundingClientRect();
    if (r.top <= 100 && r.bottom >= 100) isLight = true;
  });
  nav.classList.toggle('is-light', isLight);
};
window.addEventListener('scroll', updateNavTheme, { passive: true });
updateNavTheme();

/* =========== Parallax: glows + planilhas voando ============ */
const glows = document.querySelectorAll('.hero__glow');
const papers = document.querySelectorAll('.paper');
const painSection = document.getElementById('dor');
let raf = null;
window.addEventListener('scroll', () => {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    const y = window.scrollY;
    glows.forEach((g, i) => { g.style.transform = `translate3d(0, ${y * (i + 1) * 0.05}px, 0)`; });
    if (painSection && papers.length) {
      const rect = painSection.getBoundingClientRect();
      const sectionH = rect.height;
      const progress = Math.min(Math.max(-rect.top + window.innerHeight, 0), sectionH + window.innerHeight) / (sectionH + window.innerHeight);
      papers.forEach((p, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        const tY = (progress - 0.5) * (60 + i * 18) * dir;
        const tX = (progress - 0.5) * 30 * dir * (i % 3 === 0 ? -1 : 1);
        p.style.transform = `translate3d(${tX}px, ${tY}px, 0) rotate(${(i * 14 - 30) + (progress * 20 * dir)}deg)`;
      });
    }
    raf = null;
  });
}, { passive: true });

/* =========== Mouse parallax leve no hero ============ */
const heroStage = document.querySelector('.hero__visual-stage');
if (heroStage && window.matchMedia('(hover:hover) and (min-width:1000px)').matches) {
  const heroSection = document.getElementById('hero');
  heroSection.addEventListener('mousemove', (e) => {
    const r = heroSection.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    heroStage.style.transform = `translate3d(${x * 6}px, ${y * 6}px, 0)`;
    document.querySelectorAll('.glass--float-1').forEach((el) => { el.style.transform = `translate3d(${x * 14}px, ${y * 10}px, 0)`; });
    document.querySelectorAll('.glass--float-2').forEach((el) => { el.style.transform = `translate3d(${x * -12}px, ${y * -8}px, 0)`; });
  });
  heroSection.addEventListener('mouseleave', () => {
    heroStage.style.transform = '';
    document.querySelectorAll('.glass--float-1, .glass--float-2').forEach((el) => { el.style.transform = ''; });
  });
}

/* =========== Stack de capas — motion no scroll ============ */
const coverStack = document.querySelector('[data-stack]');
if (coverStack) {
  const stackIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { coverStack.classList.add('is-animating'); stackIO.unobserve(entry.target); }
    });
  }, { threshold: 0.3 });
  stackIO.observe(coverStack);

  const trilhas = document.getElementById('trilhas');
  const covers = coverStack.querySelectorAll('.cover');
  let stackRaf = null;
  window.addEventListener('scroll', () => {
    if (stackRaf) return;
    stackRaf = requestAnimationFrame(() => {
      const rect = trilhas.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));
      covers.forEach((c, i) => { c.style.setProperty('--scroll-y', `${(progress - 0.5) * (i * 6)}px`); });
      stackRaf = null;
    });
  }, { passive: true });
}

/* =========== Smooth focus no CTA do form ============ */
document.querySelectorAll('a[href="#form"]').forEach((a) => {
  a.addEventListener('click', () => {
    setTimeout(() => {
      const first = document.getElementById('field-nome');
      if (first) first.focus({ preventScroll: true });
    }, 900);
  });
});

/* =========== UTM persistence ============ */
(function () {
  var UTM_KEY    = 'yourh_utm_params';
  var UTM_EXPIRY = 30 * 24 * 60 * 60 * 1000;
  var UTM_KEYS   = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_marketing_tactic'];

  function readFromUrl() {
    var p = new URLSearchParams(window.location.search);
    var obj = {}, any = false;
    UTM_KEYS.forEach(function (k) {
      var v = p.get(k);
      if (v && v.trim()) { obj[k] = v.trim().toLowerCase(); any = true; }
    });
    return any ? obj : null;
  }

  var utms = (function () {
    var fromUrl = readFromUrl();
    if (fromUrl) {
      try { localStorage.setItem(UTM_KEY, JSON.stringify({ data: fromUrl, expires: Date.now() + UTM_EXPIRY })); } catch (e) {}
      return fromUrl;
    }
    try {
      var raw = localStorage.getItem(UTM_KEY);
      if (raw) {
        var stored = JSON.parse(raw);
        if (stored && Date.now() <= stored.expires) return stored.data || {};
        localStorage.removeItem(UTM_KEY);
      }
    } catch (e) {}
    return {};
  })();

  window.__yourhUtms = utms;
})();

function populateUtmFields(form) {
  var utms = window.__yourhUtms || {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_marketing_tactic'].forEach(function (k) {
    var el = form.querySelector('#' + k);
    if (el && utms[k]) el.value = utms[k];
  });
}

/* =========== WhatsApp mask ============ */
const whatsappInput = document.getElementById('field-whatsapp');
if (whatsappInput) {
  whatsappInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 7)      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    e.target.value = v;
  });
}

/* =========== Validação inline ============ */
const validators = {
  nome:        (v) => v.trim().split(/\s+/).length >= 2 && v.trim().split(/\s+/)[1].length >= 1,
  email:       (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
  telefone:    (v) => { const d = v.replace(/\D/g, ''); return d.length >= 10 && d.length <= 11; },
  empresa:     (v) => v.trim().length >= 2,
  site:        (v) => v.trim().length >= 2,
  cargo:       (v) => v !== '',
  funcionarios:(v) => v !== '',
  pessoas_rh:  (v) => v !== '',
  desafio:     (v) => v !== '',
  lgpd:        (v, el) => el ? el.checked : false,
};

const errorMessages = {
  nome:        'Informe seu nome completo (nome e sobrenome).',
  email:       'Informe um e-mail válido.',
  telefone:    'Informe um telefone com DDD.',
  empresa:     'Informe o nome da empresa.',
  site:        'Informe o site ou rede social.',
  cargo:       'Selecione seu cargo.',
  funcionarios:'Selecione o número de colaboradores.',
  pessoas_rh:  'Selecione o tamanho do time de RH.',
  desafio:     'Selecione seu maior desafio.',
  lgpd:        'Você precisa aceitar a Política de Privacidade.',
};

function getFieldContainer(input) {
  return input.closest('.field') || input.closest('.check-line') || input.parentElement;
}

function getErrorEl(input, fieldName) {
  const container = getFieldContainer(input);
  return container ? container.querySelector('.field__error') || document.getElementById('error-' + fieldName) : null;
}

function setFieldError(input, fieldName, msg) {
  input.classList.add('is-error');
  input.classList.remove('is-valid');
  const errEl = getErrorEl(input, fieldName) || document.getElementById('error-' + fieldName);
  if (errEl) { errEl.textContent = msg; }
}

function clearFieldError(input, fieldName) {
  input.classList.remove('is-error');
  input.classList.add('is-valid');
  const errEl = getErrorEl(input, fieldName) || document.getElementById('error-' + fieldName);
  if (errEl) errEl.textContent = '';
}

function validateField(input) {
  const fieldName = input.dataset.field;
  if (!fieldName || !validators[fieldName]) return true;
  const isValid = fieldName === 'lgpd'
    ? input.checked
    : input.value.trim() !== '' && validators[fieldName](input.value, input);
  if (!isValid) {
    setFieldError(input, fieldName, errorMessages[fieldName] || 'Campo obrigatório.');
    return false;
  }
  clearFieldError(input, fieldName);
  return true;
}

function validateAllFields(form) {
  let valid = true;
  let firstInvalid = null;
  form.querySelectorAll('[data-field]').forEach((input) => {
    if (!validateField(input)) {
      valid = false;
      if (!firstInvalid) firstInvalid = input;
    }
  });
  return { valid, firstInvalid };
}

/* Limpa erro ao digitar */
document.querySelectorAll('[data-field]').forEach((input) => {
  const ev = input.tagName === 'SELECT' ? 'change' : 'input';
  input.addEventListener(ev, () => {
    if (input.classList.contains('is-error')) validateField(input);
  });
  if (input.tagName !== 'SELECT' && input.type !== 'checkbox') {
    input.addEventListener('blur', () => validateField(input));
  }
});

/* =========== Form submission ============ */
const leadForm = document.getElementById('lp_dia-do-rh_conv');
if (leadForm) {
  /* Popula hidden fields no carregamento inicial (garante que a RD leia com antecedência) */
  populateUtmFields(leadForm);

  leadForm.addEventListener('submit', (e) => {
    const { valid, firstInvalid } = validateAllFields(leadForm);

    if (!valid) {
      e.preventDefault();
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    /* Popula UTMs antes de submeter */
    populateUtmFields(leadForm);

    /* GTM — dados de conversão */
    const utms = window.__yourhUtms || {};
    if (window.dataLayer) {
      window.dataLayer.push({
        event:                'lead_form_submit',
        conversion_identifier:'lp-dia-do-rh-yourh',
        lead_email:            leadForm.querySelector('[name="email"]').value.trim(),
        lead_empresa:          leadForm.querySelector('[name="company"]').value.trim(),
        lead_cargo:            leadForm.querySelector('[name="role"]').value.trim(),
        utm_source:            utms.utm_source   || undefined,
        utm_medium:            utms.utm_medium   || undefined,
        utm_campaign:          utms.utm_campaign || undefined,
        utm_marketing_tactic:  utms.utm_marketing_tactic || undefined,
      });
    }

    /* Loading state + redireciona via JS (POST em hospedagem estática dá 404) */
    e.preventDefault();
    const btn = leadForm.querySelector('button[type=submit]');
    btn.disabled = true;
    btn.classList.add('btn--loading');
    btn.innerHTML = '<span class="btn__spinner"></span> Enviando…';
    setTimeout(() => { window.location.href = 'obrigado.html'; }, 1200);
  });
}
