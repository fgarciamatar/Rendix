"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

import { useCajaStore } from "@/app/stores/useCajaStore";
import { LiaMoneyBillWaveAltSolid } from "react-icons/lia";
import ConfirmacionMovimientoModal from "./ConfirmacionMovimientoModal/ConfirmacionMovimientoModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    concepto: string;
    monto: number;
    tipoMovimiento: "Entrada" | "Salida";
    tipoConcepto: "Efectivo" | "Venta" | "Movimiento";
    detalleEfectivo: boolean;
  }) => void;
}

const denominaciones = [20000, 10000, 2000, 1000, 500, 200, 100, 50, 20, 10];

const EfectivoModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [concepto, setConcepto] = useState("");
  const [cantidades, setCantidades] = useState<{ [key: number]: number }>({});
  const [tipoMovimiento, setTipoMovimiento] = useState("Salida");
  const [tipoConcepto, setTipoConcepto] = useState<
    "Efectivo" | "Venta" | "Movimiento"
  >("Efectivo");
  const [detalleEfectivo, setDetalleEfectivo] = useState(false);
  const [modalConfirmacion, setModalConfirmacion] = useState(false);

  const entradas = useCajaStore((state) => state.entradas);
  const salidas = useCajaStore((state) => state.salidas);
  const setDetalleEfectivoState = useCajaStore((state) => state.setDetalleEfectivoState);
  const existeDetalleEfectivo =
    entradas.some((mov) => mov.detalleEfectivo) ||
    salidas.some((mov) => mov.detalleEfectivo);

  const conceptoRef = useRef<HTMLInputElement>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);



  const handleCantidadChange = (denominacion: number, valor: string) => {
    const cantidad = parseInt(valor) || 0;
    setCantidades((prev) => ({ ...prev, [denominacion]: cantidad }));
  };

  const totalPorDenominacion = (den: number) => (cantidades[den] || 0) * den;
  const totalGeneral = denominaciones.reduce(
    (sum, den) => sum + totalPorDenominacion(den),
    0
  );

  const handleClose = () => {
    onClose();
    setConcepto("");
    setCantidades({});
    setTipoMovimiento("Salida");
    setTipoConcepto("Efectivo");
    setDetalleEfectivo(false);
  };

  const handleSave = () => {
    if (!concepto || totalGeneral === 0) return;
    if (tipoMovimiento === "Entrada" || tipoMovimiento === "Salida") {
      setTipoConcepto("Efectivo");
      onSave?.({
        concepto,
        monto: Number(totalGeneral),
        tipoMovimiento: tipoMovimiento,
        tipoConcepto: tipoConcepto,
        detalleEfectivo,
      });
    }
    handleClose();
  };

  const handleAgregarADetalle = () => {
    setDetalleEfectivoState(cantidades);
    setDetalleEfectivo(true);
    setModalConfirmacion(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index < denominaciones.length - 1) {
        inputRefs.current[index + 1]?.focus();
      } else {
        handleSave();
      }
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      conceptoRef.current?.focus();
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleClose, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="efectivo-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-900 text-white p-6 rounded-lg w-[90%] max-w-xl shadow-xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-2">Conteo de Efectivo</h2>
            <p className="text-sm text-gray-400 mb-4">
              Ingrese la cantidad de billetes por denominación.
            </p>

            <div className="space-y-3">
              <div className="flex flex-col">
                <label className="mb-1 text-sm">Tipo</label>
                <select
                  value={tipoMovimiento}
                  onChange={(e) => setTipoMovimiento(e.target.value)}
                  className="bg-gray-800 text-white px-3 py-2 rounded"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") conceptoRef.current?.focus();
                  }}
                >
                  <option value="Entrada">Entrada</option>
                  <option value="Salida">Salida</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-sm">Concepto</label>
                <input
                  ref={conceptoRef}
                  value={concepto}
                  onChange={(e) => setConcepto(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") inputRefs.current[0]?.focus();
                  }}
                  className="bg-gray-800 text-white px-3 py-2 rounded"
                  placeholder="Ej: Ingreso de efectivo"
                />
              </div>

              <div className="overflow-y-auto max-h-64 border-t border-gray-700 pt-2 pr-2 custom-scroll">
                {denominaciones.map((den, index) => (
                  <div
                    key={`den-${den}-${index}`}
                    className="flex justify-between items-center py-1 text-sm"
                  >
                    <div className="w-1/3">${den.toLocaleString()}</div>
                    <input
                      type="number"
                      min="0"
                      value={cantidades[den] || ""}
                      onChange={(e) =>
                        handleCantidadChange(den, e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      className="w-1/3 bg-gray-800 text-white text-center rounded px-2 py-1"
                    />
                    <div className="w-1/3 text-right">
                      ${totalPorDenominacion(den).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 font-semibold flex justify-between border-t border-gray-700 pt-3 text-lg">
                <span>TOTAL GENERAL:</span>
                <span>${totalGeneral.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-2">
              <div className="flex flex-col items-end space-y-1">
                <button
                  onClick={handleAgregarADetalle}
                  disabled={existeDetalleEfectivo}
                  className={`flex items-center gap-2 px-4 py-2 rounded transition ${
                    existeDetalleEfectivo
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  <LiaMoneyBillWaveAltSolid
                    size={22}
                    className="text-green-400"
                  />
                  <span className="text-sm">Agregar a detalle de efectivo</span>
                </button>

                {existeDetalleEfectivo && (
                  <span className="text-xs text-red-400">
                    Ya se ha agregado un detalle de efectivo.
                  </span>
                )}
              </div>

              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
              >
                Registrar Efectivo
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <ConfirmacionMovimientoModal
        key="confirmacion-modal"
        isOpen={modalConfirmacion}
        onClose={() => setModalConfirmacion(false)}
        mensaje="Detalle de efectivo guardado correctamente"
      />
    </AnimatePresence>
  );
};

export default EfectivoModal;
