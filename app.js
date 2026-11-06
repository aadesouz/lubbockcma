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
      applyDirectoryFilters();
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
    contactForm.addEventListener('submit', (e) => {
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

      // Simulate successful submission
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      setTimeout(() => {
        formStatus.className = 'form-status success';
        formStatus.textContent = 'Thank you for your inquiry! A representative from the Lubbock CMA Guild will be in touch with you shortly.';
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Inquiry';
      }, 700);
    });
  }
});

  // 5. Historical Archives Slideshow
  const slides = document.querySelectorAll('#slideshow-container .slide');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  const indicatorsContainer = document.getElementById('slide-indicators');

  if (slides.length > 0 && prevBtn && nextBtn && indicatorsContainer) {
    let currentSlide = 0;

    // Create indicator dots
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `indicator-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => goToSlide(idx));
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

    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    // Optional subtle auto-rotation every 6 seconds
    let slideInterval = setInterval(() => goToSlide(currentSlide + 1), 6000);
    const wrapper = document.querySelector('.slideshow-wrapper');
    if (wrapper) {
      wrapper.addEventListener('mouseenter', () => clearInterval(slideInterval));
      wrapper.addEventListener('mouseleave', () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => goToSlide(currentSlide + 1), 6000);
      });
    }
  }
