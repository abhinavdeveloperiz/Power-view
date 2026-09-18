/**
 * spotlight.js — 21st.dev & React Bits inspired Spotlight & 3D Tilt Card effect.
 *
 * Tracks cursor coordinates on cards to cast a glowing radial spotlight and
 * applies a subtle 3D perspective tilt on hover.
 */
(function () {
  'use strict';

  // Only run on devices with fine pointer (mouse/trackpad), skip touch screens for 60fps mobile scroll
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return;
  }

  function initSpotlightCards() {
    const cards = document.querySelectorAll('.spotlight-card, [data-spotlight], .contact-info-card, .product-item, .feature, .stat-counter-box');

    cards.forEach(card => {
      let isHovered = false;
      let rafId = null;

      function onMouseMove(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Set CSS custom properties for radial spotlight
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // If card also has 3D tilt enabled
        if (card.hasAttribute('data-tilt') || card.classList.contains('service-card')) {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -5; // max 5 deg tilt
          const rotateY = ((x - centerX) / centerX) * 5;

          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
          });
        }
      }

      function onMouseEnter() {
        isHovered = true;
      }

      function onMouseLeave() {
        isHovered = false;
        if (rafId) cancelAnimationFrame(rafId);
        card.style.transform = '';
      }

      card.addEventListener('mousemove', onMouseMove, { passive: true });
      card.addEventListener('mouseenter', onMouseEnter, { passive: true });
      card.addEventListener('mouseleave', onMouseLeave, { passive: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpotlightCards);
  } else {
    initSpotlightCards();
  }
})();
