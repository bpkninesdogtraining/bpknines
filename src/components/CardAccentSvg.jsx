import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import gsap from 'gsap';

const variants = {
  arc: (
    <>
      <defs>
        <linearGradient id="card-accent-arc" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(131, 174, 157, 0.42)" />
          <stop offset="100%" stopColor="rgba(240, 200, 106, 0.28)" />
        </linearGradient>
      </defs>
      <path className="card-accent-path" d="M10 90 C 45 22, 115 18, 170 26 C 212 33, 246 58, 280 80" fill="none" stroke="url(#card-accent-arc)" strokeWidth="2.5" />
      <circle cx="55" cy="52" r="3.5" fill="rgba(31, 74, 59, 0.25)" />
      <circle cx="218" cy="46" r="2.5" fill="rgba(31, 74, 59, 0.2)" />
    </>
  ),
  grid: (
    <>
      <defs>
        <linearGradient id="card-accent-grid" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(128, 170, 154, 0.24)" />
          <stop offset="100%" stopColor="rgba(240, 200, 106, 0.18)" />
        </linearGradient>
      </defs>
      <rect x="20" y="14" width="76" height="52" rx="8" fill="url(#card-accent-grid)" />
      <path className="card-accent-path" d="M20 31 H96 M20 48 H96 M45 14 V66 M70 14 V66" stroke="rgba(31, 74, 59, 0.16)" strokeWidth="1" />
      <path className="card-accent-path" d="M132 24 C166 14, 206 20, 242 36" fill="none" stroke="rgba(31, 74, 59, 0.18)" strokeWidth="2" />
      <path className="card-accent-path" d="M132 47 C165 37, 205 42, 246 58" fill="none" stroke="rgba(240, 200, 106, 0.25)" strokeWidth="2" />
    </>
  ),
  wave: (
    <>
      <defs>
        <linearGradient id="card-accent-wave" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(31, 74, 59, 0.2)" />
          <stop offset="100%" stopColor="rgba(240, 200, 106, 0.2)" />
        </linearGradient>
      </defs>
      <path className="card-accent-path" d="M16 68 C 52 38, 80 36, 117 56 C 152 74, 178 73, 213 50 C 237 35, 255 34, 286 48" fill="none" stroke="url(#card-accent-wave)" strokeWidth="2.8" />
      <path className="card-accent-path" d="M16 86 C 58 57, 84 55, 122 74 C 159 92, 180 90, 224 67 C 245 56, 261 56, 286 64" fill="none" stroke="rgba(31, 74, 59, 0.16)" strokeWidth="1.8" />
    </>
  ),
};

const CardAccentSvg = ({ variant = 'arc', sx }) => {
  const wrapRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray('.card-accent-path');
      if (!lines.length) {
        return;
      }

      const strokeLengths = lines.map((line) => {
        const length = line.getTotalLength();
        line.style.strokeDasharray = `${length} ${length}`;
        line.style.strokeDashoffset = `${length}`;
        return length;
      });

      gsap.fromTo(
        lines,
        { autoAlpha: 0.25 },
        {
          strokeDashoffset: 0,
          autoAlpha: 1,
          duration: 1.15,
          stagger: 0.14,
          ease: 'power2.out',
        },
      );
      gsap.to(lines, {
        strokeDashoffset: (index) => -strokeLengths[index] * 0.12,
        duration: 2.8,
        stagger: 0.08,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, wrapRef);

    return () => ctx.revert();
  }, [variant]);

  return (
    <Box
      ref={wrapRef}
      sx={{
        position: 'absolute',
        top: 12,
        right: 12,
        width: 132,
        height: 78,
        opacity: 0.65,
        pointerEvents: 'none',
        ...sx,
      }}
    >
      <svg viewBox="0 0 300 100" width="100%" height="100%" aria-hidden="true">
        {variants[variant] || variants.arc}
      </svg>
    </Box>
  );
};

export default CardAccentSvg;
