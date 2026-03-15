"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  ArrowRight,
  Building2,
  Globe,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item border-b border-black/10">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between py-5 sm:py-6 text-left group"
      >
        <span className="text-sm sm:text-base font-black text-gray-900 pr-4 group-hover:text-[#EEBA2B] transition-colors drop-shadow-sm">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-[#EEBA2B] shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-400 ease-in-out ${
          open ? "max-h-60 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-gray-700 text-sm leading-relaxed font-medium pl-2 border-l-2 border-[#EEBA2B]/50 ml-1">{answer}</p>
      </div>
    </div>
  );
};

const Contact = () => {
  const containerRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "", company: "", email: "", phone: "", subject: "", message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setFormError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, source: "contact" }),
      });
      const json = await res.json();
      if (json.success) {
        setSent(true);
        setFormData({ name: "", company: "", email: "", phone: "", subject: "", message: "" });
        setTimeout(() => setSent(false), 6000);
      } else {
        setFormError(json.error || "Failed to send message.");
      }
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  useGSAP(
    () => {
      // --- Hero entrance ---
      // Set hidden state first to prevent flash
      gsap.set(".contact-hero-label", { y: 30, opacity: 0 });
      gsap.set(".contact-hero-title span", { y: 80, opacity: 0 });
      gsap.set(".contact-hero-line", { scaleX: 0 });
      gsap.set(".contact-hero-desc", { y: 20, opacity: 0 });

      const heroTl = gsap.timeline({ delay: 0.05 });
      heroTl.to(".contact-hero-label", {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      });
      heroTl.to(
        ".contact-hero-title span",
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
        ".contact-hero-line",
        {
          scaleX: 1,
          duration: 0.8,
          ease: "power2.inOut",
        },
        "-=0.4"
      );
      heroTl.to(
        ".contact-hero-desc",
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.3"
      );

      // --- Info cards ---
      gsap.set(".info-card", { y: 40, opacity: 0 });
      gsap.to(".info-card", {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: ".info-section",
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
        },
      });

      // --- Form section ---
      gsap.set(".form-block", { y: 50, opacity: 0 });
      gsap.to(".form-block", {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "none",
        scrollTrigger: {
          trigger: ".form-section",
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
        },
      });

      gsap.set(".form-sidebar", { x: 50, opacity: 0 });
      gsap.to(".form-sidebar", {
        x: 0,
        opacity: 1,
        duration: 1.5,
        ease: "none",
        scrollTrigger: {
          trigger: ".form-section",
          start: "top 80%",
          end: "top 25%",
          scrub: 1,
        },
      });

      // --- FAQ section ---
      gsap.set(".faq-item", { y: 30, opacity: 0 });
      gsap.to(".faq-item", {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: ".faq-section",
          start: "top 80%",
          end: "center center",
          scrub: 1,
        },
      });

      // --- CTA section ---
      gsap.set(".cta-content", { y: 30, opacity: 0 });
      gsap.to(".cta-content", {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "none",
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 90%",
          end: "top 30%",
          scrub: 1,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="w-full min-h-screen">
      
      {/* Inline styles for seamless glass clips */}
      <style dangerouslySetInnerHTML={{__html: `
        .tab-shape-info {
          clip-path: polygon(0 0, calc(100% - 30px) 0, 100% 100%, 0 100%);
        }
        .tab-shape-cta {
          clip-path: polygon(0 0, calc(100% - 40px) 0, 100% 100%, 0 100%);
        }
        @media (min-width: 640px) {
          .tab-shape-cta {
            clip-path: polygon(0 0, calc(100% - 60px) 0, 100% 100%, 0 100%);
          }
        }
      `}} />

      {/* ============================================================
          HERO SECTION
         ============================================================ */}
      <section className="relative w-full xl:min-h-[70vh] flex flex-col justify-center px-6 sm:px-12 lg:px-24 pt-7 pb-10 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-10 w-75 h-75 bg-[#EEBA2B]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-10 w-50 h-50 bg-[#EEBA2B]/15 rounded-full blur-[80px]" />

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          {/* Label */}
          <div className="contact-hero-label flex items-center gap-3 mb-8">
            <div className="h-0.5 w-12 bg-[#EEBA2B]" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gray-800 font-mono font-bold">
              Contact Us
            </span>
          </div>

          {/* Title */}
          <h1 className="contact-hero-title text-4xl sm:text-6xl lg:text-8xl font-black leading-[0.95] tracking-tighter mb-8">
            <span className="block text-gray-900 drop-shadow-sm">Let&apos;s Build</span>
            <span className="block text-gray-900 drop-shadow-sm">Something</span>
            <span className="block text-[#EEBA2B] italic font-serif">Together</span>
          </h1>

          {/* Divider */}
          <div className="contact-hero-line h-[2px] w-full max-w-md bg-gradient-to-r from-[#EEBA2B] to-transparent mb-8 origin-left" />

          {/* Description */}
          <p className="contact-hero-desc text-gray-700 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed font-medium">
            Whether you're looking for power tools, industrial hardware or construction equipment, our team is ready to help. Reach out to discuss product availability, authorized brand partnerships or long-term supply solutions for your industry.
          </p>
        </div>
      </section>

      {/* ============================================================
          INFO CARDS SECTION
         ============================================================ */}
      <section className="info-section w-full py-16 sm:py-24 px-6 sm:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Phone */}
            <div className="info-card group relative block">
              <div className="h-10 flex w-full relative z-20">
                <div className="absolute top-0 right-0 w-[45%] h-full border-b border-black/10" />
                <div className="tab-shape-info relative w-[calc(55%+30px)] bg-[rgba(20,20,20,0.05)] backdrop-blur-xl border-t border-l border-black/10 rounded-tl-xl flex items-center pl-5">
                  <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">
                    Call
                  </span>
                  <svg className="absolute right-0 top-0 h-full w-[30px] pointer-events-none" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(0,0,0,0.1)" strokeWidth="2.5" />
                  </svg>
                </div>
              </div>
              <div className="bg-[rgba(20,20,20,0.05)] backdrop-blur-xl border-b border-x border-black/10 p-6 -mt-px min-h-[160px] flex flex-col group-hover:bg-[rgba(20,20,20,0.1)] transition-colors duration-300 rounded-b-xl shadow-sm">
                <Phone className="w-7 h-7 text-[#EEBA2B] mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" />
                <span className="text-gray-900 font-black text-base mb-1">+91 98901 53052</span>
                <span className="text-gray-600 font-medium text-xs">Mon — Sat, 10AM to 7PM IST</span>
              </div>
            </div>

            {/* Email */}
            <div className="info-card group relative block">
              <div className="h-10 flex w-full relative z-20">
                <div className="absolute top-0 right-0 w-[45%] h-full border-b border-[#EEBA2B]/50" />
                <div className="tab-shape-info relative w-[calc(55%+30px)] bg-[#EEBA2B] border-t border-l border-[#EEBA2B] rounded-tl-xl flex items-center pl-5">
                  <span className="text-[10px] font-black text-black uppercase tracking-widest">
                    Email
                  </span>
                  <svg className="absolute right-0 top-0 h-full w-[30px] pointer-events-none" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100%" y2="100%" stroke="#EEBA2B" strokeWidth="2.5" />
                  </svg>
                </div>
              </div>
              <div className="bg-[#EEBA2B] border-b border-x border-[#EEBA2B] p-6 -mt-px min-h-[160px] flex flex-col flex-wrap group-hover:bg-[#EEBA2B]/90 transition-colors duration-300 rounded-b-xl shadow-md">
                <Mail className="w-7 h-7 text-black mb-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-black font-black lg:text-[10px] text-base mb-1">info@universalimpex52.com</span>
                <span className="text-black/70 font-bold text-xs">We reply within 24 hours</span>
              </div>
            </div>

            {/* Location */}
            <div className="info-card group relative block">
              <div className="h-10 flex w-full relative z-20">
                <div className="absolute top-0 right-0 w-[45%] h-full border-b border-black/10" />
                <div className="tab-shape-info relative w-[calc(55%+30px)] bg-[rgba(20,20,20,0.05)] backdrop-blur-xl border-t border-l border-black/10 rounded-tl-xl flex items-center pl-5">
                  <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">
                    Visit
                  </span>
                  <svg className="absolute right-0 top-0 h-full w-[30px] pointer-events-none" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(0,0,0,0.1)" strokeWidth="2.5" />
                  </svg>
                </div>
              </div>
              <div className="bg-[rgba(20,20,20,0.05)] backdrop-blur-xl border-b border-x border-black/10 p-6 -mt-px min-h-[160px] flex flex-col group-hover:bg-[rgba(20,20,20,0.1)] transition-colors duration-300 rounded-b-xl shadow-sm">
                <MapPin className="w-7 h-7 text-[#EEBA2B] mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" />
                <span className="text-gray-900 font-black text-base mb-1">510, Loharpura</span>
                <span className="text-gray-600 font-medium text-xs">Behind Arya Samaj Bhavan, CA Road, Nagpur - 440018</span>
              </div>
            </div>

            {/* Hours */}
            <div className="info-card group relative block">
              <div className="h-10 flex w-full relative z-20">
                <div className="absolute top-0 right-0 w-[45%] h-full border-b border-black/10" />
                <div className="tab-shape-info relative w-[calc(55%+30px)] bg-[rgba(20,20,20,0.05)] backdrop-blur-xl border-t border-l border-black/10 rounded-tl-xl flex items-center pl-5">
                  <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">
                    Hours
                  </span>
                  <svg className="absolute right-0 top-0 h-full w-[30px] pointer-events-none" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(0,0,0,0.1)" strokeWidth="2.5" />
                  </svg>
                </div>
              </div>
              <div className="bg-[rgba(20,20,20,0.05)] backdrop-blur-xl border-b border-x border-black/10 p-6 -mt-px min-h-[160px] flex flex-col group-hover:bg-[rgba(20,20,20,0.1)] transition-colors duration-300 rounded-b-xl shadow-sm">
                <Clock className="w-7 h-7 text-[#EEBA2B] mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" />
                <span className="text-gray-900 font-black text-base mb-1">Mon — Sat</span>
                <span className="text-gray-600 font-medium text-xs">10:00 AM — 7:00 PM IST</span>
              </div>
            </div>

          </div>

          {/* Google Map */}
          <div className="mt-10 rounded-2xl overflow-hidden border border-black/10 shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.268!2d79.0940388!3d21.1519826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c14aef4bbfc7%3A0x2a4a19608f7dc2ff!2sUniversal%20Impex%2052!5e0!3m2!1sen!2sin!4v1709000000000!5m2!1sen!2sin"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Universal Impex 52 Location"
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          FORM + SIDEBAR SECTION
         ============================================================ */}
      <section className="form-section w-full py-7 sm:py-24 px-6 sm:px-12 lg:px-24 border-t border-black/5 bg-[rgba(20,20,20,0.02)]">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="mb-12 sm:mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-0.5 w-8 bg-[#EEBA2B]" />
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#EEBA2B] font-mono font-bold">
                Send a Message
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight drop-shadow-sm">
              Get in Touch
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            {/* Form */}
            <div className="form-block w-full lg:w-3/5">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-widest text-gray-700 font-black mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-[rgba(20,20,20,0.05)] backdrop-blur-md border border-black/10 rounded-lg text-gray-900 text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#EEBA2B] focus:bg-white shadow-inner transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-widest text-gray-700 font-black mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your Company"
                      className="w-full px-4 py-3 bg-[rgba(20,20,20,0.05)] backdrop-blur-md border border-black/10 rounded-lg text-gray-900 text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#EEBA2B] focus:bg-white shadow-inner transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-widest text-gray-700 font-black mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                      className="w-full px-4 py-3 bg-[rgba(20,20,20,0.05)] backdrop-blur-md border border-black/10 rounded-lg text-gray-900 text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#EEBA2B] focus:bg-white shadow-inner transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-widest text-gray-700 font-black mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98901 53052"
                      className="w-full px-4 py-3 bg-[rgba(20,20,20,0.05)] backdrop-blur-md border border-black/10 rounded-lg text-gray-900 text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#EEBA2B] focus:bg-white shadow-inner transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-gray-700 font-black mb-2">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[rgba(20,20,20,0.05)] backdrop-blur-md border border-black/10 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-[#EEBA2B] focus:bg-white shadow-inner transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select a topic</option>
                    <option value="Request a Quote">Request a Quote</option>
                    <option value="Partnership Inquiry">Partnership Inquiry</option>
                    <option value="Custom Manufacturing">Custom Manufacturing</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-gray-700 font-black mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project requirements, expected volumes, timeline..."
                    className="w-full px-4 py-3 bg-[rgba(20,20,20,0.05)] backdrop-blur-md border border-black/10 rounded-lg text-gray-900 text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#EEBA2B] focus:bg-white shadow-inner transition-all resize-none"
                  />
                </div>

                {formError && (
                  <p className="text-red-500 text-xs font-mono font-bold">{formError}</p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className={`group px-8 py-4 text-xs sm:text-sm font-black uppercase tracking-widest transition-all duration-300 rounded-lg flex items-center gap-3 w-full sm:w-auto justify-center ${
                    sent
                      ? "bg-green-500 text-white shadow-none"
                      : sending
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#EEBA2B] text-black hover:bg-gray-900 hover:text-[#EEBA2B] shadow-[0_4px_15px_rgba(238,186,43,0.3)] hover:shadow-none hover:translate-y-px"
                  }`}
                >
                  {sent ? (
                    <>✓ Message Sent!</>
                  ) : sending ? (
                    <>Sending...</>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="form-sidebar w-full lg:w-2/5 space-y-6">
              {/* Why contact us */}
              <div className="bg-[rgba(20,20,20,0.1)] backdrop-blur-xl border border-black/10 rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#EEBA2B]/10 rounded-full blur-[40px] pointer-events-none" />
                <h3 className="text-lg font-black text-gray-900 mb-5 relative z-10">
                  Why Work With Us
                </h3>
                <ul className="space-y-4 relative z-10">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white border border-black/5 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Building2 className="w-4 h-4 text-[#EEBA2B]" />
                    </div>
                    <div>
                      <span className="text-gray-900 text-sm font-black block">100+ Trusted Suppliers</span>
                      <span className="text-gray-600 text-xs font-medium">Reliable sourcing for power tools & hardware</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white border border-black/5 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Globe className="w-4 h-4 text-[#EEBA2B]" />
                    </div>
                    <div>
                      <span className="text-gray-900 text-sm font-black block">50+ Brand Partnerships</span>
                      <span className="text-gray-600 text-xs font-medium">Authorized dealership for leading tool brands</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white border border-black/5 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Clock className="w-4 h-4 text-[#EEBA2B]" />
                    </div>
                    <div>
                      <span className="text-gray-900 text-sm font-black block">24hr Response Time</span>
                      <span className="text-gray-600 text-xs font-medium">Fast support for inquiries and orders</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Quick contact */}
              <div className="bg-[rgba(20,20,20,0.1)] backdrop-blur-xl border border-black/10 rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#EEBA2B]/10 rounded-full blur-[40px] pointer-events-none" />
                <h3 className="text-lg font-black text-gray-900 mb-2 relative z-10">
                  Need Immediate Help?
                </h3>
                <p className="text-gray-700 text-sm mb-5 font-medium relative z-10">
                  For urgent orders or technical queries, reach our direct line.
                </p>
                <a
                  href="tel:+919890153052"
                  className="relative z-10 flex items-center gap-3 bg-gray-900 text-[#EEBA2B] px-5 py-3 rounded-lg text-sm font-black hover:bg-black transition-colors w-fit shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  +91 98901 53052
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FAQ SECTION
         ============================================================ */}
      <section className="faq-section w-full py-7 sm:py-24 px-6 sm:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="mb-12 sm:mb-16 text-center">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#EEBA2B] font-mono font-bold">
              Common Questions
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mt-3 drop-shadow-sm">
              FAQ
            </h2>
          </div>

          <div className="bg-[rgba(20,20,20,0.02)] backdrop-blur-xl border border-black/10 rounded-2xl px-6 sm:px-10 py-2 shadow-sm">
            <FAQItem
              question="What products does Universal Impex 52 supply?"
              answer="We primarily supply power tools, industrial hardware and construction equipment through authorized brand partnerships and trusted suppliers."
            />
            <FAQItem
              question="How can I place an order?"
              answer="Orders are processed through direct inquiries. Simply contact us with your product requirements and our team will provide pricing, availability and further details."
            />
            <FAQItem
              question="Do you sell products directly online?"
              answer="No. Our website is designed for product inquiries and quotation requests. Once you submit your requirements, our team will assist you with pricing and supply details."
            />
            <FAQItem
              question="Do you offer bulk supply for businesses or contractors?"
              answer="Yes. UI52 specializes in B2B supply, supporting contractors, distributors and businesses with bulk orders and reliable sourcing."
            />
            <FAQItem
              question="Are the products genuine and authorized?"
              answer="Yes. We work with authorized brand partnerships and verified suppliers to ensure that all products supplied meet industry standards."
            />
            <FAQItem
              question="Do you supply products internationally?"
              answer="Yes. Through our supplier and logistics network, we can support businesses with international supply and sourcing solutions."
            />
            <FAQItem
              question="How long does it take to receive a quotation?"
              answer="Most inquiries are responded to within 24-48 hours, depending on product availability and order requirements."
            />
            <FAQItem
              question="Can you source products not listed on the website?"
              answer="Yes. If you are looking for specific tools, hardware or construction equipment, our sourcing team can help locate suitable options through our supplier network."
            />
            <FAQItem
              question="What information should I include when requesting a quote?"
              answer="To help us respond quickly, please include product name, quantity required, brand preference (if any) and delivery location in your inquiry."
            />
            <FAQItem
              question="Do you assist with product recommendations?"
              answer="Yes. If you are unsure about the right tools or equipment for your project, our team can help recommend suitable products based on your requirements."
            />
           
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA SECTION
         ============================================================ */}
      <section className="cta-section w-full py-7 sm:py-24 px-6 sm:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <div className="cta-content relative block">
            {/* Slope header */}
            <div className="h-[40px] sm:h-[50px] flex w-full relative z-20">
              <div className="absolute top-0 right-0 w-[60%] h-full border-b border-black/10" />
              <div className="tab-shape-cta relative w-[calc(40%+40px)] sm:w-[calc(20%+60px)] bg-gray-900 border-t border-l border-gray-900 rounded-tl-2xl flex items-center pl-6 sm:pl-8">
                <span className="text-[10px] font-black text-[#EEBA2B] uppercase tracking-widest">
                  Partner
                </span>
                <svg className="absolute right-0 top-0 h-full w-[40px] sm:w-[60px] pointer-events-none" preserveAspectRatio="none">
                  <line x1="0" y1="0" x2="100%" y2="100%" stroke="#111827" strokeWidth="2.5" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="bg-[rgba(20,20,20,0.1)] backdrop-blur-2xl border-b border-x border-black/10 p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 rounded-b-2xl shadow-[0_15px_40px_rgba(0,0,0,0.08)] relative overflow-hidden">
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#EEBA2B]/20 rounded-full blur-[80px] pointer-events-none" />

              <div className="max-w-lg relative z-10">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-4 drop-shadow-sm">
                  Ready to <span className="italic font-serif text-[#EEBA2B]">Scale?</span>
                </h2>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-medium">
                  oin industries and contractors who trust UI52 for reliable supply of power tools, industrial hardware, and construction equipment, delivered through trusted brand partnerships and efficient sourcing.
                </p>
              </div>
              <Link
                href="/contact"
                className="group relative z-10 bg-[#EEBA2B] text-black px-8 sm:px-10 py-4 text-xs sm:text-sm font-black uppercase tracking-widest hover:bg-gray-900 hover:text-[#EEBA2B] transition-all duration-300 shadow-[0_4px_15px_rgba(238,186,43,0.3)] hover:shadow-none hover:translate-y-px flex items-center gap-3 whitespace-nowrap rounded-lg"
              >
                Email Us
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;