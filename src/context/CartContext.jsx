"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";

const CART_KEY = "b2b_cart";
const EMPTY_CART = "[]";
const CartContext = createContext();
const cartListeners = new Set();

function readCartSnapshot() {
  if (typeof window === "undefined") return EMPTY_CART;
  return localStorage.getItem(CART_KEY) || EMPTY_CART;
}

function parseCart(snapshot) {
  try {
    const parsed = JSON.parse(snapshot);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function subscribeCart(listener) {
  if (typeof window === "undefined") return () => {};

  const handleStorageChange = (event) => {
    if (event.key === CART_KEY) listener();
  };

  cartListeners.add(listener);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    cartListeners.delete(listener);
    window.removeEventListener("storage", handleStorageChange);
  };
}

function writeCart(updater) {
  if (typeof window === "undefined") return;

  const current = parseCart(readCartSnapshot());
  const next = typeof updater === "function" ? updater(current) : updater;

  try {
    localStorage.setItem(CART_KEY, JSON.stringify(next));
  } catch {}

  cartListeners.forEach((listener) => listener());
}

export function CartProvider({ children }) {
  const cartSnapshot = useSyncExternalStore(
    subscribeCart,
    readCartSnapshot,
    () => EMPTY_CART,
  );
  const cart = useMemo(() => parseCart(cartSnapshot), [cartSnapshot]);

  const addToCart = (product, qty = 1) => {
    writeCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + qty }
            : item,
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
    writeCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    writeCart((prev) =>
      prev.map((item) =>
        item._id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      ),
    );
  };

  const clearCart = () => writeCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

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
