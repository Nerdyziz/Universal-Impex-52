"use client";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useState, useRef } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);
  const { cartCount } = useCart();

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from("nav", {
      y: -100,
      opacity: 0,
      ease: "power1.out",
    });
    tl.from(".nav-links", {
      y: -50,
      opacity: 0,
      duration: 0.5,
      ease: "power1.out",
      stagger: 0.3,
    });
  }, {});

  const toggleMobile = () => setMobileOpen((prev) => !prev);

  return (
    <>
      <nav
        ref={navRef}
        className="flex justify-between items-center w-full border-b border-amber-900/10 bg-[#F1E6D2]/80 backdrop-blur-xl"
      >
        <div className=" flex h-18  items-center justify-between w-full px-6 lg:px-8">
          {/* Logo — left */}
          <Link href="/" className="nav-links flex items-center shrink-0">
            <Image
              src="/logo.svg"
              alt="Universal Impex 52 — Home"
              width={70}
              height={70}
              className="object-contain drop-shadow-sm"
              priority
            />
          </Link>

          {/* Desktop links — right */}
          <div className="hidden md:flex items-center gap-10">
            <NavLink href="/" label="Home" />
            <NavLink href="/about" label="About" />
            <NavLink href="/products" label="Products" />
            <NavLink href="/brands" label="Brands" />
            <NavLink href="/contact" label="Contact" />
            <Link
              href="/cart"
              className="nav-links relative group py-1 text-amber-950 hover:text-amber-700 transition-colors"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-amber-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={toggleMobile}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-amber-900 transition-colors hover:bg-amber-900/10"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay — outside nav to avoid stacking context issues */}
      <div
        className={`fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMobile}
      />

      {/* Mobile drawer — outside nav to avoid stacking context issues */}
      <div
        className={`fixed top-0 left-0 z-[9999] h-full w-72 bg-[#F1E6D2] shadow-2xl transition-transform duration-400 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button inside drawer */}
        <button
          onClick={toggleMobile}
          className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full text-amber-900 transition-colors hover:bg-amber-900/10"
          aria-label="Close menu"
        >
          <X size={22} />
        </button>
        <div className="flex flex-col gap-2 px-6 pt-24">
          <MobileLink href="/" label="Home" onClick={toggleMobile} />
          <MobileLink href="/about" label="About" onClick={toggleMobile} />
          <MobileLink href="/products" label="Products" onClick={toggleMobile} />
          <MobileLink href="/brands" label="Brands" onClick={toggleMobile} />
          <MobileLink href="/contact" label="Contact" onClick={toggleMobile} />
          <Link
            href="/cart"
            onClick={toggleMobile}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-amber-950 transition-colors hover:bg-amber-900/5 hover:text-amber-700"
          >
            <ShoppingCart size={18} />
            Cart
            {cartCount > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ml-auto">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </>
  );
}

/* Desktop nav link with animated underline */
function NavLink({ href, label }) {
  return (
    <Link
      href={href}
      className="nav-links group relative py-1 text-[15px] font-medium tracking-wide text-amber-950 transition-colors hover:text-amber-700"
    >
      {label}
      <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 rounded-full bg-amber-700 transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

/* Mobile nav link */
function MobileLink({ href, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center rounded-xl px-4 py-3 text-base font-medium text-amber-950 transition-colors hover:bg-amber-900/5 hover:text-amber-700"
    >
      {label}
    </Link>
  );
}