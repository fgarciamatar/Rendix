// stores/useCajaStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Movimiento {
  id: string;
  concepto: string;
  monto: number;
  tipoMovimiento: "Entrada" | "Salida";
  tipoConcepto: "Efectivo" | "Venta" | "Movimiento";
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
  ventaMañanaSistema: number;
  ventaMañanaCaja: number;
  ventaTardeCaja: number;
  agregarMovimiento: (
    concepto: string,
    monto: number,
    tipoMovimiento: "Entrada" | "Salida",
    tipoConcepto: "Efectivo" | "Venta" | "Movimiento",
    detalleEfectivo: boolean
  ) => void;
  EliminarMovimiento1: (concepto: string) => void;
  setDetalleEfectivoState: (detalle: Record<string, number>) => void;
  estadoCaja: () => EstadoCaja;
  LimpiarPlanilla: () => void;
  RegistrarVentaMañana: (monto: number) => void;
  SetVentaCaja: (turno: string, monto:number) => void;
}

export const useCajaStore = create(
  persist<CajaState>(
    (set, get) => ({
      //estados globales
      entradas: [],
      salidas: [],
      detalleEfectivoState: {},
      ventaMañanaSistema: 0,
      ventaMañanaCaja: 0,
      ventaTardeCaja: 0,
      //funciones globales
      agregarMovimiento: (
        concepto,
        monto,
        tipoMovimiento,
        tipoConcepto,
        detalleEfectivo
      ) => {
        const nuevoMovimiento: Movimiento = {
          id: crypto.randomUUID(),
          concepto,
          monto,
          tipoMovimiento,
          tipoConcepto,
          detalleEfectivo,
        };

        return set((state) => {
          if (tipoMovimiento === "Entrada") {
            return { entradas: [...state.entradas, nuevoMovimiento] };
          } else {
            return { salidas: [...state.salidas, nuevoMovimiento] };
          }
        });
      },

      EliminarMovimiento1: (id) =>
        set((state) => {
          // Buscar el movimiento en entradas y salidas
          const movimientoEntrada = state.entradas.find((m) => m.id === id);
          const movimientoSalida = state.salidas.find((m) => m.id === id);

          const seDebeEliminarDetalle =
            (movimientoEntrada &&
              movimientoEntrada.tipoConcepto === "Efectivo") ||
            (movimientoSalida && movimientoSalida.tipoConcepto === "Efectivo");

          return {
            entradas: state.entradas.filter((m) => m.id !== id),
            salidas: state.salidas.filter((m) => m.id !== id),
            detalleEfectivoState: seDebeEliminarDetalle
              ? {}
              : state.detalleEfectivoState,
          };
        }),

      setDetalleEfectivoState: (detalle) =>
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
      RegistrarVentaMañana: (monto: number) => {
        return set(() => ({
          ventaMañanaSistema: monto,
        }));
      },
      SetVentaCaja: (turno: string, monto:number) => {
        if (turno === "Mañana") {
          return set(() => ({
            ventaMañanaCaja: monto,
          }));
        }else if (turno==="Tarde") {
          return set(() => ({
            ventaTardeCaja: monto,
          }));
        }
      },
      LimpiarPlanilla: () =>
        set(() => {
          return {
            entradas: [],
            salidas: [],
            detalleEfectivoState: {},
          };
        }),
    }),
    {
      name: "caja-storage",
    }
  )
);
