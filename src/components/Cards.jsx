"use client";

import React, { useRef } from 'react'
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
  const containerRef = useRef(null);
  
  useGSAP(() => {
    const boxes = gsap.utils.toArray(".box");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        // Changed to "top 10%" so the top tabs never get pushed off-screen on short devices
        start: "bottom bottom", 
        end: "+=120%", 
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
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bigbox grid grid-cols-1 grid-rows-1 relative w-full my-4 md:my-8 overflow-hidden font-sans">
      
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
      <div className="col-start-1 row-start-1 w-full z-50 pointer-events-none h-fit">
        <div className="md:h-[50px] h-[35px] flex w-full relative">
          <div className="md:grow-12 grow-15 border-b border-white/10 pointer-events-none"></div>
          
          <TabHeader widthClass="w-[calc(40%+20px)] sm:w-[calc(20%+40px)] md:w-[calc(20%+60px)]" plClass="pl-4 sm:pl-16 lg:pl-12">
            <Link
              href="/products"
              className="uppercase text-[10px] sm:text-xs lg:text-lg tracking-widest text-black mt-0 group w-full h-full cursor-pointer flex items-center gap-1.5 sm:gap-2 pointer-events-auto font-bold"
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
      <div className="box col-start-1 row-start-1 z-10 w-full h-full flex flex-col pointer-events-none">
        <div className="md:h-[50px] h-[35px] flex w-full relative z-20 pointer-events-none shrink-0">
          
          <TabHeader>
            <p className="uppercase text-[9px] sm:text-sm tracking-widest text-black/80 font-mono font-bold pointer-events-auto">
              01 // WRENCH KIT
            </p>
          </TabHeader>

          <div className="flex-grow border-b border-white/10 rounded-tr-lg pointer-events-none"></div>
        </div>

        <div className="bg-[rgba(20,20,20,0.1)] backdrop-blur-xl border-b border-x border-white/10 flex-grow w-full flex flex-col md:flex-row items-center justify-center md:justify-between px-4 sm:px-10 md:px-16 lg:px-24 py-8 sm:py-10 md:py-12 gap-6 sm:gap-10 relative z-10 pointer-events-auto rounded-b-lg min-h-[60vh] md:min-h-[70vh]">
          
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left relative z-10 h-full">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 md:mb-4 mt-auto md:mt-0">
              <div className="h-[2px] w-4 sm:w-6 lg:w-8 bg-[#EEBA2B]" />
              <span className="text-[12px] sm:text-[14px] lg:text-[16px] uppercase tracking-[0.3em] text-black font-mono font-bold">Flagship Series</span>
            </div>
            
            <h1 className="text-[1.4rem] sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 leading-tight md:leading-[1.1] tracking-tight drop-shadow-sm">
              20V MAX XR High Torque<br className="hidden md:block" /> 3/4 in. Impact Wrench Kit
            </h1>
            
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:gap-y-3 my-2 md:my-4 text-[12px] sm:text-[14px] lg:text-sm text-white font-mono border-t border-white/20 pt-3 md:pt-4 w-full max-w-[280px] sm:max-w-sm">
              <div>
                <span className="block text-black text-[10px] sm:text-[12px] uppercase tracking-wider mb-0.5">Material</span>
                <span className="font-bold">Industrial Composite</span>
              </div>
              <div>
                <span className="block text-black text-[10px] sm:text-[12px] uppercase tracking-wider mb-0.5">MAX TORQUE</span>
                <span className="font-bold">1,200 Nm</span>
              </div>
              <div>
                <span className="block text-black text-[10px] sm:text-[12px] uppercase tracking-wider mb-0.5">Warranty</span>
                <span className="font-bold">3 Year Limited</span>
              </div>
              <div>
                <span className="block text-black text-[10px] sm:text-[12px] uppercase tracking-wider mb-0.5">Certification</span>
                <span className="font-bold">ISO 9001</span>
              </div>
            </div>

            <Link
              href="/products/20v-max-xr-high-torque-3-4-in-impact-wrench-w-hog-ring-anvil-5-0ah"
              className="group flex items-center gap-2 sm:gap-3 bg-[#EEBA2B] text-black px-4 sm:px-6 py-2.5 sm:py-3 text-[9px] sm:text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors mt-3 mb-auto md:mb-0 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] pointer-events-auto cursor-pointer"
            >
              View Specifications
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="w-full md:w-1/2 flex items-center justify-center relative pointer-events-none mt-2 md:mt-0 mb-4 md:mb-0">
            <div className="absolute w-[140px] h-[140px] sm:w-[220px] sm:h-[220px] md:w-[300px] md:h-[300px] lg:w-[350px] lg:h-[350px] border border-white/10 rounded-xl rotate-6 pointer-events-none" />
            <div className="relative bg-white/5 backdrop-blur-md border border-white/20 p-2.5 sm:p-5 rounded-xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 pointer-events-auto">
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 bg-black/80 text-[#EEBA2B] text-[7px] sm:text-[9px] px-2 py-1 uppercase font-black tracking-wider">
                Flagship
              </div>
              
              <Image
                src="https://in.dewalt.global//NAG/PRODUCT/IMAGES/HIRES/Ecomm_Large-DCF897P2_LF2.jpg?resize=530x530"
                alt="20V MAX XR High Torque 3/4 in. Impact Wrench Kit"
                width={600}
                height={600}
                className="w-40 h-40 sm:w-48 sm:h-48 lg:w-72 lg:h-72 object-contain rounded-lg drop-shadow-lg"
              />
              <div className="mt-2 sm:mt-3 flex justify-between items-center border-t border-white/20 pt-2 sm:pt-3">
                <div>
                  <p className="text-[7px] sm:text-[9px] text-black uppercase tracking-wider font-mono">Weight</p>
                  <p className="text-[11px] sm:text-sm lg:text-lg font-black text-white">3.5 kg</p>
                </div>
                <div className="text-right">
                  <p className="text-[7px] sm:text-[9px] text-black uppercase tracking-wider font-mono">Drive Size</p>
                  <p className="text-[11px] sm:text-sm lg:text-lg font-black text-white">3/4 in.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          CARD 2: Advanced Suspension
         ========================================================= */}
      <div className="box col-start-1 row-start-1 z-20 w-full h-full flex flex-col pointer-events-none">
        <div className="md:h-[50px] h-[35px] flex w-full relative z-20 pointer-events-none shrink-0">
          <div className="grow-[0.45] hidden md:block border-b border-white/10 rounded-tl-lg pointer-events-none"></div>
          
          <TabHeader>
            <p className="uppercase text-[9px] sm:text-sm tracking-widest text-black font-black pointer-events-auto">
              02 // HAMMER KIT
            </p>
          </TabHeader>

          <div className="flex-grow border-b border-white/10 rounded-tr-lg pointer-events-none"></div>
        </div>

        <div className="bg-[rgba(20,20,20,0.1)] backdrop-blur-xl border-b border-x border-white/10 flex-grow w-full flex flex-col md:flex-row items-center justify-center md:justify-between px-4 sm:px-10 md:px-16 lg:px-24 py-8 sm:py-10 md:py-12 gap-6 sm:gap-10 relative z-10 pointer-events-auto rounded-b-lg overflow-hidden min-h-[60vh] md:min-h-[70vh]">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{backgroundImage:'repeating-linear-gradient(45deg,#fff 0px,#fff 1px,transparent 1px,transparent 14px)'}} />

          {/* Scaled decorative shapes & images */}
          <div className="w-full md:w-1/2 flex items-center justify-center relative pointer-events-none mt-2 md:mt-0 order-2 md:order-1">
            <div className="absolute w-[130px] h-[130px] sm:w-[200px] sm:h-[200px] md:w-[280px] md:h-[280px] border-2 border-white/20 rounded-full pointer-events-none" />
            <div className="absolute w-[110px] h-[110px] sm:w-[170px] sm:h-[170px] md:w-[250px] md:h-[250px] border border-white/10 border-dashed rounded-full pointer-events-none" />

            <div className="relative z-10 pointer-events-auto mb-4 md:mb-0">
              <Image
                src="https://in.dewalt.global//NAG/PRODUCT/IMAGES/HIRES/Ecomm_Large-D25960K_1.jpg?resize=530x530"
                alt="Adaptive Coilover Suspension"
                width={600}
                height={600}
                className="w-40 h-40 sm:w-48 sm:h-48 lg:w-72 lg:h-72 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 bg-black/90 backdrop-blur-md text-[#EEBA2B] px-2.5 py-1.5 sm:px-4 sm:py-3 shadow-xl">
                <p className="text-[6px] sm:text-[8px] md:text-[9px] uppercase tracking-wider font-mono opacity-80">Impact Energy</p>
                <p className="text-[11px] sm:text-base md:text-xl font-black leading-none mt-0.5">41 joules</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left relative z-10 h-full order-1 md:order-2">
            <div className="inline-flex items-center gap-1 sm:gap-2 bg-black/50 backdrop-blur-sm text-[#EEBA2B] border border-white/10 px-2 sm:px-3 py-1 sm:py-1.5 w-fit mb-2 sm:mb-4 text-[10px] sm:text-[12px] md:text-xs font-black uppercase tracking-wider mt-auto md:mt-0">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
              Top Rated · HEAVY DUTY
            </div>

            <h1 className="text-[26px] sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 sm:mb-4 leading-[1] md:leading-[1.1] tracking-tighter drop-shadow-sm pointer-events-none">
              INDUSTRIAL<br />DEMOLITION HAMMER
            </h1>
            <p className="text-black text-[14px] sm:text-xs md:text-sm max-w-[280px] sm:max-w-sm mx-auto md:mx-0 mb-3 sm:mb-6 leading-relaxed font-mono font-medium pointer-events-none">
              High-performance 40 lb demolition hammer built for heavy concrete and masonry work. Its powerful motor delivers maximum impact energy. 
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-1.5 sm:gap-2 mb-4 sm:mb-8 pointer-events-none">
              <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[12px] md:text-xs font-bold border border-white/20 px-2 sm:px-3 py-1.5 sm:py-2 uppercase tracking-wider text-white">
                <ShieldCheck className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-white" /> Industrial Grade Build
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[12px] md:text-xs font-bold border border-white/20 px-2 sm:px-3 py-1.5 sm:py-2 uppercase tracking-wider text-white">
                <CheckCircle2 className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-white" /> 3 Year Warranty
              </div>
            </div>

            <Link
              href="/products/40-lb-1-1-8-in-hex-in-line-demolition-hammer-kit"
              className="bg-[#EEBA2B] text-black px-5 sm:px-8 py-2.5 sm:py-3.5 text-[9px] sm:text-xs font-black uppercase tracking-widest hover:bg-white transition-colors border-2 border-transparent w-fit shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] pointer-events-auto cursor-pointer mb-auto md:mb-0"
            >
              GET QUOTE
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================
          CARD 3: Best Seller 
         ========================================================= */}
      <div className="box col-start-1 row-start-1 z-30 w-full h-full flex flex-col pointer-events-none">
        <div className="md:h-[50px] h-[35px] flex w-full relative z-20 pointer-events-none shrink-0">
          <div className="grow-[1.6] hidden md:block border-b border-white/10 rounded-tl-lg pointer-events-none"></div>
          
          <TabHeader>
            <p className="uppercase text-[9px] sm:text-sm tracking-widest text-black font-black pointer-events-auto">
              03 • BEST SELLER
            </p>
          </TabHeader>

          <div className="flex-grow border-b border-white/10 rounded-tr-lg pointer-events-none"></div>
        </div>

        <div className="bg-[rgba(20,20,20,0.1)] backdrop-blur-xl border-b border-x border-white/10 flex-grow w-full flex flex-col items-center justify-center px-1 sm:px-10 md:px-16 lg:px-24 py-8 sm:py-10 md:py-12 relative z-10 pointer-events-auto rounded-b-lg overflow-hidden shrink-0 min-h-[60vh] md:min-h-[70vh]">
          
          <div className="absolute top-0 right-0 w-[150px] h-[150px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] bg-[#EEBA2B]/10 rounded-full blur-[60px] md:blur-[100px] pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between w-full max-w-6xl gap-6 sm:gap-10 relative z-10 h-full">

            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left relative z-10 h-full">
              <div className="inline-flex items-center gap-1 sm:gap-2 bg-[#EEBA2B] text-black px-2 sm:px-3 py-1 sm:py-1.5 w-fit mb-2 sm:mb-4 text-[10px] sm:text-[12px] md:text-xs font-black uppercase tracking-wider shadow-lg mt-auto md:mt-0">
                <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                Best Seller · PROFESSIONAL
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 sm:mb-4 leading-tight md:leading-[1.1] tracking-tight drop-shadow-md pointer-events-none">
                INDUSTRIAL<br /><span className="text-[#EEBA2B]">METAL CUTTING</span><br /><span>CHOP SAW</span>
              </h1>
              <p className="text-black text-[14px] sm:text-xs md:text-sm max-w-[280px] sm:max-w-sm mx-auto md:mx-0 mb-4 sm:mb-6 leading-relaxed font-mono pointer-events-none">
                Heavy-duty 14-inch chop saw designed for precise metal cutting in workshops. Features a QUIK-CHANGE™ keyless system and a powerful motor.
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-1.5 sm:gap-2 mb-4 sm:mb-8 pointer-events-none">
                <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[12px] md:text-xs font-bold border border-white/20 text-white/90 px-2 sm:px-3 py-1.5 sm:py-2 uppercase tracking-wider">
                  <ShieldCheck className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#EEBA2B]" /> ISO 9001
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[12px] md:text-xs font-bold border border-white/20 text-white/90 px-2 sm:px-3 py-1.5 sm:py-2 uppercase tracking-wider">
                  <CheckCircle2 className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-green-400" /> Ready to Ship
                </div>
              </div>

              <Link
                href="/products/14-in-chop-saw-with-quik-change-keyless-blade-change-system"
                className="group inline-flex items-center gap-2 sm:gap-3 bg-white text-black px-5 sm:px-8 py-2.5 sm:py-3.5 text-[9px] sm:text-xs font-black uppercase tracking-widest hover:bg-[#EEBA2B] transition-colors shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] pointer-events-auto cursor-pointer mb-auto md:mb-0"
              >
                View Details
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="w-full md:w-1/2 flex justify-center relative pointer-events-none mt-2 md:mt-0 mb-4 md:mb-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] md:w-[250px] md:h-[250px] bg-[#EEBA2B]/15 rounded-full blur-[50px] md:blur-[80px]" />

              <div className="relative bg-white/5 backdrop-blur-md border border-white/20 p-3 sm:p-5 lg:p-6 w-full max-w-[220px] sm:max-w-[280px] lg:max-w-sm shadow-2xl pointer-events-auto">
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-[#EEBA2B] text-black px-2 py-1 text-[7px] sm:text-[9px] font-black uppercase tracking-wider shadow-md z-10 pointer-events-none">
                  GTX-3076R
                </div>
                
                <div className="flex justify-center pointer-events-none pt-2">
                  <Image
                    src="https://in.dewalt.global//NAG/PRODUCT/IMAGES/HIRES/Ecomm_Large-D28715_F1.jpg?resize=530x530"
                    alt="Twin-Scroll Turbocharger GTX-3076R"
                    width={600}
                    height={600}
                    className="w-32 h-32 sm:w-40 sm:h-40 lg:w-56 lg:h-56 object-contain drop-shadow-2xl"
                  />
                </div>
                
                <div className="mt-3 sm:mt-5 grid grid-cols-3 gap-1 sm:gap-2 border-t border-white/10 pt-2 sm:pt-3 pointer-events-none">
                  <div>
                    <p className="text-[6px] sm:text-[8px] md:text-[9px] text-black uppercase tracking-wider font-mono">Power</p>
                    <p className="text-[10px] sm:text-xs lg:text-base font-black text-white">2,200 W</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[6px] sm:text-[8px] md:text-[9px] text-black uppercase tracking-wider font-mono">BLADE</p>
                    <p className="text-[10px] sm:text-xs lg:text-base font-black text-[#EEBA2B]">14 in.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[6px] sm:text-[8px] md:text-[9px] text-black uppercase tracking-wider font-mono">SPEED</p>
                    <p className="text-[10px] sm:text-xs lg:text-base font-black text-white">3,800 RPM</p>
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