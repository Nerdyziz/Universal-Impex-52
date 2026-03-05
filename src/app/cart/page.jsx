"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  Send,
  Loader2,
  CheckCircle2,
  ShoppingCart,
  Package,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

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

export default function CartPage() {
  const containerRef = useRef(null);
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

  const [quoteName, setQuoteName] = useState("");
  const [quoteEmail, setQuoteEmail] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.from(".cart-hero-label", { y: 30, opacity: 0, duration: 0.6, ease: "power2.out" });
      tl.from(".cart-hero-title span", { y: 80, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }, "-=0.3");
      tl.from(".cart-hero-line", { scaleX: 0, duration: 0.8, ease: "power2.inOut" }, "-=0.4");
      tl.from(".cart-item", { y: 30, opacity: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" }, "-=0.3");
    },
    { scope: containerRef }
  );

  const handleGetQuote = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: cart.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
          customerName: quoteName,
          customerEmail: quoteEmail,
          notes: quoteNotes,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSent(true);
        clearCart();
        setTimeout(() => setSent(false), 6000);
      } else {
        setError(json.error || "Failed to send quote");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full min-h-screen">
      {/* ============================================================
          HERO
         ============================================================ */}
      <section className="relative w-full px-6 sm:px-12 lg:px-24 pt-28 pb-12 overflow-hidden">
        <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-amber-400/5 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="cart-hero-label flex items-center gap-3 mb-8">
            <div className="h-[2px] w-12 bg-amber-400" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gray-600 font-mono">
              Your Selection
            </span>
          </div>

          <h1 className="cart-hero-title text-4xl sm:text-6xl lg:text-8xl font-black leading-[0.95] tracking-tighter mb-8">
            <span className="block text-[#1a1a1a]">Quote</span>
            <span className="block text-amber-500 italic font-serif">Cart</span>
          </h1>

          <div className="cart-hero-line h-[2px] w-full max-w-md bg-gradient-to-r from-amber-400 to-transparent mb-4 origin-left" />
        </div>
      </section>

      {/* ============================================================
          CART ITEMS
         ============================================================ */}
      <section className="w-full px-6 sm:px-12 lg:px-24 pb-16">
        <div className="max-w-6xl mx-auto">
          {cart.length === 0 && !sent ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 mb-6" />
              <h3 className="text-2xl font-black text-[#1a1a1a] mb-3">
                Your cart is empty
              </h3>
              <p className="text-gray-500 text-sm mb-8 max-w-md">
                Browse our products catalog and add items to your cart to request a combined quotation.
              </p>
              <Link
                href="/products"
                className="group flex items-center gap-3 bg-[#1a1a1a] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-amber-400 hover:text-black transition-all duration-300 border-2 border-[#1a1a1a] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Browse Products
              </Link>
            </div>
          ) : sent ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
              <h3 className="text-2xl font-black text-[#1a1a1a] mb-3">
                Quote Request Received!
              </h3>
              <p className="text-gray-500 text-sm mb-8 max-w-md">
                We&apos;ve received your inquiry. Our team is reviewing it and will send you a detailed quotation with pricing to your email shortly.
              </p>
              <Link
                href="/products"
                className="group flex items-center gap-3 bg-[#1a1a1a] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-amber-400 hover:text-black transition-all duration-300 border-2 border-[#1a1a1a] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left — Cart items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-black text-[#1a1a1a] uppercase tracking-widest">
                    {cart.length} {cart.length === 1 ? "Item" : "Items"}
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-xs font-bold text-red-500 uppercase tracking-widest hover:text-red-700 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="cart-item flex items-center gap-4 sm:gap-6 liquid-glass p-4 sm:p-6 rounded-xl hover:scale-[1.01] transition-all"
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={safeImage(item.image)}
                        alt={item.name}
                        fill
                        unoptimized={isExternal(item.image)}
                        className="object-contain p-2"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-sm sm:text-base font-black text-[#1a1a1a] hover:text-amber-600 transition-colors leading-tight block truncate"
                      >
                        {item.name}
                      </Link>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-mono mt-1">
                        {item.brand} · {item.category}
                      </p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center shrink-0">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-300 hover:border-[#1a1a1a] transition-colors rounded-l"
                      >
                        <Minus className="w-3 h-3 text-gray-600" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item._id, Math.max(1, parseInt(e.target.value) || 1))
                        }
                        className="w-12 sm:w-14 h-8 sm:h-10 text-center border-y border-gray-300 text-sm font-black text-[#1a1a1a] bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-300 hover:border-[#1a1a1a] transition-colors rounded-r"
                      >
                        <Plus className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#1a1a1a] transition-colors mt-4"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  Continue Browsing
                </Link>
              </div>

              {/* Right — Quote form */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 liquid-glass rounded-2xl p-6 sm:p-8 text-[#1a1a1a]">
                  <div className="flex items-center gap-3 mb-6">
                    <Package className="w-5 h-5 text-amber-500" />
                    <h3 className="text-sm font-black uppercase tracking-widest">
                      Request Quote
                    </h3>
                  </div>

                  {/* Summary */}
                  <div className="border-b border-gray-300/50 pb-4 mb-6 space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Items</span>
                      <span>{cart.length}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Total Qty</span>
                      <span>{cart.reduce((s, i) => s + i.quantity, 0)}</span>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleGetQuote} className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-mono block mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={quoteName}
                        onChange={(e) => setQuoteName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full h-11 px-4 liquid-glass text-sm text-[#1a1a1a] placeholder:text-gray-400 rounded focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-mono block mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={quoteEmail}
                        onChange={(e) => setQuoteEmail(e.target.value)}
                        placeholder="john@company.com"
                        className="w-full h-11 px-4 liquid-glass text-sm text-[#1a1a1a] placeholder:text-gray-400 rounded focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-mono block mb-1.5">
                        Notes (optional)
                      </label>
                      <textarea
                        rows={3}
                        value={quoteNotes}
                        onChange={(e) => setQuoteNotes(e.target.value)}
                        placeholder="Special requirements..."
                        className="w-full px-4 py-3 liquid-glass text-sm text-[#1a1a1a] placeholder:text-gray-400 rounded focus:outline-none focus:border-amber-400 transition-colors resize-none"
                      />
                    </div>

                    {error && (
                      <p className="text-red-500 text-xs font-mono">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={sending || cart.length === 0}
                      className={`w-full flex items-center justify-center gap-3 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded ${
                        sending
                          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                          : "bg-amber-400 text-black hover:bg-amber-300 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
                      }`}
                    >
                      {sending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending Quote...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Get Quote — {cart.length} Items
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
