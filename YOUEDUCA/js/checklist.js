/**
 * checklist.js — YouEduca
 * Diagnóstico de T&D: 3 grupos, 10 itens
 * Resultado dinâmico baseado nas lacunas reais identificadas
 */

(function () {
  'use strict';

  var GROUPS = [
    {
      id:    'estrutura',
      label: 'Estrutura de T&D',
      total: 3,
      lacuna: 'A estrutura de treinamento não está organizada para escalar com a empresa.',
    },
    {
      id:    'engajamento',
      label: 'Engajamento e Acompanhamento',
      total: 3,
      lacuna: 'Sem dados de engajamento, é impossível saber se o treinamento está gerando impacto.',
    },
    {
      id:    'integracao',
      label: 'Integração e Resultados',
      total: 4,
      lacuna: 'O T&D está desconectado da estratégia e não gera evidência de ROI para a diretoria.',
    },
  ];

  var RISK_LEVELS = [
    {
      range: [0, 3],
      type:  'danger',
      title: 'Crítico: sua empresa não tem uma cultura de aprendizado estruturada',
      cta:   'Quero estruturar o T&D da minha empresa',
    },
    {
      range: [4, 6],
      type:  'warning',
      title: 'Em desenvolvimento: há lacunas importantes que travam o crescimento',
      cta:   'Revisar com um especialista YouEduca',
    },
    {
      range: [7, 9],
      type:  'warning',
      title: 'Quase lá, mas ainda faltam pontos essenciais',
      cta:   'Validar os pontos restantes com especialista',
    },
    {
      range: [10, 10],
      type:  'ok',
      title: 'Excelente! Sua empresa tem uma base sólida de T&D.',
      cta:   'Conhecer o YouEduca e potencializar ainda mais',
    },
  ];

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

  function allCheckboxes() {
    return document.querySelectorAll('.checklist-item input[type="checkbox"]');
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
        : '<p class="gaps-desc gaps-desc--ok">Todos os grupos com boa cobertura. Uma conversa com especialista pode potencializar ainda mais.</p>';
    }

    if (descEl) descEl.style.display = 'none';
  }

  function handleChange() {
    var total = 0;
    allCheckboxes().forEach(function (cb) {
      var item = cb.closest('.checklist-item');
      if (cb.checked) {
        total++;
        if (item) item.classList.add('is-checked');
      } else {
        if (item) item.classList.remove('is-checked');
      }
    });
    updateProgress(total);
    updateResult(total);
  }

  function init() {
    var checklistEl = document.getElementById('checklist');
    if (!checklistEl) return;
    allCheckboxes().forEach(function (cb) {
      cb.addEventListener('change', handleChange);
    });
    updateProgress(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
