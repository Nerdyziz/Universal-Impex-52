"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getBrandTheme } from '@/lib/theme';

// --- UPDATED COMPONENT ---
// Accepts className and style to allow dynamic Tailwind switching
const SlopeDown = ({ className, style }) => (
  <div 
    className={`h-full w-[70px] relative z-20 slope-ref ${className}`} 
    style={style}
  >
    <svg 
      className={`w-full h-full block fill-current`} 
      viewBox="0 0 100 100" 
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0 L0 100 L100 100 Z" />
    </svg>
  </div>
);

/* ============================================================
   SKELETON COMPONENT
   ============================================================ */
const BrandsSkeleton = ({ isMobileView }) => (
  <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f8fafc">
    <div className="w-full h-auto lg:h-[80vh] pb-8 lg:pb-0">
      {isMobileView ? (
        /* ===== MOBILE SKELETON ===== */
        [0, 1, 2, 3].map((cardIndex) => (
          <div
            key={cardIndex}
            className={`relative block ${cardIndex === 0 ? '' : '-mt-12'}`}
            style={{ zIndex: cardIndex * 10 }}
          >
            <div className="w-full flex flex-col h-[140px] relative">
              {/* Folder Top Tab */}
              <div className="h-[30px] md:h-[50px] flex w-full relative z-10">
                <div className="w-[30%] -mr-px rounded-tl-xl bg-slate-200 flex items-center pl-8 shadow-top-right">
                  <Skeleton width={20} height={16} />
                </div>
                <SlopeDown className="text-slate-200" />
                <div className="grow opacity-0"></div>
              </div>
              
              {/* Folder Body */}
              <div className="grow w-full pl-8 md:pl-16 flex items-start -mt-px relative z-10 bg-slate-200 shadow-top-right pt-4">
                <div className="w-1/2">
                  <Skeleton height={24} />
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        /* ===== DESKTOP SKELETON ===== */
        [0, 1].map((rowIndex) => (
          <div 
            key={rowIndex} 
            className={`flex flex-row h-[40%] relative ${
              rowIndex === 0 ? '' : '-mt-16'
            }`}
            style={{ zIndex: rowIndex * 10 }}
          >
            {[0, 1].map((idx) => {
              // Replicate the 50/50 and 60/40 row widths
              const widthClass = rowIndex === 0 ? 'lg:w-[50%]' : (idx === 0 ? 'lg:w-[60%]' : 'lg:w-[40%]');
              
              return (
                <div key={idx} className={`block ${widthClass} flex flex-col h-full relative`}>
                  {/* Folder Top Tab */}
                  <div className="h-[50px] flex w-full relative z-10">
                    <div className={`w-[40%] ${rowIndex % 2 === 1 ? 'w-[50%]' : ''} -mr-px rounded-tl-xl bg-slate-200 flex items-center pl-8 shadow-top-right`}>
                      <Skeleton width={30} height={20} />
                    </div>
                    <SlopeDown className="text-slate-200" />
                    <div className="grow opacity-0"></div>
                  </div>
                  
                  {/* Folder Body */}
                  <div className="grow w-full pl-16 flex items-start pt-5 -mt-px relative z-10 bg-slate-200 shadow-top-right">
                    <div className="w-1/2 mt-2">
                      <Skeleton height={48} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  </SkeletonTheme>
);

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
const Products = () => {
  const container = useRef(null);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const brandsRef = useRef([]);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetch('/api/brands')
      .then(res => res.json())
      .then(json => {
        const data = json.success ? json.data : json;
        const mapped = data.map((b, i) => {
          const rowIndex = Math.floor(i / 2);
          const isEvenRow = rowIndex % 2 === 1; // 0-based: row 1,3,5... are "even" rows
          const posInRow = i % 2; // 0 = first card, 1 = second card

          // Odd rows (0,2,4...) = 50/50, Even rows (1,3,5...) = 60/40
          let width;
          if (isEvenRow) {
            width = posInRow === 0 ? 'lg:w-[60%]' : 'lg:w-[40%]';
          } else {
            width = 'lg:w-[50%]';
          }

          // No inter-card margin on mobile; clean stacking
          const marginTop = '';

          return {
            _id: b._id,
            title: b.name,
            number: b.number || String(i + 1).padStart(2, '0'),
            color: getBrandTheme(i),
            width,
            marginTop,
            imgs: b.imgs || [],
          };
        });
        setBrands(mapped);
        brandsRef.current = mapped;
      })
      .catch(() => setBrands([]))
      .finally(() => setLoading(false));
  }, []);

  const { contextSafe } = useGSAP(() => {
    if (brands.length === 0) return;
    
    // Set initial state immediately to prevent flash
    gsap.set(".label", { opacity: 0, y: 100 });

    // Initial Entrance Animation
    gsap.to(".label", {
      opacity: 1,
      y: 0, 
      stagger: {
        amount: 0.5,
        from: "end"
      },
      ease: "power3.out",
      delay: 0.3,
    });

  }, { scope: container, dependencies: [brands] }); 

  // --- HOVER HANDLERS (disabled on mobile) ---
  const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 1024;

  const handleMouseEnter = contextSafe((e, activeColor) => {
    if (isMobile()) return;
    const hoveredCard = e.currentTarget;
    const images = hoveredCard.querySelectorAll(".card-img");

    // 1. Activate Hovered Card
    gsap.to(hoveredCard, {
      y: -10,
      zIndex: 50,
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto", 
    });

    // 2. Animate Images Fan-out
    gsap.to(images, {
      y: -140, 
      x: (i) => (i - 1) * 60, 
      rotate: (i) => (i - 1) * 15 + gsap.utils.random(-5, 5), 
      scale: 1,
      opacity: 1,
      duration: 0.5,
      stagger: 0.1, 
      ease: "back.out(1.4)",
      overwrite: "auto",
    });

    // 3. Color Changes
    gsap.to(hoveredCard.querySelectorAll(".card-bg"), {
      backgroundColor: activeColor, 
      duration: 0.4,
      overwrite: "auto",
    });
    
    // Color Slope (SVG fill uses current text color)
    gsap.to(hoveredCard.querySelectorAll(".slope-ref"), {
      color: activeColor, 
      duration: 0.4,
      overwrite: "auto",
    });
    
    gsap.to(hoveredCard.querySelectorAll(".card-text"), {
      color: "#111827", 
      duration: 0.4,
      overwrite: "auto",
    });

    // 4. Deactivate Others
    const allCards = gsap.utils.toArray(".label");
    allCards.forEach((card) => {
      if (card !== hoveredCard) {
        gsap.to(card, {
          y: 0,
          zIndex: 1,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });

        gsap.to(card.querySelectorAll(".card-bg"), {
          backgroundColor: "#f5f5f5",
          duration: 0.4,
          overwrite: "auto",
        });
        
        gsap.to(card.querySelectorAll(".slope-ref"), {
          color: "#f5f5f5",
          duration: 0.4,
          overwrite: "auto",
        });

        gsap.to(card.querySelectorAll(".card-text"), {
          color: "#e5e5e5", 
          duration: 0.4,
          overwrite: "auto",
        });
      }
    });
  });

  const handleMouseLeave = contextSafe(() => {
    if (isMobile()) return;
    const allCards = gsap.utils.toArray(".label");
    
    allCards.forEach((card, index) => {
      const originalColor = brandsRef.current[index]?.color || '#d9d9d9'; 
      
      // Determine reset color logic for GSAP fallback
      let resetColor = originalColor;
      // The 3rd card (index 2) is the "special card" — white on mobile
      if (index === 2 && window.innerWidth < 768) { 
         resetColor = '#ffffff';
      }

      gsap.to(card, {
        scale: 1,
        y: 0,
        zIndex: 1,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });

      // Reset Images
      gsap.to(card.querySelectorAll(".card-img"), {
        y: 0, 
        x: 0, 
        opacity: 0,
        rotate: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.in",
        overwrite: "auto",
      });

      // Reset Colors
      // IMPORTANT: clearProps allows the CSS classes (bg-white/text-white) to take over again
      gsap.to(card.querySelectorAll(".card-bg"), {
        backgroundColor: resetColor, 
        duration: 0.4,
        overwrite: "auto",
        clearProps: "backgroundColor" 
      });
      
      gsap.to(card.querySelectorAll(".slope-ref"), {
        color: originalColor, 
        duration: 0.4,
        overwrite: "auto",
        clearProps: "color" 
      });

      gsap.to(card.querySelectorAll(".card-text"), {
        color: "#111827", 
        duration: 0.4,
        overwrite: "auto",
      });
    });
  });

  return (
    <div ref={container} className="w-full min-h-screen">
     <section className="relative w-full  flex flex-col justify-center px-6 sm:px-12 lg:px-24 pt-7 pb-3 overflow-hidden">
        {/* Decorative blurs for white background */}
        <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-[#EEBA2B]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 left-10 w-[200px] h-[200px] bg-[#EEBA2B]/20 rounded-full blur-[80px]" />

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          {/* Label */}
          <div className="products-hero-label flex items-center gap-3 mb-8">
            <div className="h-[2px] w-12 bg-[#EEBA2B]" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gray-800 font-mono font-bold">
              Trusted
            </span>
          </div>

          {/* Title */}
          <h1 className="products-hero-title text-4xl sm:text-6xl lg:text-8xl font-black leading-[0.95] tracking-tighter mb-8">
            <span className="block text-[#EEBA2B] italic font-serif">Brands</span>
          </h1>

          {/* Divider */}
          <div className="products-hero-line h-[2px] w-full max-w-md bg-gradient-to-r from-[#EEBA2B] to-transparent mb-8 origin-left" />
        </div>
        </section>
      
      {loading ? (
        <BrandsSkeleton isMobileView={isMobileView} />
      ) : brands.length === 0 ? (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-xl text-neutral-500">No brands found.</p>
        </div>
      ) : (
      <div className="w-full h-auto lg:h-[80vh] pb-8 lg:pb-0">
        
        {/* ===== MOBILE LAYOUT: Flat list of individual cards with equal overlap ===== */}
        {isMobileView && brands.map((card, cardIndex) => {
          const isSpecialCard = cardIndex === 2;
          return (
          <Link
            href={`/products?brand=${encodeURIComponent(card.title)}`}
            key={card._id}
            className={`relative block ${cardIndex === 0 ? '' : '-mt-12'}`}
            style={{ zIndex: cardIndex * 10 }}
          >
            <div
              className="label w-full flex flex-col h-[140px] cursor-pointer relative"
              onMouseEnter={(e) => handleMouseEnter(e, card.color)}
              onMouseLeave={handleMouseLeave}
            >
              {/* --- 3 IMAGES --- */}
              {card.imgs.map((imgUrl, i) => (
                <img 
                  key={i}
                  src={imgUrl} 
                  alt="work sample"
                  className="card-img absolute top-8 left-[15%] w-[200px] h-[140px] object-cover rounded-md shadow-xl border-4 border-white pointer-events-none opacity-0 z-0"
                  style={{ transformOrigin: "bottom center" }}
                />
              ))}

              {/* --- FOLDER TOP TAB --- */}
              <div className="h-[30px] md:h-[50px] flex w-full relative z-10"> 
                <div 
                  className={`card-bg w-[30%] -mr-px rounded-tl-xl flex items-center pl-8 shadow-top-right ${
                    isSpecialCard ? 'bg-white' : 'bg-[var(--dynamic-color)]'
                  }`}
                  style={{ '--dynamic-color': card.color }} 
                >
                  <span className="text-sm font-bold text-gray-900 card-text">{card.number}</span>
                </div>
                <SlopeDown 
                  className={isSpecialCard ? 'text-white' : 'text-[var(--dynamic-color)]'}
                  style={{ '--dynamic-color': card.color }}
                />
                <div className="grow opacity-0"></div> 
              </div>
              
              {/* --- FOLDER BODY --- */}
              <div 
                className={`card-bg grow w-full pl-8 md:pl-16 flex items-start -mt-px relative z-10 shadow-top-right ${
                  isSpecialCard ? 'bg-white' : 'bg-[var(--dynamic-color)]'
                }`}
                style={{ '--dynamic-color': card.color }}
              >
                <h2 className="text-lg md:text-3xl font-serif mt-4 md:mt-0 text-gray-900 card-text">{card.title}</h2>
              </div>
            </div>
          </Link>
          );
        })}

        {/* ===== DESKTOP LAYOUT: Paired rows with overlap ===== */}
        {!isMobileView && Array.from({ length: Math.ceil(brands.length / 2) }, (_, rowIndex) => {
          const startIndex = rowIndex * 2;
          return (
          <div 
            key={rowIndex} 
            className={`flex flex-row h-[40%] relative ${
              rowIndex === 0 
                ? '' 
                : `-mt-16 ${rowIndex % 2 === 1 ? 'pointer-events-none' : ''}`
            }`}
            style={{ zIndex: rowIndex * 10 }}
          >
            {brands.slice(startIndex, startIndex + 2).map((card, idx) => {
              const isSpecialCard = rowIndex === 1 && idx === 0;

              return (
                <Link 
                  href={`/products?brand=${encodeURIComponent(card.title)}`}
                  key={card._id}
                  className={`label block ${card.width} flex flex-col h-full cursor-pointer relative ${rowIndex % 2 === 1 ? 'pointer-events-auto' : ''}`}
                  onMouseEnter={(e) => handleMouseEnter(e, card.color)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* --- 3 IMAGES --- */}
                  {card.imgs.map((imgUrl, i) => (
                    <img 
                      key={i}
                      src={imgUrl} 
                      alt="work sample"
                      className="card-img absolute top-8 left-[25%] w-[200px] h-[140px] object-cover rounded-md shadow-xl border-4 border-white pointer-events-none opacity-0 z-0"
                      style={{ transformOrigin: "bottom center" }}
                    />
                  ))}

                  {/* --- FOLDER TOP TAB --- */}
                  <div className="h-[50px] flex w-full relative z-10"> 
                    <div 
                      className={`card-bg w-[40%] -mr-px ${rowIndex % 2 === 1 ? 'w-[50%]' : ''} rounded-tl-xl flex items-center pl-8 shadow-top-right ${
                         isSpecialCard 
                           ? 'bg-[var(--dynamic-color)]' 
                           : 'bg-[var(--dynamic-color)]'
                      }`}
                      style={{ '--dynamic-color': card.color }} 
                    >
                        <span className="text-sm font-bold text-gray-900 card-text">{card.number}</span>
                    </div>
                    
                    <SlopeDown 
                      className="text-[var(--dynamic-color)]"
                      style={{ '--dynamic-color': card.color }}
                    />
                    
                    <div className="grow opacity-0"></div> 
                  </div>
                  
                  {/* --- FOLDER BODY --- */}
                  <div 
                    className={`card-bg grow w-full pl-16 flex items-start pt-5 -mt-px relative z-10 shadow-top-right bg-[var(--dynamic-color)]`}
                    style={{ '--dynamic-color': card.color }}
                  >
                    <h2 className="text-6xl font-serif text-gray-900 card-text">{card.title}</h2>
                  </div>
                </Link>
              );
            })}
          </div>
          );
        })}

      </div>
      )}
    </div>
  );
}

export default Products;