/**
 * checklist.js
 * Diagnóstico interativo por grupo + resultado dinâmico baseado nas lacunas.
 *
 * ⚠️ TODO: substitua os GROUPS e os itens do HTML (index.html) pelos
 * conteúdos específicos desta LP.
 *
 * COMO FUNCIONA:
 * 1. Cada grupo (fieldset[data-group]) tem N checkboxes.
 * 2. O total de itens por grupo deve bater com o campo `total` do GROUPS abaixo.
 * 3. Cada checkbox tem um atributo data-lacuna com a mensagem exibida quando
 *    o item NÃO está marcado — diz ao lead o que ele está perdendo.
 * 4. O resultado aparece dinamicamente conforme o usuário marca/desmarca itens.
 * 5. Os níveis de risco (RISK_LEVELS) usam faixas de pontuação — ajuste os
 *    textos se mudar o número total de itens.
 *
 * SINCRONIZAÇÃO COM O HTML:
 * - O `id` em data-group="X" do fieldset deve bater com o `id` aqui no GROUPS.
 * - O `total` deve bater com o número de checkboxes dentro do fieldset.
 * - O total geral (soma de todos os `total`) deve bater com o aria-valuemax
 *   do .checklist-progress__bar no HTML.
 */

(function () {
  'use strict';

  // ⚠️ TODO: substitua pelos grupos reais desta LP
  // id       → deve bater com data-group="X" no HTML
  // label    → nome exibido nos badges de resultado
  // total    → número de checkboxes dentro deste grupo no HTML
  // lacuna   → mensagem de lacuna genérica do grupo (fallback)
  var GROUPS = [
    {
      id:    'grupo1',
      label: 'Atração e Integração',
      total: 3,
      lacuna: 'Seu processo de atração e integração precisa ser estruturado para reduzir a saída precoce de colaboradores.',
    },
    {
      id:    'grupo2',
      label: 'Desenvolvimento e Liderança',
      total: 3,
      lacuna: 'Gestores despreparados e ausência de desenvolvimento são as principais causas de pedidos de demissão voluntária.',
    },
    {
      id:    'grupo3',
      label: 'Cultura e Retenção',
      total: 4,
      lacuna: 'Sem monitoramento de clima, trilha de carreira e remuneração competitiva, os melhores talentos vão embora.',
    },
  ];

  // ⚠️ TODO: ajuste os textos de acordo com o tema desta LP.
  // As faixas numéricas (range) devem cobrir de 0 até o total de itens (soma dos `total` acima).
  // Exemplo com 10 itens: [0,3] | [4,6] | [7,9] | [10,10]
  var RISK_LEVELS = [
    {
      range: [0, 3],
      type:  'danger',
      title: 'Risco crítico: sua empresa está vulnerável ao turnover. Aja agora.',
      cta:   'Quero um diagnóstico urgente',
    },
    {
      range: [4, 6],
      type:  'warning',
      title: 'Risco moderado: há lacunas relevantes que impulsionam a rotatividade.',
      cta:   'Revisar as lacunas com especialista',
    },
    {
      range: [7, 9],
      type:  'warning',
      title: 'Boa base, mas ainda há pontos cegos que podem custar caro.',
      cta:   'Validar os pontos restantes',
    },
    {
      range: [10, 10],
      type:  'ok',
      title: 'Cobertura completa! Vale uma conversa para confirmar e evoluir.',
      cta:   'Confirmar com especialista',
    },
  ];

  // ─── A PARTIR DAQUI NÃO É NECESSÁRIO ALTERAR ────────────────────

  function getRiskLevel(count) {
    return RISK_LEVELS.find(function (r) {
      return count >= r.range[0] && count <= r.range[1];
    });
  }

  function getGroupScores() {
    var scores = {};
    GROUPS.forEach(function (group) {
      var fieldset = document.querySelector('[data-group="' + group.id + '"]');
      if (!fieldset) return;
      var checked = fieldset.querySelectorAll('input[type="checkbox"]:checked').length;
      scores[group.id] = { checked: checked, total: group.total };
    });
    return scores;
  }

  function getWeakGroups(scores) {
    return GROUPS.filter(function (group) {
      var s = scores[group.id];
      if (!s) return false;
      return s.checked < s.total;
    });
  }

  function getItemLacunas(groupId) {
    var fieldset = document.querySelector('[data-group="' + groupId + '"]');
    if (!fieldset) return [];
    var unchecked = fieldset.querySelectorAll('input[type="checkbox"]:not(:checked)');
    var lacunas = [];
    unchecked.forEach(function (cb) {
      if (cb.dataset.lacuna) lacunas.push(cb.dataset.lacuna);
    });
    return lacunas;
  }

  function buildGapsHTML(weakGroups, scores) {
    if (!weakGroups.length) return '';

    var badges = GROUPS.map(function (group) {
      var s = scores[group.id] || { checked: 0, total: group.total };
      var isWeak = weakGroups.some(function (w) { return w.id === group.id; });
      var cls = isWeak ? 'gap-badge gap-badge--weak' : 'gap-badge gap-badge--ok';
      var icon = isWeak
        ? '<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5h6M5 2v6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
        : '<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
      return '<span class="' + cls + '">' + icon + group.label + ' (' + s.checked + '/' + s.total + ')</span>';
    }).join('');

    var lacunaBlocks = weakGroups.map(function (group) {
      var items = getItemLacunas(group.id);
      if (!items.length) return '';
      var listItems = items.map(function (msg) {
        return '<li class="gaps-item">' + msg + '</li>';
      }).join('');
      return (
        '<div class="gaps-group">' +
          '<p class="gaps-group__label">' + group.label + '</p>' +
          '<ul class="gaps-list">' + listItems + '</ul>' +
        '</div>'
      );
    }).join('');

    return (
      '<p class="gaps-label">Lacunas identificadas:</p>' +
      '<div class="gaps-badges">' + badges + '</div>' +
      lacunaBlocks
    );
  }

  function handleChange() {
    var allCheckboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    var totalChecked  = 0;

    allCheckboxes.forEach(function (cb) {
      var item = cb.closest('.checklist-item');
      if (cb.checked) {
        totalChecked++;
        if (item) item.classList.add('is-checked');
      } else {
        if (item) item.classList.remove('is-checked');
      }
    });

    updateProgress(totalChecked);
    updateResult(totalChecked);
  }

  function updateProgress(checked) {
    var countEl = document.getElementById('checklist-count');
    var fillEl  = document.getElementById('checklist-fill');
    var barEl   = document.querySelector('.checklist-progress__bar');
    var total   = allCheckboxes().length || 10;

    if (countEl) countEl.textContent = checked + '/' + total;
    if (fillEl)  fillEl.style.width  = (checked / total * 100) + '%';
    if (barEl)   barEl.setAttribute('aria-valuenow', checked);
  }

  function allCheckboxes() {
    return document.querySelectorAll('.checklist-item input[type="checkbox"]');
  }

  function updateResult(checked) {
    var resultEl = document.getElementById('checklist-result');
    var titleEl  = document.getElementById('checklist-result-title');
    var gapsEl   = document.getElementById('checklist-result-gaps');
    var descEl   = document.getElementById('checklist-result-desc');
    var ctaEl    = document.getElementById('checklist-result-cta');

    if (!resultEl) return;

    if (checked === 0) {
      resultEl.classList.remove('is-visible', 'checklist-result--danger', 'checklist-result--warning', 'checklist-result--ok');
      return;
    }

    var level      = getRiskLevel(checked);
    var scores     = getGroupScores();
    var weakGroups = getWeakGroups(scores);

    resultEl.classList.remove('checklist-result--danger', 'checklist-result--warning', 'checklist-result--ok');
    resultEl.classList.add('checklist-result--' + level.type, 'is-visible');

    if (titleEl) titleEl.textContent = level.title;
    if (ctaEl)   { ctaEl.textContent = level.cta; ctaEl.href = '#form'; }

    if (gapsEl) {
      gapsEl.innerHTML = weakGroups.length > 0
        ? buildGapsHTML(weakGroups, scores)
        : '<p class="gaps-desc gaps-desc--ok">Todos os grupos com boa cobertura. Uma conversa com especialista pode validar os detalhes.</p>';
    }

    if (descEl) descEl.style.display = 'none';
  }

  function bindCheckboxes() {
    allCheckboxes().forEach(function (cb) {
      cb.addEventListener('change', handleChange);
    });
  }

  function init() {
    var checklistEl = document.getElementById('checklist');
    if (!checklistEl) return;
    bindCheckboxes();
    updateProgress(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
