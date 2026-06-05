'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProfileStore = create(
  persist(
    (set) => ({
      // Face analysis data
      faceShape: null,
      skinTone: null,
      gender: null,
      features: null,

      // Recommendations from preview
      hairstyleRecommendations: null,
      makeupRecommendations: null,
      hairColorRecommendations: null,

      // Wedding planner data
      weddingDate: null,
      preferredArea: null,

      // Actions
      setProfile: (data) => set((state) => ({ ...state, ...data })),
      setFaceAnalysis: (analysis) =>
        set({
          faceShape: analysis.faceShape || null,
          skinTone: analysis.skinTone || null,
          gender: analysis.gender || null,
          features: analysis.features || null,
          hairstyleRecommendations: analysis.hairstyleRecommendations || null,
          makeupRecommendations: analysis.makeupRecommendations || null,
          hairColorRecommendations: analysis.hairColorRecommendations || null,
        }),
      setWeddingDate: (date) => set({ weddingDate: date }),
      setPreferredArea: (area) => set({ preferredArea: area }),
      clearProfile: () =>
        set({
          faceShape: null,
          skinTone: null,
          gender: null,
          features: null,
          hairstyleRecommendations: null,
          makeupRecommendations: null,
          hairColorRecommendations: null,
          weddingDate: null,
          preferredArea: null,
        }),
    }),
    {
      name: 'glowspot-profile',
    }
  )
);
