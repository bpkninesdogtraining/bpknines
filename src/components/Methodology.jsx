import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CardAccentSvg from './CardAccentSvg';
import { addTitleScramble, prepareTitleWords, TITLE_REVEAL_EASE } from '../utils/titleFx';

gsap.registerPlugin(ScrollTrigger);

const Methodology = ({ siteContent }) => {
  const methodRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const { methodology } = siteContent;

  useEffect(() => {
    const { words, masks, revert } = prepareTitleWords(methodRef.current, '.section-title');
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: methodRef.current,
          start: 'top 80%',
        },
      });

      tl.fromTo('.method-heading', { y: 24, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
      });
      if (masks.length) {
        tl.fromTo(masks, { yPercent: 100 }, { yPercent: 0, duration: 0.78, stagger: 0.045, ease: 'power3.out' }, '-=0.5');
      }
      if (words.length) {
        tl.fromTo(words, { yPercent: 120, autoAlpha: 0, rotateX: -72, transformOrigin: '0% 100%' }, {
          yPercent: 0,
          autoAlpha: 1,
          rotateX: 0,
          duration: 0.82,
          stagger: 0.045,
          ease: TITLE_REVEAL_EASE,
        }, '-=0.45');
        addTitleScramble(tl, words, '-=0.28');
      }
      tl.fromTo('.method-toggle-shell', { y: 24, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.7,
        ease: 'power3.out',
      }, '-=0.18');
      tl.fromTo('.method-card', { y: 38, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      }, '-=0.2');
      tl.fromTo('.method-copy-block', {
        clipPath: 'inset(0 0 100% 0 round 20px)',
        y: 18,
        autoAlpha: 0.45,
      }, {
        clipPath: 'inset(0 0 0% 0 round 20px)',
        y: 0,
        autoAlpha: 1,
        duration: 0.75,
        stagger: 0.08,
        ease: 'power3.out',
      }, '-=0.42');
      gsap.fromTo('.method-aura', {
        xPercent: -8,
        scale: 0.94,
        autoAlpha: 0.26,
      }, {
        xPercent: 8,
        scale: 1.02,
        autoAlpha: 0.62,
        ease: 'none',
        scrollTrigger: {
          trigger: methodRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.9,
        },
      });
    }, methodRef);

    return () => {
      ctx.revert();
      revert();
    };
  }, []);

  return (
    <Box id="methodology" ref={methodRef} className="premium-section" sx={{ py: { xs: 6.5, md: 1.5 }, position: 'relative' }}>
      <Box
        className="method-aura"
        sx={{
          position: 'absolute',
          top: 90,
          left: { xs: '12%', md: '18%' },
          width: { xs: 260, md: 420 },
          height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(119,180,156,0.16), rgba(119,180,156,0))',
          filter: 'blur(22px)',
          pointerEvents: 'none',
        }}
      />
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
        <Box sx={{ maxWidth: '100%', mb: 3 }}>
          <Typography className="method-heading section-title" variant="h2" sx={{ mb: 2.5, fontSize: { xs: '2.35rem', md: '3rem' }, '& .gsap-title-word': { display: 'inline-block', transformOrigin: '0% 100%' } }}>
            {methodology.title}
          </Typography>
          <Typography className="method-heading" variant="body1" sx={{ color: 'text.secondary' }}>
            {methodology.description}
          </Typography>
        </Box>

        <Box className="method-toggle-shell premium-panel" sx={{ p: { xs: 2.4, md: 3 }, borderRadius: 2, mb: 2.5 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1.5, maxWidth: 700 }}>
            Expand this section if you want to see the full comparison, the step-by-step training model, and the principles behind how results carry from sessions into daily life.
          </Typography>
          <Button variant={expanded ? 'contained' : 'outlined'} onClick={() => setExpanded((value) => !value)}>
            {expanded ? 'Hide Full Approach' : 'See Full Approach'}
          </Button>
        </Box>

        <Collapse in={expanded} timeout={420} unmountOnExit>
          <Grid container spacing={3}>
            {methodology.comparison.map((item) => (
              <Grid key={item.title} size={{ xs: 12, md: 6 }} className="method-card">
                <Card className="premium-panel" sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
                  <CardAccentSvg variant={item.eyebrow === 'BPKNINES approach' ? 'wave' : 'grid'} />
                  <CardContent className="method-copy-block" sx={{ p: { xs: 3.25, md: 4 } }}>
                    <Typography sx={{ color: item.eyebrow === 'BPKNINES approach' ? 'secondary.dark' : 'text.secondary', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.8rem', mb: 1.5 }}>
                      {item.eyebrow}
                    </Typography>
                    <Typography variant="h4" sx={{ mb: 2.5 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                      {item.text}
                    </Typography>
                    <Box component="ul" sx={{ pl: 2.5, m: 0, color: 'text.primary', '& li': { mb: 1.4 } }}>
                      {item.bullets.map((bullet) => (
                        <li key={bullet}>
                          <Typography variant="body2">{bullet}</Typography>
                        </li>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: { xs: 4, md: 5 } }} />

          <Grid container spacing={3} sx={{ mb: 4.5 }}>
            {methodology.steps.map((step, index) => (
              <Grid key={step.title} size={{ xs: 12, md: 4 }} className="method-card">
                <Card className="premium-panel" sx={{ position: 'relative', overflow: 'hidden' }}>
                  <CardAccentSvg variant="arc" />
                  <CardContent className="method-copy-block" sx={{ p: 3.5 }}>
                    <Typography sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.8rem', mb: 1.5 }}>
                      Step 0{index + 1}
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {step.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3} sx={{ mb: 4.5 }}>
            {methodology.pillars.map((pillar) => (
              <Grid key={pillar.title} size={{ xs: 12, sm: 6, md: 3 }} className="method-card">
                <Card className="premium-panel" sx={{ position: 'relative', overflow: 'hidden' }}>
                  <CardAccentSvg variant="grid" sx={{ width: 110, height: 68, top: 10, right: 10, opacity: 0.5 }} />
                  <CardContent className="method-copy-block" sx={{ p: 3.5 }}>
                    <Typography variant="h6" sx={{ mb: 1.5 }}>
                      {pillar.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {pillar.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box className="method-card premium-panel" sx={{ p: { xs: 3, md: 4 }, borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(38, 66, 54, 0.08)' }}>
            <Typography variant="h5" sx={{ mb: 1.5, fontStyle: 'italic' }}>
              "{methodology.quote}"
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700 }}>
              {methodology.quoteBy}
            </Typography>
          </Box>
        </Collapse>
      </Container>
    </Box>
  );
};

export default Methodology;
