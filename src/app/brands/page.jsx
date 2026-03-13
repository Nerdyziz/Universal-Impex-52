"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getBrandTheme } from '@/lib/theme';
import { MAIN_CATEGORIES } from '@/lib/categories';

gsap.registerPlugin(ScrollTrigger);

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
        [0, 1, 2, 3].map((cardIndex) => (
          <div
            key={cardIndex}
            className={`relative block ${cardIndex === 0 ? '' : '-mt-12'}`}
            style={{ zIndex: cardIndex * 10 }}
          >
            <div className="w-full flex flex-col h-[140px] relative">
              <div className="h-[30px] md:h-[50px] flex w-full relative z-10">
                <div className="w-[30%] -mr-px rounded-tl-xl bg-slate-200 flex items-center pl-8 shadow-top-right">
                  <Skeleton width={20} height={16} />
                </div>
                <SlopeDown className="text-slate-200" />
                <div className="grow opacity-0"></div>
              </div>
              <div className="grow w-full pl-8 md:pl-16 flex items-start -mt-px relative z-10 bg-slate-200 shadow-top-right pt-4">
                <div className="w-1/2">
                  <Skeleton height={24} />
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        [0, 1].map((rowIndex) => (
          <div 
            key={rowIndex} 
            className={`flex flex-row h-[40%] relative ${
              rowIndex === 0 ? '' : '-mt-16'
            }`}
            style={{ zIndex: rowIndex * 10 }}
          >
            {[0, 1].map((idx) => {
              const widthClass = rowIndex === 0 ? 'lg:w-[50%]' : (idx === 0 ? 'lg:w-[60%]' : 'lg:w-[40%]');
              return (
                <div key={idx} className={`block ${widthClass} flex flex-col h-full relative`}>
                  <div className="h-[50px] flex w-full relative z-10">
                    <div className={`w-[40%] ${rowIndex % 2 === 1 ? 'w-[50%]' : ''} -mr-px rounded-tl-xl bg-slate-200 flex items-center pl-8 shadow-top-right`}>
                      <Skeleton width={30} height={20} />
                    </div>
                    <SlopeDown className="text-slate-200" />
                    <div className="grow opacity-0"></div>
                  </div>
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
   CATEGORY SECTION — renders brands in the original folder layout
   ============================================================ */
const CategorySection = ({ category, sectionBrands, isMobileView, handleMouseEnter, handleMouseLeave }) => {
  const sectionRef = useRef(null);

  // Per-section ScrollTrigger entrance animation
  useGSAP(() => {
    if (sectionBrands.length === 0) return;
    const labels = sectionRef.current?.querySelectorAll('.label');
    if (!labels || labels.length === 0) return;

    gsap.set(labels, { opacity: 0, y: 80 });

    gsap.to(labels, {
      opacity: 1,
      y: 0,
      stagger: 0.12,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 85%",
        once: true,
      },
    });
  }, { scope: sectionRef, dependencies: [sectionBrands] });

  if (sectionBrands.length === 0) return null;

  // Extract original 3 palette colors for perfect vertical/horizontal alternation
  const baseColors = ["#ffe430", "#d9d9d9", "#ababab"];
  const localBrands = sectionBrands.map((card, i) => ({
    ...card,
    color: baseColors[i % 3],
    number: i < 9 ? `0${i + 1}` : `${i + 1}`,
  }));

  return (
    <section ref={sectionRef} className="mb-16">
      {/* Category Header */}
      <div className="flex items-center gap-4 mb-6 px-6 sm:px-12 lg:px-24">
        <div className="h-[2px] w-8 bg-[#EEBA2B]" />
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight uppercase">
          {category}
        </h2>
        <span className="text-[10px] bg-[#EEBA2B]/20 text-gray-800 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
          {sectionBrands.length} brand{sectionBrands.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Folder cards in original layout */}
      <div className="w-full h-auto pb-4 lg:pb-0" style={{ minHeight: isMobileView ? 'auto' : `${Math.ceil(localBrands.length / 2) * 200}px` }}>
        {/* ===== MOBILE LAYOUT ===== */}
        {isMobileView && localBrands.map((card, cardIndex) => {
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
                data-color={card.color}
              >
                {card.imgs.map((imgUrl, i) => (
                  <img 
                    key={i}
                    src={imgUrl} 
                    alt="work sample"
                    className="card-img absolute top-8 left-[15%] w-[200px] h-[140px] object-cover rounded-md shadow-xl border-4 border-white pointer-events-none opacity-0 z-0"
                    style={{ transformOrigin: "bottom center" }}
                  />
                ))}

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

        {/* ===== DESKTOP LAYOUT ===== */}
        {!isMobileView && Array.from({ length: Math.ceil(localBrands.length / 2) }, (_, rowIndex) => {
          const startIndex = rowIndex * 2;
          return (
            <div 
              key={rowIndex} 
              className={`flex flex-row relative ${
                rowIndex === 0 
                  ? '' 
                  : `-mt-16 ${rowIndex % 2 === 1 ? 'pointer-events-none' : ''}`
              }`}
              style={{ zIndex: rowIndex * 10, height: '200px' }}
            >
              {localBrands.slice(startIndex, startIndex + 2).map((card, idx) => {
                const isEvenRow = rowIndex % 2 === 1;
                let widthClass;
                if (isEvenRow) {
                  widthClass = idx === 0 ? 'lg:w-[60%]' : 'lg:w-[40%]';
                } else {
                  widthClass = 'lg:w-[50%]';
                }

                return (
                  <Link 
                    href={`/products?brand=${encodeURIComponent(card.title)}`}
                    key={card._id}
                    className={`label block ${widthClass} flex flex-col h-full cursor-pointer relative ${rowIndex % 2 === 1 ? 'pointer-events-auto' : ''}`}
                    onMouseEnter={(e) => handleMouseEnter(e, card.color)}
                    onMouseLeave={handleMouseLeave}
                    data-color={card.color}
                  >
                    {card.imgs.map((imgUrl, i) => (
                      <img 
                        key={i}
                        src={imgUrl} 
                        alt="work sample"
                        className="card-img absolute top-8 left-[25%] w-[200px] h-[140px] object-cover rounded-md shadow-xl border-4 border-white pointer-events-none opacity-0 z-0"
                        style={{ transformOrigin: "bottom center" }}
                      />
                    ))}

                    <div className="h-[50px] flex w-full relative z-10"> 
                      <div 
                        className={`card-bg w-[40%] -mr-px ${rowIndex % 2 === 1 ? 'w-[50%]' : ''} rounded-tl-xl flex items-center pl-8 shadow-top-right bg-[var(--dynamic-color)]`}
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
                    
                    <div 
                      className="card-bg grow w-full pl-16 flex items-start pt-5 -mt-px relative z-10 shadow-top-right bg-[var(--dynamic-color)]"
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
    </section>
  );
};

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
        const mapped = data.map((b, i) => ({
          _id: b._id,
          title: b.name,
          mainCategory: b.mainCategory || "",
          number: b.number || String(i + 1).padStart(2, '0'),
          color: getBrandTheme(i),
          imgs: b.imgs || [],
        }));
        setBrands(mapped);
        brandsRef.current = mapped;
      })
      .catch(() => setBrands([]))
      .finally(() => setLoading(false));
  }, []);

  const { contextSafe } = useGSAP(() => {
    // Animations are now handled per-section via CategorySection's ScrollTrigger
  }, { scope: container, dependencies: [brands] }); 

  const isMobileCheck = () => typeof window !== 'undefined' && window.innerWidth < 1024;

  const handleMouseEnter = contextSafe((e, activeColor) => {
    if (isMobileCheck()) return;
    const hoveredCard = e.currentTarget;
    const images = hoveredCard.querySelectorAll(".card-img");

    gsap.to(hoveredCard, {
      y: -10,
      zIndex: 50,
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto", 
    });

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

    gsap.to(hoveredCard.querySelectorAll(".card-bg"), {
      backgroundColor: activeColor, 
      duration: 0.4,
      overwrite: "auto",
    });
    
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
    if (isMobileCheck()) return;
    const allCards = gsap.utils.toArray(".label");
    
    allCards.forEach((card, index) => {
      const originalColor = card.dataset.color || '#d9d9d9'; 
      let resetColor = originalColor;
      if (index === 2 && typeof window !== 'undefined' && window.innerWidth < 768) { 
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

  // Group brands by main category
  const groupedBrands = MAIN_CATEGORIES.map((cat) => ({
    category: cat,
    brands: brands.filter((b) => b.mainCategory === cat),
  })).filter((group) => group.brands.length > 0);

  // Uncategorized brands (legacy)
  const uncategorized = brands.filter((b) => !b.mainCategory);

  return (
    <div ref={container} className="w-full min-h-screen">
     <section className="relative w-full flex flex-col justify-center px-6 sm:px-12 lg:px-24 pt-7 pb-3 overflow-hidden">
        {/* Decorative blurs */}
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
        <div className="w-full">
          {/* Render each category section with original folder layout */}
          {groupedBrands.map((group) => (
            <CategorySection
              key={group.category}
              category={group.category}
              sectionBrands={group.brands}
              isMobileView={isMobileView}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
            />
          ))}

          {/* Uncategorized brands */}
          {uncategorized.length > 0 && (
            <CategorySection
              category="Other Brands"
              sectionBrands={uncategorized}
              isMobileView={isMobileView}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Products;