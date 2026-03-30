/* ============================================
   THE RÓS CAFÉ — NAVIGATION JAVASCRIPT
   js/nav.js
   Hamburger toggle, active nav state,
   dropdown handling, mobile nav
   ============================================ */

(function() {
  'use strict';

  /* ─────────────────────────────────────────────
     DOM CONTENT LOADED INITIALIZATION
     ───────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function() {
    initHamburger();
    initActiveNav();
    initMobileDropdowns();
    initOutsideClick();
    initHeaderScroll();
  });

  /* ─────────────────────────────────────────────
     HAMBURGER TOGGLE
     ───────────────────────────────────────────── */
  function initHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');

    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', function() {
      const isOpen = hamburger.classList.contains('is-open');

      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    // Close nav on link click
    mobileNav.querySelectorAll('a:not(.mobile-dropdown-toggle)').forEach(function(link) {
      link.addEventListener('click', function() {
        closeNav();
      });
    });

    function openNav() {
      hamburger.classList.add('is-open');
      mobileNav.classList.add('is-open');
      document.body.classList.add('nav-open');
      hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeNav() {
      hamburger.classList.remove('is-open');
      mobileNav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');

      // Also close any open mobile dropdowns
      document.querySelectorAll('.mobile-dropdown-menu.is-open').forEach(function(menu) {
        menu.classList.remove('is-open');
      });
      document.querySelectorAll('.mobile-dropdown-toggle.is-open').forEach(function(toggle) {
        toggle.classList.remove('is-open');
      });
    }

    // Make closeNav available globally for outside click
    window.closeMobileNav = closeNav;
  }

  /* ─────────────────────────────────────────────
     ACTIVE NAV STATE FROM data-page
     ───────────────────────────────────────────── */
  function initActiveNav() {
    const body = document.body;
    const currentPage = body.getAttribute('data-page');

    if (!currentPage) return;

    // Desktop nav links
    document.querySelectorAll('.nav-link').forEach(function(link) {
      const linkPage = link.getAttribute('data-nav');

      if (linkPage === currentPage) {
        link.classList.add('is-active');
      }
    });

    // Dropdown items
    document.querySelectorAll('.dropdown-item').forEach(function(link) {
      const linkPage = link.getAttribute('data-nav');

      if (linkPage === currentPage) {
        link.classList.add('is-active');

        // Also highlight parent dropdown trigger
        const dropdown = link.closest('.dropdown');
        if (dropdown) {
          const trigger = dropdown.querySelector('.nav-link');
          if (trigger) {
            trigger.classList.add('is-active');
          }
        }
      }
    });

    // Mobile nav links
    document.querySelectorAll('.mobile-nav-link').forEach(function(link) {
      const linkPage = link.getAttribute('data-nav');

      if (linkPage === currentPage) {
        link.classList.add('is-active');
      }
    });

    // Mobile dropdown items
    document.querySelectorAll('.mobile-dropdown-item').forEach(function(link) {
      const linkPage = link.getAttribute('data-nav');

      if (linkPage === currentPage) {
        link.classList.add('is-active');

        // Also highlight parent dropdown trigger
        const parent = link.closest('.mobile-nav-item');
        if (parent) {
          const trigger = parent.querySelector('.mobile-dropdown-toggle');
          if (trigger) {
            trigger.classList.add('is-active');
          }
        }
      }
    });
  }

  /* ─────────────────────────────────────────────
     MOBILE DROPDOWNS
     ───────────────────────────────────────────── */
  function initMobileDropdowns() {
    const dropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');

    dropdownToggles.forEach(function(toggle) {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();

        const parent = this.closest('.mobile-nav-item');
        const menu = parent.querySelector('.mobile-dropdown-menu');

        if (!menu) return;

        const isOpen = this.classList.contains('is-open');

        // Close all other dropdowns first
        document.querySelectorAll('.mobile-dropdown-toggle.is-open').forEach(function(otherToggle) {
          if (otherToggle !== toggle) {
            otherToggle.classList.remove('is-open');
            const otherMenu = otherToggle.closest('.mobile-nav-item').querySelector('.mobile-dropdown-menu');
            if (otherMenu) {
              otherMenu.classList.remove('is-open');
            }
          }
        });

        // Toggle current dropdown
        if (isOpen) {
          this.classList.remove('is-open');
          menu.classList.remove('is-open');
        } else {
          this.classList.add('is-open');
          menu.classList.add('is-open');
        }
      });
    });
  }

  /* ─────────────────────────────────────────────
     CLOSE ON OUTSIDE CLICK
     ───────────────────────────────────────────── */
  function initOutsideClick() {
    document.addEventListener('click', function(e) {
      // Close desktop dropdowns on outside click
      const dropdowns = document.querySelectorAll('.dropdown.is-open');
      dropdowns.forEach(function(dropdown) {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('is-open');
        }
      });

      // Close mobile nav on outside click
      const hamburger = document.querySelector('.hamburger');
      const mobileNav = document.querySelector('.mobile-nav');

      if (hamburger && mobileNav) {
        if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
          if (mobileNav.classList.contains('is-open')) {
            if (typeof window.closeMobileNav === 'function') {
              window.closeMobileNav();
            }
          }
        }
      }
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        // Close dropdowns
        document.querySelectorAll('.dropdown.is-open').forEach(function(dropdown) {
          dropdown.classList.remove('is-open');
        });

        // Close mobile nav
        if (typeof window.closeMobileNav === 'function') {
          window.closeMobileNav();
        }
      }
    });
  }

  /* ─────────────────────────────────────────────
     HEADER SCROLL BEHAVIOR
     ───────────────────────────────────────────── */
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    const topBar = document.querySelector('.top-bar');

    if (!header) return;

    let lastScrollY = window.scrollY;
    let topBarHeight = topBar ? topBar.offsetHeight : 0;

    function handleScroll() {
      const currentScrollY = window.scrollY;

      // Add scrolled class when past top bar
      if (currentScrollY > topBarHeight) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }

      lastScrollY = currentScrollY;
    }

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    handleScroll();
  }

})();
