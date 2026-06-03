import React, { useEffect, useMemo, useRef, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import logoImg from '../assets/BPK9Icons/android/mipmap-xxhdpi/bpknineslogonobg.png';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Flip);

function navigateTo(href) {
  if (typeof window === 'undefined') {
    return;
  }

  if (window.location.pathname === href) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  window.history.pushState({}, '', href);
  window.dispatchEvent(new Event('popstate'));
}

const Navbar = ({ siteContent, currentPath = '/' }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHref, setActiveHref] = useState('');
  const navRef = useRef(null);
  const toolbarRef = useRef(null);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const desktopNavRef = useRef(null);
  const isHomeRoute = currentPath === '/';
  const navItems = useMemo(
    () =>
      isHomeRoute
        ? [
          { label: 'Training Programs', href: '#services' },
          { label: 'Coach', href: '#coach-vinz' },
          { label: 'Results', href: '#showreel' },
          { label: 'Guides', href: '/knowledge-base' },
          { label: 'FAQ', href: '/faq' },
          { label: 'Contact', href: '#contact' },
        ]
        : [
          { label: 'Home', href: '/' },
          { label: 'Approach', href: '/approach' },
          { label: 'Knowledge Base', href: '/knowledge-base' },
          { label: 'FAQ', href: '/faq' },
          { label: 'Contact', href: '#contact' },
        ],
    [isHomeRoute]
  );
  const messageUsHref = siteContent.contact?.primaryCta?.href || '#contact';
  const messageUsIsExternal = /^https?:\/\//.test(messageUsHref);
  const handleNavClick = (event, href, shouldCloseMobile = false) => {
    if (shouldCloseMobile) {
      setMobileOpen(false);
    }

    if (!href) {
      return;
    }

    if (href.startsWith('/')) {
      event.preventDefault();
      navigateTo(href);
      return;
    }

    if (!href.startsWith('#')) {
      return;
    }

    const target = document.querySelector(href);
    if (!target) {
      return;
    }

    event.preventDefault();
    gsap.to(window, {
      duration: 0.9,
      ease: 'power3.out',
      scrollTo: {
        y: target,
        offsetY: 84,
      },
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(navRef.current, { yPercent: -100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'power4.out' });
      tl.fromTo('.nav-brand', { x: -20, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, '-=0.35');
      tl.fromTo('.nav-item', { y: -10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out' }, '-=0.28');
      tl.fromTo('.nav-cta', { y: -10, autoAlpha: 0, scale: 0.96 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.45, ease: 'power2.out' }, '-=0.24');
      gsap.to('.nav-progress', {
        scaleX: 1,
        ease: 'none',
        transformOrigin: 'left center',
        scrollTrigger: {
          start: 0,
          end: 'max',
          scrub: 0.3,
        },
      });
      ScrollTrigger.create({
        start: 20,
        end: 'max',
        onUpdate: (self) => {
          const compact = self.scroll() > 24;
          gsap.to(navRef.current, {
            backgroundColor: compact ? 'rgba(252, 252, 250, 0.90)' : 'rgba(252, 252, 250, 0.76)',
            borderBottomColor: compact ? 'rgba(38, 66, 54, 0.10)' : 'rgba(38, 66, 54, 0.06)',
            boxShadow: compact ? '0px 10px 30px rgba(18, 30, 25, 0.06)' : '0px 0px 0px rgba(18, 30, 25, 0)',
            duration: 0.28,
            ease: 'power2.out',
            overwrite: 'auto',
          });
          gsap.to(toolbarRef.current, {
            minHeight: compact ? 58 : 68,
            paddingTop: compact ? 6 : 12,
            paddingBottom: compact ? 6 : 12,
            duration: 0.28,
            ease: 'power2.out',
            overwrite: 'auto',
          });
          gsap.to(logoRef.current, {
            width: compact ? 36 : 42,
            height: compact ? 36 : 42,
            borderRadius: compact ? 8 : 10,
            duration: 0.28,
            ease: 'power2.out',
            overwrite: 'auto',
          });
          gsap.to(titleRef.current, {
            fontSize: compact ? '0.94rem' : '1rem',
            letterSpacing: compact ? '-0.024em' : '-0.02em',
            duration: 0.28,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        },
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!isHomeRoute) {
      setActiveHref(currentPath);
      return undefined;
    }

    const sectionItems = navItems.filter((item) => item.href?.startsWith('#'));
    const triggers = sectionItems
      .map((item) => {
        const section = document.querySelector(item.href);
        if (!section) {
          return null;
        }

        return ScrollTrigger.create({
          trigger: section,
          start: 'top center+=40',
          end: 'bottom center',
          onEnter: () => setActiveHref(item.href),
          onEnterBack: () => setActiveHref(item.href),
        });
      })
      .filter(Boolean);

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [currentPath, isHomeRoute, navItems]);

  useEffect(() => {
    const nav = desktopNavRef.current;
    if (!nav) {
      return;
    }

    const indicator = nav.querySelector('.nav-active-pill');
    const activeItem = activeHref ? nav.querySelector(`[data-nav-href="${activeHref}"]`) : null;
    if (!indicator) {
      return;
    }

    if (!activeItem) {
      gsap.to(indicator, {
        autoAlpha: 0,
        duration: 0.2,
        ease: 'power2.out',
      });
      return;
    }

    const state = Flip.getState(indicator);
    activeItem.appendChild(indicator);
    gsap.set(indicator, { autoAlpha: 1 });
    Flip.from(state, {
      duration: 0.42,
      ease: 'power2.out',
      absolute: true,
    });
  }, [activeHref]);

  return (
    <AppBar
      ref={navRef}
      // position="sticky"
      position="fixed"
      elevation={0}
      sx={{
        top: 0,
        zIndex: 1200,
        bgcolor: 'rgba(252, 252, 250, 0.76)',
        backdropFilter: 'blur(22px)',
        borderBottom: '1px solid rgba(38, 66, 54, 0.06)',
      }}
    >
      <Box
        className="nav-progress"
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '2px',
          transform: 'scaleX(0)',
          transformOrigin: 'left center',
          background: 'linear-gradient(90deg, #5e7315 0%, #a5bd45 55%, #f1d11b 100%)',
        }}
      />
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
        <Toolbar ref={toolbarRef} disableGutters sx={{ justifyContent: 'space-between', py: 0.75, minHeight: '68px !important' }}>
          <Box className="nav-brand" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box ref={logoRef} component="img" src={logoImg} alt={`${siteContent.brand.name} logo`} sx={{ height: 50, width: 50, borderRadius: 2.5, objectFit: 'cover' }} />
            <Typography
              ref={titleRef}
              variant="h6"
              sx={{
                fontWeight: 650,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                fontSize: '1.5rem',
                color: 'black'
              }}
            >
              BPKNines Dog Training Center 
            </Typography>
          </Box>

          <Box ref={desktopNavRef} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.65, position: 'relative' }}>
            {navItems.map((item) => (
              <Box
                key={item.label}
                className="nav-item"
                data-nav-href={item.href}
                sx={{ position: 'relative', borderRadius: 999 }}
              >
                <Typography
                  component="a"
                  href={item.href}
                  onClick={(event) => handleNavClick(event, item.href)}
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'block',
                    color: activeHref === item.href ? 'text.primary' : 'rgba(29, 40, 35, 0.78)',
                    textDecoration: 'none',
                    fontSize: '0.82rem',
                    fontWeight: activeHref === item.href ? 600 : 500,
                    letterSpacing: '-0.01em',
                    px: 1.35,
                    py: 0.7,
                    borderRadius: 999,
                    '&:hover': {
                      color: 'text.primary',
                    },
                    transition: 'color 0.2s ease, font-weight 0.2s ease',
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            ))}
            <Box
              className="nav-active-pill"
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                borderRadius: 999,
                bgcolor: 'rgba(31, 74, 59, 0.06)',
                border: '1px solid rgba(31, 74, 59, 0.10)',
                boxShadow: '0px 10px 24px rgba(18, 30, 25, 0.05)',
                pointerEvents: 'none',
                display: 'block',
                opacity: 0,
              }}
            />
            <Button
              className="nav-cta"
              variant="contained"
              color="primary"
              size="small"
              href={messageUsHref}
              target={messageUsIsExternal ? '_blank' : undefined}
              rel={messageUsIsExternal ? 'noreferrer' : undefined}
              sx={{ ml: 1, minWidth: 126 }}
              onClick={(event) => handleNavClick(event, messageUsHref)}
            >
              Message Us
            </Button>
          </Box>

          <IconButton color="inherit" aria-label="open drawer" edge="end" onClick={() => setMobileOpen((open) => !open)} sx={{ display: { md: 'none' }, color: 'text.primary' }}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 300, bgcolor: '#fcfaf6', p: 1.5 },
        }}
      >
        <Box sx={{ textAlign: 'left', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 2 }}>
            <Box component="img" src={logoImg} alt={`${siteContent.brand.name} logo`} sx={{ height: 42, width: 42, borderRadius: 2.5, objectFit: 'cover' }} />
            <Typography variant="h6" sx={{ fontWeight: 650, lineHeight: 1.05, letterSpacing: '-0.02em', fontSize: '1rem' }}>
              Dog Training Center
            </Typography>
          </Box>
          <Divider sx={{ mx: 1.5, mb: 1 }} />
          <List sx={{ flexGrow: 1 }}>
            {navItems.map((item) => (
                <ListItem key={item.label} disablePadding>
                <ListItemButton
                  component="a"
                  href={item.href}
                  onClick={(event) => handleNavClick(event, item.href, true)}
                  sx={{
                    borderRadius: 2,
                    py: 1.6,
                    mb: 0.35,
                    bgcolor: activeHref === item.href ? 'rgba(31, 74, 59, 0.06)' : 'transparent',
                  }}
                >
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: activeHref === item.href ? 600 : 500, fontSize: '0.94rem', letterSpacing: '-0.01em', color: activeHref === item.href ? 'text.primary' : 'text.secondary' }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            color="primary"
            href={messageUsHref}
            target={messageUsIsExternal ? '_blank' : undefined}
            rel={messageUsIsExternal ? 'noreferrer' : undefined}
            sx={{ m: 1.5 }}
            onClick={(event) => handleNavClick(event, messageUsHref, true)}
          >
            Message Us
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
