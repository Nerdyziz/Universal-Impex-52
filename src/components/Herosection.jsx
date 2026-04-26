"use client";

import React, { useEffect, useRef } from "react";

import { gsap } from "gsap";

import { useGSAP } from "@gsap/react";

import Image from "next/image";

import TextPlugin from "gsap/TextPlugin";

import ScrollTrigger from "gsap/ScrollTrigger";
import { Dice1 } from "lucide-react";
import { div } from "three/src/nodes/math/OperatorNode";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const Herosection = () => {

  const containerRef = useRef(null);

  const [svgLoaded, setSvgLoaded] = React.useState(false);

  useEffect(() => {
    // Define an internal async function

    const fetchSvg = async () => {
      try {
        const response = await fetch("/machine2.svg");

        const text = await response.text();

        const parser = new DOMParser();

        const svgDoc = parser.parseFromString(text, "image/svg+xml");

        const svgElement = svgDoc.querySelector("svg");

        const container = document.querySelector(".mech");

        if (container && svgElement) {
          // Clear existing content and append the actual DOM node

          container.innerHTML = "";

          container.appendChild(svgElement);

          setSvgLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching SVG:", error);
      }
    };

    fetchSvg();
  }, []);

  const imageRef = useRef(null);

  useGSAP(() => {
    // 1. SETUP: Select items and set initial rotation via GSAP (not CSS)

    // Fix: Set rotation here so GSAP knows about it and doesn't overwrite it

    const isMobile = window.innerWidth < 640;
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;
    const svgSize = isMobile ? 400 : window.innerWidth < 1024 ? 600 : 800;
    gsap.set(imageRef.current, { rotation: -30, width: svgSize, height: svgSize });

    // Skip mouse-move parallax on touch devices — saves CPU (no mouse anyway)
    let handleMouseMove = null;
    if (!isTouchDevice) {
      const xTo = gsap.quickTo(imageRef.current, "x", {
        duration: 0.5,
        ease: "power3.out",
      });

      const yTo = gsap.quickTo(imageRef.current, "y", {
        duration: 0.5,
        ease: "power3.out",
      });

      handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const xFactor = clientX / innerWidth - 0.5;
        const yFactor = clientY / innerHeight - 0.5;
        const moveAmount = window.innerWidth < 640 ? 30 : 100;
        xTo(xFactor * moveAmount);
        yTo(yFactor * moveAmount);
      };

      window.addEventListener("mousemove", handleMouseMove);
    }

    // 4. ENTRANCE ANIMATION

    // Note: We use 'from' on properties that DON'T conflict with x/y if possible,

    // or we accept that during the 1s load, mouse movement might be subtle.

    const tl = gsap.timeline({ delay: 1.2 }); // Wait for Navbar

    tl.from(
      imageRef.current,
      {
        y: 200, // Entrance moves Y

        opacity: 0,

        scale: 0.8,

        duration: 1.2,

        ease: "power3.out",
      },
      "anim",
    );

    tl.from(
      ".logo-bg",
      {
        scale: 0,

        opacity: 0,

        duration: 0.5,

        stagger: 0.1,

        ease: "back.out(1.7)",
      },
      "anim",
    );

    tl.from(
      ".heroText",
      {
        scale: 0.8,

        opacity: 0,

        duration: 1,

        ease: "power3.out",
      },
      "anim+=0.4",
    );

    tl.to(".logo-bg", {
      y: 15,

      stagger: 0.3,

      repeat: -1,

      yoyo: true,

      ease: "sine.inOut",

      duration: 2,
    });

    // Cleanup

    return () => {
      if (handleMouseMove) window.removeEventListener("mousemove", handleMouseMove);
    };
  });

  useGSAP(() => {
    if (!svgLoaded) return; // ⛔ don’t run early

    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "bottom bottom",
        end: "top -400%",
        pin: true,
        pinSpacing: true,
        scrub: isTouchDevice ? 1.5 : 1,
        fastScrollEnd: true, // Snaps cleanly at end of fast flick gestures
      },
    });

    scrollTl.to(
      "#full",
      {
        

        opacity: 0,

       
        scale: 1.05,
        duration: 1,

        ease: "none",
      },
      "a",
    );
     scrollTl.to(
      ".mech",
      {
        

        

       
        scale: 1.05,
        duration: 1,

        ease: "none",
      },
      "a",
    );

    scrollTl.to(
      ".logos",
      {
        yPercent: -100,

        ease: "none",

        duration: 1,
      },
      "a",
    );

    scrollTl.to(
      ".heroText h1",
      {
        text: "MEETS",

        duration: 1,

        fontFamily: "algerian",

        fontStyle: "italic",

        fontSize: window.innerWidth < 640 ? "48px" : window.innerWidth < 1024 ? "96px" : "164px",

        backgroundImage: "linear-gradient(to right, #fca5a5, #eab308, #000)",

        backgroundClip: "text",

        WebkitBackgroundClip: "text",

        color: "transparent",

        ease: "sine.inOut",
      },
      "a",
    );

    scrollTl.to(
      ".logos2",
      {
        yPercent: -200,

        ease: "none",

        duration: 1,
      },
      "-=0.2",
    );

    scrollTl.to(
      "#needle",
      {
      

        opacity: 0,

       
        scale: 1.1,
        duration: 1,

        ease: "none",
      },
      "-=0.5",
    );
    scrollTl.to(
      ".mech",
      {
        

        

       
        scale: 1.1,
        duration: 1,

        ease: "none",
      },
      "-=0.5",
    );

    scrollTl.to(
      ".heroText h1",
      {
        text: "PROGRESS",

        duration: 1,

        fontSize: window.innerWidth < 640 ? "40px" : window.innerWidth < 1024 ? "96px" : "200px",

        fontFamily: "roboto",

        fontStyle: "normal",

        backgroundImage: "linear-gradient(to right, #fab52a, #780421, #fffc61)",

        backgroundClip: "text",

        WebkitBackgroundClip: "text",

        color: "transparent",

        ease: "sine.inOut",
      },
      "-=0.8",
    );

    scrollTl.to(
      "#front",
      {
       

        opacity: 0,
        scale: 1.15,
        duration: 1,

        ease: "none",
      },
      "-=0.8",
    );
    scrollTl.to(
      ".mech",
      {
        

        

       
        scale: 1.15,
        duration: 1,

        ease: "none",
      },
      "-=0.8",
    );

    ScrollTrigger.refresh();
  }, [svgLoaded]);

  return (
    
    <div
      ref={containerRef}
      className="relative  h-screen w-full overflow-hidden bg-transparent"
    >
      {/* BACKGROUND LOGOS */}

      <div className="logos absolute inset-0 w-full h-full z-10">
        {/* Added 'parallax-item' and 'logo-bg' classes to all */}

        <div
          className="parallax-item logo-bg absolute top-[15%] left-[5%] rounded-full  "
          data-speed="0.3"
        >
          <Image
            src="/b1.svg"
            alt="Automotive partner brand logo"
            width={200}
            height={80}
            className="object-contain hover:scale-110 transition duration-800 ease-in-out w-[100px] sm:w-[150px] lg:w-[200px] h-auto"
          />
        </div>

        <div
          className="parallax-item logo-bg absolute top-[25%] right-[5%] hover:scale-95"
          data-speed="-0.4"
        >
          <Image
            src="/b2.svg"
            alt="OEM manufacturer brand logo"
            width={200}
            height={80}
            className="object-contain hover:scale-110 transition duration-800 ease-in-out w-[100px] sm:w-[150px] lg:w-[200px] h-auto"
          />
        </div>

        <div
          className="parallax-item logo-bg absolute bottom-[25%] left-[10%] hover:scale-95"
          data-speed="0.6"
        >
          <Image
            src="/b3.svg"
            alt="Industrial components brand logo"
            width={200}
            height={80}
            className="object-contain hover:scale-110 transition duration-800 ease-in-out w-[100px] sm:w-[150px] lg:w-[200px] h-auto"
          />
        </div>

        <div
          className="parallax-item logo-bg absolute bottom-[20%] right-[10%] hover:scale-95"
          data-speed="-0.5"
        >
          <Image
            src="/b4.svg"
            alt="Aftermarket parts brand logo"
            width={200}
            height={80}
            className="object-contain hover:scale-110 transition duration-800 ease-in-out w-[100px] sm:w-[150px] lg:w-[200px] h-auto"
          />
        </div>

        <div
          className="parallax-item logo-bg absolute bottom-[5%] left-1/2 rounded-full hover:scale-95 "
          data-speed="0.2"
        >
          <Image
            src="/b5.svg"
            alt="Performance parts brand logo"
            width={200}
            height={80}
            className="object-contain hover:scale-110 transition duration-800 ease-in-out w-[100px] sm:w-[150px] lg:w-[200px] h-auto"
          />
        </div>
      </div>

      <div className="logos2 absolute top-full inset-0 w-full h-full z-10">
        {/* Added 'parallax-item' and 'logo-bg' classes to all */}

        <div
          className="parallax-item logo-bg absolute top-[15%] left-[5%] rounded-full hover:scale-95"
          data-speed="0.3"
        >
          <Image
            src="/b6.svg"
            alt="Precision engineering brand logo"
            width={200}
            height={80}
            className="object-contain hover:scale-110 transition duration-800 ease-in-out w-[100px] sm:w-[150px] lg:w-[200px] h-auto"
          />
        </div>

        <div
          className="parallax-item logo-bg absolute top-[25%] right-[5%] hover:scale-95"
          data-speed="-0.4"
        >
          <Image
            src="/b7.svg"
            alt="Automotive systems brand logo"
            width={200}
            height={80}
            className="object-contain hover:scale-110 transition duration-800 ease-in-out w-[100px] sm:w-[150px] lg:w-[200px] h-auto"
          />
        </div>

        <div
          className="parallax-item logo-bg absolute bottom-[25%] left-[10%] hover:scale-95"
          data-speed="0.6"
        >
          <Image
            src="/b8.svg"
            alt="Drivetrain components brand logo"
            width={200}
            height={80}
            className="object-contain hover:scale-110 transition duration-800 ease-in-out w-[100px] sm:w-[150px] lg:w-[200px] h-auto"
          />
        </div>

        <div
          className="parallax-item logo-bg absolute bottom-[20%] right-[10%] hover:scale-95"
          data-speed="-0.5"
        >
          <Image
            src="/b4.svg"
            alt="Aftermarket parts brand logo"
            width={200}
            height={80}
            className="object-contain hover:scale-110 transition duration-800 ease-in-out w-[100px] sm:w-[150px] lg:w-[200px] h-auto"
          />
        </div>

        <div
          className="parallax-item logo-bg absolute bottom-[5%] left-1/2 rounded-full hover:scale-95 "
          data-speed="0.2"
        >
          <Image
            src="/b5.svg"
            alt="Performance parts brand logo"
            width={200}
            height={80}
            className="object-contain hover:scale-110 transition duration-800 ease-in-out w-[100px] sm:w-[150px] lg:w-[200px] h-auto"
          />
        </div>
      </div>

      {/* HERO IMAGE */}

      <div className=" absolute top-0 left-0 w-full h-full z-0 flex items-center justify-center">
        {/* We apply the ref and parallax class to the inner wrapper or image directly */}

        <div
          ref={imageRef}
          className=" mech flex w-full h-full items-center justify-center" // Fixed width for stability
          data-speed="1.5"
        ></div>
      </div>

      <div
        className={
          "heroText flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-4xl sm:text-7xl lg:text-9xl font-bold bg-linear-to-r from-yellow-300 via-yellow-500 to-yellow-200 bg-clip-text text-transparent -z-1 font-['algerian']"
        }
      >
        <h1>PRECISION</h1>
      </div>
    
    </div>
  );
};

export default Herosection;
