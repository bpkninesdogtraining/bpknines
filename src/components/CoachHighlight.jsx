import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import vinzImg from '../assets/vinz.jpg';
import vinzFeatureVideo from '../assets/vfeature.mp4';
import CardAccentSvg from './CardAccentSvg';
import { addTitleScramble, prepareTitleWords, TITLE_REVEAL_EASE } from '../utils/titleFx';

gsap.registerPlugin(ScrollTrigger);

const CoachHighlight = ({ siteContent }) => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef(null);
  const previewVideoRef = useRef(null);
  const expandedVideoRef = useRef(null);
  const { coachHighlight } = siteContent;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }
        setPreviewReady(true);
        observer.disconnect();
      },
      {
        rootMargin: '240px 0px',
        threshold: 0.15,
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const preview = previewVideoRef.current;
    if (!preview) {
      return;
    }

    preview.muted = true;
    preview.defaultMuted = true;
    preview.volume = 0;

    if (viewerOpen) {
      preview.pause();
      return;
    }

    if (!previewReady) {
      return;
    }

    const playPromise = preview.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {});
    }
  }, [previewReady, viewerOpen]);

  useEffect(() => {
    const expanded = expandedVideoRef.current;
    if (!expanded) {
      return;
    }

    if (viewerOpen) {
      expanded.currentTime = 0;
      expanded.muted = true;
      expanded.defaultMuted = true;
      const playPromise = expanded.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {});
      }
      return;
    }

    expanded.pause();
  }, [viewerOpen]);

  useEffect(() => {
    const { words, masks, revert } = prepareTitleWords(sectionRef.current, '.section-title');
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
        },
      });

      tl.fromTo('.coach-heading', { y: 24, autoAlpha: 0 }, {
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
        }, '-=0.42');
        addTitleScramble(tl, words, '-=0.3');
      }
      tl.fromTo('.coach-card', { y: 34, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power3.out',
      }, '-=0.18');
      tl.fromTo('.coach-screen-note', { y: 22, autoAlpha: 0, scale: 0.96 }, {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.68,
        ease: 'power3.out',
      }, '-=0.46');
      tl.fromTo('.coach-copy-block', {
        clipPath: 'inset(0 0 100% 0 round 20px)',
        y: 18,
        autoAlpha: 0.4,
      }, {
        clipPath: 'inset(0 0 0% 0 round 20px)',
        y: 0,
        autoAlpha: 1,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
      }, '-=0.42');
      gsap.fromTo('.coach-aura', {
        xPercent: -6,
        scale: 0.92,
        autoAlpha: 0.28,
      }, {
        xPercent: 10,
        scale: 1.04,
        autoAlpha: 0.68,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.9,
        },
      });
      gsap.fromTo('.coach-photo', {
        scale: 1.08,
        yPercent: -2,
      }, {
        scale: 1,
        yPercent: 2,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
        scrub: 0.8,
        },
      });
      gsap.fromTo('.coach-video-frame', {
        scale: 1.06,
        yPercent: -3,
      }, {
        scale: 1,
        yPercent: 2,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
      gsap.fromTo('.coach-image-shell', {
        clipPath: 'inset(0 0 100% 0 round 18px)',
      }, {
        clipPath: 'inset(0 0 0% 0 round 18px)',
        duration: 1.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true,
        },
      });
      mm.add('(min-width: 900px)', () => {
        gsap.to('.coach-screen-note', {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.7,
          },
        });
      });
      mm.add('(max-width: 899px)', () => {
        gsap.set('.coach-screen-note', { yPercent: 0, clearProps: 'transform' });
      });
      gsap.fromTo('.coach-video-chip', {
        y: 18,
        autoAlpha: 0,
        scale: 0.92,
      }, {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.62,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 76%',
          once: true,
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      revert();
    };
  }, []);

  return (
    <Box id="coach-vinz" ref={sectionRef} className="premium-section premium-section--tint" sx={{ py: { xs: 9, md: 13 }, position: 'relative' }}>
      <Box
        className="coach-aura"
        sx={{
          position: 'absolute',
          top: { xs: 110, md: 72 },
          right: { xs: '-10%', md: '8%' },
          width: { xs: 260, md: 420 },
          height: { xs: 260, md: 360 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(240,200,106,0.16), rgba(240,200,106,0))',
          filter: 'blur(28px)',
          pointerEvents: 'none',
        }}
      />
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
        <Grid container spacing={{ xs: 1.25, md: 3 }} alignItems="stretch" sx={{ mb: { xs: 1.5, md: 2.8 } }}>
          <Grid size={{ xs: 12, md: 5 }} className="coach-card">
            <Box
              sx={{
                position: 'relative',
                height: { xs: 'auto', md: '100%' },
                pb: { xs: 0, md: 0 },
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 1, md: 0 },
              }}
            >
              <Box
                className="premium-media-frame coach-image-shell"
                sx={{
                  position: 'relative',
                  height: { xs: 208, sm: 300, md: '100%' },
                  minHeight: { xs: 208, sm: 300, md: 420 },
                  overflow: 'hidden',
                  borderRadius: 2,
                }}
              >
                <Box
                  className="coach-video-frame"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    component="video"
                    className="coach-photo"
                    ref={previewVideoRef}
                    src={previewReady ? vinzFeatureVideo : undefined}
                    poster={vinzImg}
                    autoPlay
                    muted
                    defaultMuted
                    loop
                    playsInline
                    preload="none"
                    sx={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#0a110d' }}
                  />
                </Box>
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(9, 17, 14, 0.06), rgba(9, 17, 14, 0.18) 56%, rgba(9, 17, 14, 0.36) 100%)' }} />
                <Box
                  className="coach-video-chip premium-panel"
                  sx={{
                    position: 'absolute',
                    left: { xs: 12, md: 18 },
                    top: { xs: 12, md: 18 },
                    px: { xs: 1, md: 1.35 },
                    py: { xs: 0.55, md: 0.75 },
                    borderRadius: 999,
                    bgcolor: 'rgba(255,255,255,0.80)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: { xs: 0.6, md: 0.8 },
                  }}
                >
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'secondary.main', boxShadow: '0px 0px 0px 4px rgba(241,209,27,0.14)' }} />
                  <Typography sx={{ color: 'primary.main', fontWeight: 800, fontSize: { xs: '0.68rem', md: '0.76rem' }, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Featured Video
                  </Typography>
                </Box>
                <IconButton
                  aria-label="Expand featured video"
                  onClick={() => setViewerOpen(true)}
                  sx={{
                    position: 'absolute',
                    right: { xs: 12, md: 18 },
                    top: { xs: 12, md: 18 },
                    width: { xs: 38, md: 44 },
                    height: { xs: 38, md: 44 },
                    color: '#f8f6f1',
                    bgcolor: 'rgba(9, 17, 14, 0.34)',
                    border: '1px solid rgba(255,255,255,0.20)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      bgcolor: 'rgba(9, 17, 14, 0.48)',
                    },
                  }}
                >
                  <OpenInFullRoundedIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box
                className="coach-screen-note premium-panel"
                sx={{
                  position: { xs: 'relative', md: 'absolute' },
                  right: { md: -20 },
                  bottom: { md: 28 },
                  mt: { xs: 0, md: 0 },
                  width: { xs: '100%', md: 220 },
                  p: { xs: 1.25, md: 2 },
                  borderRadius: { xs: 2, md: 3 },
                  bgcolor: 'rgba(255,255,255,0.80)',
                  zIndex: { xs: 0, md: 1 },
                }}
              >
                <Typography sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: { xs: '0.66rem', md: '0.72rem' }, mb: { xs: 0.45, md: 0.9 } }}>
                  Owner transfer
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.88rem', md: '1rem' }, lineHeight: 1.2, mb: { xs: 0.3, md: 0.65 } }}>
                  Clear handoff support after training.
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.78rem', md: '0.875rem' }, lineHeight: { xs: 1.45, md: 1.62 } }}>
                  The goal is not just progress in camp, but progress you can continue confidently at home.
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Box className="premium-panel" sx={{ p: { xs: 1.35, md: 2.6 }, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: { xs: '0.68rem', md: '0.78rem' }, mb: { xs: 0.45, md: 1 } }}>
                Coach snapshot
              </Typography>
              <Typography variant="h5" sx={{ mb: { xs: 0.5, md: 1.1 }, lineHeight: 1.16, fontSize: { xs: '1rem', md: '1.5rem' } }}>
                Head trainer delivering clear, results-driven coaching at BPKNINES.
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 640, fontSize: { xs: '0.8rem', md: '0.875rem' }, lineHeight: { xs: 1.45, md: 1.62 } }}>
                Watch the clip first, then open the coach section below for the full background and support details.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box className="premium-panel" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
          <Grid container spacing={{ xs: 1.5, md: 2.5 }} alignItems="center" sx={{ mb: expanded ? { xs: 2, md: 2.5 } : 0 }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography className="coach-heading" sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1, fontSize: '0.78rem' }}>
                {coachHighlight.eyebrow}
              </Typography>
              <Typography className="coach-heading" variant="h2" sx={{ mb: 1, fontSize: { xs: '1.6rem', md: '3.2rem' }, lineHeight: { xs: 1.04, md: 1.02 }, '& .gsap-title-word': { display: 'inline-block', transformOrigin: '0% 100%' } }}>
                {coachHighlight.title}
              </Typography>
              <Typography className="coach-heading" variant="body1" sx={{ color: 'text.secondary', maxWidth: 760, fontSize: { xs: '0.96rem', md: '1rem' } }}>
                {coachHighlight.subtitle}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'stretch', md: 'flex-end' } }}>
                <Button
                  variant="outlined"
                  onClick={() => setExpanded((value) => !value)}
                  endIcon={<KeyboardArrowDownRoundedIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 220ms ease' }} />}
                  sx={{ width: { xs: '100%', md: 'auto' } }}
                >
                  {expanded ? 'Hide Coach Details' : 'Meet Your Coach'}
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Collapse in={expanded} timeout={320}>
            <Typography className="coach-heading" variant="body1" sx={{ color: 'text.secondary', maxWidth: 720, mb: 3 }}>
              {coachHighlight.description}
            </Typography>
            <Grid container spacing={{ xs: 2.5, md: 3 }} alignItems="stretch">
              <Grid size={{ xs: 12, md: 12 }} sx={{ mt: { xs: 0, md: 0 } }}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 7 }} className="coach-card">
                    <Card className="premium-panel" sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
                      <CardAccentSvg variant="grid" />
                      <CardContent className="coach-copy-block" sx={{ p: 3.5 }}>
                        <Typography variant="h5" sx={{ mb: 2.5, lineHeight: 1.18 }}>
                          Why owners choose Coach Vinz
                        </Typography>
                        <Box component="ul" sx={{ pl: 2.5, m: 0, color: 'text.secondary', '& li': { mb: 1.25 } }}>
                          {coachHighlight.points.map((point) => (
                            <li key={point}>
                              <Typography variant="body2" sx={{ color: 'rgba(29,40,35,0.82)', lineHeight: 1.66 }}>{point}</Typography>
                            </li>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, md: 5 }} className="coach-card">
                    <Card className="premium-panel" sx={{ height: '100%', position: 'relative', overflow: 'hidden', background: 'linear-gradient(162deg, rgba(252,254,252,0.96) 0%, rgba(244,250,247,0.90) 56%, rgba(240,247,243,0.86) 100%)', border: '1px solid rgba(74, 111, 95, 0.14)', boxShadow: '0px 16px 36px rgba(20, 37, 54, 0.06)' }}>
                      <CardAccentSvg variant="wave" sx={{ opacity: 0.32 }} />
                      <CardContent className="coach-copy-block" sx={{ p: 3.5 }}>
                        <Typography variant="h5" sx={{ mb: 1.1, color: 'text.primary', lineHeight: 1.18 }}>
                          {coachHighlight.spotlight.title}
                        </Typography>
                        <Typography sx={{ color: 'primary.main', fontWeight: 750, fontSize: '0.95rem', lineHeight: 1.45, mb: 2.1 }}>
                          Practical coaching that keeps owners clear, calm, and confident from day one.
                        </Typography>
                        <Box component="ul" sx={{ pl: 2.4, m: 0, color: 'text.secondary', '& li': { mb: 1.2 } }}>
                          {coachHighlight.spotlight.items.map((item) => (
                            <li key={item}>
                              <Typography variant="body2" sx={{ color: 'rgba(29,40,35,0.82)', lineHeight: 1.68 }}>{item}</Typography>
                            </li>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Collapse>
        </Box>
      </Container>
      <Dialog
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: 'min(1180px, calc(100vw - 32px))',
            bgcolor: 'rgba(8, 14, 12, 0.82)',
            color: '#f8f6f1',
            borderRadius: { xs: 3, md: 5 },
            overflow: 'hidden',
            backdropFilter: 'blur(18px)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0px 30px 80px rgba(0,0,0,0.35)',
            backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(7, 12, 10, 0.72)',
            backdropFilter: 'blur(12px)',
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            aria-label="Close featured video"
            onClick={() => setViewerOpen(false)}
            sx={{
              position: 'absolute',
              top: 14,
              right: 14,
              zIndex: 2,
              color: '#f8f6f1',
              bgcolor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.14)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.14)',
              },
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
          <Box sx={{ px: { xs: 2, md: 3 }, pt: { xs: 2.2, md: 2.8 }, pb: 1.4 }}>
            <Typography sx={{ color: 'rgba(247,244,238,0.72)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.74rem', mb: 0.9 }}>
              Coach Vinz Featured Video
            </Typography>
            <Typography variant="h4" sx={{ color: '#f8f6f1', mb: 0.8, fontSize: { xs: '1.45rem', md: '2rem' } }}>
              A larger cinematic view for a clearer look at handling and timing.
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(247,244,238,0.76)', maxWidth: 760 }}>
              Preview stays silent in the page. Open the expanded view when you want to focus on the full training clip.
            </Typography>
          </Box>
          <Box sx={{ p: { xs: 1.4, md: 2.4 } }}>
            <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: { xs: 3, md: 4 }, border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0px 24px 60px rgba(0,0,0,0.22)' }}>
              <Box component="video" ref={expandedVideoRef} src={viewerOpen ? vinzFeatureVideo : undefined} poster={vinzImg} controls playsInline preload="metadata" sx={{ display: 'block', width: '100%', maxHeight: '76vh', backgroundColor: '#060a09', objectFit: 'contain' }} />
            </Box>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default CoachHighlight;
