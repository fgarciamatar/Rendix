// stores/useCajaStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Movimiento {
  concepto: string;
  monto: number;
  efectivo: boolean;
  detalleEfectivo: boolean;
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
  detalleEfectivoState: Record<string, number>;
  agregarMovimiento: (
    concepto: string,
    monto: number,
    tipo: "Entrada" | "Salida",
    efectivo: boolean,
    detalleEfectivo: boolean
  ) => void;

  EliminarMovimiento1: (concepto: string) => void;
  setDetalleEfectivo: (detalle: Record<string, number>) => void;
  estadoCaja: () => EstadoCaja;
  // eliminarMovimiento: (esEntrada: boolean, index: number) => void;
}

export const useCajaStore = create(
  persist<CajaState>(
    (set, get) => ({
      entradas: [],
      salidas: [],
      detalleEfectivoState: {},
      agregarMovimiento: (concepto, monto, tipo, efectivo, detalleEfectivo) =>
        set((state) => {
          const nuevoMovimiento = {
            concepto,
            monto,
            efectivo,
            detalleEfectivo,
          };
          if (tipo === "Entrada") {
            return { entradas: [...state.entradas, nuevoMovimiento] };
          } else {
            return { salidas: [...state.salidas, nuevoMovimiento] };
          }
        }),

      EliminarMovimiento1: (concepto) =>
        set((state) => {
          // Buscar el movimiento en entradas y salidas
          const movimientoEntrada = state.entradas.find(
            (m) => m.concepto === concepto
          );
          const movimientoSalida = state.salidas.find(
            (m) => m.concepto === concepto
          );

          const seDebeEliminarDetalle =
            (movimientoEntrada && movimientoEntrada.efectivo) ||
            (movimientoSalida && movimientoSalida.efectivo);

          return {
            entradas: state.entradas.filter((m) => m.concepto !== concepto),
            salidas: state.salidas.filter((m) => m.concepto !== concepto),
            detalleEfectivo: seDebeEliminarDetalle ? {} : state.detalleEfectivoState,
          };
        }),

      setDetalleEfectivo: (detalle) =>
        set(() => ({
          detalleEfectivoState: detalle,
        })),

      estadoCaja: () => {
        const totalEntradas = get().entradas.reduce(
          (acc, m) => acc + m.monto,
          0
        );
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
    }),
    {
      name: "caja-storage",
    }
  )
);
