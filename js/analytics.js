/* ============================================
   THE RÓS CAFÉ — ANALYTICS JAVASCRIPT
   js/analytics.js
   GA4 event tracking for clicks, form
   submissions, PDF downloads, social links
   ============================================ */

(function() {
  'use strict';

  /* ─────────────────────────────────────────────
     DOM CONTENT LOADED INITIALIZATION
     ───────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function() {
    initClickTracking();
    initFormTracking();
    initPdfTracking();
    initSocialTracking();
  });

  /* ─────────────────────────────────────────────
     CLICK TRACKING VIA data-track ATTRIBUTES
     ───────────────────────────────────────────── */
  function initClickTracking() {
    // Phone number clicks
    document.querySelectorAll('[data-track="phone"]').forEach(function(el) {
      el.addEventListener('click', function() {
        trackEvent('click', 'Contact', 'Phone Number');
      });
    });

    // Email clicks
    document.querySelectorAll('[data-track="email"]').forEach(function(el) {
      el.addEventListener('click', function() {
        trackEvent('click', 'Contact', 'Email Address');
      });
    });

    // Google Maps clicks
    document.querySelectorAll('[data-track="maps"]').forEach(function(el) {
      el.addEventListener('click', function() {
        trackEvent('click', 'Contact', 'Google Maps');
      });
    });

    // Generic tracked elements
    document.querySelectorAll('[data-track]').forEach(function(el) {
      const trackValue = el.getAttribute('data-track');

      // Skip already handled elements
      if (['phone', 'email', 'maps', 'instagram', 'facebook'].includes(trackValue)) {
        return;
      }

      // Skip PDF tracking (handled separately)
      if (trackValue.startsWith('pdf-')) {
        return;
      }

      el.addEventListener('click', function() {
        trackEvent('click', 'Interaction', trackValue);
      });
    });
  }

  /* ─────────────────────────────────────────────
     FORM SUBMISSION TRACKING
     ───────────────────────────────────────────── */
  function initFormTracking() {
    const contactForm = document.querySelector('.contact-form form');

    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
      // Get enquiry type if available
      const enquiryType = this.querySelector('[name="enquiry-type"]');
      const enquiryValue = enquiryType ? enquiryType.value : 'General Enquiry';

      trackEvent('form_submit', 'Contact', enquiryValue);
    });
  }

  /* ─────────────────────────────────────────────
     PDF DOWNLOAD TRACKING
     ───────────────────────────────────────────── */
  function initPdfTracking() {
    // Breakfast menu PDF
    document.querySelectorAll('[data-track="pdf-breakfast"]').forEach(function(el) {
      el.addEventListener('click', function() {
        trackEvent('file_download', 'Menu PDF', 'Breakfast Menu');
      });
    });

    // Lunch menu PDF
    document.querySelectorAll('[data-track="pdf-lunch"]').forEach(function(el) {
      el.addEventListener('click', function() {
        trackEvent('file_download', 'Menu PDF', 'Lunch Menu');
      });
    });

    // Cakes menu PDF
    document.querySelectorAll('[data-track="pdf-cakes"]').forEach(function(el) {
      el.addEventListener('click', function() {
        trackEvent('file_download', 'Menu PDF', 'Occasion Cakes Menu');
      });
    });

    // Catering menu PDF
    document.querySelectorAll('[data-track="pdf-catering"]').forEach(function(el) {
      el.addEventListener('click', function() {
        trackEvent('file_download', 'Menu PDF', 'Catering Menu');
      });
    });

    // Generic PDF downloads
    document.querySelectorAll('a[href$=".pdf"]').forEach(function(el) {
      if (!el.hasAttribute('data-track')) {
        el.addEventListener('click', function() {
          const fileName = this.getAttribute('href').split('/').pop();
          trackEvent('file_download', 'PDF', fileName);
        });
      }
    });
  }

  /* ─────────────────────────────────────────────
     SOCIAL MEDIA CLICK TRACKING
     ───────────────────────────────────────────── */
  function initSocialTracking() {
    // Instagram clicks
    document.querySelectorAll('[data-track="instagram"]').forEach(function(el) {
      el.addEventListener('click', function() {
        trackEvent('click', 'Social', 'Instagram');
      });
    });

    // Also track via href pattern
    document.querySelectorAll('a[href*="instagram.com"]').forEach(function(el) {
      if (!el.hasAttribute('data-track')) {
        el.addEventListener('click', function() {
          trackEvent('click', 'Social', 'Instagram');
        });
      }
    });

    // Facebook clicks
    document.querySelectorAll('[data-track="facebook"]').forEach(function(el) {
      el.addEventListener('click', function() {
        trackEvent('click', 'Social', 'Facebook');
      });
    });

    // Also track via href pattern
    document.querySelectorAll('a[href*="facebook.com"]').forEach(function(el) {
      if (!el.hasAttribute('data-track')) {
        el.addEventListener('click', function() {
          trackEvent('click', 'Social', 'Facebook');
        });
      }
    });
  }

  /* ─────────────────────────────────────────────
     TRACK EVENT UTILITY FUNCTION
     ───────────────────────────────────────────── */
  function trackEvent(eventName, eventCategory, eventLabel) {
    // Check if gtag is available
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: eventCategory,
        event_label: eventLabel
      });
    }

    // Debug logging in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('GA Event:', eventName, eventCategory, eventLabel);
    }
  }

  /* ─────────────────────────────────────────────
     TRACK OUTBOUND LINKS
     ───────────────────────────────────────────── */
  function initOutboundTracking() {
    document.querySelectorAll('a[href^="http"]').forEach(function(link) {
      // Skip internal links
      if (link.hostname === window.location.hostname) return;

      link.addEventListener('click', function() {
        trackEvent('click', 'Outbound Link', this.href);
      });
    });
  }

  // Initialize outbound tracking
  document.addEventListener('DOMContentLoaded', initOutboundTracking);

  /* ─────────────────────────────────────────────
     TRACK SCROLL DEPTH (OPTIONAL)
     ───────────────────────────────────────────── */
  function initScrollDepthTracking() {
    const scrollMarks = [25, 50, 75, 100];
    const trackedMarks = [];

    function checkScrollDepth() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      scrollMarks.forEach(function(mark) {
        if (scrollPercent >= mark && !trackedMarks.includes(mark)) {
          trackedMarks.push(mark);
          trackEvent('scroll_depth', 'Engagement', mark + '%');
        }
      });
    }

    // Throttle scroll tracking
    var scrollTimeout;
    window.addEventListener('scroll', function() {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(function() {
          checkScrollDepth();
          scrollTimeout = null;
        }, 250);
      }
    }, { passive: true });
  }

  // Uncomment to enable scroll depth tracking
  // document.addEventListener('DOMContentLoaded', initScrollDepthTracking);

  /* ─────────────────────────────────────────────
     EXPOSE TRACK EVENT GLOBALLY
     ───────────────────────────────────────────── */
  window.trackEvent = trackEvent;

})();
