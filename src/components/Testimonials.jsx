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

const Testimonials = ({ siteContent }) => {
  const sectionRef = useRef(null);
  const railRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { testimonials } = siteContent;

  const scrollToIndex = useCallback((index) => {
    const rail = railRef.current;
    if (!rail) return;
    const cards = rail.querySelectorAll('[data-outcome-index]');
    const safeIndex = Math.max(0, Math.min(index, cards.length - 1));
    const target = cards[safeIndex];
    if (!target) return;
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
          start: 'top 82%',
        },
      });

      tl.fromTo('.testimonial-heading', { y: 24, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
      });
      if (masks.length) {
        tl.fromTo(masks, { yPercent: 100 }, { yPercent: 0, duration: 0.76, stagger: 0.045, ease: 'power3.out' }, '-=0.48');
      }
      if (words.length) {
        tl.fromTo(words, { yPercent: 120, autoAlpha: 0, rotateX: -72, transformOrigin: '0% 100%' }, {
          yPercent: 0,
          autoAlpha: 1,
          rotateX: 0,
          duration: 0.82,
          stagger: 0.045,
          ease: TITLE_REVEAL_EASE,
        }, '-=0.4');
        addTitleScramble(tl, words, '-=0.28');
      }
      tl.fromTo('.testimonial-rail-shell', { y: 28, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.78,
        ease: 'power3.out',
      }, '-=0.16');
      tl.fromTo('.testimonial-card', { y: 30, autoAlpha: 0, scale: 0.985 }, {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.66,
        stagger: 0.08,
        ease: 'power3.out',
      }, '-=0.2');
    }, sectionRef);

    return () => {
      ctx.revert();
      revert();
    };
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;
    let frame = null;
    const onScroll = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const cards = rail.querySelectorAll('[data-outcome-index]');
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
    <Box ref={sectionRef} className="premium-section premium-section--tint" sx={{ py: { xs: 6.5, md: 8 }, position: 'relative' }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) auto' }, gap: 2, alignItems: 'end', mb: 3 }}>
          <Box sx={{ maxWidth: 760 }}>
            <Typography className="testimonial-heading" sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1, fontSize: '0.8rem' }}>
              {testimonials.eyebrow}
            </Typography>
            <Typography className="testimonial-heading section-title" variant="h2" sx={{ mb: 1.2, fontSize: { xs: '1.95rem', md: '3rem' }, '& .gsap-title-word': { display: 'inline-block', transformOrigin: '0% 100%' } }}>
              {testimonials.title}
            </Typography>
            <Typography className="testimonial-heading" variant="body1" sx={{ color: 'text.secondary', maxWidth: 620 }}>
              {testimonials.description}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifySelf: { xs: 'start', md: 'end' } }}>
            <Typography sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.82rem', minWidth: 56 }}>
              {String(activeIndex + 1).padStart(2, '0')} / {String(testimonials.items.length).padStart(2, '0')}
            </Typography>
            <IconButton aria-label="Previous outcome" onClick={() => scrollToIndex(activeIndex - 1)} sx={{ border: '1px solid rgba(31, 74, 59, 0.14)', borderRadius: 1.5 }}>
              <ArrowBackRoundedIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label="Next outcome" onClick={() => scrollToIndex(activeIndex + 1)} sx={{ border: '1px solid rgba(31, 74, 59, 0.14)', borderRadius: 1.5 }}>
              <ArrowForwardRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box className="testimonial-rail-shell premium-panel" sx={{ p: { xs: 1.4, md: 1.8 }, borderRadius: 2, overflow: 'hidden' }}>
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
            {testimonials.items.map((item, index) => (
              <Card key={item.title} data-outcome-index={index} className="testimonial-card premium-panel" sx={{ flex: { xs: '0 0 88%', sm: '0 0 58%', md: '0 0 31%' }, minHeight: 260, position: 'relative', overflow: 'hidden', borderRadius: 2, scrollSnapAlign: 'start' }}>
                <CardAccentSvg variant="wave" />
                <CardContent sx={{ p: 2.6 }}>
                  <Typography sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.76rem', mb: 1.2 }}>
                    Outcome 0{index + 1}
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 1.4, lineHeight: 1.18 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic', lineHeight: 1.62 }}>
                    "{item.quote}"
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

export default Testimonials;
