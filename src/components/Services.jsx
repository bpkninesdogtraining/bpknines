import React, { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CabinOutlinedIcon from '@mui/icons-material/CabinOutlined';
import LaptopMacOutlinedIcon from '@mui/icons-material/LaptopMacOutlined';
import MilitaryTechOutlinedIcon from '@mui/icons-material/MilitaryTechOutlined';
import PetsOutlinedIcon from '@mui/icons-material/PetsOutlined';
import PsychologyAltOutlinedIcon from '@mui/icons-material/PsychologyAltOutlined';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CardAccentSvg from './CardAccentSvg';
import { addTitleScramble, prepareTitleWords, TITLE_REVEAL_EASE } from '../utils/titleFx';

gsap.registerPlugin(ScrollTrigger);

const iconByTitle = {
  'Practical Obedience': PetsOutlinedIcon,
  'Behavior Modification': PsychologyAltOutlinedIcon,
  'Behavior Rehabilitation': CabinOutlinedIcon,
  'Paws & Learn Group Class': SpaOutlinedIcon,
  'Private 1-on-1 Coaching': MilitaryTechOutlinedIcon,
  'Online Coaching': LaptopMacOutlinedIcon,
};

const Services = ({ siteContent }) => {
  const sectionRef = useRef(null);
  const railRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { services } = siteContent;
  const featuredServices = services.items.filter((service) => service.title !== 'Trainer Program');

  const scrollToIndex = useCallback((index) => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }

    const cards = rail.querySelectorAll('[data-service-index]');
    const safeIndex = Math.max(0, Math.min(index, cards.length - 1));
    const target = cards[safeIndex];
    if (!target) {
      return;
    }

    gsap.to(rail, {
      scrollLeft: target.offsetLeft - rail.offsetLeft,
      duration: 0.45,
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

      tl.fromTo('.services-heading', { y: 24, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
      });
      if (masks.length) {
        tl.fromTo(masks, { yPercent: 100 }, { yPercent: 0, duration: 0.76, stagger: 0.04, ease: 'power3.out' }, '-=0.46');
      }
      if (words.length) {
        tl.fromTo(words, { yPercent: 118, autoAlpha: 0, rotateX: -70, transformOrigin: '0% 100%' }, {
          yPercent: 0,
          autoAlpha: 1,
          rotateX: 0,
          duration: 0.82,
          stagger: 0.04,
          ease: TITLE_REVEAL_EASE,
        }, '-=0.42');
        addTitleScramble(tl, words, '-=0.28');
      }
      tl.fromTo('.services-rail-shell', { y: 28, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.72,
        ease: 'power3.out',
      }, '-=0.18');
      tl.fromTo('.service-slide', { y: 24, autoAlpha: 0, scale: 0.985 }, {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.62,
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
    if (!rail) {
      return undefined;
    }

    let frame = null;
    const onScroll = () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }
      frame = requestAnimationFrame(() => {
        const cards = rail.querySelectorAll('[data-service-index]');
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
      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <Box id="services" ref={sectionRef} className="premium-section premium-section--tint" sx={{ py: { xs: 6.5, md: 3.5 }, position: 'relative' }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) auto' }, gap: 2, alignItems: 'end', mb: 3 }}>
          <Box sx={{ maxWidth: '83%' }}>
            {/* <Typography className="services-heading" sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1, fontSize: '0.8rem' }}>
              {services.eyebrow}
            </Typography> */}
            <Typography className="services-heading " variant="h2" sx={{ mb: 1.4, fontSize: { xs: '2rem', md: '3.3rem' }, '& .gsap-title-word': { display: 'inline-block', transformOrigin: '0% 100%' } }}>
              {services.title}
            </Typography>
            <Typography className="services-heading" variant="body1" sx={{ color: 'text.secondary', maxWidth: '100%' }}>
              {services.description}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifySelf: { xs: 'start', md: 'end' } }}>
            <Typography sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.82rem', minWidth: 56 }}>
              {String(activeIndex + 1).padStart(2, '0')} / {String(featuredServices.length).padStart(2, '0')}
            </Typography>
            <IconButton aria-label="Previous program" onClick={() => scrollToIndex(activeIndex - 1)} sx={{ border: '1px solid rgba(31, 74, 59, 0.14)', borderRadius: 1.5 }}>
              <ArrowBackRoundedIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label="Next program" onClick={() => scrollToIndex(activeIndex + 1)} sx={{ border: '1px solid rgba(31, 74, 59, 0.14)', borderRadius: 1.5 }}>
              <ArrowForwardRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box className="services-rail-shell premium-panel" sx={{ p: { xs: 1.4, md: 1.8 }, borderRadius: 2, overflow: 'hidden' }}>
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
            {featuredServices.map((service, index) => {
              const Icon = iconByTitle[service.title] || PetsOutlinedIcon;
              return (
                <Card
                  key={service.title}
                  data-service-index={index}
                  className="service-slide premium-panel"
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    flex: { xs: '0 0 88%', sm: '0 0 62%', md: '0 0 32%' },
                    minHeight: 370,
                    scrollSnapAlign: 'start',
                    borderRadius: 2,
                  }}
                >
                  <CardAccentSvg variant={index % 2 === 0 ? 'arc' : 'grid'} />
                  <CardContent sx={{ p: 2.6, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5, mb: 1.6 }}>
                      <Box sx={{ width: 500, height: 48,p: 1.5, borderRadius: 1.5, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0.5em, 1fr) auto' }, placeItems: 'left', bgcolor: 'rgba(3, 18, 13, 0.08)', color: 'primary.main' }}>
                        <Typography variant="h4" sx={{ mb: 1, fontSize: { xs: '1rem', md: '1.05rem' }}}>
                           {service.title}
                        </Typography>
                    
                      </Box>
                      <Typography sx={{ color: 'rgba(38, 66, 54, 0.3)', fontWeight: 800, fontSize: '0.95rem' }}>
                        0{index + 1}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 700, mb: 1.1 }}>
                      {service.tagline}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.6 }}>
                      {service.description}
                    </Typography>
                    <Box sx={{ mt: 'auto' }}>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1.8, flexWrap: 'wrap' }}>
                        <Chip label={service.rate} size="small" sx={{ fontWeight: 700, bgcolor: 'rgba(31, 74, 59, 0.08)', color: 'primary.main' }} />
                        <Chip label={service.duration} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                      </Box>
                      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.45 }}>
                        Best for
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        {service.bestFor}
                      </Typography>
                      <Button variant="outlined" href="#contact">
                        Ask About This Program
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Services;
