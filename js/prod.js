// Cookie

document.addEventListener("DOMContentLoaded", function() {
    const cookieBanner = document.getElementById("cookieBanner");
    const acceptBtn = document.getElementById("cookieAccept");

    if (!localStorage.getItem("cookieAccepted")) {
        setTimeout(() => {
            cookieBanner.classList.add("visible");
        }, 300);
    }

    acceptBtn.addEventListener("click", () => {
        localStorage.setItem("cookieAccepted", "true");

        cookieBanner.classList.remove("visible");
        cookieBanner.classList.add("hidden");

        setTimeout(() => {
            cookieBanner.remove();
        }, 300);
    });
});

// Появление шапки

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

document.addEventListener('DOMContentLoaded', function () {
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

  const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

  // DESKTOP: поведение по наведению
  buttons.forEach(btn => {
    const key = btn.dataset.open;
    const menu = document.querySelector(`.header-menu-open[data-open="${key}"]`);
    if (!menu) return;

    const openMenu = () => {
      closeAllMenus();
      menu.classList.add('is-open');
      btn.classList.add('is-active');
      btn.setAttribute('aria-expanded', 'true');
      if (header) header.classList.add('header--menu-open');
    };

    const closeThisMenu = () => {
      menu.classList.remove('is-open');
      btn.classList.remove('is-active');
      btn.setAttribute('aria-expanded', 'false');
      if (!document.querySelector('.header-menu-open.is-open')) {
        if (header) header.classList.remove('header--menu-open');
      }
    };

    if (hoverQuery.matches) {
      let closeTimer = null;
      const scheduleClose = (delay = 160) => {
        clearTimeout(closeTimer);
        closeTimer = setTimeout(() => {
          closeThisMenu();
        }, delay);
      };
      const cancelClose = () => {
        if (closeTimer) {
          clearTimeout(closeTimer);
          closeTimer = null;
        }
      };

      btn.addEventListener('mouseenter', () => {
        cancelClose();
        openMenu();
      });

      btn.addEventListener('mouseleave', () => {
        scheduleClose(180);
      });

      menu.addEventListener('mouseenter', () => {
        cancelClose();
      });
      menu.addEventListener('mouseleave', () => {
        scheduleClose(160);
      });

      btn.addEventListener('focus', () => {
        cancelClose();
        openMenu();
      });

      btn.addEventListener('blur', () => {
        scheduleClose(200);
      });

      menu.addEventListener('click', function (e) { e.stopPropagation(); });

    } else {
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

      menu.addEventListener('click', function (e) { e.stopPropagation(); });
    }
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

    const isKpPopupOpen = () => {
      return !!document.querySelector('.kp-popup.show');
    };

    function setOpaque(forceOpaque = null, currentY = window.scrollY || window.pageYOffset || 0) {
      if (isKpPopupOpen()) {
        header.classList.add('header--opaque');
        header.classList.remove('header--top');
        return;
      }

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
      // header.classList.add('header--hidden');
      // header.classList.remove('header--visible');
    }

    function updateOnScroll() {
      const currentY = window.scrollY || window.pageYOffset || 0;

      if (document.querySelector('.header-menu-open.is-open') || header.classList.contains('header--menu-open') || isKpPopupOpen()) {
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
      if (document.querySelector('.header-menu-open.is-open') || (burgerMenu && burgerMenu.classList.contains('is-open')) || isKpPopupOpen()) return;
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

      if (document.querySelector('.header-menu-open.is-open') || (burgerMenu && burgerMenu.classList.contains('is-open')) || isKpPopupOpen()) return;
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
  const titleEl = document.querySelector('.main-content-second-line-title');
  const textEl  = document.querySelector('.main-content-second-line-text');

  function getTotalSlides() {
    return bgSwiper.params.loop
      ? (bgSwiper.slides.length - (bgSwiper.loopedSlides ? bgSwiper.loopedSlides * 2 : 0))
      : bgSwiper.slides.length;
  }

  function updateBanner() {
    const real = bgSwiper.realIndex + 1;
    const total = getTotalSlides();
    if (banner) banner.textContent = `${real}-${total}`;
  }

  function updateContent() {
    const activeDomSlide = bgSwiper.slides[bgSwiper.activeIndex];
    const dataTitle = activeDomSlide?.dataset?.title ?? '';
    const dataText  = activeDomSlide?.dataset?.text  ?? '';

    titleEl.classList.add('fade-out');
    textEl.classList.add('fade-out');

    setTimeout(() => {
      titleEl.textContent = dataTitle;
      textEl.textContent  = dataText;
      titleEl.classList.remove('fade-out');
      textEl.classList.remove('fade-out');
    }, 180); 
  }

  bgSwiper.on('slideChange', () => {
    updateBanner();
    updateContent();
  });

  updateBanner();
  updateContent();
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
        },
        1100: {
          slidesPerView: 'auto',
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

let _lockedScrollPos = 0;
let _scrollLockCount = 0;

function lockScroll() {
  if (_scrollLockCount++ > 0) return;

  _lockedScrollPos = window.pageYOffset || document.documentElement.scrollTop || 0;

  document.documentElement.style.scrollBehavior = 'auto';

  document.documentElement.classList.add('no-scroll-modal');
  document.body.classList.add('no-scroll-modal');
  document.body.style.position = 'fixed';
  document.body.style.top = `-${_lockedScrollPos}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
}

function unlockScroll() {
  if (--_scrollLockCount > 0) return;

  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  document.body.style.overflow = '';

  document.documentElement.classList.remove('no-scroll-modal');
  document.body.classList.remove('no-scroll-modal');

  window.scrollTo(0, _lockedScrollPos);

  setTimeout(() => {
    document.documentElement.style.scrollBehavior = '';
  }, 0);
}

function safeFocus(el) {
  if (!el || typeof el.focus !== 'function') return;
  try {
    el.focus({ preventScroll: true });
  } catch (err) {
    const cur = window.pageYOffset || document.documentElement.scrollTop || 0;
    el.focus();
    setTimeout(() => window.scrollTo(0, cur), 0);
  }
}

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
    lockScroll();               
    updateFocusable();

    // if (header.classList.contains('header--hidden')) {

    //   setTimeout(() => {
    //     header.classList.add('header--hidden');
    //     header.classList.remove('header--visible');
    //     header.style.backgroundColor = 'white';
    //   }, 1);
    // }

    // if (header.classList.contains('header--visible')) {

    //   setTimeout(() => {
    //     header.classList.add('header--hidden');
    //     header.classList.remove('header--visible');
    //     header.style.backgroundColor = 'white';
    //   }, 1);
    // }

    (firstFocusable || closeBtn).focus();
    document.addEventListener('keydown', onKeydown);
  }


  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    unlockScroll();        
    
    // if (header.classList.contains('header--visible')) {

    //   setTimeout(() => {
    //     header.classList.remove('header--hidden');
    //     header.classList.add('header--visible');
    //   }, 1);
    // }

    // if (header.classList.contains('header--hidden')) {

    //   setTimeout(() => {
    //     header.classList.add('header--hidden');
    //     header.classList.remove('header--visible');
    //     header.style.backgroundColor = 'white';
    //   }, 1);
    // }
    
    document.removeEventListener('keydown', onKeydown);
    safeFocus(lastFocusedElement);
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
  const THUMBS_SELECTOR = '.reviews-card-right-side img, .documents-card-right-side img, .documents-card img';
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
      navigation: { nextEl: nextBtn, prevEl: prevBtn },
      keyboard: { enabled: false },
      on: {
        slideChange: function () {
          const imgs = swiperWrapper.querySelectorAll('img');
          const currentImg = imgs[swiper.activeIndex];
          if (currentImg) setTimeout(() => applyScaleToImg(currentImg), 80);
          updateCaption(swiper.activeIndex);
        },
        init: function () {
          if (closeBtn) closeBtn.focus();
        }
      }
    });

    // drag handlers (как в вашем коде)
    swiperWrapper.addEventListener('pointerdown', (e) => {
      const img = e.target.closest('img');
      if (!img) return;
      img.classList.remove('dragging');
      img.setPointerCapture(e.pointerId);
      img.addEventListener('pointermove', onPointerMove);
      img.addEventListener('pointerup', onPointerUp);
      function onPointerMove() { img.classList.add('dragging'); }
      function onPointerUp(ev) {
        img.classList.remove('dragging');
        try { img.releasePointerCapture(ev.pointerId); } catch (err) {}
        img.removeEventListener('pointermove', onPointerMove);
        img.removeEventListener('pointerup', onPointerUp);
      }
    });
  }

  const captionEl = document.getElementById('image-modal-caption');
  function updateCaption(index) {
    if (!captionEl) return;
    const imgs = swiperWrapper.querySelectorAll('img');
    const img = imgs[index];
    captionEl.textContent = img?.alt || '';
  }

  // открыть модалку
  function openImageModal(index = 0) {
    lastFocused = document.activeElement;
    initSwiper(index);
    if (swiper) {
      setTimeout(() => {
        const idx = Math.max(0, Math.min(index, thumbs.length - 1));
        swiper.slideTo(idx, 0);
        const targetImg = swiperWrapper.querySelectorAll('img')[idx];
        if (targetImg && targetImg.complete) applyScaleToImg(targetImg);
        updateCaption(idx);
      }, 0);
    }
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');

    if (header) {
      header.classList.add('modal-open');
      header.classList.remove('header--hidden');
      header.classList.add('header--visible');
    }

    // document.body.style.overflow = 'hidden';
    // document.documentElement.classList.add('no-scroll-modal');
    // document.body.classList.add('no-scroll-modal');

    lockScroll();

    // if (header.classList.contains('header--hidden')) {

    //   setTimeout(() => {
    //     header.classList.add('header--hidden');
    //     header.classList.remove('header--visible');
    //     header.style.backgroundColor = 'white';
    //   }, 1);
    // }

    // if (header.classList.contains('header--visible')) {

    //   setTimeout(() => {
    //     header.classList.add('header--hidden');
    //     header.classList.remove('header--visible');
    //     header.style.backgroundColor = 'white';
    //   }, 1);
    // }

    if (closeBtn) closeBtn.focus();
    document.addEventListener('keydown', onKey);
  }

  function closeImageModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');

    // document.body.style.overflow = '';
    // document.documentElement.classList.remove('no-scroll-modal');
    // document.body.classList.remove('no-scroll-modal');

    if (header) {
      header.classList.remove('modal-open');
      window.requestAnimationFrame(() => window.dispatchEvent(new Event('scroll')));
    }

    unlockScroll();

    // if (header.classList.contains('header--visible')) {

    //   setTimeout(() => {
    //     header.classList.remove('header--hidden');
    //     header.classList.add('header--visible');
    //   }, 1);
    // }

    // if (header.classList.contains('header--hidden')) {

    //   setTimeout(() => {
    //     header.classList.add('header--hidden');
    //     header.classList.remove('header--visible');
    //     header.style.backgroundColor = 'white';
    //   }, 1);
    // }

    document.removeEventListener('keydown', onKey);
    safeFocus(lastFocused);
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

  const docCards = Array.from(document.querySelectorAll('.documents-card'));
    docCards.forEach((card) => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        if (e.target.closest('button, a')) return; 
        const img = card.querySelector('img');
        if (!img) return;
        const idx = thumbs.findIndex(t => t === img);
        if (idx !== -1) {
          openImageModal(idx);
        }
      });
  });

  const docBtns = Array.from(document.querySelectorAll('.documents-card-btn'));
    docBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); 
        const card = btn.closest('.documents-card');
        const img = card?.querySelector('img');
        if (!img) return;
        const idx = thumbs.findIndex(t => t === img);
        if (idx !== -1) {
          openImageModal(idx);
        }
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

if (maps) {
  function getZoom() {
    return window.innerWidth <= 500 ? 17 : 16.5;
  }

  function createMap(mapDiv) {
    const coords = mapDiv.dataset.coords.split(",").map(Number);
    const url = mapDiv.dataset.url;

    const mapInstance = new ymaps.Map(mapDiv.id, {
      center: coords,
      zoom: getZoom(),
      controls: [],
      type: "yandex#map",
    });

    mapInstance.options.set("preset", "islands#dark");

    const placemark = new ymaps.Placemark(
      coords,
      {},
      {
        iconLayout: "default#image",
        iconImageHref: "/local/assets/images/marker.svg",
        iconImageSize: [40, 40],
        iconImageOffset: [-19, -44],
      }
    );

    if (url) {
      placemark.events.add("click", function () {
        window.open(url, "_blank");
      });
    }

    mapInstance.geoObjects.add(placemark);
    mapInstance.container.fitToViewport();

    return mapInstance;
  }

  // Инициализация всех карт
  ymaps.ready(() => {
    const mapInstances = {};

    maps.forEach((mapDiv) => {
      mapInstances[mapDiv.id] = createMap(mapDiv);
    });

    window.addEventListener("resize", () => {
      Object.values(mapInstances).forEach((mapObj) => {
        if (mapObj && mapObj.container) {
          mapObj.setZoom(getZoom());
          mapObj.container.fitToViewport();
        }
      });
    });
  });
}








// Яндекс карта поставок


// Метки на карте поставок

// const points = [
//   { coords: [69.3498, 88.2026], count: 50, name: 'Норильск' },
//   { coords: [67.4971, 64.0419], count: 9,  name: 'Воркута' },
//   { coords: [55.7558, 37.6173], count: 12143, name: 'Москва' },
//   { coords: [55.7903, 49.1347], count: 111, name: 'Казань' },
//   { coords: [55.1644, 61.4368], count: 50583, name: 'Челябинск' },
//   { coords: [54.9885, 73.3242], count: 345, name: 'Омск' },
//   { coords: [56.0106, 92.8526], count: 345, name: 'Красноярск' },
//   { coords: [62.0355,129.6755], count: 17, name: 'Якутск' },
// ];

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
      if (typeof points !== 'undefined' && Array.isArray(points) && points.length) {
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
      }

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
  const swiperEl = document.querySelector('.news-tags.swiper');
  if (!swiperEl) return;

  new Swiper(swiperEl, {
    slidesPerView: 'auto',
    spaceBetween: 0,
    freeMode: true,
    loop: false,
    watchOverflow: true,
    grabCursor: false,
  });
});


// Загрузка карты

// const DELIVERY_MAP = {
//   'zone-1': 'Доставка от 5-7 дней', // синяя зона
//   'zone-2': 'Доставка от 7–9 дней', // желтая зона
//   'zone-3': 'Доставка от 9–11 дней', // красная зона
//   'zone-4': 'Доставка от 12–15 дней', // фиолетовая зона
//   'zone-5': 'Доставка от 2–4 дней', // отдельная зеленая зона
//   'zone-6': 'Доставка от 19–21 дня', // отдельная зеленая зона
//   'zone-7': 'Доставка от 28–30 дней', // отдельная зеленая зона
//   'zone-8': 'Доставка от 33–35 дней', // отдельная зеленая зона
//   'zone-9': 'Доставка от 42–44 дней', // отдельная зеленая зона
//   'zone-10': 'Доставка от 44–46 дней', // отдельная зеленая зона
// };

const deliveryMap = document.querySelector('.delivery-map');

if (deliveryMap) {
  (async function () {
    const container = document.getElementById('svgContainer');
    const tooltip = document.getElementById('mapTooltip');

    if (tooltip && tooltip.parentElement !== document.body) {
      document.body.appendChild(tooltip);

      tooltip.style.position = 'fixed';
      tooltip.style.zIndex = '9999';
      tooltip.style.pointerEvents = 'none'; 
      tooltip.style.transition = ''; 
    }

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

      svgEl.querySelectorAll('[data-zone]').forEach(el => {
        const zone = (el.getAttribute('data-zone') || '').trim();
        if (!zone) return;
        if (el.dataset && el.dataset.delivery) return;

        if (typeof DELIVERY_MAP !== 'undefined' && DELIVERY_MAP[zone]) {
          try {
            el.dataset.delivery = DELIVERY_MAP[zone];
          } catch(e) { }
        }
      });

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
    document.querySelectorAll('.our-work-card-image, .news-info-card-image').forEach(img => {
      img.addEventListener('click', (e) => {
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

    window.__open3DModal = openModal;

    (function robustOpen3DCapture() {
      if (window.__robustOpen3DCaptureInstalled) return;
      window.__robustOpen3DCaptureInstalled = true;

      let lock = false; 
      const LOCK_TTL = 400; // ms

      function tryOpen3DFromPoint(clientX, clientY, originalEvent) {
        try {
          if (lock) return false;
          const el = document.elementFromPoint(clientX, clientY);
          if (!el) return false;
          const btn = el.closest && el.closest('.open-3d-model');
          if (!btn) return false;

          const gallery = document.querySelector('.product-gallery-modal');
          if (gallery && gallery.classList.contains('open')) return false;

          const src = btn.getAttribute('model-src') || btn.dataset.modelSrc || btn.getAttribute('data-model-src') || null;
          if (!src) {
            console.warn('open-3d-model: не найден model-src у', btn);
            return false;
          }
          const name = btn.getAttribute('aria-label') || btn.dataset.modelName || document.querySelector('.product-main-image img')?.alt || '';

          lock = true;
          setTimeout(() => lock = false, LOCK_TTL);

          // открываем 3D-модалку
          if (typeof window.__open3DModal === 'function') {
            window.__open3DModal({ src, name });
          } else {
            console.warn('open-3d-model: __open3DModal не определён');
          }

          try {
            if (originalEvent) {
              originalEvent.preventDefault && originalEvent.preventDefault();
              originalEvent.stopPropagation && originalEvent.stopPropagation();
              originalEvent.stopImmediatePropagation && originalEvent.stopImmediatePropagation();
            }
          } catch(e){ }

          return true;
        } catch (err) {
          console.error('tryOpen3DFromPoint error', err);
          return false;
        }
      }

      function handlerCapture(ev) {
        try {
          if (ev.button !== undefined && ev.button !== 0) return;

          const cx = ev.clientX, cy = ev.clientY;
          if (typeof cx !== 'number' || typeof cy !== 'number') return;

          tryOpen3DFromPoint(cx, cy, ev);
        } catch (err) {
          console.error('handlerCapture error', err);
        }
      }

      document.addEventListener('pointerdown', handlerCapture, { capture: true, passive: false });
      document.addEventListener('mousedown', handlerCapture, { capture: true, passive: false });
      document.addEventListener('click', handlerCapture, { capture: true, passive: false });

    })();

    const closeModal = () => {
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');

      modalViewer.removeAttribute('src');

      if (window.newsSwiper && typeof window.newsSwiper.allowTouchMove === 'boolean') {
        window.newsSwiper.allowTouchMove = true;
      }
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    (function bindOpen3DButtons(){
      const buttons = Array.from(document.querySelectorAll('.open-3d-model'));
      if (!buttons.length) {
        return;
      }

      buttons.forEach(btn => {
        btn.addEventListener('click', (ev) => {
          ev.preventDefault();
          ev.stopPropagation();

          const src = btn.getAttribute('model-src') || btn.dataset.modelSrc || null;
          if (!src) {
            console.warn('open-3d-model: model src не найден в', btn);
            return;
          }

          const name = btn.getAttribute('aria-label') 
                    || btn.dataset.modelName 
                    || document.querySelector('.product-main-image img')?.alt 
                    || '';

          if (!window.customElements || !customElements.get || !customElements.get('model-viewer')) {
            if (!window._modelViewerPromise) {
              window._modelViewerPromise = new Promise((resolve, reject) => {
                try {
                  const s = document.createElement('script');
                  s.type = 'module';
                  s.src = 'js/libs/model-viewer.min.js';
                  s.addEventListener('load', resolve);
                  s.addEventListener('error', reject);
                  document.head.appendChild(s);
                } catch (err) { reject(err); }
              });
            }
            window._modelViewerPromise.catch(()=>{});
          }

          openModal({ src, name });
        });
      });
    })();

    let dragging = false;
    let touchMoved = false;
    document.addEventListener('touchmove', () => { touchMoved = true; }, {passive: true});
    document.addEventListener('touchend', () => { setTimeout(()=> touchMoved = false, 50); });

    document.querySelectorAll('.our-work-card-image, .news-info-card-image').forEach(imageEl => {
      const card = imageEl.closest('.our-work-card');

      imageEl.addEventListener('click', (e) => {
        if (e.target.closest('.get-kp-btn, a, button, input, .no-modal')) return;

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

      imageEl.addEventListener('pointerdown', () => dragging = false);
      imageEl.addEventListener('pointermove', () => dragging = true);
      imageEl.addEventListener('pointerup', () => setTimeout(()=> dragging = false, 50));
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

  const popup = document.createElement('div');
  popup.className = 'copy-popup';
  popup.setAttribute('role', 'status');
  popup.setAttribute('aria-live', 'polite');
  popup.style.position = 'fixed'; 
  popup.style.zIndex = 99999;
  popup.style.pointerEvents = 'none';
  document.body.appendChild(popup);

  let popupTimer = null;
  let lastPointer = null; 

  window.addEventListener('pointerdown', (ev) => {
    if (ev && typeof ev.clientX === 'number' && typeof ev.clientY === 'number') {
      lastPointer = { x: ev.clientX, y: ev.clientY };
    }
  }, { passive: true });

  buttons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();

      const attrCopy = btn.getAttribute('data-copy');
      let textToCopy = (typeof attrCopy === 'string' && attrCopy.trim().length) ? attrCopy.trim() : null;

      if (!textToCopy) {
        const selector = btn.getAttribute('data-copy-target');
        if (selector) {
          try {
            const target = document.querySelector(selector);
            if (target) {
              if (('value' in target) && (target.value !== undefined)) {
                textToCopy = String(target.value).replace(/\u00A0/g, ' ').trim();
              } else {
                textToCopy = (target.innerText || target.textContent || '').replace(/\u00A0/g, ' ').trim();
              }
            }
          } catch (err) {
            console.warn('Invalid selector in data-copy-target:', selector, err);
          }
        }
      }

      if (!textToCopy) {
        const container = btn.parentElement;
        if (!container) return;
        const clone = container.cloneNode(true);
        const btnInClone = clone.querySelector('.copy-button');
        if (btnInClone) btnInClone.remove();
        textToCopy = (clone.innerText || clone.textContent || '').replace(/\u00A0/g, ' ').trim();
        if (!textToCopy) return;
      }

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          const ta = document.createElement('textarea');
          ta.value = textToCopy;
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

      let coordX = (e && typeof e.clientX === 'number' && e.clientX !== 0) ? e.clientX : null;
      let coordY = (e && typeof e.clientY === 'number' && e.clientY !== 0) ? e.clientY : null;
      if ((coordX === null || coordY === null) && lastPointer) {
        coordX = coordX === null ? lastPointer.x : coordX;
        coordY = coordY === null ? lastPointer.y : coordY;
      }
      const rect = btn.getBoundingClientRect();
      if (coordX === null || coordY === null) {
        coordX = rect.left + rect.width / 2;
        coordY = rect.top + rect.height / 2;
      }

      // учитываем visualViewport (iOS)
      const vv = window.visualViewport || {};
      const viewportOffsetLeft = vv.offsetLeft || 0;
      const viewportOffsetTop  = vv.offsetTop  || 0;

      popup.innerHTML = `
        <span class="popup-icon" aria-hidden="true">
          <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.18 16.4347C6.91546 16.4352 6.65342 16.3835 6.40893 16.2825C6.16444 16.1815 5.94232 16.0331 5.75533 15.846L2 12.0907L2.94933 11.1407L6.70467 14.896C6.83068 15.0219 7.00153 15.0926 7.17967 15.0926C7.35781 15.0926 7.52866 15.0219 7.65467 14.896L17.0507 5.5L18 6.45L8.604 15.846C8.41714 16.0331 8.19513 16.1814 7.95076 16.2825C7.70638 16.3835 7.44444 16.4352 7.18 16.4347Z" fill="white"/>
          </svg>
        </span>

        <span class="popup-text">Скопировано</span>
      `;
      popup.classList.remove('show');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const popupRect = popup.getBoundingClientRect();
          const vw = document.documentElement.clientWidth;
          const vh = document.documentElement.clientHeight;
          const pad = 8;

          let left = coordX - popupRect.width / 2 + viewportOffsetLeft;
          let top  = coordY - popupRect.height - 12 + viewportOffsetTop;

          if (top < pad) {
            top = coordY + 12 + viewportOffsetTop;
          }

          left = Math.min(Math.max(pad, left), vw - popupRect.width - pad + viewportOffsetLeft);
          top  = Math.min(Math.max(pad + viewportOffsetTop, top), vh - popupRect.height - pad + viewportOffsetTop);

          popup.style.left = `${Math.round(left)}px`;
          popup.style.top  = `${Math.round(top)}px`;
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




// Модальное окно для видео

const modalVideo = document.querySelector('.modal-video-about');

if (modalVideo) {
  (function () {
    const modal = document.querySelector('.modal-video-about');
    const modalWrap = modal?.querySelector('.modal-media-wrap');
    const closeBtn = modal?.querySelector('.close-video');
    const playButtons = document.querySelectorAll('[data-video]');
    let lastFocused = null;

    function isRutube(url) {
      return /rutube\.ru/.test(url);
    }
    function isMp4(url) {
      return /\.(mp4|webm|ogg)(\?|$)/i.test(url);
    }

    function buildRutubeIframe(src) {
      const url = new URL(src, window.location.href);
      url.searchParams.set('autoplay', '1');
      const iframe = document.createElement('iframe');
      iframe.src = url.toString();
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'autoplay; encrypted-media; fullscreen');
      iframe.allowFullscreen = true;
      return iframe;
    }

    function buildHtml5Video(src) {
      const video = document.createElement('video');
      video.controls = true;
      video.autoplay = true;
      video.preload = 'metadata';
      const source = document.createElement('source');
      source.src = src;
      video.appendChild(source);
      return video;
    }

    function clearMedia() {
      if (!modalWrap) return;
      const child = modalWrap.firstElementChild;
      if (child) {
        if (child.tagName === 'VIDEO') child.pause();
        modalWrap.innerHTML = '';
      }
    }

    function openModalWith(url, typeHint) {
      lastFocused = document.activeElement;
      clearMedia();

      let node;
      if (typeHint === 'rutube' || (!typeHint && isRutube(url))) {
        node = buildRutubeIframe(url);
      } else {
        node = buildHtml5Video(url);
      }

      modalWrap.appendChild(node);
      modal.style.display = 'flex';
      requestAnimationFrame(() => modal.classList.add('show'));

      document.documentElement.classList.add('no-scroll-modal');
      document.body.classList.add('no-scroll-modal');
    }

    function closeModal() {
      modal.classList.remove('show');
      clearMedia();

      setTimeout(() => {
        modal.style.display = 'none';
        document.documentElement.classList.remove('no-scroll-modal');
        document.body.classList.remove('no-scroll-modal');
      }, 300); 
    }

    playButtons.forEach(btn => {
      btn.addEventListener('click', e => {
        const url = btn.getAttribute('data-video');
        const typeHint = btn.getAttribute('data-type');
        if (url) openModalWith(url, typeHint);
      });
    });

    closeBtn?.addEventListener('click', closeModal);
    modal.addEventListener('click', e => {
      if (!e.target.closest('.modal-content-video-about')) closeModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
    });
  })();
}


// Валидация номера телефона в форме

const phoneInputs = document.querySelectorAll('[data-field="phone"]');

if (phoneInputs && phoneInputs.length) {
  phoneInputs.forEach(input => input.addEventListener('input', handlePhoneInput));
}

function handlePhoneInput(e) {
  const input = e.target;
  const prevValue = input.value;
  let value = prevValue.replace(/\D/g, '');

  if (value.startsWith('8')) value = '7' + value.slice(1);
  if (value.startsWith('7')) value = value.slice(1);

  value = value.slice(0, 10);

  let formatted = '';
  if (value.length > 0) formatted += `(${value.slice(0, Math.min(3, value.length))}`;
  if (value.length >= 4) formatted += `) ${value.slice(3, Math.min(6, value.length))}`;
  if (value.length >= 7) formatted += `-${value.slice(6, Math.min(8, value.length))}`;
  if (value.length >= 9) formatted += `-${value.slice(8, 10)}`;

  const prefix = '+7 ';
  const cursorPos = input.selectionStart || 0;
  const oldLen = prevValue.length;

  input.value = prefix + formatted;

  const newLen = input.value.length;
  const shift = newLen - oldLen;
  const newPos = Math.max(0, Math.min(input.value.length, cursorPos + shift));
  input.setSelectionRange(newPos, newPos);
}



// Сброс формы 
function resetForm(form) {
  if (!form) return;
  try { form.reset(); } catch (e) {}

  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

  form.querySelectorAll('input, textarea').forEach(i => {
    if (i.type === 'file') return;
    if (i.type === 'checkbox' || i.type === 'radio') {
      i.checked = false;
    } else {
      i.value = '';
    }
  });

  const fileInput = form.querySelector('[data-field="file"], .file-input');
  const attachedFiles = form.querySelector('.attached-files');

  if (attachedFiles) {
    attachedFiles.querySelectorAll('.remove-file').forEach(btn => {
      try { btn.click(); } catch (e) {}
    });
    attachedFiles.innerHTML = '';
  }

  if (fileInput) {
    try {
      fileInput.value = '';
      const dt = new DataTransfer();
      fileInput.files = dt.files;
    } catch (e) {
      try { fileInput.value = ''; } catch (er) {}
    }
  }

  form.querySelectorAll('.attached-file').forEach(el => {
    el.classList.remove('visible', 'removing');
  });
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'Kb', 'Mb', 'Gb', 'Tb'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  const str = (Math.round(value * 100) / 100).toString();
  return str.replace('.', ',') + ' ' + sizes[i];
}

function escapeHtml(s = '') {
  return s.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

// function formatDisplayName(filename) {
//   if (!filename) return '';

//   const parts = filename.split('.');
//   if (parts.length === 1) {
//     // нет расширения
//     const base = parts[0];
//     const short = Array.from(base).slice(0, 5).join('');
//     return short;
//   }
//   const ext = parts.pop(); 
//   const base = parts.join('.');
//   const shortBase = Array.from(base).slice(0, 5).join('');
//   return `${shortBase}.${ext.toLowerCase()}`;
// }

function formatDisplayName(filename) {
  if (!filename) return '';

  const parts = filename.split('.');
  if (parts.length === 1) {
    return parts[0];
  }
  const ext = parts.pop();
  const base = parts.join('.');
  return `${base}.${ext.toLowerCase()}`;
}

// Валидация форм 
document.querySelectorAll('.get-contact-form').forEach((form) => {
  const fileInput = form.querySelector('[data-field="file"], .file-input');
  const attachArea = form.querySelector('#attachArea') || form.querySelector('.get-contact-attach-file');
  const attachedFiles = form.querySelector('.attached-files');

  if (fileInput && attachArea && attachedFiles) {
    (function () {
      const MAX_FILES = 3;
      const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
      let selectedFiles = [];

      attachArea.addEventListener('click', () => fileInput.click());
      attachArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
      });

      fileInput.addEventListener('change', (e) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (!files.length) return;
        fileInput.value = '';
        addFiles(files);
      });

      function addFiles(files) {
        const available = MAX_FILES - selectedFiles.length;

        if (available <= 0) {
          return;
        }

        const toAdd = files.slice(0, available);

        let hasValid = false;
        for (const file of toAdd) {
          if (file.size > MAX_BYTES) {
            renderErrorFile(file.name);
            continue;
          }
          selectedFiles.push(file);
          hasValid = true;
        }

        if (hasValid) {
          renderAttachedFiles();
          updateInputFiles();
        }
      }

      // Ошибка, если файл больше 5МБ
      let tempAttachError = null;
      let tempAttachErrorTimer = null;

      function renderErrorFile(fileName) {
        const safeName = fileName ? fileName : 'Файл';
        const msg = `Файл «${safeName}» превышает 5 МБ`;

        if (tempAttachError) {
          tempAttachError.textContent = msg;
          tempAttachError.setAttribute('aria-hidden', 'false');
          if (tempAttachErrorTimer) {
            clearTimeout(tempAttachErrorTimer);
          }
          tempAttachErrorTimer = setTimeout(() => clearTempAttachError(), 3500);
          return;
        }

        const el = document.createElement('p');
        el.className = 'accept-politics-error';
        el.setAttribute('role', 'alert');
        el.setAttribute('aria-hidden', 'false');
        el.style.marginTop = '12px';
        el.textContent = msg;

        try {
          if (attachArea && attachArea.parentNode) {
            attachArea.parentNode.insertBefore(el, attachArea.nextSibling);
          } else if (attachedFiles) {
            attachedFiles.insertBefore(el, attachedFiles.firstChild);
          } else if (form) {
            form.appendChild(el);
          } else {
            document.body.appendChild(el);
          }
        } catch (e) {
          try { form && form.appendChild(el); } catch (err) {}
        }

        tempAttachError = el;

        requestAnimationFrame(() => {
          tempAttachError.classList.add('visible');
        });

        tempAttachErrorTimer = setTimeout(() => clearTempAttachError(), 3500);
      }

      function clearTempAttachError() {
        if (!tempAttachError) return;

        tempAttachError.classList.remove('visible');
        tempAttachError.setAttribute('aria-hidden', 'true');

        const elToRemove = tempAttachError;
        const onTransitionEnd = (ev) => {
          if (ev.propertyName === 'opacity' || ev.propertyName === 'max-height') {
            elToRemove.removeEventListener('transitionend', onTransitionEnd);
            try { elToRemove.remove(); } catch (e) {}
          }
        };
        elToRemove.addEventListener('transitionend', onTransitionEnd);

        setTimeout(() => {
          try { elToRemove.removeEventListener('transitionend', onTransitionEnd); } catch(e) {}
          try { elToRemove.remove(); } catch(e) {}
        }, 500);

        tempAttachError = null;
        if (tempAttachErrorTimer) {
          clearTimeout(tempAttachErrorTimer);
          tempAttachErrorTimer = null;
        }
      }

      function showTempError(msg) {
        if (!attachedFiles) return;

        const prevPosition = attachedFiles.style.position;
        if (!prevPosition || prevPosition === '') attachedFiles.style.position = 'relative';

        const el = document.createElement('div');
        el.className = 'attached-file file-error temp-file-error';
        el.setAttribute('role', 'alert');
        el.textContent = msg;

        el.style.position = 'absolute';
        el.style.left = '0';
        el.style.right = '0';
        el.style.top = '0';
        el.style.boxSizing = 'border-box';
        el.style.padding = '8px';
        el.style.zIndex = '999';
        el.style.pointerEvents = 'none';

        attachedFiles.appendChild(el);

        requestAnimationFrame(() => el.classList.add('visible', 'flash'));

        setTimeout(() => {
          try { el.remove(); } catch (e) {}
          const stillTemp = attachedFiles.querySelector('.temp-file-error');
          if (!stillTemp) {
            const hasAttached = attachedFiles.querySelector('.attached-file') !== null;
            if (!hasAttached) attachedFiles.style.position = '';
          }
        }, 3000);
      }

      function renderAttachedFiles() {
        attachedFiles.innerHTML = '';
        if (selectedFiles.length === 0) return;

        const title = document.createElement('p');
        title.className = 'attached-file-title';
        title.textContent = 'Загруженные файлы:';
        attachedFiles.appendChild(title);
        requestAnimationFrame(() => title.classList.add('visible'));

        selectedFiles.forEach((file, idx) => {
          const item = document.createElement('div');
          item.className = 'attached-file';
          item.setAttribute('data-idx', idx);

          const visibleName = formatDisplayName(file.name);

          item.innerHTML = `
            <div class="upload-file-content">
              <div class="upload-file-left">
                <div class="file-name" title="${escapeHtml(file.name)}">${escapeHtml(visibleName)}</div>
              </div>
              <div class="upload-file-right">
                <div class="file-size" aria-label="Размер файла">${formatFileSize(file.size)}</div>
                <button type="button" class="remove-file" data-idx="${idx}" aria-label="Удалить файл" title="Удалить файл">
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M11 1L1 11M1 1l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                </button>
              </div>
            </div>
          `;
          attachedFiles.appendChild(item);
          requestAnimationFrame(() => item.classList.add('visible'));
        });
      }

      attachedFiles.addEventListener('click', (e) => {
        const btn = e.target.closest && e.target.closest('.remove-file');
        if (!btn) return;
        e.preventDefault();

        const parent = btn.closest('.attached-file');
        if (!parent || parent.classList.contains('removing')) return;

        const idxAttr = btn.getAttribute('data-idx');
        const idx = idxAttr !== null ? Number(idxAttr) : NaN;
        if (Number.isNaN(idx)) return;

        fadeOutAndRemove(idx);
      });

      function fadeOutAndRemove(index) {
        const el = attachedFiles.querySelector(`.attached-file[data-idx="${index}"]`);
        if (!el) {
          removeFileImmediate(index);
          return;
        }

        el.classList.remove('visible');
        el.classList.add('removing');

        const onTransitionEnd = (ev) => {
          if (ev.propertyName === 'opacity') {
            el.removeEventListener('transitionend', onTransitionEnd);
            removeFileImmediate(index);
          }
        };
        el.addEventListener('transitionend', onTransitionEnd);

        setTimeout(() => {
          if (attachedFiles.contains(el)) {
            el.removeEventListener('transitionend', onTransitionEnd);
            removeFileImmediate(index);
          }
        }, 400);
      }

      function removeFileImmediate(index) {
        if (index < 0 || index >= selectedFiles.length) return;
        selectedFiles.splice(index, 1);
        renderAttachedFiles();
        updateInputFiles();
      }

      function updateInputFiles() {
        try {
          const dt = new DataTransfer();
          selectedFiles.forEach(f => dt.items.add(f));
          fileInput.files = dt.files;
        } catch (e) {
          console.warn('DataTransfer не поддерживается в этом браузере, поле fileInput не обновлено.');
        }
      }
    })();
  } 

  const acceptInput = form.querySelector('[data-field="accept"]');
  const acceptError = form.querySelector('.accept-politics-error');
  const visualCheckbox = form.querySelector('.custom-checkbox .checkbox-img');
  const emailInput = form.querySelector('[data-field="email"]');

  if (acceptError) {
    acceptError.setAttribute('aria-hidden', 'true');
    acceptError.setAttribute('role', 'alert');
  }

  if (visualCheckbox && !visualCheckbox.hasAttribute('tabindex')) {
    visualCheckbox.setAttribute('tabindex', '0');
  }

  if (acceptInput) {
    acceptInput.addEventListener('change', () => {
      if (acceptInput.checked) {
        acceptInput.classList.remove('error');
        acceptError && acceptError.classList.remove('visible');
        acceptError && acceptError.setAttribute('aria-hidden', 'true');
        visualCheckbox && visualCheckbox.classList.remove('animate');
      }
    });
  }

  form.addEventListener('submit', function (e) {
    const nameInput = form.querySelector('[data-field="name"]');
    const phoneInput = form.querySelector('[data-field="phone"]');

    let valid = true;

    // имя
    if (nameInput && nameInput.dataset.required === "true" && !nameInput.value.trim()) {
      nameInput.classList.add('error');
      valid = false;
    } else {
      nameInput && nameInput.classList.remove('error');
    }

    // телефон
    if (phoneInput && phoneInput.dataset.required === "true" && !phoneInput.value.trim()) {
      phoneInput.classList.add('error');
      valid = false;
    } else {
      phoneInput && phoneInput.classList.remove('error');
    }

    // email
    if (emailInput && emailInput.dataset.required === "true" && !emailInput.value.trim()) {
      emailInput.classList.add('error');
      emailInput.setAttribute('aria-invalid', 'true');
      try { emailInput.focus({ preventScroll: true }); } catch (e) {}
      valid = false;
    } else if (emailInput) {
      emailInput.classList.remove('error');
      emailInput.removeAttribute('aria-invalid');
    }

    // чекбокс
    if (acceptInput && acceptInput.dataset.required === "true" && !acceptInput.checked) {
      acceptInput.classList.add('error');
      if (acceptError) {
        acceptError.classList.add('visible');
        acceptError.setAttribute('aria-hidden', 'false');
      }
      if (visualCheckbox) {
        visualCheckbox.classList.add('animate');
        setTimeout(() => visualCheckbox && visualCheckbox.classList.remove('animate'), 350);
        try { visualCheckbox.focus({ preventScroll: true }); } catch (e) {}
      }
      valid = false;
    } else if (acceptInput) {
      acceptInput.classList.remove('error');
      acceptError && acceptError.classList.remove('visible');
      acceptError && acceptError.setAttribute('aria-hidden', 'true');
    }

    if (!valid) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
  });
});



// Попап "Запросить коммерческое предложение"

const menu = document.querySelector('.header-menu-open-burger');
const kpPopup = document.querySelector('.kp-popup');
const kpContent = document.querySelector('.kp-popup-content');
const kpCloseBtn = document.querySelector('.kp-popup-close');

const isMenuOpen = () => !!menu && menu.classList.contains('is-open');

let kpScrollPos = 0;
let kpLastFocused = null;

function setPopupProduct(value) {
  const input = document.querySelector('.js-Product');
  if (input) {
    input.value = value || '';
  }
}

function openKpPopup(productTitle, event) {
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
    event.stopPropagation();
  }

  kpLastFocused = event?.currentTarget || document.activeElement;

  if (!kpPopup) return;

  if (typeof productTitle === 'string') {
    setPopupProduct(productTitle);
  }

  kpScrollPos = window.scrollY || window.pageYOffset || 0;

  document.body.style.position = 'fixed';
  document.body.style.top = `-${kpScrollPos}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';

  kpPopup.classList.remove('closing');
  kpPopup.classList.add('show');
  kpPopup.setAttribute('aria-hidden', 'false');

  const firstFocusable = kpPopup.querySelector('button, a[href], input, textarea, [tabindex]:not([tabindex="-1"])');
  if (firstFocusable) {
    try {
      firstFocusable.focus({ preventScroll: true });
    } catch (err) {
      firstFocusable.focus();
    }
  }
}

function closeKpPopup() {
  if (!kpPopup || !kpPopup.classList.contains('show')) return;

  kpPopup.classList.remove('show');
  kpPopup.classList.add('closing');
  kpPopup.setAttribute('aria-hidden', 'true');

  setPopupProduct('');

  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';

  const prevScrollBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';

  requestAnimationFrame(() => {
    window.scrollTo(0, kpScrollPos || 0);

    if (kpLastFocused && typeof kpLastFocused.focus === 'function') {
      try {
        kpLastFocused.focus({ preventScroll: true });
      } catch (e) {
        try {
          kpLastFocused.setAttribute('tabindex', '-1');
          kpLastFocused.focus();
          kpLastFocused.removeAttribute('tabindex');
        } catch (ignore) {}
      }
    }
    kpLastFocused = null;

    setTimeout(() => {
      document.documentElement.style.scrollBehavior = prevScrollBehavior || '';
    }, 50);
  });

  const onTransitionEnd = (e) => {
    if (e.target !== kpPopup || e.propertyName !== 'opacity') return;
    kpPopup.classList.remove('closing');
    document.body.style.overflow = '';
    kpPopup.removeEventListener('transitionend', onTransitionEnd);
  };
  kpPopup.addEventListener('transitionend', onTransitionEnd);
}


// кнопка крестик
if (kpCloseBtn) {
  kpCloseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeKpPopup();
  });
}

if (kpPopup) {
  kpPopup.addEventListener('click', (e) => {
    if (e.target === kpPopup) {
      e.stopPropagation(); 
      closeKpPopup();
    }
  });
  if (kpContent) {
    kpContent.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
}

// ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    if (kpPopup && kpPopup.classList.contains('show')) {
      closeKpPopup();
    }
  }
});

// Клик на кнопку "Получить КП"
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.get-kp-btn');
  if (!btn) return;

  if (typeof e.preventDefault === 'function') e.preventDefault();
  if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
  e.stopPropagation();

  const scrollPos = window.scrollY || window.pageYOffset || 0;

  openKpPopup(null, e, scrollPos);
}, { capture: true });







// Плавный скролл к якорю

(function(){
  document.addEventListener('click', function(e){
    const a = e.target.closest('a[href*="#"]');
    
    if (!a) return;

    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target && a.target === '_blank') return;

    let href = a.getAttribute('href');
    if (!href) return;

    try {
      const url = new URL(href, location.href);
      if (url.origin !== location.origin) return;

      const pathname = url.pathname || location.pathname;
      const explicitTarget = a.dataset && a.dataset.target ? a.dataset.target : (url.hash ? url.hash.slice(1) : null);

      if (pathname === location.pathname || pathname === ('/' + location.pathname.replace(/^\//, ''))) {
        if (!explicitTarget) return; 
        const el = document.getElementById(explicitTarget);
        if (el) {
          e.preventDefault();

          el.scrollIntoView({ behavior: 'smooth', block: 'start' });

          history.replaceState(null, '', '#' + explicitTarget);
        }
      return;
    }

    if (url.hash || explicitTarget) {
      e.preventDefault();
      const targetId = explicitTarget || (url.hash ? url.hash.slice(1) : null);
      const payload = { path: url.pathname + (url.search || ''), id: targetId };
      try { sessionStorage.setItem('siteSmoothScroll', JSON.stringify(payload)); } catch(e) {}
      location.href = payload.path;
    }

    } catch (err) {
    return;
  }
  }, { passive: false });
})();


// Анимация плавного скрола к якорю
(function(){
  const DURATION = 1400;    
  const HEADER_OFFSET = 80; 

  function easeInOutCubic(t){ return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2; }

  function smoothScrollTo(targetY, duration){
    const startY = window.scrollY || window.pageYOffset;
    const diff = targetY - startY;
    const startTime = performance.now();
    return new Promise(resolve=>{
      function step(now){
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const eased = easeInOutCubic(progress);
        window.scrollTo(0, Math.round(startY + diff * eased));
        if (progress < 1) requestAnimationFrame(step);
        else resolve();
      }
      requestAnimationFrame(step);
    });
  }

  async function run() {
    let payload = null;
    try {
      const raw = sessionStorage.getItem('siteSmoothScroll');
      if (raw) {
        payload = JSON.parse(raw);
        if (payload.path && payload.path.replace(/^\//,'') !== location.pathname.replace(/^\//,'')) {
          payload = null;
        }
      }
    } catch(e) { payload = null; }

    if (!payload && location.hash) {
      payload = { path: location.pathname, id: location.hash.slice(1) };
    }

    try { sessionStorage.removeItem('siteSmoothScroll'); } catch(e){}

    if (!payload || !payload.id) {
      document.documentElement.style.scrollBehavior = '';
      return;
    }

    if (document.readyState !== 'complete') {
      await new Promise(r => window.addEventListener('load', r, { once: true }));
    }
    await new Promise(r => setTimeout(r, 60));

    const el = document.getElementById(payload.id);
    if (!el) {
      document.documentElement.style.scrollBehavior = '';
      return;
    }

    const rect = el.getBoundingClientRect();
    const targetY = (window.scrollY || window.pageYOffset) + rect.top - HEADER_OFFSET;
    await smoothScrollTo(targetY, DURATION);

    try { history.replaceState(null, '', '#' + payload.id); } catch(e){}

    document.documentElement.style.scrollBehavior = '';
  }

  run();
})();












// Переключение табов в карточке товара

(function () {
  const DURATION = 320; // ms

  const tagsContainer = document.querySelector('.news-tags');
  if (!tagsContainer) return;
  const tags = Array.from(document.querySelectorAll('.news-tag'));
  const panels = Array.from(document.querySelectorAll('.open-product-tag'));

  tags.forEach((tag, i) => {
    if (!tag.hasAttribute('data-open-tag')) {
      const val = String(i + 1);
      tag.setAttribute('data-open-tag', val);
    } else {
      tag.dataset.openTag = tag.getAttribute('data-open-tag');
    }
    if (!tag.hasAttribute('tabindex')) tag.setAttribute('tabindex', '0');
    if (!tag.hasAttribute('role')) tag.setAttribute('role', 'tab');
  });

  panels.forEach((p, i) => {
    if (!p.hasAttribute('data-open-tag')) {
      p.setAttribute('data-open-tag', String(i + 1));
    }

    if (!p.classList.contains('active')) {
      p.style.display = 'none';
      p.style.height = '0px';
      p.style.opacity = '0';
      p.style.transform = 'translateY(8px)';
    } else {
      p.style.display = 'block';
      p.style.height = 'auto';
      p.style.opacity = '1';
      p.style.transform = 'translateY(0)';
    }
  });

  function animateShow(panel) {
    if (panel.classList.contains('animating') || panel.classList.contains('active')) return;
    panel.classList.add('animating');

    panel.style.display = 'block';
    panel.style.transition = 'none';
    panel.style.height = '0px';
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(8px)';

    panel.getBoundingClientRect();

    const targetHeight = panel.scrollHeight + 'px';

    panel.style.transition = `height ${DURATION}ms cubic-bezier(.2,.9,.2,1), opacity ${DURATION}ms ease, transform ${DURATION}ms ease`;
    panel.style.height = targetHeight;
    panel.style.opacity = '1';
    panel.style.transform = 'translateY(0)';

    const onEnd = (e) => {
      if (e && e.target !== panel) return;
      panel.removeEventListener('transitionend', onEnd);
      panel.style.transition = '';
      panel.style.height = 'auto';
      panel.classList.remove('animating');
      panel.classList.add('active');
    };
    panel.addEventListener('transitionend', onEnd);
  }

  function animateHide(panel) {
    if (!panel || panel.classList.contains('animating')) return;
    panel.classList.add('animating');

    const startHeight = panel.scrollHeight + 'px';
    panel.style.height = startHeight;
    panel.style.transition = 'none';
    panel.getBoundingClientRect();

    panel.style.transition = `height ${DURATION}ms cubic-bezier(.2,.9,.2,1), opacity ${DURATION}ms ease, transform ${DURATION}ms ease`;
    panel.style.height = '0px';
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(8px)';

    const onEnd = (e) => {
      if (e && e.target !== panel) return;
      panel.removeEventListener('transitionend', onEnd);
      panel.style.transition = '';
      panel.style.display = 'none';
      panel.classList.remove('animating');
      panel.classList.remove('active');
      panel.style.height = '0px';
    };
    panel.addEventListener('transitionend', onEnd);
  }

  function openByTag(tagValue) {
    if (!tagValue) return;
    const targetPanel = document.querySelector(`.open-product-tag[data-open-tag="${tagValue}"]`);
    if (!targetPanel) return;

    const currentTag = document.querySelector('.news-tag.active');
    const currentPanel = document.querySelector('.open-product-tag.active');

    if (currentTag) currentTag.classList.remove('active');
    const newTag = document.querySelector(`.news-tag[data-open-tag="${tagValue}"]`);
    if (newTag) newTag.classList.add('active');

    if (currentPanel === targetPanel) return;

    if (currentPanel) animateHide(currentPanel);
    animateShow(targetPanel);
  }

  tagsContainer.addEventListener('click', function (e) {
    const tag = e.target.closest('.news-tag');
    if (!tag) return;
    const tagValue = tag.getAttribute('data-open-tag') || tag.dataset.openTag;
    openByTag(tagValue);
  });

  tagsContainer.addEventListener('keydown', function (e) {
    const tag = e.target.closest('.news-tag');
    if (!tag) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const tagValue = tag.getAttribute('data-open-tag') || tag.dataset.openTag;
      openByTag(tagValue);
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const idx = tags.indexOf(tag);
      const nextIdx = e.key === 'ArrowRight' ? Math.min(tags.length - 1, idx + 1) : Math.max(0, idx - 1);
      const nextTag = tags[nextIdx];
      if (nextTag) nextTag.focus();
    }
  });

  const initial = document.querySelector('.news-tag.active') || document.querySelector('.news-tag[data-open-tag="1"]') || tags[0];
  if (initial) {
    setTimeout(() => {
      const val = initial.getAttribute('data-open-tag') || initial.dataset.openTag;
      openByTag(val);
    }, 20);
  }
})();


// Попап "Поделиться"

const shareBtn = document.getElementById('shareBtn');

if (shareBtn) {
  (function(){
    const btn = document.getElementById('shareBtn');
    const menu = document.getElementById('shareMenu');
    const originalParent = menu.parentNode;
    let isFloating = false;
    let cleanupListeners = null;

    function getButtonRect() {
      return btn.getBoundingClientRect();
    }

    function openFloatingMenu() {
      if(isFloating) return;
      menu.classList.add('floating');
      menu.classList.add('open');

      document.body.appendChild(menu);

      const rect = getButtonRect();
      const top = window.pageYOffset + rect.bottom + 8; // 8px отступ
      const left = window.pageXOffset + rect.left + rect.width / 2;

      menu.style.position = 'absolute';
      menu.style.top = top + 'px';
      menu.style.left = left + 'px';

      const onScrollResize = () => {
        const r = getButtonRect();
        const t = window.pageYOffset + r.bottom + 8;
        const l = window.pageXOffset + r.left + r.width / 2;
        menu.style.top = t + 'px';
        menu.style.left = l + 'px';
      };
      window.addEventListener('scroll', onScrollResize, {passive: true});
      window.addEventListener('resize', onScrollResize);

      cleanupListeners = () => {
        window.removeEventListener('scroll', onScrollResize);
        window.removeEventListener('resize', onScrollResize);
      };

      isFloating = true;
      btn.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
    }

    function closeFloatingMenu() {
      if(!isFloating) return;
      menu.classList.remove('open');

      const onTransitionEnd = () => {
        originalParent.appendChild(menu);
        menu.style.position = '';
        menu.style.top = '';
        menu.style.left = '';
        menu.classList.remove('floating');
        menu.removeEventListener('transitionend', onTransitionEnd);
      };
      menu.addEventListener('transitionend', onTransitionEnd);

      if(typeof cleanupListeners === 'function') cleanupListeners();
      isFloating = false;
      btn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if(menu.classList.contains('open')) {
        closeFloatingMenu();
      } else {
        openFloatingMenu();
        const first = menu.querySelector('[role="menuitem"]');
        if(first) first.focus();
      }
    });

    document.addEventListener('click', (e) => {
      if(!menu.classList.contains('open')) return;
      if(e.target === btn || menu.contains(e.target)) return;
      closeFloatingMenu();
    });

    document.addEventListener('keydown', (ev) => {
      if(ev.key === 'Escape' && menu.classList.contains('open')) {
        closeFloatingMenu();
        btn.focus();
      }
      if(menu.classList.contains('open') && (ev.key === 'ArrowDown' || ev.key === 'ArrowUp')) {
        ev.preventDefault();
        const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));
        const idx = items.indexOf(document.activeElement);
        let next;
        if(ev.key === 'ArrowDown') next = items[(idx + 1) % items.length];
        else next = items[(idx - 1 + items.length) % items.length];
        if(next) next.focus();
      }
    });

    menu.addEventListener('click', (e) => {
      const li = e.target.closest('[role="menuitem"]');
      if(!li) return;
      btn.focus();
    });

  })();
}


// Модальное окно "Поделиться" на мобилке

const overlay = document.querySelector('.share-overlay');
const shareModal = document.querySelector('.share-modal');
let scrollPosition = 0;

function isInsideModal(target) {
  return target && target.closest && target.closest('.share-modal');
}

function preventTouchMove(e) {
  if (!isInsideModal(e.target)) {
    e.preventDefault();
  }
}

function openShareModal() {
  scrollPosition = window.scrollY || window.pageYOffset || 0;

  document.body.classList.add('modal-open');
  document.body.style.top = `-${scrollPosition}px`;

  overlay.classList.add('active');

  document.addEventListener('touchmove', preventTouchMove, { passive: false });
  document.addEventListener('wheel', preventTouchMove, { passive: false }); 
}

function closeShareModal() {
  overlay.classList.remove('active');

  document.removeEventListener('touchmove', preventTouchMove, { passive: false });
  document.removeEventListener('wheel', preventTouchMove, { passive: false });

  document.body.classList.remove('modal-open');
  document.body.style.top = '';

  window.scrollTo(0, scrollPosition);
}

document.addEventListener('click', (e) => {
  if (e.target.classList && e.target.classList.contains('share-overlay')) {
    closeShareModal();
  }
});

document.addEventListener('click', (e) => {
  if (e.target.closest && e.target.closest('.close-share-modal')) {
    closeShareModal();
  }
});

const shareButton = document.querySelector('.your-share-button-selector');
if (shareButton) {
  shareButton.addEventListener('click', (e) => {
    e.preventDefault();
    openShareModal();
  });
}


// Переключение фотографий карточки товара

(function () {
  const root = document.querySelector('.product-miniature-images');
  if (!root) return;
  const thumbnailsContainer = root.querySelector('.thumbs-scroll-area');
  if (!thumbnailsContainer) return;

  const thumbnails = Array.from(thumbnailsContainer.children).filter(el => {
    const tag = el.tagName && el.tagName.toLowerCase();
    return tag === 'img' || (el.classList && el.classList.contains('view-3D'));
  });

  const topBtn = root.querySelector('.top-btn');
  const bottomBtn = root.querySelector('.bottom-btn');
  const mainImgContainer = document.querySelector('.product-main-image');
  const mainImg = mainImgContainer && mainImgContainer.querySelector('img');
  const progressContainer = mainImgContainer && mainImgContainer.querySelector('.gallery-progress');
  if (!mainImg || thumbnails.length === 0 || !progressContainer) return;

  function is3DItem(item) {
    return item && item.classList && item.classList.contains('view-3D');
  }
  function getItemThumbSrc(item) {
    if (!item) return '';
    if (is3DItem(item)) {
      const b = item.querySelector('.banner-3D');
      return (b && (b.src || b.getAttribute('src'))) || (item.dataset && item.dataset.thumb) || 'images/3D.svg';
    } else {
      return item.dataset && (item.dataset.thumb || item.dataset.large) || item.src || '';
    }
  }
  function getItemLargeSrc(item) {
    if (!item) return '';
    if (is3DItem(item)) {
      const b = item.querySelector('.banner-3D');
      return (item.dataset && item.dataset.large) || (b && (b.src || b.getAttribute('src'))) || item.src || 'images/3D.svg';
    } else {
      return item.dataset && (item.dataset.large) || item.src || '';
    }
  }
  function getItemModelPath(item) {
    return is3DItem(item) ? (item.dataset && item.dataset.model || null) : null;
  }

  function buildProgress(n, container) {
    container.innerHTML = '';
    for (let i = 0; i < n; i++) {
      const tick = document.createElement('div');
      tick.className = 'tick';
      const bar = document.createElement('div');
      bar.className = 'bar';
      tick.appendChild(bar);
      container.appendChild(tick);
    }
    return Array.from(container.children);
  }
  const ticks = buildProgress(thumbnails.length, progressContainer);

  mainImg.addEventListener('dragstart', e => e.preventDefault());

  let currentIndex = thumbnails.findIndex(t => t.classList && t.classList.contains('product-img-active'));
  if (currentIndex === -1) currentIndex = 0;

  function updateActiveClasses(idx) {
    thumbnails.forEach(t => {
      if (is3DItem(t)) {
        const b = t.querySelector('.banner-3D');
        if (b) b.classList.remove('product-img-active');
        t.classList.remove('product-img-active');
      } else {
        t.classList.remove('product-img-active');
      }
    });
    ticks.forEach(t => t.classList.remove('active'));

    const thumb = thumbnails[idx];
    if (!thumb) return;
    if (is3DItem(thumb)) {
      const b = thumb.querySelector('.banner-3D');
      if (b) b.classList.add('product-img-active');
      else thumb.classList.add('product-img-active');
    } else {
      thumb.classList.add('product-img-active');
    }
    if (ticks[idx]) ticks[idx].classList.add('active');
  }

  function getThumbGap() {
    const cs = getComputedStyle(thumbnailsContainer);
    return parseFloat(cs.rowGap || cs.gap || 0) || 0;
  }
  function getScrollStep() {
    const thumb = thumbnails[0];
    if (!thumb) return 0;
    return Math.round((thumb.clientHeight + getThumbGap()) * 4);
  }
  function safeScrollTo(targetTop) {
    const max = thumbnailsContainer.scrollHeight - thumbnailsContainer.clientHeight;
    const t = Math.max(0, Math.min(max, Math.round(targetTop)));
    thumbnailsContainer.scrollTo({ top: t, behavior: 'smooth' });
  }
  function scrollThumbIntoView(thumb) {
    if (!thumb || !thumbnailsContainer) return;
    const scrollTop = thumbnailsContainer.scrollTop;
    const containerH = thumbnailsContainer.clientHeight;
    const thumbTop = thumb.offsetTop;
    const thumbH = thumb.clientHeight;
    const topBtnH = topBtn ? topBtn.getBoundingClientRect().height : 0;
    const bottomBtnH = bottomBtn ? bottomBtn.getBoundingClientRect().height : 0;
    const visibleTop = scrollTop + topBtnH;
    const visibleBottom = scrollTop + containerH - bottomBtnH;
    if (thumbTop < visibleTop) {
      safeScrollTo(thumbTop - topBtnH - 4);
    } else if (thumbTop + thumbH > visibleBottom) {
      safeScrollTo(thumbTop + thumbH - containerH + bottomBtnH + 4);
    }
  }

  let switching = false;
  function showImage(idx) {
    if (thumbnails.length === 0) return;

    idx = Math.max(0, Math.min(thumbnails.length - 1, idx));

    if (idx === currentIndex) return;
    if (switching) return;
    switching = true;

    const thumb = thumbnails[idx];
    const large = getItemLargeSrc(thumb);
    mainImg.classList.add('fading');

    setTimeout(() => {
      mainImg.src = large;
      updateActiveClasses(idx);
      requestAnimationFrame(() => {
        setTimeout(() => {
          mainImg.classList.remove('fading');
          currentIndex = idx;
          switching = false;

          scrollThumbIntoView(thumb);
          updateArrowsState();
        }, 60);
      });
    }, 180);
  }

  function updateArrowsState() {
    if (!topBtn || !bottomBtn) return;
    const atFirst = currentIndex <= 0;
    const atLast = currentIndex >= thumbnails.length - 1;

    topBtn.classList.toggle('inactive', atFirst);
    bottomBtn.classList.toggle('inactive', atLast);

    const topArrow = topBtn.querySelector('path.unvisible');
    const bottomArrow = bottomBtn.querySelector('path.unvisible');
    const activeColor = '#1A1A1A';
    const inactiveColor = '#BDBDBD';
    if (topArrow) topArrow.setAttribute('fill', atFirst ? inactiveColor : activeColor);
    if (bottomArrow) bottomArrow.setAttribute('fill', atLast ? inactiveColor : activeColor);
  }

  thumbnails.forEach((t, i) => {
    t.style.cursor = 'pointer';
    t.addEventListener('click', (ev) => {
      ev.stopPropagation();

      if (is3DItem(t)) {
        const modelPath = getItemModelPath(t) || t.dataset && (t.dataset.model || t.dataset.modelSrc) || null;

        const clickedOpen3D = !!(
          ev.target && (
            ev.target.closest && ev.target.closest('.open-3d-model')
            || ev.target.closest && ev.target.closest('.banner-3D')
            || ev.target.closest && ev.target.closest('.view-3D')
          )
        );

        if (modelPath && clickedOpen3D && typeof window.__open3DModal === 'function') {
          ev.preventDefault();
          ev.stopPropagation();
          // опционально имя:
          const name = t.dataset.modelName || t.getAttribute('alt') || '';
          window.__open3DModal({ src: modelPath, name });
          return;
        }

        const tryOpenModal = () => {
          if (window.__productGalleryModal && typeof window.__productGalleryModal.open === 'function') {
            window.__productGalleryModal.open(i);
            return true;
          }
          return false;
        };
        if (!tryOpenModal()) {
          setTimeout(() => tryOpenModal(), 50);
        }
        return;
      }

      showImage(i);
    });
  });

  mainImg.src = getItemLargeSrc(thumbnails[currentIndex]);
  updateActiveClasses(currentIndex);
  setTimeout(() => scrollThumbIntoView(thumbnails[currentIndex]), 100);

  const swipeArea = mainImgContainer;
  const HORIZONTAL_DETECT_THRESHOLD = 8;
  const SWIPE_THRESHOLD = 40;
  const MAX_VERTICAL_DELTA = 120;

  let startX = 0, startY = 0;
  let isDown = false;
  let maybeSwiping = false;
  let isSwiping = false;
  let didSwipe = false;
  let activePointerId = null;

  function resetTouch() {
    isDown = false; maybeSwiping = false; isSwiping = false; activePointerId = null;
  }

  function decideIfSwiping(dx, dy) {
    if (maybeSwiping) return;
    if (Math.abs(dx) > HORIZONTAL_DETECT_THRESHOLD || Math.abs(dy) > HORIZONTAL_DETECT_THRESHOLD) {
      maybeSwiping = true;
      isSwiping = Math.abs(dx) > Math.abs(dy);
    }
  }

  function setGrabbing(on) {
    try {
      if (!swipeArea) return;
      swipeArea.style.cursor = on ? 'grabbing' : (window.matchMedia && window.matchMedia('(hover: hover)').matches ? 'grab' : '');
    } catch (e) {}
  }

  swipeArea.addEventListener('pointerdown', (e) => {
    if (typeof isModalOpen === 'function' && isModalOpen()) return;
    if (e.button !== undefined && e.button !== 0) return; 

    if (activePointerId && activePointerId !== e.pointerId) return;

    activePointerId = e.pointerId;
    isDown = true;
    maybeSwiping = false;
    isSwiping = false;
    startX = e.clientX;
    startY = e.clientY;
    didSwipe = false;

    try { e.preventDefault(); } catch (err) {}

    setGrabbing(true);
    try { swipeArea.setPointerCapture && swipeArea.setPointerCapture(activePointerId); } catch (err) {}
  }, { capture: false, passive: false });

  swipeArea.addEventListener('pointermove', (e) => {
    if (!isDown || e.pointerId !== activePointerId) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    decideIfSwiping(dx, dy);
    if (maybeSwiping && isSwiping) {
      if (e.cancelable) try { e.preventDefault(); } catch (_) {}
    }
  }, { passive: false });

  swipeArea.addEventListener('pointerup', (e) => {
    if (!isDown || e.pointerId !== activePointerId) {
      setGrabbing(false);
      return;
    }
    const dx = e.clientX - startX, dy = e.clientY - startY;
    const swiped = (maybeSwiping && isSwiping && Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dy) < MAX_VERTICAL_DELTA);

    if (swiped) {
      if (dx < 0) showImage(currentIndex + 1); else showImage(currentIndex - 1);
      didSwipe = true;
      setTimeout(() => { didSwipe = false; }, 350);
    }

    try { swipeArea.releasePointerCapture && swipeArea.releasePointerCapture(activePointerId); } catch (err) {}
    resetTouch();
    setGrabbing(false);
  }, { passive: true });

  swipeArea.addEventListener('pointercancel', (e) => {
    if (activePointerId && e && e.pointerId === activePointerId) {
      try { swipeArea.releasePointerCapture && swipeArea.releasePointerCapture(activePointerId); } catch (err) {}
    }
    resetTouch(); setGrabbing(false);
  }, { passive: true });

  swipeArea.addEventListener('touchstart', (e) => {
    if (typeof isModalOpen === 'function' && isModalOpen()) return;
    if (!e.touches || !e.touches[0]) return;
    const t = e.touches[0];
    startX = t.clientX; startY = t.clientY;
    isDown = true; maybeSwiping = false; isSwiping = false; didSwipe = false;
  }, { passive: true });

  swipeArea.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    const t = (e.touches && e.touches[0]) || null;
    if (!t) return;
    const dx = t.clientX - startX, dy = t.clientY - startY;
    decideIfSwiping(dx, dy);
    if (maybeSwiping && isSwiping) {
      if (e.cancelable) try { e.preventDefault(); } catch (_) {}
    }
  }, { passive: false });

  swipeArea.addEventListener('touchend', (e) => {
    if (!isDown) return;
    isDown = false;
    const t = (e.changedTouches && e.changedTouches[0]) || null;
    if (!t) { resetTouch(); return; }
    const dx = t.clientX - startX, dy = t.clientY - startY;
    const swiped = (maybeSwiping && isSwiping && Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dy) < MAX_VERTICAL_DELTA);
    if (swiped) {
      if (dx < 0) showImage(currentIndex + 1); else showImage(currentIndex - 1);
      didSwipe = true;
      setTimeout(() => { didSwipe = false; }, 350);
    }
    resetTouch();
  }, { passive: true });

  window.addEventListener('keydown', (e) => {
    if (typeof isModalOpen === 'function' && isModalOpen()) return;
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
  });


  if (topBtn) {
    topBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (switching) return;
      if (currentIndex <= 0) return; 
      showImage(currentIndex - 1);
    });
  }

  if (bottomBtn) {
    bottomBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (switching) return;
      if (currentIndex >= thumbnails.length - 1) return; 
      showImage(currentIndex + 1);
    });
  }

  function updateButtonsVisibility() {
    if (!topBtn || !bottomBtn) return;
    const totalBtnsHeight = (topBtn?.offsetHeight || 0) + (bottomBtn?.offsetHeight || 0);
    const needScroll = thumbnailsContainer.scrollHeight > thumbnailsContainer.clientHeight + totalBtnsHeight - 2;

    topBtn.style.display = needScroll ? 'block' : 'none';
    bottomBtn.style.display = needScroll ? 'block' : 'none';
    if (progressContainer) { progressContainer.style.display = needScroll ? 'flex' : 'none'; }

    updateArrowsState();
  }
  
  thumbnailsContainer.addEventListener('scroll', updateButtonsVisibility, { passive: true });
  window.addEventListener('resize', updateButtonsVisibility);
  updateButtonsVisibility();

  // Модальное окно для просмотра товаров
  (function () {
    const VISIBLE_THUMBS = 7;
    let modal = null;
    let modalIndex = currentIndex || 0;
    let modalSwitching = false;

    function ensureModelViewerScript() {
      if (window.customElements && window.customElements.get && window.customElements.get('model-viewer')) {
        return Promise.resolve();
      }
      if (window._modelViewerPromise) return window._modelViewerPromise;
      const existing = Array.from(document.querySelectorAll('script[type="module"]'))
        .find(s => {
          const src = s.getAttribute('src') || '';
          return src.includes('model-viewer') || src.includes('@google/model-viewer');
        });
      if (existing) {
        window._modelViewerPromise = new Promise((resolve, reject) => {
          if (existing.__modelViewerLoaded) {
            if (window.customElements && customElements.whenDefined) {
              customElements.whenDefined('model-viewer').then(resolve).catch(reject);
            } else setTimeout(resolve, 50);
            return;
          }
          existing.addEventListener('load', () => {
            existing.__modelViewerLoaded = true;
            if (window.customElements && customElements.whenDefined) customElements.whenDefined('model-viewer').then(resolve).catch(reject);
            else resolve();
          });
          existing.addEventListener('error', reject);
        });
        return window._modelViewerPromise;
      }
      window._modelViewerPromise = new Promise((resolve, reject) => {
        try {
          const script = document.createElement('script');
          script.type = 'module';
          script.src = 'js/libs/model-viewer.min.js';
          script.addEventListener('load', () => {
            if (window.customElements && customElements.whenDefined) customElements.whenDefined('model-viewer').then(resolve).catch(reject);
            else resolve();
          });
          script.addEventListener('error', reject);
          document.head.appendChild(script);
        } catch (err) { reject(err); }
      });
      return window._modelViewerPromise;
    }

    function createModal() {
      if (modal) return modal;
      modal = document.querySelector('.product-gallery-modal');
      if (!modal) return null;

      const closeBtn = modal.querySelector('.modal-close');
      const leftBtn = modal.querySelector('.modal-nav.left');
      const rightBtn = modal.querySelector('.modal-nav.right');
      const modalMediaWrap = modal.querySelector('.modal-media');
      const thumbsEl = modal.querySelector('.modal-thumbs');
      const thumbsPrev = modal.querySelector('.thumbs-nav.left');
      const thumbsNext = modal.querySelector('.thumbs-nav.right');

      (function setupModalSwipe() {
        if (!modalMediaWrap) return;

        const HORIZONTAL_DETECT_THRESHOLD = 8;
        const SWIPE_THRESHOLD = 40;
        const MAX_VERTICAL_DELTA = 120;

        let startX = 0, startY = 0;
        let isDown = false;
        let maybeSwiping = false;
        let isSwiping = false;
        let activePointerId = null;

        function decideIfSwiping(dx, dy) {
          if (maybeSwiping) return;
          if (Math.abs(dx) > HORIZONTAL_DETECT_THRESHOLD || Math.abs(dy) > HORIZONTAL_DETECT_THRESHOLD) {
            maybeSwiping = true;
            isSwiping = Math.abs(dx) > Math.abs(dy);
          }
        }

        function reset() {
          isDown = false; maybeSwiping = false; isSwiping = false; activePointerId = null;
        }

        modalMediaWrap.addEventListener('pointerdown', (e) => {
          if (!modal.classList.contains('open')) return;
          if (e.button !== undefined && e.button !== 0) return; 
          if (modalSwitching) return;

          activePointerId = e.pointerId;
          isDown = true;
          maybeSwiping = false;
          isSwiping = false;
          startX = e.clientX;
          startY = e.clientY;

          try { e.preventDefault(); } catch (err) {}

          try { modalMediaWrap.setPointerCapture && modalMediaWrap.setPointerCapture(activePointerId); } catch (_) {}
        }, { passive: false });

        modalMediaWrap.addEventListener('pointermove', (e) => {
          if (!isDown || e.pointerId !== activePointerId) return;
          const dx = e.clientX - startX, dy = e.clientY - startY;
          decideIfSwiping(dx, dy);
          if (maybeSwiping && isSwiping && e.cancelable) {
            try { e.preventDefault(); } catch (_) {}
          }
        }, { passive: false });

        modalMediaWrap.addEventListener('pointerup', (e) => {
          if (!isDown || e.pointerId !== activePointerId) { reset(); return; }
          const dx = e.clientX - startX, dy = e.clientY - startY;
          const swiped = (maybeSwiping && isSwiping && Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dy) < MAX_VERTICAL_DELTA);
          if (swiped) {
            if (!modalSwitching) {
              if (dx < 0) modalShowImage(modalIndex + 1);
              else modalShowImage(modalIndex - 1);
            }
          }
          try { modalMediaWrap.releasePointerCapture && modalMediaWrap.releasePointerCapture(activePointerId); } catch (_) {}
          reset();
        }, { passive: true });

        modalMediaWrap.addEventListener('pointercancel', () => { reset(); }, { passive: true });

        modalMediaWrap.addEventListener('touchstart', (e) => {
          if (!modal.classList.contains('open')) return;
          if (!e.touches || !e.touches[0]) return;
          if (modalSwitching) return;
          startX = e.touches[0].clientX; startY = e.touches[0].clientY;
          isDown = true; maybeSwiping = false; isSwiping = false;
        }, { passive: true });

        modalMediaWrap.addEventListener('touchmove', (e) => {
          if (!isDown) return;
          const t = e.touches && e.touches[0]; if (!t) return;
          const dx = t.clientX - startX, dy = t.clientY - startY;
          decideIfSwiping(dx, dy);
          if (maybeSwiping && isSwiping && e.cancelable) {
            try { e.preventDefault(); } catch (_) {}
          }
        }, { passive: false });

        modalMediaWrap.addEventListener('touchend', (e) => {
          if (!isDown) return;
          isDown = false;
          const t = e.changedTouches && e.changedTouches[0]; if (!t) return;
          const dx = t.clientX - startX, dy = t.clientY - startY;
          const swiped = (maybeSwiping && isSwiping && Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dy) < MAX_VERTICAL_DELTA);
          if (swiped) {
            if (!modalSwitching) {
              if (dx < 0) modalShowImage(modalIndex + 1);
              else modalShowImage(modalIndex - 1);
            }
          }
          reset();
        }, { passive: true });
      })();

      function rebuildThumbs() {
        thumbsEl.innerHTML = '';
        thumbnails.forEach((t, i) => {
          const el = document.createElement('img');
          el.src = getItemThumbSrc(t);
          el.dataset.idx = i;
          el.alt = t.alt || '';
          el.addEventListener('click', (ev) => { ev.stopPropagation(); modalShowImage(i); });
          thumbsEl.appendChild(el);
        });
        updateThumbsActive();
        updateThumbsNavVisibility();
      }

      function renderModalMediaForIndex(idx) {
        const item = thumbnails[idx];
        if (!item) {
          modalMediaWrap.innerHTML = '<img class="modal-img" src="" alt="Фото товара">';
          return;
        }
        if (is3DItem(item)) {
          const modelPath = getItemModelPath(item) || '';
          const poster = getItemThumbSrc(item) || 'images/3D.svg';
          modalMediaWrap.innerHTML = '';
          const mv = document.createElement('model-viewer');
          mv.tabIndex = 0;
          if (modelPath) mv.setAttribute('src', encodeURI(modelPath));
          mv.setAttribute('alt', '3D модель');
          mv.setAttribute('camera-controls', '');
          mv.setAttribute('interaction-prompt', 'auto');
          mv.style.maxWidth = '92vw';
          mv.style.maxHeight = 'calc(100vh - 160px)';
          mv.style.aspectRatio = '16/9';
          mv.style.display = 'block';
          modalMediaWrap.appendChild(mv);

          ensureModelViewerScript().catch(() => {
            modalMediaWrap.innerHTML = `<img class="modal-img" src="${poster}" alt="3D (заглушка)">`;
          });
        } else {
          const src = getItemLargeSrc(item) || '';
          modalMediaWrap.innerHTML = `<img class="modal-img fading" src="${src}" alt="${item.alt || 'Фото'}">`;
          setTimeout(() => {
            const img = modalMediaWrap.querySelector('.modal-img');
            if (img) img.classList.remove('fading');
          }, 80);
        }
      }

      function modalShowImage(idx) {
        if (modalSwitching) return;

        const total = thumbnails.length;
        if (!total) return;

        if (typeof idx !== 'number' || idx < 0 || idx >= total) return;

        modalSwitching = true;
        modalIndex = idx;

        const currentMedia = modalMediaWrap.firstElementChild;
        if (currentMedia && currentMedia.classList) currentMedia.classList.add('fading');

        setTimeout(() => {
          renderModalMediaForIndex(idx);
          updateThumbsActive();
          try {
            thumbsEl.children[idx] && thumbsEl.children[idx].scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
          } catch (e) {}

          setTimeout(() => {
            modalSwitching = false;
            updateThumbsNavVisibility();
          }, 160);
        }, 140);
      }

      function updateThumbsActive() {
        Array.from(thumbsEl.querySelectorAll('img')).forEach((im, j) => {
          im.classList.toggle('active', j === modalIndex);
        });
      }

      function safeScrollBy(dx) {
        const max = thumbsEl.scrollWidth - thumbsEl.clientWidth;
        let t = Math.round(thumbsEl.scrollLeft + dx);
        t = Math.max(0, Math.min(max, t));
        thumbsEl.scrollTo({ left: t, behavior: 'smooth' });
        setTimeout(updateThumbsNavVisibility, 260);
      }

      thumbsPrev && thumbsPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        if (modalSwitching) return;
        if (modalIndex > 0) modalShowImage(modalIndex - 1);
      });
      thumbsNext && thumbsNext.addEventListener('click', (e) => {
        e.stopPropagation();
        if (modalSwitching) return;
        const total = thumbnails.length;
        if (modalIndex < total - 1) modalShowImage(modalIndex + 1);
      });

      leftBtn && leftBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (modalIndex > 0) modalShowImage(modalIndex - 1);
      });
      rightBtn && rightBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const total = thumbnails.length;
        if (modalIndex < total - 1) modalShowImage(modalIndex + 1);
      });

      function closeHandler() { closeModal(); }
      closeBtn && closeBtn.addEventListener('click', closeHandler);
      modal.addEventListener('click', (e) => { if (e.target === modal) closeHandler(); });

      function onKey(e) {
        if (!modal.classList.contains('open')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') modalShowImage(modalIndex - 1);
        if (e.key === 'ArrowRight') modalShowImage(modalIndex + 1);
      }
      window.addEventListener('keydown', onKey);

      function updateThumbsNavVisibility() {
        const total = thumbnails.length;
        if (!thumbsEl) return;

        const EPS = 2; 

        const scrollLeft = thumbsEl.scrollLeft || 0;
        const clientW = thumbsEl.clientWidth || 0;
        const scrollW = thumbsEl.scrollWidth || 0;
        const hasOverflow = (scrollW > clientW + EPS);

        if (!hasOverflow || total <= VISIBLE_THUMBS) {
          thumbsPrev && (thumbsPrev.style.display = 'none');
          thumbsNext && (thumbsNext.style.display = 'none');
        } else {
          thumbsPrev && (thumbsPrev.style.display = '');
          thumbsNext && (thumbsNext.style.display = '');
        }

        const atModalStart = (modalIndex === 0);
        const atModalEnd = (modalIndex === Math.max(0, total - 1));

        const prevDisabledForThumbs = hasOverflow ? atModalStart : false;
        const nextDisabledForThumbs = hasOverflow ? atModalEnd : false;

        const prevDisabledForModal = atModalStart;
        const nextDisabledForModal = atModalEnd;

        thumbsPrev && thumbsPrev.classList.toggle('inactive', prevDisabledForThumbs);
        thumbsNext && thumbsNext.classList.toggle('inactive', nextDisabledForThumbs);

        leftBtn && leftBtn.classList.toggle('inactive', prevDisabledForModal);
        rightBtn && rightBtn.classList.toggle('inactive', nextDisabledForModal);

        if (thumbsPrev) thumbsPrev.setAttribute('aria-disabled', prevDisabledForThumbs ? 'true' : 'false');
        if (thumbsNext) thumbsNext.setAttribute('aria-disabled', nextDisabledForThumbs ? 'true' : 'false');
        if (leftBtn) leftBtn.setAttribute('aria-disabled', prevDisabledForModal ? 'true' : 'false');
        if (rightBtn) rightBtn.setAttribute('aria-disabled', nextDisabledForModal ? 'true' : 'false');
      }

      thumbsEl && thumbsEl.addEventListener('scroll', updateThumbsNavVisibility, { passive: true });
      window.addEventListener('resize', updateThumbsNavVisibility);

      modal._modalShowImage = modalShowImage;
      modal._rebuildThumbs = rebuildThumbs;
      return modal;
    }

    function openModal(idx) {
      const total = thumbnails.length;
      if (total === 0) return;
      modalIndex = (typeof idx === 'number' ? idx : currentIndex) || 0;
      const m = createModal();
      if (!m) return;
      m.classList.add('open');
      lockBodyScrollCompensated();
      m._rebuildThumbs && m._rebuildThumbs();
      m._modalShowImage && m._modalShowImage(modalIndex);
      setTimeout(() => {
        try { m.querySelector('.modal-thumbs').dispatchEvent(new Event('scroll')); } catch (e) {}
      }, 120);
    }

    function closeModal() {
      const m = document.querySelector('.product-gallery-modal');
      if (!m) return;
      m.classList.remove('open');
      unlockBodyScrollCompensated();
    }

    let bodyLocked = false;
    let bodyScrollY = 0;
    function lockBodyScrollCompensated() {
      if (bodyLocked) return;
      bodyScrollY = window.scrollY || window.pageYOffset || 0;
      const scrollbarComp = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.position = 'fixed';
      document.body.style.top = -bodyScrollY + 'px';
      if (scrollbarComp > 0) document.body.style.paddingRight = scrollbarComp + 'px';
      bodyLocked = true;
    }
    function unlockBodyScrollCompensated() {
      if (!bodyLocked) return;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.paddingRight = '';
      window.scrollTo(0, bodyScrollY);
      bodyScrollY = 0;
      bodyLocked = false;
    }

    if (mainImgContainer) {
      mainImgContainer.style.cursor = 'pointer';
      mainImgContainer.addEventListener('click', (e) => {
        try {
          const clickedOpen3D = !!(
            e.target && (
              (e.target.closest && e.target.closest('.open-3d-model'))
              || (e.target.closest && e.target.closest('.banner-3D'))
              || (e.target.closest && e.target.closest('.view-3D'))
            )
          );
          if (clickedOpen3D) return;
        } catch (err) {}

        if (didSwipe) {
          didSwipe = false;
          return;
        }

        openModal(currentIndex);
      });
    }

    window.__productGalleryModal = { open: openModal, close: closeModal };
  })();
})();



// Печать PDF файла
function openAndPrintPdf(url) {
  const win = window.open(url, '_blank');
  if (!win) {
    alert('Блокировщик всплывающих окон мешает открытию PDF. Разрешите всплывающие окна.');
    return;
  }
  win.onload = function() {
    try { win.print(); }
    catch(e) {  }
  };
}