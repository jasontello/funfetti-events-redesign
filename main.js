const root = document.documentElement;
const siteIntro = document.querySelector('.site-intro');
const siteIntroVideo = document.querySelector('.site-intro-video');
const siteContent = document.querySelector('.site-content');
const introSkip = document.querySelector('.intro-skip');
const heroTitle = document.querySelector('#hero-title');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktopIntro = window.matchMedia('(min-width: 761px)');
const introStorageKey = 'funfetti-intro-seen-v2';
let introTimer;
let introTransitionTimer;

const introIsActive = () => root.classList.contains('intro-pending') || root.classList.contains('intro-finishing');

const markIntroSeen = () => {
  try {
    sessionStorage.setItem(introStorageKey, 'true');
  } catch (_) {}
};

const finishIntro = ({ focusHero = false, immediate = false } = {}) => {
  if (!introIsActive()) return;

  clearTimeout(introTimer);
  clearTimeout(introTransitionTimer);
  markIntroSeen();
  siteIntroVideo.pause();

  const revealPage = () => {
    root.classList.remove('intro-pending', 'intro-finishing');
    siteContent.inert = false;
    siteIntro.setAttribute('aria-hidden', 'true');

    if (focusHero) {
      heroTitle.focus({ preventScroll: true });
    }
  };

  if (immediate) {
    revealPage();
    return;
  }

  root.classList.remove('intro-pending');
  root.classList.add('intro-finishing');
  introTransitionTimer = window.setTimeout(revealPage, 650);
};

if (root.classList.contains('intro-pending')) {
  siteContent.inert = true;
  siteIntro.removeAttribute('aria-hidden');

  if (desktopIntro.matches) {
    siteIntroVideo.currentTime = 0;
    siteIntroVideo.play().catch(() => {});
  }

  introTimer = window.setTimeout(() => finishIntro(), 4000);
} else {
  siteIntro.setAttribute('aria-hidden', 'true');
  siteIntroVideo.pause();
}

introSkip.addEventListener('click', () => finishIntro({ focusHero: true }));

reducedMotion.addEventListener('change', (event) => {
  if (event.matches) finishIntro({ immediate: true });
});

desktopIntro.addEventListener('change', (event) => {
  if (!introIsActive()) return;
  if (event.matches) {
    siteIntroVideo.play().catch(() => {});
  } else {
    siteIntroVideo.pause();
  }
});

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
const dropdown = document.querySelector('.nav-dropdown');
const dropdownButton = document.querySelector('.nav-dropdown-toggle');

const closeDropdown = () => {
  dropdown.classList.remove('open');
  dropdownButton.setAttribute('aria-expanded', 'false');
};

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navigation.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    closeDropdown();
  }
});

dropdownButton.addEventListener('click', (event) => {
  event.stopPropagation();
  const isOpen = dropdown.classList.toggle('open');
  dropdownButton.setAttribute('aria-expanded', String(isOpen));
});

document.addEventListener('click', (event) => {
  if (!dropdown.contains(event.target)) closeDropdown();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (introIsActive()) {
      finishIntro({ focusHero: true });
      return;
    }
    closeDropdown();
    dropdownButton.focus();
  }
});

const cookieBanner = document.querySelector('.cookie-banner');
const cookieButton = document.querySelector('.cookie-accept');

if (localStorage.getItem('funfetti-cookie-notice') === 'accepted') {
  cookieBanner.hidden = true;
}

cookieButton.addEventListener('click', () => {
  localStorage.setItem('funfetti-cookie-notice', 'accepted');
  cookieBanner.hidden = true;
});

const galleryButtons = [...document.querySelectorAll('.gallery-open')];
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrevious = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
let activeGalleryIndex = 0;

const showGalleryImage = (index) => {
  activeGalleryIndex = (index + galleryButtons.length) % galleryButtons.length;
  const sourceImage = galleryButtons[activeGalleryIndex].querySelector('img');
  lightboxImage.src = sourceImage.src;
  lightboxImage.alt = sourceImage.alt;
  lightboxCaption.textContent = sourceImage.alt;
};

galleryButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    showGalleryImage(index);
    lightbox.showModal();
  });
});

lightboxClose.addEventListener('click', () => lightbox.close());
lightboxPrevious.addEventListener('click', () => showGalleryImage(activeGalleryIndex - 1));
lightboxNext.addEventListener('click', () => showGalleryImage(activeGalleryIndex + 1));

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});

document.addEventListener('keydown', (event) => {
  if (!lightbox.open) return;
  if (event.key === 'ArrowLeft') showGalleryImage(activeGalleryIndex - 1);
  if (event.key === 'ArrowRight') showGalleryImage(activeGalleryIndex + 1);
});
