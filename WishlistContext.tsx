import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { HeroVehicle } from '../types';
import { HERO_VEHICLES } from '../data/vehicles';

const WISHLIST_STORAGE_KEY = 'hero_wishlist_ids_v1';

// Seed with 2 popular flagships for instant visual demonstration on first visit
const DEFAULT_INITIAL_FAVORITES = ['splendor-plus', 'xtreme-125r'];

interface WishlistContextType {
  favoriteIds: string[];
  favoriteVehicles: HeroVehicle[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (vehicleOrId: HeroVehicle | string) => void;
  addFavorite: (vehicleOrId: HeroVehicle | string) => void;
  removeFavorite: (id: string) => void;
  clearWishlist: () => void;
  favoritesCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to parse wishlist from localStorage', err);
    }
    return DEFAULT_INITIAL_FAVORITES;
  });

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch (err) {
      console.warn('Failed to save wishlist to localStorage', err);
    }
  }, [favoriteIds]);

  const favoriteVehicles = useMemo(() => {
    return HERO_VEHICLES.filter((v) => favoriteIds.includes(v.id));
  }, [favoriteIds]);

  const isFavorite = useCallback(
    (id: string) => {
      return favoriteIds.includes(id);
    },
    [favoriteIds]
  );

  const toggleFavorite = useCallback((vehicleOrId: HeroVehicle | string) => {
    const id = typeof vehicleOrId === 'string' ? vehicleOrId : vehicleOrId.id;
    setFavoriteIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  const addFavorite = useCallback((vehicleOrId: HeroVehicle | string) => {
    const id = typeof vehicleOrId === 'string' ? vehicleOrId : vehicleOrId.id;
    setFavoriteIds((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavoriteIds((prev) => prev.filter((item) => item !== id));
  }, []);

  const clearWishlist = useCallback(() => {
    setFavoriteIds([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        favoriteIds,
        favoriteVehicles,
        isFavorite,
        toggleFavorite,
        addFavorite,
        removeFavorite,
        clearWishlist,
        favoritesCount: favoriteIds.length,
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
