"use client";
import React, { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/* ── tiny helper: generate N spark elements ── */
const SPARK_COUNT = 16;
const RING_COUNT = 4;

const Herosection2 = () => {
  const heroRef = useRef(null);
  const scrollRef = useRef(null);
  const logoRef = useRef(null);
  const bgRef = useRef(null);
  const sparksRef = useRef(null);
  const ringsRef = useRef(null);
  const taglineRef = useRef(null);
  const taglineSub = useRef(null);
  const logosContainerRef = useRef(null);

  /* ── Mouse-reactive parallax ── */
  const handleMouseMove = useCallback((e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx; // -1 to 1
    const dy = (e.clientY - cy) / cy;

    // Move brand logos with different depths
    const logos = document.querySelectorAll(".logo-bg");
    logos.forEach((el) => {
      const speed = parseFloat(el.dataset.speed) || 0.3;
      gsap.to(el, {
        x: dx * 40 * speed,
        y: dy * 30 * speed,
        rotateY: dx * 5 * speed,
        rotateX: -dy * 5 * speed,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
        force3D: true,
      });
    });

    // Subtle tilt on main logo
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        rotateY: dx * 3,
        rotateX: -dy * 2,
        duration: 1,
        ease: "power2.out",
        overwrite: "auto",
        force3D: true,
      });
    }
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const scrollEl = scrollRef.current;
    const logo = logoRef.current;
    const bg = bgRef.current;

    const ctx = gsap.context(() => {

    /* ── Initial states ── */
    gsap.set(logo, { scale: 1, opacity: 1, force3D: true, willChange: "transform, opacity" });
    gsap.set(bg, { opacity: 1, willChange: "opacity" });
    gsap.set(".logo-bg", { force3D: true, willChange: "transform" });
    gsap.set(".spark", { force3D: true });
    gsap.set(".glow-ring", { force3D: true });

    /* ── 1. INTRO TIMELINE (on-load) ── */
    const intro = gsap.timeline();

    // Morphing gradient bg transition
    intro.fromTo(
      bg,
      { background: "linear-gradient(135deg, #ffffff 0%, #ffffff 100%)" },
      {
        background:
          "linear-gradient(135deg, #ffffff 0%, #fff8e8 30%, #fffdf5 60%, #ffffff 100%)",
        duration: 1.5,
        ease: "power1.inOut",
      },
      0
    );

    // Glow rings pulse in
    intro.fromTo(
      ".glow-ring",
      { scale: 0.3, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out",
      },
      0.2
    );

    // Brand logos pop in
    intro.from(
      ".logo-bg",
      {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
      },
      0.3
    );

    // Main logo entrance
    intro.from(
      logo,
      {
        y: 60,
        scale: 0.7,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      },
      0.4
    );

    // Tagline reveal — split letters
    intro.fromTo(
      ".tag-letter",
      { y: 40, opacity: 0, rotateX: -90 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.6,
        stagger: 0.03,
        ease: "back.out(2)",
      },
      0.8
    );

    // Subtitle fade in
    intro.fromTo(
      taglineSub.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      1.2
    );

    // Sparks burst in
    intro.fromTo(
      ".spark",
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        stagger: { each: 0.02, from: "random" },
        ease: "power2.out",
      },
      0.6
    );

    /* ── 2. CONTINUOUS ANIMATIONS ── */

    // Brand logos floating
   
    // Glow rings pulsing
    gsap.to(".glow-ring", {
      scale: "+=0.08",
      opacity: "-=0.15",
      stagger: { each: 0.4, repeat: -1, yoyo: true },
      ease: "sine.inOut",
      duration: 2.5,
    });

    // Sparks orbiting
    document.querySelectorAll(".spark").forEach((spark, i) => {
      const angle = (i / SPARK_COUNT) * Math.PI * 2;
      const radius = 180 + Math.random() * 200;
      const speed = 3 + Math.random() * 4;

      gsap.to(spark, {
        motionPath: {
          path: [
            {
              x: Math.cos(angle) * radius,
              y: Math.sin(angle) * radius,
            },
            {
              x: Math.cos(angle + Math.PI) * (radius + 30),
              y: Math.sin(angle + Math.PI) * (radius + 30),
            },
            {
              x: Math.cos(angle + Math.PI * 2) * radius,
              y: Math.sin(angle + Math.PI * 2) * radius,
            },
          ],
          curviness: 1.5,
        },
        duration: speed,
        repeat: -1,
        ease: "none",
      });

      // Twinkle
      gsap.to(spark, {
        opacity: Math.random() * 0.5 + 0.3,
        scale: Math.random() * 0.5 + 0.5,
        duration: 0.5 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random(),
      });
    });

    // Gradient breathing
    const gradientLoop = gsap.timeline({ repeat: -1, yoyo: true });
    gradientLoop.to(bg, {
      background:
        "linear-gradient(135deg, #ffffff 0%, #fef6e0 25%, #fffbf0 55%, #ffffff 100%)",
      duration: 4,
      ease: "sine.inOut",
    });
    gradientLoop.to(bg, {
      background:
        "linear-gradient(135deg, #ffffff 0%, #fffdf5 35%, #fef3d6 65%, #ffffff 100%)",
      duration: 4,
      ease: "sine.inOut",
    });

    /* ── 3. SCROLL-OUT TIMELINE ── */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollEl,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onLeave: () => gsap.set(hero, { display: "none" }),
        onEnterBack: () => gsap.set(hero, { display: "block" }),
      },
    });

    // Logo zoom + fade
    tl.to(logo, { scale: 6, ease: "power2.in", duration: 0.4 }, 0);
    tl.to(logo, { opacity: 0, ease: "power2.in", duration: 0.25 }, 0.1);

    // Brand logos fly outward
    tl.to(".logos", { yPercent: -100, ease: "none", duration: 0.25 }, 0.1);

    // Sparks scatter outward
    tl.to(
      ".spark",
      {
        scale: 3,
        opacity: 0,
        stagger: { each: 0.01, from: "center" },
        duration: 0.3,
        ease: "power2.in",
      },
      0.05
    );

    // Glow rings expand and vanish
    tl.to(
      ".glow-ring",
      {
        scale: 4,
        opacity: 0,
        stagger: 0.05,
        duration: 0.3,
        ease: "power2.in",
      },
      0.1
    );

    // Tagline collapses
    tl.to(
      ".tag-letter",
      {
        y: -60,
        opacity: 0,
        rotateX: 90,
        stagger: 0.01,
        duration: 0.2,
        ease: "power2.in",
      },
      0.05
    );
    tl.to(
      taglineSub.current,
      { y: -40, opacity: 0, duration: 0.2, ease: "power2.in" },
      0.08
    );

    // Dark bg dissolves
    tl.to(bg, { opacity: 0, ease: "power2.out", duration: 0.7 }, 0.3);

    // Add mouse listener
    window.addEventListener("mousemove", handleMouseMove);

    }); // end gsap.context

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      ctx.revert(); // kills ALL gsap animations, ScrollTriggers, and sets created inside the context
    };
  }, [handleMouseMove]);

  /* ── Split tagline text into letters ── */
  const taglineText = "Uni'versal";
  const taglineLetters = taglineText.split("").map((char, i) => (
    <span
      key={i}
      className="tag-letter inline-block"
      style={{ display: "inline-block", perspective: "600px" }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));

  return (
    <>
      {/* Fixed overlay */}
      <div
        ref={heroRef}
        className="fixed top-0 left-0 w-full h-screen"
        style={{ zIndex: 50 }}
      >
        {/* ── Morphing gradient background ── */}
        <div
          ref={bgRef}
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #ffffff 0%, #ffffff 100%)",
          }}
        />

        {/* ── Radial glow rings ── */}
        <div
          ref={ringsRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 1 }}
        >
          {Array.from({ length: RING_COUNT }).map((_, i) => (
            <div
              key={i}
              className="glow-ring absolute rounded-full"
              style={{
                width: `${280 + i * 140}px`,
                height: `${280 + i * 140}px`,
                border: `1px solid rgba(184, 134, 11, ${0.3 - i * 0.06})`,
                boxShadow: `0 0 ${20 + i * 10}px rgba(184, 134, 11, ${0.12 - i * 0.02}), inset 0 0 ${15 + i * 8}px rgba(184, 134, 11, ${0.06 - i * 0.01})`,
              }}
            />
          ))}
        </div>

        {/* ── Spark particles ── */}
        <div
          ref={sparksRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 2 }}
        >
          {Array.from({ length: SPARK_COUNT }).map((_, i) => {
            const angle = (i / SPARK_COUNT) * Math.PI * 2;
            const r = 120 + Math.random() * 160;
            return (
              <div
                key={i}
                className="spark absolute"
                style={{
                  width: `${2 + Math.random() * 4}px`,
                  height: `${2 + Math.random() * 4}px`,
                  borderRadius: "50%",
                  backgroundColor: `hsl(${35 + Math.random() * 20}, ${90 + Math.random() * 10}%, ${40 + Math.random() * 20}%)`,
                  boxShadow: `0 0 ${4 + Math.random() * 6}px rgba(184, 134, 11, 0.6)`,
                  left: `calc(50% + ${Math.cos(angle) * r}px)`,
                  top: `calc(50% + ${Math.sin(angle) * r}px)`,
                }}
              />
            );
          })}
        </div>

        {/* ── Brand logos with parallax ── */}
        <div className="logos absolute inset-0 w-full h-full pointer-events-auto" style={{ zIndex: 15 }}>
          <div
            className="parallax-item logo-bg absolute top-[15%] left-[5%] rounded-full"
            data-speed="0.3"
          >
            <Image
              src="/b1.svg"
              alt="Automotive partner brand logo"
              width={200}
              height={80}
              className="object-contain hover:scale-110 transition duration-800 ease-in-out w-[100px] sm:w-[150px] lg:w-[200px] h-auto drop-shadow-[0_0_12px_rgba(238,186,43,0.3)]"
            />
          </div>

          <div
            className="parallax-item logo-bg absolute top-[25%] right-[5%]"
            data-speed="-0.4"
          >
            <Image
              src="/b2.svg"
              alt="OEM manufacturer brand logo"
              width={200}
              height={80}
              className="object-contain hover:scale-110 transition duration-800 ease-in-out w-[100px] sm:w-[150px] lg:w-[200px] h-auto drop-shadow-[0_0_12px_rgba(238,186,43,0.3)]"
            />
          </div>

          <div
            className="parallax-item logo-bg absolute bottom-[25%] left-[10%]"
            data-speed="0.6"
          >
            <Image
              src="/b3.svg"
              alt="Industrial components brand logo"
              width={200}
              height={80}
              className="object-contain hover:scale-110 transition duration-800 ease-in-out w-[100px] sm:w-[150px] lg:w-[200px] h-auto drop-shadow-[0_0_12px_rgba(238,186,43,0.3)]"
            />
          </div>

          <div
            className="parallax-item logo-bg absolute bottom-[20%] right-[10%]"
            data-speed="-0.5"
          >
            <Image
              src="/b4.svg"
              alt="Aftermarket parts brand logo"
              width={200}
              height={80}
              className="object-contain hover:scale-110 transition duration-800 ease-in-out w-[100px] sm:w-[150px] lg:w-[200px] h-auto drop-shadow-[0_0_12px_rgba(238,186,43,0.3)]"
            />
          </div>

          <div
            className="parallax-item logo-bg absolute bottom-[5%] left-1/2 rounded-full"
            data-speed="0.2"
          >
            <Image
              src="/b5.svg"
              alt="Performance parts brand logo"
              width={200}
              height={80}
              className="object-contain hover:scale-110 transition duration-800 ease-in-out w-[100px] sm:w-[150px] lg:w-[200px] h-auto drop-shadow-[0_0_12px_rgba(238,186,43,0.3)]"
            />
          </div>
        </div>

        {/* ── Main logo (with 3D tilt on mouse) ── */}
        <div
          ref={logoRef}
          className="absolute inset-0 flex items-center justify-center will-change-transform origin-center"
          style={{
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
            perspective: "1000px",
            zIndex: 10,
          }}
        >
          <Image
            src="/logo2.svg"
            alt="Logo"
            width={1920}
            height={1080}
            priority
            className="w-[90vw] h-auto select-none drop-shadow-[0_0_40px_rgba(238,186,43,0.15)]"
            draggable={false}
          />
        </div>

        
       
      </div>

      {/* Scroll spacer */}
      <div ref={scrollRef} className="w-full" style={{ height: "200vh" }} />
    </>
  );
};

export default Herosection2;
