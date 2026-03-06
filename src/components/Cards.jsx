"use client";

import React from 'react'
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ArrowRight, Star, CheckCircle2, Zap, ShieldCheck } from "lucide-react"; 
import Link from "next/link";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// Unified Tab Header component
const TabHeader = ({ 
  widthClass = "w-[calc(40%+40px)] sm:w-[calc(20%+40px)] md:w-[calc(20%+60px)]",
  plClass = "pl-6 sm:pl-16 lg:pl-24",
  children 
}) => (
  <div className={`tab-shape relative bg-[rgba(20,20,20,0.1)] backdrop-blur-xl border-t border-l border-white/10 rounded-tl-lg flex items-center pointer-events-auto ${widthClass}`}>
    
    <svg className="absolute right-0 top-0 h-full w-[40px] md:w-[60px] pointer-events-none" preserveAspectRatio="none">
      <line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
    </svg>

    <div className={`w-full h-full flex items-center pr-[40px] md:pr-[60px] ${plClass}`}>
       {children}
    </div>
  </div>
);

const Cards = () => {
  
  useGSAP(() => {
    const boxes = gsap.utils.toArray(".box");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".bigbox",
        start: "bottom bottom",
        end: "+=250%", 
        scrub: 0.3,
        pin: true,
        pinSpacing: true,
        refreshPriority: -1,
      },
    });

    boxes.forEach((box, index) => {
      // Card 1 (index 0) remains static as the base layer, 2 & 3 animate over it.
      if (index === 0) return;
      tl.from(box, {
        yPercent: 100,
        ease: "none",
        duration: 1,
        force3d: true,
      });
    });
  });

  return (
    <div className="bigbox relative w-full h-[90vh] my-10 overflow-hidden font-sans">
      
      {/* Dynamic responsive styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .tab-shape {
          clip-path: polygon(0 0, calc(100% - 40px) 0, 100% 100%, 0 100%);
        }
        @media (min-width: 768px) {
          .tab-shape {
            clip-path: polygon(0 0, calc(100% - 60px) 0, 100% 100%, 0 100%);
          }
        }
      `}} />

      {/* =========================================================
          GLOBAL OVERLAY: "SEE ALL" TAB
         ========================================================= */}
      <div className="absolute top-0 left-0 w-full z-50 pointer-events-none">
        <div className="md:h-[50px] h-[35px] flex w-full relative">
          <div className="md:grow-12 grow-15 border-b border-white/10 pointer-events-none"></div>
          
          <TabHeader widthClass="w-[calc(40%+20px)] sm:w-[calc(20%+40px)] md:w-[calc(20%+60px)]" plClass="pl-4 sm:pl-16 lg:pl-12">
            <Link
              href="/products"
              className="uppercase text-[10px] sm:text-xs lg:text-lg tracking-widest text-black mt-0 group w-full h-full cursor-pointer flex items-center gap-1.5 sm:gap-2 pointer-events-auto"
            >
              See all
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
               <ArrowRight className="w-[12px] h-[12px] md:w-[16px] md:h-[16px]" />
              </span>
            </Link>
          </TabHeader>

          <div className="flex-grow border-b border-white/10 rounded-tr-lg pointer-events-none"></div>
        </div>
      </div>

      {/* =========================================================
          CARD 1: Premium Engine Kit (STATIC BASE LAYER)
         ========================================================= */}
      <div className="box absolute z-10 w-full h-full flex flex-col pointer-events-none">
        <div className="md:h-[50px] h-[35px] flex w-full relative z-20 pointer-events-none">
          
          <TabHeader>
            <p className="uppercase text-[9px] sm:text-sm tracking-widest text-black/80 font-mono font-bold pointer-events-auto">
              01 // WRENCH KIT
            </p>
          </TabHeader>

          <div className="flex-grow border-b border-white/10 rounded-tr-lg pointer-events-none"></div>
        </div>

        {/* Removed overflow-y-auto and tightened padding (py-4) for mobile */}
        <div className="bg-[rgba(20,20,20,0.1)] border-b border-x border-white/10 backdrop-blur-xl flex-grow w-full flex flex-col md:flex-row items-center justify-start md:justify-between px-4 sm:px-12 lg:px-24 relative z-10 pointer-events-auto py-4 md:py-0 overflow-hidden rounded-b-lg">
          
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left relative z-10 mb-4 md:mb-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 md:mb-6">
              <div className="h-[2px] w-6 sm:w-8 bg-[#EEBA2B]" />
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-black font-mono font-bold">Flagship Series</span>
            </div>
            
            <h1 className="text-xl sm:text-4xl lg:text-5xl font-black text-white mb-2 leading-tight md:leading-[0.9] tracking-tight drop-shadow-sm">
              20V MAX XR High Torque<br className="hidden md:block" /> 3/4 in. Impact Wrench Kit
            </h1>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 my-2 md:my-6 text-[10px] sm:text-sm text-white font-mono border-t border-white/20 pt-3 md:pt-4 w-full max-w-sm">
              <div>
                <span className="block text-black text-[9px] sm:text-[10px] uppercase tracking-wider mb-0.5">Material</span>
                <span className="font-bold">Industrial Composite</span>
              </div>
              <div>
                <span className="block text-black text-[9px] sm:text-[10px] uppercase tracking-wider mb-0.5">MAX TORQUE</span>
                <span className="font-bold">1,200 Nm</span>
              </div>
              <div>
                <span className="block text-black text-[9px] sm:text-[10px] uppercase tracking-wider mb-0.5">Warranty</span>
                <span className="font-bold">3 Year Limited</span>
              </div>
              <div>
                <span className="block text-black text-[9px] sm:text-[10px] uppercase tracking-wider mb-0.5">Certification</span>
                <span className="font-bold">ISO 9001</span>
              </div>
            </div>

            <Link
              href="/products/20v-max-xr-high-torque-3-4-in-impact-wrench-w-hog-ring-anvil-5-0ah"
              className="group flex items-center gap-2 sm:gap-3 bg-[#EEBA2B] text-black px-4 sm:px-6 py-2 sm:py-3 text-[10px] sm:text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors mt-2 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] pointer-events-auto cursor-pointer"
            >
              View Specifications
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="w-full md:w-1/2 flex items-center justify-center relative pointer-events-none mt-2 md:mt-0">
            {/* Scaled background boxes */}
            <div className="absolute w-[160px] h-[160px] sm:w-[250px] sm:h-[250px] md:w-[350px] md:h-[350px] border border-white/10 rounded-xl rotate-6 pointer-events-none" />
            <div className="relative bg-white/5 backdrop-blur-md border border-white/20 p-2.5 sm:p-5 rounded-xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 pointer-events-auto">
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 bg-black/80 text-[#EEBA2B] text-[8px] sm:text-[10px] px-2 py-1 uppercase font-black tracking-wider">
                Flagship
              </div>
              
              <Image
                src="https://www.dewalt.com/NAG/PRODUCT/IMAGES/HIRES/Ecomm_Large-DCF897P2_LF2.jpg?resize=530x530"
                alt="20V MAX XR High Torque 3/4 in. Impact Wrench Kit"
                width={500}
                height={500}
                className="w-28 h-28 sm:w-40 sm:h-40 lg:w-80 lg:h-80 object-contain rounded-lg drop-shadow-lg"
              />
              <div className="mt-2 sm:mt-3 flex justify-between items-center border-t border-white/20 pt-2 sm:pt-3">
                <div>
                  <p className="text-[8px] sm:text-[10px] text-black uppercase tracking-wider font-mono">Weight</p>
                  <p className="text-xs sm:text-lg font-black text-white">3.5 kg</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] sm:text-[10px] text-black uppercase tracking-wider font-mono">Drive Size</p>
                  <p className="text-xs sm:text-lg font-black text-white">3/4 in.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          CARD 2: Advanced Suspension
         ========================================================= */}
      <div className="box absolute z-20 w-full h-full flex flex-col pointer-events-none">
        <div className="md:h-[50px] h-[35px] flex w-full relative z-20 pointer-events-none">
          <div className="grow-[0.45] hidden md:block border-b border-white/10 rounded-tl-lg pointer-events-none"></div>
          
          <TabHeader>
            <p className="uppercase text-[9px] sm:text-sm tracking-widest text-black font-black pointer-events-auto">
              02 // HAMMER KIT
            </p>
          </TabHeader>

          <div className="flex-grow border-b border-white/10 rounded-tr-lg pointer-events-none"></div>
        </div>

        <div className="bg-[rgba(20,20,20,0.1)] border-b border-x border-white/10 backdrop-blur-xl flex-grow w-full flex flex-col md:flex-row items-center justify-start md:justify-between px-4 sm:px-12 lg:px-24 relative z-10 pointer-events-auto py-4 md:py-0 overflow-hidden rounded-b-lg">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{backgroundImage:'repeating-linear-gradient(45deg,#fff 0px,#fff 1px,transparent 1px,transparent 14px)'}} />

          {/* Scaled decorative shapes & images */}
          <div className="w-full md:w-1/2 flex items-center justify-center relative mb-4 md:mb-0 pointer-events-none mt-2 md:mt-0">
            <div className="absolute w-[140px] h-[140px] sm:w-[220px] sm:h-[220px] md:w-[320px] md:h-[320px] border-2 border-white/20 rounded-full pointer-events-none" />
            <div className="absolute w-[120px] h-[120px] sm:w-[190px] sm:h-[190px] md:w-[290px] md:h-[290px] border border-white/10 border-dashed rounded-full pointer-events-none" />

            <div className="relative z-10 pointer-events-auto">
              <Image
                src="/fp2.jpg"
                alt="Adaptive Coilover Suspension"
                width={500}
                height={500}
                className="w-28 h-28 sm:w-48 sm:h-48 lg:w-80 lg:h-80 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -bottom-2 -right-2 bg-black/90 backdrop-blur-md text-[#EEBA2B] px-2 py-1.5 sm:px-4 sm:py-3 shadow-xl">
                <p className="text-[7px] sm:text-[9px] uppercase tracking-wider font-mono opacity-80">Impact Energy</p>
                <p className="text-sm sm:text-2xl font-black leading-none">41 joules</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left md:ml-10 lg:ml-16 relative z-10">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-black/50 backdrop-blur-sm text-[#EEBA2B] border border-white/10 px-2 sm:px-3 py-1 sm:py-1.5 w-fit mb-2 sm:mb-4 text-[9px] sm:text-xs font-black uppercase tracking-wider">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
              Top Rated · HEAVY DUTY
            </div>

            <h1 className="text-2xl sm:text-5xl lg:text-7xl font-black text-white mb-2 sm:mb-4 leading-[1] md:leading-[0.9] tracking-tighter drop-shadow-sm pointer-events-none">
              INDUSTRIAL<br />DEMOLITION HAMMER
            </h1>
            <p className="text-black text-[10px] sm:text-sm max-w-[280px] sm:max-w-sm mx-auto md:mx-0 mb-3 sm:mb-6 leading-relaxed font-mono font-medium pointer-events-none">
              High-performance 40 lb demolition hammer built for heavy concrete and masonry work. Its powerful motor delivers maximum impact energy. 
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-1.5 sm:gap-3 mb-3 sm:mb-8 pointer-events-none">
              <div className="flex items-center gap-1 sm:gap-1.5 text-[8px] sm:text-xs font-bold border border-white/20 px-2 sm:px-3 py-1 sm:py-2 uppercase tracking-wider text-white">
                <ShieldCheck className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-white" />  Industrial Grade Build
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 text-[8px] sm:text-xs font-bold border border-white/20 px-2 sm:px-3 py-1 sm:py-2 uppercase tracking-wider text-white">
                <CheckCircle2 className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-white" /> 3 Year Warranty
              </div>
            </div>

            <Link
              href="/products/40-lb-1-1-8-in-hex-in-line-demolition-hammer-kit"
              className="bg-[#EEBA2B] text-black px-5 sm:px-8 py-2.5 sm:py-4 text-[10px] sm:text-sm font-black uppercase tracking-widest hover:bg-white transition-colors border-2 border-transparent w-fit shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] pointer-events-auto cursor-pointer"
            >
              GET QUOTE
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================
          CARD 3: Best Seller 
         ========================================================= */}
      <div className="box absolute z-30 w-full h-full flex flex-col pointer-events-none">
        <div className="md:h-[50px] h-[35px] flex w-full relative z-20 pointer-events-none">
          <div className="grow-[1.6] hidden md:block border-b border-white/10 rounded-tl-lg pointer-events-none"></div>
          
          <TabHeader>
            <p className="uppercase text-[9px] sm:text-sm tracking-widest text-black font-black pointer-events-auto">
              03 • BEST SELLER
            </p>
          </TabHeader>

          <div className="flex-grow border-b border-white/10 rounded-tr-lg pointer-events-none"></div>
        </div>

        <div className="bg-[rgba(20,20,20,0.1)] border-b border-x border-white/10 backdrop-blur-xl flex-grow w-full flex flex-col items-center justify-start md:justify-center px-4 sm:px-12 lg:px-24 relative z-10 pointer-events-auto py-4 md:py-0 overflow-hidden rounded-b-lg">
          
          <div className="absolute top-0 right-0 w-[150px] h-[150px] sm:w-[300px] sm:h-[300px] md:w-[500px] md:h-[500px] bg-[#EEBA2B]/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center w-full max-w-6xl justify-between gap-4 sm:gap-8 md:gap-12 relative z-10 mt-2 md:mt-0">

            <div className="w-full md:w-1/2 text-center md:text-left relative z-10">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#EEBA2B] text-black px-2.5 sm:px-3 py-1 sm:py-1.5 w-fit mb-2 sm:mb-5 text-[9px] sm:text-xs font-black uppercase tracking-wider shadow-lg">
                <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                Best Seller · PROFESSIONAL
              </div>

              <h1 className="text-xl sm:text-4xl lg:text-6xl font-black text-white mb-2 sm:mb-4 leading-[1] md:leading-[0.9] tracking-tight drop-shadow-md pointer-events-none">
                INDUSTRIAL<br /><span className="text-[#EEBA2B]">METAL CUTTING</span><br /><span>CHOP SAW</span>
              </h1>
              <p className="text-white text-[10px] sm:text-sm max-w-[280px] sm:max-w-md mx-auto md:mx-0 mb-3 sm:mb-8 leading-relaxed font-mono pointer-events-none">
                Heavy-duty 14-inch chop saw designed for precise metal cutting in workshops. Features a QUIK-CHANGE™ keyless system and a powerful motor.
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-1.5 sm:gap-3 mb-3 sm:mb-8 pointer-events-none">
                <div className="flex items-center gap-1.5 text-[8px] sm:text-xs font-bold border border-white/20 text-white/90 px-2 sm:px-3 py-1 sm:py-2 uppercase tracking-wider">
                  <ShieldCheck className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#EEBA2B]" /> ISO 9001
                </div>
                <div className="flex items-center gap-1.5 text-[8px] sm:text-xs font-bold border border-white/20 text-white/90 px-2 sm:px-3 py-1 sm:py-2 uppercase tracking-wider">
                  <CheckCircle2 className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-green-400" /> Ready to Ship
                </div>
              </div>

              <Link
                href="/products/14-in-chop-saw-with-quik-change-keyless-blade-change-system"
                className="group inline-flex items-center gap-2 sm:gap-3 bg-white text-black px-5 sm:px-8 py-2.5 sm:py-4 text-[10px] sm:text-sm font-black uppercase tracking-widest hover:bg-[#EEBA2B] transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] pointer-events-auto cursor-pointer"
              >
                View Details
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="w-full md:w-1/2 flex justify-center relative pointer-events-none mt-2 sm:mt-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] md:w-[300px] md:h-[300px] bg-[#EEBA2B]/15 rounded-full blur-[60px] md:blur-[80px]" />

              <div className="relative bg-white/5 backdrop-blur-md border border-white/20 p-3 sm:p-6 w-full max-w-[240px] sm:max-w-sm shadow-2xl pointer-events-auto">
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-[#EEBA2B] text-black px-2 py-1 text-[8px] sm:text-[10px] font-black uppercase tracking-wider shadow-md z-10 pointer-events-none">
                  GTX-3076R
                </div>
                
                <div className="flex justify-center pointer-events-none">
                  <Image
                    src="https://www.dewalt.com/NAG/PRODUCT/IMAGES/HIRES/Ecomm_Large-D28715_F1.jpg?resize=530x530"
                    alt="Twin-Scroll Turbocharger GTX-3076R"
                    width={400}
                    height={400}
                    className="w-24 h-24 sm:w-48 sm:h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl"
                  />
                </div>
                
                <div className="mt-2 sm:mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-2 sm:pt-3 pointer-events-none">
                  <div>
                    <p className="text-[7px] sm:text-[10px] text-black uppercase tracking-wider font-mono">Power</p>
                    <p className="text-xs sm:text-lg font-black text-white">2,200 W</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[7px] sm:text-[10px] text-black uppercase tracking-wider font-mono">BLADE</p>
                    <p className="text-xs sm:text-lg font-black text-[#EEBA2B]">14 in.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[7px] sm:text-[10px] text-black uppercase tracking-wider font-mono">SPEED</p>
                    <p className="text-xs sm:text-lg font-black text-white">3,800 RPM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Cards