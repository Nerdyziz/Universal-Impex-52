"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount and listen for cross-tab storage events
  useEffect(() => {
    try {
      const saved = localStorage.getItem("b2b_cart");
      if (saved) setCart(JSON.parse(saved));
    } catch {}
    setIsInitialized(true);

    const handleStorageChange = (e) => {
      if (e.key === "b2b_cart") {
        try {
          const newVal = e.newValue ? JSON.parse(e.newValue) : [];
          setCart(newVal);
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Persist to localStorage only after initialization has completed to prevent wiping it on mount SSR
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem("b2b_cart", JSON.stringify(cart));
      } catch {}
    }
  }, [cart, isInitialized]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          slug: product.slug,
          subtitle: product.subtitle,
          brand: product.brand,
          category: product.category,
          image: product.image,
          price: product.price || 0,
          moq: product.moq || 1,
          quantity: Math.max(qty, product.moq || 1),
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
