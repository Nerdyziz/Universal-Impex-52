"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Sync Lenis with GSAP ScrollTrigger
function LenisScrollTriggerSync() {
  useLenis(() => {
    ScrollTrigger.update();
  });
  return null;
}

export default function SmoothScroll({ children }) {
  const [isSafari, setIsSafari] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const lenisRef = useRef(null);
  const pathname = usePathname();

  // Detect Safari + Touch devices
  useEffect(() => {
    const detectTouch = () => {
      return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches
      );
    };

    const ua = navigator.userAgent;

    setIsSafari(/^((?!chrome|android).)*safari/i.test(ua));
    setIsTouchDevice(detectTouch());

    // Handle dynamic pointer changes (rare but useful)
    const mq = window.matchMedia("(pointer: coarse)");
    const handler = () => {
      const touch = detectTouch();
      setIsTouchDevice((prev) => (prev !== touch ? touch : prev));
    };

    mq.addEventListener("change", handler);

    // Detect real touch interaction (best UX for hybrid devices)
    const onTouch = () => setIsTouchDevice(true);
    window.addEventListener("touchstart", onTouch, { once: true });

    return () => {
      mq.removeEventListener("change", handler);
      window.removeEventListener("touchstart", onTouch);
    };
  }, []);

  // Keep mobile touch scrolling native; Lenis is already disabled on touch.
  useEffect(() => {
    if (!isTouchDevice) return;

    ScrollTrigger.normalizeScroll(false);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh(true));
    return () => cancelAnimationFrame(raf);
  }, [isTouchDevice]);

  // Handle route change scroll reset + refresh
  useEffect(() => {
    if (isTouchDevice) {
      window.scrollTo(0, 0);
    } else if (lenisRef.current?.lenis) {
      lenisRef.current.lenis.scrollTo(0, { immediate: true });
    }

    // FIX 3: Force a refresh after DOM/layout settles
    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh(true);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname, isTouchDevice]);

  // 🚫 Disable Lenis completely on touch devices
  if (isTouchDevice) {
    return <>{children}</>;
  }

  // ✅ Enable Lenis only on non-touch devices
  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: isSafari ? 0.08 : 0.1,
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: isSafari ? 0.8 : 1,
        infinite: false,
        autoResize: true,
        syncTouch: false,
        prevent: (node) => node.hasAttribute("data-lenis-prevent"),
      }}
    >
      <LenisScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
