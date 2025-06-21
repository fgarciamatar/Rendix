import { create } from "zustand";

interface TipoClienteState {
  hogar: number;
  gastronomicos: number;
  negocios: number;
  incrementar: (tipo: "hogar" | "gastronomicos" | "negocios") => void;
  resetear: () => void;
}

export const useTipoClienteStore = create<TipoClienteState>((set) => ({
  hogar: 0,
  gastronomicos: 0,
  negocios: 0,

  incrementar: (tipo) =>
    set((state) => ({
      [tipo]: state[tipo] + 1,
    })),

  resetear: () =>
    set({
      hogar: 0,
      gastronomicos: 0,
      negocios: 0,
    }),
}));
