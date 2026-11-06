/**
 * Catholic Medical Association of Lubbock
 * Client Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Footer Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Accessible Mobile Navigation
  const navToggle = document.getElementById('nav-toggle');
  const primaryNav = document.getElementById('primary-nav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isExpanded));
      primaryNav.classList.toggle('is-open');
    });

    // Close mobile nav when clicking a link
    primaryNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('is-open');
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('is-open');
        navToggle.focus();
      }
    });
  }

  // 3. Provider Directory Live Filtering & Search
  const filterPills = document.querySelectorAll('.filter-pills .pill');
  const searchInput = document.getElementById('provider-search');
  const providerCards = document.querySelectorAll('.directory-grid .provider-card');

  let activeSpecialty = 'all';
  let searchQuery = '';

  function applyDirectoryFilters() {
    let visibleCount = 0;

    providerCards.forEach(card => {
      const cardSpecialty = card.getAttribute('data-specialty') || '';
      const textContent = card.textContent.toLowerCase();

      const matchesSpecialty = (activeSpecialty === 'all') || (cardSpecialty === activeSpecialty);
      const matchesSearch = !searchQuery || textContent.includes(searchQuery);

      if (matchesSpecialty && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Check if empty state message is needed
    const directoryList = document.getElementById('directory-list');
    let emptyMsg = document.getElementById('directory-empty-msg');

    if (visibleCount === 0) {
      if (!emptyMsg) {
        emptyMsg = document.createElement('div');
        emptyMsg.id = 'directory-empty-msg';
        emptyMsg.className = 'text-center';
        emptyMsg.style.gridColumn = '1 / -1';
        emptyMsg.style.padding = '2rem';
        emptyMsg.style.color = 'var(--color-text-muted)';
        emptyMsg.innerHTML = '<p>No providers matched your search. Please try another specialty or clear your search term.</p>';
        directoryList.appendChild(emptyMsg);
      }
    } else if (emptyMsg) {
      emptyMsg.remove();
    }
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');
      activeSpecialty = pill.getAttribute('data-filter') || 'all';
      applyDirectoryFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      // Automatically expand on search query so user can see matched results
      const dirList = document.getElementById('directory-list');
      const toggleDirBtn = document.getElementById('toggle-directory-btn');
      if (searchQuery && dirList && !dirList.classList.contains('is-expanded')) {
        dirList.classList.add('is-expanded');
        if (toggleDirBtn) {
          toggleDirBtn.setAttribute('aria-expanded', 'true');
          toggleDirBtn.querySelector('.btn-text').textContent = 'Collapse Directory';
          toggleDirBtn.querySelector('.btn-icon').innerHTML = '&uarr;';
        }
      }
      applyDirectoryFilters();
    });
  }

  // 3b. Mobile Condensed Directory & Events Toggles
  const toggleDirBtn = document.getElementById('toggle-directory-btn');
  const directoryListEl = document.getElementById('directory-list');

  if (toggleDirBtn && directoryListEl) {
    toggleDirBtn.addEventListener('click', () => {
      const isExpanded = directoryListEl.classList.toggle('is-expanded');
      toggleDirBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      const textSpan = toggleDirBtn.querySelector('.btn-text');
      const iconSpan = toggleDirBtn.querySelector('.btn-icon');
      if (isExpanded) {
        textSpan.textContent = 'Collapse Directory';
        iconSpan.innerHTML = '&uarr;';
      } else {
        textSpan.textContent = `View All Providers (${providerCards.length})`;
        iconSpan.innerHTML = '&darr;';
        // Scroll back smoothly to directory top if collapsed from bottom
        document.getElementById('directory').scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  const toggleEventsBtn = document.getElementById('toggle-events-btn');
  const eventsGrid = document.querySelector('.events-section .grid-3');

  if (toggleEventsBtn && eventsGrid) {
    const eventCards = eventsGrid.querySelectorAll('.event-card');
    toggleEventsBtn.addEventListener('click', () => {
      const isExpanded = eventsGrid.classList.toggle('is-expanded');
      toggleEventsBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      const textSpan = toggleEventsBtn.querySelector('.btn-text');
      const iconSpan = toggleEventsBtn.querySelector('.btn-icon');
      if (isExpanded) {
        textSpan.textContent = 'Collapse Events';
        iconSpan.innerHTML = '&uarr;';
      } else {
        textSpan.textContent = `View All Events (${eventCards.length})`;
        iconSpan.innerHTML = '&darr;';
        document.getElementById('events').scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 4. Contact & Membership Form Validation (Modern Web Guidance compliance)
  const contactForm = document.getElementById('guild-contact-form');
  const nameInput = document.getElementById('full-name');
  const emailInput = document.getElementById('email-address');
  const roleSelect = document.getElementById('profession-role');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  function validateField(input, errorElement, validatorFn, errorMessage) {
    if (!validatorFn(input.value.trim())) {
      errorElement.textContent = errorMessage;
      input.setAttribute('aria-invalid', 'true');
      return false;
    }
    errorElement.textContent = '';
    input.removeAttribute('aria-invalid');
    return true;
  }

  // Validate on blur (exit field)
  if (nameInput) {
    const nameErr = document.getElementById('name-error');
    nameInput.addEventListener('blur', () => {
      validateField(nameInput, nameErr, val => val.length >= 2, 'Please enter your full name.');
    });
    nameInput.addEventListener('input', () => {
      nameErr.textContent = '';
      nameInput.removeAttribute('aria-invalid');
    });
  }

  if (emailInput) {
    const emailErr = document.getElementById('email-error');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    emailInput.addEventListener('blur', () => {
      validateField(emailInput, emailErr, val => emailRegex.test(val), 'Please provide a valid email address.');
    });
    emailInput.addEventListener('input', () => {
      emailErr.textContent = '';
      emailInput.removeAttribute('aria-invalid');
    });
  }

  if (roleSelect) {
    const roleErr = document.getElementById('role-error');
    roleSelect.addEventListener('change', () => {
      validateField(roleSelect, roleErr, val => val !== '', 'Please select your profession or role.');
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameErr = document.getElementById('name-error');
      const emailErr = document.getElementById('email-error');
      const roleErr = document.getElementById('role-error');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const isNameValid = validateField(nameInput, nameErr, val => val.length >= 2, 'Please enter your full name.');
      const isEmailValid = validateField(emailInput, emailErr, val => emailRegex.test(val), 'Please provide a valid email address.');
      const isRoleValid = validateField(roleSelect, roleErr, val => val !== '', 'Please select your profession or role.');

      if (!isNameValid || !isEmailValid || !isRoleValid) {
        if (!isNameValid) nameInput.focus();
        else if (!isEmailValid) emailInput.focus();
        else if (!isRoleValid) roleSelect.focus();
        return;
      }

      submitBtn.disabled = true;
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      formStatus.className = 'form-status';
      formStatus.textContent = '';

      const formData = new FormData(contactForm);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (response.ok && data.success) {
          formStatus.className = 'form-status success';
          formStatus.textContent = 'Thank you for your inquiry! A representative from the Lubbock CMA Guild will be in touch with you shortly.';
          contactForm.reset();
        } else {
          formStatus.className = 'form-status error';
          formStatus.textContent = data.message || 'Something went wrong submitting the form. Please try again or reach out directly.';
        }
      } catch (err) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Network error. Please check your connection and try again.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }
});

  // 5. Historical Archives Slideshow (Automatic advancing with touch/swipe support)
  const slides = document.querySelectorAll('#slideshow-container .slide');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  const indicatorsContainer = document.getElementById('slide-indicators');

  if (slides.length > 0 && prevBtn && nextBtn && indicatorsContainer) {
    let currentSlide = 0;
    let slideInterval = null;
    const SLIDE_DELAY = 4500; // 4.5 seconds per photo

    // Create indicator dots
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `indicator-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetAutoSlide();
      });
      indicatorsContainer.appendChild(dot);
    });

    const dots = indicatorsContainer.querySelectorAll('.indicator-dot');

    function goToSlide(n) {
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');
      currentSlide = (n + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }

    function startAutoSlide() {
      if (!slideInterval) {
        slideInterval = setInterval(() => {
          goToSlide(currentSlide + 1);
        }, SLIDE_DELAY);
      }
    }

    function stopAutoSlide() {
      if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
      }
    }

    function resetAutoSlide() {
      stopAutoSlide();
      startAutoSlide();
    }

    prevBtn.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      resetAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      resetAutoSlide();
    });

    // Pause on mouse hover (desktop)
    const wrapper = document.querySelector('.slideshow-wrapper');
    if (wrapper) {
      wrapper.addEventListener('mouseenter', stopAutoSlide);
      wrapper.addEventListener('mouseleave', startAutoSlide);

      // Mobile touch swipe gestures
      let touchStartX = 0;
      let touchEndX = 0;

      wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
      }, { passive: true });

      wrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 40) {
          if (diff < 0) {
            goToSlide(currentSlide + 1); // Swiped left -> next
          } else {
            goToSlide(currentSlide - 1); // Swiped right -> prev
          }
        }
        startAutoSlide();
      }, { passive: true });
    }

    // Start automatic cycling immediately
    startAutoSlide();
  }
});
