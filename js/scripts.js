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
          slidesPerView: 1.5,
          spaceBetween: 10
        },
        701: {
          slidesPerView: 2.3,
          spaceBetween: 10
        },
        1100: {
          slidesPerView: 2.5,
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






// Яндекс карта поставок

const supplyMaps = document.querySelector('.supply-maps')

if (supplyMaps) {
  (function () {
    const DEFAULT_CENTER = [62.0, 90.0];

    function getZoom() {
      return window.innerWidth <= 400 ? 4 : 4;
    }

    function getCenterForWidth(w) {
      if (w <= 500) return [62.0, 50.0];
      if (w <= 600) return [62.0, 55.0];
      if (w <= 780) return [62.0, 60.0];
      if (w <= 900) return [62.0, 65.0];
      if (w <= 1100) return [62.0, 70.0];  
      if (w <= 1350) return [62.0, 80.0];
      return DEFAULT_CENTER; 
    }

    function fontSizeFromCount(count) {
      if (count >= 1000) return 11;
      if (count >= 100) return 12;
      if (count >= 10) return 13;
      return 14;
    }

    function colorFromCount(count) {
      return '#D51A1A';
    }

    function svgDataUri(count, color, fontSize) {
      const padding = 6;
      const approxCharWidth = fontSize * 0.6;
      const textWidth = String(count).length * approxCharWidth;
      const size = Math.max(32, Math.ceil(textWidth + padding * 2));
      const r = size / 2;

      const fontFamily = 'Arial, Helvetica, sans-serif';
      const canvasFont = `${fontSize}px Arial`;
      const svgFontSize = `${fontSize}px`;

      let ascent = null;
      let descent = null;
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.font = canvasFont;
        const metrics = ctx.measureText(String(count));
        if (metrics && typeof metrics.actualBoundingBoxAscent === 'number' && typeof metrics.actualBoundingBoxDescent === 'number') {
          ascent = metrics.actualBoundingBoxAscent;
          descent = metrics.actualBoundingBoxDescent;
        }
      } catch (e) {
      }

      let svg;

      if (ascent != null && descent != null) {
        const baseline = (r + (ascent - descent) / 2);
        const baselineFixed = Math.round(baseline * 10) / 10;

        svg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
            <circle cx="${r}" cy="${r}" r="${r}" fill="${color}" />
            <text x="${r}" y="${baselineFixed}"
                  font-family="${fontFamily}"
                  font-size="${svgFontSize}"
                  font-weight="400"
                  text-anchor="middle"
                  dominant-baseline="alphabetic"
                  fill="#ffffff">${count}</text>
          </svg>`.trim();

      } else {
        svg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
            <circle cx="${r}" cy="${r}" r="${r}" fill="${color}" />
            <text x="50%" y="50%"
                  font-family="${fontFamily}"
                  font-size="${svgFontSize}"
                  font-weight="400"
                  text-anchor="middle"
                  dominant-baseline="middle"
                  dy=".33em"
                  fill="#ffffff">${count}</text>
          </svg>`.trim();
      }

      return { uri: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg), size };
    }

    const isTouchDevice = (function() {
      try {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0) ||
                (window.matchMedia && window.matchMedia('(pointer: coarse)').matches));
      } catch (e) {
        return false;
      }
    })();

    const HOVER_OPEN_DELAY = 120;
    const HOVER_CLOSE_DELAY = 220; 

    function createMap(mapId) {
      const initialCenter = getCenterForWidth(window.innerWidth) || DEFAULT_CENTER;
      const initialZoom = getZoom();

      const mapInstance = new ymaps.Map(mapId, {
        center: initialCenter,
        zoom: initialZoom,
        controls: [], 
        type: "yandex#map",
      });

       mapInstance.options.set('balloonPanelMaxMapArea', 0);
      mapInstance.options.set('preset', 'islands#dark');

      const points = [
        { coords: [69.3498, 88.2026], count: 50, name: 'Норильск' },
        { coords: [67.4971, 64.0419], count: 9,  name: 'Воркута' },
        { coords: [55.7558, 37.6173], count: 12143, name: 'Москва' },
        { coords: [55.7903, 49.1347], count: 111, name: 'Казань' },
        { coords: [55.1644, 61.4368], count: 50583, name: 'Челябинск' },
        { coords: [54.9885, 73.3242], count: 345, name: 'Омск' },
        { coords: [56.0106, 92.8526], count: 345, name: 'Красноярск' },
        { coords: [62.0355,129.6755], count: 17, name: 'Якутск' },
      ];

      const balloonHtml = `
        <div class="custom-hint">
          <div class="custom-hint__projects">Количество проектов в регионе</div>
        </div>`;

      const CustomBalloonLayout = ymaps.templateLayoutFactory.createClass(balloonHtml, {
        build: function () {
          CustomBalloonLayout.superclass.build.call(this);

          const parentEl = this.getParentElement && this.getParentElement();
          if (!parentEl) return;
          const el = parentEl.querySelector('.custom-hint');
          if (!el) return;

          el.classList.remove('is-open');

          setTimeout(function () {
            el.classList.add('is-open');
          }, 10);
        },

        clear: function () {
          const parentEl = this.getParentElement && this.getParentElement();
          const el = parentEl && parentEl.querySelector('.custom-hint');

          if (el) {
            el.classList.remove('is-open');
            const self = this;
            setTimeout(function () {
              CustomBalloonLayout.superclass.clear.call(self);
            }, HOVER_CLOSE_DELAY);
          } else {
            CustomBalloonLayout.superclass.clear.call(this);
          }
        }
      });

      // создаём метки
      points.forEach(p => {
        const fontSize = fontSizeFromCount(p.count);
        const { uri, size } = svgDataUri(p.count, colorFromCount(p.count), fontSize);

        const offsetY = 5; 
        const balloonOffset = [0, -offsetY]; 

        const placemark = new ymaps.Placemark(p.coords, {
          name: p.name,
          count: p.count
        }, {
          iconLayout: "default#image",
          iconImageHref: uri,
          iconImageSize: [size, size],
          iconImageOffset: [-(size / 2), -(size / 2)],
          balloonOffset: balloonOffset,
          balloonContentLayout: CustomBalloonLayout,
          hideIconOnBalloonOpen: false,
          hasHint: true
        });

        mapInstance.geoObjects.add(placemark);

        if (isTouchDevice) {
          placemark.events.add('click', function () {
            if (placemark.balloon.isOpen()) {
              placemark.balloon.close();
            } else {
              placemark.balloon.open();
            }
          });
        } else {
          let openTimer = null;
          let closeTimer = null;

          placemark.events.add('mouseenter', function () {
            if (closeTimer) {
              clearTimeout(closeTimer);
              closeTimer = null;
            }
            if (placemark.balloon.isOpen()) return;

            openTimer = setTimeout(() => {
              placemark.balloon.open();
              openTimer = null;
            }, HOVER_OPEN_DELAY);
          });

          placemark.events.add('mouseleave', function () {
            if (openTimer) {
              clearTimeout(openTimer);
              openTimer = null;
            }
            if (placemark.balloon.isOpen()) {
              closeTimer = setTimeout(() => {
                placemark.balloon.close();
                closeTimer = null;
              }, HOVER_CLOSE_DELAY);
            }
          });

          mapInstance.events.add('click', function () {
            if (placemark.balloon.isOpen()) {
              placemark.balloon.close();
            }
          });
        }
      });

      mapInstance.container.fitToViewport();
      return mapInstance;
    }

    ymaps.ready(function () {
      const el = document.getElementById("supply-maps");
      if (!el) return;

      const supplyMap = createMap(el.id);

      const zoomInBtn = document.getElementById('zoom-in');
      const zoomOutBtn = document.getElementById('zoom-out');

      if (zoomInBtn) zoomInBtn.addEventListener('click', () => {
        supplyMap.setZoom(supplyMap.getZoom() + 1);
      });

      if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => {
        supplyMap.setZoom(supplyMap.getZoom() - 1);
      });

      const locateBtn = document.getElementById('locate-btn');
      let userPlacemark = null;

      const MIN_LOC_ZOOM = 10;
      const MIN_ZOOM = 2;
      const MAX_ZOOM = 18;

      function clampZoom(z) {
        return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.round(z)));
      }

      function goToCoords(coords, preferZoom) {
        const targetZoom = clampZoom(Math.max(supplyMap.getZoom(), preferZoom || MIN_LOC_ZOOM));
        supplyMap.setCenter(coords, targetZoom, { duration: 300 });

        if (!userPlacemark) {
          userPlacemark = new ymaps.Placemark(coords, {
            hintContent: 'Вы здесь',
            balloonContent: 'Ваше местоположение'
          }, {
            preset: 'islands#circleIcon',
            iconColor: '#1E90FF',
            hasHint: true
          });
          supplyMap.geoObjects.add(userPlacemark);
        } else {
          userPlacemark.geometry.setCoordinates(coords);
        }
      }

      function setLocateBtnLoading(on) {
        if (!locateBtn) return;
        if (on) {
          locateBtn.classList.add('loading');
          locateBtn.setAttribute('aria-busy', 'true');
          locateBtn.disabled = true;
        } else {
          locateBtn.classList.remove('loading');
          locateBtn.removeAttribute('aria-busy');
          locateBtn.disabled = false;
        }
      }

      if (locateBtn) {
        locateBtn.addEventListener('click', function () {
          if (!navigator.geolocation) {
            return;
          }
          setLocateBtnLoading(true);
          navigator.geolocation.getCurrentPosition(function (pos) {
            setLocateBtnLoading(false);
            const coords = [pos.coords.latitude, pos.coords.longitude];
            goToCoords(coords, MIN_LOC_ZOOM);
          }, function (err) {
            setLocateBtnLoading(false);
            console.warn('Geolocation error:', err);
          }, {
            enableHighAccuracy: true,
            timeout: 10000
          });
        });
      }

      let resizeTimer = null;
      function handleResize() {
        if (!supplyMap || !supplyMap.container) return;

        supplyMap.container.fitToViewport();

        const w = window.innerWidth;
        const newCenter = getCenterForWidth(w) || DEFAULT_CENTER;
        const newZoom = getZoom();

        supplyMap.setCenter(newCenter, newZoom);
      }

      window.addEventListener("resize", function () {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 120);
      });

      setTimeout(function () {
        if (supplyMap) {
          supplyMap.container.fitToViewport();
          supplyMap.setCenter(getCenterForWidth(window.innerWidth) || DEFAULT_CENTER, getZoom());
        }
      }, 50);
    });
  })();
}




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
      grabCursor: false,
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
      grabCursor: false,
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
          grabCursor: false,
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

      // Логика показа даты доставки при наведении с одной областью

      // let activeTouchTarget = null;
      // let lastPointerType = null;

      // targets.forEach(el => {
      //   if (!el.classList.contains('region')) el.classList.add('region');
      //   el.style.pointerEvents = 'auto';

      //   el.addEventListener('mouseenter', (ev) => {
      //     lastPointerType = ev.pointerType || 'mouse';
      //     normalizeDeliveryFromAttrs(el);
      //     el.classList.add('hovered');
      //     const text = getDeliveryText(el);
      //     const clientX = ev.clientX || (ev.touches && ev.touches[0] && ev.touches[0].clientX) || 0;
      //     const clientY = ev.clientY || (ev.touches && ev.touches[0] && ev.touches[0].clientY) || 0;
      //     showTooltip(text, clientX, clientY);
      //   });

      //   el.addEventListener('mousemove', (ev) => {
      //     const clientX = ev.clientX || 0;
      //     const clientY = ev.clientY || 0;
      //     if (tooltip.classList.contains('show')) showTooltip(getDeliveryText(el), clientX, clientY);
      //   });

      //   el.addEventListener('mouseleave', (ev) => {
      //     el.classList.remove('hovered');
      //     if (lastPointerType !== 'touch') hideTooltip();
      //   });

      //   el.addEventListener('click', (ev) => {
      //     ev.preventDefault();
      //     ev.stopPropagation();
      //     const isSame = activeTouchTarget === el;
      //     if (isSame) {
      //       el.classList.remove('hovered');
      //       hideTooltip();
      //       activeTouchTarget = null;
      //     } else {
      //       if (activeTouchTarget) activeTouchTarget.classList.remove('hovered');
      //       activeTouchTarget = el;
      //       el.classList.add('hovered');
      //       const clientX = (ev.clientX || 0);
      //       const clientY = (ev.clientY || 0);
      //       showTooltip(getDeliveryText(el), clientX, clientY);
      //     }
      //   }, { passive: false });
      // });

      // Логика показа даты доставки при наведении всех областей

      let activeTouchKey = null;
      let lastPointerType = null;

      function getNormalizedDeliveryKey(el) {
        const txt = getDeliveryText(el) || '';
        return String(txt).trim().toLowerCase();
      }

      function getMatchingRegionsByKey(key) {
        if (!key) return [];
        return Array.from(svgEl.querySelectorAll('.region')).filter(r => {
          try {
            return getNormalizedDeliveryKey(r) === key;
          } catch (e) { return false; }
        });
      }

      targets.forEach(el => {
        if (!el.classList.contains('region')) el.classList.add('region');
        el.style.pointerEvents = 'auto';

        el.addEventListener('mouseenter', (ev) => {
          lastPointerType = ev.pointerType || 'mouse';
          normalizeDeliveryFromAttrs(el);

          const key = getNormalizedDeliveryKey(el);
          const matches = getMatchingRegionsByKey(key);
          matches.forEach(m => m.classList.add('hovered'));

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
          const key = getNormalizedDeliveryKey(el);
          if (lastPointerType !== 'touch') {
            const matches = getMatchingRegionsByKey(key);
            matches.forEach(m => m.classList.remove('hovered'));
            hideTooltip();
          }
        });

        el.addEventListener('click', (ev) => {
          ev.preventDefault();
          ev.stopPropagation();

          const key = getNormalizedDeliveryKey(el);
          const isSame = activeTouchKey === key;

          if (isSame) {
            getMatchingRegionsByKey(key).forEach(m => m.classList.remove('hovered'));
            hideTooltip();
            activeTouchKey = null;
          } else {
            if (activeTouchKey) {
              getMatchingRegionsByKey(activeTouchKey).forEach(m => m.classList.remove('hovered'));
            }
            activeTouchKey = key;
            getMatchingRegionsByKey(key).forEach(m => m.classList.add('hovered'));

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
      grabCursor: false,
      loop: false,
      navigation: {
        nextEl: '.navigation-right-btn',
        prevEl: '.navigation-left-btn',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        0: {
          slidesPerView: 2.05, 
          spaceBetween: 10,
        },
        701: {
          slidesPerView: 'auto', 
          spaceBetween: 10,
        }
      }
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


// Модальное окно для просмотра 3D модели
const modelModal = document.querySelector('.model-modal');

if (modelModal) {
  (function() {
    const modal = document.getElementById('modelModal');
    const modalViewer = document.getElementById('modalModelViewer');
    const modalTitle = document.querySelector('.model-modal-title');
    const closeBtn = document.querySelector('.model-modal-close');
    const backdrop = document.querySelector('.model-modal-backdrop');

    const openModal = ({ src, name }) => {
      if (!src) return;
      modalViewer.removeAttribute('src');
      modalViewer.setAttribute('src', src);
      modalViewer.setAttribute('alt', name || '3D модель');
      modalTitle.textContent = name || '';

      document.body.classList.add('modal-open');
      modal.classList.add('open');

      if (window.newsSwiper && typeof window.newsSwiper.allowTouchMove === 'boolean') {
        window.newsSwiper.allowTouchMove = false;
      }
    };

    const closeModal = () => {
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');

      modalViewer.removeAttribute('src');

      if (window.newsSwiper && typeof window.newsSwiper.allowTouchMove === 'boolean') {
        window.newsSwiper.allowTouchMove = true;
      }
    };

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    let dragging = false;

    let touchMoved = false;
    document.addEventListener('touchmove', () => { touchMoved = true; }, {passive: true});
    document.addEventListener('touchend', () => { setTimeout(()=> touchMoved = false, 50); });

    document.querySelectorAll('.our-work-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (dragging || touchMoved) return;

        const inCardModel = card.querySelector('model-viewer');
        let src = null;
        let name = null;

        if (inCardModel && inCardModel.getAttribute('src')) {
          src = inCardModel.getAttribute('src');
          name = card.querySelector('.news-card-info-title')?.textContent?.trim() || inCardModel.getAttribute('alt') || '';
        } else {
          src = card.dataset.modelSrc || null;
          name = card.dataset.modelName || card.querySelector('.news-card-info-title')?.textContent?.trim() || '';
        }

        if (src) {
          openModal({ src, name });
        }
      });

      card.addEventListener('pointerdown', () => dragging = false);
      card.addEventListener('pointermove', () => dragging = true);
      card.addEventListener('pointerup', () => setTimeout(()=> dragging = false, 50));
    });
  })();
}


// Меню бургера

const burgerSubmenu = document.querySelector('.burger-submenu-container');

if (burgerSubmenu) {
  document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('.header-menu-open-burger') || document.body;
    const container = document.querySelector('.burger-submenu-container');
    if (!container) {
      return;
    }

    function adjustBurgerHeight() {
      if (!root) return;

      const visibleH = window.innerHeight || document.documentElement.clientHeight;

      const offerBtn = root.querySelector('.get-an-offer-burger-btn');
      const btnHeight = offerBtn ? Math.ceil(offerBtn.getBoundingClientRect().height) : 56;
      const extraSpace = 16; 
      const bottomPaddingPx = btnHeight + extraSpace;

      root.style.maxHeight = `${visibleH}px`;
      root.style.height = `${visibleH}px`;

      root.style.setProperty('padding-bottom', `calc(env(safe-area-inset-bottom, 0px) + ${bottomPaddingPx}px)`);
      root.style.setProperty('scroll-padding-bottom', `calc(env(safe-area-inset-bottom, 0px) + ${bottomPaddingPx}px)`);
    }

    function resetBurgerHeight() {
      if (!root) return;
      root.style.maxHeight = '';
      root.style.height = '';
      root.style.removeProperty('padding-bottom');
      root.style.removeProperty('scroll-padding-bottom');
    }

    const mo = new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          const isOpen = root.classList.contains('is-open');
          if (isOpen) {
            adjustBurgerHeight();

            window.removeEventListener('resize', adjustBurgerHeight);
            window.addEventListener('resize', adjustBurgerHeight);
            window.removeEventListener('orientationchange', adjustBurgerHeight);
            window.addEventListener('orientationchange', () => setTimeout(adjustBurgerHeight, 120));
          } else {
            resetBurgerHeight();
            window.removeEventListener('resize', adjustBurgerHeight);
            window.removeEventListener('orientationchange', adjustBurgerHeight);
          }
        }
      }
    });
    mo.observe(root, { attributes: true, attributeFilter: ['class'] });

    if (root.classList.contains('is-open')) adjustBurgerHeight();

    let overlay = container.querySelector('.burger-submenu-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'burger-submenu-overlay';
      container.appendChild(overlay);
    }

    function findSubmenu(id) {
      if (!id) return null;
      return container.querySelector(`.burger-submenu[data-submenu-id="${id}"]`) ||
            document.querySelector(`.burger-submenu[data-submenu-id="${id}"]`);
    }

  const submenuResizeHandlers = new Map();

    function adjustSubmenuHeight(submenu) {
      if (!submenu) return;
      const visibleH = window.innerHeight || document.documentElement.clientHeight;
      const offerBtn = submenu.querySelector('.get-an-offer-burger-btn');
      const btnHeight = offerBtn ? Math.ceil(offerBtn.getBoundingClientRect().height) : 56;
      const extraSpace = 16;
      const bottomPaddingPx = btnHeight + extraSpace;

      submenu.style.maxHeight = `${visibleH}px`;
      submenu.style.height = 'auto';
      submenu.style.setProperty('padding-bottom',
        `calc(env(safe-area-inset-bottom, 0px) + ${bottomPaddingPx}px)`);
      submenu.style.setProperty('scroll-padding-bottom',
        `calc(env(safe-area-inset-bottom, 0px) + ${bottomPaddingPx}px)`);
    }

    function resetSubmenuHeight(submenu) {
      if (!submenu) return;
      submenu.style.maxHeight = '';
      submenu.style.height = '';
      submenu.style.removeProperty('padding-bottom');
      submenu.style.removeProperty('scroll-padding-bottom');
      submenu.style.removeProperty('top');
      submenu.style.removeProperty('left');
      submenu.style.removeProperty('right');
    }

    function openSubmenu(id, sourceButton) {
      const submenu = findSubmenu(id);
      if (!submenu) return;

      adjustSubmenuHeight(submenu);

      root.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden'; 

      const headerSpan = submenu.querySelector('.burger-submenu-header span');
      if (headerSpan && sourceButton) headerSpan.textContent = sourceButton.textContent.trim();

      requestAnimationFrame(() => {
        submenu.classList.add('open');
        submenu.setAttribute('aria-hidden', 'false');
        overlay.classList.add('visible');
        if (sourceButton) sourceButton.setAttribute('aria-expanded', 'true');
        root.classList.add('submenu-open');

        const mainLinks = root.querySelector('.burger-menu-open-links-container');
        if (mainLinks) mainLinks.setAttribute('aria-hidden', 'true');

        const focusable = submenu.querySelector('.burger-submenu-link, a, button, .get-an-offer-burger-btn');
        if (focusable) focusable.focus();
      });

      const resizeHandler = () => setTimeout(() => adjustSubmenuHeight(submenu), 80);
      if (submenuResizeHandlers.has(submenu)) {
        const prev = submenuResizeHandlers.get(submenu);
        window.removeEventListener('resize', prev);
        window.removeEventListener('orientationchange', prev);
      }
      submenuResizeHandlers.set(submenu, resizeHandler);
      window.addEventListener('resize', resizeHandler);
      window.addEventListener('orientationchange', resizeHandler);
    }

    function closeSubmenu() {
      const open = container.querySelector('.burger-submenu.open') || document.querySelector('.burger-submenu.open');
      if (!open) return;

      open.classList.remove('open');
      open.setAttribute('aria-hidden', 'true');

      resetSubmenuHeight(open);
      const h = submenuResizeHandlers.get(open);
      if (h) {
        window.removeEventListener('resize', h);
        window.removeEventListener('orientationchange', h);
        submenuResizeHandlers.delete(open);
      }

      root.style.overflow = '';
      document.body.style.overflow = '';

      overlay.classList.remove('visible');
      if (root.classList.contains('submenu-open')) root.classList.remove('submenu-open');
      document.querySelectorAll('.burger-menu-open-link[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
    }

    const buttons = root.querySelectorAll('.burger-menu-open-link[data-submenu-id]');
    if (!buttons.length) {
      console.info('burger: кнопок с data-submenu-id не найдено. Нужно проверить, что атрибуты стоят на кнопках.');
    }

    buttons.forEach(btn => {
      btn.setAttribute('type', 'button');
      btn.setAttribute('aria-haspopup', 'true');
      btn.setAttribute('aria-expanded', 'false');

      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation(); 
        const id = this.dataset.submenuId;
        if (!id) {
          return;
        }
        openSubmenu(id, this);
      });
    });

    container.querySelectorAll('.go-back-btn').forEach(b => {
      b.setAttribute('type','button');
      b.addEventListener('click', (e) => { e.preventDefault(); closeSubmenu(); });
    });

    overlay.addEventListener('click', closeSubmenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSubmenu();
    });

    window._burgerDebug = {
      open: (id) => { openSubmenu(id, document.querySelector(`.burger-menu-open-link[data-submenu-id="${id}"]`)); },
      close: closeSubmenu,
      findSubmenu: findSubmenu
    };
  });
}


const mdkWeProduceBanners = document.querySelector('.mdk-we-produce-banner');

if (mdkWeProduceBanners) {
  document.addEventListener('DOMContentLoaded', function () {
    const PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    const container = document.querySelector('.mdk-we-produce-rigth-side');
    if (!container) return;

    let imgs = Array.from(container.querySelectorAll('img.mdk-we-produce-preview'));
    if (imgs.length < 2) {
      const imgA = document.createElement('img');
      imgA.className = 'mdk-we-produce-preview';
      imgA.setAttribute('aria-hidden', 'true');
      imgA.alt = '';
      imgA.src = PLACEHOLDER;

      const imgB = document.createElement('img');
      imgB.className = 'mdk-we-produce-preview mdk-back';
      imgB.setAttribute('aria-hidden', 'true');
      imgB.alt = '';
      imgB.src = PLACEHOLDER;

      container.appendChild(imgB);
      container.appendChild(imgA);

      imgs = [imgA, imgB];
    }

    imgs.forEach(img => {
      img.onerror = () => {
        img.src = PLACEHOLDER;
        img.classList.remove('mdk-visible');
      };
    });

    let latestToken = 0;
    let currentFront = 0;
    let hoverTimer = null;
    const HOVER_DELAY = 80; 

    function swapToBack(url, token) {
      const backIdx = 1 - currentFront;
      const frontImg = imgs[currentFront];
      const backImg = imgs[backIdx];

      const pre = new Image();
      pre.onload = function () {
        if (token !== latestToken) return;
        backImg.src = url;
        requestAnimationFrame(() => {
          backImg.classList.add('mdk-visible');
          frontImg.classList.remove('mdk-visible');

          const cleanup = function () {
            if (!frontImg.classList.contains('mdk-visible')) {
              frontImg.src = PLACEHOLDER;
            }
            frontImg.removeEventListener('transitionend', cleanup);
          };
          frontImg.addEventListener('transitionend', cleanup);
          currentFront = backIdx;
        });
        pre.onload = pre.onerror = null;
      };
      pre.onerror = function () {
        if (token !== latestToken) return;
        backImg.src = PLACEHOLDER;
        backImg.classList.remove('mdk-visible');
        pre.onload = pre.onerror = null;
      };
      pre.src = url;
    }

    function showImage(url) {
      if (!url) return;
      latestToken++;
      const token = latestToken;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => swapToBack(url, token), HOVER_DELAY);
    }

    function hideImage() {
      latestToken++;
      clearTimeout(hoverTimer);
      imgs.forEach(img => img.classList.remove('mdk-visible'));
      imgs.forEach(img => {
        img.addEventListener('transitionend', function clearOnce() {
          if (!img.classList.contains('mdk-visible')) img.src = PLACEHOLDER;
          img.removeEventListener('transitionend', clearOnce);
        }, { once: true });
      });
    }

    const banners = document.querySelectorAll('.mdk-we-produce-banner');
    banners.forEach(b => {
      const url = b.dataset.imgUrl;
      if (!url) return;
      b.addEventListener('mouseenter', () => showImage(url));
      b.addEventListener('mouseleave', () => hideImage());
      b.addEventListener('focus', () => showImage(url));
      b.addEventListener('blur', () => hideImage());
    });

    const wrapper = document.querySelector('.mdk-we-produce-container');
    if (wrapper) wrapper.addEventListener('mouseleave', hideImage);
  });
}




// Попап "Скопировано" на странице "Контакты"

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.copy-button');
  if (!buttons.length) return;

  // создаём popup
  const popup = document.createElement('div');
  popup.className = 'copy-popup';
  popup.setAttribute('role', 'status');
  popup.setAttribute('aria-live', 'polite');
  popup.style.position = 'fixed'; // фиксированное позиционирование по умолчанию
  popup.style.zIndex = 99999;
  popup.style.pointerEvents = 'none';
  document.body.appendChild(popup);

  let popupTimer = null;
  let lastPointer = null; // хранит последние координаты pointerdown

  // ловим pointerdown — работает и для мыши, и для тача
  window.addEventListener('pointerdown', (ev) => {
    if (ev && typeof ev.clientX === 'number' && typeof ev.clientY === 'number') {
      lastPointer = { x: ev.clientX, y: ev.clientY };
    }
  }, { passive: true });

  buttons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();

      const container = btn.parentElement; // .requisites-card-text-inner
      if (!container) return;

      // получаем текст (без кнопки)
      const clone = container.cloneNode(true);
      const btnInClone = clone.querySelector('.copy-button');
      if (btnInClone) btnInClone.remove();
      let text = (clone.innerText || clone.textContent || '').replace(/\u00A0/g, ' ').trim();
      if (!text) return;

      // копируем
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
      } catch (err) {
        console.error('Copy failed', err);
      }

      // определяем координаты для popupa
      // приоритет: координаты pointerdown (lastPointer) -> event.clientX/Y -> центровка по кнопке
      let coordX = (e && typeof e.clientX === 'number' && e.clientX !== 0) ? e.clientX : null;
      let coordY = (e && typeof e.clientY === 'number' && e.clientY !== 0) ? e.clientY : null;

      if ((coordX === null || coordY === null) && lastPointer) {
        coordX = lastPointer.x;
        coordY = lastPointer.y;
      }

      const rect = btn.getBoundingClientRect();
      if (coordX === null || coordY === null) {
        coordX = rect.left + rect.width / 2;
        coordY = rect.top + rect.height / 2;
      }

      // подготовка popup
      popup.innerHTML = `
        <span class="popup-icon" aria-hidden="true">
          <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.18 16.4347C6.91546 16.4352 6.65342 16.3835 6.40893 16.2825C6.16444 16.1815 5.94232 16.0331 5.75533 15.846L2 12.0907L2.94933 11.1407L6.70467 14.896C6.83068 15.0219 7.00153 15.0926 7.17967 15.0926C7.35781 15.0926 7.52866 15.0219 7.65467 14.896L17.0507 5.5L18 6.45L8.604 15.846C8.41714 16.0331 8.19513 16.1814 7.95076 16.2825C7.70638 16.3835 7.44444 16.4352 7.18 16.4347Z" fill="white"/>
          </svg>
        </span>

        <span class="popup-text">Скопировано</span>
      `;
      popup.classList.remove('show');

      // даём браузеру обновить DOM, затем измеряем и позиционируем
      requestAnimationFrame(() => {
        // чуть позже — чтобы размеры учли шрифты/рендер
        requestAnimationFrame(() => {
          const popupRect = popup.getBoundingClientRect();
          const vw = document.documentElement.clientWidth;
          const vh = document.documentElement.clientHeight;
          const pad = 8;

          // позиция по центру по X
          let left = coordX - popupRect.width / 2;
          // по Y: по умолчанию над курсором/кнопкой
          let top = coordY - popupRect.height - 12;

          // если не помещается сверху — показываем снизу
          if (top < pad) {
            top = coordY + 12;
          }

          // поправляем, чтобы не выходило за края
          left = Math.min(Math.max(pad, left), vw - popupRect.width - pad);
          top = Math.min(Math.max(pad, top), vh - popupRect.height - pad);

          popup.style.left = `${Math.round(left)}px`;
          popup.style.top  = `${Math.round(top)}px`;

          // показываем
          requestAnimationFrame(() => popup.classList.add('show'));
        });
      });

      if (popupTimer) clearTimeout(popupTimer);
      popupTimer = setTimeout(() => popup.classList.remove('show'), 1000);
    }, { passive: false });
  });

});


// Выравнивание карточек "Товары из статьи" по одной высоте с разными заголовками

const newsInfoCards = document.querySelector('.news-info-cards');

if (newsInfoCards) {
  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  function equalizeCardTitles() {
    const titles = Array.from(document.querySelectorAll('.news-card-info-title'));
    if (!titles.length) return;
    titles.forEach(t => t.style.minHeight = '');
    const max = titles.reduce((m, t) => Math.max(m, t.getBoundingClientRect().height), 0);
    titles.forEach(t => t.style.minHeight = Math.ceil(max) + 'px');
  }

  window.addEventListener('load', equalizeCardTitles);
  window.addEventListener('DOMContentLoaded', equalizeCardTitles);
  window.addEventListener('resize', debounce(equalizeCardTitles, 120));
}