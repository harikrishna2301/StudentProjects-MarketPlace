import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistToast {
  id: number;
  message: string;
  type: 'added' | 'removed' | 'cleared';
  projectTitle?: string;
  projectId?: string;
}

interface WishlistContextType {
  wishlistIds: string[];
  wishlistCount: number;
  isInWishlist: (projectId: string) => boolean;
  toggleWishlist: (projectId: string, projectTitle?: string) => boolean;
  addToWishlist: (projectId: string, projectTitle?: string) => void;
  removeFromWishlist: (projectId: string, projectTitle?: string) => void;
  clearWishlist: () => void;
  toast: WishlistToast | null;
  dismissToast: () => void;
}

const STORAGE_KEY = 'projectkit_wishlist';
const DEFAULT_INITIAL_WISHLIST = ['proj-002', 'proj-004'];

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return DEFAULT_INITIAL_WISHLIST;
    } catch (e) {
      console.warn('Failed to parse wishlist from localStorage', e);
      return DEFAULT_INITIAL_WISHLIST;
    }
  });

  const [toast, setToast] = useState<WishlistToast | null>(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch (e) {
      console.warn('Failed to save wishlist to localStorage', e);
    }
  }, [wishlistIds]);

  // Auto-dismiss toast after 3.5 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const isInWishlist = (projectId: string): boolean => {
    return wishlistIds.includes(projectId);
  };

  const showToast = (toastData: Omit<WishlistToast, 'id'>) => {
    setToast({
      ...toastData,
      id: Date.now(),
    });
  };

  const dismissToast = () => {
    setToast(null);
  };

  const addToWishlist = (projectId: string, projectTitle?: string) => {
    setWishlistIds((prev) => {
      if (prev.includes(projectId)) return prev;
      return [...prev, projectId];
    });
    showToast({
      message: projectTitle
        ? `Added "${projectTitle}" to Wishlist`
        : 'Saved project to your Wishlist',
      type: 'added',
      projectTitle,
      projectId,
    });
  };

  const removeFromWishlist = (projectId: string, projectTitle?: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== projectId));
    showToast({
      message: projectTitle
        ? `Removed "${projectTitle}" from Wishlist`
        : 'Removed project from your Wishlist',
      type: 'removed',
      projectTitle,
      projectId,
    });
  };

  const toggleWishlist = (projectId: string, projectTitle?: string): boolean => {
    const isCurrentlySaved = isInWishlist(projectId);
    if (isCurrentlySaved) {
      removeFromWishlist(projectId, projectTitle);
      return false;
    } else {
      addToWishlist(projectId, projectTitle);
      return true;
    }
  };

  const clearWishlist = () => {
    setWishlistIds([]);
    showToast({
      message: 'Cleared all items from your Wishlist',
      type: 'cleared',
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistCount: wishlistIds.length,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        toast,
        dismissToast,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
