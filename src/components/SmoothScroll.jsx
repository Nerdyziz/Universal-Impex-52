"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Syncs Lenis scroll events with GSAP ScrollTrigger for consistent animations
function LenisScrollTriggerSync() {
  useLenis(() => {
    ScrollTrigger.update();
  });
  return null;
}

export default function SmoothScroll({ children }) {
  const [isSafari, setIsSafari] = useState(false);
  const [useNativeTouchScroll, setUseNativeTouchScroll] = useState(false);
  const lenisRef = useRef(null);

  const pathname = usePathname();

  useEffect(() => {
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
    const updateTouchScrollMode = () => {
      setUseNativeTouchScroll(coarsePointerQuery.matches);
    };
    const detectScrollMode = () => {
      const ua = navigator.userAgent;
      setIsSafari(/^((?!chrome|android).)*safari/i.test(ua));
      updateTouchScrollMode();
    };

    const initialTimer = window.setTimeout(detectScrollMode, 0);
    coarsePointerQuery.addEventListener("change", updateTouchScrollMode);
    return () => {
      window.clearTimeout(initialTimer);
      coarsePointerQuery.removeEventListener("change", updateTouchScrollMode);
    };
  }, []);

  // Refresh ScrollTrigger and reset scroll after route change
  useEffect(() => {
    if (useNativeTouchScroll) {
      window.scrollTo(0, 0);
    } else if (lenisRef.current?.lenis) {
      lenisRef.current.lenis.scrollTo(0, { immediate: true });
    }
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
    return () => clearTimeout(timer);
  }, [pathname, useNativeTouchScroll]);

  if (useNativeTouchScroll) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: isSafari ? 0.08 : 0.1,
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: isSafari ? 0.8 : 1,
        touchMultiplier: 1.5,
        infinite: false,
        autoResize: true,
        syncTouch: false,
        prevent: (node) => node.hasAttribute('data-lenis-prevent'),
      }}
    >
      <LenisScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
