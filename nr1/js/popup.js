/**
 * popup.js
 * Modal de obrigado para autodiagnóstico, calculadora e formulário lead.
 * Dispara eventos GTM (dataLayer) ao abrir cada tipo.
 */

(function () {
  'use strict';

  var CONFIGS = {
    diagnostico: {
      badge: 'Diagnóstico concluído',
      title: 'Você mapeou suas lacunas!',
      desc:  'Agora você sabe onde sua empresa está exposta. Fale com um especialista e resolva antes de maio.',
      cta:   'Quero resolver com um especialista',
      ctaHref: '#form',
      steps: [
        'Suas lacunas foram identificadas — revise o resultado abaixo.',
        'Um especialista vai ajudar a priorizar as ações certas.',
        'Sem compromisso. Só uma conversa direta sobre a NR-1.',
      ],
      gtmEvent: 'diagnostico_concluido',
    },
    calculadora: {
      badge: 'Simulação realizada',
      title: 'Você conhece sua exposição!',
      desc:  'Com base nas infrações selecionadas, sua empresa tem risco real de autuação. Fale com um especialista antes que seja tarde.',
      cta:   'Quero me proteger com um especialista',
      ctaHref: '#form',
      steps: [
        'O valor foi calculado com base nos critérios da NR-28.',
        'Um especialista pode ajudar a reduzir essa exposição.',
        'Sem compromisso. Só uma conversa direta sobre a NR-1.',
      ],
      gtmEvent: 'calculadora_concluida',
    },
    formulario: {
      badge: 'Mensagem recebida',
      title: 'Recebemos seu contato!',
      desc:  'Um especialista YouRH vai entrar em contato em até 1 dia útil.',
      cta:   'Voltar para a página',
      ctaHref: '#hero',
      steps: [
        'Verifique sua caixa de entrada — você deve receber uma confirmação em breve.',
        'Na conversa, vamos mapear o nível de conformidade atual da sua empresa.',
        'Nenhum compromisso de compra. Só uma conversa direta sobre a NR-1.',
      ],
      gtmEvent: 'formulario_enviado',
    },
  };

  // ── GTM ──────────────────────────────────────────────────────────
  function fireGtmEvent(eventName, extra) {
    window.dataLayer = window.dataLayer || [];
    var payload = { event: eventName };
    if (extra) {
      Object.keys(extra).forEach(function (k) { payload[k] = extra[k]; });
    }
    window.dataLayer.push(payload);
  }

  // ── ABRIR ────────────────────────────────────────────────────────
  function open(type, extra) {
    var cfg = CONFIGS[type];
    if (!cfg) return;

    var modal = document.getElementById('obrigado-modal');
    if (!modal) return;

    // Preenche conteúdo dinâmico
    modal.querySelector('.omodal-badge-text').textContent = cfg.badge;
    modal.querySelector('.omodal-title').textContent      = cfg.title;
    modal.querySelector('.omodal-desc').textContent       = cfg.desc;

    var ctaEl = modal.querySelector('.omodal-cta');
    ctaEl.textContent = cfg.cta;
    ctaEl.href        = cfg.ctaHref;

    modal.querySelector('.omodal-steps').innerHTML = cfg.steps.map(function (s) {
      return (
        '<div class="omodal-step">' +
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
            '<path d="M2 8l4 4 8-8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
          '</svg>' +
          s +
        '</div>'
      );
    }).join('');

    // Dispara evento GTM
    fireGtmEvent(cfg.gtmEvent, extra);

    // Exibe o modal
    modal.removeAttribute('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('omodal-open');

    // Foco no dialog para acessibilidade
    var dialog = modal.querySelector('.omodal__dialog');
    if (dialog) dialog.focus();
  }

  // ── FECHAR ───────────────────────────────────────────────────────
  function close() {
    var modal = document.getElementById('obrigado-modal');
    if (!modal) return;
    modal.setAttribute('hidden', '');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('omodal-open');
  }

  // ── INICIALIZAÇÃO ────────────────────────────────────────────────
  function init() {
    var modal = document.getElementById('obrigado-modal');
    if (!modal) return;

    // Fechar ao clicar no overlay (fora do dialog)
    modal.addEventListener('click', function (e) {
      if (e.target === modal) close();
    });

    // Fechar com Esc
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hasAttribute('hidden')) close();
    });

    // Botão ×
    var closeBtn = modal.querySelector('.omodal-close');
    if (closeBtn) closeBtn.addEventListener('click', close);

    // CTA "ir para o formulário": fecha modal antes de navegar
    var ctaEl = modal.querySelector('.omodal-cta');
    if (ctaEl) {
      ctaEl.addEventListener('click', function () {
        close();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // API global
  window.YouRHPopup = { open: open, close: close };
})();
