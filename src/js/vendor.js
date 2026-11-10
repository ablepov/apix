import Swiper from 'swiper';
import { A11y, Autoplay, Navigation } from 'swiper/modules';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

Swiper.use([A11y, Autoplay, Navigation]);
Swiper.extendDefaults({ navigation: { addIcons: false } });
gsap.registerPlugin(ScrollTrigger);

export { Swiper, gsap, ScrollTrigger };
export { default as LocomotiveScroll } from 'locomotive-scroll';
export { default as Marquee } from 'marquee3000';
export { SmoothScroll } from '../../shared/js/smooth-scroll.js';
