"use client";

import React from "react";
import { ReactLenis, useLenis } from "lenis/react";
import Cards from "@/components/Cards";
import Vid from "@/components/Vid";
import Testimonial from "@/components/Testimonial";
import Label from "@/components/Label";
import { useIntro } from "@/context/IntroContext";
import MobileCard from "@/components/MobileCard";


export default function Home() {
  const { introComplete } = useIntro();

  useLenis((lenis) => {
    // scroll listener
   
  });

  return (
    <>
      <ReactLenis root />

      
   
      <Vid />
      <MobileCard />
    
      <Cards  />
      <Label />
      
      <Testimonial />
    </>
  );
}
