"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PrivacyPolicy = () => {
  const container = useRef(null);

  useGSAP(() => {
    // Animate Header
    gsap.from('.privacy-header', {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power3.out"
    });

    // Animate sections on scroll
    const sections = gsap.utils.toArray('.privacy-section');
    sections.forEach((sec) => {
      gsap.from(sec, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sec,
          start: "top 85%",
          scrub:0.3
        }
      });
    });
  }, { scope: container });

  const sections = [
    {
      title: "Commitment to Your Privacy",
      content: "Universal Impex 52 is deeply committed to maintaining your privacy and protecting any personal information that you share with us. We believe that your trust is our most valuable asset and we make it a priority to safeguard your data using the best practices available. This Privacy Policy details the types of information we collect, why we collect it, and how we use, store, and share it—always with your consent and in accordance with Indian data protection laws such as the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011."
    },
    {
      title: "Information We Collect",
      content: "We may collect a variety of personal and non personal data from you when you visit our website or engage with our services. This includes your name, email address, mobile number, postal address, billing details, IP address, browsing behavior, and any communication exchanged with us. This information is obtained through forms, order placements, inquiries, cookies, analytics tools, and third-party integrations. We ensure that we collect only what is necessary and always inform you of the purpose before gathering such information."
    },
    {
      title: "How We Use Your Information",
      content: "The information we collect is used to provide and improve our products, services, and customer experience. This includes processing your orders, responding to your inquiries, sending transaction confirmations, improving website functionality, personalizing content, offering promotions, ensuring compliance with applicable laws, and enhancing overall operational efficiency. We never sell or misuse your information for unauthorized purposes. Your data enables us to deliver more tailored, efficient, and satisfying experiences every time you interact with our brand."
    },
    {
      title: "Sharing and Disclosure",
      content: "Universal Impex 52 does not sell, rent, or trade your personal information to any third parties. However, we may share your data with trusted service providers, vendors, and payment gateways who perform essential business functions on our behalf—strictly on a need-to-know basis and under confidentiality agreements. In circumstances where required by law, such as court orders or government investigations, we may disclose your information to the appropriate authorities while ensuring your rights remain respected."
    },
    {
      title: "Data Security Measures",
      content: "We implement industry-standard security measures—including SSL encryption, firewalls, access control, and regular audits—to protect your information against unauthorized access, disclosure, alteration, or destruction. While no method of data transmission or storage is 100% secure, we take every reasonable and commercially viable step to safeguard your data, monitor vulnerabilities, and upgrade security mechanisms as technology evolves."
    },
    {
      title: "Use of Cookies",
      content: "Our website uses cookies and similar tracking technologies to enhance your browsing experience. These cookies help us remember your preferences, measure site performance, and gather insights into how users interact with our platform. You may choose to accept or decline cookies through your browser settings. However, disabling cookies may limit certain functionalities or affect the overall user experience."
    },
    {
      title: "Your Rights",
      content: "As a user, you have full control over your personal information. You may access your data, request corrections, object to processing, withdraw consent, or request deletion of your personal information at any time by contacting us. We will respond to your requests within a reasonable timeframe, in accordance with the rights afforded to you under Indian data protection regulations."
    },
    {
      title: "Third-Party Websites and Links",
      content: "Our website may contain links to third-party websites or services for your convenience or reference. However, we do not control these sites and are not responsible for their privacy practices or content. We strongly advise you to review the privacy policies of any external sites you visit before sharing your information with them."
    },
    {
      title: "Policy Updates",
      content: "We reserve the right to modify or update this Privacy Policy at any time to reflect legal, technological, or business changes. Any revisions will be posted on this page with an updated \"Effective Date.\" We encourage users to review this page periodically to stay informed of how we are protecting their information."
    },
    {
      title: "Contact Us",
      content: "If you have any questions, feedback, or concerns regarding this Privacy Policy or your personal data, please contact us at ui52tijarat@gmail.com. Your trust is paramount to us, and we are committed to addressing your concerns promptly and transparently."
    }
  ];

  return (
    <div ref={container} className="min-h-screen bg-black text-white selection:bg-[#EEBA2B] selection:text-black font-sans relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pt-[120px] pb-20">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#EEBA2B]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-4xl">
        {/* Header Section */}
        <div className="mb-12 privacy-header">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#EEBA2B] transition-colors text-sm font-mono mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-[#EEBA2B]/20 rounded-xl flex items-center justify-center border border-[#EEBA2B]/30 shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#EEBA2B]" />
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-md">
              PRIVACY POLICY
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
              <div key={index} className="privacy-section relative pl-6 md:pl-8">
                {/* Decorative Timeline Line */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/10 rounded-full" />
                <div className="absolute left-[-4px] top-[10px] w-2.5 h-2.5 rounded-full bg-[#EEBA2B] shadow-[0_0_10px_rgba(238,186,43,0.5)]" />
                
                <h2 className="text-[#EEBA2B] font-bold text-xl md:text-2xl mt-0 mb-4">{section.title}</h2>
                <p className="text-gray-300 leading-relaxed font-medium md:text-lg">
                  {section.content}
                </p>
              </div>
            ))}
            
            <div className="privacy-section mt-6 p-6 bg-black/40 rounded-2xl border border-white/5 font-mono text-sm text-gray-400">
              <p className="m-0">
                If you have any further questions about this Privacy Policy, please reach out via our <Link href="/contact" className="text-[#EEBA2B] hover:underline">Contact Page</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
