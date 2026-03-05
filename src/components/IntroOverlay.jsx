"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import BlurText from "./BlurText";
import { useIntro } from "@/context/IntroContext";

const IntroOverlay = ({ onComplete }) => {
  const [textDone, setTextDone] = useState(false);
  const [visible, setVisible] = useState(true);
  const { setIntroComplete, setIntroActive } = useIntro();

  // Mark intro as active on mount
  useEffect(() => {
    setIntroActive(true);
    return () => setIntroActive(false);
  }, [setIntroActive]);

  // After text animation completes, wait a beat then fade out
  useEffect(() => {
    if (!textDone) return;
    const timer = setTimeout(() => {
      setVisible(false);
    }, 600); // hold for 600ms after text finishes
    return () => clearTimeout(timer);
  }, [textDone]);

  const handleExitComplete = () => {
    setIntroComplete(true);
    onComplete?.();
  };

  // Lock scroll while overlay is visible
  useEffect(() => {
    const html = document.documentElement;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      html.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  // Unlock scroll when fading out
  useEffect(() => {
    if (!visible) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
  }, [visible]);

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && (
        <motion.div
          key="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black overflow-hidden"
        >
          {/* Subtle radial glow behind text */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-[120px]" />
          </div>

          <div className="relative z-10 text-center px-6 box-border">
            <BlurText
              text="Precision Meets Progress!"
              delay={800}
              animateBy="words"
              direction="top"
              onAnimationComplete={() => setTextDone(true)}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight"
            />

            {/* Subtle tagline that fades in after main text */}
           
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroOverlay;
