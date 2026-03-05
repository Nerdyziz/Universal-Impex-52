"use client";

import { createContext, useContext, useState, useCallback } from "react";

const IntroContext = createContext({
  introComplete: true, // default true so non-home pages animate immediately
  setIntroComplete: () => {},
  introActive: false, // whether an intro overlay is currently mounted
  setIntroActive: () => {},
});

export function IntroProvider({ children }) {
  const [introComplete, setIntroComplete] = useState(false);
  const [introActive, setIntroActive] = useState(false);

  return (
    <IntroContext.Provider
      value={{ introComplete, setIntroComplete, introActive, setIntroActive }}
    >
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  return useContext(IntroContext);
}
