"use client";
import React from 'react'
import CardSwap, { Card } from './CardSwap'
import CardSwap2, { Card2 } from './CardSwap2'
import BlurText from "./BlurText";
import LogoLoop from './LogoLoop';
import { Globe, Award, Truck, ShieldCheck, Users, Headphones } from 'lucide-react';

const imageLogos = [
  { src: "/b1.svg", alt: "Company 1"},
  { src: "/b2.svg", alt: "Company 2"},
  { src: "/b3.svg", alt: "Company 3"},
  { src: "/b4.svg", alt: "Company 4"},
  { src: "/b5.svg", alt: "Company 5"},
  { src: "/b6.svg", alt: "Company 6"},
  { src: "/b8.svg", alt: "Company 8"},
  { src: "/b9.svg", alt: "Company 9"},
  { src: "/b10.svg", alt: "Company 10"},
  { src: "/b11.svg", alt: "Company 11"},
];

const cardData = [
  { id: 1, icon: Globe, title: "Global Market Presence", desc: "With an expanding network of suppliers and clients across multiple regions, we help businesses access international markets while maintaining efficient supply chains and reliable partnerships.", stat: "40+", statLabel: "COUNTRIES CONNECTED", badge: "Worldwide" },
  { id: 2, icon: Award, title: "ISO 9001 Certified", desc: "Every product sourced through our network is carefully evaluated to meet international standards. We prioritize reliability, transparency and consistency to ensure our partners receive dependable industrial solutions.", stat: "0.02%", statLabel: "Defect Rate", badge: "Certified" },
  { id: 3, icon: Truck, title: "Express Fulfillment", desc: "Seamless coordination of shipments across international markets. From supplier dispatch to final delivery, we ensure reliable timelines and transparent movement of goods.", stat: "FAST", statLabel: "GLOBAL DELIVERY", badge: "Logistics" },
  { id: 4, icon: ShieldCheck, title: "Warranty", desc: "Every order backed by our industry-best 5-year warranty with hassle-free replacements and dedicated claim support.", stat: "5 Yrs", statLabel: "Full Coverage", badge: "Guarantee" },
  { id: 5, icon: Users, title: "OEM Partnerships", desc: "Strong partnerships with verified manufacturers and suppliers across multiple industries. We connect businesses with reliable sources, ensuring consistent quality, competitive pricing and dependable supply.", stat: "50+", statLabel: "GLOBAL PARTNERS", badge: "Enterprise" },
  { id: 6, icon: Headphones, title: "Global Trade Support", desc: "Dedicated assistance for sourcing, pricing and trade coordination. Our team ensures smooth communication with suppliers and buyers while helping businesses secure the right products at the right value.", stat: "24/7", statLabel: "TRADE ASSISTANCE", badge: "Support" }
];

const GlassContent = ({ icon: Icon, title, desc, stat, statLabel, badge }) => (
  <div className="w-full h-full min-h-[180px] md:min-h-[220px] bg-[rgba(20,20,20,0.1)] backdrop-blur-2xl border border-white/10 rounded-2xl p-4 md:p-6 shadow-[0_15px_40px_rgba(0,0,0,0.4)] flex flex-col justify-between relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-[#EEBA2B]/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <div className="flex items-center gap-2 md:gap-3">
          {Icon && <Icon className="w-4 h-4 md:w-5 md:h-5 text-[#EEBA2B]" strokeWidth={2.5} />}
          <h3 className="text-white text-sm md:text-xl font-black tracking-tight drop-shadow-md">
            {title}
          </h3>
        </div>
        {badge && (
          <span className="text-[8px] md:text-[9px] uppercase tracking-widest font-black bg-[#EEBA2B]/20 text-[#EEBA2B] px-1.5 md:px-2 py-0.5 border border-[#EEBA2B]/30 hidden sm:inline-block">
            {badge}
          </span>
        )}
      </div>
      <p className="text-gray-400 text-[10px] md:text-xs font-mono leading-relaxed line-clamp-3 md:line-clamp-none">
        {desc}
      </p>
    </div>
    {stat && (
      <div className="relative z-10 mt-2 md:mt-4 pt-2 md:pt-3 border-t border-white/10 flex items-end justify-between">
        <div>
          <span className="text-xl md:text-3xl font-black text-white leading-none">{stat}</span>
          <span className="block text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-[#EEBA2B]/70 font-mono mt-0.5 md:mt-1">{statLabel}</span>
        </div>
        <span className="text-[9px] md:text-[10px] text-gray-500 font-mono uppercase tracking-wider hidden sm:block">B2B Only</span>
      </div>
    )}
  </div>
);

const Vid = () => {
  return (
    <section className="video relative w-full bg-black overflow-hidden -mt-16 min-h-screen pt-28" aria-label="Automotive parts showcase video">
      {/* Video background */}
      <video
        src="/vid.mp4"
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />

      <div className="absolute inset-0 bg-black/45 z-10" />

      <div className="relative z-20 flex flex-col justify-between min-h-screen">
        <div className="flex-1 flex items-center justify-center pt-0 lg:pt-16">
          
          {/* Desktop Layout */}
          <div className="hidden xl:grid grid-cols-1 grid-rows-1 items-center w-full max-w-[1800px] mx-auto px-4 pointer-events-none min-h-[550px] 2xl:min-h-[650px]">
            
            {/* Left stack */}
            <div className="col-start-1 row-start-1 justify-self-start pointer-events-auto z-20">
              <CardSwap2
                width={460}
                height={340}
                cardDistance={-28}
                verticalDistance={70}
                delay={3000}
                skewAmount={-6}
                pauseOnHover
                containerClassName="perspective-[900px] overflow-visible origin-left xl:scale-[0.75] 2xl:scale-100 transition-transform duration-300"
              >
                {cardData.slice(3, 6).map((data) => (
                  <Card2 key={`desktop-left-${data.id}`}>
                    <GlassContent {...data} />
                  </Card2>
                ))}
              </CardSwap2>
            </div>

            {/* Center Text */}
            <div className="col-start-1 row-start-1 justify-self-center relative z-10 flex flex-col items-center justify-center w-full max-w-[900px] px-4 text-center">
              <BlurText
                text="CONNECTING INDUSTRIES Worldwide"
                delay={500}
                animateBy="words"
                direction="top"
                lastWordClassName="text-[#EEBA2B] italic font-serif"
                className="xl:text-6xl 2xl:text-7xl flex flex-col justify-center items-center font-black text-white select-none text-center drop-shadow-2xl leading-[1.1] gap-x-4 gap-y-2 w-full"
              />
            </div>

            {/* Right stack */}
            <div className="col-start-1 row-start-1 justify-self-end pointer-events-auto z-20">
              <CardSwap
                width={460}
                height={340}
                cardDistance={28}
                verticalDistance={70}
                delay={3000}
                pauseOnHover
                containerClassName="perspective-[1000px] overflow-visible origin-right xl:scale-[0.75] 2xl:scale-100 transition-transform duration-300"
              >
                {cardData.slice(0, 3).map((data) => (
                  <Card key={`desktop-right-${data.id}`}>
                    <GlassContent {...data} />
                  </Card>
                ))}
              </CardSwap>
            </div>
          </div>

          {/* Tablet / Mobile Layout */}
          <div className="w-full xl:hidden flex flex-col items-center px-2 sm:px-6 pb-8 justify-between">
            <div className="pointer-events-none shrink-0 w-full flex justify-center">
              <BlurText
                text="CONNECTING INDUSTRIES Worldwide"
                delay={300}
                animateBy="words"
                direction="top"
                lastWordClassName="text-[#EEBA2B] italic font-serif"
                className="text-[12.5vw] sm:text-[10vw] md:text-[9vw] font-black text-white text-center drop-shadow-2xl leading-[1] sm:leading-[1.05] flex flex-wrap justify-center gap-x-2 gap-y-1 w-full"
              />
            </div>
          </div>
        </div>

        <div className="relative z-30 w-full overflow-hidden pb-4">
          <LogoLoop logos={imageLogos} speed={50} direction="left" logoHeight={20} gap={40} hoverSpeed={0} scaleOnHover fadeOut fadeOutColor="rgba(0,0,0,0)" />
        </div>
      </div>
    </section>
  )
}

export default Vid