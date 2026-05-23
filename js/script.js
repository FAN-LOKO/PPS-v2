/* ==========================================================================
   RU: Основной JavaScript проекта PPS-v2
   EN: Main JavaScript file for the PPS-v2 project

   RU: Этот файл отвечает за:
   - мобильное меню
   - активные ссылки навигации
   - FAQ accordion
   - кнопку "наверх"

   EN: This file is responsible for:
   - mobile menu
   - active navigation links
   - FAQ accordion
   - back-to-top button
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ========================================================================
     RU: Получаем базовые DOM-элементы
     EN: Get base DOM elements
     ======================================================================== */
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll(".site-nav__link");
  const backToTop = document.querySelector(".back-to-top");
  const faqItems = document.querySelectorAll(".faq-item");

  /* ========================================================================
     RU: Вспомогательные функции для мобильного меню
     EN: Helper functions for mobile menu
     ======================================================================== */
  const openMenu = () => {
    if (!siteNav || !menuToggle) return;
    siteNav.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Закрыть меню");
  };

  const closeMenu = () => {
    if (!siteNav || !menuToggle) return;
    siteNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Открыть меню");
  };

  const toggleMenu = () => {
    if (!siteNav) return;
    const isOpen = siteNav.classList.contains("is-open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  /* ========================================================================
     RU: Логика мобильного меню
     EN: Mobile menu logic
     ======================================================================== */
  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", toggleMenu);

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 1100) {
          closeMenu();
        }
      });
    });

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const clickedInsideNav = target.closest(".site-nav");
      const clickedToggle = target.closest(".menu-toggle");

      if (!clickedInsideNav && !clickedToggle && siteNav.classList.contains("is-open")) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1100) {
        closeMenu();
      }
    });
  }

  /* ========================================================================
     RU: Активный пункт меню при прокрутке страницы
     EN: Active navigation item on scroll
     ======================================================================== */
  const sectionIds = Array.from(navLinks)
    .map((link) => link.getAttribute("href"))
    .filter((href) => href && href.startsWith("#"))
    .map((href) => href.replace("#", ""));

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const setActiveNavLink = () => {
    if (!sections.length || !navLinks.length) return;

    const scrollPosition = window.scrollY + 140;
    let currentId = "";

    sections.forEach((section) => {
      if (!section) return;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.id;
      }
    });

    if (!currentId && sections[0]) {
      currentId = sections[0].id;
    }

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const isActive = href === `#${currentId}`;
      link.classList.toggle("is-active", isActive);
    });
  };

  setActiveNavLink();
  window.addEventListener("scroll", setActiveNavLink);

  /* ========================================================================
     RU: FAQ accordion
     EN: FAQ accordion
     ======================================================================== */
  if (faqItems.length) {
    faqItems.forEach((item) => {
      const button = item.querySelector(".faq-item__button");
      if (!button) return;

      button.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        faqItems.forEach((faqItem) => {
          faqItem.classList.remove("is-open");
        });

        if (!isOpen) {
          item.classList.add("is-open");
        }
      });
    });
  }

  /* ========================================================================
     RU: Кнопка "наверх"
     EN: Back-to-top button
     ======================================================================== */
  const toggleBackToTop = () => {
    if (!backToTop) return;

    if (window.scrollY > 500) {
      backToTop.classList.add("is-visible");
    } else {
      backToTop.classList.remove("is-visible");
    }
  };

  toggleBackToTop();
  window.addEventListener("scroll", toggleBackToTop);

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
});
