import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import launcherIcon from '../assets/BPK9Icons/android/mipmap-xxhdpi/ic_launcher.png';
import badgeIconMd from '../assets/BPK9Icons/Assets.xcassets/AppIcon.appiconset/128.png';
import badgeIconSm from '../assets/BPK9Icons/Assets.xcassets/AppIcon.appiconset/64.png';

gsap.registerPlugin(ScrollTrigger);

const tokens = [
  'Calm dogs',
  'Clear structure',
  'Owner confidence',
  'Real-world obedience',
  'Balanced routines',
  'Behavior resets',
  'Proofed under distraction',
];

const brandIcons = [launcherIcon, badgeIconMd, badgeIconSm];

const MomentumStrip = () => {
  const stripRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const loops = [];

      if (prefersReducedMotion) {
        gsap.set('.momentum-track', { clearProps: 'transform' });
        gsap.set('.momentum-badge', { clearProps: 'transform' });
        return;
      }

      loops.push(gsap.to('.momentum-track', {
        xPercent: -50,
        duration: 24,
        repeat: -1,
        ease: 'none',
      }));
      loops.push(gsap.to('.momentum-badge', {
        y: -2,
        scale: 1.04,
        duration: 2.6,
        stagger: 0.12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      }));

      ScrollTrigger.create({
        trigger: stripRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => loops.forEach((loop) => loop.play()),
        onEnterBack: () => loops.forEach((loop) => loop.play()),
        onLeave: () => loops.forEach((loop) => loop.pause()),
        onLeaveBack: () => loops.forEach((loop) => loop.pause()),
      });
    }, stripRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box
      ref={stripRef}
      className="premium-section"
      sx={{
        borderTop: '1px solid rgba(31, 74, 59, 0.10)',
        borderBottom: '1px solid rgba(31, 74, 59, 0.10)',
        py: 1.6,
        overflow: 'hidden',
        bgcolor: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <Box className="momentum-track" sx={{ display: 'inline-flex', whiteSpace: 'nowrap' }}>
        {[...tokens, ...tokens].map((item, index) => (
          <Box key={`${item}-${index}`} sx={{ display: 'inline-flex', alignItems: 'center' }}>
            <Box
              className="momentum-badge"
              sx={{
                width: 28,
                height: 28,
                mx: 1.2,
                p: 0.35,
                borderRadius: 1.8,
                bgcolor: 'rgba(255,255,255,0.82)',
                border: '1px solid rgba(31,74,59,0.10)',
                boxShadow: '0px 10px 24px rgba(20, 37, 54, 0.05)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Box component="img" src={brandIcons[index % brandIcons.length]} alt="" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </Box>
            <Typography
              sx={{
                mx: 1.3,
                color: 'primary.main',
                fontWeight: 750,
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
              }}
            >
              {item}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MomentumStrip;
