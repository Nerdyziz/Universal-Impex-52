'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card absolute top-0 left-0 w-full h-full overflow-hidden box-border ${itemClassName}`.trim()}
    style={{ backfaceVisibility: 'hidden' }}
  >
    <div className="p-5 h-full flex flex-col">
      {children}
    </div>
  </div>
);

const ScrollStack = ({ children, className = '' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = gsap.utils.toArray(container.querySelectorAll('.scroll-stack-card'));
    if (cards.length === 0) return;

    // Assign z-indices so later cards stack on top
    // and hide all cards except the first one off-screen
    cards.forEach((card, i) => {
      card.style.zIndex = i + 1;
      if (i > 0) {
        gsap.set(card, { yPercent: 150 });
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'center center',
        end: `+=${cards.length * 80}% `,
        scrub: 3,
        pin: true,
        pinSpacing: true,
      },
    });

    // Each card after the first slides up into view
    cards.forEach((card, i) => {
      if (i === 0) return;
      tl.to(card, {
        yPercent: 0,
        ease: 'none',
        duration: 1,
      });
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[55vh] overflow-hidden rounded-2xl ${className}`.trim()}
    >
      {children}
    </div>
  );
};

export default ScrollStack;
