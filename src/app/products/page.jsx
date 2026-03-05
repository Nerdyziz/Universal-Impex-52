"use client";

import React, { useRef, useState, useEffect, useCallback, Suspense } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Search, SlidersHorizontal, Loader2, X, ChevronDown } from "lucide-react";
import { getProductTheme } from "@/lib/theme";

gsap.registerPlugin(ScrollTrigger);

const safeImage = (src) => {
  if (!src || typeof src !== "string") return "/fp1.png";
  const s = src.trim().toLowerCase();
  if (!s || s === "n/a" || s === "na" || s === "none" || s === "null" || s === "undefined") return "/fp1.png";
  if (src.trim().startsWith("/") || src.trim().startsWith("data:")) return src.trim();
  try {
    new URL(src.trim());
    return src.trim();
  } catch {
    return "/fp1.png";
  }
};

const isExternal = (src) => {
  try {
    return src && (src.startsWith("http://") || src.startsWith("https://"));
  } catch {
    return false;
  }
};

// Normalise a single node into { name, children } — returns null if invalid
const normaliseNode = (raw) => {
  if (!raw) return null;
  if (typeof raw === "string") {
    const t = raw.trim();
    return t ? { name: t, children: [] } : null;
  }
  const name = String(raw.name ?? "").trim();
  if (!name) return null;
  const children = Array.isArray(raw.children)
    ? raw.children.map(normaliseNode).filter(Boolean)
    : [];
  return { name, children };
};

// Recursively clean an entire category array
const cleanTree = (arr) =>
  Array.isArray(arr) ? arr.map(normaliseNode).filter(Boolean) : [];

// Category tree filter node — renders expandable/collapsible category tree with Glass UI
function CategoryFilterNode({ node, depth = 0, activeCategory, onSelect, prefix = "" }) {
  const [expanded, setExpanded] = useState(false);
  // Normalise children once
  const validChildren = React.useMemo(
    () => (node.children ?? []).map(normaliseNode).filter(Boolean),
    [node.children]
  );
  const hasChildren = validChildren.length > 0;
  const fullPath = prefix ? `${prefix} > ${node.name}` : node.name;
  const isActive = activeCategory.toLowerCase() === fullPath.toLowerCase();
  const isParentOfActive = activeCategory.toLowerCase().startsWith(fullPath.toLowerCase() + " > ");

  useEffect(() => {
    if (isParentOfActive || isActive) setExpanded(true);
  }, [isParentOfActive, isActive]);

  // Skip rendering if this node has no valid name
  if (!node.name || !String(node.name).trim()) return null;

  return (
    <div>
      <div className="flex items-center gap-1 my-0.5" style={{ paddingLeft: depth * 12 }}>
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-amber-600 shrink-0 transition-transform"
          >
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${expanded ? "" : "-rotate-90"}`} />
          </button>
        ) : (
          <span className="w-5 h-5 shrink-0" />
        )}
        <button
          onClick={() => onSelect(fullPath.toLowerCase())}
          className={`text-left text-[11px] uppercase tracking-widest font-bold px-4 py-2 rounded-lg transition-all duration-300 border backdrop-blur-xl shadow-sm flex-1 ${
            isActive
              ? "bg-[#EEBA2B] text-black border-[#EEBA2B] shadow-[0_4px_15px_rgba(238,186,43,0.3)]"
              : isParentOfActive
              ? "bg-amber-100/50 text-amber-700 border-amber-200/50"
              : "bg-[rgba(20,20,20,0.05)] text-gray-700 border-black/10 hover:border-[#EEBA2B] hover:text-[#EEBA2B] hover:bg-white/50"
          }`}
        >
          {node.name}
        </button>
      </div>
      {expanded && hasChildren && (
        <div className="mt-1">
          {validChildren.map((child, ci) => (
            <CategoryFilterNode
              key={ci}
              node={child}
              depth={depth + 1}
              activeCategory={activeCategory}
              onSelect={onSelect}
              prefix={fullPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const Products = () => {
  const containerRef = useRef(null);
  const searchParams = useSearchParams();
  const brandFromUrl = searchParams.get("brand") || "";

  const [activeBrand, setActiveBrand] = useState(brandFromUrl);
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const PRODUCTS_PER_PAGE = 18;
  const sentinelRef = useRef(null);
  const animationsInitialized = useRef(false);

  // Debounce search query (400ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build the API URL for paginated products
  const buildApiUrl = useCallback((page) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(PRODUCTS_PER_PAGE));
    if (activeBrand) params.set("brand", activeBrand);
    if (activeCategory && activeCategory !== "all") params.set("category", activeCategory);
    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    return `/api/products?${params.toString()}`;
  }, [activeBrand, activeCategory, debouncedSearch]);

  // Fetch brands + featured products once on mount
  useEffect(() => {
    async function fetchInitial() {
      try {
        const [brandsRes, featuredRes] = await Promise.all([
          fetch("/api/brands"),
          fetch("/api/products?featured=true"),
        ]);
        const brandsJson = await brandsRes.json();
        const featuredJson = await featuredRes.json();
        if (brandsJson.success) setBrands(brandsJson.data);
        if (featuredJson.success) setFeaturedProducts(featuredJson.data);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
      }
    }
    fetchInitial();
  }, []);

  // Fetch first page when filters change
  useEffect(() => {
    let cancelled = false;
    async function fetchFirstPage() {
      setLoading(true);
      setProducts([]);
      setCurrentPage(1);
      setHasMore(true);
      try {
        const res = await fetch(buildApiUrl(1));
        const json = await res.json();
        if (!cancelled && json.success) {
          setProducts(json.data);
          if (json.pagination) {
            setTotalPages(json.pagination.totalPages);
            setHasMore(json.pagination.page < json.pagination.totalPages);
          } else {
            setHasMore(false);
          }
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchFirstPage();
    return () => { cancelled = true; };
  }, [buildApiUrl]);

  // Load more products (next page)
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    const nextPage = currentPage + 1;
    setLoadingMore(true);
    try {
      const res = await fetch(buildApiUrl(nextPage));
      const json = await res.json();
      if (json.success) {
        setProducts((prev) => [...prev, ...json.data]);
        setCurrentPage(nextPage);
        if (json.pagination) {
          setTotalPages(json.pagination.totalPages);
          setHasMore(nextPage < json.pagination.totalPages);
        } else {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error("Failed to load more products:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, currentPage, buildApiUrl]);

  // Infinite scroll via Intersection Observer
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, loadMore]);

  // Set brand from URL on mount
  useEffect(() => {
    if (brandFromUrl) setActiveBrand(brandFromUrl);
  }, [brandFromUrl]);

  // Get categories for active brand (tree structure)
  const activeBrandData = brands.find((b) => b.name === activeBrand);
  const brandCategoryTree = cleanTree(activeBrandData?.categories || []);

  // All unique category trees across all brands (deep-merged & cleaned)
  const allCategoryTree = React.useMemo(() => {
    const merged = [];
    const insertNode = (tree, node) => {
      const n = normaliseNode(node);
      if (!n) return;
      const existing = tree.find((t) => t.name.toLowerCase() === n.name.toLowerCase());
      if (existing) {
        for (const child of n.children) {
          insertNode(existing.children, child);
        }
      } else {
        // Deep-clone so we don't share references across brands
        tree.push({ name: n.name, children: [...n.children.map((c) => ({ ...c, children: [...(c.children || [])] }))] });
      }
    };
    for (const brand of brands) {
      for (const cat of (brand.categories || [])) {
        insertNode(merged, cat);
      }
    }
    return merged;
  }, [brands]);

  const categoryTree = activeBrand ? brandCategoryTree : allCategoryTree;

  // ---------- GSAP Animations ----------
  useEffect(() => {
  if (loading) return;
  if (animationsInitialized.current) return;

  ScrollTrigger.getAll().forEach(st => st.kill());

  // Set initial hidden state FIRST to prevent FOUC
  gsap.set(".products-hero-label", { y: 30, opacity: 0 });
  gsap.set(".products-hero-title span", { y: 80, opacity: 0 });
  gsap.set(".products-hero-line", { scaleX: 0 });
  gsap.set(".products-hero-desc", { y: 20, opacity: 0 });
  gsap.set(".products-filters", { y: 20, opacity: 0 });

  const heroTl = gsap.timeline({ delay: 0.05 });
  heroTl.to(".products-hero-label", {
    y: 0,
    opacity: 1,
    duration: 0.6,
    ease: "power2.out",
  });
  heroTl.to(
    ".products-hero-title span",
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
    ".products-hero-line",
    {
      scaleX: 1,
      duration: 0.8,
      ease: "power2.inOut",
    },
    "-=0.4"
  );
  heroTl.to(
    ".products-hero-desc",
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
    },
    "-=0.3"
  );
  heroTl.to(
    ".products-filters",
    {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    },
    "-=0.2"
  );

  if (document.querySelectorAll(".featured-card").length) {
    gsap.set(".featured-card", { y: 50, opacity: 0 });
    gsap.to(".featured-card", {
      y: 0,
      opacity: 1,
      stagger: 0.15,
      ease: "none",
      scrollTrigger: {
        trigger: ".featured-section",
        start: "top 85%",
        end: "top 25%",
        scrub: 1,
      },
    });
  }

  if (document.querySelectorAll(".product-card").length) {
    gsap.set(".product-card", { y: 40, opacity: 0 });
    gsap.to(".product-card", {
      y: 0,
      opacity: 1,
      stagger: 0.1,
      ease: "none",
      scrollTrigger: {
        trigger: ".products-grid",
        start: "top 85%",
        end: "top 25%",
        scrub: 1,
      },
    });
  }

  if (document.querySelector(".products-cta")) {
    gsap.set(".products-cta", { y: 50, opacity: 0 });
    gsap.to(".products-cta", {
      y: 0,
      opacity: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".products-cta",
        start: "top 85%",
        end: "top 25%",
        scrub: 1,
      },
    });
  }

  animationsInitialized.current = true;

  return () => {
    heroTl.kill();
    ScrollTrigger.getAll().forEach(st => st.kill());
  };
}, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 bg-[rgba(20,20,20,0.1)] backdrop-blur-2xl border border-black/10 rounded-2xl p-12 shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
          <Loader2 className="w-10 h-10 text-[#EEBA2B] animate-spin mx-auto" />
          <p className="text-sm font-bold uppercase tracking-widest text-gray-800">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full min-h-screen relative">
      
      {/* Inline styles for perfect seamless glass clips */}
      <style dangerouslySetInnerHTML={{__html: `
        .tab-shape-feat {
          clip-path: polygon(0 0, calc(100% - 40px) 0, 100% 100%, 0 100%);
        }
        @media (min-width: 640px) {
          .tab-shape-feat {
            clip-path: polygon(0 0, calc(100% - 60px) 0, 100% 100%, 0 100%);
          }
        }

        .tab-shape-prod {
          clip-path: polygon(0 0, calc(100% - 40px) 0, 100% 100%, 0 100%);
        }

        .tab-shape-cta {
          clip-path: polygon(0 0, calc(100% - 40px) 0, 100% 100%, 0 100%);
        }
        @media (min-width: 640px) {
          .tab-shape-cta {
            clip-path: polygon(0 0, calc(100% - 60px) 0, 100% 100%, 0 100%);
          }
        }
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      {/* ============================================================
          HERO SECTION
         ============================================================ */}
      <section className="relative w-full min-h-[70vh] flex flex-col justify-center px-6 sm:px-12 lg:px-24 pt-28 pb-12 overflow-hidden">
        {/* Decorative blurs for white background */}
        <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-[#EEBA2B]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 left-10 w-[200px] h-[200px] bg-[#EEBA2B]/20 rounded-full blur-[80px]" />

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          {/* Label */}
          <div className="products-hero-label flex items-center gap-3 mb-8">
            <div className="h-[2px] w-12 bg-[#EEBA2B]" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gray-800 font-mono font-bold">
              Catalog
            </span>
          </div>

          {/* Title */}
          <h1 className="products-hero-title text-4xl sm:text-6xl lg:text-8xl font-black leading-[0.95] tracking-tighter mb-8">
            <span className="block text-gray-900 drop-shadow-sm">Our</span>
            <span className="block text-[#EEBA2B] italic font-serif">Products</span>
          </h1>

          {/* Divider */}
          <div className="products-hero-line h-[2px] w-full max-w-md bg-gradient-to-r from-[#EEBA2B] to-transparent mb-8 origin-left" />

          {/* Description */}
          <p className="products-hero-desc text-gray-700 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed mb-6 font-medium">
            Precision-engineered components built for the world&apos;s most demanding machines.
            Every part undergoes a 47-point quality inspection before it leaves our facility.
          </p>

          {/* Active filter indicator (hero) */}
          {activeBrand && (
            <div className="products-filters flex items-center gap-2">
              <span className="text-xs text-gray-600 font-bold">Showing:</span>
              <span className="inline-flex items-center gap-1.5 bg-[rgba(20,20,20,0.1)] backdrop-blur-md border border-black/10 text-gray-900 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
                {activeBrand}
                {activeCategory !== "all" && (
                  <span className="text-black/30 mx-1">/</span>
                )}
                {activeCategory !== "all" && activeCategory}
                <button onClick={() => { setActiveBrand(""); setActiveCategory("all"); }} className="ml-1 hover:text-red-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          MOBILE FILTER BUTTON (fixed bottom)
         ============================================================ */}
      <button
        onClick={() => setFilterOpen(true)}
        className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] flex items-center gap-2 bg-[rgba(20,20,20,0.1)] backdrop-blur-3xl border border-black/10 text-gray-900 px-6 py-3.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.15)] text-xs font-black uppercase tracking-widest hover:bg-white transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4 text-[#EEBA2B]" />
        Filters
        {(activeBrand || activeCategory !== "all" || searchQuery) && (
          <span className="w-2 h-2 bg-[#EEBA2B] rounded-full" />
        )}
      </button>

      {/* ============================================================
          MOBILE FILTER DRAWER (slides up from bottom)
         ============================================================ */}
      <div
        className={`fixed inset-0 z-[100000] bg-black/20 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          filterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setFilterOpen(false)}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 z-[100001] bg-[rgba(255,255,255,0.85)] backdrop-blur-3xl border-t border-black/10 rounded-t-3xl shadow-[0_-20px_40px_rgba(0,0,0,0.1)] transition-transform duration-400 ease-in-out lg:hidden max-h-[85vh] overflow-y-auto ${
          filterOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="sticky top-0 bg-[rgba(255,255,255,0.95)] backdrop-blur-xl pt-4 pb-3 px-6 rounded-t-3xl z-10 border-b border-black/5">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-black text-gray-900 tracking-tight">Filters</h3>
            <button
              onClick={() => setFilterOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-black/5 transition-colors"
              aria-label="Close filters"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="px-6 pb-8 pt-4 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-8 py-3 text-sm bg-[rgba(20,20,20,0.05)] border border-black/10 text-gray-900 rounded-lg focus:outline-none focus:border-[#EEBA2B] focus:bg-white transition-all placeholder:text-gray-500 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Brands */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-mono block mb-3 font-bold">Brands</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setActiveBrand(""); setActiveCategory("all"); }}
                className={`text-[11px] uppercase tracking-widest font-bold px-4 py-2 rounded-lg transition-all duration-300 border shadow-sm ${
                  !activeBrand
                    ? "bg-[#EEBA2B] text-black border-[#EEBA2B] shadow-[0_4px_15px_rgba(238,186,43,0.3)]"
                    : "bg-[rgba(20,20,20,0.05)] text-gray-700 border-black/10 hover:border-[#EEBA2B]"
                }`}
              >
                All Brands
              </button>
              {brands.map((b) => (
                <button
                  key={b._id}
                  onClick={() => { setActiveBrand(b.name); setActiveCategory("all"); }}
                  className={`text-[11px] uppercase tracking-widest font-bold px-4 py-2 rounded-lg transition-all duration-300 border shadow-sm ${
                    activeBrand === b.name
                      ? "bg-[#EEBA2B] text-black border-[#EEBA2B] shadow-[0_4px_15px_rgba(238,186,43,0.3)]"
                      : "bg-[rgba(20,20,20,0.05)] text-gray-700 border-black/10 hover:border-[#EEBA2B]"
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          {categoryTree.length > 0 && (
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-mono block mb-3 font-bold">Categories</span>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`w-full text-left text-[11px] uppercase tracking-widest font-bold px-4 py-2.5 rounded-lg transition-all duration-300 border shadow-sm ${
                    activeCategory === "all"
                      ? "bg-[#EEBA2B] text-black border-[#EEBA2B] shadow-[0_4px_15px_rgba(238,186,43,0.3)]"
                      : "bg-[rgba(20,20,20,0.05)] text-gray-700 border-black/10 hover:border-[#EEBA2B]"
                  }`}
                >
                  All Categories
                </button>
                {categoryTree.map((cat, ci) => (
                  <CategoryFilterNode
                    key={ci}
                    node={cat}
                    depth={0}
                    activeCategory={activeCategory}
                    onSelect={setActiveCategory}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Clear + Apply */}
          <div className="flex gap-3 pt-4 border-t border-black/5">
            <button
              onClick={() => { setActiveBrand(""); setActiveCategory("all"); setSearchQuery(""); }}
              className="flex-1 py-3 text-xs font-bold uppercase tracking-widest border border-black/10 bg-white text-gray-700 rounded-lg hover:border-red-400 hover:text-red-500 transition-all shadow-sm"
            >
              Clear All
            </button>
            <button
              onClick={() => setFilterOpen(false)}
              className="flex-1 py-3 text-xs font-black uppercase tracking-widest bg-gray-900 text-[#EEBA2B] rounded-lg hover:bg-black transition-all shadow-md"
            >
              Show Results
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================
          MAIN CONTENT AREA (sidebar + products)
         ============================================================ */}
      <div className="w-full px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex gap-8">

          {/* ============================================================
              DESKTOP SIDEBAR
             ============================================================ */}
          <aside className="hidden lg:block w-[260px] shrink-0 sticky top-24 self-start max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar">
            <div className="space-y-6 pb-8 pr-2">
              {/* Sidebar header */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <SlidersHorizontal className="w-4 h-4 text-[#EEBA2B]" />
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Filters</h3>
                </div>
                <div className="h-[2px] w-8 bg-[#EEBA2B] mt-2" />
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-8 py-2.5 text-xs bg-[rgba(20,20,20,0.05)] border border-black/10 text-gray-900 rounded-lg focus:outline-none focus:border-[#EEBA2B] focus:bg-white backdrop-blur-xl shadow-inner transition-all placeholder:text-gray-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Brands */}
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-mono block mb-3 font-bold">Brands</span>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => { setActiveBrand(""); setActiveCategory("all"); }}
                    className={`text-left text-[11px] uppercase tracking-widest font-bold px-4 py-2.5 rounded-lg transition-all duration-300 border backdrop-blur-xl shadow-sm ${
                      !activeBrand
                        ? "bg-[#EEBA2B] text-black border-[#EEBA2B] shadow-[0_4px_15px_rgba(238,186,43,0.3)]"
                        : "bg-[rgba(20,20,20,0.05)] text-gray-700 border-black/10 hover:border-[#EEBA2B] hover:text-[#EEBA2B] hover:bg-white/50"
                    }`}
                  >
                    All Brands
                  </button>
                  {brands.map((b) => (
                    <button
                      key={b._id}
                      onClick={() => { setActiveBrand(b.name); setActiveCategory("all"); }}
                      className={`text-left text-[11px] uppercase tracking-widest font-bold px-4 py-2.5 rounded-lg transition-all duration-300 border backdrop-blur-xl shadow-sm ${
                        activeBrand === b.name
                          ? "bg-[#EEBA2B] text-black border-[#EEBA2B] shadow-[0_4px_15px_rgba(238,186,43,0.3)]"
                          : "bg-[rgba(20,20,20,0.05)] text-gray-700 border-black/10 hover:border-[#EEBA2B] hover:text-[#EEBA2B] hover:bg-white/50"
                      }`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-black/10" />

              {/* Categories */}
              {categoryTree.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-mono block mb-3 font-bold">Categories</span>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => setActiveCategory("all")}
                      className={`text-left text-[11px] uppercase tracking-widest font-bold px-4 py-2.5 rounded-lg transition-all duration-300 border backdrop-blur-xl shadow-sm ${
                        activeCategory === "all"
                          ? "bg-[#EEBA2B] text-black border-[#EEBA2B] shadow-[0_4px_15px_rgba(238,186,43,0.3)]"
                          : "bg-[rgba(20,20,20,0.05)] text-gray-700 border-black/10 hover:border-[#EEBA2B] hover:text-[#EEBA2B] hover:bg-white/50"
                      }`}
                    >
                      All Categories
                    </button>
                    {categoryTree.map((cat, ci) => (
                      <CategoryFilterNode
                        key={ci}
                        node={cat}
                        depth={0}
                        activeCategory={activeCategory}
                        onSelect={setActiveCategory}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-black/10" />

              {/* Clear filters */}
              {(activeBrand || activeCategory !== "all" || searchQuery) && (
                <button
                  onClick={() => { setActiveBrand(""); setActiveCategory("all"); setSearchQuery(""); }}
                  className="w-full text-center text-[11px] uppercase tracking-widest font-bold px-4 py-2.5 rounded-lg border border-black/10 bg-[rgba(20,20,20,0.02)] text-gray-600 hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 shadow-sm"
                >
                  Clear All Filters
                </button>
              )}

              {/* Results count */}
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mt-2">
                {products.length} product{products.length !== 1 ? "s" : ""} loaded
              </p>
            </div>
          </aside>

          {/* ============================================================
              RIGHT CONTENT (featured + grid + cta)
             ============================================================ */}
          <div className="flex-1 min-w-0">

            {/* ============================================================
                FEATURED PRODUCTS
               ============================================================ */}
            <section className="featured-section w-full ">
              <div className="w-full">
                {/* Section header */}
                <div className="mb-10 sm:mb-14">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-[2px] w-8 bg-[#EEBA2B]" />
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gray-800 font-mono font-bold">
                      Best Sellers
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight drop-shadow-sm">
                    Featured
                  </h2>
                </div>

                {/* Featured cards using Light Glass & unified Clip-path */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {featuredProducts.map((product, idx) => (
                    <Link
                      key={product._id}
                      href={`/products/${product.slug}`}
                      className="featured-card group relative block"
                    >
                      {/* Header row with perfect seam matching */}
                      <div className="h-[40px] sm:h-[50px] flex w-full relative z-20">
                        {/* Empty space has bottom border to close the box */}
                        <div className="absolute top-0 right-0 w-[50%] h-full border-b border-black/10" />
                        
                        <div className="tab-shape-feat relative w-[calc(50%+40px)] sm:w-[calc(50%+60px)] bg-[rgba(20,20,20,0.1)] backdrop-blur-2xl border-t border-l border-black/10 rounded-tl-2xl flex items-center pl-6">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">
                            0{idx + 1}
                          </span>
                          <svg className="absolute right-0 top-0 h-full w-[40px] sm:w-[60px] pointer-events-none" preserveAspectRatio="none">
                            <line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(0,0,0,0.1)" strokeWidth="2.5" />
                          </svg>
                        </div>
                      </div>

                      {/* Card body */}
                      <div
                        className="bg-[rgba(20,20,20,0.1)] backdrop-blur-2xl border-b border-x border-black/10 rounded-b-2xl p-6 pr-[140px] sm:p-8 sm:pr-[190px] h-[300px] sm:h-[350px] flex flex-col justify-between transition-all duration-500 relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.08)] group-hover:bg-[rgba(20,20,20,0.15)]"
                      >
                        {/* Inner glow */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#EEBA2B]/20 rounded-full blur-[50px] pointer-events-none" />

                        {/* Product image */}
                        <div className="absolute top-6 right-4 w-[110px] h-[110px] sm:w-[150px] sm:h-[150px] opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 drop-shadow-xl">
                          <Image
                            src={safeImage(product.image)}
                            alt={product.name}
                            fill
                            loading="lazy"
                            unoptimized={isExternal(product.image)}
                            className="object-contain"
                          />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 mt-auto">
                          <p className="text-[10px] uppercase tracking-[0.2em] font-mono mb-2 text-gray-600 font-bold">
                            {product.subtitle}
                          </p>
                          <h3 className="text-xl sm:text-2xl font-black leading-tight tracking-tight mb-4 text-gray-900 drop-shadow-sm">
                            {product.name}
                          </h3>

                          {/* CTA */}
                          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-900 group-hover:text-[#EEBA2B] group-hover:gap-4 transition-all duration-300">
                            View Details
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            {/* ============================================================
                ALL PRODUCTS GRID
               ============================================================ */}
            <section className="w-full py-12 sm:py-20">
              <div className="w-full">
                {/* Section header */}
                <div className="mb-10 sm:mb-14">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-[2px] w-8 bg-[#EEBA2B]" />
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gray-800 font-mono font-bold">
                      Full Catalog
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight drop-shadow-sm">
                    All Products
                  </h2>
                </div>

                {/* Grid */}
                <div className="products-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {products.map((product, idx) => (
                    <Link
                      key={product._id}
                      href={`/products/${product.slug}`}
                      className="product-card group block relative"
                    >
                      {/* Header row */}
                      <div className="h-[35px] flex w-full relative z-20">
                        {/* Empty space border */}
                        <div className="absolute top-0 right-0 w-[50%] h-full border-b border-black/10" />

                        <div className="tab-shape-prod relative w-[calc(50%+40px)] bg-[rgba(20,20,20,0.1)] backdrop-blur-2xl border-t border-l border-black/10 rounded-tl-xl flex items-center pl-5">
                          <span className="text-[9px] font-black uppercase tracking-widest text-gray-900">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <svg className="absolute right-0 top-0 h-full w-[40px] pointer-events-none" preserveAspectRatio="none">
                            <line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(0,0,0,0.1)" strokeWidth="2.5" />
                          </svg>
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="bg-[rgba(20,20,20,0.1)] backdrop-blur-2xl border-b border-x border-black/10 rounded-b-xl p-5 flex flex-col transition-all duration-500 relative overflow-hidden h-[320px] sm:h-[340px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] group-hover:bg-[rgba(20,20,20,0.13)]">
                        {/* Inner glow optional */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#EEBA2B]/5 rounded-full blur-[60px] pointer-events-none" />

                        {/* Image */}
                        <div className="relative w-full h-[140px] sm:h-[160px] mb-4 overflow-hidden rounded-lg shrink-0">
                          <Image
                            src={safeImage(product.image)}
                            alt={product.name}
                            fill
                            loading="lazy"
                            unoptimized={isExternal(product.image)}
                            className="object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-md"
                          />
                        </div>

                        {/* SKU tag */}
                        <span className="text-[9px] uppercase tracking-[0.2em] font-mono mb-1.5 text-gray-600 font-bold relative z-10">
                          {product.sku ? `SKU: ${product.sku}` : product.brand}
                        </span>

                        {/* Name */}
                        <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight mb-1 line-clamp-2 text-gray-900 drop-shadow-sm relative z-10">
                          {product.name}
                        </h3>
                        <p className="text-xs font-mono mb-4 line-clamp-1 text-gray-600 relative z-10">
                          {product.subtitle}
                        </p>

                        {/* CTA */}
                        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest mt-auto pt-3 border-t border-black/10 text-gray-900 group-hover:gap-3 group-hover:text-[#EEBA2B] transition-all duration-300 relative z-10">
                          Details
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Infinite scroll sentinel */}
                <div ref={sentinelRef} className="w-full h-1" />

                {/* Loading more indicator */}
                {loadingMore && (
                  <div className="flex items-center justify-center gap-3 py-10">
                    <Loader2 className="w-6 h-6 text-[#EEBA2B] animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                      Loading more products...
                    </span>
                  </div>
                )}

                {/* End of results */}
                {!hasMore && products.length > 0 && (
                  <p className="text-center text-xs text-gray-500 font-mono uppercase tracking-widest py-10">
                    All {products.length} products loaded
                  </p>
                )}

                {/* Empty state */}
                {!loading && products.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center bg-[rgba(20,20,20,0.05)] backdrop-blur-xl border border-black/10 rounded-2xl mt-6">
                    <Search className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Try selecting a different brand or category.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* ============================================================
                CTA SECTION
               ============================================================ */}
            <section className="w-full py-16 sm:py-24">
              <div className="w-full">
                <div className="products-cta relative block">
                  {/* Slope header */}
                  <div className="h-[40px] sm:h-[50px] flex w-full relative z-20">
                    <div className="absolute top-0 right-0 w-[60%] h-full border-b border-black/10" />

                    <div className="tab-shape-cta relative w-[calc(40%+40px)] sm:w-[calc(20%+60px)] bg-[rgba(20,20,20,0.1)] backdrop-blur-2xl border-t border-l border-black/10 rounded-tl-xl flex items-center pl-6 sm:pl-8">
                      <span className="text-[10px] font-black text-black uppercase tracking-widest">
                        Inquire
                      </span>
                      <svg className="absolute right-0 top-0 h-full w-[40px] sm:w-[60px] pointer-events-none" preserveAspectRatio="none">
                        <line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(0,0,0,0.1)" strokeWidth="2.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="bg-[rgba(20,20,20,0.1)] backdrop-blur-2xl border-b border-x border-black/10 p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 rounded-b-2xl shadow-[0_15px_40px_rgba(0,0,0,0.08)] relative overflow-hidden">
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#EEBA2B]/20 rounded-full blur-[80px] pointer-events-none" />

                    <div className="max-w-lg relative z-10">
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-4 drop-shadow-sm">
                        Need a <span className="italic font-serif text-[#EEBA2B]">Custom</span> Part?
                      </h2>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-medium">
                        We manufacture custom-spec components for OEMs and aftermarket
                        suppliers. Share your drawings and we&apos;ll deliver a quote within 48 hours.
                      </p>
                    </div>
                    <Link
                      href="/contact"
                      className="group relative z-10 bg-gray-900 text-[#EEBA2B] px-8 sm:px-10 py-4 text-xs sm:text-sm font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] flex items-center gap-3 whitespace-nowrap"
                    >
                      Request Quote
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

          </div>{/* end right content */}
        </div>{/* end flex */}
      </div>{/* end main content area */}
    </div>
  );
};

const ProductsPage = () => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-[#EEBA2B] animate-spin" />
    </div>
  }>
    <Products />
  </Suspense>
);

export default ProductsPage;