import { Swiper } from './vendor.js';

const sliders = {
  'project-carousel': { slidesPerView: 1.8, spaceBetween: 15, breakpoints: {
    768: { slidesPerView: 3 }, 992: { slidesPerView: 4, spaceBetween: 20 }, 1300: { slidesPerView: 5 },
  } },
  team: { slidesPerView: 1.4, spaceBetween: 15, breakpoints: {
    768: { slidesPerView: 2 }, 992: { slidesPerView: 3, spaceBetween: 19 },
  } },
  partners: { slidesPerView: 1.8, spaceBetween: 30, breakpoints: {
    768: { slidesPerView: 3 }, 992: { slidesPerView: 4, spaceBetween: 80 },
  } },
  awards: { slidesPerView: 1.8, spaceBetween: 15, breakpoints: {
    768: { slidesPerView: 3 }, 992: { slidesPerView: 5, spaceBetween: 20 },
  } },
};

function ensureLoopCapacity(element, options) {
  const wrapper = element.querySelector('.swiper-wrapper');
  if (!wrapper) return;
  const originals = [...wrapper.children].filter(slide => slide.classList.contains('swiper-slide'));
  const maximumVisible = Math.ceil(Math.max(options.slidesPerView,
    ...Object.values(options.breakpoints).map(breakpoint => breakpoint.slidesPerView)));
  // Swiper 12 rearranges existing slides and needs at least one offscreen card.
  // Repeat the complete sequence so the boundary preserves the original order.
  if (!originals.length || originals.length >= maximumVisible + 1) return;
  while (wrapper.children.length < maximumVisible + 1) {
    originals.forEach(slide => {
      const copy = slide.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      copy.removeAttribute('id');
      copy.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
      // Copies remain clickable when visible; originals supply keyboard stops.
      copy.querySelectorAll('a[href], button, input, select, textarea, [tabindex]')
        .forEach(element => element.setAttribute('tabindex', '-1'));
      wrapper.append(copy);
    });
  }
}

export function initSliders() {
  for (const [name, options] of Object.entries(sliders)) {
    document.querySelectorAll(`.${name}__slider`).forEach(element => {
      ensureLoopCapacity(element, options);
      new Swiper(element, {
        ...options,
        loop: true,
        autoplay: { delay: 5000 },
        navigation: { nextEl: `.${name}__btn--next`, prevEl: `.${name}__btn--prev`, addIcons: false },
      });
    });
  }
}
