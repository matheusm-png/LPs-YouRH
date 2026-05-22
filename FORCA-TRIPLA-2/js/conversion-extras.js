/**
 * conversion-extras.js
 * Apenas extras necessários para a nova LP:
 * - Parallax leve em elementos com [data-parallax-bg]
 * - Garante que o vídeo do hero inicia em loop em viewports onde autoplay é restrito
 */
(function () {
  'use strict';

  // Parallax leve
  var els = document.querySelectorAll('[data-parallax-bg]');
  if (els.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        els.forEach(function (el) {
          var rect = el.getBoundingClientRect();
          var speed = parseFloat(el.dataset.parallaxBg) || 0.2;
          // Move o background-position conforme a posição na viewport
          var offset = (rect.top * speed);
          el.style.transform = 'translate3d(0,' + (offset * -0.3).toFixed(1) + 'px,0)';
        });
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Hero video — garantir autoplay
  var heroVideo = document.querySelector('.hero-cine__video');
  if (heroVideo) {
    heroVideo.muted = true;
    var tryPlay = function () { heroVideo.play().catch(function () {}); };
    tryPlay();
    document.addEventListener('click', tryPlay, { once: true });
    document.addEventListener('touchstart', tryPlay, { once: true });
  }
})();
