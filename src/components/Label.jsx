"use client";
import React,{useRef} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

const Label = () => {
    const containerRef = useRef(null);
  const cardRef = useRef(null);
  const tl = useRef(null);

  useGSAP(() => {
    // Create the timeline once and store it in the ref
    tl.current = gsap.timeline({ paused: true })
      .to(cardRef.current, {
        rotationX: 180,
        duration: 0.7, // Increased duration for elegance (0.6 is too snappy)
        ease: "power1.inOut", // Softest ease (power2 is sharper)
      });
  }, { scope: containerRef });
  return (
    <div className="flip-card w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen py-10 sm:py-16 md:py-20 flex items-center justify-center px-4 sm:px-6 md:px-8">
      <div
        ref={containerRef}
        // CRITICAL FIX: Events are on the static container, not the moving card
        onMouseEnter={() => tl.current?.play()}
        onMouseLeave={() => tl.current?.reverse()}
        className="flip-card w-full sm:w-[90%] md:w-4/5 lg:w-3/4 h-full flex items-center justify-center"
        style={{ perspective: "2000px" }} // Increased perspective for less distortion (more subtle)
      >
        <div ref={cardRef} className="flip-inner w-full h-full">
          <div className="flip-front text-[#1a1a1a]">{/* Front Content */}</div>
          <div className="flip-back liquid-glass rounded-2xl">
            <Link href="/about" className="text-[#1a1a1a] font-bold text-lg">Read More</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Label;
