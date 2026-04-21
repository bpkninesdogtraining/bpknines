import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

export const TITLE_REVEAL_EASE = 'titleRevealEase';

gsap.registerPlugin(CustomEase, ScrambleTextPlugin);

if (!gsap.parseEase(TITLE_REVEAL_EASE)) {
  CustomEase.create(TITLE_REVEAL_EASE, '0.22, 1, 0.36, 1');
}

export function prepareTitleWords(scope, selector = '.section-title') {
  if (!scope) {
    return { words: [], masks: [], revert: () => {} };
  }

  const titles = Array.from(scope.querySelectorAll(selector));
  const snapshots = [];
  const words = [];
  const masks = [];

  titles.forEach((title) => {
    const original = title.innerHTML;
    const text = title.textContent || '';
    const tokenized = text
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => `<span class="gsap-title-mask"><span class="gsap-title-word" data-word="${word}">${word}</span></span>`)
      .join(' ');

    snapshots.push({ title, original });
    title.innerHTML = tokenized;
    masks.push(...title.querySelectorAll('.gsap-title-mask'));
    words.push(...title.querySelectorAll('.gsap-title-word'));
  });

  const revert = () => {
    snapshots.forEach(({ title, original }) => {
      title.innerHTML = original;
    });
  };

  return { words, masks, revert };
}

export function addTitleScramble(timeline, words, position = '-=0.2') {
  if (!timeline || !words?.length) {
    return;
  }

  timeline.to(words, {
    duration: 0.5,
    stagger: 0.03,
    scrambleText: {
      text: (_, target) => target.dataset.word || target.textContent || '',
      chars: 'upperAndLowerCase',
      speed: 0.3,
      revealDelay: 0.02,
      tweenLength: false,
    },
    ease: 'none',
  }, position);
}
