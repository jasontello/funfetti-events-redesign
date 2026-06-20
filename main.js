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
