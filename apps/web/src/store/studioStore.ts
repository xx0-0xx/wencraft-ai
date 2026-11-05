import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  DEFAULT_DESIGN,
  type InscriptionConfig,
  type MaterialId,
  type OrnamentConfig,
  type OrnamentId,
  type PackagingId,
  type StudioDesign,
} from '../types/studio';
import { clampInscription } from '../lib/text';

interface StudioState {
  design: StudioDesign;
  autoRotate: boolean;
  lastSavedAt: string | null;
  hydrated: boolean;
  setMaterial: (id: MaterialId) => void;
  setInscription: (patch: Partial<InscriptionConfig>) => void;
  setInscriptionText: (text: string) => void;
  resetInscription: () => void;
  setOrnament: (patch: Partial<OrnamentConfig>) => void;
  setOrnamentId: (id: OrnamentId) => void;
  resetOrnament: () => void;
  setPackaging: (id: PackagingId) => void;
  setAutoRotate: (value: boolean) => void;
  saveDraft: () => void;
  resetAll: () => void;
  setHydrated: (value: boolean) => void;
}

function cloneDefaultDesign(): StudioDesign {
  return {
    ...DEFAULT_DESIGN,
    inscription: { ...DEFAULT_DESIGN.inscription },
    ornament: { ...DEFAULT_DESIGN.ornament },
  };
}

export const useStudioStore = create<StudioState>()(
  persist(
    (set) => ({
      design: cloneDefaultDesign(),
      autoRotate: false,
      lastSavedAt: null,
      hydrated: false,
      setMaterial: (materialId) =>
        set((state) => {
          const autoColors = ['#e8d4ac', '#4b2f22'];
          const currentColor = state.design.inscription.color.toLowerCase();
          const shouldAdjust = autoColors.includes(currentColor);
          const nextColor = materialId === 'duanni' ? '#4B2F22' : '#E8D4AC';
          return {
            design: {
              ...state.design,
              materialId,
              inscription: shouldAdjust
                ? { ...state.design.inscription, color: nextColor }
                : state.design.inscription,
            },
          };
        }),
      setInscription: (patch) =>
        set((state) => ({
          design: {
            ...state.design,
            inscription: {
              ...state.design.inscription,
              ...patch,
              ...(patch.text !== undefined
                ? { text: clampInscription(patch.text) }
                : {}),
            },
          },
        })),
      setInscriptionText: (text) =>
        set((state) => ({
          design: {
            ...state.design,
            inscription: {
              ...state.design.inscription,
              text: clampInscription(text),
            },
          },
        })),
      resetInscription: () =>
        set((state) => ({
          design: {
            ...state.design,
            inscription: { ...DEFAULT_DESIGN.inscription },
          },
        })),
      setOrnament: (patch) =>
        set((state) => ({
          design: {
            ...state.design,
            ornament: { ...state.design.ornament, ...patch },
          },
        })),
      setOrnamentId: (id) =>
        set((state) => ({
          design: {
            ...state.design,
            ornament: { ...state.design.ornament, id },
          },
        })),
      resetOrnament: () =>
        set((state) => ({
          design: {
            ...state.design,
            ornament: { ...DEFAULT_DESIGN.ornament },
          },
        })),
      setPackaging: (packagingId) =>
        set((state) => ({
          design: { ...state.design, packagingId },
        })),
      setAutoRotate: (autoRotate) => set({ autoRotate }),
      saveDraft: () => set({ lastSavedAt: new Date().toISOString() }),
      resetAll: () =>
        set({
          design: cloneDefaultDesign(),
          autoRotate: false,
          lastSavedAt: null,
        }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: 'wencraft:studio:v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        design: state.design,
        autoRotate: state.autoRotate,
        lastSavedAt: state.lastSavedAt,
      }),
      migrate: (persistedState) => {
        const state = persistedState as Partial<StudioState> | undefined;
        if (!state || !state.design) {
          return { design: cloneDefaultDesign(), autoRotate: false, lastSavedAt: null };
        }
        return {
          design: {
            ...cloneDefaultDesign(),
            ...state.design,
            inscription: {
              ...DEFAULT_DESIGN.inscription,
              ...(state.design.inscription ?? {}),
            },
            ornament: {
              ...DEFAULT_DESIGN.ornament,
              ...(state.design.ornament ?? {}),
            },
          },
          autoRotate: Boolean(state.autoRotate),
          lastSavedAt: state.lastSavedAt ?? null,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
