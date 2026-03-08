"use client";
import React from 'react'
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="w-full min-h-screen bg-[rgba(20,20,20,0.1)] backdrop-blur-2xl border-t border-black/10 text-gray-900 flex flex-col py-8 sm:py-12 lg:py-16 px-4 sm:px-8 lg:px-16 overflow-hidden relative">
        
        {/* Subtle background glow to match the cards - boosted opacity slightly for white backgrounds */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#EEBA2B]/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex-1 max-w-7xl mx-auto w-full relative z-10">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-8 sm:mb-12">
            {/* Left Section - Info & Links */}
            <div className="space-y-8">
              {/* Brand Section */}
              <div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                  <Image src={'/logo2.svg'} width={500} height={500} alt="Universal Impex 52 Logo" className="drop-shadow-sm"/>
                </h3>
                <p className="text-gray-700 text-sm sm:text-base mb-6 font-mono leading-relaxed">
                  Empowering industries with high-quality tools, equipment and dependable supply solutions built for performance and long-term reliability.
                </p>
              </div>

              {/* Quick Links */}
              <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-base sm:text-lg font-black mb-3 text-gray-900 tracking-wide">Quick Links</h4>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/" className="text-gray-600 hover:text-amber-600 transition-colors text-xs sm:text-sm font-medium">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link href="/about" className="text-gray-600 hover:text-amber-600 transition-colors text-xs sm:text-sm font-medium">
                        About
                      </Link>
                    </li>
                    <li>
                      <Link href="/products" className="text-gray-600 hover:text-amber-600 transition-colors text-xs sm:text-sm font-medium">
                        Products
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="text-gray-600 hover:text-amber-600 transition-colors text-xs sm:text-sm font-medium">
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Contact Info */}
                <div>
                  <h4 className="text-base sm:text-lg font-black mb-3 text-gray-900 tracking-wide">Contact Info</h4>
                  <ul className="space-y-2 text-gray-600 text-xs sm:text-sm font-medium">
                    <li className="hover:text-amber-600 transition-colors cursor-pointer">Email: info@universalimpex52.com</li>
                    <li className="hover:text-amber-600 transition-colors cursor-pointer">Phone: +91 98901 53052</li>
                    <li className="hover:text-amber-600 transition-colors cursor-pointer">510, Loharpura, Behind Arya Samaj Bhavan, CA Road, Nagpur - 440018</li>
                  </ul>
                </div>
              </nav>

              {/* Follow Us */}
              <div>
                <h4 className="text-base sm:text-lg font-black mb-3 text-gray-900 tracking-wide">Follow Us</h4>
                <div className="flex gap-4 flex-wrap">
                  <Link href="https://www.instagram.com/ui52tijarat?igsh=MXRrbmgzMDdycWdjeA==" className="px-4 py-2 bg-black/5 border border-black/10 hover:bg-[#EEBA2B] hover:border-[#EEBA2B] hover:text-black transition-all duration-300 rounded-lg text-gray-800 text-xs sm:text-sm font-bold tracking-wider uppercase shadow-sm hover:shadow-none hover:translate-y-px">
                    Instagram
                  </Link>
                 <Link href="#" className="px-4 py-2 bg-black/5 border border-black/10 hover:bg-[#EEBA2B] hover:border-[#EEBA2B] hover:text-black transition-all duration-300 rounded-lg text-gray-800 text-xs sm:text-sm font-bold tracking-wider uppercase shadow-sm hover:shadow-none hover:translate-y-px">
                    LinkedIn
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Section - Contact Form */}
            <div className="bg-[rgba(255,255,255,0.4)] backdrop-blur-xl border border-black/10 rounded-2xl p-6 sm:p-8 h-fit shadow-[0_15px_40px_rgba(0,0,0,0.08)] relative overflow-hidden">
              {/* Inner card glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#EEBA2B]/20 rounded-full blur-[60px] pointer-events-none" />
              
              <h4 className="text-xl sm:text-2xl font-black mb-6 text-gray-900 drop-shadow-sm">Get in Touch</h4>
              <form className="space-y-4 relative z-10">
                {/* Name Input */}
                <div>
                  <label className="block text-gray-700 text-xs sm:text-sm font-mono tracking-wide mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-2 sm:py-3 bg-white/60 border border-black/10 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:border-[#EEBA2B] focus:bg-white transition-all text-xs sm:text-sm shadow-inner"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-gray-700 text-xs sm:text-sm font-mono tracking-wide mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 sm:py-3 bg-white/60 border border-black/10 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:border-[#EEBA2B] focus:bg-white transition-all text-xs sm:text-sm shadow-inner"
                  />
                </div>

                {/* Subject Input */}
                <div>
                  <label className="block text-gray-700 text-xs sm:text-sm font-mono tracking-wide mb-2">Subject</label>
                  <input
                    type="text"
                    placeholder="Message Subject"
                    className="w-full px-4 py-2 sm:py-3 bg-white/60 border border-black/10 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:border-[#EEBA2B] focus:bg-white transition-all text-xs sm:text-sm shadow-inner"
                  />
                </div>

                {/* Message Textarea */}
                <div>
                  <label className="block text-gray-700 text-xs sm:text-sm font-mono tracking-wide mb-2">Message</label>
                  <textarea
                    placeholder="Your message here..."
                    rows="4"
                    className="w-full px-4 py-2 sm:py-3 bg-white/60 border border-black/10 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:border-[#EEBA2B] focus:bg-white transition-all resize-none text-xs sm:text-sm shadow-inner"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#EEBA2B] text-black font-black py-3 rounded-lg transition-all duration-300 text-xs sm:text-sm uppercase tracking-widest hover:bg-gray-900 hover:text-[#EEBA2B] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-black/10 my-6 sm:my-8"></div>
        </div>

        {/* Footer Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-gray-600 text-xs sm:text-sm gap-4 w-full max-w-7xl mx-auto relative z-10 font-mono">
          <p>&copy; 2026 Universal Impex 52. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-amber-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-amber-600 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
  )
}

export default Footer