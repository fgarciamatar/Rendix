"use client";

import React, { useEffect, useRef, useState } from "react";
import { useCajaStore } from "@/app/stores/useCajaStore";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (venta: number) => void;
  }
  

const RegistarVentaModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [monto, setMonto] = useState<number | string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const registrarVenta = useCajaStore((state) => state.RegistrarVentaMañana);

  const handleClose = () => {
    onClose();
    setMonto("");
  };

  const handleSave = () => {
    if (!monto || isNaN(Number(monto))) return;

    registrarVenta(Number(monto));
    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      inputRef.current?.focus();
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
      <div className="bg-gray-900 text-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">Venta total para mañana:</h2>

        <input
          type="number"
          ref={inputRef}
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-2 mb-4 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Ingresá el monto"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-white text-gray-900 rounded font-semibold hover:bg-gray-200 transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistarVentaModal;
