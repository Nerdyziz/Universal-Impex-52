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
    company: "Tata Motors",
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
    company: "BorgWarner Europe",
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
    role: "Quality Assurance",
    company: "Subaru Tecnica",
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
          anticipatePin: 1,
          scrub: 0.3,
          invalidateOnRefresh: true,
          refreshPriority: -1,
        },
      });

      tl.to(track, {
        x: () => `-${getDistance()}`,
        ease: "none",
        
      });

      // Animate each panel's inner content
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
    <div className="relative w-full my-10 sm:my-16 md:my-20">
      {/* Dynamic responsive clip-path styles for the slope */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .testi-slope {
          clip-path: polygon(0 0, calc(100% - 25px) 0, 100% 100%, 0 100%);
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
        @media (min-width: 1024px) {
          .testi-slope {
            clip-path: polygon(0 0, calc(100% - 80px) 0, 100% 100%, 0 100%);
          }
        }
      `,
        }}
      />

      {/* Section Header */}
      <div className="px-5 sm:px-12 lg:px-24 mb-8 md:mb-12 lg:mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="h-[2px] w-6 sm:w-8 bg-[#EEBA2B]" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-amber-600 font-mono font-bold">
              Client Testimonials
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight drop-shadow-sm">
            Trusted by Industry Leaders
          </h2>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={sectionRef}
        className="w-full overflow-hidden bg-transparent relative"
      >
        <div ref={trackRef} className="flex flex-nowrap items-stretch h-auto">
          {testimonials.map((t, idx) => {
            const textMain = "text-gray-900";
            const textSub = "text-gray-600";
            const borderCol = "border-black/10";
            const hasSlope = idx < testimonials.length - 1;

            return (
              <div
                key={idx}
                className={`testi-panel w-screen shrink-0 flex relative bg-[rgba(20,20,20,0.03)] backdrop-blur-2xl border-y ${borderCol} ${
                  hasSlope ? "testi-slope pr-[25px] sm:pr-[40px] md:pr-[60px] lg:pr-[80px]" : ""
                }`}
              >
                {/* Simulated right border for the sloped edge using dark stroke */}
                {hasSlope && (
                  <svg
                    className="absolute right-0 top-0 h-full w-[25px] sm:w-[40px] md:w-[60px] lg:w-[80px] pointer-events-none"
                    preserveAspectRatio="none"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="100%"
                      y2="100%"
                      stroke="rgba(0,0,0,0.1)"
                      strokeWidth="2.5"
                    />
                  </svg>
                )}

                {/* Left Number Indicator */}
                <div className="hidden md:flex flex-col items-center justify-center w-20 lg:w-32 relative border-r border-black/5 shrink-0">
                  <div
                    className="absolute top-0 left-0 w-full h-full opacity-[0.05]"
                    style={{
                      background: `repeating-linear-gradient(45deg, ${t.accent}, ${t.accent} 1px, transparent 1px, transparent 12px)`,
                    }}
                  />
                  <span
                    className="text-[100px] lg:text-[140px] font-black opacity-[0.15] select-none"
                    style={{ color: t.accent }}
                  >
                    {idx + 1}
                  </span>
                </div>

                {/* Main Content Wrapper - Switched to md:flex-row to solve tablet/Nest Hub vertical overflow */}
                <div className="flex-1 flex flex-col md:flex-row md:items-center justify-center px-5 py-6 sm:px-12 md:px-8 lg:px-20 md:py-10 gap-5 md:gap-8 lg:gap-16">
                  
                  {/* Left: Quote + Content */}
                  <div className="flex flex-col justify-center w-full md:w-3/5 lg:w-2/3 relative z-10 h-full">
                    <div className="testi-anim mb-3 md:mb-5 lg:mb-6 mt-auto">
                      <Quote
                        className="w-6 h-6 sm:w-8 sm:h-8 md:w-8 lg:w-12 md:h-8 lg:h-12"
                        style={{ color: t.accent }}
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Adjusted text sizing down slightly to prevent huge text from breaking the div height */}
                    <blockquote
                      className={`testi-anim text-[15px] sm:text-lg md:text-xl lg:text-3xl font-medium leading-snug md:leading-relaxed ${textMain} mb-4 md:mb-8`}
                      style={{ fontStyle: "italic", fontFamily: "serif" }}
                    >
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>

                    <div className="testi-anim flex gap-1.5 mb-4 md:mb-8">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 md:w-4 lg:w-5 md:h-4 lg:h-5"
                          style={{ color: t.accent }}
                          fill={t.accent}
                        />
                      ))}
                    </div>

                    <div
                      className={`testi-anim flex items-center gap-3 md:gap-4 border-t pt-4 md:pt-5 lg:pt-6 mb-auto ${borderCol}`}
                    >
                      <div
                        className="relative w-10 h-10 md:w-12 lg:w-16 md:h-12 lg:h-16 rounded-full overflow-hidden border-2 shadow-sm shrink-0"
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
                        <p className={`text-sm md:text-base lg:text-lg font-black ${textMain}`}>
                          {t.author}
                        </p>
                        <p className={`text-[11px] md:text-xs lg:text-sm font-mono mt-0.5 ${textSub}`}>
                          {t.role}
                        </p>
                        
                      </div>
                    </div>
                  </div>

                  {/* Right: Stat Card */}
                  <div className="testi-anim w-full md:w-2/5 lg:w-1/3 flex-shrink-0 relative z-10 mt-3 md:mt-0 flex justify-center md:justify-end">
                    <div className="relative w-full max-w-[300px] md:max-w-none p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl overflow-hidden bg-[rgba(255,255,255,0.6)] backdrop-blur-xl border border-white/40 shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
                      <div
                        className="absolute -top-10 -right-10 w-24 h-24 sm:w-32 sm:h-32 md:w-32 lg:w-40 md:h-32 lg:h-40 rotate-45 opacity-20 blur-xl pointer-events-none"
                        style={{ backgroundColor: t.accent }}
                      />

                      {/* Flex layout triggers vertical at md instead of lg */}
                      <div className="relative z-10 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start gap-4 md:gap-0">
                        <div className="md:mb-3 lg:mb-4">
                          <p
                            className="text-[9px] md:text-[10px] lg:text-xs uppercase tracking-[0.3em] font-mono mb-1 lg:mb-3"
                            style={{ color: t.accent }}
                          >
                            Impact
                          </p>
                          <p
                            className={`text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-none ${textMain}`}
                          >
                            {t.stat}
                          </p>
                        </div>
                        <p
                          className={`text-[10px] md:text-xs lg:text-sm font-bold uppercase tracking-wider max-w-[120px] md:max-w-[140px] lg:max-w-none text-right md:text-left ${textSub} md:mt-1 lg:mt-2`}
                        >
                          {t.statLabel}
                        </p>
                      </div>

                      <div
                        className="absolute bottom-0 left-0 w-full h-[4px] md:h-[6px]"
                        style={{ backgroundColor: t.accent }}
                      />
                    </div>
                  </div>
                  
                  {/* Scroll Hint (Hidden on mobile, repositioned for landscape) */}
                  {idx === 0 && (
                    <div className={`hidden lg:flex absolute bottom-8 right-20 items-center gap-2 ${textSub}`}>
                      <span className="text-[10px] lg:text-xs uppercase tracking-widest font-mono font-semibold">
                        Scroll to read more
                      </span>
                      <ArrowRight className="w-4 h-4 animate-pulse" />
                    </div>
                  )}

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