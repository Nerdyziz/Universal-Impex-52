"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useCart } from '@/context/CartContext';
import { useIntro } from '@/context/IntroContext';
import { ShoppingCart } from 'lucide-react';

const PillNav = ({
  logo, 
  logoAlt = 'Logo',
  items,
  activeHref,
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#fff',
  pillColor = '#060010',
  hoveredPillTextColor = '#060010',
  pillTextColor,
  onMobileMenuClick,
  initialLoadAnimation = true,
  glassBase = false 
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pillDarkBg, setPillDarkBg] = useState([]); 
  
  // Logo color change states
  const [logoDarkBg, setLogoDarkBg] = useState(false);
  const [mobileLogoDarkBg, setMobileLogoDarkBg] = useState(false);

  const { cartCount } = useCart();
  const { introComplete, introActive } = useIntro();
  const hasPlayedEntrance = useRef(false);
  
  const circleRefs = useRef([]);
  const pillRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  
  const desktopLogoRef = useRef(null);
  const mobileLogoRef = useRef(null);
  const desktopLogoImgRef = useRef(null);
  const mobileLogoImgRef = useRef(null);

  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navItemsRef = useRef(null);
  const cartRef = useRef(null);
  const navContainerRef = useRef(null); 
  const rafIdRef = useRef(null);
  
  const [cartDarkBg, setCartDarkBg] = useState(false);
  const [mobileDarkBg, setMobileDarkBg] = useState(false);

  const pillDarkBgRef = useRef([]);
  const cartDarkBgRef = useRef(false);
  const mobileDarkBgRef = useRef(false);
  const logoDarkBgRef = useRef(false);
  const mobileLogoDarkBgRef = useRef(false);

  useEffect(() => {
    if (!glassBase) return;

    let pending = false;

    const getBgLuminance = (x, y) => {
      const el = document.elementFromPoint(x, y);
      if (!el) return 0.9; 

      let target = el;
      let rAcc = 255, gAcc = 255, bAcc = 255;

      const layers = [];
      while (target && target !== document.documentElement) {
        const bg = window.getComputedStyle(target).backgroundColor;
        const mComma = bg.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        const mSpace = bg.match(/rgba?\(\s*(\d+)\s+(\d+)\s+(\d+)\s*(?:\/\s*([\d.]+))?\s*\)/);
        const m = mComma || mSpace;
        if (m) {
          const alpha = m[4] !== undefined ? parseFloat(m[4]) : 1;
          if (alpha > 0.05) {
            layers.push({
              r: parseInt(m[1]),
              g: parseInt(m[2]),
              b: parseInt(m[3]),
              a: alpha,
            });
          }
        }
        target = target.parentElement;
      }

      for (let i = layers.length - 1; i >= 0; i--) {
        const { r, g, b, a } = layers[i];
        rAcc = r * a + rAcc * (1 - a);
        gAcc = g * a + gAcc * (1 - a);
        bAcc = b * a + bAcc * (1 - a);
      }

      const lum = (0.299 * rAcc + 0.587 * gAcc + 0.114 * bAcc) / 255;
      return lum;
    };

    const detectBg = () => {
      if (pending) return;
      pending = true;

      rafIdRef.current = requestAnimationFrame(() => {
        pending = false;
        const nav = navContainerRef.current;
        if (!nav) return;

        nav.style.visibility = 'hidden';

        const newDarkStates = pillRefs.current.map(pillEl => {
          if (!pillEl) return false;
          const rect = pillEl.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const lum = getBgLuminance(cx, cy);
          return lum < 0.45;
        });

        let newCartDark = false;
        const cartEl = cartRef.current;
        if (cartEl) {
          const cartRect = cartEl.getBoundingClientRect();
          const cx = cartRect.left + cartRect.width / 2;
          const cy = cartRect.top + cartRect.height / 2;
          const lum = getBgLuminance(cx, cy);
          newCartDark = lum < 0.45;
        }

        let newMobileDark = false;
        const hamburgerEl = hamburgerRef.current;
        if (hamburgerEl) {
          const hRect = hamburgerEl.getBoundingClientRect();
          const cx = hRect.left + hRect.width / 2;
          const cy = hRect.top + hRect.height / 2;
          const lum = getBgLuminance(cx, cy);
          newMobileDark = lum < 0.45;
        }

        let newLogoDark = false;
        const desktopLogoEl = desktopLogoRef.current;
        if (desktopLogoEl) {
          const lRect = desktopLogoEl.getBoundingClientRect();
          if (lRect.width > 0) { 
            const cx = lRect.left + lRect.width / 2;
            const cy = lRect.top + lRect.height / 2;
            const lum = getBgLuminance(cx, cy);
            newLogoDark = lum < 0.45;
          }
        }

        let newMobileLogoDark = false;
        const mobileLogoEl = mobileLogoRef.current;
        if (mobileLogoEl) {
          const mlRect = mobileLogoEl.getBoundingClientRect();
          if (mlRect.width > 0) { 
            const cx = mlRect.left + mlRect.width / 2;
            const cy = mlRect.top + mlRect.height / 2;
            const lum = getBgLuminance(cx, cy);
            newMobileLogoDark = lum < 0.45;
          }
        }

        nav.style.visibility = '';

        const prev = pillDarkBgRef.current;
        const changed = newDarkStates.length !== prev.length ||
          newDarkStates.some((v, i) => v !== prev[i]);

        if (changed) {
          pillDarkBgRef.current = newDarkStates;
          setPillDarkBg([...newDarkStates]);
        }
        if (newCartDark !== cartDarkBgRef.current) {
          cartDarkBgRef.current = newCartDark;
          setCartDarkBg(newCartDark);
        }
        if (newMobileDark !== mobileDarkBgRef.current) {
          mobileDarkBgRef.current = newMobileDark;
          setMobileDarkBg(newMobileDark);
        }
        if (newLogoDark !== logoDarkBgRef.current) {
          logoDarkBgRef.current = newLogoDark;
          setLogoDarkBg(newLogoDark);
        }
        if (newMobileLogoDark !== mobileLogoDarkBgRef.current) {
          mobileLogoDarkBgRef.current = newMobileLogoDark;
          setMobileLogoDarkBg(newMobileLogoDark);
        }
      });
    };

    detectBg();
    window.addEventListener('scroll', detectBg, { passive: true });
    return () => {
      window.removeEventListener('scroll', detectBg);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [glassBase]);

  const isExternalLink = href =>
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#');

  const isRouterLink = href => href && !isExternalLink(href);

  const glassStyle = glassBase
    ? {
        backgroundColor: 'rgba(20, 20, 20, 0.1)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: `
          0 8px 16px -8px rgba(0, 0, 0, 0.4),
          0 0 0 1px rgba(255, 255, 255, 0.15) inset,
          0 -2px 4px rgba(0, 0, 0, 0.1) inset
        `,
      }
    : {};

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach(circle => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector('.pill-label');
        const white = pill.querySelector('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

        if (glassBase) {
          tl.to(pill, { backgroundColor: pillColor, duration: 2, ease, overwrite: 'auto' }, 0);
        }

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { visibility: 'hidden', opacity: 0, scaleY: 1, y: 0 });
    }

    if (initialLoadAnimation && !hasPlayedEntrance.current) {
      const dLogo = desktopLogoRef.current;
      const mLogo = mobileLogoRef.current;
      const navItems = navItemsRef.current;

      if (introActive && !introComplete) {
        if (dLogo) gsap.set(dLogo, { scale: 0 });
        if (mLogo) gsap.set(mLogo, { scale: 0 });
        if (navItems) gsap.set(navItems, { width: 0, overflow: 'hidden' });
      } else {
        if (dLogo) {
          gsap.set(dLogo, { scale: 0 });
          gsap.to(dLogo, { scale: 1, duration: 0.6, ease });
        }
        if (mLogo) {
          gsap.set(mLogo, { scale: 0 });
          gsap.to(mLogo, { scale: 1, duration: 0.6, ease });
        }
        if (navItems) {
          gsap.set(navItems, { width: 0, overflow: 'hidden' });
          gsap.to(navItems, { width: 'auto', duration: 0.6, ease });
        }
        hasPlayedEntrance.current = true;
      }
    }

    return () => window.removeEventListener('resize', onResize);
  }, [items, ease, initialLoadAnimation, introActive, introComplete, glassBase, pillColor]);

  useEffect(() => {
    if (!initialLoadAnimation || hasPlayedEntrance.current || !introComplete || !introActive) return;

    const dLogo = desktopLogoRef.current;
    const mLogo = mobileLogoRef.current;
    const navItems = navItemsRef.current;

    if (dLogo) {
      gsap.set(dLogo, { scale: 0 });
      gsap.to(dLogo, { scale: 1, duration: 0.6, ease, delay: 0.1 });
    }
    if (mLogo) {
      gsap.set(mLogo, { scale: 0 });
      gsap.to(mLogo, { scale: 1, duration: 0.6, ease, delay: 0.1 });
    }
    if (navItems) {
      gsap.set(navItems, { width: 0, overflow: 'hidden' });
      gsap.to(navItems, { width: 'auto', duration: 0.6, ease, delay: 0.15 });
    }
    hasPlayedEntrance.current = true;
  }, [introComplete, introActive, initialLoadAnimation, ease]);

  const handleEnter = i => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLeave = i => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto'
    });
  };

  const handleDesktopLogoEnter = () => {
    const img = desktopLogoImgRef.current;
    if (!img) return;
    gsap.killTweensOf(img);
    gsap.set(img, { rotate: 0 });
    gsap.to(img, { rotate: 360, duration: 0.2, ease, overwrite: 'auto' });
  };

  const handleMobileLogoEnter = () => {
    const img = mobileLogoImgRef.current;
    if (!img) return;
    gsap.killTweensOf(img);
    gsap.set(img, { rotate: 0 });
    gsap.to(img, { rotate: 360, duration: 0.2, ease, overwrite: 'auto' });
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    const hamburger = hamburgerRef.current;
    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
      gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
    }
    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.to(menu, {
        opacity: 0,
        y: 10,
        scaleY: 1,
        duration: 0.2,
        ease,
        transformOrigin: 'top center',
        onComplete: () => {
          gsap.set(menu, { visibility: 'hidden' });
        }
      });
    }
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(
          menu,
          { opacity: 0, y: 10, scaleY: 1 },
          { opacity: 1, y: 0, scaleY: 1, duration: 0.3, ease, transformOrigin: 'top center' }
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          scaleY: 1,
          duration: 0.2,
          ease,
          transformOrigin: 'top center',
          onComplete: () => {
            gsap.set(menu, { visibility: 'hidden' });
          }
        });
      }
    }
    onMobileMenuClick?.();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen, ease]);

  useEffect(() => {
    const nav = navContainerRef.current;
    if (!nav) return;

    let lastScrollY = window.scrollY;
    let direction = 'up'; 
    const SCROLL_THRESHOLD = 10;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (Math.abs(delta) < SCROLL_THRESHOLD) return; 

      if (delta > 0 && direction !== 'down') {
        direction = 'down';
        gsap.to(nav, { y: -100, opacity: 0, duration: 0.3, ease: 'power2.out', overwrite: true });
      } else if (delta < 0 && direction !== 'up') {
        direction = 'up';
        gsap.to(nav, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out', overwrite: true });
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cssVars = {
    ['--base']: baseColor,
    ['--pill-bg']: pillColor,
    ['--hover-text']: hoveredPillTextColor,
    ['--pill-text']: resolvedPillTextColor,
    ['--nav-h']: '50px',
    ['--logo']: '36px',
    ['--pill-pad-x']: '18px',
    ['--pill-gap']: '3px'
  };

  return (
    <div
      ref={navContainerRef}
      className="sticky top-2 z-[1000] w-full left-0 flex justify-center items-center will-change-transform"
      style={{ ...cssVars, transform: 'translateY(0)', opacity: 1 }}
    >
      <nav
        className={`hidden md:flex w-max items-center rounded-2xl ${className}`}
        aria-label="Primary"
        style={{
          height: 'var(--nav-h)',
          ...(glassBase ? glassStyle : { background: 'var(--base, #000)' }),
        }}
      >
        {isRouterLink(items?.[0]?.href) ? (
          <Link
            href={items[0].href}
            aria-label="Home"
            onMouseEnter={handleDesktopLogoEnter}
            role="menuitem"
            ref={desktopLogoRef}
            className="rounded-xl p-2 inline-flex items-center justify-center overflow-hidden shrink-0"
            style={{ width: 'var(--nav-h)', height: 'var(--nav-h)' }}
          >
            <img 
              src={logoDarkBg ? '/logo3.svg' : '/logo4.svg'} 
              alt={logoAlt} 
              ref={desktopLogoImgRef} 
              className="w-full h-full object-contain block rounded-lg" 
            />
          </Link>
        ) : (
          <a
            href={items?.[0]?.href || '#'}
            aria-label="Home"
            onMouseEnter={handleDesktopLogoEnter}
            ref={desktopLogoRef}
            className="rounded-xl p-2 inline-flex items-center justify-center overflow-hidden shrink-0"
            style={{ width: 'var(--nav-h)', height: 'var(--nav-h)' }}
          >
            <img 
              src={logoDarkBg ? '/logo3.svg' : '/logo4.svg'} 
              alt={logoAlt} 
              ref={desktopLogoImgRef} 
              className="w-full h-full object-contain block rounded-lg" 
            />
          </a>
        )}

        <div
          ref={navItemsRef}
          className="relative flex items-center"
          style={{ height: 'var(--nav-h)' }}
        >
          <ul
            role="menubar"
            className="list-none flex items-stretch m-0 p-[3px] h-full"
            style={{ gap: 'var(--pill-gap)' }}
          >
            {items.map((item, i) => {
              const isActive = activeHref === item.href;

              const pillStyle = {
                backgroundColor: glassBase ? 'rgba(255,255,255,0)' : 'var(--pill-bg, #fff)',
                color: glassBase ? (pillDarkBg[i] ? '#ffffff' : '#000000') : 'var(--pill-text, var(--base, #000))',
                paddingLeft: 'var(--pill-pad-x)',
                paddingRight: 'var(--pill-pad-x)'
              };

              const PillContent = (
                <>
                  <span
                    className="hover-circle absolute left-1/2 bottom-0 rounded-xl z-[1] block pointer-events-none"
                    style={{
                      ...(glassBase ? { backgroundColor: 'transparent' } : { background: 'var(--base, #000)' }),
                      willChange: 'transform'
                    }}
                    aria-hidden="true"
                    ref={el => { circleRefs.current[i] = el; }}
                  />
                  <span className="label-stack relative inline-block leading-[1] z-[2]">
                    <span
                      className="pill-label relative z-[2] inline-block leading-[1]"
                      style={{ willChange: 'transform' }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
                      style={{
                        color: glassBase ? '#000000' : 'var(--hover-text, #fff)',
                        willChange: 'transform, opacity'
                      }}
                      aria-hidden="true"
                    >
                      {item.label}
                    </span>
                  </span>
                  {isActive && (
                    <span
                      className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-3 h-3 rounded-full z-[4] hidden"
                      style={{ background: glassBase ? 'rgba(180, 130, 20, 0.6)' : 'var(--base, #000)' }}
                      aria-hidden="true"
                    />
                  )}
                </>
              );

              const basePillClasses =
                'relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-xl box-border font-semibold text-[16px] leading-[0] uppercase tracking-[0.2px] whitespace-nowrap cursor-pointer px-0';

              return (
                <li key={item.href} role="none" className="flex h-full">
                  {isRouterLink(item.href) ? (
                    <Link
                      role="menuitem"
                      href={item.href}
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                      ref={el => { pillRefs.current[i] = el; }}
                    >
                      {PillContent}
                    </Link>
                  ) : (
                    <a
                      role="menuitem"
                      href={item.href}
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                      ref={el => { pillRefs.current[i] = el; }}
                    >
                      {PillContent}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <Link
          href="/cart"
          ref={cartRef}
          className="rounded-xl p-3 relative inline-flex items-center justify-center shrink-0"
          style={{
            width: 'var(--nav-h)',
            height: 'var(--nav-h)',
            color: glassBase ? (cartDarkBg ? '#ffffff' : '#000000') : 'var(--pill-bg, #fff)',
          }}
          aria-label="Cart"
        >
          <ShoppingCart className="w-5 h-5" style={{ color: 'inherit' }} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </nav>

      <div className="md:hidden flex items-center gap-2 w-full px-4">
        {isRouterLink(items?.[0]?.href) ? (
          <Link
            href={items[0].href}
            aria-label="Home"
            onMouseEnter={handleMobileLogoEnter}
            role="menuitem"
            ref={mobileLogoRef}
            className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden shrink-0"
            style={{
              width: 'var(--nav-h)',
              height: 'var(--nav-h)',
              ...(glassBase ? glassStyle : { background: 'var(--base, #000)' }),
            }}
          >
            <img 
              src={mobileLogoDarkBg ? '/logo3.svg' : '/logo4.svg'} 
              alt={logoAlt} 
              ref={mobileLogoImgRef} 
              className="w-full h-full object-contain block" 
            />
          </Link>
        ) : (
          <a
            href={items?.[0]?.href || '#'}
            aria-label="Home"
            onMouseEnter={handleMobileLogoEnter}
            ref={mobileLogoRef}
            className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden shrink-0"
            style={{
              width: 'var(--nav-h)',
              height: 'var(--nav-h)',
              ...(glassBase ? glassStyle : { background: 'var(--base, #000)' }),
            }}
          >
            <img 
              src={mobileLogoDarkBg ? '/logo3.svg' : '/logo4.svg'} 
              alt={logoAlt} 
              ref={mobileLogoImgRef} 
              className="w-full h-full object-contain block" 
            />
          </a>
        )}

        <div className="flex-1" />

        <button
          ref={hamburgerRef}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          className="rounded-full border-0 flex flex-col items-center justify-center gap-1 cursor-pointer p-0 relative shrink-0"
          style={{
            width: 'var(--nav-h)',
            height: 'var(--nav-h)',
            ...(glassBase ? glassStyle : { background: 'var(--base, #000)' }),
          }}
        >
          <span
            className="hamburger-line w-4 h-0.5 rounded origin-center transition-all duration-[10ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ background: glassBase ? (mobileDarkBg ? '#ffffff' : '#000000') : '#fff' }}
          />
          <span
            className="hamburger-line w-4 h-0.5 rounded origin-center transition-all duration-[10ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ background: glassBase ? (mobileDarkBg ? '#ffffff' : '#000000') : '#fff' }}
          />
        </button>

        <Link
          href="/cart"
          ref={el => { if (!cartRef.current) cartRef.current = el; }}
          className="rounded-full p-3 relative inline-flex items-center justify-center shrink-0"
          style={{
            width: 'var(--nav-h)',
            height: 'var(--nav-h)',
            color: glassBase ? (mobileDarkBg ? '#ffffff' : '#000000') : 'var(--pill-bg, #fff)',
            ...(glassBase ? glassStyle : { background: 'var(--base, #000)' }),
          }}
          aria-label="Cart"
        >
          <ShoppingCart className="w-5 h-5" style={{ color: 'inherit' }} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      <div
        ref={mobileMenuRef}
        className="md:hidden absolute top-[3em] left-4 right-4 rounded-[27px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-[998] origin-top"
        style={{
          ...(glassBase ? glassStyle : { background: 'var(--base, #f0f0f0)' }),
        }}
      >
        <ul className="list-none m-0 p-[3px] flex flex-col gap-[3px]">
          {items.map(item => {
            const defaultStyle = glassBase
              ? { background: 'rgba(255,255,255,0)', color: mobileDarkBg ? '#ffffff' : '#000000' }
              : { background: 'var(--pill-bg, #fff)', color: 'var(--pill-text, #fff)' };
            
            const hoverIn = e => {
              if (glassBase) {
                e.currentTarget.style.background = pillColor;
                e.currentTarget.style.color = '#000000';
              } else {
                e.currentTarget.style.background = 'var(--base)';
                e.currentTarget.style.color = 'var(--hover-text, #fff)';
              }
            };
            const hoverOut = e => {
              if (glassBase) {
                e.currentTarget.style.background = 'rgba(255,255,255,0)';
                e.currentTarget.style.color = mobileDarkBg ? '#ffffff' : '#000000';
              } else {
                e.currentTarget.style.background = 'var(--pill-bg, #fff)';
                e.currentTarget.style.color = 'var(--pill-text, #fff)';
              }
            };

            const linkClasses = 'block py-3 px-4 text-[16px] font-medium rounded-[50px] transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]';

            return (
              <li key={item.href}>
                {isRouterLink(item.href) ? (
                  <Link href={item.href} className={linkClasses} style={defaultStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut} onClick={() => closeMobileMenu()}>
                    {item.label}
                  </Link>
                ) : (
                  <a href={item.href} className={linkClasses} style={defaultStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut} onClick={() => closeMobileMenu()}>
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PillNav;