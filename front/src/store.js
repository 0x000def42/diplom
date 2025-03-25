import { create } from 'zustand';

export const useGlobalStore = create((set) => ({
  searchTerm: '',
  user: null,
  isReady: false,
  showOnlyFavorites: false,

  setSearchTerm: (val) => set({ searchTerm: val }),
  setUser: (user) => set({ user }),
  setReady: () => set({ isReady: true }),
  toggleFavoritesFilter: () => set((state) => ({ showOnlyFavorites: !state.showOnlyFavorites })),
}));