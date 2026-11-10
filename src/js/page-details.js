function initServicePreview() {
  const links = [...document.querySelectorAll('.services__link')];
  const panels = [...document.querySelectorAll('.services-info__item')];
  links.forEach((link, index) => {
    function activate() {
      if (!panels[index]) return;
      links.forEach(item => item.classList.toggle('services__link--active', item === link));
      panels.forEach((panel, panelIndex) => {
        panel.classList.toggle('services-info__item--active', panelIndex === index);
      });
    }
    link.addEventListener('mouseenter', activate);
    link.addEventListener('focus', activate);
  });
}

function initPointerEffects() {
  const image = document.querySelector('.main-hero__image-box');
  const area = document.querySelector('.main-hero__aria');
  if (image && area) document.addEventListener('mousemove', event => {
    const rect = image.getBoundingClientRect();
    const top = event.clientY - rect.top;
    const left = event.clientX - rect.left - image.offsetWidth / 4;
    if (top < 0 || top > image.offsetHeight - 10 || left < 0 || left > image.offsetWidth) return;
    area.style.left = `${left}px`;
    area.style.backgroundPosition = `${-left}px ${window.innerWidth > 768 ? 'center' : 'top'}`;
  });
  const orange = document.querySelector('.about-hero__img--orange');
  const white = document.querySelector('.about-hero__img--white');
  if (orange && white) window.addEventListener('mousemove', event => {
    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;
    orange.style.transform = `translate(${-50 * x}px, ${-50 * y}px)`;
    white.style.transform = `translate(${-100 * x}px, ${-150 * y}px)`;
  });
}

export function initPageDetails() {
  const webp = new Image();
  webp.onload = webp.onerror = () => document.documentElement.classList.add(webp.height === 2 ? 'webp' : 'no-webp');
  webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';

  const images = [...document.querySelectorAll('.footer__img')];
  const selected = images[Math.floor(Math.random() * images.length)];
  if (selected) {
    selected.classList.add('footer__img--active');
    if (selected.dataset.color) document.querySelector('.footer')?.classList.add(selected.dataset.color);
  }
  initServicePreview();
  initPointerEffects();
}
