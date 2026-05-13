document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 0; // 0: intro, 1..25: quiz, 26: gate form, 27: processing, 28: results
  const answers = {};
  const userData = {};

  const totalQuestions = diagnosticData.dimensions.reduce((acc, dim) => acc + dim.questions.length, 0);
  const allQuestions = diagnosticData.dimensions.flatMap(dim => dim.questions);

  const quizContainer = document.getElementById('quiz-content');
  const progressBar  = document.getElementById('progress-bar-fill');
  const progressText = document.getElementById('progress-text');

  /* =========== UTM Persistence ============ */
  (function () {
    var UTM_KEY    = 'yourh_utm_params';
    var UTM_EXPIRY = 30 * 24 * 60 * 60 * 1000;
    var UTM_KEYS   = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_marketing_tactic'];

    function readFromUrl() {
      var p = new URLSearchParams(window.location.search);
      var obj = {}, any = false;
      UTM_KEYS.forEach(function(k) {
        var v = p.get(k);
        if (v && v.trim()) { obj[k] = v.trim().toLowerCase(); any = true; }
      });
      return any ? obj : null;
    }

    var utms = (function() {
      var fromUrl = readFromUrl();
      if (fromUrl) {
        try { localStorage.setItem(UTM_KEY, JSON.stringify({ data: fromUrl, expires: Date.now() + UTM_EXPIRY })); } catch(e) {}
        return fromUrl;
      }
      try {
        var raw = localStorage.getItem(UTM_KEY);
        if (raw) {
          var stored = JSON.parse(raw);
          if (stored && Date.now() <= stored.expires) return stored.data || {};
          localStorage.removeItem(UTM_KEY);
        }
      } catch(e) {}
      return {};
    })();
    window.__yourhUtms = utms;
  })();

  function populateUtmFields(form) {
    var utms = window.__yourhUtms || {};
    ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_marketing_tactic'].forEach(function(k) {
      var el = form.querySelector('[name="' + k + '"]');
      if (el && utms[k]) el.value = utms[k];
    });
  }

  /* =========== Validadores ============ */
  const validators = {
    nome:     (v) => v.trim().split(/\s+/).length >= 2 && v.trim().split(/\s+/)[1].length >= 1,
    empresa:  (v) => v.trim().length >= 2,
    telefone: (v) => { const d = v.replace(/\D/g, ''); return d.length >= 10 && d.length <= 11; },
    email:    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    lgpd:     (v, el) => el ? el.checked : false,
  };

  const errorMessages = {
    nome:     'Informe seu nome completo.',
    empresa:  'Informe o nome da empresa.',
    telefone: 'Informe um telefone com DDD.',
    email:    'Informe um e-mail válido.',
    lgpd:     'Você precisa aceitar os termos.',
  };

  function validateField(input, prefix) {
    const fieldName = input.dataset.field;
    if (!fieldName || !validators[fieldName]) return true;
    const isValid = fieldName === 'lgpd' ? input.checked : validators[fieldName](input.value, input);
    const errEl = document.getElementById(prefix + 'error-' + fieldName);
    if (!isValid) {
      input.classList.add('is-error');
      if (errEl) errEl.textContent = errorMessages[fieldName] || 'Campo obrigatório.';
      return false;
    }
    input.classList.remove('is-error');
    if (errEl) errEl.textContent = '';
    return true;
  }

  /* =========== Navegação entre telas ============ */
  function showScreen(id) {
    ['intro-screen','quiz-screen','gate-screen','processing-screen','dashboard-screen'].forEach(s => {
      const el = document.getElementById(s);
      if (el) el.style.display = 'none';
    });
    const target = document.getElementById(id);
    if (target) target.style.display = id === 'processing-screen' ? 'flex' : 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderStep() {
    if (currentStep === 0) {
      showScreen('intro-screen');
    } else if (currentStep <= totalQuestions) {
      showScreen('quiz-screen');
      renderQuestion(currentStep - 1);
      updateProgress();
    } else if (currentStep === totalQuestions + 1) {
      showScreen('gate-screen');
      setupGateForm();
    } else if (currentStep === totalQuestions + 2) {
      renderProcessing();
    } else {
      renderDashboard();
    }
  }

  function updateProgress() {
    const perc = ((currentStep - 1) / totalQuestions) * 100;
    if (progressBar) progressBar.style.width = `${perc}%`;
    if (progressText) progressText.innerText = `Questão ${currentStep} de ${totalQuestions}`;
    const currentQ = allQuestions[currentStep - 1];
    const dim = diagnosticData.dimensions.find(d => d.questions.some(q => q.id === currentQ.id));
    const dimEl = document.getElementById('current-dim-title');
    if (dimEl && dim) dimEl.innerText = `Dimensão ${dim.id}: ${dim.title}`;
  }

  /* =========== Tela 1: Intro ============ */
  const btnStart = document.getElementById('btn-start-quiz');
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      currentStep = 1;
      renderStep();
    });
  }

  /* =========== Tela 2: Quiz ============ */
  function renderQuestion(idx) {
    const question  = allQuestions[idx];
    const dimension = diagnosticData.dimensions.find(d => d.questions.some(q => q.id === question.id));

    let html = `
      <div class="question-card reveal-in">
        <span class="eyebrow eyebrow--light">Dimensão ${dimension.id} · Pergunta ${question.id}</span>
        <h2 class="question-text">${question.text}</h2>
        ${question.hint ? `<p class="question-hint">${question.hint}</p>` : ''}
        <div class="options-grid">
    `;

    question.options.forEach(opt => {
      html += `
        <button class="option-btn" data-score="${opt.score}">
          <span class="option-circle"></span>
          <span class="option-text">${opt.text}</span>
        </button>
      `;
    });

    html += `
        </div>
        <div class="quiz-nav">
          ${currentStep > 1 ? `<button id="btn-prev" class="btn-secondary">← Voltar</button>` : `<div></div>`}
        </div>
      </div>
    `;

    quizContainer.innerHTML = html;

    quizContainer.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        answers[question.id] = parseInt(btn.getAttribute('data-score'));
        btn.classList.add('active');
        setTimeout(() => {
          currentStep++;
          renderStep();
        }, 350);
      });
    });

    const prevBtn = document.getElementById('btn-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentStep--;
        renderStep();
      });
    }
  }

  /* =========== Tela 3: Gate Form ============ */
  function setupGateForm() {
    const form = document.getElementById('lp_diagnostico-email_conv');
    if (!form) return;

    populateUtmFields(form);

    const telInput = document.getElementById('gate-whatsapp');
    if (telInput) {
      telInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 11);
        if (v.length > 7)      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
        else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
        else if (v.length > 0) v = `(${v}`;
        e.target.value = v;
      });
    }

    form.querySelectorAll('[data-field]').forEach(input => {
      input.addEventListener(input.tagName === 'SELECT' ? 'change' : 'input', () => {
        if (input.classList.contains('is-error')) validateField(input, 'gate-');
      });
    });

    form.addEventListener('submit', (e) => {
      let hasError = false;
      let firstInvalid = null;

      form.querySelectorAll('[data-field]').forEach(input => {
        if (!validateField(input, 'gate-')) {
          hasError = true;
          if (!firstInvalid) firstInvalid = input;
        }
      });

      if (hasError) {
        e.preventDefault();
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      populateUtmFields(form);

      userData.nome    = document.getElementById('gate-nome').value.trim();
      userData.empresa = document.getElementById('gate-empresa').value.trim();
      userData.email   = document.getElementById('gate-email').value.trim();

      const utms = window.__yourhUtms || {};
      if (window.dataLayer) {
        window.dataLayer.push({
          event:                  'lead_form_submit',
          conversion_identifier:  'autodiagnostico-email-yourh',
          lead_email:             userData.email,
          lead_empresa:           userData.empresa,
          utm_source:             utms.utm_source   || undefined,
          utm_medium:             utms.utm_medium   || undefined,
          utm_campaign:           utms.utm_campaign || undefined,
        });
      }

      setTimeout(() => {
        currentStep++;
        renderStep();
      }, 200);
    });
  }

  /* =========== Tela 4: Processamento ============ */
  function renderProcessing() {
    showScreen('processing-screen');

    let progressCount = 0;
    const loaderBar  = document.getElementById('processing-bar');
    const procStatus = document.getElementById('processing-status');
    const statuses   = ['Somando as dimensões...', 'Avaliando maturidade...', 'Cruzando melhores práticas...', 'Gerando plano estratégico...'];

    const intv = setInterval(() => {
      progressCount += 2;
      if (loaderBar) loaderBar.style.width = `${progressCount}%`;
      if (progressCount % 25 === 0 && progressCount < 100) {
        if (procStatus) procStatus.innerText = statuses[Math.floor(progressCount / 25)];
      }
      if (progressCount >= 100) {
        clearInterval(intv);
        currentStep++;
        renderStep();
      }
    }, 40);
  }

  /* =========== Tela 5: Dashboard ============ */
  function renderDashboard() {
    showScreen('dashboard-screen');

    let totalScore = 0;
    Object.keys(answers).forEach(key => totalScore += answers[key]);

    const dimScores = diagnosticData.dimensions.map(d => {
      let sum = 0;
      d.questions.forEach(q => sum += (answers[q.id] || 0));
      return { id: d.id, title: d.title, score: sum };
    });

    const level = diagnosticData.levels.find(l => totalScore >= l.min && totalScore <= l.max) || diagnosticData.levels[0];

    document.getElementById('res-total-score').innerText = totalScore;
    document.getElementById('res-level-name').innerText  = level.name;
    document.getElementById('res-level-desc').innerText  = level.desc;
    document.getElementById('res-user-company').innerText = userData.empresa || 'Sua Empresa';

    const listEl = document.getElementById('res-dim-list');
    listEl.innerHTML = '';
    dimScores.forEach(ds => {
      const perc = (ds.score / 20) * 100;
      listEl.innerHTML += `
        <div class="res-dim-item">
          <div class="dim-info">
            <span class="dim-title">${ds.title}</span>
            <span class="dim-val">${ds.score}/20</span>
          </div>
          <div class="dim-bar-bg">
            <div class="dim-bar-fill" style="width: ${perc}%"></div>
          </div>
        </div>
      `;
    });

    const recList = document.getElementById('res-rec-list');
    recList.innerHTML = '';
    diagnosticData.recommendations.slice(0, 4).forEach(r => {
      recList.innerHTML += `
        <div class="rec-card">
          <div class="rec-head">
            <span class="rec-icon">${r.icon}</span>
            <h4>${r.area}</h4>
          </div>
          <p>${r.text}</p>
        </div>
      `;
    });

    const planEl = document.getElementById('res-plan-content');
    planEl.innerHTML = '';
    diagnosticData.plan.forEach(p => {
      planEl.innerHTML += `
        <div class="plan-phase">
          <div class="phase-badge">${p.phase}</div>
          <h5>${p.subtitle}</h5>
          <ul class="phase-items">
            ${p.items.map(it => `<li><span class="check">✔</span> ${it}</li>`).join('')}
          </ul>
        </div>
      `;
    });
  }

  // Init
  renderStep();
});
