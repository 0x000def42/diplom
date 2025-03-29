import { create } from 'zustand';

export const useGlobalStore = create((set) => ({
  searchTerm: '',
  user: null,
  isReady: false,
  showOnlyFavorites: false,
  showOnlyMy: false,

  setSearchTerm: (val) => set({ searchTerm: val }),
  setUser: (user) => set({ user }),
  setReady: () => set({ isReady: true }),
  toggleFavoritesFilter: () => set((state) => ({ showOnlyFavorites: !state.showOnlyFavorites })),
  toggleMyFilter: () => set((state) => ({showOnlyMy: !state.showOnlyMy}))
}));