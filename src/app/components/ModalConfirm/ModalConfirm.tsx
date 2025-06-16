
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalConfirmacionProps {
  mensaje: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

const ModalConfirmacion: React.FC<ModalConfirmacionProps> = ({
  mensaje,
  onConfirmar,
  onCancelar,
}) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gradient-to-b from-[#1e469d] to-[#122b70] rounded-2xl shadow-lg p-6 w-full max-w-sm text-center text-white"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-lg font-medium mb-6">{mensaje}</p>
          <div className="flex justify-between gap-4">
            <button
              onClick={onCancelar}
              className="w-full py-2 px-4 bg-white/20 text-white rounded-xl hover:bg-white/30 transition"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirmar}
              className="w-full py-2 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
            >
              Confirmar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalConfirmacion;
