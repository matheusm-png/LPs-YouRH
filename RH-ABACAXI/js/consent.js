/**
 * consent.js
 * Consent Mode v2 — atualiza consentimento após interação com o banner LGPD.
 * Os defaults (denied) são declarados inline no <head> ANTES do GTM.
 */

(function () {
  'use strict';

  var CONSENT_KEY = 'yourh_consent_v1';

  function gtag() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

  function grantConsent() {
    gtag('consent', 'update', {
      ad_storage:          'granted',
      analytics_storage:   'granted',
      ad_user_data:        'granted',
      ad_personalization:  'granted'
    });
    try { localStorage.setItem(CONSENT_KEY, 'granted'); } catch (e) {}
    hideBanner();
  }

  function denyConsent() {
    gtag('consent', 'update', {
      ad_storage:          'denied',
      analytics_storage:   'denied',
      ad_user_data:        'denied',
      ad_personalization:  'denied'
    });
    try { localStorage.setItem(CONSENT_KEY, 'denied'); } catch (e) {}
    hideBanner();
  }

  function hideBanner() {
    var banner = document.getElementById('cookie-banner');
    if (!banner) return;
    banner.style.transform = 'translateY(100%)';
    banner.style.opacity   = '0';
    setTimeout(function () {
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    }, 400);
  }

  function showBanner() {
    var banner = document.getElementById('cookie-banner');
    if (!banner) return;
    setTimeout(function () {
      banner.style.transform = 'translateY(0)';
      banner.style.opacity   = '1';
    }, 800);

    var btnAccept = document.getElementById('cookie-accept');
    var btnDeny   = document.getElementById('cookie-deny');
    if (btnAccept) btnAccept.addEventListener('click', grantConsent);
    if (btnDeny)   btnDeny.addEventListener('click', denyConsent);
  }

  function init() {
    var stored;
    try { stored = localStorage.getItem(CONSENT_KEY); } catch (e) {}

    if (stored === 'granted') {
      grantConsent();
      return;
    }
    if (stored === 'denied') {
      return; // mantém o estado denied já definido no <head>
    }

    showBanner(); // primeira visita — sem decisão prévia
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
