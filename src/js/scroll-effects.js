import { gsap, ScrollTrigger, SmoothScroll } from './vendor.js';

export function initScrollEffects() {
  const wrapper = document.querySelector('.wrapper');
  if (!wrapper) return;
  const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent);
  if (!mobile && !document.querySelector('.inner-project__body, .projects-page')) {
    new SmoothScroll({ target: wrapper, scrollEase: 0.1, maxOffset: 500 });
    document.body.classList.add('smooth-off');
    document.querySelector('.viewport')?.classList.add('smooth-off');
  }

  document.querySelectorAll('.section-trigger').forEach(element => {
    gsap.fromTo(element, { opacity: 0, y: 100 }, {
      opacity: 1, y: 0,
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'top 25%',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  });

  const projects = document.querySelectorAll('.projects-page__item');
  if (projects.length > 1) projects.forEach(element => {
    ScrollTrigger.create({
      trigger: element,
      start: () => element.getBoundingClientRect().top + window.scrollY - element.offsetHeight,
      end: 'top top', scrub: true,
      toggleClass: { targets: element, className: 'projects-page__item--active' },
    });
  });

  const header = document.querySelector('.header');
  if (header) {
    const updateHeader = () => header.classList.toggle('header--fixed', window.scrollY > 0);
    updateHeader();
    window.addEventListener('pageshow', updateHeader);
    window.addEventListener('scroll', updateHeader, { passive: true });
  }
  ScrollTrigger.refresh();
}
