import React, { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import vinzImg from '../assets/vinz.jpg';
import reneImg from '../assets/rene.jpg';
import rosellerImg from '../assets/roseller.jpg';
import khealImg from '../assets/kheal.jpg';
import CardAccentSvg from './CardAccentSvg';
import { addTitleScramble, prepareTitleWords, TITLE_REVEAL_EASE } from '../utils/titleFx';

gsap.registerPlugin(ScrollTrigger);

const imageMap = {
  vinz: vinzImg,
  rene: reneImg,
  roseller: rosellerImg,
  kheal: khealImg,
};

const Team = ({ siteContent }) => {
  const teamRef = useRef(null);
  const railRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const { team } = siteContent;

  const scrollToIndex = useCallback((index) => {
    const rail = railRef.current;
    if (!rail) return;
    const cards = rail.querySelectorAll('[data-team-index]');
    const safeIndex = Math.max(0, Math.min(index, cards.length - 1));
    const target = cards[safeIndex];
    if (!target) return;
    gsap.to(rail, {
      scrollLeft: target.offsetLeft - rail.offsetLeft,
      duration: 0.42,
      ease: 'power3.out',
      overwrite: 'auto',
    });
    setActiveIndex(safeIndex);
  }, []);

  useEffect(() => {
    const { words, masks, revert } = prepareTitleWords(teamRef.current, '.section-title');
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: teamRef.current,
          start: 'top 80%',
        },
      });

      tl.fromTo('.team-heading', { y: 24, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
      });
      if (masks.length) {
        tl.fromTo(masks, { yPercent: 100 }, { yPercent: 0, duration: 0.76, stagger: 0.04, ease: 'power3.out' }, '-=0.46');
      }
      if (words.length) {
        tl.fromTo(words, { yPercent: 118, autoAlpha: 0, rotateX: -70, transformOrigin: '0% 100%' }, {
          yPercent: 0,
          autoAlpha: 1,
          rotateX: 0,
          duration: 0.82,
          stagger: 0.04,
          ease: TITLE_REVEAL_EASE,
        }, '-=0.4');
        addTitleScramble(tl, words, '-=0.28');
      }
      tl.fromTo('.team-tag', { y: 18, autoAlpha: 0, scale: 0.96 }, {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
      }, '-=0.22');
      tl.fromTo('.team-rail-shell', { y: 30, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.72,
        ease: 'power3.out',
      }, '-=0.14');
      tl.fromTo('.team-member-card', { y: 30, autoAlpha: 0, scale: 0.985 }, {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.68,
        stagger: 0.08,
        ease: 'power3.out',
      }, '-=0.18');
    }, teamRef);

    return () => {
      ctx.revert();
      revert();
    };
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;
    let frame = null;
    const onScroll = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const cards = rail.querySelectorAll('[data-team-index]');
        const center = rail.scrollLeft + rail.clientWidth / 2;
        let nextIndex = 0;
        let smallestDelta = Number.POSITIVE_INFINITY;
        cards.forEach((card, index) => {
          const delta = Math.abs(card.offsetLeft + card.clientWidth / 2 - center);
          if (delta < smallestDelta) {
            smallestDelta = delta;
            nextIndex = index;
          }
        });
        setActiveIndex(nextIndex);
      });
    };
    rail.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      rail.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <Box id="team" ref={teamRef} className="premium-section" sx={{ py: { xs: 6.5, md: 8 }, position: 'relative' }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
        <Box className="premium-panel" sx={{ p: { xs: 2, md: 2.6 }, borderRadius: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) auto' }, gap: 2, alignItems: 'end', mb: expanded ? 2.2 : 0 }}>
          <Box sx={{ maxWidth: 760 }}>
            <Typography className="team-heading section-title" variant="h2" sx={{ mb: 1.2, fontSize: { xs: '1.95rem', md: '3rem' }, '& .gsap-title-word': { display: 'inline-block', transformOrigin: '0% 100%' } }}>
              {team.title}
            </Typography>
            <Typography className="team-heading" variant="body1" sx={{ color: 'text.secondary', mb: 1.4 }}>
              {team.description}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {team.tags.map((tag) => (
                <Box key={tag} className="team-tag" sx={{ px: 1.6, py: 0.8, borderRadius: 2, bgcolor: 'rgba(252, 250, 246, 0.8)', border: '1px solid rgba(38, 66, 54, 0.08)', color: 'primary.main', fontWeight: 700, fontSize: '0.88rem' }}>
                  {tag}
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifySelf: { xs: 'stretch', md: 'end' }, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={() => setExpanded((value) => !value)}
              endIcon={<KeyboardArrowDownRoundedIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 220ms ease' }} />}
              sx={{ width: { xs: '100%', md: 'auto' } }}
            >
              {expanded ? 'Hide Team' : 'Meet the Team'}
            </Button>
            {expanded ? (
              <>
                <Typography sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.82rem', minWidth: 56 }}>
                  {String(activeIndex + 1).padStart(2, '0')} / {String(team.members.length).padStart(2, '0')}
                </Typography>
                <IconButton aria-label="Previous team member" onClick={() => scrollToIndex(activeIndex - 1)} sx={{ border: '1px solid rgba(31, 74, 59, 0.14)', borderRadius: 1.5 }}>
                  <ArrowBackRoundedIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="Next team member" onClick={() => scrollToIndex(activeIndex + 1)} sx={{ border: '1px solid rgba(31, 74, 59, 0.14)', borderRadius: 1.5 }}>
                  <ArrowForwardRoundedIcon fontSize="small" />
                </IconButton>
              </>
            ) : null}
          </Box>
          </Box>

          <Collapse in={expanded} timeout={320}>
            <Box  sx={{ p: { xs: 1.4, md: 1.8 }, borderRadius: 2, overflow: 'hidden' }}>
              <Box
                ref={railRef}
                sx={{
                  display: 'flex',
                  gap: 2,
                  overflowX: 'auto',
                  scrollSnapType: 'x mandatory',
                  pb: 0.5,
                  '&::-webkit-scrollbar': { display: 'none' },
                  scrollbarWidth: 'none',
                }}
              >
                {team.members.map((member, index) => (
                  <Card key={member.name} data-team-index={index} sx={{ flex: { xs: '0 0 88%', sm: '0 0 58%', md: '0 0 34%' }, position: 'relative', overflow: 'hidden', borderRadius: 2, scrollSnapAlign: 'start' }}>
                    <CardAccentSvg variant={index % 2 === 0 ? 'arc' : 'grid'} />
                    <Box className="premium-media-frame" sx={{ overflow: 'hidden', minHeight: 280 }}>
                      <Box component="img" src={imageMap[member.imageKey]} alt={member.name} loading="lazy" decoding="async" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                    <CardContent sx={{ p: 2.4 }}>
                      <Typography variant="h5" sx={{ mb: 0.8 }}>
                        {member.name}
                      </Typography>
                      <Typography sx={{ display: 'inline-flex', px: 1.4, py: 0.65, borderRadius: 2, bgcolor: 'rgba(38, 66, 54, 0.08)', color: 'primary.main', fontWeight: 700, mb: 1.5, fontSize: '0.88rem' }}>
                        {member.role}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.4, lineHeight: 1.62 }}>
                        {member.bio}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 700, lineHeight: 1.58 }}>
                        {member.note}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </Collapse>
        </Box>
      </Container>
    </Box>
  );
};

export default Team;
