/**
 * quiz.js
 * Quiz interativo "Patinho Feio ou Cisne?" — Campanha YouRH
 * Fluxo: intro → perguntas (uma por vez) → resultado
 */

(function () {
  'use strict';

  var QUESTIONS = [
    {
      id: 1,
      category: 'Avaliação de Desempenho',
      text: 'Hoje, como sua empresa avalia desempenho?',
      options: [
        { label: 'A', text: 'Não avaliamos formalmente', score: 0 },
        { label: 'B', text: 'Fazemos 1 vez por ano, de forma simples', score: 1 },
        { label: 'C', text: 'Fazemos avaliações periódicas, mas sem consistência', score: 2 },
        { label: 'D', text: 'Fazemos avaliações estruturadas com metas, critérios e acompanhamento', score: 3 }
      ]
    },
    {
      id: 2,
      category: 'Desenvolvimento e Treinamento',
      text: 'Como funciona o desenvolvimento do time?',
      options: [
        { label: 'A', text: 'Não existe treinamento estruturado', score: 0 },
        { label: 'B', text: 'Treinamos só quando aparece uma necessidade urgente', score: 1 },
        { label: 'C', text: 'Existem treinamentos, mas não são contínuos nem mensuráveis', score: 2 },
        { label: 'D', text: 'Temos trilhas de desenvolvimento e acompanhamento de evolução', score: 3 }
      ]
    },
    {
      id: 3,
      category: 'Liderança',
      text: 'Seus líderes estão preparados para gerir pessoas?',
      options: [
        { label: 'A', text: 'Não, cada líder faz do seu jeito', score: 0 },
        { label: 'B', text: 'Parcialmente, mas sem processo claro', score: 1 },
        { label: 'C', text: 'Temos algumas iniciativas, mas falta consistência', score: 2 },
        { label: 'D', text: 'Sim, líderes são treinados e acompanhados com clareza', score: 3 }
      ]
    },
    {
      id: 4,
      category: 'Retenção e Turnover',
      text: 'Como sua empresa lida com desligamentos e retenção?',
      options: [
        { label: 'A', text: 'Só reagimos quando alguém pede demissão', score: 0 },
        { label: 'B', text: 'Tentamos resolver caso a caso', score: 1 },
        { label: 'C', text: 'Fazemos ações pontuais, mas sem análise de causa', score: 2 },
        { label: 'D', text: 'Monitoramos indicadores e agimos preventivamente', score: 3 }
      ]
    },
    {
      id: 5,
      category: 'Plano de Carreira e PDI',
      text: 'Sua empresa tem PDI e plano de crescimento para colaboradores?',
      options: [
        { label: 'A', text: 'Não existe', score: 0 },
        { label: 'B', text: 'Existe informalmente, mas não é acompanhado', score: 1 },
        { label: 'C', text: 'Existe para algumas áreas', score: 2 },
        { label: 'D', text: 'Sim, temos PDI estruturado e revisado periodicamente', score: 3 }
      ]
    },
    {
      id: 6,
      category: 'Indicadores de Pessoas',
      text: 'Seu RH acompanha dados e indicadores?',
      options: [
        { label: 'A', text: 'Não acompanhamos', score: 0 },
        { label: 'B', text: 'Acompanhamos apenas turnover e absenteísmo', score: 1 },
        { label: 'C', text: 'Temos alguns dados, mas sem leitura estratégica', score: 2 },
        { label: 'D', text: 'Temos indicadores claros e relatórios para tomada de decisão', score: 3 }
      ]
    },
    {
      id: 7,
      category: 'Ferramentas e Processo',
      text: 'Como o RH opera hoje?',
      options: [
        { label: 'A', text: 'Tudo manual: planilha, papel e WhatsApp', score: 0 },
        { label: 'B', text: 'Parte em planilha, parte em ferramentas separadas', score: 1 },
        { label: 'C', text: 'Temos sistema, mas não é integrado', score: 2 },
        { label: 'D', text: 'Temos uma plataforma estruturada que centraliza tudo', score: 3 }
      ]
    },
    {
      id: 8,
      category: 'Tempo do RH',
      text: 'Hoje o RH consegue ser estratégico?',
      options: [
        { label: 'A', text: 'Não, vive apagando incêndio', score: 0 },
        { label: 'B', text: 'Raramente consegue planejar algo', score: 1 },
        { label: 'C', text: 'Às vezes, mas ainda falta estrutura', score: 2 },
        { label: 'D', text: 'Sim, o RH participa diretamente do crescimento e estratégia', score: 3 }
      ]
    }
  ];

  var RESULTS = [
    {
      min: 0, max: 8,
      type: 'ugly',
      emoji: '🐥',
      badge: 'Patinho Feio',
      title: 'Seu RH está no modo sobrevivência.',
      subtitle: 'Resultado: Patinho Feio',
      desc: 'O RH provavelmente está sobrecarregado, com pouco processo e sem ferramentas para atuar de forma estratégica. Isso tem um custo direto no crescimento da empresa.',
      issuesTitle: 'Isso geralmente causa:',
      issues: [
        'Turnover alto e perda de talentos',
        'Falta de liderança preparada',
        'Baixa produtividade no time',
        'Crescimento desorganizado'
      ],
      goodNews: '✅ A boa notícia: com estrutura e processo, isso muda rápido.',
      cta: 'Quero receber um plano de ação gratuito',
      ctaHref: '#form'
    },
    {
      min: 9, max: 16,
      type: 'forming',
      emoji: '🦢',
      badge: 'Cisne em Formação',
      title: 'Seu RH está evoluindo, mas falta consistência.',
      subtitle: 'Resultado: Cisne em Formação',
      desc: 'Você já tem algumas iniciativas, mas ainda existem gargalos que impedem o RH de gerar impacto contínuo e previsível. O potencial está lá — falta estrutura para ativá-lo.',
      issuesTitle: 'Próximos passos recomendados:',
      issues: [
        'Padronizar avaliação e desenvolvimento',
        'Criar trilhas e indicadores de pessoas',
        'Estruturar PDI e gestão de liderança'
      ],
      goodNews: '✅ Você está no caminho certo. Um processo claro muda o jogo.',
      cta: 'Receber plano de evolução em 90 dias',
      ctaHref: '#form'
    },
    {
      min: 17, max: 24,
      type: 'star',
      emoji: '🦢',
      badge: 'Cisne em Destaque',
      title: 'Seu RH já é uma vantagem competitiva.',
      subtitle: 'Resultado: Cisne em Destaque',
      desc: 'Sua empresa já possui estrutura, acompanhamento e maturidade para desenvolver pessoas e crescer com consistência. Você está à frente da maioria das empresas do mercado.',
      issuesTitle: 'Para ir ainda mais longe:',
      issues: [
        'Automatizar ainda mais os processos de RH',
        'Integrar performance e aprendizagem',
        'Escalar cultura e liderança para toda a organização'
      ],
      goodNews: '✅ Você já venceu a maioria. Agora é hora de escalar.',
      cta: 'Ver como escalar com a YouRH',
      ctaHref: '#form'
    }
  ];

  // ── Estado ────────────────────────────────────────────────────

  var state = {
    current:      0,
    answers:      [],
    advanceTimer: null
  };

  // ── Referências DOM ───────────────────────────────────────────

  var els = {};

  function getEl(id) { return document.getElementById(id); }

  // ── Init ──────────────────────────────────────────────────────

  function init() {
    els.stateIntro     = getEl('quiz-state-intro');
    els.stateQuestions = getEl('quiz-state-questions');
    els.stateResult    = getEl('quiz-state-result');
    els.startBtn       = getEl('quiz-start-btn');
    els.progressFill   = getEl('quiz-progress-fill');
    els.progressText   = getEl('quiz-progress-text');
    els.questionsWrap  = getEl('quiz-questions-container');

    if (!els.stateIntro) return;

    if (els.startBtn) {
      els.startBtn.addEventListener('click', startQuiz);
    }
  }

  // ── Fluxo ─────────────────────────────────────────────────────

  function startQuiz() {
    state.current  = 0;
    state.answers  = [];

    showState('questions');
    renderQuestion(0);
    fireDataLayer({ event: 'quiz_start' });
  }

  function showState(name) {
    var map = {
      intro:     els.stateIntro,
      questions: els.stateQuestions,
      result:    els.stateResult
    };

    Object.keys(map).forEach(function (key) {
      var el = map[key];
      if (!el) return;
      if (key === name) {
        el.classList.remove('quiz-state--hidden');
      } else {
        el.classList.add('quiz-state--hidden');
      }
    });
  }

  // ── Renderização da Pergunta ──────────────────────────────────

  function renderQuestion(index) {
    var q = QUESTIONS[index];
    if (!q || !els.questionsWrap) return;

    var progress = (index / QUESTIONS.length) * 100;
    if (els.progressFill) els.progressFill.style.width = progress + '%';
    if (els.progressText) els.progressText.textContent = 'Pergunta ' + (index + 1) + ' de ' + QUESTIONS.length;

    var optionsHtml = q.options.map(function (opt) {
      return '<button class="quiz-option" data-score="' + opt.score + '" aria-label="' + escapeAttr(opt.text) + '">' +
        '<span class="quiz-option__letter" aria-hidden="true">' + opt.label + '</span>' +
        '<span class="quiz-option__text">' + escapeHtml(opt.text) + '</span>' +
        '</button>';
    }).join('');

    els.questionsWrap.innerHTML =
      '<div class="quiz-question">' +
        '<span class="quiz-question__category">' + escapeHtml(q.category) + '</span>' +
        '<h3 class="quiz-question__text">' + escapeHtml(q.text) + '</h3>' +
        '<div class="quiz-options" role="group" aria-label="Opções de resposta">' + optionsHtml + '</div>' +
      '</div>';

    els.questionsWrap.querySelectorAll('.quiz-option').forEach(function (btn) {
      btn.addEventListener('click', function () {
        onOptionClick(btn, parseInt(btn.dataset.score, 10));
      });
    });

    // Foca no container para acessibilidade
    els.questionsWrap.setAttribute('tabindex', '-1');
    els.questionsWrap.focus();
  }

  // ── Seleção de Opção ─────────────────────────────────────────

  function onOptionClick(btn, score) {
    if (state.advanceTimer) return; // Já avançando, ignora cliques duplos

    var allOptions = els.questionsWrap.querySelectorAll('.quiz-option');
    allOptions.forEach(function (b) { b.disabled = true; });
    btn.classList.add('is-selected');

    fireDataLayer({
      event:         'quiz_answer',
      quiz_question: state.current + 1,
      quiz_score:    score
    });

    state.advanceTimer = setTimeout(function () {
      state.advanceTimer = null;
      state.answers.push(score);
      state.current++;

      if (state.current >= QUESTIONS.length) {
        showResult();
      } else {
        renderQuestion(state.current);
      }
    }, 650);
  }

  // ── Resultado ─────────────────────────────────────────────────

  function showResult() {
    var total = state.answers.reduce(function (sum, s) { return sum + s; }, 0);
    var maxScore = QUESTIONS.length * 3;

    var result = null;
    for (var i = 0; i < RESULTS.length; i++) {
      if (total >= RESULTS[i].min && total <= RESULTS[i].max) {
        result = RESULTS[i];
        break;
      }
    }
    if (!result) result = RESULTS[0];

    if (els.progressFill) els.progressFill.style.width = '100%';
    if (els.progressText) els.progressText.textContent = 'Concluído!';

    var issuesHtml = result.issues.map(function (issue) {
      return '<li>' + escapeHtml(issue) + '</li>';
    }).join('');

    els.stateResult.innerHTML =
      '<div class="quiz-result" role="status" aria-live="polite">' +
        '<span class="quiz-result__emoji" aria-hidden="true">' + result.emoji + '</span>' +
        '<div class="quiz-result__badge quiz-result__badge--' + result.type + '">' + escapeHtml(result.badge) + '</div>' +
        '<h3 class="quiz-result__title">' + escapeHtml(result.title) + '</h3>' +
        '<p class="quiz-result__subtitle">' + escapeHtml(result.subtitle) + '</p>' +
        '<p class="quiz-result__desc">' + escapeHtml(result.desc) + '</p>' +
        '<div class="quiz-result__issues">' +
          '<p class="quiz-result__issues-title">📌 ' + escapeHtml(result.issuesTitle) + '</p>' +
          '<ul class="quiz-result__issues-list">' + issuesHtml + '</ul>' +
        '</div>' +
        '<p class="quiz-result__good-news">' + result.goodNews + '</p>' +
        '<div class="quiz-result__actions">' +
          '<a href="' + result.ctaHref + '" class="btn btn--primary btn--lg">' + escapeHtml(result.cta) + '</a>' +
          '<button class="quiz-result__restart" id="quiz-restart-btn" type="button">Refazer o quiz</button>' +
        '</div>' +
        '<p class="quiz-result__score">Sua pontuação: ' + total + ' de ' + maxScore + '</p>' +
      '</div>';

    showState('result');

    var restartBtn = document.getElementById('quiz-restart-btn');
    if (restartBtn) restartBtn.addEventListener('click', startQuiz);

    fireDataLayer({
      event:        'quiz_complete',
      quiz_result:  result.type,
      quiz_badge:   result.badge,
      quiz_score:   total,
      quiz_max:     maxScore
    });

    // Scrolla suavemente para o card
    var card = document.querySelector('.quiz-card');
    if (card) {
      setTimeout(function () {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 120);
    }
  }

  // ── Helpers ───────────────────────────────────────────────────

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function fireDataLayer(data) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);
  }

  // ── Boot ──────────────────────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
