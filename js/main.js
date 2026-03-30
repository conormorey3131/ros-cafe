/* ============================================
   THE RÓS CAFÉ — MAIN JAVASCRIPT
   js/main.js
   DOM init, footer year, scroll reveal,
   page transitions, utilities
   ============================================ */

(function() {
  'use strict';

  /* ─────────────────────────────────────────────
     DOM CONTENT LOADED INITIALIZATION
     ───────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function() {
    initFooterYear();
    initScrollReveal();
    initPageTransitions();
    initOrnaments();
    initSmoothScroll();
    triggerLoadAnimations();
  });

  /* ─────────────────────────────────────────────
     FOOTER YEAR (Dynamic Copyright Year)
     ───────────────────────────────────────────── */
  function initFooterYear() {
    const yearElements = document.querySelectorAll('.footer-year');
    const currentYear = new Date().getFullYear();

    yearElements.forEach(function(el) {
      el.textContent = currentYear;
    });
  }

  /* ─────────────────────────────────────────────
     INTERSECTION OBSERVER - SCROLL REVEAL
     ───────────────────────────────────────────── */
  function initScrollReveal() {
    // Check for IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all elements immediately
      document.querySelectorAll('.scroll-reveal').forEach(function(el) {
        el.classList.add('is-visible');
      });
      return;
    }

    const revealOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const element = entry.target;

          // Add visible class
          element.classList.add('is-visible');

          // Handle stagger children
          if (element.classList.contains('stagger-children')) {
            staggerChildren(element);
          }

          // Unobserve after reveal
          observer.unobserve(element);
        }
      });
    }, revealOptions);

    // Observe all scroll-reveal elements
    document.querySelectorAll('.scroll-reveal').forEach(function(el) {
      revealObserver.observe(el);
    });
  }

  /* ─────────────────────────────────────────────
     STAGGER GRID CHILDREN
     ───────────────────────────────────────────── */
  function staggerChildren(parent) {
    const children = parent.children;
    const staggerDelay = 80; // milliseconds

    Array.from(children).forEach(function(child, index) {
      child.style.transitionDelay = (index * staggerDelay) + 'ms';
    });
  }

  /* ─────────────────────────────────────────────
     PAGE TRANSITIONS
     ───────────────────────────────────────────── */
  function initPageTransitions() {
    // Intercept all internal link clicks
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a');

      if (!link) return;

      const href = link.getAttribute('href');

      // Skip if not internal link or has special attributes
      if (!href ||
          href.startsWith('#') ||
          href.startsWith('http') ||
          href.startsWith('mailto:') ||
          href.startsWith('tel:') ||
          link.hasAttribute('target') ||
          link.hasAttribute('download') ||
          link.classList.contains('no-transition')) {
        return;
      }

      // Check if it's a relative HTML link
      if (href.endsWith('.html') || href === '/' || href === './') {
        e.preventDefault();

        // Add transition out class
        const main = document.querySelector('main');
        if (main) {
          main.classList.add('page-transition-out');
        }

        // Navigate after animation
        setTimeout(function() {
          window.location.href = href;
        }, 250);
      }
    });

    // Page enter animation
    window.addEventListener('pageshow', function(e) {
      const main = document.querySelector('main');
      if (main) {
        main.classList.remove('page-transition-out');
        main.classList.add('page-transition-in');

        // Remove class after animation
        setTimeout(function() {
          main.classList.remove('page-transition-in');
        }, 300);
      }
    });
  }

  /* ─────────────────────────────────────────────
     ORNAMENT LINE DRAW TRIGGER
     ───────────────────────────────────────────── */
  function initOrnaments() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.ornament').forEach(function(el) {
        el.classList.add('is-visible');
      });
      return;
    }

    const ornamentOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const ornamentObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, ornamentOptions);

    document.querySelectorAll('.ornament').forEach(function(el) {
      ornamentObserver.observe(el);
    });
  }

  /* ─────────────────────────────────────────────
     SMOOTH SCROLL FOR ANCHOR LINKS
     ───────────────────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          e.preventDefault();

          const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
          const topBarHeight = document.querySelector('.top-bar')?.offsetHeight || 0;
          const offset = headerHeight + topBarHeight + 20;

          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /* ─────────────────────────────────────────────
     TRIGGER LOAD ANIMATIONS
     ───────────────────────────────────────────── */
  function triggerLoadAnimations() {
    // Add animation classes to load elements after a brief delay
    const loadElements = document.querySelectorAll('.anim-load');

    loadElements.forEach(function(el, index) {
      // Add numbered class based on index
      const animClass = 'anim-load-' + Math.min(index + 1, 6);

      // Small delay to ensure CSS is loaded
      requestAnimationFrame(function() {
        el.classList.add(animClass);
      });
    });
  }

  /* ─────────────────────────────────────────────
     TRACK PAGE VIEW UTILITY
     ───────────────────────────────────────────── */
  window.trackPageView = function(pageTitle, pagePath) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: pageTitle,
        page_path: pagePath
      });
    }
  };

  /* ─────────────────────────────────────────────
     UTILITY: DEBOUNCE FUNCTION
     ───────────────────────────────────────────── */
  window.debounce = function(func, wait) {
    var timeout;
    return function executedFunction() {
      var context = this;
      var args = arguments;
      var later = function() {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  /* ─────────────────────────────────────────────
     UTILITY: THROTTLE FUNCTION
     ───────────────────────────────────────────── */
  window.throttle = function(func, limit) {
    var inThrottle;
    return function() {
      var context = this;
      var args = arguments;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(function() {
          inThrottle = false;
        }, limit);
      }
    };
  };

})();
