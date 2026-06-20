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
