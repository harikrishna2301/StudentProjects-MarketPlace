import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  category: string;
  slug?: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  totalSavings: number;
  addItem: (item: CartItem) => boolean;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'projectkit_cart_items_v2';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage quota or private browsing fallback
    }
  }, [items]);

  const addItem = (item: CartItem): boolean => {
    if (items.some((i) => i.id === item.id)) {
      setIsCartOpen(true);
      return false; // Already in cart
    }
    setItems((prev) => [...prev, item]);
    setIsCartOpen(true);
    return true;
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

  const totalSavings = items.reduce((sum, item) => {
    const orig = item.originalPrice ?? item.price;
    return sum + Math.max(0, orig - item.price);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount: items.length,
        totalAmount,
        totalSavings,
        addItem,
        removeItem,
        clearCart,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
