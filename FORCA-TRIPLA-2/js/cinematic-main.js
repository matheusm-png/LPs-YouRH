/**
 * cinematic-main.js
 * Scroll storytelling: progress bar, header, reveals, scroll stages,
 * parallax, counters, FAQ, stagger, mobile nav.
 */
(function () {
  'use strict';

  /* ── UTILITIES ─────────────────────────────────────────────────── */
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function lerp(a, b, t)      { return a + (b - a) * clamp(t, 0, 1); }
  function rng(p, s, e)       { return clamp((p - s) / (e - s), 0, 1); } // range 0→1

  /* ── SCROLL PROGRESS BAR ────────────────────────────────────────── */
  const progressBar = document.querySelector('.scroll-progress');
  function updateProgress() {
    if (!progressBar) return;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (h > 0 ? window.scrollY / h * 100 : 0) + '%';
  }

  /* ── HEADER SCROLL STATE ────────────────────────────────────────── */
  const header = document.querySelector('.cin-header');
  function updateHeader() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 60);
  }

  /* ── SCROLL REVEALS (IntersectionObserver) ──────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── STAGGER CHILDREN ───────────────────────────────────────────── */
  document.querySelectorAll('.stagger-children').forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      child.style.transitionDelay = (i * 0.1) + 's';
    });
  });

  /* ── COUNTER ANIMATION ──────────────────────────────────────────── */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.counted) return;
      el.dataset.counted = '1';
      const target   = parseInt(el.dataset.count, 10);
      const prefix   = el.dataset.prefix || '';
      const suffix   = el.dataset.suffix || '';
      const duration = 1600;
      const start    = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = prefix + Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  /* ── FAQ ACCORDION ──────────────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-item').forEach(other => {
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-answer').style.maxHeight = null;
        other.classList.remove('is-open');
      });
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        item.classList.add('is-open');
      }
    });
  });

  /* ── SMOOTH SCROLL ──────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── MOBILE NAV ─────────────────────────────────────────────────── */
  const navToggle = document.querySelector('.cin-header__toggle');
  const navMenu   = document.querySelector('.cin-nav');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open);
    });
    navMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     SCROLL STAGES — Cinematic pinned sections driven by scroll
     ══════════════════════════════════════════════════════════════════ */

  function stageProgress(stage) {
    if (!stage) return 0;
    const h          = stage.offsetHeight;
    const vh         = window.innerHeight;
    const scrollable = h - vh;
    if (scrollable <= 0) return 0;
    return clamp(-stage.getBoundingClientRect().top / scrollable, 0, 1);
  }

  function anim(el, opacity, tx, ty, scale) {
    if (!el) return;
    el.style.opacity = opacity;
    let t = '';
    if (tx  !== undefined) t += `translateX(${tx}px) `;
    if (ty  !== undefined) t += `translateY(${ty}px) `;
    if (scale !== undefined) t += `scale(${scale})`;
    if (t) el.style.transform = t.trim();
  }

  /* ── SCROLL STAGE: DR. NÉVOA ─────────────────────────────────────
     Phase 1 (0–35%): image + caption emerge
     Phase 2 (28–65%): DR. NÉVOA slams in from small
     Phase 3 (58–88%): description fades up
     Phase 4 (75–100%): villain quote slides in
  ─────────────────────────────────────────────────────────────────── */
  const villainStage = document.querySelector('.scroll-stage--villain');
  const vEl = villainStage ? {
    caption : villainStage.querySelector('.villain__caption'),
    imgWrap : villainStage.querySelector('.villain__image-wrap'),
    imgEl   : villainStage.querySelector('.villain__image-wrap img'),
    name    : villainStage.querySelector('.villain__name'),
    desc    : villainStage.querySelector('.villain__description'),
    quote   : villainStage.querySelector('.villain__quote'),
  } : null;

  function updateVillain() {
    if (!vEl) return;
    const p = stageProgress(villainStage);

    /* Phase 1: full-bleed image fades in + subtle zoom-out on img */
    const p1 = rng(p, 0, 0.35);
    if (vEl.imgWrap) vEl.imgWrap.style.opacity = p1;
    if (vEl.imgEl)   vEl.imgEl.style.transform = `scale(${lerp(1.12, 1.0, p1)})`;
    anim(vEl.caption, p1, undefined, lerp(24, 0, p1));

    const p2 = rng(p, 0.28, 0.65);
    if (vEl.name) {
      vEl.name.style.opacity   = p2;
      vEl.name.style.transform = `scale(${lerp(0.3, 1, p2)}) translateY(${lerp(50, 0, p2)}px)`;
    }

    const p3 = rng(p, 0.58, 0.88);
    anim(vEl.desc,  p3, undefined, lerp(30, 0, p3));

    const p4 = rng(p, 0.75, 1.0);
    anim(vEl.quote, p4, undefined, lerp(20, 0, p4));
  }

  /* ── SCROLL STAGE: TURNING POINT (CHEGA.) ───────────────────────
     Phase 1 (0–28%):  quote fades in
     Phase 2 (22–68%): CHEGA. scales from tiny → full
     Phase 3 (62–85%): CLIQUE! glows in
     Phase 4 (80–100%): mission badge slides up
  ─────────────────────────────────────────────────────────────────── */
  const chegaStage = document.querySelector('.scroll-stage--chega');
  const cEl = chegaStage ? {
    quote   : chegaStage.querySelector('.turning__quote'),
    chega   : chegaStage.querySelector('.turning__chega'),
    click   : chegaStage.querySelector('.turning__click'),
    mission : chegaStage.querySelector('.turning__mission'),
  } : null;

  function updateChega() {
    if (!cEl) return;
    const p = stageProgress(chegaStage);

    const p1 = rng(p, 0,    0.28);
    anim(cEl.quote, p1, undefined, lerp(20, 0, p1));

    const p2 = rng(p, 0.22, 0.68);
    if (cEl.chega) {
      cEl.chega.style.opacity   = p2 > 0 ? 1 : 0;
      cEl.chega.style.transform = `scale(${lerp(0.1, 1, p2)})`;
    }

    const p3 = rng(p, 0.62, 0.85);
    if (cEl.click) cEl.click.style.opacity = p3;

    const p4 = rng(p, 0.80, 1.0);
    anim(cEl.mission, p4, undefined, lerp(15, 0, p4));
  }

  /* ── SCROLL STAGE: TRIPLE THREAT ARRIVAL ────────────────────────
     Phase 1 (0–28%):  narration fades in
     Phase 2 (22–65%): image expands from center (clip-path iris)
     Phase 3 (60–85%): SFX row appears
     Phase 4 (82–100%): tagline slides up
  ─────────────────────────────────────────────────────────────────── */
  const arrivalStage = document.querySelector('.scroll-stage--arrival');
  const aEl = arrivalStage ? {
    narration : arrivalStage.querySelector('.arrival__narration'),
    img       : arrivalStage.querySelector('.arrival__image-wrap'),
    sfxRow    : arrivalStage.querySelector('.arrival__sfx-row'),
    tagline   : arrivalStage.querySelector('.arrival__tagline'),
  } : null;

  function updateArrival() {
    if (!aEl) return;
    const p = stageProgress(arrivalStage);

    const p1 = rng(p, 0,    0.28);
    anim(aEl.narration, p1, undefined, lerp(20, 0, p1));

    const p2 = rng(p, 0.22, 0.65);
    if (aEl.img) {
      aEl.img.style.opacity = p2;
      const inset = Math.round(lerp(45, 0, p2));
      aEl.img.style.clipPath = `inset(${inset}% ${Math.round(inset * 0.7)}% ${inset}% ${Math.round(inset * 0.7)}% round 4px)`;
    }

    const p3 = rng(p, 0.60, 0.85);
    anim(aEl.sfxRow, p3, undefined, lerp(15, 0, p3));

    const p4 = rng(p, 0.82, 1.0);
    anim(aEl.tagline, p4, undefined, lerp(10, 0, p4));
  }

  /* ── PARALLAX IMAGES ────────────────────────────────────────────── */
  const parallaxEls = document.querySelectorAll('[data-parallax]');

  function updateParallax() {
    if (!parallaxEls.length) return;
    const vh = window.innerHeight;
    parallaxEls.forEach(el => {
      const rect   = el.getBoundingClientRect();
      const speed  = parseFloat(el.dataset.parallax) || 0.25;
      const offset = (rect.top + rect.height / 2 - vh / 2) * speed;
      el.style.transform = `translateY(${offset.toFixed(1)}px) scale(1.12)`;
    });
  }

  /* ── SCROLL LISTENER (RAF throttle) ────────────────────────────── */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        updateHeader();
        updateVillain();
        updateChega();
        updateArrival();
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* Initial paint */
  updateProgress();
  updateHeader();
  updateVillain();
  updateChega();
  updateArrival();
  updateParallax();

})();
