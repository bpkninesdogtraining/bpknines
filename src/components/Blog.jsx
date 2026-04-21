import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CardAccentSvg from './CardAccentSvg';
import { addTitleScramble, prepareTitleWords, TITLE_REVEAL_EASE } from '../utils/titleFx';

gsap.registerPlugin(ScrollTrigger);

const WORDPRESS_API_BASE = import.meta.env.VITE_WORDPRESS_API_BASE;

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildWordPressEndpoint(base) {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${normalizedBase}/wp-json/wp/v2/posts?_embed&per_page=3`;
}

function getStatusLabel(status) {
  if (status === 'ready') {
    return 'Live from WordPress';
  }
  if (status === 'loading') {
    return 'Loading recent posts';
  }
  if (status === 'error') {
    return 'Journal preview';
  }
  return 'Knowledge base preview';
}

const Blog = ({ siteContent }) => {
  const blogRef = useRef(null);
  const { journal } = siteContent;
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState(WORDPRESS_API_BASE ? 'loading' : 'unconfigured');

  useEffect(() => {
    const { words, masks, revert } = prepareTitleWords(blogRef.current, '.section-title');
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.blog-card');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: blogRef.current,
          start: 'top 82%',
        },
      });

      tl.fromTo('.blog-heading', { y: 22, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
      });
      tl.fromTo('.blog-screen', {
        y: 28,
        autoAlpha: 0,
        scale: 0.985,
      }, {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.82,
        ease: 'power3.out',
      }, '-=0.16');
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
        }, '-=0.42');
        addTitleScramble(tl, words, '-=0.28');
      }
      tl.fromTo('.blog-card', { y: 30, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power3.out',
      }, '-=0.2');
      cards.forEach((card) => {
        const mediaLift = card.classList.contains('blog-card--feature') ? -10 : -6;
        ScrollTrigger.create({
          trigger: card,
          start: 'top 82%',
          end: 'bottom 25%',
          onEnter: () => gsap.to(card, { y: mediaLift, duration: 0.45, ease: 'power2.out' }),
          onEnterBack: () => gsap.to(card, { y: mediaLift, duration: 0.45, ease: 'power2.out' }),
          onLeave: () => gsap.to(card, { y: 0, duration: 0.45, ease: 'power2.out' }),
          onLeaveBack: () => gsap.to(card, { y: 0, duration: 0.45, ease: 'power2.out' }),
        });
      });
      gsap.fromTo('.blog-aura', {
        xPercent: -8,
        scale: 0.92,
        autoAlpha: 0.24,
      }, {
        xPercent: 8,
        scale: 1.04,
        autoAlpha: 0.56,
        ease: 'none',
        scrollTrigger: {
          trigger: blogRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.9,
        },
      });
    }, blogRef);

    return () => {
      ctx.revert();
      revert();
    };
  }, []);

  useEffect(() => {
    if (!WORDPRESS_API_BASE) {
      return;
    }

    let active = true;

    fetch(buildWordPressEndpoint(WORDPRESS_API_BASE))
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load WordPress posts');
        }

        return response.json();
      })
      .then((data) => {
        if (!active) {
          return;
        }

        const normalizedPosts = data.map((post) => ({
          id: post.id,
          category: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Article',
          title: stripHtml(post.title?.rendered || 'Untitled post'),
          excerpt: stripHtml(post.excerpt?.rendered || '').slice(0, 170),
          meta: new Date(post.date).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          href: post.link,
        }));

        setPosts(normalizedPosts);
        setStatus(normalizedPosts.length ? 'ready' : 'empty');
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setStatus('error');
      });

    return () => {
      active = false;
    };
  }, []);

  const articles = status === 'ready' ? posts : journal.articles;
  const [featuredArticle, ...secondaryArticles] = articles;

  return (
    <Box id="blog" ref={blogRef} className="premium-section premium-section--tint" sx={{ py: { xs: 9, md: 13 }, position: 'relative' }}>
      <Box
        className="blog-aura"
        sx={{
          position: 'absolute',
          top: { xs: 104, md: 80 },
          right: { xs: '8%', md: '12%' },
          width: { xs: 220, md: 360 },
          height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(240,200,106,0.12), rgba(240,200,106,0))',
          filter: 'blur(24px)',
          pointerEvents: 'none',
        }}
      />
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
        <Box sx={{ textAlign: 'center', maxWidth: 760, mx: 'auto', mb: 5 }}>
          <Typography className="blog-heading" sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1.5, fontSize: '0.8rem' }}>
            {journal.eyebrow}
          </Typography>
          <Typography className="blog-heading section-title" variant="h2" sx={{ mb: 2.5, fontSize: { xs: '2.35rem', md: '4rem' }, '& .gsap-title-word': { display: 'inline-block', transformOrigin: '0% 100%' } }}>
            {journal.title}
          </Typography>
          <Typography className="blog-heading" variant="body1" sx={{ color: 'text.secondary' }}>
            {journal.description}
          </Typography>
        </Box>

        <Box
          className="blog-screen premium-screen"
          sx={{
            mb: { xs: 3, md: 4 },
            p: { xs: 2.5, md: 3.5 },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
            gap: { xs: 2.5, md: 3 },
            alignItems: 'stretch',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <CardAccentSvg variant="grid" sx={{ width: 160, height: 96, top: 18, right: 18, opacity: 0.42 }} />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.78rem', mb: 1.4 }}>
              {getStatusLabel(status)}
            </Typography>
            <Typography variant="h4" sx={{ mb: 1.25, fontSize: { xs: '1.7rem', md: '2.25rem' }, maxWidth: 520 }}>
              Practical reads that help fur parents understand what training actually looks like.
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 560 }}>
              Instead of generic tips, this section frames the concerns owners bring before they book: early routines, leash work, over-arousal, and follow-through at home.
            </Typography>
          </Box>
          <Stack spacing={1.2} sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ p: 1.5, borderRadius: 1.5, backgroundColor: 'rgba(255,255,255,0.82)', border: '1px solid rgba(38, 66, 54, 0.08)' }}>
              <Typography variant="body2" sx={{ fontWeight: 800, mb: 0.35 }}>
                Clear before booking
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Families can get a feel for the training style before they inquire.
              </Typography>
            </Box>
            <Box sx={{ p: 1.5, borderRadius: 1.5, backgroundColor: 'rgba(252,250,246,0.6)', border: '1px solid rgba(38, 66, 54, 0.08)' }}>
              <Typography variant="body2" sx={{ fontWeight: 800, mb: 0.35 }}>
                Stronger owner confidence
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Articles translate technical ideas into simple everyday behavior guidance.
              </Typography>
            </Box>
            <Box sx={{ p: 1.5, borderRadius: 1.5, backgroundColor: 'rgba(252,250,246,0.6)', border: '1px solid rgba(38, 66, 54, 0.08)' }}>
              <Typography variant="body2" sx={{ fontWeight: 800, mb: 0.35 }}>
                Built to expand
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                The section already supports live WordPress posts when the feed is available.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {featuredArticle && (
            <Grid size={{ xs: 12, md: 7 }}>
              <Card className="blog-card blog-card--feature premium-panel" sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
                <CardAccentSvg variant="grid" sx={{ width: 168, height: 98, top: 16, right: 18, opacity: 0.5 }} />
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.8rem', mb: 2 }}>
                    Featured read
                  </Typography>
                  <Typography variant="h4" sx={{ mb: 1.2, maxWidth: 560, fontSize: { xs: '1.7rem', md: '2.35rem' } }}>
                    {featuredArticle.title}
                  </Typography>
                  <Typography sx={{ color: 'primary.main', fontWeight: 700, mb: 1.75 }}>
                    {featuredArticle.category}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2.8, maxWidth: 640 }}>
                    {featuredArticle.excerpt}
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} sx={{ alignItems: { sm: 'center' } }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                      {featuredArticle.meta}
                    </Typography>
                    {featuredArticle.href ? (
                      <Button href={featuredArticle.href} target="_blank" rel="noreferrer" variant="text" sx={{ px: 0, width: 'fit-content' }}>
                        Continue reading
                      </Button>
                    ) : (
                      <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 700 }}>
                        Sample resource preview
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={3}>
              {secondaryArticles.map((article) => (
                <Card key={article.id || article.title} className="blog-card premium-panel" sx={{ position: 'relative', overflow: 'hidden' }}>
                  <CardAccentSvg variant="grid" />
                  <CardContent sx={{ p: 3.2 }}>
                    <Typography sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.8rem', mb: 1.75 }}>
                      {article.category}
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 1.75 }}>
                      {article.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.2 }}>
                      {article.excerpt}
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.1} sx={{ alignItems: { sm: 'center' } }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                        {article.meta}
                      </Typography>
                      {article.href ? (
                        <Button href={article.href} target="_blank" rel="noreferrer" variant="text" sx={{ px: 0, width: 'fit-content' }}>
                          Continue reading
                        </Button>
                      ) : (
                        <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 700 }}>
                          Sample resource preview
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Blog;
