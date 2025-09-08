document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.header-navigation[data-open]');
  const menus = document.querySelectorAll('.header-menu-open[data-open]');
  const header = document.querySelector('.header');

  function closeAllMenus() {
    menus.forEach(m => m.classList.remove('is-open'));
    buttons.forEach(b => {
      b.classList.remove('is-active');
      b.setAttribute('aria-expanded', 'false');
    });

    if (header) header.classList.remove('header--menu-open');
  }

  buttons.forEach(btn => {
    const key = btn.dataset.open;
    const menu = document.querySelector(`.header-menu-open[data-open="${key}"]`);
    if (!menu) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const opened = menu.classList.contains('is-open');
      closeAllMenus();
      if (!opened) {
        menu.classList.add('is-open');
        btn.classList.add('is-active');
        btn.setAttribute('aria-expanded', 'true');

        if (header) header.classList.add('header--menu-open');
      }
    });

    menu.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  });

  document.addEventListener('click', function () {
    closeAllMenus();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllMenus();
  });

  (function () {
  const header = document.querySelector('.header');
  if (!header) return;

  // проверяем, можно ли делать прозрачной
  const canBeTransparent = document.body.dataset.headerTransparent === "true";

  let lastScrollY = window.scrollY || window.pageYOffset;
  let ticking = false;
  const tolerance = 12;
  const offsetToHide = 60;
  const offsetToOpaque = 20;

  function setOpaque(forceOpaque = null, currentY = window.scrollY || window.pageYOffset) {
    if (!canBeTransparent) {
      header.classList.add('header--opaque');
      header.classList.remove('header--top');
      return;
    }

    if (header.classList.contains('header--menu-open')) {
      header.classList.add('header--opaque');
      header.classList.remove('header--top');
      return;
    }

    if (forceOpaque === true) {
      header.classList.add('header--opaque');
      header.classList.remove('header--top');
      return;
    }
    if (forceOpaque === false) {
      header.classList.remove('header--opaque');
      header.classList.add('header--top');
      return;
    }

    if (currentY > offsetToOpaque) {
      header.classList.add('header--opaque');
      header.classList.remove('header--top');
    } else {
      header.classList.remove('header--opaque');
      header.classList.add('header--top');
    }
  }

  function showHeader() {
    header.classList.remove('header--hidden');
    header.classList.add('header--visible');
    setOpaque(null);
  }

  function hideHeader() {
    header.classList.add('header--hidden');
    header.classList.remove('header--visible');
  }

  function updateOnScroll() {
    const currentY = window.scrollY || window.pageYOffset;
    
    if (document.querySelector('.header-menu-open.is-open') || header.classList.contains('header--menu-open')) {
      header.classList.remove('header--hidden');
      header.classList.add('header--visible');
      setOpaque(true);
      lastScrollY = currentY;
      ticking = false;
      return;
    }

    const delta = currentY - lastScrollY;

    if (Math.abs(delta) > tolerance) {
      if (delta > 0 && currentY > offsetToHide) {
        // скролл вниз
        hideHeader();
      } else if (delta < 0) {
        // скролл вверх
        showHeader();
      }
      lastScrollY = currentY;
    }

    // если вверху страницы шапка прозрачная
    if (currentY <= 0) {
      showHeader();
      setOpaque(false);
    } else {
      setOpaque(null, currentY);
    }

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('wheel', function (e) {
    if (document.querySelector('.header-menu-open.is-open')) return;
    if (Math.abs(e.deltaY) < 1) return;
    if (e.deltaY > 0 && window.scrollY > offsetToHide) hideHeader();
    else if (e.deltaY < 0) showHeader();
  }, { passive: true });

  let touchStartY = null;
  window.addEventListener('touchstart', function (e) {
    if (e.touches && e.touches.length) touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchmove', function (e) {
    if (!touchStartY || document.querySelector('.header-menu-open.is-open')) return;
    const y = e.touches[0].clientY;
    const delta = touchStartY - y;
    if (Math.abs(delta) > tolerance) {
      if (delta > 0 && window.scrollY > offsetToHide) hideHeader();
      else if (delta < 0) showHeader();
      touchStartY = y;
    }
  }, { passive: true });

  window.addEventListener('resize', function () {
    lastScrollY = window.scrollY || window.pageYOffset;
  });
  setOpaque(null, window.scrollY || window.pageYOffset);
  showHeader();
})();
});


// Переключение карточек в секции "Наши работы"

document.addEventListener('DOMContentLoaded', function () {
  const autoConvertOldMarkup = true;

  document.querySelectorAll('.our-work').forEach(function (section, index) {
    let cardsContainer = section.querySelector('.our-work-cards');

    if (!cardsContainer) return;

    if (autoConvertOldMarkup && !cardsContainer.querySelector('.swiper-wrapper')) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('swiper-wrapper');

      const slides = Array.from(cardsContainer.querySelectorAll('.our-work-card'));
      slides.forEach(function (slide) {
        slide.classList.add('swiper-slide');
        wrapper.appendChild(slide);
      });

      cardsContainer.innerHTML = '';
      cardsContainer.appendChild(wrapper);

      if (!cardsContainer.classList.contains('swiper')) {
        cardsContainer.classList.add('swiper');
      }
    } else {
      cardsContainer.querySelectorAll('.our-work-card').forEach(s => {
        if (!s.classList.contains('swiper-slide')) s.classList.add('swiper-slide');
      });
    }

    const prevBtn = section.querySelector('.navigation-left-btn');
    const nextBtn = section.querySelector('.navigation-right-btn');

    const swiperEl = cardsContainer; 

    const swiper = new Swiper(swiperEl, {
      slidesPerView: 3,
      spaceBetween: 10,
      lazy: true,
      watchOverflow: true,
      grabCursor: true,
      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 10
        },
        640: {
          slidesPerView: 2,
          spaceBetween: 10
        },
        1100: {
          slidesPerView: 3,
          spaceBetween: 10
        }
      },
      navigation: {
        prevEl: prevBtn || null,
        nextEl: nextBtn || null
      },
      a11y: true,
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      }
    });

    function updateNavButtons() {
      if (!prevBtn || !nextBtn) return;

      if (swiper.isBeginning) {
        prevBtn.classList.add('is-disabled');
        prevBtn.setAttribute('disabled', 'disabled');
      } else {
        prevBtn.classList.remove('is-disabled');
        prevBtn.removeAttribute('disabled');
      }

      if (swiper.isEnd) {
        nextBtn.classList.add('is-disabled');
        nextBtn.setAttribute('disabled', 'disabled');
      } else {
        nextBtn.classList.remove('is-disabled');
        nextBtn.removeAttribute('disabled');
      }
    }

    swiper.on('init slideChange reachEnd reachBeginning resize', updateNavButtons);
    swiper.init(); 
  });
});











// Расрытие менюшек "Наше произвосдтво" на странице "О компании"

document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.our-production-info-card');

  cards.forEach(card => {
    const openArea = card.querySelector('.our-production-info-card-open');
    const btn = card.querySelector('.open-our-production-info-card-btn');

    // Инициализация состояния
    openArea.style.display = 'none';
    openArea.style.height = '0px';
    btn.setAttribute('aria-expanded', 'false');
    card.setAttribute('aria-expanded', 'false');

    // открыть
    function openCard() {
      if (card.classList.contains('is-open')) return;
      card.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      card.setAttribute('aria-expanded', 'true');

      // показать блок, установить высоту в scrollHeight для анимации
      openArea.style.display = 'block';
      const fullHeight = openArea.scrollHeight + 'px';
      // сначала force reflow, чтобы transition сработал корректно
      openArea.style.height = '0px';
      requestAnimationFrame(() => {
        openArea.style.height = fullHeight;
      });
      // после окончания анимации ставим авто-высоту чтобы контент мог менять размер
    }

    // закрыть
    function closeCard() {
      if (!card.classList.contains('is-open')) return;
      // перед анимацией установим текущую реальную высоту (в px),
      // чтобы переход до 0 был плавным (и не от auto)
      const currentHeight = openArea.scrollHeight + 'px';
      openArea.style.height = currentHeight;
      // ensure reflow
      requestAnimationFrame(() => {
        openArea.style.height = '0px';
      });

      card.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      card.setAttribute('aria-expanded', 'false');
    }

    // По завершении transition: если открыт — сделать высоту auto, если закрыт — скрыть display
    openArea.addEventListener('transitionend', (ev) => {
      if (ev.propertyName !== 'height') return;
      if (card.classList.contains('is-open')) {
        openArea.style.height = 'auto';
      } else {
        openArea.style.display = 'none';
      }
    });

    // Клик по карточке: переключаем, но игнорируем клики по самому открытому контенту
    card.addEventListener('click', (e) => {
      if (e.target.closest('.our-production-info-card-open')) return; // не трогаем при клике в контенте
      // если нажали на кнопку — обработается отдельно (мы остановим всплытие). Но обрабатываем общий клик тоже.
      if (card.classList.contains('is-open')) {
        closeCard();
      } else {
        openCard();
      }
    });

    // Клик по кнопке — останавливаем всплытие и переключаем
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (card.classList.contains('is-open')) closeCard(); else openCard();
    });

    // Клавиши (Enter / Space) для accessibility: переключаем карточку при фокусе
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (card.classList.contains('is-open')) closeCard(); else openCard();
      }
    });
  });
});











// Отзывы

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.read-more-review-btn');

  buttons.forEach((btn, index) => {
    const card = btn.closest('.reviews-card');
    if (!card) {
      console.warn('Кнопка "Читать далее" не находится внутри .reviews-card', btn);
      return;
    }

    const text = card.querySelector('.reviews-card-text');
    if (!text) {
      console.warn('Не найден элемент .reviews-card-text в карточке', card);
      return;
    }

    const label = btn.querySelector('span') || btn; 
    const textId = text.id || `review-text-${index}`;
    text.id = textId;
    btn.setAttribute('aria-controls', textId);
    btn.setAttribute('aria-expanded', 'false');

    if (!text.style.transition) {
      text.style.transition = 'max-height 350ms cubic-bezier(.2,.9,.2,1), opacity 200ms ease';
    }

    text.classList.add('collapsed');

    const collapsedHeight = text.getBoundingClientRect().height;
    const fullHeight = text.scrollHeight;

    if (fullHeight <= collapsedHeight + 1) {
      btn.style.display = 'none';
      text.style.maxHeight = 'none';
      return;
    }

    text.dataset.collapsedHeight = collapsedHeight;
    text.style.maxHeight = collapsedHeight + 'px';

    text.dataset.animating = 'false';

    btn.addEventListener('click', () => {
      if (text.dataset.animating === 'true') return; 
      const expanded = btn.getAttribute('aria-expanded') === 'true';

      if (!expanded) {
        text.dataset.animating = 'true';

        text.classList.remove('collapsed');

        const full = text.scrollHeight;

        text.style.maxHeight = full + 'px';
        btn.setAttribute('aria-expanded', 'true');
        if (label) label.textContent = 'Свернуть';

        const onExpandEnd = (e) => {
          if (e.propertyName !== 'max-height') return;
          text.style.maxHeight = 'none';
          text.dataset.animating = 'false';
          text.removeEventListener('transitionend', onExpandEnd);
        };
        text.addEventListener('transitionend', onExpandEnd);

      } else { 
        text.dataset.animating = 'true';

        if (text.style.maxHeight === 'none' || !text.style.maxHeight) {
          text.style.maxHeight = text.scrollHeight + 'px';
        }

        void text.offsetHeight;

        const collapsed = parseFloat(text.dataset.collapsedHeight);
        text.style.maxHeight = collapsed + 'px';

        const onCollapseEnd = (e) => {
          if (e.propertyName !== 'max-height') return;
          text.classList.add('collapsed');
          text.dataset.animating = 'false';
          text.removeEventListener('transitionend', onCollapseEnd);
        };
        text.addEventListener('transitionend', onCollapseEnd);

        btn.setAttribute('aria-expanded', 'false');
        if (label) label.textContent = 'Читать далее';
      }
    });
  });
});
