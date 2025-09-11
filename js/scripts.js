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
      grabCursor: false,
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
  const modal = document.getElementById('review-modal');
  const overlay = modal?.querySelector('.review-modal-overlay');
  const panel = modal?.querySelector('.review-modal-panel');
  const closeBtn = modal?.querySelector('.review-modal-close');
  const authorEl = modal?.querySelector('.review-modal-author');
  const textEl = modal?.querySelector('.review-modal-text');
  const imgEl = modal?.querySelector('.review-modal-img');

  let lastFocusedElement = null;
  let focusableNodes = [];
  let firstFocusable = null;
  let lastFocusable = null;

  function updateFocusable() {
    focusableNodes = panel.querySelectorAll('a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
    if (focusableNodes.length) {
      firstFocusable = focusableNodes[0];
      lastFocusable = focusableNodes[focusableNodes.length - 1];
    } else {
      firstFocusable = lastFocusable = closeBtn;
    }
  }
  function trapTab(e) {
    if (e.key !== 'Tab') return;
    if (!firstFocusable) return;
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  function openModal() {
    lastFocusedElement = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateFocusable();
    (firstFocusable || closeBtn).focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') lastFocusedElement.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
    trapTab(e);
  }

  overlay?.addEventListener('click', closeModal);
  closeBtn?.addEventListener('click', closeModal);
  panel?.addEventListener('click', (e) => e.stopPropagation());

  const CARDS_SELECTOR = '.reviews-card';
  const BTN_SELECTOR = '.read-more-review-btn';
  const TEXT_SELECTOR = '.reviews-card-text';
  const AUTHOR_SELECTOR = '.reviews-card-author';
  const IMG_SELECTOR = '.reviews-card-right-side img';

  function debounce(fn, ms = 120) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  function isTruncated(el) {
    if (!el) return false;

    return el.scrollHeight > el.clientHeight + 1;
  }

  const cards = document.querySelectorAll(CARDS_SELECTOR);
  cards.forEach((card, index) => {
    const textNode = card.querySelector(TEXT_SELECTOR);
    const btn = card.querySelector(BTN_SELECTOR);
    const authorNode = card.querySelector(AUTHOR_SELECTOR);
    const imgNode = card.querySelector(IMG_SELECTOR);

    if (!textNode || !btn) return;

    textNode.classList.add('collapsed');

    const textId = textNode.id || `review-text-${index}`;
    textNode.id = textId;
    btn.setAttribute('aria-controls', textId);
    btn.setAttribute('aria-expanded', 'false');

    const recompute = () => {
      void textNode.offsetHeight;
      if (!isTruncated(textNode)) {
        btn.style.display = 'none';
        btn.setAttribute('aria-expanded', 'false');
      } else {
        btn.style.display = ''; 
      }
    };

    requestAnimationFrame(recompute);

    const ro = (typeof ResizeObserver !== 'undefined') ? new ResizeObserver(debounce(recompute, 120)) : null;
    if (ro) ro.observe(textNode);

    const mo = new MutationObserver(debounce(recompute, 120));
    mo.observe(textNode, { childList: true, subtree: true, characterData: true });

    window.addEventListener('resize', debounce(recompute, 150));

    btn.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      if (btn.style.display === 'none') return;

      if (authorNode) {
        authorEl.innerHTML = authorNode.innerHTML.trim();
      } else {
        authorEl.textContent = '';
      }

      if (textNode) {
        textEl.innerHTML = textNode.innerHTML.trim();
      } else {
        textEl.textContent = '';
      }

      openModal();
    });
  });

  window.reviewsRecomputeButtons = function() {
    document.querySelectorAll(CARDS_SELECTOR).forEach((card, i) => {
      const text = card.querySelector(TEXT_SELECTOR);
      const btn = card.querySelector(BTN_SELECTOR);
      if (!text || !btn) return;
      void text.offsetHeight;
      if (isTruncated(text)) btn.style.display = '';
      else btn.style.display = 'none';
    });
  };
});




// Модальное окно для просмотра фотографий отзыва

document.addEventListener('DOMContentLoaded', () => {
  const THUMBS_SELECTOR = '.reviews-card-right-side img';
  const thumbs = Array.from(document.querySelectorAll(THUMBS_SELECTOR));
  if (!thumbs.length) return;

  const modal = document.getElementById('image-modal');
  const overlay = modal?.querySelector('.image-modal-overlay');
  const panel = modal?.querySelector('.image-modal-panel');
  const closeBtn = modal?.querySelector('.image-modal-close');
  const prevBtn = modal?.querySelector('.image-modal-prev');
  const nextBtn = modal?.querySelector('.image-modal-next');
  const swiperContainer = modal?.querySelector('.image-modal-swiper');
  const swiperWrapper = swiperContainer?.querySelector('.swiper-wrapper');

  let swiper = null;
  let createdSlides = false;
  let lastFocused = null;
  let currentNatural = { w: 0, h: 0 };

  function buildSlides() {
    if (!swiperWrapper) return;
    swiperWrapper.innerHTML = ''; 
    thumbs.forEach((t, idx) => {
      const src = t.getAttribute('src');
      const alt = t.getAttribute('alt') || '';
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `${idx + 1} of ${thumbs.length}`);
      const img = document.createElement('img');
      img.src = src;
      img.alt = alt;
      img.loading = 'lazy';
      img.draggable = false;
      img.addEventListener('load', () => {
        img.classList.add('loaded');
        applyScaleToImg(img);
      });
      slide.appendChild(img);
      swiperWrapper.appendChild(slide);
    });
    createdSlides = true;
  }

  function applyScaleToImg(imgEl) {
    if (!imgEl) return;
    imgEl.style.width = '100%';
    imgEl.style.height = '100%';
    imgEl.style.objectFit = 'cover'; 
  }

  function initSwiper(startIndex = 0) {
    if (!swiperContainer) return;
    if (!createdSlides) buildSlides();

    if (swiper) {
      swiper.update();
      setTimeout(() => swiper.slideTo(startIndex, 0), 0);
      return;
    }

    swiper = new Swiper(swiperContainer, {
      slidesPerView: 1,
      centeredSlides: true,   
      spaceBetween: 16,
      loop: false,
      speed: 360,
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn
      },
      keyboard: { enabled: false },
      on: {
        slideChange: function() {
          const imgs = swiperWrapper.querySelectorAll('img');
          const currentImg = imgs[swiper.activeIndex];
          if (currentImg) setTimeout(() => applyScaleToImg(currentImg), 80);
        },
        init: function() {
          if (closeBtn) closeBtn.focus();
        }
      }
    });

    swiperWrapper.addEventListener('pointerdown', (e) => {
      const img = e.target.closest('img');
      if (!img) return;
      img.classList.remove('dragging');
      img.setPointerCapture(e.pointerId);
      img.addEventListener('pointermove', onPointerMove);
      img.addEventListener('pointerup', onPointerUp);
      function onPointerMove() {
        img.classList.add('dragging');
      }
      function onPointerUp(ev) {
        img.classList.remove('dragging');
        try { img.releasePointerCapture(ev.pointerId); } catch (err) {}
        img.removeEventListener('pointermove', onPointerMove);
        img.removeEventListener('pointerup', onPointerUp);
      }
    });
  }

  function openImageModal(index = 0) {
    lastFocused = document.activeElement;
    initSwiper(index);

    if (swiper) {
      setTimeout(() => {
        const idx = Math.max(0, Math.min(index, thumbs.length - 1));
        swiper.slideTo(idx, 0);

        const targetImg = swiperWrapper.querySelectorAll('img')[idx];
        if (targetImg && targetImg.complete) applyScaleToImg(targetImg);
      }, 0);
    }
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
    document.addEventListener('keydown', onKey);
  }

  function closeImageModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  function onKey(e) {
    if (e.key === 'Escape') { closeImageModal(); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); if (swiper) swiper.slidePrev(); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); if (swiper) swiper.slideNext(); return; }
  }

  thumbs.forEach((node, idx) => {
    node.style.cursor = 'pointer';
    node.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      openImageModal(idx);
    });
  });

  overlay?.addEventListener('click', closeImageModal);
  closeBtn?.addEventListener('click', closeImageModal);

  window.addEventListener('resize', () => {
    if (!modal.classList.contains('open')) return;
    if (!swiper) return;
    const imgs = swiperWrapper.querySelectorAll('img');
    const currentImg = imgs[swiper.activeIndex];
    if (currentImg) applyScaleToImg(currentImg);
  });
});
