"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TermsAndConditions = () => {
  const container = useRef(null);

  useGSAP(() => {
    // Animate Header
    gsap.from('.terms-header', {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power3.out"
    });

    // Animate sections on scroll
    const sections = gsap.utils.toArray('.terms-section');
    sections.forEach((sec) => {
      gsap.from(sec, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sec,
          start: "top 85%",
          scrub: 0.3
        }
      });
    });
  }, { scope: container });

  const sections = [
    {
      title: "Acceptance of Terms",
      content: "By accessing and using the website of Universal Impex 52, you are entering into a binding agreement with us, governed by these Terms and Conditions. Whether you are browsing, placing an order, or engaging with our services in any capacity, you signify that you have read, understood, and agreed to be legally bound by these terms. If you do not agree to these Terms in whole or in part, we request you to refrain from accessing or using our website. This contract is enforceable under the Information Technology Act, 2000, and other applicable Indian laws. Universal Impex 52 reserves all rights to take legal action in the event of breach or misuse of this agreement."
    },
    {
      title: "Amendments to the Terms",
      content: "We may revise or update these Terms at our sole discretion and without prior notice to reflect changes in the law, market conditions, technology, or business operations. You are responsible for checking the Terms periodically for any modifications. Your continued use of our services following the posting of updated terms will be deemed acceptance of those changes. These updates ensure that we continue to protect both our business interests and your rights as a user. If significant changes are made, we may attempt to notify you through prominent notices on our website or via email communication if you're a registered customer."
    },
    {
      title: "Eligibility Criteria",
      content: "To be eligible to use our services or enter into a transaction with us, you must be at least 18 years of age and possess the legal authority to form a binding contract under Indian laws. If you are using our platform on behalf of an organization, you confirm that you have the authority to represent and legally bind that entity to our Terms. Universal Impex 52 reserves the right to restrict access or refuse service to any individual or business if it deems the user to be violating the Terms or engaging in fraudulent, illegal, or inappropriate conduct."
    },
    {
      title: "Intellectual Property Rights",
      content: "All content published on this website—including, but not limited to, images, product descriptions, logos, trademarks, data compilations, software, code, layout, and design—is the sole property of Universal Impex 52 and is protected under Indian and international copyright, trademark, and intellectual property laws. Unauthorized reproduction, redistribution, modification, or commercial exploitation of any portion of this content is strictly prohibited. You may only access and use the materials for personal, non-commercial purposes unless you have received explicit written consent from us."
    },
    {
      title: "User Responsibilities and Restrictions",
      content: "You agree to use our website in accordance with all applicable laws and regulations and shall not engage in any activity that disrupts the website or compromises its security or integrity. This includes, but is not limited to, hacking, introducing viruses or malware, data mining, unsolicited marketing, reverse engineering, or scraping. You may not use our platform for any fraudulent or unlawful purpose, nor impersonate another individual or entity. We reserve the right to terminate your access or take legal action if such prohibited activities are detected."
    },
    {
      title: "Product Information, Orders, and Pricing",
      content: "At Universal Impex 52, we strive to ensure that all product descriptions, specifications, prices, and images are accurate and up to date. However, in the event of typographical errors, inaccurate listings, or changes in market prices, we reserve the right to modify or cancel orders accordingly. Prices displayed on the website are in Indian Rupees and are inclusive of applicable taxes unless stated otherwise. By placing an order, you confirm that you are authorized to use the payment method and that the information provided is accurate. We reserve the right to accept or decline any order at our discretion."
    },
    {
      title: "Limitation of Liability",
      content: "To the fullest extent permitted under Indian law, Universal Impex 52 disclaims all warranties—express or implied—related to our website, products, or services. We shall not be held liable for any direct, indirect, incidental, special, or consequential damages, including but not limited to loss of data, revenue, profits, or goodwill, arising from your use or inability to use our services. While we strive to provide uninterrupted, secure, and accurate content, we cannot guarantee the complete absence of technical issues or errors."
    },
    {
      title: "Indemnity",
      content: "You agree to indemnify, defend, and hold harmless Universal Impex 52 and its directors, employees, agents, affiliates, and vendors from and against any and all claims, liabilities, damages, losses, costs, and expenses, including reasonable attorneys' fees, arising from or related to your violation of these Terms, your misuse of our website or services, or your breach of any applicable law or third-party rights."
    },
    {
      title: "Governing Law and Jurisdiction",
      content: "These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles. Any disputes arising in connection with these Terms shall fall under the exclusive jurisdiction of the competent courts in Nagpur, Maharashtra. By agreeing to these terms, you consent to the personal jurisdiction and venue of these courts."
    }
  ];

  return (
    <div ref={container} className="min-h-screen bg-black text-white selection:bg-[#EEBA2B] selection:text-black font-sans relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pt-[120px] pb-20">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#EEBA2B]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-4xl">
        {/* Header Section */}
        <div className="mb-12 terms-header">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#EEBA2B] transition-colors text-sm font-mono mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-[#EEBA2B]/20 rounded-xl flex items-center justify-center border border-[#EEBA2B]/30 shrink-0">
              <FileText className="w-6 h-6 text-[#EEBA2B]" />
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-md">
              TERMS & CONDITIONS
            </h1>
          </div>
          <p className="text-gray-400 font-mono text-sm md:text-base border-l-2 border-[#EEBA2B] pl-4">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-xs border border-white/10 rounded-3xl p-6 md:p-10 lg:p-12 shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col gap-10">
            {sections.map((section, index) => (
              <div key={index} className="terms-section relative pl-6 md:pl-8">
                {/* Decorative Timeline Line */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/10 rounded-full" />
                <div className="absolute left-[-4px] top-[10px] w-2.5 h-2.5 rounded-full bg-[#EEBA2B] shadow-[0_0_10px_rgba(238,186,43,0.5)]" />
                
                <h2 className="text-[#EEBA2B] font-bold text-xl md:text-2xl mt-0 mb-4">{section.title}</h2>
                <p className="text-gray-300 leading-relaxed font-medium md:text-lg">
                  {section.content}
                </p>
              </div>
            ))}
            
            <div className="terms-section mt-6 p-6 bg-black/40 rounded-2xl border border-white/5 font-mono text-sm text-gray-400">
              <p className="m-0">
                If you have any further questions about these Terms & Conditions, please reach out via our <Link href="/contact" className="text-[#EEBA2B] hover:underline">Contact Page</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
