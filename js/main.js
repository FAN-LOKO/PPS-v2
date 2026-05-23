/* ========================================================================== 
   RU: Глобальная логика сайта
   EN: Global site logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderState();
  initMobileMenu();
  initHeroShowcase();
  initScrollReveal();
  initSmoothAnchorLinks();
  initLogoFallback();
  initContactFormEnhancements();
  initFaq();
});

/* ========================================================================== 
   RU: Состояние шапки при скролле
   EN: Header state on scroll
   ========================================================================== */
function initHeaderState() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const updateHeader = () => {
    if (window.scrollY > 10) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

/* ========================================================================== 
   RU: Мобильное меню
   EN: Mobile menu
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-menu]');
  const body = document.body;

  if (!toggle || !nav) return;

  const setState = (opened) => {
    toggle.setAttribute('aria-expanded', String(opened));
    nav.classList.toggle('is-open', opened);
    body.classList.toggle('menu-open', opened);
  };

  toggle.addEventListener('click', () => {
    const opened = toggle.getAttribute('aria-expanded') === 'true';
    setState(!opened);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setState(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setState(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) setState(false);
  });
}

/* ========================================================================== 
   RU: Ротация hero-карточек и табов
   EN: Hero cards rotation and tabs
   ========================================================================== */
function initHeroShowcase() {
  const showcase = document.querySelector('[data-hero-showcase]');
  if (!showcase) return;

  const tabs = Array.from(showcase.querySelectorAll('[data-hero-tab]'));
  const cards = Array.from(showcase.querySelectorAll('[data-hero-card]'));
  const dots = Array.from(showcase.querySelectorAll('[data-hero-dot]'));
  const autoplayDelay = 5200;
  let activeIndex = tabs.findIndex((tab) => tab.classList.contains('is-active'));
  let timer = null;

  if (!tabs.length || !cards.length) return;
  if (activeIndex < 0) activeIndex = 0;

  const activate = (index) => {
    tabs.forEach((tab, i) => {
      const isActive = i === index;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    cards.forEach((card, i) => {
      const isActive = i === index;
      card.classList.toggle('is-active', isActive);
      card.setAttribute('aria-hidden', String(!isActive));
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
    });

    activeIndex = index;
  };

  const next = () => activate((activeIndex + 1) % tabs.length);

  const start = () => {
    stop();
    timer = window.setInterval(next, autoplayDelay);
  };

  const stop = () => {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      activate(index);
      start();
    });

    tab.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        const nextIndex = (index + 1) % tabs.length;
        tabs[nextIndex].focus();
        activate(nextIndex);
        start();
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const prevIndex = (index - 1 + tabs.length) % tabs.length;
        tabs[prevIndex].focus();
        activate(prevIndex);
        start();
      }
    });
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      activate(index);
      start();
    });
  });

  showcase.addEventListener('mouseenter', stop);
  showcase.addEventListener('mouseleave', start);
  showcase.addEventListener('focusin', stop);
  showcase.addEventListener('focusout', start);

  activate(activeIndex);
  start();
}

/* ========================================================================== 
   RU: Плавное появление секций
   EN: Scroll reveal for sections
   ========================================================================== */
function initScrollReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: '0px 0px -8% 0px',
    }
  );

  items.forEach((item) => observer.observe(item));
}

/* ========================================================================== 
   RU: Плавные переходы по якорям
   EN: Smooth anchor navigation
   ========================================================================== */
function initSmoothAnchorLinks() {
  const links = document.querySelectorAll('a[href^="#"]');
  if (!links.length) return;

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      const header = document.querySelector('.site-header');
      const headerOffset = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 12;

      window.scrollTo({ top, behavior: 'smooth' });
      history.replaceState(null, '', targetId);
    });
  });
}

/* ========================================================================== 
   RU: Fallback для логотипа при ошибке загрузки
   EN: Logo fallback on image load error
   ========================================================================== */
function initLogoFallback() {
  const logo = document.querySelector('.site-brand__logo');
  const fallback = document.querySelector('.site-brand__logo-fallback');
  if (!logo || !fallback) return;

  const showFallback = () => {
    logo.style.display = 'none';
    fallback.style.display = 'flex';
  };

  if (logo.complete && logo.naturalWidth === 0) showFallback();
  logo.addEventListener('error', showFallback, { once: true });
}

/* ========================================================================== 
   RU: Улучшение поведения формы контактов
   EN: Contact form enhancement
   ========================================================================== */
function initContactFormEnhancements() {
  const form = document.querySelector('.contact-form form, form.contact-form, form[data-contact-form]');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    const requiredFields = Array.from(form.querySelectorAll('[required]'));
    let hasErrors = false;

    requiredFields.forEach((field) => {
      const wrapper = field.closest('.form-field') || field.parentElement;
      field.classList.remove('is-invalid');
      wrapper && wrapper.classList.remove('is-invalid');

      const isCheckbox = field.type === 'checkbox';
      const isEmpty = isCheckbox ? !field.checked : !String(field.value).trim();

      if (isEmpty) {
        hasErrors = true;
        field.classList.add('is-invalid');
        wrapper && wrapper.classList.add('is-invalid');
      }

      if (field.type === 'email' && field.value.trim()) {
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        if (!valid) {
          hasErrors = true;
          field.classList.add('is-invalid');
          wrapper && wrapper.classList.add('is-invalid');
        }
      }
    });

    if (hasErrors) {
      event.preventDefault();
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    if (!form.getAttribute('action') || form.getAttribute('action') === '#') {
      event.preventDefault();
      const submitButton = form.querySelector('[type="submit"]');
      if (submitButton) {
        const initialText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Заявка отправлена';
        window.setTimeout(() => {
          submitButton.disabled = false;
          submitButton.textContent = initialText;
          form.reset();
        }, 2200);
      }
    }
  });
}

/* ========================================================================== 
   RU: FAQ-аккордеон
   EN: FAQ accordion
   ========================================================================== */
function initFaq() {
  const faqButtons = document.querySelectorAll('[data-faq-button]');
  if (!faqButtons.length) return;

  faqButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const body = item?.querySelector('[data-faq-body]');
      if (!item || !body) return;

      const isOpen = item.classList.contains('is-open');
      item.classList.toggle('is-open', !isOpen);
      button.setAttribute('aria-expanded', String(!isOpen));
      body.hidden = isOpen;
    });
  });
}
