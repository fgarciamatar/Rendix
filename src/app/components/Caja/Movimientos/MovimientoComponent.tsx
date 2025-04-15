// MovimientoComponent.tsx
"use client";

import { useState } from "react";
import { movimientosProps } from "./types";
import { useCajaStore } from "../../../stores/useCajaStore";
import ConfirmacionMovimientoModal from "./../EliminarMovimientoModal";

//Icons
import { LiaMoneyBillWaveAltSolid } from "react-icons/lia";
import { RiDeleteBinLine } from "react-icons/ri";
// import { GiSwapBag } from "react-icons/gi";  // icono para  la venta

export default function MovimientoComponent({
  titulo,
  descripcion,
  esEntrada,
}: movimientosProps) {
  const [eliminarModal, setEliminarModal] = useState(false);
  const [conceptoSeleccionado, setConceptoSeleccionado] = useState<
    string | null
  >(null);

  const eliminarMovimiento = useCajaStore((state) => state.EliminarMovimiento1);

  const movimientos = useCajaStore((state) =>
    esEntrada ? state.entradas : state.salidas
  );

  const total = movimientos.reduce(
    (acc, mov) => acc + (typeof mov.monto === "number" ? mov.monto : 0),
    0
  );

  return (
    <div className="border border-gray-500 p-6 rounded-xl bg-transparent w-full">
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold">{titulo}</h1>
        <p className="text-gray-400 text-lg">{descripcion}</p>
      </div>

      {/* Columnas */}
      <div className="grid grid-cols-3 font-bold text-lg border-b border-gray-600 pb-3 mb-3">
        <h3 className="pl-2">Concepto</h3>
        <h3 className="text-center">Monto</h3>
        <h3 className="text-center">Acciones</h3>
      </div>

      {/* Movimientos */}
      <div className="space-y-3 cursor-pointer">
        {movimientos.map((mov, index) => (
          <div
            key={index}
            className="grid grid-cols-3 items-center gap-2 border-b border-gray-700 py-3 hover:bg-gray-800 transition rounded-md text-lg min-h-[56px]"
          >
            <p className="pl-2 flex items-center gap-2">
              {mov.detalleEfectivo && (
                <LiaMoneyBillWaveAltSolid  size={28} className="text-green-400" />
              )}
              {mov.concepto}
            </p>

            <p className="text-center">
              {typeof mov.monto === "number"
                ? `$${mov.monto.toLocaleString("es-AR")}`
                : "$—"}
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setConceptoSeleccionado(mov.concepto);
                  setEliminarModal(true);
                }}
                className="text-red-500 hover:text-red-400 transition-transform transform hover:scale-125 cursor-pointer"
              >
                <RiDeleteBinLine size={23} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-6 text-center md:text-right">
        <h2 className="text-3xl font-black">
          Total:{" "}
          <span className={esEntrada ? "text-green-400" : "text-red-400"}>
            ${total.toLocaleString("es-AR")}
          </span>
        </h2>
      </div>

      {/* Modal de confirmación */}
      <ConfirmacionMovimientoModal
        isOpen={eliminarModal}
        onClose={() => setEliminarModal(false)}
        onConfirm={() => {
          if (conceptoSeleccionado) eliminarMovimiento(conceptoSeleccionado);
          setEliminarModal(false);
        }}
      />
    </div>
  );
}
