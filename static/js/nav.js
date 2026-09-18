// =====================================================
// nav.js — sticky header, mobile menu, smooth scroll,
//           back-to-top visibility
// =====================================================

(function () {
  'use strict';

  /* ---- Sticky / transparent header ---- */
  const header = document.getElementById('site-header');
  const heroSection = document.getElementById('home');

  if (header && heroSection) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          header.classList.remove('bg-pv-navy', 'shadow-lg');
          header.classList.add('bg-transparent');
        } else {
          header.classList.remove('bg-transparent');
          header.classList.add('bg-pv-navy', 'shadow-lg');
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(heroSection);
  }

  /* ---- Mobile hamburger ---- */
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('max-h-0');
      if (isOpen) {
        mobileMenu.classList.remove('max-h-0', 'opacity-0');
        mobileMenu.classList.add('max-h-screen', 'opacity-100');
        menuBtn.setAttribute('aria-expanded', 'true');
      } else {
        mobileMenu.classList.remove('max-h-screen', 'opacity-100');
        mobileMenu.classList.add('max-h-0', 'opacity-0');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on nav link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('max-h-screen', 'opacity-100');
        mobileMenu.classList.add('max-h-0', 'opacity-0');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Smooth scroll for all anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      try {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerH = header ? header.offsetHeight : 0;
          const top = target.getBoundingClientRect().top + window.scrollY - headerH;
          window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        }
      } catch (err) {
        // Ignore invalid selectors
      }
    });
  });

  /* ---- Back to top ---- */
  const backTop = document.getElementById('back-to-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backTop.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
        backTop.classList.add('opacity-100', 'translate-y-0');
      } else {
        backTop.classList.remove('opacity-100', 'translate-y-0');
        backTop.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
      }
    }, { passive: true });

    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Active nav link highlight on scroll (Furni style) ---- */
  const sectionIds = ['home', 'about', 'services', 'contact'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  const navItems = document.querySelectorAll('.custom-navbar-nav .nav-item');

  if (sections.length && navItems.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = '#' + entry.target.id;
          navItems.forEach(item => {
            const link = item.querySelector('a');
            if (link && link.getAttribute('href') === currentId) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px' });

    sections.forEach(s => sectionObserver.observe(s));
  }
})();
