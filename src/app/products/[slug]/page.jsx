"use client";

import React, { useRef, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  Clock,
  CheckCircle2,
  Send,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

gsap.registerPlugin(ScrollTrigger);

const safeImage = (src) => {
  if (!src || typeof src !== "string") return "/fp1.png";
  const s = src.trim().toLowerCase();
  if (
    !s ||
    s === "n/a" ||
    s === "na" ||
    s === "none" ||
    s === "null" ||
    s === "undefined"
  )
    return "/fp1.png";
  if (src.trim().startsWith("/") || src.trim().startsWith("data:"))
    return src.trim();
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

const ProductPage = () => {
  const { slug } = useParams();
  const containerRef = useRef(null);
  const [quantity, setQuantity] = useState(1);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteSending, setQuoteSending] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const [quoteName, setQuoteName] = useState("");
  const [quoteEmail, setQuoteEmail] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  // Fetch product and related products from API
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        const json = await res.json();
        if (json.success) {
          const p = json.data;
          setProduct(p);

          // Fetch related products in same category
          const relRes = await fetch(
            `/api/products?category=${encodeURIComponent(p.category)}`,
          );
          const relJson = await relRes.json();
          if (relJson.success) {
            setRelated(relJson.data.filter((r) => r._id !== p._id).slice(0, 3));
          }
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchProduct();
  }, [slug]);

  // GSAP Animations (Bulletproof fromTo approach)
  useGSAP(
    () => {
      if (loading || !product) return;

      const tl = gsap.timeline();

      // Use fromTo to strictly define start and end points
      tl.fromTo(
        ".product-back-link",
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
      );

      tl.fromTo(
        ".product-image-wrap",
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.2"
      );

      tl.fromTo(
        ".product-info > *",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        "-=0.5"
      );

      // Specs – scroll-triggered
      if (document.querySelectorAll(".spec-row").length) {
        gsap.fromTo(
          ".spec-row",
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.06,
            ease: "none",
            scrollTrigger: {
              trigger: ".specs-section",
              start: "top 75%",
              end: "top 35%",
              scrub: 2,
            },
          }
        );
      }

      // Related – scroll-triggered
      if (document.querySelectorAll(".related-card").length) {
        gsap.fromTo(
          ".related-card",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            ease: "none",
            scrollTrigger: {
              trigger: ".related-section",
              start: "top 85%",
              end: "top 35%",
              scrub: 2,
            },
          }
        );
      }
      
      // Let ScrollTrigger recalculate positions after a tiny delay in case layout shifts
      setTimeout(() => ScrollTrigger.refresh(), 100);
    },
    { dependencies: [loading, product, related], scope: containerRef }
  );

  const handleQuantity = (dir) => {
    setQuantity((prev) => {
      const next = prev + dir;
      return next < 1 ? 1 : next;
    });
  };

  const handleQuote = async (e) => {
    e.preventDefault();
    setQuoteSending(true);
    setQuoteError("");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          quantity,
          customerName: quoteName,
          customerEmail: quoteEmail,
          notes: quoteNotes,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setQuoteSubmitted(true);
        setTimeout(() => setQuoteSubmitted(false), 5000);
      } else {
        setQuoteError(json.error || "Failed to send quote");
      }
    } catch (err) {
      setQuoteError("Network error. Please try again.");
    } finally {
      setQuoteSending(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 bg-[rgba(20,20,20,0.05)] backdrop-blur-2xl border border-black/10 rounded-2xl p-12 shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
          <Loader2 className="w-10 h-10 text-[#EEBA2B] animate-spin mx-auto" />
          <p className="text-sm font-bold uppercase tracking-widest text-gray-800">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center px-6">
        <h1 className="text-5xl sm:text-7xl font-black text-gray-900 tracking-tight mb-4">
          404
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mb-8">
          Product not found.
        </p>
        <Link
          href="/products"
          className="group flex items-center gap-2 bg-gray-900 text-[#EEBA2B] px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors rounded-lg shadow-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Link>
      </div>
    );
  }

  // JSON-LD Product structured data for SEO
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description ||
      product.subtitle ||
      `${product.name} — high-quality automotive component`,
    image:
      product.image && product.image !== "/fp1.png" ? product.image : undefined,
    brand: product.brand
      ? { "@type": "Brand", name: product.brand }
      : undefined,
    category: product.category,
    sku: product.sku || product.slug,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price || undefined,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Universal Impex 52",
      },
    },
  };

  return (
    <div ref={containerRef} className="w-full min-h-screen overflow-hidden relative">
      
      {/* Inline styles for perfect seamless glass clips */}
      <style dangerouslySetInnerHTML={{__html: `
        .tab-shape-related {
          clip-path: polygon(0 0, calc(100% - 40px) 0, 100% 100%, 0 100%);
        }
        @media (min-width: 640px) {
          .tab-shape-related {
            clip-path: polygon(0 0, calc(100% - 60px) 0, 100% 100%, 0 100%);
          }
        }
      `}} />

      {/* JSON-LD Product structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      {/* ============================================================
         PRODUCT HERO
         ============================================================ */}
      <section className="relative w-full px-6 sm:px-12 lg:px-24 pt-28 pb-16">
        <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-[#EEBA2B]/10 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          {/* Back link */}
          <Link
            href="/products"
            className="product-back-link opacity-0 group inline-flex items-center gap-2 text-gray-500 hover:text-[#EEBA2B] text-xs font-bold uppercase tracking-widest mb-10 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            All Products
          </Link>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* ========= LEFT: Image ========= */}
            <div className="product-image-wrap opacity-0 w-full lg:w-1/2">
              <div className="relative">
                <div
                  className="absolute -top-4 -left-4 w-full h-full rounded-2xl border border-black/10 bg-white/40 backdrop-blur-sm"
                />
                <div
                  className="relative overflow-hidden rounded-2xl bg-[rgba(20,20,20,0.03)] backdrop-blur-xl border border-black/10 shadow-[0_15px_40px_rgba(0,0,0,0.05)]"
                >
                  <div className="aspect-square w-full relative flex items-center justify-center p-10 sm:p-16">
                    <Image
                      src={safeImage(product.image)}
                      alt={product.name}
                      fill
                      unoptimized={isExternal(product.image)}
                      className="object-contain p-8 sm:p-14 drop-shadow-xl hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-3 -right-3 bg-[#EEBA2B] text-black text-[10px] sm:text-xs font-black uppercase tracking-wider px-4 py-2 shadow-md">
                  {product.category}
                </div>
              </div>
            </div>

            {/* ========= RIGHT: Info ========= */}
            <div className="product-info w-full lg:w-1/2 flex flex-col">
              <div className="flex items-center gap-3 mb-4 opacity-0">
                <div className="h-[2px] w-8 bg-[#EEBA2B]" />
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#EEBA2B] font-mono font-bold">
                  {product.subtitle}
                </span>
              </div>
              {product.sku && (
                <div className="flex items-center gap-2 mb-6 opacity-0">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-mono font-bold">
                    SKU:
                  </span>
                  <span className="text-sm font-black text-gray-900 bg-black/5 px-3 py-1 rounded-md font-mono border border-black/10">
                    {product.sku}
                  </span>
                </div>
              )}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-4 opacity-0 drop-shadow-sm">
                {product.name}
              </h1>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8 opacity-0 font-medium">
                {product.description}
              </p>

              <div className="flex flex-wrap gap-4 mb-8 text-gray-500 opacity-0">
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <ShieldCheck className="w-4 h-4 text-[#EEBA2B]" />
                  ISO 9001
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <Truck className="w-4 h-4 text-[#EEBA2B]" />
                  Global Shipping
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <Clock className="w-4 h-4 text-[#EEBA2B]" />
                  Quote in 48h
                </div>
              </div>

              {/* ========= QUOTE FORM ========= */}
              <div className="mt-auto opacity-0">
                <div className="border-t border-black/10 pt-8">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-5">
                    Get a Quote
                  </h3>

                  <form onSubmit={handleQuote} className="space-y-5">
                    {/* Quantity */}
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-mono block mb-2 font-bold">
                        Quantity (MOQ: {product.moq} units)
                      </label>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => handleQuantity(-1)}
                          className="w-12 h-12 flex items-center justify-center bg-[rgba(20,20,20,0.05)] border-y border-l border-black/10 rounded-l-lg hover:bg-white hover:text-[#EEBA2B] transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={quantity}
                          onChange={(e) =>
                            setQuantity(
                              Math.max(1, parseInt(e.target.value) || 1),
                            )
                          }
                          className="w-20 h-12 text-center border-y border-black/10 text-lg font-black text-gray-900 bg-[rgba(20,20,20,0.02)] focus:outline-none focus:border-[#EEBA2B] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleQuantity(1)}
                          className="w-12 h-12 flex items-center justify-center bg-[rgba(20,20,20,0.05)] border-y border-r border-black/10 rounded-r-lg hover:bg-white hover:text-[#EEBA2B] transition-colors"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      {quantity < product.moq && (
                        <p className="text-amber-600 text-[10px] font-mono mt-1.5 font-bold">
                          ⚠ Minimum order quantity is {product.moq} units
                        </p>
                      )}
                    </div>

                    {/* Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-mono block mb-2 font-bold">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          value={quoteName}
                          onChange={(e) => setQuoteName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full h-12 px-4 bg-[rgba(20,20,20,0.05)] border border-black/10 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#EEBA2B] focus:bg-white shadow-inner transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-mono block mb-2 font-bold">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          value={quoteEmail}
                          onChange={(e) => setQuoteEmail(e.target.value)}
                          placeholder="john@company.com"
                          className="w-full h-12 px-4 bg-[rgba(20,20,20,0.05)] border border-black/10 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#EEBA2B] focus:bg-white shadow-inner transition-all"
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-mono block mb-2 font-bold">
                        Additional Notes (optional)
                      </label>
                      <textarea
                        rows={3}
                        value={quoteNotes}
                        onChange={(e) => setQuoteNotes(e.target.value)}
                        placeholder="Custom specs, delivery timeline, etc."
                        className="w-full px-4 py-3 bg-[rgba(20,20,20,0.05)] border border-black/10 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#EEBA2B] focus:bg-white shadow-inner transition-all resize-none"
                      />
                    </div>

                    {/* Error */}
                    {quoteError && (
                      <p className="text-red-500 text-xs font-mono font-bold">
                        {quoteError}
                      </p>
                    )}

                    {/* Submit + Add to Cart */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={quantity < product.moq || quoteSending}
                        className={`group w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 text-xs sm:text-sm font-black uppercase tracking-widest transition-all duration-300 rounded-lg border border-transparent shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-y-px ${
                          quoteSubmitted
                            ? "bg-green-500 text-white"
                            : quantity < product.moq || quoteSending
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-gray-900 text-[#EEBA2B] hover:bg-[#EEBA2B] hover:text-black"
                        }`}
                      >
                        {quoteSubmitted ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Sent! Check Email
                          </>
                        ) : quoteSending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                            Request Quote
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          addToCart(product, quantity);
                          setAddedToCart(true);
                          setTimeout(() => setAddedToCart(false), 2000);
                        }}
                        className={`group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 text-xs sm:text-sm font-black uppercase tracking-widest transition-all duration-300 rounded-lg border shadow-sm hover:shadow-none hover:translate-y-px ${
                          addedToCart
                            ? "bg-green-500 border-green-500 text-white"
                            : "bg-white border-black/10 text-gray-900 hover:border-[#EEBA2B] hover:text-[#EEBA2B]"
                        }`}
                      >
                        {addedToCart ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Added!
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
         SPECIFICATIONS TABLE
         ============================================================ */}
      {product.specs && product.specs.length > 0 && (
        <section className="specs-section w-full py-16 sm:py-24 px-6 sm:px-12 lg:px-24">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10 sm:mb-14">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-8 bg-[#EEBA2B]" />
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#EEBA2B] font-mono font-bold">
                  Technical Data
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight drop-shadow-sm">
                Specifications
              </h2>
            </div>

            <div className="overflow-hidden rounded-2xl bg-[rgba(20,20,20,0.02)] backdrop-blur-xl border border-black/10 shadow-sm">
              {product.specs.map((spec, idx) => (
                <div
                  key={idx}
                  className={`spec-row opacity-0 flex items-center px-6 sm:px-8 py-4 sm:py-5 gap-3 ${
                    idx % 2 === 0 ? "bg-white/40" : "bg-transparent"
                  } ${
                    idx !== product.specs.length - 1
                      ? "border-b border-black/5"
                      : ""
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-[#EEBA2B] shrink-0 shadow-sm" />
                  <span className="text-sm sm:text-base font-bold text-gray-800">
                    {spec}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================
         RELATED PRODUCTS
         ============================================================ */}
      {related.length > 0 && (
        <section className="related-section w-full py-16 sm:py-24 px-6 sm:px-12 lg:px-24 bg-[rgba(20,20,20,0.02)] border-t border-black/5">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10 sm:mb-14">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-8 bg-[#EEBA2B]" />
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#EEBA2B] font-mono font-bold">
                  Same Category
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight drop-shadow-sm">
                Related Products
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((item, idx) => (
                <Link
                  key={item._id}
                  href={`/products/${item.slug}`}
                  className="related-card opacity-0 group block relative"
                >
                  {/* Header row */}
                  <div className="h-[40px] flex w-full relative z-20">
                    {/* Empty space border */}
                    <div className="absolute top-0 right-0 w-[50%] h-full border-b border-black/10" />

                    <div className="tab-shape-related relative w-[calc(50%+40px)] sm:w-[calc(50%+60px)] bg-[rgba(20,20,20,0.08)] backdrop-blur-2xl border-t border-l border-black/10 rounded-tl-2xl flex items-center pl-6">
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
                    className="bg-[rgba(20,20,20,0.08)] backdrop-blur-2xl border-b border-x border-black/10 rounded-b-2xl p-6 pr-[120px] sm:p-8 sm:pr-[140px] min-h-[220px] flex flex-col justify-between transition-all duration-500 relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)] group-hover:bg-[rgba(20,20,20,0.12)]"
                  >
                    {/* Inner glow optional */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#EEBA2B]/10 rounded-full blur-[50px] pointer-events-none" />

                    <div className="absolute top-4 right-4 w-[100px] h-[100px] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 drop-shadow-md">
                      <Image
                        src={safeImage(item.image)}
                        alt={item.name}
                        fill
                        unoptimized={isExternal(item.image)}
                        className="object-contain"
                      />
                    </div>

                    <div className="relative z-10">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-mono mb-2 text-gray-600 font-bold">
                        {item.subtitle}
                      </p>
                      <h3 className="text-lg sm:text-xl font-black leading-tight tracking-tight mb-4 text-gray-900">
                        {item.name}
                      </h3>
                    </div>

                    <div className="relative z-10 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-900 group-hover:text-[#EEBA2B] group-hover:gap-4 transition-all duration-300">
                      View Details
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;