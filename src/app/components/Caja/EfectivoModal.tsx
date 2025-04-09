import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useCajaStore } from "@/app/stores/useCajaStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { tipo: "Entrada" | "Salida"; concepto: string; monto: number }) => void;
}

const denominaciones = [20000, 10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10];

const NuevoMovimientoModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [tipo, setTipo] = useState("Entrada");
  const [concepto, setConcepto] = useState("");
  const [cantidades, setCantidades] = useState<{ [key: number]: number }>({});
  const conceptoRef = useRef<HTMLInputElement>(null);

  const setDetalleEfectivo = useCajaStore((state) => state.setDetalleEfectivo);

  const handleCantidadChange = (denominacion: number, valor: string) => {
    const cantidad = parseInt(valor) || 0;
    setCantidades((prev) => ({ ...prev, [denominacion]: cantidad }));
  };

  const totalPorDenominacion = (den: number) => (cantidades[den] || 0) * den;
  const totalGeneral = denominaciones.reduce((sum, den) => sum + totalPorDenominacion(den), 0);

  const handleClose = () => {
    setConcepto("");
    setCantidades({});
    onClose();
  };

  const handleSave = () => {
    if (!concepto || totalGeneral === 0) return;
    onSave?.({ tipo: tipo as "Entrada" | "Salida", concepto, monto: totalGeneral });
    setDetalleEfectivo(cantidades)
    handleClose();
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
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
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
            className="bg-gray-900 text-white p-6 rounded-lg w-[90%] max-w-xl shadow-xl max-h-[90vh] overflow-hidden"
          >
            <h2 className="text-2xl font-bold mb-2">Conteo de Efectivo</h2>
            <p className="text-sm text-gray-400 mb-4">
              Ingrese la cantidad de billetes por denominación.
            </p>

            <div className="space-y-3">
              <div className="flex flex-col">
                <label className="mb-1 text-sm">Tipo</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="bg-gray-800 text-white px-3 py-2 rounded"
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
                  className="bg-gray-800 text-white px-3 py-2 rounded"
                  placeholder="Ej: Ingreso de efectivo"
                />
              </div>

              <div className="overflow-y-auto max-h-64 border-t border-gray-700 pt-2 pr-2 custom-scroll">
                {denominaciones.map((den) => (
                  <div key={den} className="flex justify-between items-center py-1 text-sm">
                    <div className="w-1/3">${den.toLocaleString()}</div>
                    <input
                      type="number"
                      min="0"
                      value={cantidades[den] || ""}
                      onChange={(e) => handleCantidadChange(den, e.target.value)}
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
    </AnimatePresence>
  );
};

export default NuevoMovimientoModal;
