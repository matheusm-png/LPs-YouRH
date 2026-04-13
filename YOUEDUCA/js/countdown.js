/**
 * countdown.js — YouEduca
 * Regressivo até 30/06/2026 00:00:00 (horário de Brasília, UTC-3)
 * Oferta especial: implantação gratuita para contratos fechados até essa data
 */

(function () {
  'use strict';

  var TARGET_DATE = new Date('2026-06-30T00:00:00-03:00');

  var els = {
    days:    document.getElementById('countdown-days'),
    hours:   document.getElementById('countdown-hours'),
    minutes: document.getElementById('countdown-minutes'),
    seconds: document.getElementById('countdown-seconds'),
    wrapper: document.getElementById('countdown-wrapper'),
    expired: document.getElementById('countdown-expired'),
  };

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  var timer;

  function tick() {
    var now  = new Date();
    var diff = TARGET_DATE - now;

    if (diff <= 0) {
      handleExpired();
      return;
    }

    var totalSeconds = Math.floor(diff / 1000);
    var days         = Math.floor(totalSeconds / 86400);
    var hours        = Math.floor((totalSeconds % 86400) / 3600);
    var minutes      = Math.floor((totalSeconds % 3600) / 60);
    var seconds      = totalSeconds % 60;

    if (els.days)    els.days.textContent    = pad(days);
    if (els.hours)   els.hours.textContent   = pad(hours);
    if (els.minutes) els.minutes.textContent = pad(minutes);
    if (els.seconds) els.seconds.textContent = pad(seconds);

    if (days < 7 && els.wrapper) {
      els.wrapper.classList.add('countdown-urgent');
    }
  }

  function handleExpired() {
    clearInterval(timer);
    if (els.wrapper) els.wrapper.style.display = 'none';
    if (els.expired) {
      els.expired.style.display = 'block';
      els.expired.textContent = 'Oferta encerrada';
    }
  }

  function init() {
    if (!els.days && !els.hours) return;
    tick();
    timer = setInterval(tick, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
