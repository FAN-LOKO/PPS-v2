/* ========================================================================== */
/* RU: script.js — интерактивность главной страницы PPS                       */
/* EN: script.js — PPS homepage interactivity                                 */
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

  function closeMenu() {
    nav.classList.remove("is-open");
    toggleButton.setAttribute("aria-expanded", "false");
    toggleButton.setAttribute("aria-label", "Открыть меню");
    document.body.classList.remove("menu-open");
  }

  function openMenu() {
    nav.classList.add("is-open");
    toggleButton.setAttribute("aria-expanded", "true");
    toggleButton.setAttribute("aria-label", "Закрыть меню");
    document.body.classList.add("menu-open");
  }

  toggleButton.addEventListener("click", () => {
    const isOpen = nav.classList.contains("is-open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  /* ---- submenu toggle (mobile) ---- */
  const subToggles = nav.querySelectorAll(".site-nav__sub-toggle");
  subToggles.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var sub = this.parentElement.nextElementSibling;
      if (sub && sub.classList.contains("site-nav__sub")) {
        sub.classList.toggle("is-open");
        this.classList.toggle("is-open");
        var expanded = this.getAttribute("aria-expanded") === "true" ? "false" : "true";
        this.setAttribute("aria-expanded", expanded);
      }
    });
  });

  var subLinks = nav.querySelectorAll(".site-nav__sublink");
  subLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      closeMenu();
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav = nav.contains(event.target);
    const clickedToggle = toggleButton.contains(event.target);

    if (!clickedInsideNav && !clickedToggle) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 920) {
      closeMenu();
    }
  });
}

/* ========================================================================== */
/* RU: Hero showcase / табы и карточки справа                                 */
/* EN: Hero showcase / tabs and right-side cards                              */
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
  const autoplayDelay = 4500;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setActiveSlide(index) {
    const safeIndex = index < 0 ? cards.length - 1 : index >= cards.length ? 0 : index;
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

  function stopAutoplay() {
    if (autoplayId) {
      window.clearInterval(autoplayId);
      autoplayId = null;
    }
  }

  function startAutoplay() {
    if (reducedMotion) return;
    stopAutoplay();
    autoplayId = window.setInterval(nextSlide, autoplayDelay);
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

      if (event.key === "Home") {
        event.preventDefault();
        tabs[0].focus();
        setActiveSlide(0);
        startAutoplay();
      }

      if (event.key === "End") {
        event.preventDefault();
        tabs[tabs.length - 1].focus();
        setActiveSlide(tabs.length - 1);
        startAutoplay();
      }
    });
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setActiveSlide(index);
      startAutoplay();
    });
  });

  showcase.addEventListener("mouseenter", stopAutoplay);
  showcase.addEventListener("mouseleave", startAutoplay);
  showcase.addEventListener("focusin", stopAutoplay);
  showcase.addEventListener("focusout", () => {
    window.setTimeout(() => {
      if (!showcase.contains(document.activeElement)) {
        startAutoplay();
      }
    }, 0);
  });

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

  faqItems.forEach((item, index) => {
    const button = item.querySelector(".faq-item__button");
    const content = item.querySelector(".faq-item__content");

    if (!button || !content) return;

    const contentId = `faq-content-${index + 1}`;
    const buttonId = `faq-button-${index + 1}`;
    const isOpen = item.classList.contains("is-open");

    button.setAttribute("id", buttonId);
    button.setAttribute("aria-controls", contentId);
    button.setAttribute("aria-expanded", String(isOpen));

    content.setAttribute("id", contentId);
    content.setAttribute("role", "region");
    content.setAttribute("aria-labelledby", buttonId);
    content.hidden = !isOpen;

    button.addEventListener("click", () => {
      const currentlyOpen = item.classList.contains("is-open");

      faqItems.forEach((faqItem) => {
        const faqButton = faqItem.querySelector(".faq-item__button");
        const faqContent = faqItem.querySelector(".faq-item__content");

        faqItem.classList.remove("is-open");

        if (faqButton) {
          faqButton.setAttribute("aria-expanded", "false");
        }

        if (faqContent) {
          faqContent.hidden = true;
        }
      });

      if (!currentlyOpen) {
        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
        content.hidden = false;
      }
    });
  });
}

/* ========================================================================== */
/* RU: Активный пункт навигации при скролле                                   */
/* EN: Active navigation item on scroll                                       */
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
    const scrollPosition = window.scrollY + 160;
    let currentSection = linksWithTargets[0];

    linksWithTargets.forEach((entry) => {
      if (entry.target.offsetTop <= scrollPosition) {
        currentSection = entry;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("is-active");
    });

    if (currentSection && currentSection.link) {
      currentSection.link.classList.add("is-active");
    }
  }

  updateActiveLink();
  window.addEventListener("scroll", updateActiveLink, { passive: true });
  window.addEventListener("resize", updateActiveLink);
}

/* ========================================================================== */
/* RU: Кнопка "наверх"                                                        */
/* EN: Back-to-top button                                                     */
/* ========================================================================== */
function initBackToTop() {
  const backToTopButton = document.querySelector(".back-to-top");
  if (!backToTopButton) return;

  function updateVisibility() {
    if (window.scrollY > 520) {
      backToTopButton.classList.add("is-visible");
    } else {
      backToTopButton.classList.remove("is-visible");
    }
  }

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
  });

  updateVisibility();
  window.addEventListener("scroll", updateVisibility, { passive: true });
}

/* ========================================================================== */
/* RU: Состояние шапки при прокрутке                                          */
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

/* ========================================================================== */
/* RU: Audio player toggle (employees.html) — активируется после добавления   */
/*     реальных аудиофайлов: уберите .play-btn--disabled и disabled с кнопок  */
/* EN: Audio player toggle (employees.html) — activates once real audio       */
/*     files are added: remove .play-btn--disabled and disabled from buttons  */
/* ========================================================================== */
let currentAudio = null;
let currentButton = null;

function togglePlay(btn, audioSrc) {
  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
    if (currentButton) {
      currentButton.classList.remove("playing");
      currentButton.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
    }

    if (currentButton === btn) {
      currentAudio = null;
      currentButton = null;
      return;
    }
  }

  const audio = new Audio(audioSrc);

  audio.addEventListener("ended", function () {
    btn.classList.remove("playing");
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
    currentAudio = null;
    currentButton = null;
  });

  audio.play().catch(function () {
    console.log("Не удалось воспроизвести аудио:", audioSrc);
  });

  btn.classList.add("playing");
  btn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" width="18" height="18"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>';

  currentAudio = audio;
  currentButton = btn;
}

window.togglePlay = togglePlay;
