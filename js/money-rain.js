/**
 * money-rain.js
 * Cédulas e moedas caindo ao scroll — LP Turnover YouRH
 * Dispara uma única vez quando o usuário passa do hero.
 */
(function () {
  'use strict';

  var particles = [];
  var rafId = null;
  var spawning = false;
  var triggered = false;
  var spawnInterval = null;

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  /* ── SVGs das cédulas e moedas ─────────────────────────── */

  function makeBillSVG(size) {
    var w = Math.round(size * 1.75);
    var h = size;
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 70 40">' +
        '<rect x="1" y="1" width="68" height="38" rx="4" fill="#091609" stroke="#00C853" stroke-width="1.8"/>' +
        '<rect x="5" y="5" width="60" height="30" rx="2" fill="none" stroke="#00C853" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.4"/>' +
        '<circle cx="35" cy="20" r="9" fill="none" stroke="#00C853" stroke-width="0.8" opacity="0.35"/>' +
        '<text x="35" y="25.5" text-anchor="middle" font-family="Georgia,serif" font-size="18" font-weight="bold" fill="#00C853">$</text>' +
        '<rect x="5" y="8" width="14" height="8" rx="2" fill="#00C853" opacity="0.15"/>' +
        '<rect x="51" y="24" width="14" height="8" rx="2" fill="#00C853" opacity="0.15"/>' +
      '</svg>'
    );
  }

  function makeCoinSVG(size) {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 40 40">' +
        '<circle cx="20" cy="20" r="19" fill="#1A1000" stroke="#D4A017" stroke-width="2"/>' +
        '<circle cx="20" cy="20" r="14" fill="none" stroke="#D4A017" stroke-width="0.6" opacity="0.4"/>' +
        '<text x="20" y="26" text-anchor="middle" font-family="Georgia,serif" font-size="17" font-weight="bold" fill="#D4A017">$</text>' +
      '</svg>'
    );
  }

  /* ── Criação de partícula ──────────────────────────────── */

  function spawnParticle() {
    var isBill = Math.random() > 0.38;
    var size   = isBill ? rand(32, 52) : rand(22, 36);
    var svg    = isBill ? makeBillSVG(size) : makeCoinSVG(size);

    var el = document.createElement('div');
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText =
      'position:fixed;top:0;left:0;z-index:9997;pointer-events:none;' +
      'user-select:none;will-change:transform,opacity;opacity:0;';
    el.innerHTML = svg;
    document.body.appendChild(el);

    var startX = rand(20, window.innerWidth - 80);
    var p = {
      el:       el,
      x:        startX,
      y:        rand(-120, -10),
      vx:       rand(-0.9, 0.9),
      vy:       rand(1.8, 4.0),
      rot:      rand(0, 360),
      vr:       rand(-3, 3),
      opacity:  0,
      fadeIn:   true,
      fadeOut:  false,
    };
    particles.push(p);
  }

  /* ── Loop de animação ──────────────────────────────────── */

  function tick() {
    var any = particles.length > 0 || spawning;
    var h   = window.innerHeight;

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];

      p.y   += p.vy;
      p.x   += p.vx;
      p.rot += p.vr;

      if (p.fadeIn) {
        p.opacity = Math.min(0.92, p.opacity + 0.07);
        if (p.opacity >= 0.92) p.fadeIn = false;
      }

      if (!p.fadeOut && p.y > h - 20) {
        p.fadeOut = true;
        p.fadeIn  = false;
      }

      if (p.fadeOut) {
        p.opacity -= 0.035;
        if (p.opacity <= 0) {
          if (p.el.parentNode) p.el.parentNode.removeChild(p.el);
          particles.splice(i, 1);
          continue;
        }
      }

      p.el.style.opacity   = p.opacity;
      p.el.style.transform =
        'translate(' + p.x.toFixed(1) + 'px,' + p.y.toFixed(1) + 'px) rotate(' + p.rot.toFixed(1) + 'deg)';
    }

    if (any) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  }

  /* ── Disparar chuva ────────────────────────────────────── */

  function startRain() {
    if (triggered) return;
    triggered = true;

    spawning = true;
    var count = 0;
    var total = 32;

    // Spawn as primeiras 8 partículas de uma vez para impacto imediato
    for (var i = 0; i < 8; i++) { spawnParticle(); count++; }

    spawnInterval = setInterval(function () {
      if (count >= total) {
        clearInterval(spawnInterval);
        spawning = false;
        return;
      }
      spawnParticle();
      count++;
    }, 60);

    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  /* ── Watcher de scroll ─────────────────────────────────── */

  function onScroll() {
    if (triggered) {
      window.removeEventListener('scroll', onScroll);
      return;
    }
    // Dispara assim que o usuário scrollar qualquer coisa (> 60px)
    if (window.pageYOffset > 60) {
      startRain();
    }
  }

  function init() {
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
