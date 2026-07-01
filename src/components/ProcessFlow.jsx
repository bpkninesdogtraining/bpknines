import React, { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CardAccentSvg from './CardAccentSvg';
import { addTitleScramble, prepareTitleWords, TITLE_REVEAL_EASE } from '../utils/titleFx';

gsap.registerPlugin(ScrollTrigger);

const ProcessFlow = ({ siteContent }) => {
  const sectionRef = useRef(null);
  const railRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { process } = siteContent;

  const scrollToIndex = useCallback((index) => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }
    const cards = rail.querySelectorAll('[data-process-index]');
    const safeIndex = Math.max(0, Math.min(index, cards.length - 1));
    const target = cards[safeIndex];
    if (!target) {
      return;
    }
    gsap.to(rail, {
      scrollLeft: target.offsetLeft - rail.offsetLeft,
      duration: 0.42,
      ease: 'power3.out',
      overwrite: 'auto',
    });
    setActiveIndex(safeIndex);
  }, []);

  useEffect(() => {
    const { words, masks, revert } = prepareTitleWords(sectionRef.current, '.section-title');
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 84%',
        },
      });

      tl.fromTo('.process-heading', { y: 20, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.62,
        stagger: 0.08,
        ease: 'power3.out',
      });
      if (masks.length) {
        tl.fromTo(masks, { yPercent: 100 }, { yPercent: 0, duration: 0.74, stagger: 0.04, ease: 'power3.out' }, '-=0.42');
      }
      if (words.length) {
        tl.fromTo(words, { yPercent: 118, autoAlpha: 0, rotateX: -70, transformOrigin: '0% 100%' }, {
          yPercent: 0,
          autoAlpha: 1,
          rotateX: 0,
          duration: 0.78,
          stagger: 0.04,
          ease: TITLE_REVEAL_EASE,
        }, '-=0.38');
        addTitleScramble(tl, words, '-=0.25');
      }
      tl.fromTo('.process-rail-shell', { y: 24, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.58,
        ease: 'power3.out',
      }, '-=0.14');
      tl.fromTo('.process-step-card', { y: 24, autoAlpha: 0, scale: 0.985 }, {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.58,
        stagger: 0.08,
        ease: 'power3.out',
      }, '-=0.16');
    }, sectionRef);

    return () => {
      ctx.revert();
      revert();
    };
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) {
      return undefined;
    }
    let frame = null;
    const onScroll = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const cards = rail.querySelectorAll('[data-process-index]');
        const center = rail.scrollLeft + rail.clientWidth / 2;
        let nextIndex = 0;
        let smallestDelta = Number.POSITIVE_INFINITY;
        cards.forEach((card, index) => {
          const delta = Math.abs(card.offsetLeft + card.clientWidth / 2 - center);
          if (delta < smallestDelta) {
            smallestDelta = delta;
            nextIndex = index;
          }
        });
        setActiveIndex(nextIndex);
      });
    };
    rail.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      rail.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <Box id="process" ref={sectionRef} className="premium-section premium-section--tint" sx={{ py: { xs: 1, md: 2 }, position: 'relative' }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) auto' }, gap: 2, alignItems: 'end', mb: 3 }}>
          <Box sx={{ maxWidth: 800 }}>
            <Typography className="process-heading" sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1, fontSize: '0.8rem' }}>
              {process.eyebrow}
            </Typography>
            <Typography className="process-heading section-title" variant="h2" sx={{ mb: 1.2, fontSize: { xs: '1.95rem', md: '3rem' }, '& .gsap-title-word': { display: 'inline-block', transformOrigin: '0% 100%' } }}>
              {process.title}
            </Typography>
            <Typography className="process-heading" variant="body1" sx={{ color: 'text.secondary', maxWidth: 620 }}>
              {process.description}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifySelf: { xs: 'start', md: 'end' } }}>
            <Typography sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.82rem', minWidth: 56 }}>
              {String(activeIndex + 1).padStart(2, '0')} / {String(process.steps.length).padStart(2, '0')}
            </Typography>
            <IconButton aria-label="Previous step" onClick={() => scrollToIndex(activeIndex - 1)} sx={{ border: '1px solid rgba(31, 74, 59, 0.14)', borderRadius: 1.5 }}>
              <ArrowBackRoundedIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label="Next step" onClick={() => scrollToIndex(activeIndex + 1)} sx={{ border: '1px solid rgba(31, 74, 59, 0.14)', borderRadius: 1.5 }}>
              <ArrowForwardRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box className="process-rail-shell premium-panel" sx={{ p: { xs: 1.4, md: 1.8 }, borderRadius: 2, overflow: 'hidden' }}>
          <Box
            ref={railRef}
            sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              pb: 0.5,
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
            }}
          >
            {process.steps.map((step, index) => (
              <Card key={step.title} data-process-index={index} className="process-step-card premium-panel" sx={{ flex: { xs: '0 0 88%', sm: '0 0 58%', md: '0 0 31%' }, position: 'relative', overflow: 'hidden', borderRadius: 2, scrollSnapAlign: 'start' }}>
                <CardAccentSvg variant={index % 2 === 0 ? 'arc' : 'wave'} sx={{ opacity: 0.36 }} />
                <CardContent sx={{ p: 2.2 }}>
                  <Typography sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.74rem', mb: 0.8 }}>
                    Step 0{index + 1}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 0.8, lineHeight: 1.18 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.58 }}>
                    {step.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProcessFlow;
