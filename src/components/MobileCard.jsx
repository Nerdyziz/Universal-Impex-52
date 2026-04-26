"use client";
import React from 'react'
import  CardSwapMob, {Card3 } from './CardSwapMob';
import { Globe, Award, Truck, ShieldCheck, Users, Headphones } from 'lucide-react';


const cardData = [
  { id: 1, icon: Globe, title: "Global Market Presence", desc: "With an expanding network of suppliers and clients across multiple regions, we help businesses access international markets while maintaining efficient supply chains and reliable partnerships.", stat: "40+", statLabel: "COUNTRIES CONNECTED", badge: "Worldwide" },
  { id: 2, icon: Award, title: "ISO 9001 Certified", desc: "Every product sourced through our network is carefully evaluated to meet international standards. We prioritize reliability, transparency and consistency to ensure our partners receive dependable industrial solutions.", stat: "0.02%", statLabel: "Defect Rate", badge: "Certified" },
  { id: 3, icon: Truck, title: "Express Fulfillment", desc: "Seamless coordination of shipments across international markets. From supplier dispatch to final delivery, we ensure reliable timelines and transparent movement of goods.", stat: "FAST", statLabel: "GLOBAL DELIVERY", badge: "Logistics" },
  { id: 4, icon: ShieldCheck, title: "Warranty", desc: "Every order backed by our industry-best 5-year warranty with hassle-free replacements and dedicated claim support.", stat: "5 Yrs", statLabel: "Full Coverage", badge: "Guarantee" },
  { id: 5, icon: Users, title: "OEM Partnerships", desc: "Strong partnerships with verified manufacturers and suppliers across multiple industries. We connect businesses with reliable sources, ensuring consistent quality, competitive pricing and dependable supply.", stat: "50+", statLabel: "GLOBAL PARTNERS", badge: "Enterprise" },
  { id: 6, icon: Headphones, title: "Global Trade Support", desc: "Dedicated assistance for sourcing, pricing and trade coordination. Our team ensures smooth communication with suppliers and buyers while helping businesses secure the right products at the right value.", stat: "24/7", statLabel: "TRADE ASSISTANCE", badge: "Support" }
];


const GlassContent = ({ icon: Icon, title, desc, stat, statLabel, badge }) => (
  <div className="w-full h-full min-h-[180px] md:min-h-[220px] bg-[rgba(20,20,20,0.1)] backdrop-blur-2xl border border-white/10 rounded-2xl p-4 md:p-6 shadow-[0_15px_40px_rgba(0,0,0,0.4)] flex flex-col justify-between relative overflow-hidden shrink-0">
    <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-[#EEBA2B]/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <div className="flex items-center gap-2 md:gap-3">
          {Icon && <Icon className="w-4 h-4 md:w-5 md:h-5 text-[#EEBA2B]" strokeWidth={2.5} />}
          <h3 className="text-white text-[16px] md:text-xl font-black tracking-tight drop-shadow-md">
            {title}
          </h3>
        </div>
        {badge && (
          <span className="text-[8px] md:text-[9px] uppercase tracking-widest font-black bg-[#EEBA2B]/20 text-[#EEBA2B] px-1.5 md:px-2 py-0.5 border border-[#EEBA2B]/30 hidden sm:inline-block">
            {badge}
          </span>
        )}
      </div>
      <p className="text-white text-[12px] sm:text-[14px] md:text-xl font-mono leading-relaxed ">
        {desc}
      </p>
    </div>
    {stat && (
      <div className="relative z-10 mt-2 md:mt-4 pt-2 md:pt-3 border-t border-white/10 flex items-end justify-between">
        <div>
          <span className="text-xl md:text-3xl font-black text-white leading-none">{stat}</span>
          <span className="block text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-[#EEBA2B]/70 font-mono mt-0.5 md:mt-1">{statLabel}</span>
        </div>
        <span className="text-[9px] md:text-[10px] text-gray-900 font-mono uppercase tracking-wider hidden sm:block">B2B Only</span>
      </div>
    )}
  </div>
);
const MobileCard = () => {
  return (
    <div>
      <div className="flex xl:hidden justify-center items-center w-full pt-15 h-[350px] sm:h-[400px] shrink-0 pointer-events-auto">
        <CardSwapMob
          width={"90%"}
          height={"100%"}
         cardDistance={18}
          verticalDistance={15}
          skewAmount={0}
          /* Added touch-none and cursor utilities to your custom class */
          containerClassName="flex items-center justify-center perspective-[1000px] overflow-visible touch-none cursor-grab active:cursor-grabbing"
        >
          {cardData.map((data) => (
            <Card3 key={`mobile-${data.id}`}>
              <GlassContent {...data} />
            </Card3>
          ))}
        </CardSwapMob>
      </div>
    </div>
  );
};

export default MobileCard;
