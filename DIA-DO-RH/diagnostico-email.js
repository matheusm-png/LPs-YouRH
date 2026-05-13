document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 0; // 0: intro, 1..25: quiz, 26: processing, 27: results
  const answers = {};

  const totalQuestions = diagnosticData.dimensions.reduce((acc, dim) => acc + dim.questions.length, 0);
  const allQuestions   = diagnosticData.dimensions.flatMap(dim => dim.questions);

  const quizContainer = document.getElementById('quiz-content');
  const progressBar   = document.getElementById('progress-bar-fill');
  const progressText  = document.getElementById('progress-text');

  function showScreen(id) {
    ['intro-screen','quiz-screen','processing-screen','dashboard-screen'].forEach(s => {
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

  /* Tela 1: Intro */
  const btnStart = document.getElementById('btn-start-quiz');
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      currentStep = 1;
      renderStep();
    });
  }

  /* Tela 2: Quiz */
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

  /* Tela 3: Processamento */
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

  /* Tela 4: Dashboard */
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

    document.getElementById('res-total-score').innerText  = totalScore;
    document.getElementById('res-level-name').innerText   = level.name;
    document.getElementById('res-level-desc').innerText   = level.desc;
    document.getElementById('res-user-company').innerText = 'Seu RH';

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

  renderStep();
});
