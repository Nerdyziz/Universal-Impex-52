"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import { ArrowRight, Target, Shield, Zap, Globe, Users, Award } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const SlopeDown = ({ colorClass }) => (
  <div className="h-full w-[40px] md:w-[60px] relative z-20">
    <svg
      className={`w-full h-full block ${colorClass} fill-current`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      shapeRendering="geometricPrecision"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0 L0 100 L100 100 Z" />
    </svg>
  </div>
);

const StatCard = ({ number, label, icon: Icon, className }) => (
  <div className={`group relative liquid-glass rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center hover:scale-[1.02] transition-all duration-500 cursor-default ${className}`}>
    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 mb-3 group-hover:scale-110 transition-transform duration-300" />
    <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-500 tracking-tight">{number}</span>
    <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#1a1a1a] mt-2 font-mono">{label}</span>
  </div>
);

const About = () => {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);

  useGSAP(
    () => {
      // --- Hero entrance ---
      // Set hidden state first to prevent flash
      gsap.set(".about-hero-label", { y: 30, opacity: 0 });
      gsap.set(".about-hero-title span", { y: 80, opacity: 0 });
      gsap.set(".about-hero-line", { scaleX: 0 });
      gsap.set(".about-hero-desc", { y: 20, opacity: 0 });

      const heroTl = gsap.timeline({ delay: 0.05 });
      heroTl.to(".about-hero-label", {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      });
      heroTl.to(
        ".about-hero-title span",
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        },
        "-=0.3"
      );
      heroTl.to(
        ".about-hero-line",
        {
          scaleX: 1,
          duration: 0.8,
          ease: "power2.inOut",
        },
        "-=0.4"
      );
      heroTl.to(
        ".about-hero-desc",
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.3"
      );

      // --- Stats counter ---
  

      // --- Story section ---
      gsap.set(".story-image", { x: -60, opacity: 0 });
      gsap.to(".story-image", {
        x: 0,
        opacity: 1,
        duration: 2,
        ease: "none",
        scrollTrigger: {
          trigger: ".story-section",
          start: "top 90%",
          end: "top 20%",
          scrub: 1,
        },
      });
      gsap.set(".story-content", { x: 60, opacity: 0 });
      gsap.to(".story-content", {
        x: 0,
        opacity: 1,
        duration: 2,
        ease: "none",
        scrollTrigger: {
          trigger: ".story-section",
          start: "top 90%",
          end: "top 20%",
          scrub: 1,
        },
      });

      // --- Values section ---
      gsap.set(".value-card", { y: 40, opacity: 0 });
      gsap.to(".value-card", {
        y: 0,
        opacity: 1,
        stagger: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: ".values-section",
          start: "top 85%",
          end: "top 15%",
          scrub: 1,
        },
      });

      // --- Timeline items ---
      gsap.set(".timeline-item", { x: -30, opacity: 0 });
      gsap.to(".timeline-item", {
        x: 0,
        opacity: 1,
        stagger: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: ".timeline-section",
          start: "top 85%",
          end: "center center",
          scrub: 1,
        },
      });

      // --- CTA section ---
      gsap.set(".cta-content", { y: 30, opacity: 0 });
      gsap.to(".cta-content", {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "none",
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 90%",
          end: "top 30%",
          scrub: 1,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="w-full min-h-screen">
      {/* ============================================================
          HERO SECTION
         ============================================================ */}
      <section className="relative w-full min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-24 pt-24 pb-16 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-amber-400/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-10 w-[200px] h-[200px] bg-amber-400/10 rounded-full blur-[80px]" />

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          {/* Label */}
          <div className="about-hero-label flex items-center gap-3 mb-8">
            <div className="h-[2px] w-12 bg-amber-400" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gray-600 font-mono">
              About Us
            </span>
          </div>

          {/* Title */}
          <h1 className="about-hero-title text-4xl sm:text-6xl lg:text-8xl font-black leading-[0.95] tracking-tighter mb-8">
            <span className="block text-[#1a1a1a]">Engineered</span>
            <span className="block text-[#1a1a1a]">for the</span>
            <span className="block text-amber-500 italic font-serif">Industry</span>
          </h1>

          {/* Divider */}
          <div className="about-hero-line h-[2px] w-full max-w-md bg-gradient-to-r from-amber-400 to-transparent mb-8 origin-left" />

          {/* Description */}
          <p className="about-hero-desc text-gray-700 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed">
            We are a global B2B supplier of precision-engineered automobile components.
            From turbocharged engines to adaptive suspensions — we build the parts
            that power the world&apos;s most demanding machines.
          </p>
        </div>
      </section>

      {/* ============================================================
          STATS SECTION
         ============================================================ */}
      <section className="stats-section w-full py-16 sm:py-24 px-6 sm:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard number="25+" label="Years in Business" icon={Award} className="stat-card"/>
            <StatCard number="500+" label="Global Clients" icon={Globe} className="stat-card" />
            <StatCard number="12K" label="Parts Delivered" icon={Zap} className="stat-card" />
            <StatCard number="98%" label="Client Retention" icon={Users} className="stat-card" />
          </div>
        </div>
      </section>

      {/* ============================================================
          OUR STORY SECTION
         ============================================================ */}
      <section className="story-section w-full py-16 sm:py-24 px-6 sm:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Image side */}
          <div className="story-image w-full lg:w-1/2 relative">
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -top-4 -left-4 w-full h-full border border-amber-500/30 rounded-xl" />
              <div className="relative liquid-glass rounded-xl overflow-hidden">
                <div className="aspect-[4/3] w-full relative">
                  <Image src="/owner.jpg" alt="Owner" fill className="object-cover" />
                </div>
              </div>
              {/* Tag */}
              <div className="absolute -bottom-3 -right-3 bg-amber-400 text-black text-[10px] sm:text-xs font-black uppercase tracking-wider px-4 py-2">
                Since 2001
              </div>
            </div>
          </div>

          {/* Content side */}
          <div className="story-content w-full lg:w-1/2">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[2px] w-8 bg-amber-400" />
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-amber-600 font-mono">
                Our Story
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1a1a] leading-tight tracking-tight mb-6">
              Built on <span className="italic font-serif text-amber-500">Precision</span>
            </h2>
            <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
              <p>
                Founded in 2001, we started as a small workshop specializing in engine
                components for regional manufacturers. Our obsession with tolerances measured
                in microns set us apart from the very beginning.
              </p>
              <p>
                Today, we operate across 3 continents with state-of-the-art CNC machining
                centers, serving OEMs and aftermarket suppliers who demand nothing short of
                perfection. Every component that leaves our facility undergoes a 47-point
                quality inspection.
              </p>
              <p>
                We don&apos;t just make parts — we engineer confidence into every machine
                that carries our name.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 liquid-glass text-[#1a1a1a] text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full">
                <Shield className="w-3 h-3 text-amber-500" /> ISO 9001 Certified
              </div>
              <div className="flex items-center gap-2 liquid-glass text-[#1a1a1a] text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full">
                <Award className="w-3 h-3 text-amber-500" /> IATF 16949
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CORE VALUES SECTION (with Slope Dividers)
         ============================================================ */}
      <section className="values-section w-full py-16 sm:py-24 px-6 sm:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="mb-12 sm:mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-8 bg-amber-400" />
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-amber-600 font-mono">
                What Drives Us
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1a1a] tracking-tight">
              Core Values
            </h2>
          </div>

          {/* Values grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Value 1 */}
            <div className="value-card group relative overflow-hidden">
              <div className="h-[40px] flex w-full">
                <div className="bg-[#EEBA2B] w-[50%] rounded-tl-xl flex items-center pl-6 -mr-px">
                  <span className="text-[10px] font-black text-black uppercase tracking-widest">01</span>
                </div>
                <SlopeDown colorClass="text-[#EEBA2B]" />
                <div className="grow opacity-0" />
              </div>
              <div className="bg-[#EEBA2B] p-6 sm:p-8 -mt-px min-h-[200px] flex flex-col justify-between group-hover:bg-[#ffd000] transition-colors duration-300">
                <div>
                  <Target className="w-8 h-8 text-black/70 mb-4" />
                  <h3 className="text-xl sm:text-2xl font-black text-black mb-3">Precision First</h3>
                  <p className="text-black/70 text-sm leading-relaxed">
                    Every micron matters. We hold tolerances that others consider impossible,
                    because the machines we supply demand nothing less.
                  </p>
                </div>
              </div>
            </div>

            {/* Value 2 */}
            <div className="value-card group relative overflow-hidden">
              <div className="h-[40px] flex w-full">
                <div className="bg-[#d9d9d9] w-[50%] rounded-tl-xl flex items-center pl-6 -mr-px">
                  <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest">02</span>
                </div>
                <SlopeDown colorClass="text-[#d9d9d9]" />
                <div className="grow opacity-0" />
              </div>
              <div className="bg-[#d9d9d9] p-6 sm:p-8 -mt-px min-h-[200px] flex flex-col justify-between group-hover:bg-[#e8e8e8] transition-colors duration-300">
                <div>
                  <Shield className="w-8 h-8 text-gray-700 mb-4" />
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">Relentless Quality</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    47-point inspection on every unit. Zero-defect philosophy isn&apos;t our
                    goal — it&apos;s our baseline. We ship confidence.
                  </p>
                </div>
              </div>
            </div>

            {/* Value 3 */}
            <div className="value-card group relative overflow-hidden sm:col-span-2 lg:col-span-1">
              <div className="h-[40px] flex w-full">
                <div className="bg-[#1a1a1a] w-[50%] rounded-tl-xl flex items-center pl-6 -mr-px">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">03</span>
                </div>
                <SlopeDown colorClass="text-[#1a1a1a]" />
                <div className="grow opacity-0" />
              </div>
              <div className="bg-[#1a1a1a] p-6 sm:p-8 -mt-px min-h-[200px] flex flex-col justify-between group-hover:bg-[#252525] transition-colors duration-300 border border-gray-700">
                <div>
                  <Globe className="w-8 h-8 text-amber-400 mb-4" />
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-3">Global Reach</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Three continents. Hundreds of OEM partners. We deliver anywhere the
                    road takes you — on time, every time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          TIMELINE / MILESTONES SECTION
         ============================================================ */}
      <section className="timeline-section w-full py-16 sm:py-24 px-6 sm:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="mb-12 sm:mb-16 text-center">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-amber-600 font-mono">
              Our Journey
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1a1a] tracking-tight mt-3">
              Milestones
            </h2>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-amber-500 via-amber-500/50 to-transparent" />

            {/* Timeline items */}
            <div className="space-y-10 sm:space-y-12">
              <div className="timeline-item relative pl-12 sm:pl-16">
                <div className="absolute left-[9px] sm:left-[17px] top-1 w-4 h-4 rounded-full bg-amber-500 border-4 border-gray-300 z-10" />
                <span className="text-amber-600 text-xs font-mono font-bold">2001</span>
                <h3 className="text-lg sm:text-xl font-bold text-[#1a1a1a] mt-1">Founded in Detroit</h3>
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                  Started as a 12-person workshop specializing in forged steel engine blocks
                  for regional V6 manufacturers.
                </p>
              </div>

              <div className="timeline-item relative pl-12 sm:pl-16">
                <div className="absolute left-[9px] sm:left-[17px] top-1 w-4 h-4 rounded-full bg-amber-500 border-4 border-gray-300 z-10" />
                <span className="text-amber-600 text-xs font-mono font-bold">2008</span>
                <h3 className="text-lg sm:text-xl font-bold text-[#1a1a1a] mt-1">ISO 9001 Certified</h3>
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                  Achieved international quality certification, opening doors to OEM partnerships
                  across North America and Europe.
                </p>
              </div>

              <div className="timeline-item relative pl-12 sm:pl-16">
                <div className="absolute left-[9px] sm:left-[17px] top-1 w-4 h-4 rounded-full bg-amber-500 border-4 border-gray-300 z-10" />
                <span className="text-amber-600 text-xs font-mono font-bold">2014</span>
                <h3 className="text-lg sm:text-xl font-bold text-[#1a1a1a] mt-1">European Expansion</h3>
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                  Opened our second facility in Stuttgart, Germany. Began supplying suspension
                  systems to premium European automakers.
                </p>
              </div>

              <div className="timeline-item relative pl-12 sm:pl-16">
                <div className="absolute left-[9px] sm:left-[17px] top-1 w-4 h-4 rounded-full bg-amber-500 border-4 border-gray-300 z-10" />
                <span className="text-amber-600 text-xs font-mono font-bold">2019</span>
                <h3 className="text-lg sm:text-xl font-bold text-[#1a1a1a] mt-1">Asia-Pacific Operations</h3>
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                  Launched our third plant in Nagoya, Japan. Turbocharger product line introduced
                  with aerospace-grade materials.
                </p>
              </div>

              <div className="timeline-item relative pl-12 sm:pl-16">
                <div className="absolute left-[9px] sm:left-[17px] top-1 w-4 h-4 rounded-full bg-amber-500 border-4 border-gray-300 z-10" />
                <span className="text-amber-600 text-xs font-mono font-bold">2024</span>
                <h3 className="text-lg sm:text-xl font-bold text-[#1a1a1a] mt-1">500+ Global Clients</h3>
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                  Surpassed 500 active B2B partnerships. Recognized as a Top-10 global supplier
                  in precision powertrain components.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA SECTION
         ============================================================ */}
      <section className="cta-section w-full py-16 sm:py-24 px-6 sm:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <div className="cta-content relative overflow-hidden rounded-2xl">
            {/* Slope header */}
            <div className=" h-[40px] sm:h-[50px] flex w-full">
              <div className="bg-[#EEBA2B] w-[40%] sm:w-[20%] rounded-tl-xl flex items-center pl-6 sm:pl-8 -mr-px">
                <span className="text-[10px] font-black text-black uppercase tracking-widest">Let&apos;s Talk</span>
              </div>
              <SlopeDown colorClass="text-[#EEBA2B]" />
              <div className="grow opacity-0" />
            </div>

            {/* Content */}
            <div className="liquid-glass -mt-px p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 rounded-b-2xl">
              <div className="max-w-lg">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1a1a] leading-tight tracking-tight mb-4">
                  Ready to <span className="italic font-serif text-amber-500">Partner?</span>
                </h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Whether you need custom engine components, bulk suspension systems,
                  or next-gen turbochargers — we&apos;re ready to deliver.
                </p>
              </div>
              <Link
                href="/contact"
                className="group bg-black text-white px-8 sm:px-10 py-4 text-xs sm:text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] flex items-center gap-3 whitespace-nowrap"
              >
                Get in Touch
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
