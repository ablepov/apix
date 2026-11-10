import scrollLock from 'scroll-lock';

export function initNavigation() {
  const header = document.querySelector('.header');
  const button = document.querySelector('.burger');
  const menu = document.querySelector('.menu');
  if (!header || !button || !menu) return;

  menu.id ||= 'mobile-menu';
  button.setAttribute('aria-controls', menu.id);
  const label = button.querySelector('.sr-only');

  let open = false;
  function setOpen(value, restoreFocus = false) {
    const wasOpen = open;
    open = value;
    header.classList.toggle('header--open-menu', open);
    button.classList.toggle('burger--active', open);
    menu.classList.toggle('menu--open', open);
    button.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    menu.inert = !open;
    if (label) label.textContent = open ? 'Закрыть меню' : 'Открыть меню';
    if (open) {
      scrollLock.disablePageScroll(menu);
    } else {
      if (wasOpen) scrollLock.enablePageScroll(menu);
      if (restoreFocus) button.focus();
    }
  }
  setOpen(false);
  button.addEventListener('click', () => setOpen(!open));
  menu.addEventListener('click', event => {
    if (event.target.closest('a[href]')) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (!open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false, true);
    }
    if (event.key !== 'Tab') return;
    const focusable = [button, ...menu.querySelectorAll('a[href], button, input, select, textarea, [tabindex="0"]')]
      .filter(element => element.getClientRects().length && !element.disabled);
    if (!focusable.length) return;
    event.preventDefault();
    const index = focusable.indexOf(document.activeElement);
    const next = (index + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
    focusable[next].focus();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992 && open) setOpen(false);
  });
}
