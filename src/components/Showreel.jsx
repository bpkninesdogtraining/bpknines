import React, { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import gsap from 'gsap';
import { ExpoScaleEase } from 'gsap/EasePack';
import { Flip } from 'gsap/Flip';
import { CSSRulePlugin } from 'gsap/CSSRulePlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ExpoScaleEase, Flip, CSSRulePlugin, ScrollTrigger);

const photoLoaders = import.meta.glob('../assets/Photos/*.{jpg,jpeg,png,webp}', {
  import: 'default',
});
const SHOWREEL_SIZE = 5;
const AUTO_SLIDE_MS = 3200;
const SHOWREEL_STORIES = [
  {
    title: 'Calmer walks start here',
    meta: 'Daily handling',
    tag: 'Walks • Focus • Manners',
    description: 'Small improvements in timing and structure create more relaxed walks, better check-ins, and less pulling.',
  },
  {
    title: 'Training that carries home',
    meta: 'Owner handoff',
    tag: 'Family • Routine • Transfer',
    description: 'Every program is designed so owners can continue the same clear routine after the session ends.',
  },
  {
    title: 'Confidence built in real places',
    meta: 'Environmental proofing',
    tag: 'Calm • Public • Reliable',
    description: 'Dogs learn to stay responsive around movement, noise, distance, and the distractions of everyday life.',
  },
  {
    title: 'Clear structure, better choices',
    meta: 'Behavior reset',
    tag: 'Calm • Boundaries • Clarity',
    description: 'Dogs settle faster when expectations are simple, consistent, and reinforced the right way.',
  },
  {
    title: 'Progress you can actually feel',
    meta: 'Owner experience',
    tag: 'Routine • Trust • Results',
    description: 'Training is measured by calmer days at home, easier handling, and more confidence for the family.',
  },
];

function randomize(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const Showreel = () => {
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const dotsRef = useRef(null);
  const activeIndexRef = useRef(0);
  const autoPausedRef = useRef(false);
  const autoInViewRef = useRef(false);
  const previousIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showreelImages, setShowreelImages] = useState([]);
  const total = showreelImages.length;
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    let active = true;

    const loadRandomPhotos = async () => {
      const entries = Object.entries(photoLoaders);
      const selected = randomize(entries).slice(0, SHOWREEL_SIZE);
      const resolved = await Promise.all(
        selected.map(async ([path, load], index) => {
          const src = await load();
          const basename = path.split('/').pop()?.replace(/\.[^.]+$/, '') || `frame-${index + 1}`;
          const story = SHOWREEL_STORIES[index % SHOWREEL_STORIES.length];
          return {
            src,
            title: story.title,
            alt: basename.replace(/[-_]/g, ' '),
            meta: story.meta,
            tag: story.tag,
            description: story.description,
          };
        }),
      );

      if (active) {
        setShowreelImages(resolved);
        setActiveIndex(0);
      }
    };

    loadRandomPhotos();

    return () => {
      active = false;
    };
  }, []);

  const getWrappedIndex = useCallback((index) => {
    if (!total) {
      return 0;
    }
    return (index % total + total) % total;
  }, [total]);

  const scrollToIndex = useCallback((index, options = {}) => {
    const { wrap = false } = options;
    const viewport = carouselRef.current;
    if (!viewport) {
      return;
    }

    const target = wrap
      ? getWrappedIndex(index)
      : Math.max(0, Math.min(index, total - 1));
    const card = viewport.querySelector(`[data-slide-index="${target}"]`);
    if (!card) {
      return;
    }

    const targetLeft = card.offsetLeft - viewport.offsetLeft;
    if (reduceMotionRef.current) {
      viewport.scrollLeft = targetLeft;
    } else {
      gsap.to(viewport, {
        scrollLeft: targetLeft,
        duration: 0.48,
        ease: 'power3.inOut',
        overwrite: 'auto',
      });
    }
    setActiveIndex(target);
  }, [getWrappedIndex, total]);

  useEffect(() => {
    if (!total) {
      return undefined;
    }
    if (reduceMotionRef.current) {
      return undefined;
    }

    const viewport = carouselRef.current;
    if (!viewport) {
      return undefined;
    }

    const pause = () => {
      autoPausedRef.current = true;
    };
    const resume = () => {
      autoPausedRef.current = !autoInViewRef.current;
    };
    const onVisibilityChange = () => {
      autoPausedRef.current = document.hidden;
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    viewport.addEventListener('mouseenter', pause);
    viewport.addEventListener('mouseleave', resume);
    viewport.addEventListener('focusin', pause);
    viewport.addEventListener('focusout', resume);

    const inViewTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom-=120',
      end: 'bottom top+=120',
      onEnter: () => {
        autoInViewRef.current = true;
        autoPausedRef.current = false;
      },
      onEnterBack: () => {
        autoInViewRef.current = true;
        autoPausedRef.current = false;
      },
      onLeave: () => {
        autoInViewRef.current = false;
        autoPausedRef.current = true;
      },
      onLeaveBack: () => {
        autoInViewRef.current = false;
        autoPausedRef.current = true;
      },
    });

    const timer = window.setInterval(() => {
      if (autoPausedRef.current || !autoInViewRef.current) {
        return;
      }
      scrollToIndex(activeIndexRef.current + 1, { wrap: true });
    }, AUTO_SLIDE_MS);

    return () => {
      window.clearInterval(timer);
      inViewTrigger.kill();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      viewport.removeEventListener('mouseenter', pause);
      viewport.removeEventListener('mouseleave', resume);
      viewport.removeEventListener('focusin', pause);
      viewport.removeEventListener('focusout', resume);
    };
  }, [scrollToIndex, total]);

  useEffect(() => {
    if (!total) {
      return undefined;
    }

    const viewport = carouselRef.current;
    if (!viewport) {
      return undefined;
    }

    let rafId = null;

    const onScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        const cards = viewport.querySelectorAll('[data-slide-index]');
        let nearest = 0;
        let smallestDelta = Number.POSITIVE_INFINITY;
        const center = viewport.scrollLeft + viewport.clientWidth / 2;

        cards.forEach((card, idx) => {
          const cardCenter = card.offsetLeft + card.clientWidth / 2;
          const delta = Math.abs(cardCenter - center);
          if (delta < smallestDelta) {
            smallestDelta = delta;
            nearest = idx;
          }
        });

        setActiveIndex(nearest);
      });
    };

    viewport.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      viewport.removeEventListener('scroll', onScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [total]);

  useEffect(() => {
    if (!total) {
      return undefined;
    }
    const ctx = gsap.context(() => {
      const sheenRule = CSSRulePlugin.getRule('.showreel-carousel-slide::before');
      const revealTl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });
      revealTl.fromTo(
        '.showreel-screen-shell',
        { y: 28, autoAlpha: 0, scale: 0.98 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.78,
        },
      );
      revealTl.fromTo(
        '.showreel-heading',
        { y: 22, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.72,
          stagger: 0.08,
        },
        '-=0.4',
      );
      revealTl.fromTo(
        '.showreel-carousel-slide',
        { y: 20, autoAlpha: 0, scale: 0.985 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.64,
          stagger: 0.08,
        },
        '-=0.3',
      );
      if (sheenRule) {
        gsap.fromTo(
          sheenRule,
          { cssRule: { opacity: 0.07, xPercent: -16 } },
          {
            cssRule: { opacity: 0.16, xPercent: 14 },
            duration: 3.2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          },
        );
      }
      gsap.fromTo('.showreel-aura', {
        xPercent: -8,
        scale: 0.94,
        autoAlpha: 0.24,
      }, {
        xPercent: 8,
        scale: 1.04,
        autoAlpha: 0.54,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.9,
        },
      });
      const ambientTweens = [];
      ambientTweens.push(gsap.fromTo('.showreel-screen-grid', {
        backgroundPositionY: '0px',
      }, {
        backgroundPositionY: '120px',
        duration: 5.8,
        repeat: -1,
        ease: 'none',
      }));
      gsap.to('.showreel-screen-shell', {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => ambientTweens.forEach((t) => t.play()),
        onEnterBack: () => ambientTweens.forEach((t) => t.play()),
        onLeave: () => ambientTweens.forEach((t) => t.pause()),
        onLeaveBack: () => ambientTweens.forEach((t) => t.pause()),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [total]);

  useEffect(() => {
    if (!total) {
      return;
    }
    const viewport = carouselRef.current;
    if (!viewport) {
      return;
    }
    const cards = viewport.querySelectorAll('.showreel-carousel-slide');
    const previousIndex = previousIndexRef.current;
    cards.forEach((card, index) => {
      const isActive = index === activeIndex;
      gsap.to(card, {
        scale: isActive ? 1 : 0.97,
        autoAlpha: isActive ? 1 : 0.8,
        duration: 0.42,
        ease: 'power2.out',
      });
      const image = card.querySelector('.showreel-image');
      const background = card.querySelector('.showreel-image-bg');
      const meta = card.querySelector('.showreel-meta');
      const title = card.querySelector('.showreel-title');
      const tag = card.querySelector('.showreel-tag');
      const description = card.querySelector('.showreel-description');
      if (image) {
        gsap.to(image, {
          scale: isActive ? 1.04 : 1.01,
          duration: 0.58,
          ease: ExpoScaleEase.config(1, 1.04, 'power2.out'),
        });
      }
      if (background) {
        gsap.to(background, {
          scale: isActive ? 1.12 : 1.06,
          opacity: isActive ? 0.5 : 0.34,
          duration: 0.62,
          ease: 'power2.out',
        });
      }
      if (meta) {
        gsap.to(meta, {
          y: isActive ? 0 : 10,
          autoAlpha: isActive ? 1 : 0.55,
          duration: 0.42,
          ease: 'power2.out',
        });
      }
      if (title) {
        gsap.to(title, {
          y: isActive ? 0 : 12,
          autoAlpha: isActive ? 1 : 0.72,
          duration: 0.46,
          ease: 'power2.out',
        });
      }
      if (tag) {
        gsap.to(tag, {
          y: isActive ? 0 : 8,
          autoAlpha: isActive ? 1 : 0.68,
          duration: 0.42,
          ease: 'power2.out',
        });
      }
      if (description) {
        gsap.to(description, {
          y: isActive ? 0 : 10,
          autoAlpha: isActive ? 0.96 : 0.52,
          duration: 0.46,
          ease: 'power2.out',
        });
      }
    });

    if (dotsRef.current) {
      const state = Flip.getState('.showreel-dot-indicator');
      const activeDot = dotsRef.current.querySelector(`[data-dot-index="${activeIndex}"]`);
      const indicator = dotsRef.current.querySelector('.showreel-dot-indicator');
      if (activeDot && indicator) {
        activeDot.appendChild(indicator);
        Flip.from(state, {
          duration: 0.35,
          ease: 'power2.out',
          absolute: true,
        });
      }
    }

    const activeImage = carouselRef.current?.querySelector(`[data-slide-index="${activeIndex}"] .showreel-image`);
    if (activeImage) {
      gsap.to(activeImage, {
        duration: 0.34,
        scale: 1.04,
        ease: 'power2.out',
      });
    }
    if (previousIndex !== activeIndex) {
      const outgoingTitle = carouselRef.current?.querySelector(`[data-slide-index="${previousIndex}"] .showreel-title`);
      if (outgoingTitle) {
        gsap.fromTo(outgoingTitle, { filter: 'blur(0px)' }, { filter: 'blur(0px)', duration: 0.24, ease: 'power1.out' });
      }
    }
    previousIndexRef.current = activeIndex;
  }, [activeIndex, total]);

  return (
    <Box  ref={sectionRef} className="premium-section" sx={{ py: { xs: 8, md: 10 }, position: 'relative' }}>
      <Box
        className="showreel-aura"
        sx={{
          position: 'absolute',
          top: { xs: 90, md: 50 },
          left: { xs: '12%', md: '16%' },
          width: { xs: 240, md: 380 },
          height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(119,180,156,0.14), rgba(119,180,156,0))',
          filter: 'blur(24px)',
          pointerEvents: 'none',
        }}
      />
        
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 }, mb: 3 }}>
      <Box id="showreel" className="premium-panel" sx={{ display:{xs: 'flex', md: 'flex'}, p: 2, height: { xs: 750, md: 400 }, borderRadius: 2, border: '1px solid rgba(255,255,255,0.16)' }}>
        <script type='text/javascript' src='https://reputationhub.site/reputation/assets/review-widget.js'></script><iframe class='lc_reviews_widget' src='https://reputationhub.site/reputation/widgets/review_widget/5QGx9HZ46r4zMETj9f3K?widgetId=6a43aa7a5ab92d63d509be6e' frameborder='0' scrolling='no' style={{  minWidth: '100%', width: '100%', height: { xs: 900, md: 700 } , }}></iframe>
      </Box>
     
        <Box
          className="showreel-screen-shell premium-panel"
          sx={{
            position: 'relative',
            mb: 3,
            overflow: 'hidden',
            borderRadius: 4,
            p: { xs: 2.2, md: 2.6 },
            bgcolor: 'rgba(255,255,255,0.74)',
            height: { xs: 220, md: 260 },
          }}
        >
          
          <Box className="showreel-screen-grid" sx={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'linear-gradient(180deg, rgba(31,74,59,0.08) 0, rgba(31,74,59,0.08) 1px, transparent 1px, transparent 28px), linear-gradient(90deg, rgba(31,74,59,0.05) 0, rgba(31,74,59,0.05) 1px, transparent 1px, transparent 28px)', backgroundSize: '28px 28px' }} />
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.40) 0%, rgba(255,255,255,0.04) 58%, rgba(31,74,59,0.08) 100%)' }} />
         
          <Box sx={{ position: 'relative', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.5fr 0.95fr' }, gap: 2.5, alignItems: 'center' }}>
         
            <Box sx={{ display: 'grid', gap: 1.5, maxWidth: { xs: '100%', md: 600, height: { xs: '100%', md: '100%' } } }}>
              <Typography sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.76rem', mb: 1 }}>
                Results overview
              </Typography>
              <Typography sx={{ fontSize: { xs: '1.35rem', md: '1.9rem' }, lineHeight: 1.08, fontWeight: 700, mb: 1 }}>
                A cleaner look at training progress across real sessions.
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 650 }}>
                This gallery is framed like a premium screen so the proof feels deliberate, structured, and easier to browse.
              </Typography>
            </Box>
            <Box sx={{ display: 'grid', gap: 1 }}>
              {[
                'Daily routines become easier to repeat',
                'Owners see what calmer handling actually looks like',
                'Progress is shown in real environments, not only inside sessions',
              ].map((item) => (
                <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.25, py: 0.9, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.62)', border: '1px solid rgba(31,74,59,0.08)' }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'secondary.main', boxShadow: '0px 0px 0px 4px rgba(241,209,27,0.14)' }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    {item}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
                      
        <Typography className="showreel-heading" sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1.25, fontSize: '0.8rem' }}>
          Results in Motion
        </Typography>
        <Typography className="showreel-heading" variant="h2" sx={{ fontSize: { xs: '2.25rem', md: '3.5rem' }, lineHeight: 1.03, mb: 1.5 }}>
          Proof from real training sessions
        </Typography>
        <Typography className="showreel-heading" variant="body1" sx={{ color: 'text.secondary', maxWidth: 900 }}>
          See how clear structure, better timing, and owner guidance translate into calmer behavior and more confident handling.
        </Typography>
      </Container>

      <Box sx={{ px: { xs: 2, md: 4 } }}>
        <Box sx={{ mb: 1.4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography aria-live="polite" sx={{ color: 'rgba(20, 38, 32, 0.92)', fontSize: '0.8rem', letterSpacing: '0.05em', fontWeight: 800, minWidth: 62, textAlign: 'right' }}>
              {total ? `${String(activeIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}` : 'Loading'}
            </Typography>
            <IconButton
              aria-label="Previous frame"
              onClick={() => scrollToIndex(activeIndex - 1, { wrap: true })}
              disabled={!total}
              sx={{ border: '1px solid rgba(31, 74, 59, 0.14)', borderRadius: 1.5 }}
            >
              <ArrowBackRoundedIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="Next frame"
              onClick={() => scrollToIndex(activeIndex + 1, { wrap: true })}
              disabled={!total}
              sx={{ border: '1px solid rgba(31, 74, 59, 0.14)', borderRadius: 1.5 }}
            >
              <ArrowForwardRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ height: 3, borderRadius: 999, bgcolor: 'rgba(31, 74, 59, 0.14)', overflow: 'hidden', mb: 2 }}>
          <Box
            sx={{
              height: '100%',
              width: `${total ? ((activeIndex + 1) / total) * 100 : 0}%`,
              transition: 'width 280ms ease',
              background: 'linear-gradient(90deg, #5e7315 0%, #a5bd45 52%, #f1d11b 100%)',
            }}
          />
        </Box>
        <Box
          ref={carouselRef}
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            touchAction: 'pan-x',
            overscrollBehaviorX: 'contain',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            pb: 1,
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
          }}
        >
          {showreelImages.map((item, index) => (
            <Box
              key={`${item.title}-carousel`}
              data-slide-index={index}
              className="showreel-carousel-slide"
              sx={{
                position: 'relative',
                flex: '0 0 100%',
                scrollSnapAlign: 'center',
                height: { xs: '56vh', md: '62vh' },
                overflow: 'hidden',
                borderRadius: 2,
                border: '1px solid rgba(31, 74, 59, 0.12)',
                bgcolor: '#111c18',
                boxShadow: '0px 16px 36px rgba(20, 37, 54, 0.08)',
              }}
            >
              <Box
                className="showreel-image-bg"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${item.src})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(14px)',
                  transform: 'scale(1.08)',
                  opacity: 0.42,
                }}
              />
              <Box
                className="showreel-image"
                component="img"
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                sx={{
                  position: 'absolute',
                  inset: { xs: '2% 2%', md: '2.5% 2.5%' },
                  width: '96%',
                  height: { xs: '96%', md: '95%' },
                  objectFit: 'contain',
                  borderRadius: 1.6,
                  boxShadow: '0px 18px 38px rgba(8, 16, 13, 0.22)',
                  transformOrigin: 'center center',
                }}
              />
              <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(12, 22, 18, 0.10), rgba(12, 22, 18, 0.64))' }} />
              <Box sx={{ position: 'absolute', top: '-20%', left: '-20%', width: '54%', height: '140%', background: 'linear-gradient(115deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0))', mixBlendMode: 'screen', pointerEvents: 'none' }} />
              <Box sx={{ position: 'absolute', left: { xs: 16, md: 26 }, bottom: { xs: 16, md: 24 }, color: '#f8f6f1', right: { xs: 16, md: 26 } }}>
                <Typography className="showreel-meta" sx={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, opacity: 0.9, mb: 0.55 }}>
                  {item.meta} • {String(index + 1).padStart(2, '0')}
                </Typography>
                <Typography className="showreel-title" sx={{ fontSize: { xs: '1.25rem', md: '2rem' }, lineHeight: 1.12, fontWeight: 700 }}>
                  {item.title}
                </Typography>
                <Typography className="showreel-description" sx={{ mt: 1, maxWidth: 520, color: 'rgba(248, 246, 241, 0.84)', fontSize: { xs: '0.92rem', md: '1rem' }, lineHeight: 1.55 }}>
                  {item.description}
                </Typography>
                <Typography className="showreel-tag" sx={{ mt: 1, display: 'inline-flex', px: 1.1, py: 0.45, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 700 }}>
                  {item.tag}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        {!total && (
          <Box
            sx={{
              minHeight: { xs: '44vh', md: '52vh' },
              borderRadius: 2,
              border: '1px solid rgba(31, 74, 59, 0.12)',
              bgcolor: 'rgba(255,255,255,0.62)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Typography sx={{ color: 'text.secondary', fontWeight: 700 }}>Loading showreel photos…</Typography>
          </Box>
        )}
        <Box ref={dotsRef} sx={{ display: 'flex', justifyContent: 'center', gap: 0.8, mt: 1.8, flexWrap: 'wrap', position: 'relative' }}>
          {showreelImages.map((item, index) => (
            <Box
              key={`${item.title}-dot`}
              component="button"
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to frame ${index + 1}`}
              data-dot-index={index}
              sx={{
                width: index === activeIndex ? 20 : 8,
                height: 8,
                borderRadius: 999,
                border: 0,
                p: 0,
                cursor: 'pointer',
                transition: 'all 220ms ease',
                bgcolor: index === activeIndex ? 'primary.main' : 'rgba(31, 74, 59, 0.3)',
              }}
            />
          ))}
          <Box
            className="showreel-dot-indicator"
            sx={{
              width: 20,
              height: 8,
              borderRadius: 999,
              bgcolor: 'primary.main',
              pointerEvents: 'none',
              display: 'block',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Showreel;
