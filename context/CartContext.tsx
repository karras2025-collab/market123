import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, Variant, CheckoutFlow } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, variant: Variant) => { success: boolean; error?: string };
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  currentFlow: CheckoutFlow | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children?: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentFlow, setCurrentFlow] = useState<CheckoutFlow | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('skyress_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCart(parsed);
        if (parsed.length > 0) {
          setCurrentFlow(parsed[0].product.flow);
        }
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('skyress_cart', JSON.stringify(cart));
    if (cart.length === 0) {
      setCurrentFlow(null);
    } else {
      setCurrentFlow(cart[0].product.flow);
    }
  }, [cart]);

  const addToCart = (product: Product, variant: Variant) => {
    // Check flow compatibility
    if (currentFlow && currentFlow !== product.flow) {
      return { 
        success: false, 
        error: `Conflict! Your cart contains items for "${currentFlow === 'telegram_redirect' ? 'Telegram Checkout' : 'Site Request'}". You cannot add a "${product.flow === 'telegram_redirect' ? 'Telegram' : 'Site Request'}" item. Please clear your cart first.` 
      };
    }

    setCart([...cart, { product, selectedVariant: variant }]);
    return { success: true };
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const clearCart = () => {
    setCart([]);
    setCurrentFlow(null);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, currentFlow }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};