import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

const MotionBackdrop = () => {
  const backdropRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        gsap.set('.motion-orb-a, .motion-orb-b, .motion-orb-c, .motion-grid, .motion-morph-path', { clearProps: 'all' });
        gsap.set('.motion-grid', { autoAlpha: 0.22 });
        gsap.set('.motion-orb-a, .motion-orb-b, .motion-orb-c', { autoAlpha: 0.7 });
        return;
      }

      gsap.to('.motion-orb-a', {
        duration: 22,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        motionPath: {
          path: [
            { x: 0, y: 0 },
            { x: 56, y: 26 },
            { x: 86, y: 8 },
            { x: 22, y: -18 },
            { x: 0, y: 0 },
          ],
          curviness: 1.2,
        },
      });
      gsap.to('.motion-orb-b', {
        duration: 25,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        motionPath: {
          path: [
            { x: 0, y: 0 },
            { x: -66, y: 14 },
            { x: -38, y: 56 },
            { x: 12, y: 16 },
            { x: 0, y: 0 },
          ],
          curviness: 1.25,
        },
      });
      gsap.to('.motion-orb-c', {
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        motionPath: {
          path: [
            { x: 0, y: 0 },
            { x: -36, y: -12 },
            { x: -64, y: -46 },
            { x: 20, y: -16 },
            { x: 0, y: 0 },
          ],
          curviness: 1.2,
        },
      });
      gsap.to('.motion-grid', {
        y: -12,
        duration: 16,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.motion-morph-path', {
        duration: 16,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        attr: {
          d: 'M44,75 C78,28 142,36 173,79 C197,113 180,172 132,184 C94,194 52,172 39,136 C31,110 25,97 44,75 Z',
        },
      });
    }, backdropRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box
      ref={backdropRef}
      sx={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <Box
        className="motion-grid"
        sx={{
          position: 'absolute',
          inset: '-20% 0 auto',
          height: 560,
          opacity: 0.2,
          backgroundImage:
            'linear-gradient(to right, rgba(31,74,59,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(31,74,59,0.10) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.56), transparent)',
        }}
      />
      <Box
        className="motion-orb-a"
        sx={{
          position: 'absolute',
          top: -120,
          left: -120,
          width: 420,
          height: 420,
          borderRadius: '50%',
          filter: 'blur(30px)',
          background: 'radial-gradient(circle at 34% 34%, rgba(119,180,156,0.28), rgba(119,180,156,0))',
        }}
      />
      <Box
        className="motion-orb-b"
        sx={{
          position: 'absolute',
          top: 120,
          right: -130,
          width: 400,
          height: 400,
          borderRadius: '50%',
          filter: 'blur(30px)',
          background: 'radial-gradient(circle at 42% 42%, rgba(240,200,106,0.24), rgba(240,200,106,0))',
        }}
      />
      <Box
        className="motion-orb-c"
        sx={{
          position: 'absolute',
          bottom: -170,
          left: '30%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          filter: 'blur(34px)',
          background: 'radial-gradient(circle at 50% 50%, rgba(132,166,215,0.18), rgba(132,166,215,0))',
        }}
      />
      <Box sx={{ position: 'absolute', right: { xs: -80, md: 30 }, bottom: { xs: 50, md: 110 }, width: { xs: 210, md: 300 }, opacity: 0.34 }}>
        <svg viewBox="0 0 220 220" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id="motion-morph-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(122,175,156,0.46)" />
              <stop offset="100%" stopColor="rgba(240,200,106,0.34)" />
            </linearGradient>
          </defs>
          <path
            className="motion-morph-path"
            d="M52,92 C62,42 122,22 162,57 C196,84 190,140 152,167 C117,192 61,175 44,137 C36,119 39,108 52,92 Z"
            fill="url(#motion-morph-grad)"
          />
          <path
            className="motion-morph-shape-b"
            d="M44,75 C78,28 142,36 173,79 C197,113 180,172 132,184 C94,194 52,172 39,136 C31,110 25,97 44,75 Z"
            fill="none"
            opacity="0"
          />
        </svg>
      </Box>
    </Box>
  );
};

export default MotionBackdrop;
