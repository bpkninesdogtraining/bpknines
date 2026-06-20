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
// import brandLogo from '../assets/BPK9Icons/Assets.xcassets/AppIcon.appiconset/256.png';
import brandLogo from '../assets/bpknineslogonobg.png';
gsap.registerPlugin(ScrollTrigger, TextPlugin, CustomEase);

const socialIcons = {
  Facebook: FacebookRoundedIcon,
  Messenger: ForumRoundedIcon,
  YouTube: YouTubeIcon,
};

const Enrollment = ({ siteContent }) => {
  const footerRef = useRef(null);
  const { brand, enrollment } = siteContent;

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
        '.enrollment-social',
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
        ambientTweens.push(gsap.to('.enrollment-cta-dynamic', {
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
    <Box id="enrollment" ref={footerRef} className="premium-section premium-section--tint" sx={{ height: { xs: 'auto', md: 900 }, pt: { xs: 12, md: 5 }, pb: 4, position: 'relative' }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
        <Box className="footer-screen-shell" sx={{ position: 'relative', display: { xs: 'block', md: 'block' }, mb: 3.2, minHeight: 250 }}>
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
              px: { xs:1,md: 4.2 },
              pt: { xs: 3.2},
              py: { md: 4.6 },
              pr: { xs: 2},
            }}
          >             
          <Grid container spacing={2.2}>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography className="blog-heading section-title" variant="h2" sx={{ mx: 2,mb: 2.5, fontSize: { xs: '2rem', md: '3rem' }, '& .gsap-title-word': { display: 'inline-block', transformOrigin: '0% 100%' } }}>
                  {enrollment.title}
                  </Typography>
                  <Typography className="blog-heading" variant="body1" sx={{ color: 'text.secondary',fontSize: { xs: '.9rem' }, textAlign: 'left', maxWidth: 680, marginLeft: 3 }}>
                  Thank you for choosing BPKNines Dog Training Center! <br /> <br />
                  <ul style={{ listStyleType: 'number', paddingLeft: 10, marginTop: 0 }}>
                    <li> Please complete the Client Information Form </li>
                    <li> Upon submission, you will be prompted to provide Dog Information</li>
                    <li> If you are enrolling more than one dog, please submit a separate form for each dog.</li>
                    <li> Once both forms are submitted, you will receive a Contract to your email.</li>
                    <li> Review the contract carefully and if you agree to the terms, click the e-signature field to sign it and select the date signed.</li>
                  </ul>
                  </Typography>
                 <Typography className="blog-heading section-title" variant="h3" sx={{ mx: 2,mb: 2.5, fontSize: { xs: '1rem', md: '2rem' }, '& .gsap-title-word': { display: 'inline-block', transformOrigin: '0% 100%' } }}>
                  Boarding & Training Requirements
                  </Typography>
                 <Typography className="blog-heading" variant="body1" sx={{ color: 'text.secondary', textAlign: 'left', fontSize: { xs: '.9rem' },maxWidth: 680, marginLeft: 3 }}>
                  <ul style={{ listStyleType: 'none', paddingLeft: 1, marginTop: 0 }}>
                    Please bring the following upon enrollment:
                      <li>✅ Complete and Updated Vaccination Records</li>
                      <li>✅ Dog Food for the entire training period</li>
                      <li>✅ Dog Shampoo</li>
                      <li>✅ Towel</li>
                      <li>✅ Vitamins or Supplements (if applicable)</li>
                      <li>✅ Maintenance Medications (if prescribed by a veterinarian)</li><br/>

                      ⚠️ For the safety and health of all dogs, only dogs with complete and updated vaccinations will be accepted for training.
                  </ul>
                  </Typography>
                </Grid>
                
                  <Box sx={{ justifySelf: 'start', width: '100%', maxWidth: 560, height: 730, borderRadius: 3, border: '3px solid rgba(31, 74, 59, 0.10)'}}>
                   <iframe
                      src="https://api.leadconnectorhq.com/widget/form/LMm7wZtYmSbKV8NCLrTJ"
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      id="inline-LMm7wZtYmSbKV8NCLrTJ" 
                      data-layout="{'id':'INLINE'}"
                      data-trigger-type="alwaysShow"
                      data-trigger-value=""
                      data-activation-type="alwaysActivated"
                      data-activation-value=""
                      data-deactivation-type="neverDeactivate"
                      data-deactivation-value=""
                      data-form-name="Client Information"
                      data-height="320"
                      data-layout-iframe-id="inline-LMm7wZtYmSbKV8NCLrTJ"
                      data-form-id="LMm7wZtYmSbKV8NCLrTJ"
                      title="Client Information">
                  </iframe>
                  <script src="https://link.msgsndr.com/js/form_embed.js"></script>
                </Box>                
              </Grid>     
      </Box>
      </Box>
      </Container>
      </Box>
  );
};

export default Enrollment;
