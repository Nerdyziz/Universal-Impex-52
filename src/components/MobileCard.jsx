"use client";
import React from 'react'
import  CardSwapMob, {Card3 } from './CardSwapMob';
import { Globe, Award, Truck, ShieldCheck, Users, Headphones } from 'lucide-react';


const cardData = [
  { id: 1, icon: Globe, title: "Global Reach", desc: "Serving 2,500+ B2B clients across 40+ countries with dedicated regional warehouses and localized support teams.", stat: "40+", statLabel: "Countries Served", badge: "Worldwide" },
  { id: 2, icon: Award, title: "ISO 9001 Certified", desc: "Every component passes our 12-stage quality inspection. Industry-leading 0.02% defect rate backed by third-party audits.", stat: "0.02%", statLabel: "Defect Rate", badge: "Certified" },
  { id: 3, icon: Truck, title: "Express Fulfillment", desc: "Same-day dispatch on 10,000+ SKUs. Bulk orders processed within 48 hours with real-time shipment tracking.", stat: "48 hrs", statLabel: "Bulk Turnaround", badge: "Logistics" },
  { id: 4, icon: ShieldCheck, title: "5-Year Warranty", desc: "Every order backed by our industry-best 5-year warranty with hassle-free replacements and dedicated claim support.", stat: "5 Yrs", statLabel: "Full Coverage", badge: "Guarantee" },
  { id: 5, icon: Users, title: "OEM Partnerships", desc: "Trusted supplier to 120+ OEM manufacturers. Custom white-label solutions with dedicated engineering consultation.", stat: "120+", statLabel: "OEM Partners", badge: "Enterprise" },
  { id: 6, icon: Headphones, title: "24/7 Trade Support", desc: "Round-the-clock technical assistance, bulk pricing consultation & custom sourcing for specialized requirements.", stat: "24/7", statLabel: "Always Available", badge: "Support" }
];

const GlassContent = ({ icon: Icon, title, desc, stat, statLabel, badge }) => (
  <div className="w-full h-full min-h-[180px] md:min-h-[220px] bg-[rgba(20,20,20,0.1)] backdrop-blur-2xl border border-white/10 rounded-2xl p-4 md:p-6 shadow-[0_15px_40px_rgba(0,0,0,0.4)] flex flex-col justify-between relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-[#EEBA2B]/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <div className="flex items-center gap-2 md:gap-3">
          {Icon && <Icon className="w-4 h-4 md:w-5 md:h-5 text-[#EEBA2B]" strokeWidth={2.5} />}
          <h3 className="text-black text-sm md:text-xl font-black tracking-tight drop-shadow-md">
            {title}
          </h3>
        </div>
        {badge && (
          <span className="text-[8px] md:text-[9px] uppercase tracking-widest font-black bg-[#EEBA2B]/20 text-[#EEBA2B] px-1.5 md:px-2 py-0.5 border border-[#EEBA2B]/30 hidden sm:inline-block">
            {badge}
          </span>
        )}
      </div>
      <p className="text-black text-[10px] md:text-xs font-mono leading-relaxed line-clamp-3 md:line-clamp-none">
        {desc}
      </p>
    </div>
    {stat && (
      <div className="relative z-10 mt-2 md:mt-4 pt-2 md:pt-3 border-t border-white/10 flex items-end justify-between">
        <div>
          <span className="text-xl md:text-3xl font-black text-black leading-none">{stat}</span>
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
       <div className="flex lg:hidden justify-center items-center w-full  pt-15  h-[350px] sm:h-[400px] shrink-0 pointer-events-auto">
                    <CardSwapMob
                      width={"90%"}
                      height={"100%"}
                      cardDistance={18}
                      verticalDistance={15}
                      skewAmount={0}
                      delay={3000}
                      pauseOnHover
                      containerClassName="flex items-center justify-center perspective-[1000px] overflow-visible "
                    >
                      {cardData.map((data) => (
                        
                          <Card3 key={`mobile-${data.id}`}>
                            <GlassContent {...data} />
                          </Card3>
                        
                      ))}
                    </CardSwapMob>
                  </div>
    </div>
  )
}

export default MobileCard
