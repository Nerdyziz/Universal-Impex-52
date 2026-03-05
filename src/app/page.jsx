"use client";

import React from "react";
import { ReactLenis, useLenis } from "lenis/react";
import Cards from "@/components/Cards";
import Herosection from "@/components/Herosection";
import Vid from "@/components/Vid";
import Testimonial from "@/components/Testimonial";
import Label from "@/components/Label";
import Footer from "@/components/Footer";
import MagicBento, { cardData } from "@/components/MagicBento";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import IntroOverlay from "@/components/IntroOverlay";
import Herosection2 from "@/components/Herosection2";
import { useIntro } from "@/context/IntroContext";
import { Video } from "lucide-react";
import MobileCard from "@/components/MobileCard";


export default function Home() {
  const { introComplete } = useIntro();

  useLenis((lenis) => {
    // scroll listener
   
  });

  return (
    <>
      <ReactLenis root />

      
      {/* {!introComplete && (
        <IntroOverlay />
      )}

      {/* ===== Desktop: MagicBento (md and above) ===== 
      <div className={`pt-16 hidden md:block transition-opacity duration-700  ${introComplete ? 'opacity-100' : 'opacity-0'}`}>
        <MagicBento
          textAutoHide={true}
          enableStars
          enableSpotlight
          enableBorderGlow={true}
          enableTilt={false}
          enableMagnetism={false}
          clickEffect
          spotlightRadius={410}
          particleCount={12}
          glowColor="255, 253, 208"
          disableAnimations={false}
        />
      </div>

      {/* ===== Mobile: ScrollStack (below md) ===== 
      <div className={`md:hidden pt-20 px-4 transition-opacity duration-700 ${introComplete ? 'opacity-100' : 'opacity-0'}`}>
        <ScrollStack>
          {cardData.map((card, i) => (
            <ScrollStackItem
              key={i}
              itemClassName="bg-[#1a1a1a] border-t border-amber-400/20 shadow-[0_-6px_20px_rgba(0,0,0,0.4)]"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-amber-400">
                  {card.label}
                </span>
                <card.icon className="w-6 h-6 text-amber-400/40" />
              </div>

              <div className="my-auto py-4">
                <span className="text-5xl lg:text-6xl font-black text-white/90 tracking-tight leading-none">
                  {card.stat}
                </span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-amber-400/60 font-mono mt-2">
                  {card.statLabel}
                </span>
              </div>

              <div className="mt-auto">
                <h3 className="text-xl font-black text-white mb-1">{card.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{card.description}</p>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div> */}
{/* <Herosection /> */}
      <Vid />
      <MobileCard />
    
      <Cards  />
      <Label />
      
      <Testimonial />
    </>
  );
}
