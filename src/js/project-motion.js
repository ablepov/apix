import { LocomotiveScroll, Marquee } from './vendor.js';

function initHorizontalProject() {
  const container = document.querySelector('.inner-project__body[data-scroll-container]');
  if (!container) return;
  document.body.classList.add('horizontal-scroll');
  const links = document.querySelector('.project-links');
  const progress = document.querySelector('.inner-project__progress');
  const desktop = window.matchMedia('(min-width: 1024.01px)');
  const managedElements = [container, ...container.querySelectorAll('[data-scroll-section], [data-scroll]')];
  const initialState = managedElements.map(element => ({
    element,
    style: element.getAttribute('style'),
    sectionId: element.getAttribute('data-scroll-section-id'),
    sectionInView: element.getAttribute('data-scroll-section-inview'),
    classes: ['is-inview', element.dataset.scrollClass].filter(Boolean)
      .map(name => [name, element.classList.contains(name)]),
  }));
  const initialDirection = document.documentElement.getAttribute('data-scroll-direction');
  function restoreAttribute(element, name, value) {
    if (value === null) element.removeAttribute(name);
    else element.setAttribute(name, value);
  }
  function restoreLayout() {
    // Locomotive destroy removes listeners, but leaves transforms and direction
    // attributes behind. Native mobile layout must start from the source state.
    initialState.forEach(({ element, style, sectionId, sectionInView, classes }) => {
      restoreAttribute(element, 'style', style);
      restoreAttribute(element, 'data-scroll-section-id', sectionId);
      restoreAttribute(element, 'data-scroll-section-inview', sectionInView);
      classes.forEach(([name, present]) => element.classList.toggle(name, present));
    });
    restoreAttribute(document.documentElement, 'data-scroll-direction', initialDirection);
  }
  let scroll;
  let buildFrame;
  function createScroll() {
    scroll?.destroy();
    scroll = null;
    cancelAnimationFrame(buildFrame);
    // The old instance can already have a resize RAF queued when destroyed.
    // Let it finish before restoring source styles and initializing the new mode.
    buildFrame = requestAnimationFrame(() => {
      buildFrame = requestAnimationFrame(() => {
        restoreLayout();
        scroll = new LocomotiveScroll({
          el: container, smooth: desktop.matches, multiplier: 1.5, touchMultiplier: 1.5,
          lerp: 0.04, getSpeed: true, direction: desktop.matches ? 'horizontal' : 'vertical',
          smartphone: { smooth: false }, tablet: { smooth: false },
          reloadOnContextChange: false,
        });
        scroll.on('scroll', updateProgress);
        scroll.update();
      });
    });
  }
  function updateProgress({ limit, scroll: position }) {
    // Locomotive uses vertical native scrolling in its phone/tablet context.
    const axis = desktop.matches && limit.x > 0 ? 'x' : 'y';
    const distance = limit[axis];
    const current = position[axis];
    const percent = distance > 0 ? Math.max(0, Math.min(100, current / distance * 100)) : 0;
    if (progress) progress.style.width = `${percent}%`;
    links?.classList.toggle('project-links--active', current >= distance - 100);
  }
  createScroll();
  desktop.addEventListener('change', createScroll);
  let resizeFrame;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => scroll?.update());
  });
}

function initProjectMarquees() {
  const lists = [...document.querySelectorAll('.projects__list')];
  if (!lists.length) return;
  function measure() {
    document.querySelectorAll('.projects__list').forEach(list => {
      const gap = window.innerWidth > 768 ? 18 : 5.5;
      const width = [...list.querySelectorAll('.projects__img')]
        .reduce((total, image) => total + image.offsetWidth + gap, 0);
      list.style.width = `${width}px`;
    });
  }
  measure();
  const originals = new Set(lists.map(list => list.closest('.projects__slider')));
  Marquee.init();
  function hideCopies() {
    document.querySelectorAll('.marquee3k__copy').forEach(copy => {
      if (originals.has(copy)) return;
      copy.setAttribute('aria-hidden', 'true');
      // Visible repeated cards still navigate on click; skip duplicate Tab stops.
      copy.querySelectorAll('a[href], button, input, select, textarea, [tabindex]')
        .forEach(element => element.setAttribute('tabindex', '-1'));
    });
  }
  hideCopies();
  document.querySelectorAll('.marquee3k').forEach((element, index) => {
    new MutationObserver(hideCopies).observe(element, { childList: true, subtree: true });
    element.addEventListener('focusin', () => Marquee.pause(index));
    element.addEventListener('focusout', event => {
      if (!element.contains(event.relatedTarget)) Marquee.play(index);
    });
  });
  let frame;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      measure();
      Marquee.refreshAll();
    });
  });
}

export function initProjectMotion() {
  initHorizontalProject();
  initProjectMarquees();
}
