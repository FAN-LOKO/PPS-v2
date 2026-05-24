/* ========================================================================== */
/* RU: script.js — основная интерактивность главной страницы PPS              */
/* EN: script.js — main homepage interactivity for PPS                        */
/* ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initHeroShowcase();
  initFaqAccordion();
  initActiveNavLinks();
  initBackToTop();
  initStickyHeaderState();
});

/* ========================================================================== */
/* RU: Мобильное меню                                                         */
/* EN: Mobile menu                                                            */
/* ========================================================================== */
function initMobileMenu() {
  const toggleButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll(".site-nav__link");

  if (!toggleButton || !nav) return;

  toggleButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggleButton.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggleButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav = nav.contains(event.target);
    const clickedToggle = toggleButton.contains(event.target);

    if (!clickedInsideNav && !clickedToggle) {
      nav.classList.remove("is-open");
      toggleButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 920) {
      nav.classList.remove("is-open");
      toggleButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    }
  });
}

/* ========================================================================== */
/* RU: Hero showcase / переключение карточек справа                           */
/* EN: Hero showcase / right-side card switching                              */
/* ========================================================================== */
function initHeroShowcase() {
  const showcase = document.querySelector("[data-hero-showcase]");
  if (!showcase) return;

  const tabs = Array.from(showcase.querySelectorAll("[data-hero-tab]"));
  const cards = Array.from(showcase.querySelectorAll("[data-hero-card]"));
  const dots = Array.from(showcase.querySelectorAll("[data-hero-dot]"));

  if (!tabs.length || !cards.length) return;

  let activeIndex = 0;
  let autoplayId = null;
  const autoplayDelay = 4200;

  function setActiveSlide(index) {
    const safeIndex = index >= cards.length ? 0 : index < 0 ? cards.length - 1 : index;
    activeIndex = safeIndex;

    tabs.forEach((tab, tabIndex) => {
      const isActive = tabIndex === safeIndex;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    cards.forEach((card, cardIndex) => {
      const isActive = cardIndex === safeIndex;
      card.classList.toggle("is-active", isActive);
      card.hidden = !isActive;
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === safeIndex);
    });
  }

  function nextSlide() {
    setActiveSlide(activeIndex + 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayId = window.setInterval(nextSlide, autoplayDelay);
  }

  function stopAutoplay() {
    if (autoplayId) {
      window.clearInterval(autoplayId);
      autoplayId = null;
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      setActiveSlide(index);
      startAutoplay();
    });

    tab.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        const nextIndex = index + 1 >= tabs.length ? 0 : index + 1;
        tabs[nextIndex].focus();
        setActiveSlide(nextIndex);
        startAutoplay();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        const prevIndex = index - 1 < 0 ? tabs.length - 1 : index - 1;
        tabs[prevIndex].focus();
        setActiveSlide(prevIndex);
        startAutoplay();
      }
    });
  });

  showcase.addEventListener("mouseenter", stopAutoplay);
  showcase.addEventListener("mouseleave", startAutoplay);
  showcase.addEventListener("focusin", stopAutoplay);
  showcase.addEventListener("focusout", startAutoplay);

  setActiveSlide(0);
  startAutoplay();
}

/* ========================================================================== */
/* RU: FAQ accordion                                                          */
/* EN: FAQ accordion                                                          */
/* ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!button || !answer) return;

    button.setAttribute("aria-expanded", item.classList.contains("is-open") ? "true" : "false");

    if (!item.classList.contains("is-open")) {
      answer.hidden = true;
    }

    button.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      faqItems.forEach((faqItem) => {
        const faqButton = faqItem.querySelector(".faq-question");
        const faqAnswer = faqItem.querySelector(".faq-answer");

        faqItem.classList.remove("is-open");

        if (faqButton) {
          faqButton.setAttribute("aria-expanded", "false");
        }

        if (faqAnswer) {
          faqAnswer.hidden = true;
        }
      });

      if (!isOpen) {
        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
        answer.hidden = false;
      }
    });
  });
}

/* ========================================================================== */
/* RU: Активный пункт меню при скролле                                        */
/* EN: Active navigation link on scroll                                       */
/* ========================================================================== */
function initActiveNavLinks() {
  const navLinks = Array.from(document.querySelectorAll(".site-nav__link"));
  if (!navLinks.length) return;

  const linksWithTargets = navLinks
    .map((link) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return null;

      const target = document.querySelector(href);
      if (!target) return null;

      return { link, target };
    })
    .filter(Boolean);

  if (!linksWithTargets.length) return;

  function updateActiveLink() {
    const scrollPosition = window.scrollY + 140;

    let currentSection = linksWithTargets[0];

    linksWithTargets.forEach((entry) => {
      if (entry.target.offsetTop <= scrollPosition) {
        currentSection = entry;
      }
    });

    navLinks.forEach((link) => link.classList.remove("is-active"));

    if (currentSection?.link) {
      currentSection.link.classList.add("is-active");
    }
  }

  updateActiveLink();
  window.addEventListener("scroll", updateActiveLink, { passive: true });
}

/* ========================================================================== */
/* RU: Кнопка "наверх"                                                        */
/* EN: Back to top button                                                     */
/* ========================================================================== */
function initBackToTop() {
  const backToTopButton = document.querySelector(".back-to-top");
  if (!backToTopButton) return;

  function toggleButtonVisibility() {
    if (window.scrollY > 520) {
      backToTopButton.classList.add("is-visible");
    } else {
      backToTopButton.classList.remove("is-visible");
    }
  }

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  toggleButtonVisibility();
  window.addEventListener("scroll", toggleButtonVisibility, { passive: true });
}

/* ========================================================================== */
/* RU: Состояние header при прокрутке                                         */
/* EN: Header state on scroll                                                 */
/* ========================================================================== */
function initStickyHeaderState() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  function updateHeaderState() {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
}
