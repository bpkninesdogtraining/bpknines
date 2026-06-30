import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import heroImg from '../assets/bpkninesgrad.jpg';
import heroBpknineGrad from '../assets/doggrads1.png';
import heroBpknineBlack from '../assets/bpknineslogoblackbg.jpg';
import highlightOwnerGsdImg from '../assets/highlight-owner-gsd.jpeg';
import highlightPhDogPathImg from '../assets/highlight-ph-dog-path.jpeg';
import highlightPhPupImg from '../assets/highlight-ph-pup.jpeg';
import { TITLE_REVEAL_EASE } from '../utils/titleFx';
import PhoneIcon from '@mui/icons-material/Phone';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import IconButton from "@mui/material/IconButton";
import PetsIcon from '@mui/icons-material/Pets';
import trainmemory1 from '../assets/trainmemory1.jpg';
import trainmemory2 from '../assets/trainmemory2.jpg';
import trainmemory3 from '../assets/trainmemory3.jpg';
import trainmemory4 from '../assets/trainmemory4.jpg';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin);

const Hero = ({ siteContent }) => {
  const heroRef = useRef(null);
  const { hero, contact } = siteContent;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const splitInstances = [];
      const ambientTweens = [];
      const heroLines = gsap.utils.toArray('.hero-line');

      heroLines.forEach((line) => {
        splitInstances.push(
          SplitText.create(line, {
            type: 'chars',
            charsClass: 'hero-char',
          }),
        );
      });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.hero-kicker', { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.42 });
      tl.fromTo('.hero-headline-shell', { y: 26, autoAlpha: 0, scale: 0.985 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.72 }, '-=0.06');
      tl.fromTo(
        '.hero-line-wrap',
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.82,
          stagger: 0.11,
        },
        '-=0.1',
      );
      tl.fromTo('.hero-char', {
        y: 20,
        autoAlpha: 0,
        rotateX: -65,
        transformOrigin: '0% 100%',
      }, {
        y: 0,
        autoAlpha: 1,
        rotateX: 0,
        duration: 0.78,
        stagger: 0.018,
        ease: TITLE_REVEAL_EASE,
      }, '-=0.7');
      tl.to('.hero-char', { y: -1.5, duration: 0.22, stagger: 0.004, ease: 'power1.out' }, '-=0.16');
      tl.to('.hero-char', { y: 0, duration: 0.34, stagger: 0.003, ease: 'power2.out' }, '-=0.04');
      tl.fromTo('.hero-headline-rule', { scaleX: 0, autoAlpha: 0.35 }, { scaleX: 1, autoAlpha: 1, duration: 0.68, ease: 'power2.out', transformOrigin: 'left center' }, '-=0.36');
      tl.fromTo('.hero-headline-path-wrap', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' }, '-=0.45');
      tl.fromTo('.hero-divider', { scaleX: 0, autoAlpha: 0.4 }, { scaleX: 1, autoAlpha: 1, duration: 0.6, ease: 'power2.out', transformOrigin: 'left center' }, '-=0.3');
      tl.fromTo('.hero-copy', { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.54 }, '-=0.45');
      tl.fromTo('.hero-actions', { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 }, '-=0.35');
      tl.fromTo('.hero-stat', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.08 }, '-=0.25');
      tl.fromTo('.hero-bridge', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.58, ease: 'power2.out' }, '-=0.16');

      const visualTl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 });
      visualTl.fromTo('.hero-visual', { clipPath: 'inset(0 0 100% 0 round 40px)', y: 44 }, { clipPath: 'inset(0 0 0% 0 round 40px)', y: 0, duration: 1.1 });
      visualTl.fromTo('.hero-screen-panel', { y: 30, autoAlpha: 0, scale: 0.96 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.76, ease: 'power3.out' }, '-=0.76');
      visualTl.fromTo('.hero-badge-card', { y: 26, autoAlpha: 0, scale: 0.98 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.68, stagger: 0.12 }, '-=0.76');
      visualTl.fromTo('.hero-moment-photo', { y: 10, autoAlpha: 0, scale: 0.96 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.42, stagger: 0.07 }, '-=0.5');

      gsap.to('.hero-visual-inner', {
        yPercent: -4,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });
      gsap.to('.hero-screen-panel', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
      gsap.to('.hero-bridge-line', {
        scaleX: 1.08,
        autoAlpha: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top 20%',
          end: 'bottom top',
          scrub: 0.8,
        },
      });

      if (!prefersReducedMotion) {
        ambientTweens.push(gsap.to('.hero-heading-orb-a', {
          motionPath: {
            path: '.hero-orbit-path-a',
            align: '.hero-orbit-path-a',
            alignOrigin: [0.5, 0.5],
            start: 0.12,
            end: 1.12,
          },
          duration: 15,
          repeat: -1,
          ease: 'none',
        }));
        ambientTweens.push(gsap.to('.hero-heading-orb-b', {
          motionPath: {
            path: '.hero-orbit-path-b',
            align: '.hero-orbit-path-b',
            alignOrigin: [0.5, 0.5],
            start: 0.58,
            end: 1.58,
          },
          duration: 18,
          repeat: -1,
          ease: 'none',
        }));
        ambientTweens.push(gsap.to('.hero-heading-orb-c', {
          motionPath: {
            path: '.hero-orbit-path-c',
            align: '.hero-orbit-path-c',
            alignOrigin: [0.5, 0.5],
            start: 0.3,
            end: 1.3,
          },
          duration: 12,
          repeat: -1,
          ease: 'none',
        }));
        ambientTweens.push(gsap.to('.hero-headline-shimmer', {
          xPercent: 120,
          duration: 5.8,
          repeat: -1,
          repeatDelay: 4.4,
          ease: 'power1.inOut',
        }));
        gsap.fromTo('.hero-headline-path-stroke', {
          strokeDasharray: 260,
          strokeDashoffset: 260,
        }, {
          strokeDashoffset: 0,
          duration: 1.05,
          ease: 'power2.out',
        });
        ambientTweens.push(gsap.to('.hero-headline-path-stroke', {
          strokeDashoffset: -48,
          duration: 9.2,
          repeat: -1,
          ease: 'sine.inOut',
          yoyo: true,
        }));
        ambientTweens.push(gsap.to('.hero-screen-grid', {
          backgroundPositionY: '42px',
          duration: 14,
          repeat: -1,
          ease: 'none',
        }));
        ambientTweens.push(gsap.to('.hero-screen-glow', {
          opacity: 0.66,
          scale: 1.035,
          duration: 5.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        }));

        ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top bottom',
          end: 'bottom top',
          onEnter: () => ambientTweens.forEach((tween) => tween.play()),
          onEnterBack: () => ambientTweens.forEach((tween) => tween.play()),
          onLeave: () => ambientTweens.forEach((tween) => tween.pause()),
          onLeaveBack: () => ambientTweens.forEach((tween) => tween.pause()),
        });
      }

      const rotatingNotes = [
        'Calm inside the home.',
        'Reliable walks outside.',
        'Confident handling every day.',
      ];
      if (!prefersReducedMotion) {
        const textTl = gsap.timeline({
          repeat: -1,
          repeatDelay: 0.8,
        });
        rotatingNotes.forEach((text) => {
          textTl.to('.hero-rotating-copy', {
            autoAlpha: 0.4,
            y: 2,
            duration: 0.26,
            ease: 'power1.inOut',
          })
            .call(() => {
              const rotatingNode = heroRef.current?.querySelector('.hero-rotating-copy');
              if (rotatingNode) {
                rotatingNode.textContent = text;
              }
            })
            .to('.hero-rotating-copy', {
              autoAlpha: 1,
              y: 0,
              duration: 0.34,
              ease: 'power2.out',
            })
            .to('.hero-rotating-copy', {
              autoAlpha: 0.9,
              duration: 0.2,
              delay: 2.0,
              ease: 'power1.inOut',
            });
        });
        ambientTweens.push(textTl);
      }

      return () => {
        ambientTweens.forEach((tween) => tween.kill());
        splitInstances.forEach((instance) => instance.revert());
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box ref={heroRef} className="premium-section premium-section--tint" sx={{ pt: { xs: 4.5, md: 9 }, pb: { xs: 4.5, md: 11 }, position: 'relative', overflow: 'hidden' }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.2fr) minmax(390px, 0.8fr)' }, gap: { xs: 2.5, md: 4 }, alignItems: 'center' }}>
          <Box sx={{ position: 'relative', maxWidth: { md: 840 } }}>
            {/* <Box
              className="hero-heading-orb-a"
              sx={{
                position: 'absolute',
                top: { xs: 54, md: 48 },
                right: { xs: 20, md: 140 },
                width: 24,
                height: 24,
                borderRadius: '50%',
                bgcolor: 'rgba(241, 209, 27, 0.34)',
                border: '1px solid rgba(241, 209, 27, 0.52)',
                pointerEvents: 'none',
              }}
            />
            <Box
              className="hero-heading-orb-b"
              sx={{
                position: 'absolute',
                top: { xs: 118, md: 108 },
                left: { xs: -4, md: -22 },
                width: 18,
                height: 18,
                borderRadius: '50%',
                bgcolor: 'rgba(123, 176, 157, 0.30)',
                border: '1px solid rgba(123, 176, 157, 0.5)',
                pointerEvents: 'none',
              }}
            />
            <Box
              className="hero-heading-orb-c"
              sx={{
                position: 'absolute',
                top: { xs: 168, md: 166 },
                right: { xs: 4, md: 82 },
                width: 34,
                height: 10,
                borderRadius: 99,
                bgcolor: 'rgba(31, 74, 59, 0.12)',
                border: '1px solid rgba(31, 74, 59, 0.22)',
                pointerEvents: 'none',
              }}
            /> */}
            <Typography className="hero-kicker" sx={{ display:'inline-flex', mt:1,px: { xs: 1.35, md: 2 }, py: { xs: 0.7, md: 0.7 }, borderRadius: 2.5, bgcolor: 'rgba(241, 209, 27, 0.14)', color: 'primary.main', border: '1px solid rgba(241, 209, 27, 0.22)', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: { xs: '0.4rem', md: '0.76rem' }, mb: { xs: 1.6, md: 1 } }}>
              {hero.eyebrow}
            </Typography>
            <Box sx={{ display: { xs: 'block', md: 'none' }, position: 'fixed', bottom: 0, left: 0, right: 0, width:'100%',  zIndex: 1100,bgcolor: 'rgb(84, 97, 8)', border: '1px solid rgba(31, 74, 59, 0.22)' }}>
              <Typography className="hero-kicker" sx={{ textAlign: 'center' , borderRadius: 2.5, bgcolor: 'rgba(241, 209, 27, 0.35)', color: 'black', border: '1px solid rgba(241, 209, 27, 0.22)', fontWeight: 750, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: { xs: '1rem'}, mb:1, mt:1 }}>
                 <IconButton component="a" href={`tel:${contact.phone}`} sx={{ color: "black",fontSize: { xs: '0.9em'} }}>
                    <PetsIcon sx={{ fontSize: { xs: '1.7em'},  textShadow: '2px 2px 4px rgba(255, 255, 255, 0.9)',color: "yellow",textAlign: 'center' }} />
                      Click to Call  {contact.phone}
                    <PetsIcon sx={{ fontSize: { xs: '1.7em'},  textShadow: '2px 2px 4px rgba(255, 255, 255, 0.9)',color: "yellow",textAlign: 'center' }} />  
                  </IconButton>
              </Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'fixed', bottom: 0, left: 0, right: 0, width:'100%',  zIndex: 10000,bgcolor: 'rgb(84, 97, 8)', border: '1px solid rgba(31, 74, 59, 0.22)' }}>
              <Typography className="hero-kicker" sx={{ textAlign: 'center',textShadow: '2px 2px 2px rgba(239, 245, 150, 0.3)', borderRadius: 2.5, bgcolor: 'rgba(241, 209, 27, 0.35)', textDecorationColor: 'yellow', border: '1px solid rgba(241, 209, 27, 0.22)', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '1.5rem', mb:1, mt:1 }}>
                 <IconButton component="a" href={`tel:${contact.phone}`} sx={{ color: "black",fontSize: { md: '0.9em'} }}>
                    <PetsIcon sx={{ fontSize: { md: '2em'}, textShadow: '2px 2px 4px rgba(255, 255, 255, 0.9)',color: "yellow",textAlign: 'center'  }} />Schedule your FREE Consultation or Call Us @ {contact.phone} !<PetsIcon sx={{ fontSize: { md: '2em'}, color: "yellow", textAlign: 'center'  }} />
                  </IconButton>
              </Typography>
            </Box>
            <Box
              className="hero-headline-shell premium-panel"
              sx={{
                position: 'relative',
                mb: { xs: 1.5, md: 3 },
                px: { xs: 1.5, md: 3 },
                py: { xs: 1.4, md: 2.8 },
                borderRadius: { xs: 2, md: 3 },
                background: 'linear-gradient(165deg, rgba(255,255,255,0.88) 0%, rgba(247,250,253,0.7) 60%, rgba(255,255,255,0.9) 100%)',
                border: '1px solid rgba(255,255,255,0.78)',
                boxShadow: '0px 18px 46px rgba(20, 37, 54, 0.06)',
                overflow: 'hidden',
              }}
            >

              <Box className="hero-orbit-paths" sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true">
                <svg viewBox="0 0 840 300" width="100%" height="100%">
                  <path className="hero-orbit-path-a" d="M80 168 C 200 82, 438 78, 684 130 C 760 146, 776 180, 742 206 C 668 262, 340 266, 136 232 C 50 218, 26 194, 80 168" fill="none" stroke="transparent" />
                  <path className="hero-orbit-path-b" d="M44 198 C 120 118, 368 98, 622 134 C 748 152, 780 194, 670 226 C 474 278, 214 274, 70 232 C 34 222, 26 212, 44 198" fill="none" stroke="transparent" />
                  <path className="hero-orbit-path-c" d="M124 114 C 262 58, 470 58, 648 94 C 744 112, 772 138, 724 160 C 658 188, 372 204, 198 176 C 112 162, 74 134, 124 114" fill="none" stroke="transparent" />
                </svg>
              </Box>
              <Box
                className="hero-headline-shimmer"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: '-42%',
                  width: '34%',
                  height: '100%',
                  background: 'linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))',
                  opacity: 0.24,
                  pointerEvents: 'none',
                  mixBlendMode: 'screen',
                }}
              />

              <Typography variant="h1" sx={{ fontFamily:'Roboto',fontSize: { xs: 'clamp(1.68rem, 7.4vw, 2.28rem)', sm: 'clamp(2.25rem, 7vw, 3.2rem)', md: 'clamp(4.05rem, 6.6vw, 3.1rem)' }, lineHeight: { xs: 1, md: 1.07 }, letterSpacing: { xs: '-0.05em', md: '-0.058em' }, textShadow: '0 1px 0 rgba(255,255,255,0.6)' }}>
                {hero.lines.map((line) => (
                  <Box
                    key={line}
                    className="hero-line-wrap"
                    sx={{
                      display: 'block',
                      overflow: 'visible',
                      color: 'text.primary',
                      py: { xs: 0.06, md: 0 },
                    }}
                  >
                    <Box
                      className="hero-line"
                      sx={{
                        display: 'block',
                        whiteSpace: 'nowrap',
                        '& .hero-char': {
                          display: 'inline-block',
                          willChange: 'transform, opacity',
                        },
                      }}
                    >
                      {line}
                    </Box>
                  </Box>
                ))}
              </Typography>
            </Box>
             
            <Box className="hero-actions" sx={{ display: 'flex', gap: 1.2, flexWrap: { xs: 'nowrap', md: 'wrap' }, mb: { xs: 1.25, md: 3.5 } }}>
              <Button variant="contained" href={hero.primaryCta.href} size="small" sx={{ flex: { xs: 1, md: '0 0 auto' }, minHeight: { xs: 42, md: 48 }, px: { xs: 1.4, md: 2.2 }, fontSize: { xs: '0.86rem', md: '0.95rem' }, whiteSpace: 'nowrap', color: 'secondary.contrastText', background: 'linear-gradient(135deg, #f6e06f 0%, #f1d11b 52%, #d8b300 100%)',
                  border: '1px solid rgba(255,255,255,0.26)',
                  boxShadow: '0px 18px 40px rgba(241, 209, 27, 0.30)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #f8e892 0%, #f2dc49 52%, #ddb90a 100%)',
                    boxShadow: '0px 22px 46px rgba(241, 209, 27, 0.36)',
                  }, }}>
                {hero.primaryCta.label}
              </Button>
              <Button variant="outlined" href={hero.secondaryCta.href} size="small" sx={{ flex: { xs: 1, md: '0 0 auto' }, minHeight: { xs: 42, md: 48 }, px: { xs: 1.2, md: 2.2 }, fontSize: { xs: '0.86rem', md: '0.95rem' }, whiteSpace: 'nowrap' }}>
                {hero.secondaryCta.label}
              </Button>
            </Box>
            <Box className="hero-badge-card premium-panel" sx={{ mb: { xs: 2.5, md: 0 },p: 1, borderRadius: 2, bgcolor: 'rgba(253, 249, 240, 0.96)', border: '1px solid rgba(212, 178, 79, 0.18)', height:{ xs: '100%', md: 220 } }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.84rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'primary.main', mb: 1 }}>
                  Training Moments
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: {xs:'repeat(3, 1fr)', md:'repeat(6, 1fr)'},  gap: 1, gridAutoRows: 'auto 1fr',  borderColor:'rgba(212, 178, 79, 0.18)', borderRadius: 1 }}>
                  <Box className="hero-moment-photo" component="img" src={trainmemory4} alt="Owner and German Shepherd in training field" loading="lazy" decoding="async" sx={{  width: '100%', height:{ xs: '100%', md: '70%' }, objectFit: 'cover', borderRadius: 1, border: '5px solid rgba(0, 0, 0, 0.18)' }} />
                  <Box className="hero-moment-photo" component="img" src={highlightPhDogPathImg} alt="Dog moving confidently with handler in the background" loading="lazy" decoding="async" sx={{ width: '100%',height:{ xs: '100%', md: '70%' }, objectFit: 'cover', borderRadius: 1, border: '5px solid rgba(0, 0, 0, 0.18)' }} />
                  <Box className="hero-moment-photo" component="img" src={trainmemory1} alt="Young dog portrait during urban socialization" loading="lazy" decoding="async" sx={{display: 'block', width: '100%', height:{ xs: '100%', md: '70%' }, objectFit: 'cover', borderRadius: 1, border: '5px solid rgba(0, 0, 0, 0.18)' }} />
                  <Box className="hero-moment-photo" component="img" src={highlightPhPupImg} alt="Young dog portrait during urban socialization" loading="lazy" decoding="async" sx={{ display: 'block',width: '100%', height:{ xs: '100%', md: '70%' }, objectFit: 'cover', borderRadius: 1,border: '5px solid rgba(0, 0, 0, 0.18)' }} />
                  <Box className="hero-moment-photo" component="img" src={highlightOwnerGsdImg} alt="Owner and German Shepherd in training field" loading="lazy" decoding="async" sx={{ display: 'block',width: '100%', height:{ xs: '100%', md: '70%' }, objectFit: 'cover', borderRadius: 1,border: '5px solid rgba(0, 0, 0, 0.18)' }} />
                  <Box className="hero-moment-photo" component="img" src={trainmemory3} alt="Dog moving confidently with handler in the background" loading="lazy" decoding="async" sx={{ display: 'block',width: '100%', height:{ xs: '100%', md: '70%' } , objectFit: 'cover', borderRadius: 1,border: '5px solid rgba(0, 0, 0, 0.18)' }} />
                </Box>
            </Box>
            <Box sx={{ display: {xs:'grid', md:'none'}, gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(3, 1fr)' }, gap: { xs: 1, md: 2 } }}>
              {hero.stats.map((item) => (
                <Box key={item.value} className="hero-stat" sx={{ p: { xs: 1.1, md: 2.5 }, borderRadius: 1.5, bgcolor: 'rgba(253, 249, 240, 0.92)', border: '1px solid rgba(212, 178, 79, 0.16)', boxShadow: '0px 8px 22px rgba(42, 62, 53, 0.05)' }}>
                  <Typography sx={{ fontSize: { xs: '0.9rem', md: '1.2rem' }, fontWeight: 800, color: 'primary.main', mb: { xs: 0.2, md: 0.5 } }}>{item.value}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.66rem', md: '0.875rem' }, lineHeight: { xs: 1.2, md: 1.43 } }}>{item.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
           

          <Box sx={{ position: 'relative'}}>
            <Box className="hero-visual premium-media-frame" sx={{ borderRadius: 3, overflow: 'hidden', minHeight: { xs: 220, md: 590 }, position: 'relative', boxShadow: '0px 22px 58px rgba(19, 35, 29, 0.12)' }}>
              <Box className="hero-moment-photo" component="img" src={heroImg} alt="BPKNines" loading="lazy" decoding="async" sx={{ width: '100%', objectFit: 'cover', borderRadius: 1 }} />
            </Box>
          </Box>

        <Box className="hero-bridge" sx={{ mt: { xs: 2.2, md: 5.5 }, display: { xs: 'none', md: 'grid' }, justifyItems: 'center', gap: 1.2 }}>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Scroll to the story
          </Typography>
          <Box className="hero-bridge-line" sx={{ width: { xs: 110, md: 180 }, height: 2, borderRadius: 999, bgcolor: 'rgba(94,115,21,0.14)', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(94,115,21,0.92) 0%, rgba(165,189,69,0.8) 58%, rgba(241,209,27,0.76) 100%)', opacity: 0.82 }} />
          </Box>
        </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
