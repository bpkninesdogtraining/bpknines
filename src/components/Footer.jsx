import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import YouTubeIcon from '@mui/icons-material/YouTube';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import CardAccentSvg from './CardAccentSvg';
import brandLogo from '../assets/BPK9Icons/Assets.xcassets/AppIcon.appiconset/256.png';

gsap.registerPlugin(ScrollTrigger, TextPlugin, CustomEase);

const socialIcons = {
  Facebook: FacebookRoundedIcon,
  Messenger: ForumRoundedIcon,
  YouTube: YouTubeIcon,
};

const Footer = ({ siteContent }) => {
  const footerRef = useRef(null);
  const { brand, contact } = siteContent;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const ambientTweens = [];

      if (!gsap.parseEase('footerScreenEase')) {
        CustomEase.create('footerScreenEase', '0.22, 1, 0.36, 1');
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 82%',
        },
      });

      tl.fromTo(
        '.footer-screen-shell',
        { y: 34, autoAlpha: 0, rotateX: -12, transformPerspective: 1200 },
        {
          y: 0,
          autoAlpha: 1,
          rotateX: 0,
          duration: 0.88,
          ease: 'footerScreenEase',
        },
      );
      tl.fromTo(
        '.footer-card',
        { y: 34, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
        },
        '-=0.56',
      );
      tl.fromTo(
        '.footer-logo-lockup',
        { y: 16, autoAlpha: 0, scale: 0.94 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.54,
          ease: 'power2.out',
        },
        '-=0.45',
      );
      tl.fromTo(
        '.contact-social',
        { y: 12, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.45,
          stagger: 0.06,
          ease: 'power2.out',
        },
        '-=0.35',
      );
      tl.fromTo(
        '.footer-cta-item',
        { y: 16, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.46,
          stagger: 0.08,
          ease: 'power2.out',
        },
        '-=0.22',
      );
      tl.fromTo(
        '.footer-cta-button',
        { y: 18, autoAlpha: 0, scale: 0.94 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.56,
          ease: 'power2.out',
        },
        '-=0.12',
      );
      if (!prefersReducedMotion) {
        ambientTweens.push(gsap.to('.contact-cta-dynamic', {
          duration: 1.05,
          repeat: -1,
          repeatDelay: 1.4,
          yoyo: true,
          text: 'Fast reply. Clear plan. Confident next step.',
          ease: 'none',
        }));
      }
      gsap.fromTo('.footer-aura', {
        xPercent: -10,
        scale: 0.92,
        autoAlpha: 0.22,
      }, {
        xPercent: 10,
        scale: 1.02,
        autoAlpha: 0.56,
        ease: 'none',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.9,
        },
      });
      if (!prefersReducedMotion) {
        ambientTweens.push(gsap.fromTo('.footer-screen-grid', {
          backgroundPositionY: '0px',
        }, {
          backgroundPositionY: '120px',
          repeat: -1,
          duration: 5.2,
          ease: 'none',
        }));
        ambientTweens.push(gsap.fromTo('.footer-screen-glow', {
          scale: 0.9,
          autoAlpha: 0.42,
        }, {
          scale: 1.08,
          autoAlpha: 0.78,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        }));
      }
      gsap.fromTo('.footer-screen-content', {
        y: 0,
      }, {
        y: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
      if (!prefersReducedMotion) {
        ambientTweens.push(gsap.to('.footer-cta-button', {
          boxShadow: '0px 20px 44px rgba(241, 209, 27, 0.30)',
          repeat: -1,
          yoyo: true,
          duration: 1.6,
          ease: 'sine.inOut',
        }));
      }
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => ambientTweens.forEach((tween) => tween.play()),
        onEnterBack: () => ambientTweens.forEach((tween) => tween.play()),
        onLeave: () => ambientTweens.forEach((tween) => tween.pause()),
        onLeaveBack: () => ambientTweens.forEach((tween) => tween.pause()),
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box id="contact" ref={footerRef} className="premium-section premium-section--tint" sx={{ pt: { xs: 7, md: 10 }, pb: 4, position: 'relative', zIndex: 1 }}>
      <Box
        className="footer-aura"
        sx={{
          position: 'absolute',
          top: { xs: 90, md: 68 },
          left: { xs: '10%', md: '20%' },
          width: { xs: 260, md: 420 },
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(119,180,156,0.14), rgba(119,180,156,0))',
          filter: 'blur(28px)',
          pointerEvents: 'none',
        }}
      />
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
        <Box className="footer-screen-shell" sx={{ position: 'relative', display: { xs: 'none', md: 'block' }, mb: 3.2, minHeight: 250 }}>
          <Box
            className="footer-screen-glow"
            sx={{
              position: 'absolute',
              inset: '12% 10% auto',
              height: 180,
              borderRadius: 8,
              background: 'radial-gradient(circle at 50% 40%, rgba(119,180,156,0.34), rgba(119,180,156,0) 62%)',
              filter: 'blur(28px)',
              pointerEvents: 'none',
            }}
          />
          <Box
            className="footer-screen-content"
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 5,
              border: '1px solid rgba(31, 74, 59, 0.12)',
              bgcolor: 'rgba(255,255,255,0.72)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0px 28px 70px rgba(15, 29, 24, 0.10)',
              px: { md: 4.2 },
              py: { md: 3.6 },
            }}
          >
            <Box
              className="footer-screen-grid"
              sx={{
                position: 'absolute',
                inset: 0,
                opacity: 0.16,
                backgroundImage:
                  'linear-gradient(180deg, rgba(31,74,59,0.08) 0, rgba(31,74,59,0.08) 1px, transparent 1px, transparent 34px), linear-gradient(90deg, rgba(31,74,59,0.05) 0, rgba(31,74,59,0.05) 1px, transparent 1px, transparent 34px)',
                backgroundSize: '34px 34px',
                pointerEvents: 'none',
              }}
            />
            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0.05) 58%, rgba(31,74,59,0.08) 100%)', pointerEvents: 'none' }} />
            <Box sx={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 3.2, alignItems: 'center' }}>
              <Box>
                <Typography sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.76rem', mb: 1.25 }}>
                  Clear next steps
                 
                </Typography>
                <Typography variant="h3" sx={{ fontSize: '2.45rem', lineHeight: 1.02, mb: 1.5 }}>
                  Message the team and get a calm, practical starting plan.
                  
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 560 }}>
                  Share what is happening with your dog and we will guide you to the simplest next step, whether that means obedience, behavior reset, or a more focused coaching setup.
                </Typography>
              </Box>
              <Box sx={{ justifySelf: 'end', width: '100%', maxWidth: 360 }}>
                <Box className="premium-panel premium-panel--dark" sx={{ p: 2.2, borderRadius: 4, border: '1px solid rgba(255,255,255,0.16)' }}>
                  <Typography sx={{ color: 'rgba(247,244,238,0.74)', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, mb: 1.1 }}>
                    Fast response
                  </Typography>
                  <Typography sx={{ color: '#f8f6f1', fontSize: '1.55rem', fontWeight: 700, lineHeight: 1.15, mb: 1.1 }}>
                    Clear recommendation for your dog and your routine.
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(247,244,238,0.84)' }}>
                    Built for owners who want simple answers, realistic progress, and direct support.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }} className="footer-card">
            <Box className="premium-panel" sx={{ p: { xs: 3, md: 3.8 }, borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.82)', border: '1px solid rgba(31, 74, 59, 0.10)', height: '100%', position: 'relative', overflow: 'hidden' }}>
              <CardAccentSvg variant="grid" sx={{ width: 140, height: 80, top: 10, right: 12, opacity: 0.5 }} />
              <Box className="footer-logo-lockup" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Box component="img" src={brandLogo} alt="BPKNINES logo" sx={{ width: 54, height: 54, objectFit: 'contain', borderRadius: 2.5, bgcolor: 'rgba(255,255,255,0.92)', border: '1px solid rgba(31,74,59,0.10)', boxShadow: '0px 14px 28px rgba(20, 37, 54, 0.06)' }} />
                <Box>
                  <Typography variant="h4" sx={{ mb: 0.2 }}>
                    Contact BPKNINES
                  </Typography>
                  <Typography sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.01em' }}>
                    Dog Training Center
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.8 }}>
                {brand.subtitle}
              </Typography>

              <Grid container spacing={2.2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontWeight: 800, mb: 0.75 }}>Location</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.2 }}>
                    {contact.location}
                  </Typography>

                  <Typography sx={{ fontWeight: 800, mb: 0.75 }}>Hours</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {contact.hours.join(' | ')}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontWeight: 800, mb: 0.75 }}>Direct Contact</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {contact.phone}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.2 }}>
                    {contact.email}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    {contact.socials.map((social) => {
                      const Icon = socialIcons[social.label];
                      return (
                        <Link
                          key={social.label}
                          className="contact-social"
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          underline="none"
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.75,
                            px: 1.1,
                            py: 0.7,
                            borderRadius: 2,
                            fontWeight: 700,
                            color: 'text.secondary',
                            border: '1px solid rgba(31, 74, 59, 0.14)',
                            bgcolor: 'rgba(255, 255, 255, 0.75)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              color: 'primary.main',
                              borderColor: 'rgba(31, 74, 59, 0.28)',
                              bgcolor: 'rgba(255, 255, 255, 0.96)',
                            },
                          }}
                        >
                          {Icon && <Icon sx={{ fontSize: '1.05rem' }} />}
                          {social.label}
                        </Link>
                      );
                    })}
                  </Box>
                </Grid>
              </Grid>

              <Box component="ul" sx={{ pl: 2.5, mb: 0, mt: 2.8, color: 'text.secondary', '& li': { mb: 0.85 } }}>
                {contact.trustNotes.map((note) => (
                  <li key={note}>
                    <Typography variant="body2">{note}</Typography>
                  </li>
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }} className="footer-card">
            <Box className="premium-panel premium-panel--dark" sx={{ p: { xs: 3, md: 3.8 }, borderRadius: 2, color: 'primary.contrastText', height: '100%', border: '1px solid rgba(255, 255, 255, 0.20)', position: 'relative', overflow: 'hidden' }}>
              <CardAccentSvg variant="wave" sx={{ width: 138, height: 78, top: 14, right: 12, opacity: 0.42 }} />
              <Typography
                className="footer-cta-item"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 1.2,
                  py: 0.55,
                  borderRadius: 2,
                  fontSize: '0.73rem',
                  letterSpacing: '0.07em',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'rgba(247, 244, 238, 0.92)',
                  bgcolor: 'rgba(255, 255, 255, 0.10)',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  mb: 1.6,
                }}
              >
                Start Your Dog’s Progress Today
              </Typography>
              <Typography variant="h4" sx={{ mb: 1.8, fontSize: { xs: '1.8rem', md: '2.25rem' }, lineHeight: 1.08, letterSpacing: '-0.02em', textWrap: 'balance' }}>
                <span className="footer-cta-item">Ready for calmer days with your dog?</span>
              </Typography>
              <Typography variant="body2" className="footer-cta-item" sx={{ color: 'rgba(247, 244, 238, 0.88)', mb: 3 }}>
                Tell us what you are currently struggling with, and we will recommend the best next step for your dog, your home, and your schedule.
              </Typography>
              <Typography className="contact-cta-dynamic footer-cta-item" variant="body2" sx={{ color: 'rgba(247, 244, 238, 0.88)', fontWeight: 700, mb: 2 }}>
                Fast reply during operating hours.
              </Typography>
              <Box sx={{ display: 'grid', gap: 1.2, mb: 3 }}>
                {[
                  'Clear recommendation based on your dog’s behavior and age',
                  'Practical training plan that matches your daily routine',
                  'Owner coaching so progress continues confidently at home',
                ].map((item) => (
                  <Box key={item} className="footer-cta-item" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <CheckCircleRoundedIcon sx={{ fontSize: '1rem', mt: '2px', color: 'rgba(241, 209, 27, 0.95)' }} />
                    <Typography variant="body2" sx={{ color: 'rgba(247, 244, 238, 0.88)' }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Button
                className="footer-cta-button"
                href={contact.primaryCta.href}
                target="_blank"
                rel="noreferrer"
                variant="contained"
                color="secondary"
                endIcon={<ArrowOutwardRoundedIcon />}
                sx={{
                  color: 'secondary.contrastText',
                  width: '100%',
                  minHeight: 58,
                  fontSize: '1.03rem',
                  fontWeight: 800,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #f6e06f 0%, #f1d11b 52%, #d8b300 100%)',
                  border: '1px solid rgba(255,255,255,0.26)',
                  boxShadow: '0px 18px 40px rgba(241, 209, 27, 0.30)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #f8e892 0%, #f1d83d 52%, #ddb90a 100%)',
                    boxShadow: '0px 22px 46px rgba(241, 209, 27, 0.36)',
                  },
                }}
              >
                Book Your Free Discovery Chat
              </Button>
              <Typography variant="body2" className="footer-cta-item" sx={{ mt: 3, color: 'rgba(247, 244, 238, 0.78)' }}>
                No pressure, just clear guidance on what to do next.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6, pt: 3, borderTop: '1px solid rgba(38, 66, 54, 0.08)' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            &copy; {new Date().getFullYear()} {brand.title}. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
