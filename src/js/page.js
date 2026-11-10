import { initSliders } from './sliders.js';
import { initScrollEffects } from './scroll-effects.js';
import { initProjectMotion } from './project-motion.js';
import { initPageDetails } from './page-details.js';

initSliders();
initScrollEffects();
initPageDetails();

// The horizontal project view and marquees measure the dimensions of images.
if (document.readyState === 'complete') initProjectMotion();
else window.addEventListener('load', initProjectMotion, { once: true });
