// Появление шапки

document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.header-navigation[data-open]');
  const menus = document.querySelectorAll('.header-menu-open[data-open]');
  const header = document.querySelector('.header');
  const headerFirstLine = document.querySelector('.header-first-line');
  const headerMobileLine = document.querySelector('.header-mobile-line');
  const headerMobileLineP = document.querySelector('.header-mobile-line p');
  const headerMobileEmail = document.querySelector('.header-mobile-email');
  const headerMobilePhone = document.querySelector('.header-mobile-phone');
  const headerLastLine = document.querySelector('.header-last-line');

  const burgerBtn = document.querySelector('.burger-btn');
  const burgerMenu = document.querySelector('.header-menu-open-burger');

  let _scrollPosition = null; 

  function lockBodyScroll() {
    if (_scrollPosition !== null) return; 
    _scrollPosition = window.scrollY || window.pageYOffset || 0;
    document.body.style.top = `-${_scrollPosition}px`;
    document.body.classList.add('no-scroll');
  }

  function unlockBodyScroll() {
    if (_scrollPosition === null) return; 
    document.body.classList.remove('no-scroll');
    document.body.style.top = '';
    window.scrollTo(0, _scrollPosition);
    _scrollPosition = null;
  }

  function positionBurgerMenu() {
    if (!burgerMenu) return;
    const headerEl = document.querySelector('.header');
    const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 0;
    burgerMenu.style.top = `${headerHeight}px`;
    burgerMenu.style.height = `calc(100vh - ${headerHeight}px)`;
  }

  function closeAllMenus() {
    menus.forEach(m => m.classList.remove('is-open'));
    buttons.forEach(b => {
      b.classList.remove('is-active');
      b.setAttribute('aria-expanded', 'false');
    });

    if (burgerMenu) burgerMenu.classList.remove('is-open');
    if (burgerBtn) {
      burgerBtn.classList.remove('is-active');
      burgerBtn.setAttribute('aria-expanded', 'false');
    }

    if (header) header.classList.remove('header--menu-open');

    unlockBodyScroll();
  }

  if (burgerBtn && burgerMenu) {
    burgerBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const opened = burgerMenu.classList.contains('is-open');
      closeAllMenus();
      if (!opened) {
        positionBurgerMenu();
        burgerMenu.classList.add('is-open');
        burgerBtn.classList.add('is-active');
        burgerBtn.setAttribute('aria-expanded', 'true');

        lockBodyScroll();

        if (header) header.classList.add('header--menu-open');
      } else {
        burgerBtn.setAttribute('aria-expanded', 'false');
      }
    });

    burgerMenu.addEventListener('click', function (e) {
      e.stopPropagation();
    });
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
    if (e.key === 'Escape' || e.key === 'Esc') closeAllMenus();
  });

  (function headerScrollController() {
    if (!header) return;

    const canBeTransparent = document.body.dataset.headerTransparent === "true";
    let lastScrollY = window.scrollY || window.pageYOffset || 0;
    let ticking = false;
    const tolerance = 12;
    const offsetToHide = 60;
    const offsetToOpaque = 20;

    function setOpaque(forceOpaque = null, currentY = window.scrollY || window.pageYOffset || 0) {
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
        if (burgerBtn) burgerBtn.classList.remove('opaque');
        if (headerFirstLine) headerFirstLine.classList.remove('opaque');
        if (headerMobileLine) headerMobileLine.classList.remove('opaque');
        if (headerMobileLineP) headerMobileLineP.classList.remove('opaque');
        if (headerMobileEmail) headerMobileEmail.classList.remove('opaque');
        if (headerMobilePhone) headerMobilePhone.classList.remove('opaque');
        if (headerLastLine) headerLastLine.classList.remove('opaque');
      } else {
        header.classList.remove('header--opaque');
        header.classList.add('header--top');
        if (burgerBtn) burgerBtn.classList.add('opaque');
        if (headerFirstLine) headerFirstLine.classList.add('opaque');
        if (headerMobileLine) headerMobileLine.classList.add('opaque');
        if (headerMobileLineP) headerMobileLineP.classList.add('opaque');
        if (headerMobileEmail) headerMobileEmail.classList.add('opaque');
        if (headerMobilePhone) headerMobilePhone.classList.add('opaque');
        if (headerLastLine) headerLastLine.classList.add('opaque');
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
      const currentY = window.scrollY || window.pageYOffset || 0;

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
      if (document.querySelector('.header-menu-open.is-open') || (burgerMenu && burgerMenu.classList.contains('is-open'))) return;
      if (Math.abs(e.deltaY) < 1) return;
      if (e.deltaY > 0 && window.scrollY > offsetToHide) hideHeader();
      else if (e.deltaY < 0) showHeader();
    }, { passive: true });

    let touchStartY = null;
    window.addEventListener('touchstart', function (e) {
      if (e.touches && e.touches.length) touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', function (e) {
      if (!touchStartY) return;

      if (document.querySelector('.header-menu-open.is-open') || (burgerMenu && burgerMenu.classList.contains('is-open'))) return;
      const y = e.touches[0].clientY;
      const delta = touchStartY - y;
      if (Math.abs(delta) > tolerance) {
        if (delta > 0 && window.scrollY > offsetToHide) hideHeader();
        else if (delta < 0) showHeader();
        touchStartY = y;
      }
    }, { passive: true });

    window.addEventListener('resize', function () {
      lastScrollY = window.scrollY || window.pageYOffset || 0;
      positionBurgerMenu();
    });

    setOpaque(null, window.scrollY || window.pageYOffset || 0);
    showHeader();
  })();

  positionBurgerMenu();

  if (burgerMenu && burgerMenu.classList.contains('is-open')) {
    lockBodyScroll();
    positionBurgerMenu();
  }
});


// Переход по ссылке внутри карточкек we-produce-cards

const weProduceCards = document.querySelector('.we-produce-card');

if (weProduceCards) {
  document.querySelectorAll('.we-produce-card[data-href]').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      const href = card.dataset.href;
      if (href) window.location.href = href;
    });
  });
}


// Слайдер главного баннера
const swiperBgElement = document.querySelector('.bg-swiper');

if (swiperBgElement) {
  const bgSwiper = new Swiper('.bg-swiper', {
    loop: false,
    effect: 'fade',
    speed: 600,
    allowTouchMove: true,
    simulateTouch: true,
    autoplay: { delay: 5000 },
    navigation: {
      nextEl: '.navigation-right-btn',
      prevEl: '.navigation-left-btn',
    },
  });

    const banner = document.querySelector('.current-page-info-banner');
    function updateBanner() {
      const real = bgSwiper.realIndex + 1;
      const total = bgSwiper.slides.length - (bgSwiper.loop ? 0 : 0); 
      if (banner) banner.textContent = `${real}-${bgSwiper.slides.length - bgSwiper.loop ? bgSwiper.slides.length : bgSwiper.slides.length}`;
    }
    bgSwiper.on('slideChange', updateBanner);
    updateBanner();
}

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

    openArea.style.display = 'none';
    openArea.style.height = '0px';
    btn.setAttribute('aria-expanded', 'false');
    card.setAttribute('aria-expanded', 'false');

    function openCard() {
      if (card.classList.contains('is-open')) return;
      card.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      card.setAttribute('aria-expanded', 'true');

      openArea.style.display = 'block';
      const fullHeight = openArea.scrollHeight + 'px';
      openArea.style.height = '0px';
      requestAnimationFrame(() => {
        openArea.style.height = fullHeight;
      });
    }

    // закрыть
    function closeCard() {
      if (!card.classList.contains('is-open')) return;

      const currentHeight = openArea.scrollHeight + 'px';
      openArea.style.height = currentHeight;

      requestAnimationFrame(() => {
        openArea.style.height = '0px';
      });

      card.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      card.setAttribute('aria-expanded', 'false');
    }
    
    openArea.addEventListener('transitionend', (ev) => {
      if (ev.propertyName !== 'height') return;
      if (card.classList.contains('is-open')) {
        openArea.style.height = 'auto';
      } else {
        openArea.style.display = 'none';
      }
    });

    card.addEventListener('click', (e) => {
      if (e.target.closest('.our-production-info-card-open')) return;
  
      if (card.classList.contains('is-open')) {
        closeCard();
      } else {
        openCard();
      }
    });

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (card.classList.contains('is-open')) closeCard(); else openCard();
    });

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



// Яндекс карта
const maps = document.querySelectorAll(".maps");

let center = [55.01313106967953, 60.096861499999896];

function getZoom() {
  return window.innerWidth <= 500 ? 17 : 16.5;
}

function createMap(mapId) {
  const mapInstance = new ymaps.Map(mapId, {
    center: center,
    zoom: getZoom(),
    controls: [],
    type: "yandex#map",
  });

  mapInstance.options.set('preset', 'islands#dark');

  let placemark = new ymaps.Placemark(center, {}, {
    iconLayout: "default#image",
    iconImageHref: "/images/marker.svg",
    iconImageSize: [40, 40],
    iconImageOffset: [-19, -44],
  });

  placemark.events.add("click", function () {
    const url = "https://yandex.ru/maps/11212/miass/house/ulitsa_60_let_oktyabrya_13a_2/YkkYdg5mQUMGQFtvfXxwcn1gZQ==/?ll=60.096861%2C55.013131&z=17.13";
    window.open(url, "_blank");
  });

  mapInstance.geoObjects.add(placemark);
  mapInstance.container.fitToViewport();

  return mapInstance;
}

ymaps.ready(() => {
  const mapInstances = {};

  maps.forEach(mapDiv => {
    mapInstances[mapDiv.id] = createMap(mapDiv.id);
  });

  window.addEventListener("resize", () => {
    Object.values(mapInstances).forEach(mapObj => {
      if (mapObj && mapObj.container) {
        mapObj.setZoom(getZoom());
        mapObj.container.fitToViewport();
      }
    });
  });
});


// Страница "Гарантия"

const guaranteeSwiper = document.querySelector('.guarantee-content-left-image.swiper');

if (guaranteeSwiper) {
  const swiper = new Swiper(guaranteeSwiper, {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: false,
    autoHeight: false,
    watchOverflow: true,
    observer: true,
    observeParents: true,
    navigation: {
      nextEl: '.swiper-navigation-right-btn',
      prevEl: '.swiper-navigation-left-btn',
      disabledClass: 'swiper-button-disabled',
    },
    breakpoints: {
      0: { slidesPerView: 1 },
      768: { slidesPerView: 1 },
      1200: { slidesPerView: 1 },
    },
  });

  swiper.update();

  window.addEventListener('resize', () => swiper.update());
}

// Страница "Новости" (теги)

document.addEventListener('DOMContentLoaded', () => {
  const VISIBLE_COUNT = 5; // показываем первые 5 тегов
  const swiperEl = document.querySelector('.news-tags.swiper');
  if (!swiperEl) return;

  const wrapper = swiperEl.querySelector('.swiper-wrapper');
  const btn = document.querySelector('.show-more-tags');
  if (!wrapper || !btn) return;

  const originalBtnParent = btn.parentNode;
  const originalBtnNextSibling = btn.nextSibling;

  function isOverflowing() {
    const container = swiperEl;
    return wrapper.scrollWidth > container.clientWidth + 1;
  }

  function getTagSlides() {
    return Array.from(wrapper.querySelectorAll('.news-tag.swiper-slide:not(.show-more-slide)'));
  }

  function hideExtraSlides() {
    const tagSlides = getTagSlides();
    tagSlides.forEach((s, i) => {
      if (i >= VISIBLE_COUNT) s.classList.add('hidden-slide');
      else s.classList.remove('hidden-slide');
    });
  }

  let btnSlide = wrapper.querySelector('.show-more-slide');
  function ensureBtnIsSlide() {
    if (!btnSlide) {
      btnSlide = document.createElement('div');
      btnSlide.className = 'news-tag swiper-slide show-more-slide';
      btnSlide.appendChild(btn);
      wrapper.appendChild(btnSlide);
    }
  }

  function decideBtnVisibilityInitial() {
    const tagSlides = getTagSlides();
    if (tagSlides.length <= VISIBLE_COUNT && !isOverflowing()) {
      btn.style.display = 'none';
      return false;
    } else {
      btn.style.display = '';
      return true;
    }
  }

  const SWIPER_BREAKPOINTS = {
    0: { spaceBetween: 50 },    
    700: { spaceBetween: 60 },   
    1920: { spaceBetween: 60 }   
  };

  let swiper = null;
  function initSwiper() {
    ensureBtnIsSlide();

    if (swiper) swiper.destroy(true, true);

    swiper = new Swiper(swiperEl, {
      slidesPerView: 'auto',
      spaceBetween: 60,
      freeMode: true,
      loop: false,
      watchOverflow: false, 
      grabCursor: true,
      breakpoints: SWIPER_BREAKPOINTS
    });

    updateSlidesOffsetAfter();
  }

  function updateSlidesOffsetAfter() {
    if (!swiper) return;
    const btnSlideEl = wrapper.querySelector('.show-more-slide');
    const btnWidth = btnSlideEl ? btnSlideEl.offsetWidth : 0;
    swiper.params.slidesOffsetAfter = btnWidth + 24;
    swiper.update();
  }

  const shouldShowBtn = decideBtnVisibilityInitial();


  if (!shouldShowBtn) {
    if (btn.parentNode !== originalBtnParent) {
      if (originalBtnNextSibling) originalBtnParent.insertBefore(btn, originalBtnNextSibling);
      else originalBtnParent.appendChild(btn);
    }

    swiper = new Swiper(swiperEl, {
      slidesPerView: 'auto',
      spaceBetween: 60,
      freeMode: true,
      loop: false,
      watchOverflow: true,
      grabCursor: true,
      breakpoints: SWIPER_BREAKPOINTS
    });
    hideExtraSlides();
    return;
  }

  ensureBtnIsSlide();
  hideExtraSlides();
  initSwiper();

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const label = btn.querySelector('.label');

    if (!expanded) {
      const tagSlides = getTagSlides();
      tagSlides.forEach(s => s.classList.remove('hidden-slide'));

      if (label) label.textContent = 'Скрыть все теги';
      btn.classList.add('rotated', 'inside-slide');
      btn.setAttribute('aria-expanded', 'true');

      const currentIndex = swiper ? swiper.activeIndex : 0;
      updateSlidesOffsetAfter();
      swiper.update();
      setTimeout(() => {
        const safeIndex = Math.min(currentIndex, swiper.slides.length - 1);
        swiper.slideTo(safeIndex, 0);
      }, 60);

    } else {
      hideExtraSlides();
      if (label) label.textContent = 'Показать все теги';
      btn.classList.remove('rotated', 'inside-slide');
      btn.setAttribute('aria-expanded', 'false');

      updateSlidesOffsetAfter();
      swiper.update();
      setTimeout(() => { swiper.slideTo(0, 200); }, 60);
    }
  });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const needBtn = decideBtnVisibilityInitial();
      if (!needBtn) {
        btn.style.display = 'none';
        if (btn.parentNode !== originalBtnParent) {
          if (originalBtnNextSibling) originalBtnParent.insertBefore(btn, originalBtnNextSibling);
          else originalBtnParent.appendChild(btn);
        }
        if (swiper) { swiper.destroy(true, true); swiper = null; }
        new Swiper(swiperEl, {
          slidesPerView: 'auto',
          spaceBetween: 60,
          freeMode: true,
          loop: false,
          watchOverflow: true,
          grabCursor: true,
          breakpoints: SWIPER_BREAKPOINTS
        });
        hideExtraSlides();
        return;
      } else {
        btn.style.display = '';
        ensureBtnIsSlide();
        hideExtraSlides();
        initSwiper();
      }
    }, 120);
  });
});



// Загрузка карты

const deliveryMap = document.querySelector('.delivery-map');

if (deliveryMap) {
  (async function () {
    const container = document.getElementById('svgContainer');
    const tooltip = document.getElementById('mapTooltip');
    const wrap = document.getElementById('svgWrap');

    const svgPath = wrap.dataset.svg; // <-- путь из data-svg

    const fallbackDelivery = {
      'zone-1': '1–2 дня',
      'region-12': '3–5 дней',
    };

    function showLog(...args) {
      // console.log('[map]', ...args);
    }

    function normalizeDeliveryFromAttrs(el) {
      if (!el || !el.attributes) return;
      if (el.dataset && el.dataset.delivery) return;
      for (let i = 0; i < el.attributes.length; i++) {
        const name = el.attributes[i].name.toLowerCase();
        const val  = el.attributes[i].value;
        if (name.includes('deliv') || name.includes('deli') || name.includes('dilev') || name.includes('delivery')) {
          try { el.dataset.delivery = val; showLog('fixed dataset.delivery from attr', name, val, el.id || el.tagName); } catch (e) { }
          return;
        }
      }
    }

    function getDeliveryText(el) {
      if (!el) return '';
      if (el.dataset && el.dataset.delivery) return el.dataset.delivery;
      if (el.id && fallbackDelivery[el.id]) return fallbackDelivery[el.id];
      const title = el.querySelector && el.querySelector('title');
      if (title) return title.textContent.trim();
      return 'время доставки неизвестно';
    }

    function showTooltip(text, clientX, clientY) {
      tooltip.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;">
          <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_1240_2732)">
            <path d="M19.999 9.25016C19.999 7.18266 18.3165 5.50016 16.249 5.50016H14.1657V3.41683C14.1657 2.2685 13.2315 1.3335 12.0824 1.3335H9.99902V2.16683H12.0824C12.7715 2.16683 13.3324 2.72766 13.3324 3.41683V15.5002H0.832357V10.5002H-0.000976562V16.3335H1.81236C1.71518 16.6006 1.66554 16.8826 1.66569 17.1668C1.66569 18.5452 2.78736 19.6668 4.16569 19.6668C5.54402 19.6668 6.66569 18.5452 6.66569 17.1668C6.66569 16.8802 6.61569 16.5993 6.51902 16.3335H13.479C13.3818 16.6006 13.3322 16.8826 13.3324 17.1668C13.3324 18.5452 14.454 19.6668 15.8324 19.6668C17.2107 19.6668 18.3324 18.5452 18.3324 17.1668C18.3324 16.8802 18.2824 16.5993 18.1857 16.3335H19.999V9.25016ZM5.83236 17.1668C5.83236 18.086 5.08486 18.8335 4.16569 18.8335C3.24652 18.8335 2.49902 18.086 2.49902 17.1668C2.49902 16.8735 2.57819 16.5893 2.72986 16.3335H5.60152C5.75319 16.5893 5.83236 16.8735 5.83236 17.1668ZM16.249 6.3335C17.8574 6.3335 19.1657 7.64183 19.1657 9.25016V10.5002H14.1657V6.3335H16.249ZM17.499 17.1668C17.499 18.086 16.7515 18.8335 15.8324 18.8335C14.9132 18.8335 14.1657 18.086 14.1657 17.1668C14.1657 16.8735 14.2449 16.5893 14.3965 16.3335H17.2682C17.4199 16.5893 17.499 16.8735 17.499 17.1668ZM14.1657 15.5002V11.3335H19.1657V15.5002H14.1657ZM8.33236 2.16683H-0.000976562V1.3335H8.33236V2.16683ZM6.66569 5.50016H-0.000976562V4.66683H6.66569V5.50016ZM4.99902 8.8335H-0.000976562V8.00016H4.99902V8.8335Z" fill="white"/>
            </g>
            <defs>
            <clipPath id="clip0_1240_2732">
            <rect width="20" height="20" fill="white" transform="translate(-0.000976562 0.5)"/>
            </clipPath>
            </defs>
          </svg>

          <span>${text}</span>
        </div>
      `;
      tooltip.setAttribute('aria-hidden', 'false');
      tooltip.classList.add('show');
      const pad = 12;
      const tipRect = tooltip.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      let left = clientX + 14;
      let top = clientY + 14;
      if (left + tipRect.width + pad > vw) { left = clientX - tipRect.width - 14; }
      if (left < pad) left = pad;
      if (top + tipRect.height + pad > vh) { top = clientY - tipRect.height - 14; }
      if (top < pad) top = pad;
      tooltip.style.left = Math.round(left) + 'px';
      tooltip.style.top = Math.round(top) + 'px';
    }
    function hideTooltip() { tooltip.classList.remove('show'); tooltip.setAttribute('aria-hidden', 'true'); }

    try {
      const res = await fetch(svgPath, { cache: 'no-cache' });
      if (!res.ok) throw new Error('SVG not found: ' + res.status);
      const svgText = await res.text();
      container.innerHTML = svgText;
      const svgEl = container.querySelector('svg');
      if (!svgEl) throw new Error('Вставленный файл не содержит <svg>');
      svgEl.setAttribute('role', 'img');
      svgEl.setAttribute('aria-hidden', 'false');

      const prims = Array.from(svgEl.querySelectorAll('path, polygon, rect, circle, g'));
      prims.forEach(el => {
        normalizeDeliveryFromAttrs(el);

        try {
          if (!el.classList.contains('region')) {
            let keep = true;
            if (typeof el.getBBox === 'function') {
              const bb = el.getBBox();
              if (bb.width <= 1 || bb.height <= 1) keep = false;
            }
            if (keep) el.classList.add('region');
          }
        } catch (e) {
          if (!el.classList.contains('region')) el.classList.add('region');
        }
      });

      let targets = Array.from(svgEl.querySelectorAll('[data-delivery], .region, [id^="zone"], [id^="region"], path[data-delivery], polygon[data-delivery], rect[data-delivery]'));
      if (!targets.length) {
        targets = Array.from(svgEl.querySelectorAll('path, polygon, rect')).slice(0, 200);
        showLog('used fallback elements count=', targets.length);
        targets.forEach(t => t.classList.add('region'));
      }

      showLog('Interactive SVG ready, regions found:', targets.length);
      showLog(targets.slice(0,20).map(el => ({ tag: el.tagName, id: el.id || null, class: el.getAttribute('class'), data_delivery: el.dataset ? el.dataset.delivery : null })));

      let activeTouchTarget = null;
      let lastPointerType = null;

      targets.forEach(el => {
        if (!el.classList.contains('region')) el.classList.add('region');
        el.style.pointerEvents = 'auto';

        el.addEventListener('mouseenter', (ev) => {
          lastPointerType = ev.pointerType || 'mouse';
          normalizeDeliveryFromAttrs(el);
          el.classList.add('hovered');
          const text = getDeliveryText(el);
          const clientX = ev.clientX || (ev.touches && ev.touches[0] && ev.touches[0].clientX) || 0;
          const clientY = ev.clientY || (ev.touches && ev.touches[0] && ev.touches[0].clientY) || 0;
          showTooltip(text, clientX, clientY);
        });

        el.addEventListener('mousemove', (ev) => {
          const clientX = ev.clientX || 0;
          const clientY = ev.clientY || 0;
          if (tooltip.classList.contains('show')) showTooltip(getDeliveryText(el), clientX, clientY);
        });

        el.addEventListener('mouseleave', (ev) => {
          el.classList.remove('hovered');
          if (lastPointerType !== 'touch') hideTooltip();
        });

        el.addEventListener('click', (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          const isSame = activeTouchTarget === el;
          if (isSame) {
            el.classList.remove('hovered');
            hideTooltip();
            activeTouchTarget = null;
          } else {
            if (activeTouchTarget) activeTouchTarget.classList.remove('hovered');
            activeTouchTarget = el;
            el.classList.add('hovered');
            const clientX = (ev.clientX || 0);
            const clientY = (ev.clientY || 0);
            showTooltip(getDeliveryText(el), clientX, clientY);
          }
        }, { passive: false });
      });

      document.addEventListener('click', (ev) => {
        if (!wrap.contains(ev.target)) {
          targets.forEach(t => t.classList.remove('hovered'));
          hideTooltip();
          activeTouchTarget = null;
        }
      });

      window.addEventListener('resize', () => { if (tooltip.classList.contains('show')) hideTooltip(); });

    } catch (err) {
      console.error('Ошибка при загрузке или инициализации SVG:', err);
      container.innerHTML = '<p style="color:#c00">Не удалось загрузить карту. Проверьте путь к SVG (svgPath) и что файл доступен.</p>';
    }
  })();
}


// Переключение карточек в секции "Товары из статьи" с 3d моделями

const newsInfoCardsSwiper = document.querySelector('.news-info-cards.swiper');

if (newsInfoCardsSwiper) {
  const swiper = new Swiper('.news-info-cards.swiper', {
      slidesPerView: 'auto',
      spaceBetween: 10,
      grabCursor: true,
      loop: false,
      navigation: {
        nextEl: '.navigation-right-btn',
        prevEl: '.navigation-left-btn',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });

    document.querySelectorAll('model-viewer, [data-interactive="true"]').forEach(el => {
      el.addEventListener('pointerdown', (e) => {
        e.stopPropagation();  
        try { swiper.allowTouchMove = false; } catch (err) {}
      }, {passive: false});

      const enableSwiper = (e) => {
        e && e.stopPropagation();
        try { swiper.allowTouchMove = true; } catch (err) {}
      };

      el.addEventListener('pointerup', enableSwiper);
      el.addEventListener('pointercancel', enableSwiper);
      el.addEventListener('mouseleave', enableSwiper);
      el.addEventListener('touchend', enableSwiper);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      el.addEventListener('wheel', e => {
        e.stopPropagation();
      }, { passive: true });

      el.addEventListener('touchstart', e => e.stopPropagation(), { passive: true });
      el.addEventListener('touchmove', e => e.stopPropagation(), { passive: true });
    });

    let dragging = false;
    swiper.on('touchStart', () => { dragging = false; });
    swiper.on('touchMove', () => { dragging = true; });
    document.querySelectorAll('.our-work-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (dragging) e.preventDefault(); 
      });
    });
}




