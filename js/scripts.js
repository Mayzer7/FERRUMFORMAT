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

  let lastScrollY = window.scrollY || window.pageYOffset;
  let ticking = false;
  const tolerance = 12;
  const offsetToHide = 60;
  const offsetToOpaque = 20;

  function setOpaque(forceOpaque = null, currentY = window.scrollY || window.pageYOffset) {
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
