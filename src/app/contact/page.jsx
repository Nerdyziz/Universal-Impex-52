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

  useGSAP(
    () => {
      // --- Hero entrance ---
      const heroTl = gsap.timeline();
      heroTl.from(".contact-hero-label", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });
      heroTl.from(
        ".contact-hero-title span",
        {
          y: 80,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        },
        "-=0.3"
      );
      heroTl.from(
        ".contact-hero-line",
        {
          scaleX: 0,
          duration: 0.8,
          ease: "power2.inOut",
        },
        "-=0.4"
      );
      heroTl.from(
        ".contact-hero-desc",
        {
          y: 20,
          opacity: 0,
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
      <section className="relative w-full min-h-[70vh] flex flex-col justify-center px-6 sm:px-12 lg:px-24 pt-24 pb-16 overflow-hidden">
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
            Whether you need precision-engineered components, custom manufacturing
            solutions, or want to explore a long-term supply partnership — our team
            is ready to talk.
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
                <span className="text-gray-900 font-black text-base mb-1">+91 98691 13692</span>
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
              <div className="bg-[#EEBA2B] border-b border-x border-[#EEBA2B] p-6 -mt-px min-h-[160px] flex flex-col group-hover:bg-[#EEBA2B]/90 transition-colors duration-300 rounded-b-xl shadow-md">
                <Mail className="w-7 h-7 text-black mb-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-black font-black text-base mb-1">ui52jnpt@gmail.com</span>
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
        </div>
      </section>

      {/* ============================================================
          FORM + SIDEBAR SECTION
         ============================================================ */}
      <section className="form-section w-full py-16 sm:py-24 px-6 sm:px-12 lg:px-24 border-t border-black/5 bg-[rgba(20,20,20,0.02)]">
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
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-widest text-gray-700 font-black mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
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
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 bg-[rgba(20,20,20,0.05)] backdrop-blur-md border border-black/10 rounded-lg text-gray-900 text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#EEBA2B] focus:bg-white shadow-inner transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-gray-700 font-black mb-2">
                    Subject
                  </label>
                  <select className="w-full px-4 py-3 bg-[rgba(20,20,20,0.05)] backdrop-blur-md border border-black/10 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-[#EEBA2B] focus:bg-white shadow-inner transition-all appearance-none cursor-pointer">
                    <option value="">Select a topic</option>
                    <option value="quote">Request a Quote</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="custom">Custom Manufacturing</option>
                    <option value="support">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-gray-700 font-black mb-2">
                    Message
                  </label>
                  <textarea
                    rows="5"
                    placeholder="Tell us about your project requirements, expected volumes, timeline..."
                    className="w-full px-4 py-3 bg-[rgba(20,20,20,0.05)] backdrop-blur-md border border-black/10 rounded-lg text-gray-900 text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#EEBA2B] focus:bg-white shadow-inner transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="group bg-[#EEBA2B] text-black px-8 py-4 text-xs sm:text-sm font-black uppercase tracking-widest hover:bg-gray-900 hover:text-[#EEBA2B] transition-all duration-300 rounded-lg shadow-[0_4px_15px_rgba(238,186,43,0.3)] hover:shadow-none hover:translate-y-px flex items-center gap-3 w-full sm:w-auto justify-center"
                >
                  Send Message
                  <Send className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
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
                      <span className="text-gray-900 text-sm font-black block">3 Global Facilities</span>
                      <span className="text-gray-600 text-xs font-medium">Nagpur, Maharashtra, India</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white border border-black/5 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Globe className="w-4 h-4 text-[#EEBA2B]" />
                    </div>
                    <div>
                      <span className="text-gray-900 text-sm font-black block">500+ B2B Partners</span>
                      <span className="text-gray-600 text-xs font-medium">OEMs & aftermarket worldwide</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white border border-black/5 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Clock className="w-4 h-4 text-[#EEBA2B]" />
                    </div>
                    <div>
                      <span className="text-gray-900 text-sm font-black block">24hr Response</span>
                      <span className="text-gray-600 text-xs font-medium">Fast turnaround on all inquiries</span>
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
                  href="tel:+919869113692"
                  className="relative z-10 flex items-center gap-3 bg-gray-900 text-[#EEBA2B] px-5 py-3 rounded-lg text-sm font-black hover:bg-black transition-colors w-fit shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  +91 98691 13692
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FAQ SECTION
         ============================================================ */}
      <section className="faq-section w-full py-16 sm:py-24 px-6 sm:px-12 lg:px-24">
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
              question="What is the minimum order quantity (MOQ)?"
              answer="Our MOQs vary by product category. Engine components typically start at 500 units, while suspension systems start at 200 units. We're flexible for pilot orders — contact us to discuss your specific needs."
            />
            <FAQItem
              question="Do you offer custom manufacturing?"
              answer="Absolutely. Over 40% of our output is custom-engineered to client specifications. We work from your CAD files or collaborate on design-to-manufacture projects from scratch."
            />
            <FAQItem
              question="What certifications do you hold?"
              answer="We are ISO 9001:2015 and IATF 16949 certified across all facilities. We also comply with REACH and RoHS standards for applicable components."
            />
            <FAQItem
              question="What are your typical lead times?"
              answer="Standard catalog items ship within 2–4 weeks. Custom orders typically require 6–10 weeks depending on complexity. We offer expedited manufacturing for urgent requirements."
            />
            <FAQItem
              question="Do you ship internationally?"
              answer="Yes. We ship to over 60 countries with full logistics support including customs documentation, freight forwarding, and door-to-door delivery through our network of certified partners."
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA SECTION
         ============================================================ */}
      <section className="cta-section w-full py-16 sm:py-24 px-6 sm:px-12 lg:px-24">
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
                  Join 500+ manufacturers who trust us for precision-engineered
                  automobile components delivered on time, every time.
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