"use client";
import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Star, Quote, ArrowRight } from "lucide-react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      "Switching to their forged engine blocks cut our warranty claims by 40%. The consistency across 2,000+ units is something we've never seen from another supplier. Their QC process is genuinely world-class.",
    author: "Rajesh Mehta",
    role: "Head of Procurement",
    company: "Tata Motors — Powertrain Division",
    avatar: "/owner.jpg",
    rating: 5,
    stat: "40%",
    statLabel: "Fewer Warranty Claims",
    bg: "#1a1a1a",
    accent: "#EEBA2B",
  },
  {
    quote:
      "We needed a turbo supplier who could scale from prototype to 5,000 units without quality drift. They delivered — on time, every time. The twin-scroll units outperform OEM specs by a solid margin.",
    author: "Marcus Brenner",
    role: "VP of Engineering",
    company: "BorgWarner Europe GmbH",
    avatar: "/owner.jpg",
    rating: 5,
    stat: "5,000+",
    statLabel: "Units Delivered On-Time",
    bg: "#EEBA2B",
    accent: "#EEBA2B", 
  },
  {
    quote:
      "Their adaptive coilover kits are now standard across our entire rally lineup. The 32-way adjustment gives our drivers an edge that translates directly to podium finishes. Best B2B partnership we've formed.",
    author: "Yuki Tanaka",
    role: "Motorsport Director",
    company: "Subaru Tecnica International",
    avatar: "/owner.jpg",
    rating: 5,
    stat: "12",
    statLabel: "Podium Finishes This Season",
    bg: "#d9d9d9",
    accent: "#EEBA2B", 
  },
];

const Testimonial = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      const section = sectionRef.current;

      if (!track || !section) return;

      const getDistance = () => track.scrollWidth - window.innerWidth;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "center center",
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          refreshPriority: -1,
        },
      });

      tl.to(track, {
        x: () => `-${getDistance()}`,
        ease: "none",
      });

      // Animate each panel's inner content
      gsap.utils.toArray(".testi-panel").forEach((panel) => {
        const anims = panel.querySelectorAll(".testi-anim");
        gsap.set(anims, { y: 30, opacity: 0 });
        gsap.to(anims, {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          ease: "power2.out",
          duration: 0.8,
          scrollTrigger: {
            trigger: panel,
            start: "left 80%",
            end: "left 40%",
            scrub: 1,
            containerAnimation: tl,
          },
        });
      });

      return () => {
        tl.scrollTrigger && tl.scrollTrigger.kill();
        tl.kill();
      };
    },
    { scope: sectionRef }
  );

  return (
    <div className="relative w-full my-5 sm:my-10">
      
      {/* Dynamic responsive clip-path styles for the slope */}
      <style dangerouslySetInnerHTML={{__html: `
        .testi-slope {
          clip-path: polygon(0 0, calc(100% - 40px) 0, 100% 100%, 0 100%);
        }
        @media (min-width: 768px) {
          .testi-slope {
            clip-path: polygon(0 0, calc(100% - 60px) 0, 100% 100%, 0 100%);
          }
        }
      `}} />

      {/* Section Header */}
      <div className="px-6 sm:px-12 lg:px-24 mb-10 sm:mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-8 bg-[#EEBA2B]" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-amber-600 font-mono font-bold">
              Client Testimonials
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight drop-shadow-sm">
            Trusted by Industry Leaders
          </h2>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={sectionRef}
        className="w-full h-[500px] sm:h-[550px] md:h-[500px] overflow-hidden bg-transparent relative"
      >
        <div ref={trackRef} className="flex flex-nowrap h-full">
          {testimonials.map((t, idx) => {
            // Colors adapted for LIGHT website background with dark text
            const textMain = "text-gray-900";
            const textSub = "text-gray-600";
            const borderCol = "border-black/10";
            const hasSlope = idx < testimonials.length - 1;

            return (
              <div
                key={idx}
                className={`test testi-panel w-screen shrink-0 h-full flex relative bg-[rgba(20,20,20,0.1)] backdrop-blur-2xl border-y border-black/10 ${hasSlope ? 'testi-slope pr-[40px] md:pr-[60px]' : ''}`}
              >
                {/* Simulated right border for the sloped edge using dark stroke */}
                {hasSlope && (
                  <svg className="absolute right-0 top-0 h-full w-[40px] md:w-[60px] pointer-events-none" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(0,0,0,0.1)" strokeWidth="2.5" />
                  </svg>
                )}

                {/* Left Number Indicator */}
                <div className="hidden sm:flex flex-col items-center justify-center w-16 md:w-24 relative border-r border-black/5">
                  <div
                    className="absolute top-0 left-0 w-full h-full opacity-[0.05]"
                    style={{
                      background: `repeating-linear-gradient(45deg, ${t.accent}, ${t.accent} 1px, transparent 1px, transparent 12px)`,
                    }}
                  />
                  <span
                    className="text-[80px] md:text-[120px] font-black opacity-[0.15] select-none"
                    style={{ color: t.accent }}
                  >
                    {idx + 1}
                  </span>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col lg:flex-row items-center px-6 sm:px-10 md:px-16 lg:px-20 py-10 sm:py-14 gap-8 lg:gap-16">
                  
                  {/* Left: Quote + Content */}
                  <div className="flex-1 flex flex-col justify-center max-w-2xl relative z-10">
                    {/* Quote Icon */}
                    <div className="testi-anim mb-6">
                      <Quote
                        className="w-8 h-8 sm:w-10 sm:h-10"
                        style={{ color: t.accent }}
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Quote Text */}
                    <blockquote
                      className={`testi-anim text-lg sm:text-xl md:text-2xl font-medium leading-relaxed ${textMain} mb-8`}
                      style={{ fontStyle: "italic", fontFamily: "serif" }}
                    >
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>

                    {/* Stars */}
                    <div className="testi-anim flex gap-1 mb-6">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4"
                          style={{ color: t.accent }}
                          fill={t.accent}
                        />
                      ))}
                    </div>

                    {/* Author */}
                    <div
                      className={`testi-anim flex items-center gap-4 border-t pt-6 ${borderCol}`}
                    >
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 shadow-sm"
                        style={{ borderColor: t.accent }}
                      >
                        <Image
                          src={t.avatar}
                          alt={t.author}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p
                          className={`text-sm sm:text-base font-black ${textMain}`}
                        >
                          {t.author}
                        </p>
                        <p
                          className={`text-[10px] sm:text-xs font-mono ${textSub}`}
                        >
                          {t.role}
                        </p>
                        <p
                          className={`text-[10px] sm:text-xs uppercase tracking-widest font-bold mt-0.5 ${textSub}`}
                        >
                          {t.company}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Stat Card applied with Light Glass */}
                  <div className="testi-anim w-full lg:w-auto flex-shrink-0 relative z-10">
                    <div
                      className="relative w-full lg:w-[220px] xl:w-[260px] p-6 sm:p-8 rounded-xl overflow-hidden bg-[rgba(255,255,255,0.4)] backdrop-blur-xl border border-black/10 shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
                    >
                      {/* Diagonal Accent */}
                      <div
                        className="absolute -top-10 -right-10 w-32 h-32 rotate-45 opacity-20 blur-xl"
                        style={{ backgroundColor: t.accent }}
                      />

                      <div className="relative z-10">
                        <p
                          className="text-[10px] uppercase tracking-[0.3em] font-mono mb-3"
                          style={{ color: t.accent }}
                        >
                          Impact
                        </p>
                        <p
                          className={`text-5xl sm:text-6xl font-black tracking-tight leading-none mb-2 ${textMain}`}
                        >
                          {t.stat}
                        </p>
                        <p
                          className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${textSub}`}
                        >
                          {t.statLabel}
                        </p>
                      </div>

                      {/* Bottom Slope Accent */}
                      <div className="absolute bottom-0 left-0 w-full h-[6px]"
                        style={{ backgroundColor: t.accent }}
                      />
                    </div>

                    {/* Scroll Hint (only on first panel) */}
                    {idx === 0 && (
                      <div className={`hidden lg:flex items-center gap-2 mt-6 ${textSub}`}>
                        <span className="text-[10px] uppercase tracking-widest font-mono">
                          Scroll to read more
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;