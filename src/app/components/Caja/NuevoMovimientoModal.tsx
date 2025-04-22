"use client";
import React, { useEffect, useRef, useState, useCallback  } from "react";
import { TbMoneybag } from "react-icons/tb";
import { useCajaStore } from "@/app/stores/useCajaStore";
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
 

const NuevoMovimientoModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState<number | string>("");
  const [tipoMovimiento, setTipoMovimiento] = useState("Salida");
  const [tipoConcepto, setTipoConcepto] = useState<
    "Efectivo" | "Venta" | "Movimiento"
  >("Movimiento");
 const [detalleEfectivo, setDetalleEfectivo] = useState(false);
   const [modalConfirmacion, setModalConfirmacion] = useState(false);

 const entradas = useCajaStore((state) => state.entradas);
const salidas = useCajaStore((state) => state.salidas);

const hayVenta = [...entradas, ...salidas].some(
  (mov) => mov.tipoConcepto === "Venta"
);

  const conceptoRef = useRef<HTMLInputElement>(null);
  const montoRef = useRef<HTMLInputElement>(null);
  const guardarRef = useRef<HTMLButtonElement>(null);
  console.log("tipoMOv",tipoMovimiento , tipoConcepto);
  

  // Resetear campos al cerrar modal


  const handleClose = useCallback(() => {
    setTipoMovimiento("Salida");
    setConcepto("");
    setMonto("");
    setDetalleEfectivo(false);
    setTipoConcepto("Movimiento");
    onClose();
  }, [onClose]);


  const handleSave = () => {
    if (!concepto || !monto) return;
    if (tipoMovimiento === "Entrada" || tipoMovimiento === "Salida") {
      setDetalleEfectivo(false);
      onSave?.({
        concepto,
        monto: Number(monto),
        tipoMovimiento: tipoMovimiento,
        tipoConcepto: tipoConcepto, 
        detalleEfectivo,
      });
    }

    handleClose();
  };

  const handleKeyDown = <T extends HTMLElement>(
    e: React.KeyboardEvent,
    next: React.RefObject<T> | (() => void)
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (typeof next === "function") {
        next();
      } else if (next?.current) {
        next.current.focus();
      }
    }
  };
  const handleAgregarVenta = () => {
   setTipoConcepto("Venta")
    setModalConfirmacion(true);
  };

  // Cerrar con Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      conceptoRef.current?.focus();
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [handleClose, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
      <div className="bg-gray-900 text-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-2">Nuevo Movimiento de Caja</h2>
        <p className="text-sm text-gray-400 mb-4">
          Ingrese los detalles del nuevo movimiento.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block mb-1">Tipo</label>
            <select
              className="w-full px-3 py-2 bg-gray-800 text-white rounded"
              value={tipoMovimiento}
              onChange={(e) =>
                setTipoMovimiento(e.target.value as "Entrada" | "Salida")
              }
            >
              <option value="Entrada">Entrada</option>
              <option value="Salida">Salida</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Concepto</label>
            <input
              ref={conceptoRef}
              type="text"
              className="w-full px-3 py-2 bg-gray-800 text-white rounded"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              onKeyDown={(e) =>
                handleKeyDown(e, montoRef as React.RefObject<HTMLElement>)
              }
            />
          </div>
          <div>
            <label className="block mb-1">Monto</label>
            <input
              ref={montoRef}
              type="number"
              className="w-full px-3 py-2 bg-gray-800 text-white rounded"
              value={monto}
              onChange={(e) => {
                const sanitized = e.target.value.replace(/[.,]/g, "");
                setMonto(sanitized);
              }}
              onKeyDown={(e) => {
                // Bloquear "." y ","
                if (e.key === "." || e.key === ",") {
                  e.preventDefault();
                } else {
                  handleKeyDown(e, guardarRef as React.RefObject<HTMLElement>);
                }
              }}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-2">
           <div className="flex flex-col items-end space-y-1">
                          <button
                            onClick={handleAgregarVenta}
                            disabled={hayVenta}
                            className={`flex items-center gap-2 px-4 py-2 rounded transition ${
                              hayVenta
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-gray-700 hover:bg-gray-600"
                            }`}
                          >
                            <TbMoneybag 
                              size={22}
                              className="text-green-400"
                            />
                            <span className="text-sm">Agregar Total de Venta</span>
                          </button>
          
                          {hayVenta && (
                            <span className="text-xs text-red-400">
                              Ya se ha agregado una venta.
                            </span>
                          )}
                        </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
          <button
            ref={guardarRef}
            onClick={handleSave}
            className="px-4 py-2 bg-white text-gray-900 rounded font-semibold hover:bg-gray-200 transition"
          >
            Guardar
          </button>
        </div>
      </div>
      
      <ConfirmacionMovimientoModal
        key="confirmacion-modal"
        isOpen={modalConfirmacion}
        onClose={() => setModalConfirmacion(false)}
        mensaje="Venta guardada correctamente"
      />
    </div>
    
  );
};

export default NuevoMovimientoModal;
