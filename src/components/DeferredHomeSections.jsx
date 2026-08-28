"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const MobileCard = dynamic(() => import("@/components/MobileCard"), {
  ssr: false,
  loading: () => <div className="h-[350px] sm:h-[400px] xl:hidden" />,
});
const Cards = dynamic(() => import("@/components/Cards"), {
  ssr: false,
  loading: () => <div className="h-[70vh]" />,
});
const Label = dynamic(() => import("@/components/Label"), {
  ssr: false,
  loading: () => <div className="h-[30vh] sm:h-[50vh] xl:h-screen" />,
});
const Testimonial = dynamic(() => import("@/components/Testimonial"), {
  ssr: false,
  loading: () => <div className="h-[70vh]" />,
});

export default function DeferredHomeSections() {
  const triggerRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "900px 0px" },
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={triggerRef}>
      {shouldLoad && (
        <>
          <MobileCard />
          <Cards />
          <Label />
          <Testimonial />
        </>
      )}
    </div>
  );
}
