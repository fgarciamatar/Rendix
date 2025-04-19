import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mensaje: string;
  botonConfirmar: string;
}

const EliminarMovimientoModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  mensaje,
  botonConfirmar
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
      <div className="bg-gray-900 text-white p-6 rounded-lg w-full max-w-sm shadow-xl">
        <h2 className="text-xl font-bold mb-4">Eliminar Movimiento</h2>
        <p className="text-sm text-gray-400 mb-6">{mensaje}</p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-500 transition"
          >
            {botonConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EliminarMovimientoModal;
