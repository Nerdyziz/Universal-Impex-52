"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Loader2,
  CheckCircle2,
  Package,
  User,
  Mail,
  FileText,
  AlertCircle,
  IndianRupee,
} from "lucide-react";

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

export default function AdminQuotePage({ params }) {
  const { id } = use(params);

  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [prices, setPrices] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    async function fetchQuote() {
      try {
        const res = await fetch(`/api/quote/${id}`);
        const data = await res.json();
        if (data.success) {
          setQuote(data.quote);
          // Initialize prices from existing values
          const initialPrices = {};
          data.quote.items.forEach((item) => {
            initialPrices[item._id] = item.unitPrice || "";
          });
          setPrices(initialPrices);
        } else {
          setError(data.error || "Quote not found");
        }
      } catch {
        setError("Failed to load quote");
      } finally {
        setLoading(false);
      }
    }
    fetchQuote();
  }, [id]);

  const handlePriceChange = (itemId, value) => {
    setPrices((prev) => ({ ...prev, [itemId]: value }));
  };

  const allPricesFilled = quote?.items?.every(
    (item) => prices[item._id] && Number(prices[item._id]) > 0
  );

  const grandTotal = quote?.items?.reduce((sum, item) => {
    const price = Number(prices[item._id]) || 0;
    return sum + price * item.quantity;
  }, 0) || 0;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!allPricesFilled) return;
    setSending(true);
    setSendError("");

    try {
      // Convert prices to numbers
      const numericPrices = {};
      for (const [key, val] of Object.entries(prices)) {
        numericPrices[key] = Number(val) || 0;
      }

      const res = await fetch(`/api/quote/${id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prices: numericPrices }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        setSendError(data.error || "Failed to send quotation");
      }
    } catch {
      setSendError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-sm text-gray-500 font-mono">Loading quote...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <h2 className="text-xl font-black text-[#1a1a1a]">Quote Not Found</h2>
          <p className="text-sm text-gray-500">{error}</p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#1a1a1a] transition-colors mt-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  // Already sent
  if (quote.status === "sent" || sent) {
    return (
      <div className="w-full min-h-screen">
        <section className="relative w-full px-6 sm:px-12 lg:px-24 pt-28 pb-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
              <h2 className="text-2xl font-black text-[#1a1a1a] mb-3">
                Quotation Sent!
              </h2>
              <p className="text-gray-500 text-sm mb-2 max-w-md">
                The quotation PDF has been emailed to{" "}
                <strong>{quote.customerEmail}</strong>.
              </p>
              <p className="text-gray-400 text-xs font-mono mb-8">
                {quote.quoteNumber}
              </p>
              <Link
                href="/admin"
                className="group flex items-center gap-3 bg-[#1a1a1a] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-amber-400 hover:text-black transition-all duration-300 border-2 border-[#1a1a1a] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Admin
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      {/* ── HERO ── */}
      <section className="relative w-full px-6 sm:px-12 lg:px-24 pt-28 pb-12 overflow-hidden">
        <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-amber-400/5 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-4xl mx-auto w-full">
          <Link
            href="/admin"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#1a1a1a] transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Admin
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-12 bg-amber-400" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gray-600 font-mono">
              Quote Inquiry
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[0.95] tracking-tighter mb-4">
            <span className="text-[#1a1a1a]">Review </span>
            <span className="text-amber-500 italic font-serif">Quotation</span>
          </h1>

          <div className="h-[2px] w-full max-w-md bg-gradient-to-r from-amber-400 to-transparent mb-8" />

          {/* Customer Info Card */}
          <div className="liquid-glass rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-mono">Customer</p>
                  <p className="text-sm font-bold text-[#1a1a1a]">{quote.customerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-mono">Email</p>
                  <p className="text-sm font-bold text-[#1a1a1a]">{quote.customerEmail}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-mono">Reference</p>
                  <p className="text-sm font-bold text-[#1a1a1a]">{quote.quoteNumber}</p>
                </div>
              </div>
            </div>
            {quote.notes && (
              <div className="mt-4 pt-4 border-t border-gray-300/30">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-mono mb-1">Customer Notes</p>
                <p className="text-sm text-gray-600">{quote.notes}</p>
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-gray-300/30">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-mono">
                Requested on {new Date(quote.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS TABLE ── */}
      <section className="w-full px-6 sm:px-12 lg:px-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend}>
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-black text-[#1a1a1a] uppercase tracking-widest">
                {quote.items.length} {quote.items.length === 1 ? "Product" : "Products"}
              </h2>
            </div>

            {/* Header row */}
            <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-3 mb-2">
              <div className="col-span-1 text-[10px] uppercase tracking-[0.15em] text-gray-500 font-mono">#</div>
              <div className="col-span-4 text-[10px] uppercase tracking-[0.15em] text-gray-500 font-mono">Product</div>
              <div className="col-span-2 text-[10px] uppercase tracking-[0.15em] text-gray-500 font-mono">Brand</div>
              <div className="col-span-1 text-[10px] uppercase tracking-[0.15em] text-gray-500 font-mono text-center">Qty</div>
              <div className="col-span-2 text-[10px] uppercase tracking-[0.15em] text-gray-500 font-mono">Unit Price (₹)</div>
              <div className="col-span-2 text-[10px] uppercase tracking-[0.15em] text-gray-500 font-mono text-right">Total (₹)</div>
            </div>

            {/* Product rows */}
            <div className="space-y-3">
              {quote.items.map((item, idx) => {
                const unitPrice = Number(prices[item._id]) || 0;
                const lineTotal = unitPrice * item.quantity;

                return (
                  <div
                    key={item._id}
                    className="liquid-glass rounded-xl p-4 sm:p-6 hover:scale-[1.005] transition-all"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      {/* Sr. No */}
                      <div className="hidden sm:block col-span-1 text-sm font-mono text-gray-400">
                        {idx + 1}
                      </div>

                      {/* Product */}
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="relative w-14 h-14 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={safeImage(item.image)}
                            alt={item.name}
                            fill
                            unoptimized={isExternal(item.image)}
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-[#1a1a1a] leading-tight truncate">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                            {item.category}
                          </p>
                        </div>
                      </div>

                      {/* Brand */}
                      <div className="col-span-2">
                        <span className="sm:hidden text-[10px] uppercase tracking-[0.15em] text-gray-500 font-mono mr-2">Brand:</span>
                        <span className="text-sm text-gray-600">{item.brand || "-"}</span>
                      </div>

                      {/* Qty */}
                      <div className="col-span-1 text-center">
                        <span className="sm:hidden text-[10px] uppercase tracking-[0.15em] text-gray-500 font-mono mr-2">Qty:</span>
                        <span className="text-sm font-black text-[#1a1a1a] bg-amber-100 px-3 py-1 rounded-full">
                          {item.quantity}
                        </span>
                      </div>

                      {/* Unit Price Input */}
                      <div className="col-span-2">
                        <span className="sm:hidden text-[10px] uppercase tracking-[0.15em] text-gray-500 font-mono block mb-1">Unit Price (₹)</span>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            required
                            value={prices[item._id] || ""}
                            onChange={(e) => handlePriceChange(item._id, e.target.value)}
                            placeholder="0.00"
                            className="w-full h-10 pl-8 pr-3 bg-white border-2 border-gray-200 rounded-lg text-sm font-bold text-[#1a1a1a] placeholder:text-gray-300 focus:outline-none focus:border-amber-400 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>
                      </div>

                      {/* Line Total */}
                      <div className="col-span-2 text-right">
                        <span className="sm:hidden text-[10px] uppercase tracking-[0.15em] text-gray-500 font-mono mr-2">Total:</span>
                        <span className={`text-sm font-black ${unitPrice > 0 ? "text-[#1a1a1a]" : "text-gray-300"}`}>
                          ₹{lineTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Grand Total */}
            <div className="liquid-glass rounded-xl p-6 mt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black uppercase tracking-widest text-[#1a1a1a]">
                  Grand Total
                </span>
                <span className="text-2xl font-black text-amber-500">
                  ₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Error */}
            {sendError && (
              <div className="flex items-center gap-2 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-red-600 text-sm">{sendError}</p>
              </div>
            )}

            {/* Send Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={sending || !allPricesFilled}
                className={`flex items-center gap-3 px-10 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-lg ${
                  sending
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : !allPricesFilled
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-amber-400 text-black hover:bg-amber-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                }`}
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending Quotation...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Quotation to Customer
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
