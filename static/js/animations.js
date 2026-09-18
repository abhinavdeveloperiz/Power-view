/**
 * animations.js — GSAP, ScrollTrigger & React Bits / 21st.dev inspired animations
 *
 * Features:
 * 1. GSAP ScrollTrigger section stagger reveals
 * 2. Animated statistics counter ticker (CountUp)
 * 3. Magnetic cursor attraction on primary buttons
 * 4. Hero ambient floating background glow
 */
(function () {
  'use strict';

  // Check if GSAP is loaded
  if (typeof gsap === 'undefined') {
    return;
  }

  // Register ScrollTrigger plugin if available
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Respect user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return;
  }

  function initAnimations() {
    /* ═══════════════════════════════════════════════════════════
       1. HERO AMBIENT GLOW & ENTRANCE
    ════════════════════════════════════════════════════════════ */
    // Ambient floating glow orbs in hero
    const glowOrbs = document.querySelectorAll('.hero-glow-orb');
    glowOrbs.forEach((orb, i) => {
      gsap.to(orb, {
        y: i % 2 === 0 ? -25 : 25,
        x: i % 2 === 0 ? 15 : -15,
        scale: 1.15,
        duration: 5 + i * 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    // Hero content stagger entrance
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .from('#home .inline-flex', { y: 20, opacity: 0, duration: 0.6, delay: 0.1 })
      .from('#home h1', { y: 35, opacity: 0, duration: 0.8 }, '-=0.4')
      .from('#home p', { y: 25, opacity: 0, duration: 0.7 }, '-=0.5')
      .from('#home .btn-primary, #home .btn-outline', {
        y: 20,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
      }, '-=0.5')
      .from('#home .trust-badge', {
        y: 15,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
      }, '-=0.4')
      .from('#home .hero-parallax-card', {
        scale: 0.92,
        opacity: 0,
        duration: 1.0,
        ease: 'back.out(1.3)',
      }, '-=0.7');

    /* ═══════════════════════════════════════════════════════════
       1.1 HERO 3D PARALLAX (FULL-BLEED BACKGROUND & MOUSE TILT)
    ════════════════════════════════════════════════════════════ */
    const heroSection = document.querySelector('#home');
    const heroBgImg = document.querySelector('.hero-bg-img');
    const heroCard = document.querySelector('.hero-parallax-card');
    const heroGlow = document.querySelector('.hero-parallax-glow');
    const heroBadge1 = document.querySelector('.hero-floating-badge-1');

    if (heroSection) {
      // A. Full-Bleed Background Image Scroll Parallax
      if (heroBgImg) {
        gsap.to(heroBgImg, {
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.0,
          },
          yPercent: 16,
          scale: 1.04,
          ease: 'none',
        });
      }

      // B. Foreground Card Scroll Parallax
      if (heroCard) {
        gsap.to(heroCard, {
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
          y: 70,
          rotationX: -2,
          scale: 0.98,
          ease: 'none',
        });

        // Ambient Floating Levitation
        gsap.to(heroCard, {
          y: '-=8',
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      if (heroBadge1) {
        gsap.to(heroBadge1, {
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
          },
          y: 35,
          ease: 'none',
        });
      }

      // C. Interactive 3D Mouse Parallax & Background Pan (Desktop)
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        heroSection.addEventListener('mousemove', e => {
          const rect = heroSection.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;

          // Parallax pan on the background image
          if (heroBgImg) {
            gsap.to(heroBgImg, {
              x: (x - 0.5) * -24,
              y: (y - 0.5) * -18,
              duration: 0.6,
              ease: 'power2.out',
            });
          }

          // 3D Tilt on the floating glass card
          if (heroCard) {
            const tiltX = (y - 0.5) * -10;
            const tiltY = (x - 0.5) * 10;

            gsap.to(heroCard, {
              rotationX: tiltX,
              rotationY: tiltY,
              transformPerspective: 1200,
              duration: 0.35,
              ease: 'power2.out',
            });
          }

          if (heroBadge1) {
            gsap.to(heroBadge1, {
              x: (x - 0.5) * -12,
              duration: 0.35,
              ease: 'power2.out',
            });
          }
        });

        heroSection.addEventListener('mouseleave', () => {
          if (heroBgImg) {
            gsap.to(heroBgImg, {
              x: 0,
              y: 0,
              duration: 1.0,
              ease: 'power2.out',
            });
          }

          if (heroCard) {
            gsap.to(heroCard, {
              rotationX: 0,
              rotationY: 0,
              duration: 0.8,
              ease: 'elastic.out(1, 0.4)',
            });
          }

          if (heroBadge1) {
            gsap.to(heroBadge1, {
              x: 0,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
            });
          }
        });
      }
    }

    /* ═══════════════════════════════════════════════════════════
       2. COUNTUP STATS TICKER (ABOUT SECTION)
    ════════════════════════════════════════════════════════════ */
    const statElements = document.querySelectorAll('[data-count]');
    statElements.forEach(stat => {
      const targetVal = parseFloat(stat.getAttribute('data-count')) || 0;
      const suffix = stat.getAttribute('data-suffix') || '';

      ScrollTrigger.create({
        trigger: stat,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          const counter = { val: 0 };
          gsap.to(counter, {
            val: targetVal,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => {
              stat.textContent = Math.floor(counter.val) + suffix;
            },
            onComplete: () => {
              stat.textContent = targetVal + suffix;
            },
          });
        },
      });
    });

    /* ═══════════════════════════════════════════════════════════
       3. SECTION HEADINGS & CONTENT SCROLL REVEALS
    ════════════════════════════════════════════════════════════ */
    // Section headers reveal
    const sectionHeaders = document.querySelectorAll('#about .text-center:first-child, #services .text-center:first-child, #contact .text-center:first-child');
    sectionHeaders.forEach(header => {
      gsap.from(header.children, {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          once: true,
        },
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.75,
        ease: 'power3.out',
      });
    });

    // Service cards masonry scroll-driven animation
    const serviceGrid = document.querySelector('#services .grid');
    if (serviceGrid) {
      const cards = serviceGrid.querySelectorAll('.masonry-card-wrapper');

      // If browser doesn't support native CSS scroll-driven animation timeline, use GSAP ScrollTrigger
      const supportsCSSScrollTimeline = window.CSS && CSS.supports && CSS.supports('animation-timeline', 'view()');
      if (!supportsCSSScrollTimeline) {
        cards.forEach(card => {
          const side = parseFloat(card.style.getPropertyValue('--side') || '1');
          const amp = parseFloat(card.style.getPropertyValue('--amp') || '1');
          const rotateAngle = side * (4 * amp);

          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              once: true,
            },
            scale: 0.88,
            rotation: rotateAngle,
            opacity: 0,
            duration: 0.85,
            ease: 'back.out(1.2)',
          });
        });
      }
    }

    // Contact cards & Google Map slide-in
    const contactCards = document.querySelectorAll('#contact .contact-info-card');
    if (contactCards.length > 0) {
      if (window.location.hash === '#contact') {
        gsap.set(contactCards, { opacity: 1, y: 0, clearProps: 'all' });
      } else {
        gsap.fromTo(contactCards,
          { y: 25, opacity: 0 },
          {
            scrollTrigger: {
              trigger: '#contact',
              start: 'top 88%',
              once: true,
            },
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power2.out',
            clearProps: 'all',
          }
        );
      }
    }

    const mapContainer = document.querySelector('#contact .map-container');
    if (mapContainer) {
      if (window.location.hash === '#contact') {
        gsap.set(mapContainer, { opacity: 1, scale: 1, clearProps: 'all' });
      } else {
        gsap.fromTo(mapContainer,
          { opacity: 0, scale: 0.98 },
          {
            scrollTrigger: {
              trigger: mapContainer,
              start: 'top 92%',
              once: true,
            },
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: 'power2.out',
            clearProps: 'all',
          }
        );
      }
    }

    /* ═══════════════════════════════════════════════════════════
       4. REACT BITS: MAGNETIC BUTTON MICRO-INTERACTION
    ════════════════════════════════════════════════════════════ */
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const magneticBtns = document.querySelectorAll('.magnetic-btn');

      magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', e => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: 'power2.out',
          });
        });

        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.4)',
          });
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }
})();
