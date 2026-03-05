"use client";

import { ReactLenis } from "lenis/react";

export default function SmoothScroll({ children }) {
  return (
    <ReactLenis
      root
       options={{
        duration: 1.2,
        easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
        smoothWheel: true,
        smoothTouch: false,
        }}
    >
      {children}
    </ReactLenis>
  );
}