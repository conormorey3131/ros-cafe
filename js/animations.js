/* ============================================
   THE RÓS CAFÉ — ANIMATIONS JAVASCRIPT
   js/animations.js
   FAQ accordion, gallery tabs, ripple effects,
   form animations, success states
   ============================================ */

(function() {
  'use strict';

  /* ─────────────────────────────────────────────
     DOM CONTENT LOADED INITIALIZATION
     ───────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function() {
    initFaqAccordion();
    initGalleryTabs();
    initRippleEffect();
    initFormAnimations();
    initContactFormValidation();
  });

  /* ─────────────────────────────────────────────
     FAQ ACCORDION
     ───────────────────────────────────────────── */
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    if (!faqItems.length) return;

    faqItems.forEach(function(item) {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const answerInner = item.querySelector('.faq-answer-inner');

      if (!question || !answer || !answerInner) return;

      question.addEventListener('click', function() {
        const isOpen = item.classList.contains('is-open');

        // Close all other items (single-open behavior)
        faqItems.forEach(function(otherItem) {
          if (otherItem !== item && otherItem.classList.contains('is-open')) {
            otherItem.classList.remove('is-open');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) {
              otherAnswer.style.maxHeight = '0';
            }
          }
        });

        // Toggle current item
        if (isOpen) {
          item.classList.remove('is-open');
          answer.style.maxHeight = '0';
        } else {
          item.classList.add('is-open');
          answer.style.maxHeight = answerInner.offsetHeight + 'px';
        }
      });

      // Handle keyboard accessibility
      question.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    });
  }

  /* ─────────────────────────────────────────────
     GALLERY TABS
     ───────────────────────────────────────────── */
  function initGalleryTabs() {
    const tabsContainer = document.querySelector('.gallery-tabs');
    const tabs = document.querySelectorAll('.gallery-tab');
    const panels = document.querySelectorAll('.gallery-panel');
    const pill = document.querySelector('.tab-pill');

    if (!tabsContainer || !tabs.length || !panels.length) return;

    // Position pill on initial active tab
    const activeTab = tabsContainer.querySelector('.gallery-tab.is-active');
    if (activeTab && pill) {
      updatePillPosition(activeTab);
    }

    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        const targetPanel = this.getAttribute('data-tab');

        // Update active states
        tabs.forEach(function(t) {
          t.classList.remove('is-active');
        });
        this.classList.add('is-active');

        // Move pill
        if (pill) {
          updatePillPosition(this);
        }

        // Show correct panel
        panels.forEach(function(panel) {
          if (panel.getAttribute('data-panel') === targetPanel) {
            panel.classList.add('is-active');
          } else {
            panel.classList.remove('is-active');
          }
        });
      });
    });

    function updatePillPosition(activeTab) {
      const tabRect = activeTab.getBoundingClientRect();
      const containerRect = tabsContainer.getBoundingClientRect();

      pill.style.width = tabRect.width + 'px';
      pill.style.transform = 'translateX(' + (tabRect.left - containerRect.left) + 'px)';
    }

    // Update pill position on resize
    window.addEventListener('resize', window.debounce(function() {
      const currentActive = tabsContainer.querySelector('.gallery-tab.is-active');
      if (currentActive && pill) {
        updatePillPosition(currentActive);
      }
    }, 150));
  }

  /* ─────────────────────────────────────────────
     RIPPLE EFFECT ON BUTTONS
     ───────────────────────────────────────────── */
  function initRippleEffect() {
    const rippleButtons = document.querySelectorAll('.btn-pink');

    rippleButtons.forEach(function(button) {
      button.addEventListener('click', function(e) {
        // Create ripple element
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');

        // Calculate position
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        button.appendChild(ripple);

        // Remove ripple after animation
        ripple.addEventListener('animationend', function() {
          ripple.remove();
        });
      });
    });
  }

  /* ─────────────────────────────────────────────
     FORM INPUT ANIMATIONS
     ───────────────────────────────────────────── */
  function initFormAnimations() {
    const formInputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');

    formInputs.forEach(function(input) {
      // Add focus class to parent for styling
      input.addEventListener('focus', function() {
        const field = this.closest('.form-field');
        if (field) {
          field.classList.add('is-focused');
        }
      });

      input.addEventListener('blur', function() {
        const field = this.closest('.form-field');
        if (field) {
          field.classList.remove('is-focused');
        }
      });
    });
  }

  /* ─────────────────────────────────────────────
     CONTACT FORM VALIDATION & SUBMISSION
     ───────────────────────────────────────────── */
  function initContactFormValidation() {
    const form = document.querySelector('.contact-form form');

    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Remove previous invalid states
      form.querySelectorAll('.is-invalid').forEach(function(el) {
        el.classList.remove('is-invalid');
      });

      // Validate required fields
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(function(field) {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('is-invalid');
        }

        // Email validation
        if (field.type === 'email' && field.value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value)) {
            isValid = false;
            field.classList.add('is-invalid');
          }
        }
      });

      if (!isValid) {
        // Shake invalid fields
        form.querySelectorAll('.is-invalid').forEach(function(field) {
          field.style.animation = 'none';
          // Trigger reflow
          field.offsetHeight;
          field.style.animation = 'shake 0.4s ease';
        });
        return;
      }

      // Form is valid - show success state
      showFormSuccess(form);

      // Track form submission
      const enquiryType = form.querySelector('[name="enquiry-type"]');
      const enquiryValue = enquiryType ? enquiryType.value : 'General';

      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
          event_category: 'Contact',
          event_label: enquiryValue
        });
      }
    });
  }

  /* ─────────────────────────────────────────────
     SHOW FORM SUCCESS STATE
     ───────────────────────────────────────────── */
  function showFormSuccess(form) {
    const formContainer = form.closest('.contact-form');
    const successElement = formContainer.querySelector('.form-success');

    if (!successElement) {
      // Create success element if not exists
      const success = document.createElement('div');
      success.className = 'form-success';
      success.innerHTML = `
        <svg class="success-checkmark" viewBox="0 0 52 52" aria-hidden="true">
          <circle class="success-checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
          <path class="success-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
        <h3 class="success-title">Thank You!</h3>
        <p class="success-text">Your message has been sent. We'll be in touch soon.</p>
      `;
      formContainer.appendChild(success);

      // Hide form and show success
      form.style.display = 'none';
      success.classList.add('is-visible');
    } else {
      form.style.display = 'none';
      successElement.classList.add('is-visible');
    }
  }

  /* ─────────────────────────────────────────────
     ANIMATE ELEMENTS ON SCROLL (SINGLE ELEMENTS)
     ───────────────────────────────────────────── */
  function initElementAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    if (!animatedElements.length) return;

    if (!('IntersectionObserver' in window)) {
      animatedElements.forEach(function(el) {
        el.classList.add('is-animated');
      });
      return;
    }

    const animateObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const animationType = el.getAttribute('data-animate');
          const delay = el.getAttribute('data-delay') || 0;

          setTimeout(function() {
            el.classList.add('is-animated');
            if (animationType) {
              el.classList.add('animate-' + animationType);
            }
          }, parseInt(delay));

          animateObserver.unobserve(el);
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(function(el) {
      animateObserver.observe(el);
    });
  }

  // Initialize element animations
  document.addEventListener('DOMContentLoaded', initElementAnimations);

})();
