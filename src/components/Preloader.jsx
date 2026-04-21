import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { TextPlugin } from 'gsap/TextPlugin';
import brandLogo from '../assets/BPK9Icons/Assets.xcassets/AppIcon.appiconset/256.png';
import chipLeftIcon from '../assets/BPK9Icons/android/mipmap-xxhdpi/ic_launcher.png';
import chipRightIcon from '../assets/BPK9Icons/Assets.xcassets/AppIcon.appiconset/128.png';

gsap.registerPlugin(CustomEase, MotionPathPlugin, TextPlugin);

const PRELOADER_EASE = 'preloaderEase';

if (!gsap.parseEase(PRELOADER_EASE)) {
  CustomEase.create(PRELOADER_EASE, '0.22, 1, 0.36, 1');
}

const Preloader = ({ onComplete }) => {
  const rootRef = useRef(null);
  const statusRef = useRef(null);

  useEffect(() => {
    let completed = false;

    const finish = () => {
      if (completed) {
        return;
      }
      completed = true;
      onComplete?.();
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        '.preloader-glow',
        { scale: 0.72, autoAlpha: 0 },
        { scale: 1.08, autoAlpha: 1, duration: 1.1, ease: PRELOADER_EASE },
      );
      tl.fromTo(
        '.preloader-logo-shell',
        { y: 18, scale: 0.82, autoAlpha: 0, rotateX: -18, transformPerspective: 900 },
        { y: 0, scale: 1, autoAlpha: 1, rotateX: 0, duration: 0.95, ease: PRELOADER_EASE },
        '<+0.08',
      );
      tl.fromTo(
        '.preloader-line',
        { y: 16, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.56, stagger: 0.08, ease: 'power3.out' },
        '-=0.54',
      );
      tl.fromTo(
        '.preloader-bar-fill',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.06, ease: 'power2.inOut', transformOrigin: 'left center' },
        '-=0.36',
      );
      tl.to(
        statusRef.current,
        {
          duration: 0.24,
          text: 'Loading clear routines',
          ease: 'none',
        },
        0.2,
      );
      tl.to(
        statusRef.current,
        {
          duration: 0.24,
          text: 'Loading calmer handling',
          ease: 'none',
        },
        0.72,
      );
      tl.to(
        statusRef.current,
        {
          duration: 0.24,
          text: 'Preparing your experience',
          ease: 'none',
        },
        1.18,
      );
      tl.to(
        rootRef.current,
        {
          yPercent: -102,
          duration: 0.92,
          ease: PRELOADER_EASE,
          delay: 0.14,
          onComplete: finish,
        },
        1.54,
      );

      gsap.to('.preloader-chip--left', {
        duration: 2.8,
        repeat: -1,
        ease: 'none',
        motionPath: {
          path: [
            { x: 0, y: 0 },
            { x: -18, y: -22 },
            { x: -8, y: -42 },
            { x: 16, y: -16 },
            { x: 0, y: 0 },
          ],
          curviness: 1.25,
        },
      });
      gsap.to('.preloader-chip--right', {
        duration: 3.1,
        repeat: -1,
        ease: 'none',
        motionPath: {
          path: [
            { x: 0, y: 0 },
            { x: 18, y: -18 },
            { x: 28, y: 10 },
            { x: 10, y: 26 },
            { x: 0, y: 0 },
          ],
          curviness: 1.3,
        },
      });
      gsap.to('.preloader-grid-line', {
        backgroundPositionX: '140px',
        duration: 2.2,
        repeat: -1,
        ease: 'none',
      });
    }, rootRef);

    return () => {
      completed = true;
      ctx.revert();
    };
  }, [onComplete]);

  return (
    <Box
      ref={rootRef}
      aria-hidden="true"
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'grid',
        placeItems: 'center',
        px: 2,
        background:
          'radial-gradient(circle at 18% 18%, rgba(119,180,156,0.18), transparent 28%), radial-gradient(circle at 82% 16%, rgba(240,200,106,0.22), transparent 24%), linear-gradient(180deg, rgba(250,252,255,0.98) 0%, rgba(241,246,251,0.98) 100%)',
        backdropFilter: 'blur(14px)',
        overflow: 'hidden',
      }}
    >
      <Box
        className="preloader-grid-line"
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.26,
          backgroundImage:
            'linear-gradient(90deg, rgba(31,74,59,0.05) 0, rgba(31,74,59,0.05) 1px, transparent 1px, transparent 70px), linear-gradient(180deg, rgba(31,74,59,0.04) 0, rgba(31,74,59,0.04) 1px, transparent 1px, transparent 70px)',
          backgroundSize: '70px 70px',
        }}
      />
      <Box
        className="preloader-glow"
        sx={{
          position: 'absolute',
          width: { xs: 220, md: 320 },
          height: { xs: 220, md: 320 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(240,200,106,0.34), rgba(240,200,106,0) 68%)',
          filter: 'blur(18px)',
        }}
      />
      <Box sx={{ position: 'relative', width: '100%', maxWidth: 520, textAlign: 'center' }}>
        <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 3.5 }}>
          <Box
            className="preloader-chip--left"
            sx={{
              position: 'absolute',
              left: { xs: -14, md: -42 },
              top: { xs: 16, md: 26 },
              width: { xs: 44, md: 56 },
              height: { xs: 44, md: 56 },
              p: 0.6,
              borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.78)',
              border: '1px solid rgba(31,74,59,0.10)',
              boxShadow: '0px 16px 34px rgba(20, 37, 54, 0.08)',
            }}
          >
            <Box component="img" src={chipLeftIcon} alt="" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </Box>
          <Box
            className="preloader-logo-shell"
            sx={{
              width: { xs: 120, md: 148 },
              height: { xs: 120, md: 148 },
              p: 1.2,
              borderRadius: 5,
              bgcolor: 'rgba(255,255,255,0.78)',
              border: '1px solid rgba(31,74,59,0.10)',
              boxShadow: '0px 24px 54px rgba(19, 35, 29, 0.12)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <Box component="img" src={brandLogo} alt="BPKNINES logo" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </Box>
          <Box
            className="preloader-chip--right"
            sx={{
              position: 'absolute',
              right: { xs: -12, md: -36 },
              bottom: { xs: 18, md: 24 },
              width: { xs: 48, md: 60 },
              height: { xs: 48, md: 60 },
              p: 0.65,
              borderRadius: 3.2,
              bgcolor: 'rgba(255,255,255,0.78)',
              border: '1px solid rgba(31,74,59,0.10)',
              boxShadow: '0px 16px 34px rgba(20, 37, 54, 0.08)',
            }}
          >
            <Box component="img" src={chipRightIcon} alt="" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </Box>
        </Box>

        <Typography className="preloader-line" sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.76rem', mb: 1.4 }}>
          BPKNINES Dog Training Center
        </Typography>
        <Typography className="preloader-line" variant="h3" sx={{ mb: 1.2, fontSize: { xs: '2rem', md: '2.8rem' } }}>
          Calm. Clear. Ready.
        </Typography>
        <Typography className="preloader-line" ref={statusRef} sx={{ color: 'text.secondary', fontSize: { xs: '0.95rem', md: '1rem' }, mb: 2.6 }}>
          Loading stronger foundations
        </Typography>
        <Box sx={{ width: '100%', maxWidth: 360, mx: 'auto', height: 4, borderRadius: 999, bgcolor: 'rgba(31,74,59,0.10)', overflow: 'hidden' }}>
          <Box
            className="preloader-bar-fill"
            sx={{
              height: '100%',
              width: '100%',
              transform: 'scaleX(0)',
              transformOrigin: 'left center',
              background: 'linear-gradient(90deg, rgba(31,74,59,0.92) 0%, rgba(119,180,156,0.82) 58%, rgba(240,200,106,0.86) 100%)',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Preloader;
