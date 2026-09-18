// =====================================================
// lightbox.js — Vanilla JS image lightbox
// No external library. Keyboard: ESC, ← →
// =====================================================

(function () {
  'use strict';

  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lbImg = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');

  let items = [];
  let current = 0;

  function openLightbox(index) {
    current = index;
    updateLightbox();
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const item = items[current];
    lbImg.src = item.src;
    lbImg.alt = item.alt;
    if (lbCaption) lbCaption.textContent = item.alt;
    lbPrev.disabled = current === 0;
    lbNext.disabled = current === items.length - 1;
  }

  function showPrev() {
    if (current > 0) { current--; updateLightbox(); }
  }
  function showNext() {
    if (current < items.length - 1) { current++; updateLightbox(); }
  }

  // Collect gallery items on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    const triggers = document.querySelectorAll('[data-lightbox]');
    items = Array.from(triggers).map(el => ({
      src: el.dataset.src || el.querySelector('img')?.src || el.src,
      alt: el.dataset.caption || el.querySelector('img')?.alt || '',
    }));

    triggers.forEach((el, i) => {
      el.style.cursor = 'zoom-in';
      el.addEventListener('click', () => openLightbox(i));
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(i);
        }
      });
    });
  });

  // Controls
  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', showPrev);
  lbNext.addEventListener('click', showNext);

  // Click backdrop to close
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
})();
