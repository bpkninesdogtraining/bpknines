import gsap from 'gsap';

gsap.config({
  nullTargetWarn: false,
  trialWarn: false,
});

gsap.defaults({
  ease: 'power2.out',
});

export default gsap;
