/**
 * checklist.js
 * Diagnóstico interativo — Os Heróis do RH
 * Grupos: Avaliação de Desempenho | 9Box | Desenvolvimento
 * Total: 10 itens
 */

(function () {
  'use strict';

  var GROUPS = [
    {
      id:     'grupo1',
      label:  'Avaliação de Desempenho',
      total:  4,
      lacuna: 'Sem avaliação estruturada, o RH perde a capacidade de agir sobre performance',
    },
    {
      id:     'grupo2',
      label:  'Mapeamento de Talentos',
      total:  3,
      lacuna: 'Sem mapeamento de talentos, a empresa não sabe em quem investir ou quem pode liderar',
    },
    {
      id:     'grupo3',
      label:  'Desenvolvimento e Capacitação',
      total:  3,
      lacuna: 'Sem estrutura de desenvolvimento, o treinamento consome orçamento sem gerar resultado',
    },
  ];

  var RISK_LEVELS = [
    {
      range: [0, 3],
      type:  'danger',
      title: 'Risco alto: seu RH ainda não tem as ferramentas essenciais',
      cta:   'Quero estruturar meu RH agora',
    },
    {
      range: [4, 6],
      type:  'warning',
      title: 'Risco moderado: há lacunas importantes que limitam o crescimento',
      cta:   'Quero resolver essas lacunas',
    },
    {
      range: [7, 9],
      type:  'warning',
      title: 'Quase lá: você está no caminho certo, mas ainda há pontos para estruturar',
      cta:   'Quero fechar os pontos em aberto',
    },
    {
      range: [10, 10],
      type:  'ok',
      title: 'Excelente! Seu RH tem uma base sólida — descubra como ir ainda mais longe',
      cta:   'Quero o Kit dos Heróis',
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
        : '<p class="gaps-desc gaps-desc--ok">Todos os grupos com boa cobertura. O Kit dos Heróis vai te ajudar a ir ainda mais longe.</p>';
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
