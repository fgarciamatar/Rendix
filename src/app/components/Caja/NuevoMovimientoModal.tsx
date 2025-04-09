import React, { useRef, useState, useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { tipo: "Entrada" | "Salida"; concepto: string; monto: number }) => void;
}

const NuevoMovimientoModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [tipo, setTipo] = useState("Salida");
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState<number | string>("");

  const conceptoRef = useRef<HTMLInputElement>(null);
  const montoRef = useRef<HTMLInputElement>(null);
  const guardarRef = useRef<HTMLButtonElement>(null);

   // Resetear campos al cerrar modal
   const handleClose = () => {
    setTipo("Salida");
    setConcepto("");
    setMonto("");
    onClose();
  };

  const handleSave = () => {
    if (!concepto || !monto) return;
    if (tipo === "Entrada" || tipo === "Salida") {
      onSave?.({
        tipo,
        concepto,
        monto: Number(monto),
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
  }, [isOpen]);

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
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, conceptoRef as React.RefObject<HTMLElement>)}
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
              onKeyDown={(e) => handleKeyDown(e, montoRef as React.RefObject<HTMLElement>)}
            />
          </div>
          <div>
            <label className="block mb-1">Monto</label>
            <input
              ref={montoRef}
              type="number"
              className="w-full px-3 py-2 bg-gray-800 text-white rounded"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, guardarRef as React.RefObject<HTMLElement>)}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-2">
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
    </div>
  );
};

export default NuevoMovimientoModal;
