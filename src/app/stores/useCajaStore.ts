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
  detalleEfectivo: Record<string, number>; // agregado
  agregarMovimiento: (concepto: string, monto: number, tipo: "Entrada" | "Salida") => void;
  limpiarCaja: (concepto: string) => void;
  setDetalleEfectivo: (detalle: Record<string, number>) => void; // agregado
  estadoCaja: () => EstadoCaja;
}

export const useCajaStore = create(
  persist<CajaState>(
    (set, get) => ({
      entradas: [],
      salidas: [],
      detalleEfectivo: {}, // inicializado
      agregarMovimiento: (concepto, monto, tipo) =>
        set((state) => {
          if (tipo === "Entrada") {
            return { entradas: [...state.entradas, { concepto, monto }] };
          } else {
            return { salidas: [...state.salidas, { concepto, monto }] };
          }
        }),
      limpiarCaja: (concepto) =>
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
        if (totalEntradas > totalSalidas) estado = "sobrante";
        else if (totalSalidas > totalEntradas) estado = "faltante";

        return {
          total: diferencia,
          estado,
          totalEntradas,
          totalSalidas,
        };
      },
    }),
    {
      name: "caja-storage",
    }
  )
);
