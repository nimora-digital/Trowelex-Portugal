const toggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
if (toggle && mobileNav) {
  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', document.documentElement.lang === 'en' ? 'Open menu' : 'Abrir menu');
    mobileNav.hidden = true;
    document.body.classList.remove('menu-open');
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? (document.documentElement.lang === 'en' ? 'Close menu' : 'Fechar menu') : (document.documentElement.lang === 'en' ? 'Open menu' : 'Abrir menu'));
    mobileNav.hidden = !open;
    document.body.classList.toggle('menu-open', open);
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 880) closeMenu(); });
}

document.querySelectorAll('.enquiry-form').forEach(form => {
  const input = form.querySelector('input[type="file"]');
  const status = form.querySelector('.form-status');
  form.addEventListener('submit', event => {
    const file = input?.files?.[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type) || file.size > 7 * 1024 * 1024) {
      event.preventDefault();
      status.textContent = document.documentElement.lang === 'en'
        ? 'Please choose a JPG, PNG or WebP image smaller than 7 MB.'
        : 'Escolha uma imagem JPG, PNG ou WebP com menos de 7 MB.';
      input.focus();
    }
  });
  input?.addEventListener('change', () => { status.textContent = ''; });
});
