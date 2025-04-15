// stores/useCajaStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Movimiento {
  concepto: string;
  monto: number;
}

interface EstadoCaja {
  total: number;
  estado: "sobrante" | "faltante" | "balanceado";
  totalEntradas: number;
  totalSalidas: number;
}

interface CajaState {
  entradas: Movimiento[];
  salidas: Movimiento[];
  detalleEfectivo: Record<string, number>;
  agregarMovimiento: (concepto: string, monto: number, tipo: "Entrada" | "Salida") => void;
  EliminarMovimiento1: (concepto: string) => void;
  setDetalleEfectivo: (detalle: Record<string, number>) => void;
  estadoCaja: () => EstadoCaja;
  eliminarMovimiento: (esEntrada: boolean, index: number) => void; 
}

export const useCajaStore = create(
  persist<CajaState>(
    (set, get) => ({
      entradas: [],
      salidas: [],
      detalleEfectivo: {},

      agregarMovimiento: (concepto, monto, tipo) =>
        set((state) => {
          if (tipo === "Entrada") {
            return { entradas: [...state.entradas, { concepto, monto }] };
          } else {
            return { salidas: [...state.salidas, { concepto, monto }] };
          }
        }),

      EliminarMovimiento1: (concepto) =>
        set((state) => ({
          entradas: state.entradas.filter((m) => m.concepto !== concepto),
          salidas: state.salidas.filter((m) => m.concepto !== concepto),
        })),

      setDetalleEfectivo: (detalle) =>
        set(() => ({
          detalleEfectivo: detalle,
        })),

      estadoCaja: () => {
        const totalEntradas = get().entradas.reduce((acc, m) => acc + m.monto, 0);
        const totalSalidas = get().salidas.reduce((acc, m) => acc + m.monto, 0);
        const diferencia = Math.abs(totalEntradas - totalSalidas);

        let estado: EstadoCaja["estado"] = "balanceado";
        if (totalEntradas > totalSalidas) estado = "faltante";
        else if (totalSalidas > totalEntradas) estado = "sobrante";

        return {
          total: diferencia,
          estado,
          totalEntradas,
          totalSalidas,
        };
      },

      eliminarMovimiento: (esEntrada, index) => {
        set((state) => {
          if (esEntrada) {
            const nuevasEntradas = [...state.entradas];
            nuevasEntradas.splice(index, 1);
            return { entradas: nuevasEntradas };
          } else {
            const nuevasSalidas = [...state.salidas];
            nuevasSalidas.splice(index, 1);
            return { salidas: nuevasSalidas };
          }
        });
      },
      
    }),
    {
      name: "caja-storage",
    }
  )
);
