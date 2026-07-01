import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { addTitleScramble, prepareTitleWords, TITLE_REVEAL_EASE } from '../utils/titleFx';

gsap.registerPlugin(ScrollTrigger);

const FAQ = ({ siteContent }) => {
  const sectionRef = useRef(null);
  const { faq } = siteContent;

  useEffect(() => {
    const { words, masks, revert } = prepareTitleWords(sectionRef.current, '.section-title');
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      tl.fromTo('.faq-heading', { y: 24, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
      });
      if (masks.length) {
        tl.fromTo(masks, { yPercent: 100 }, { yPercent: 0, duration: 0.74, stagger: 0.042, ease: 'power3.out' }, '-=0.46');
      }
      if (words.length) {
        tl.fromTo(words, { yPercent: 120, autoAlpha: 0, rotateX: -70, transformOrigin: '0% 100%' }, {
          yPercent: 0,
          autoAlpha: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.042,
          ease: TITLE_REVEAL_EASE,
        }, '-=0.4');
        addTitleScramble(tl, words, '-=0.28');
      }
      tl.fromTo('.faq-item', { y: 28, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
      }, '-=0.18');
      gsap.fromTo('.faq-aura', {
        xPercent: -8,
        scale: 0.94,
        autoAlpha: 0.22,
      }, {
        xPercent: 8,
        scale: 1.02,
        autoAlpha: 0.52,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      revert();
    };
  }, []);

  return (
    <Box id="faq" ref={sectionRef} className="premium-section" sx={{ py: { xs: 2, md: 2 }, position: 'relative' }}>
      <Box
        className="faq-aura"
        sx={{
          position: 'absolute',
          top: { xs: 96, md: 80 },
          left: { xs: '8%', md: '12%' },
          width: { xs: 220, md: 340 },
          height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(119,180,156,0.12), rgba(119,180,156,0))',
          filter: 'blur(24px)',
          pointerEvents: 'none',
        }}
      />
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
        <Box sx={{ maxWidth: '100%', mb: 4 }}>
          <Typography className="faq-heading" sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1.5, fontSize: '0.8rem' }}>
            {faq.eyebrow}
          </Typography>
          <Typography  variant="h2" sx={{ mb: 2.5, fontSize: { xs: '1.95rem', md: '3rem' }, '& .gsap-title-word': { display: 'flex', flexWrap: 'nowrap',transformOrigin: '0% 100%' } }}>
            {faq.title}
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gap: 2 }}>
          {faq.items.map((item) => (
            <Accordion key={item.question} className="faq-item premium-panel" disableGutters elevation={0} sx={{ borderRadius: '8px !important', border: '1px solid rgba(42, 62, 53, 0.10)', bgcolor: 'background.paper', overflow: 'hidden', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>{item.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FAQ;
