import React, { Suspense, lazy, startTransition, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MotionBackdrop from './components/MotionBackdrop';
import MomentumStrip from './components/MomentumStrip';
import Preloader from './components/Preloader';
import { siteContent as fallbackSiteContent } from './content/siteContent';

const importCoachHighlight = () => import('./components/CoachHighlight');
const importMethodology = () => import('./components/Methodology');
const importServices = () => import('./components/Services');
const importDogBoarding = () => import('./components/DogBoarding');
const importProcessFlow = () => import('./components/ProcessFlow');
const importShowreel = () => import('./components/Showreel');
const importTestimonials = () => import('./components/Testimonials');
const importTeam = () => import('./components/Team');
const importBlog = () => import('./components/Blog');
const importEnrollment = () => import('./components/Enrollment');
const importFAQ = () => import('./components/FAQ');
const importFooter = () => import('./components/Footer');

const CoachHighlight = lazy(importCoachHighlight);
const Methodology = lazy(importMethodology);
const Services = lazy(importServices);
const ProcessFlow = lazy(importProcessFlow);
const Showreel = lazy(importShowreel);
const Team = lazy(importTeam);
const Testimonials = lazy(importTestimonials);
const Blog = lazy(importBlog);
const FAQ = lazy(importFAQ);
const Footer = lazy(importFooter);
const Enrollment = lazy(importEnrollment);
const DogBoarding = lazy(importDogBoarding);

function SectionFallback() {
  return (
    <Box
      className="section-placeholder"
      sx={{
        minHeight: { xs: 120, md: 160 },
        mx: { xs: 2, md: 4 },
        my: { xs: 2.5, md: 3 },
        borderRadius: 2,
      }}
    />
  );
}

function queueIdleWork(callback) {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, { timeout: 1800 });
  }

  return window.setTimeout(callback, 360);
}

function getCurrentPath() {
  if (typeof window === 'undefined') {
    return '/';
  }

  const normalized = window.location.pathname.replace(/\/+$/, '');
  return normalized || '/';
}

function navigateTo(path) {
  if (typeof window === 'undefined') {
    return;
  }

  if (window.location.pathname === path) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('popstate'));
}

function ResourceLinks() {
  return (
    <Box id='book_assessment' className="premium-section premium-section--tint" sx={{ py: { xs: 4.5, md: 1 }, position: 'relative' }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
        <Box className="premium-panel" sx={{ p: { xs: 2.2, md: 2.8 }, borderRadius: 2, border: '1px solid rgba(31, 74, 59, 0.10)' }}>
          {/* <Typography sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1, fontSize: '0.8rem' }}>
            More to Explore
          </Typography> */}
             <iframe src="https://api.leadconnectorhq.com/widget/booking/609qxXf5ntwBICuUzu6p" style={{ width: '100%', height: 900, border: 'none', overflow: 'hidden' }} scrolling={"yes"} id={"Elmm4Ehs2CY4J8SwUQOi_1780906906673"}></iframe>
             <script src="https://link.msgsndr.com/js/form_embed.js" type="text/javascript"></script>
  
          <Typography variant="h4" sx={{ fontSize: { xs: '1.35rem', md: '1.7rem' }, lineHeight: 1.12, mb: 0.9 }}>
            Need more detail before booking?
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 680, mb: 1.8 }}>
            Open the FAQ for quick answers, the approach page for training philosophy, or the knowledge base for deeper reads. The home page stays focused on programs and results.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2 }}>
            <Button variant="outlined" onClick={() => navigateTo('/faq')}>
              Open FAQ
            </Button>
            <Button variant="outlined" onClick={() => navigateTo('/approach')}>
              Open Approach
            </Button>
            <Button variant="outlined" onClick={() => navigateTo('/knowledge-base')}>
              Open Knowledge Base
            </Button>
           
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

function App() {
  const [siteContent, setSiteContent] = useState(fallbackSiteContent);
  const [showPreloader, setShowPreloader] = useState(true);
  const [path, setPath] = useState(getCurrentPath);
  const lazyImports = useMemo(
    () => [
      importCoachHighlight,
      importMethodology,
      importServices,
      importEnrollment,
      importDogBoarding,
      importProcessFlow,
      importShowreel,
      importTestimonials,
      importTeam,
      importBlog,
      importFAQ,
      importFooter,
    ],
    [],
  );

  useEffect(() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return;
    }

    let active = true;

    fetch('/api/site')
      .then(async (response) => {
        if (!response.ok) {
          return null;
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          return null;
        }

        return response.json();
      })
      .then((data) => {
        if (!active || !data) {
          return;
        }

        startTransition(() => {
          setSiteContent(data);
        });
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('preloading', showPreloader);
    return () => {
      document.body.classList.remove('preloading');
    };
  }, [showPreloader]);

  useEffect(() => {
    const syncPath = () => {
      setPath(getCurrentPath());
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    window.addEventListener('popstate', syncPath);
    return () => {
      window.removeEventListener('popstate', syncPath);
    };
  }, []);

  useEffect(() => {
    if (showPreloader) {
      return undefined;
    }

    let cancelled = false;
    const scheduledHandles = [];

    const idleHandle = queueIdleWork(() => {
      if (cancelled) {
        return;
      }

      lazyImports.forEach((loader, index) => {
        const handle = window.setTimeout(() => {
          if (!cancelled) {
            loader();
          }
        }, index * 120);
        scheduledHandles.push(handle);
      });
    });

    return () => {
      cancelled = true;
      if (typeof window !== 'undefined' && 'cancelIdleCallback' in window && typeof idleHandle === 'number') {
        window.cancelIdleCallback(idleHandle);
      } else {
        window.clearTimeout(idleHandle);
      }
      scheduledHandles.forEach((handle) => window.clearTimeout(handle));
    };
  }, [lazyImports, showPreloader]);

  return (
    <Box id="smooth-wrapper" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'visible' }}>
      {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}
      <MotionBackdrop />
      <Box id="smooth-content" sx={{ position: 'relative', minHeight: '100%' }}>
        <Navbar siteContent={siteContent} currentPath={path} />
        <Box component="main" sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
          {path === '/faq' ? (
            <Suspense fallback={<SectionFallback />}>
              <FAQ siteContent={siteContent} />
            </Suspense>
          ) : path === '/approach' ? (
            <Suspense fallback={<SectionFallback />}>
              <Methodology siteContent={siteContent} />
            </Suspense>
          ) : path === '/knowledge-base' ? (
            <Suspense fallback={<SectionFallback />}>
              <Blog siteContent={siteContent} />
            </Suspense>
          // ) : path === '/enrollment' ? (
          //   <Suspense fallback={<SectionFallback />}>
          //     <Enrollment siteContent={siteContent} />
          //   </Suspense>
            
          ) : (
            <>
              <Hero siteContent={siteContent} />
              <Suspense fallback={<SectionFallback />}>
                <Services siteContent={siteContent} />
              </Suspense>
               <Suspense fallback={<SectionFallback />}>
                <Enrollment siteContent={siteContent} />
              </Suspense>
              <Suspense fallback={<SectionFallback />}>
                <DogBoarding siteContent={siteContent} />
              </Suspense>
              
              <Suspense fallback={<SectionFallback />}>
                <ProcessFlow siteContent={siteContent} />
              </Suspense>
              <MomentumStrip />
              <Suspense fallback={<SectionFallback />}>
                <CoachHighlight siteContent={siteContent} />
              </Suspense>
              <Suspense fallback={<SectionFallback />}>
                <Showreel />
              </Suspense>
              <Suspense fallback={<SectionFallback />}>
                <Testimonials siteContent={siteContent} />
              </Suspense>
              <Suspense fallback={<SectionFallback />}>
                <Team siteContent={siteContent} />
              </Suspense>
              <ResourceLinks />
            </>
          )}
        </Box>
        <Suspense fallback={<SectionFallback />}>
          <Footer siteContent={siteContent} />
        </Suspense>
      </Box>
    </Box>
  );
}

export default App;
