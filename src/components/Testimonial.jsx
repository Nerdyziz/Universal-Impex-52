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
      "Partnering with Universal Impex 52 removed months of supplier risk from our program. Their verified sourcing and tight QC processes meant we started shipping on schedule — and customer returns fell sharply.",
    author: "Rajiv Mehta",
    role: "Head of Procurement",
    company: "Tata Motors — Powertrain Division",
    avatar: "/avatar.jpg",
    rating: 5,
    stat: "40%",
    statLabel: "Fewer Warranty Claims",
    bg: "#1a1a1a",
    accent: "#EEBA2B",
  },
  {
    quote:
      "We needed a partner who could scale quickly. UI52 handled supplier qualification and logistics flawlessly — 5,000+ units delivered on time during our launch window.",
    author: "Lina Kovács",
    role: "VP, Supply Chain",
    company: "BorgWarner Europe GmbH",
    avatar: "/avatar.jpg",
    rating: 5,
    stat: "5,000+",
    statLabel: "Units Delivered On-Time",
    bg: "#EEBA2B",
    accent: "#EEBA2B", 
  },
  {
    quote:
      "UI52's supplier audits and batch testing helped us reach an industry-leading defect rate — our return rate dropped to near-zero and supplier reliability improved across the board.",
    author: "Meera Singh",
    role: "Quality Assurance Manager",
    company: "Subaru Tecnica International",
    avatar: "/avatar.jpg",
    rating: 5,
    stat: "0.02%",
    statLabel: "Defect Rate",
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
          scrub: 0.3,
          invalidateOnRefresh: true,
          refreshPriority: -1,
        },
      });

      tl.to(track, {
        x: () => `-${getDistance()}`,
        ease: "none",
        force3d: true,
      });

      // Animate each panel's inner content — plays once when panel enters, stays visible
      gsap.utils.toArray(".testi-panel").forEach((panel, i) => {
        const anims = panel.querySelectorAll(".testi-anim");
        if (i === 0) {
          gsap.set(anims, { y: 20, opacity: 0 });
          gsap.to(anims, {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            ease: "power2.out",
            duration: 0.6,
            delay: 0.2,
          });
        } else {
          gsap.set(anims, { y: 30, opacity: 0 });
          gsap.to(anims, {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            ease: "power2.out",
            duration: 0.8,
            scrollTrigger: {
              trigger: panel,
              start: "left 85%",
              toggleActions: "play none none none",
              containerAnimation: tl,
            },
          });
        }
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
          clip-path: polygon(0 0, calc(100% - 30px) 0, 100% 100%, 0 100%);
        }
        @media (min-width: 640px) {
          .testi-slope {
            clip-path: polygon(0 0, calc(100% - 40px) 0, 100% 100%, 0 100%);
          }
        }
        @media (min-width: 768px) {
          .testi-slope {
            clip-path: polygon(0 0, calc(100% - 60px) 0, 100% 100%, 0 100%);
          }
        }
      `}} />

      {/* Section Header */}
      <div className="px-6 sm:px-12 lg:px-24 mb-8 sm:mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="h-[2px] w-6 sm:w-8 bg-[#EEBA2B]" />
            <span className="text-[9px] sm:text-xs uppercase tracking-[0.3em] text-amber-600 font-mono font-bold">
              Client Testimonials
            </span>
          </div>
          <h2 className="text-2xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight drop-shadow-sm">
            Trusted by Industry Leaders
          </h2>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={sectionRef}
        className="w-full min-h-[580px] sm:min-h-[550px] md:min-h-[500px] overflow-x-hidden bg-transparent relative"
      >
        <div ref={trackRef} className="flex flex-nowrap h-full min-h-full">
          {testimonials.map((t, idx) => {
            const textMain = "text-gray-900";
            const textSub = "text-gray-600";
            const borderCol = "border-black/10";
            const hasSlope = idx < testimonials.length - 1;

            return (
              <div
                key={idx}
                className={`test testi-panel w-screen shrink-0 min-h-full flex flex-wrap relative bg-[rgba(20,20,20,0.1)] backdrop-blur-2xl border-y border-black/10 ${hasSlope ? 'testi-slope pr-[30px] sm:pr-[40px] md:pr-[60px]' : ''}`}
              >
                {/* Simulated right border for the sloped edge using dark stroke */}
                {hasSlope && (
                  <svg className="absolute right-0 top-0 h-full w-[30px] sm:w-[40px] md:w-[60px] pointer-events-none" preserveAspectRatio="none">
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

                {/* Main Content - Removed overflow-y-auto and tightened padding (py-6) */}
                <div className="flex-1 flex flex-col lg:flex-row lg:items-center px-4 sm:px-10 md:px-16 lg:px-20 py-4 sm:py-10 gap-2 sm:gap-6 lg:gap-16 overflow-visible min-h-full">
                  
                  {/* Left: Quote + Content */}
                  <div className="flex-1 flex flex-col justify-center max-w-2xl relative z-10 mt-auto lg:mt-0">
                    {/* Quote Icon */}
                    <div className="testi-anim mb-1.5 sm:mb-6">
                      <Quote
                        className="w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10"
                        style={{ color: t.accent }}
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Quote Text - Reduced text size on mobile to fit without scrolling */}
                    <blockquote
                      className={`testi-anim text-xs sm:text-lg md:text-2xl font-medium leading-relaxed ${textMain} mb-2 sm:mb-8`}
                      style={{ fontStyle: "italic", fontFamily: "serif" }}
                    >
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>

                    {/* Stars */}
                    <div className="testi-anim flex gap-1 mb-2 sm:mb-6">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                          style={{ color: t.accent }}
                          fill={t.accent}
                        />
                      ))}
                    </div>

                    {/* Author */}
                    <div
                      className={`testi-anim flex items-center gap-2 sm:gap-4 border-t pt-2 sm:pt-6 ${borderCol}`}
                    >
                      <div className="relative w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 shadow-sm shrink-0"
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
                          className={`text-xs sm:text-sm md:text-base font-black ${textMain}`}
                        >
                          {t.author}
                        </p>
                        <p
                          className={`text-[9px] sm:text-[10px] md:text-xs font-mono ${textSub}`}
                        >
                          {t.role}
                        </p>
                       
                      </div>
                    </div>
                  </div>

                  {/* Right: Stat Card applied with Light Glass */}
                    <div className="testi-anim w-full lg:w-auto flex-shrink-0 relative z-10 mb-auto lg:mb-0 pb-2 sm:pb-0">
                    <div
                      className="relative w-full lg:w-[220px] xl:w-[260px] p-3 sm:p-6 md:p-8 rounded-xl overflow-hidden bg-[rgba(255,255,255,0.4)] backdrop-blur-xl border border-black/10 shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
                    >
                      {/* Diagonal Accent */}
                      <div
                        className="absolute -top-10 -right-10 w-24 h-24 sm:w-32 sm:h-32 rotate-45 opacity-20 blur-xl"
                        style={{ backgroundColor: t.accent }}
                      />

                      <div className="relative z-10 flex flex-row lg:flex-col items-center lg:items-start justify-between lg:justify-start gap-3 lg:gap-0">
                        <div className="lg:mb-3">
                          <p
                            className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-mono mb-1 lg:mb-3"
                            style={{ color: t.accent }}
                          >
                            Impact
                          </p>
                          <p
                            className={`text-2xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none ${textMain}`}
                          >
                            {t.stat}
                          </p>
                        </div>
                        <p
                          className={`text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider max-w-[120px] lg:max-w-none text-right lg:text-left ${textSub} lg:mt-2`}
                        >
                          {t.statLabel}
                        </p>
                      </div>

                      {/* Bottom Slope Accent */}
                      <div className="absolute bottom-0 left-0 w-full h-[4px] sm:h-[6px]"
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