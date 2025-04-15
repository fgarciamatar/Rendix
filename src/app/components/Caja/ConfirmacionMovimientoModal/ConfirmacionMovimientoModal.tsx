"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsCheckCircle } from "react-icons/bs";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mensaje?: string;
}

const ConfirmacionModal: React.FC<Props> = ({ isOpen, onClose, mensaje }) => {
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 700); // auto-cierre en 2s

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 text-white px-6 py-4 rounded-xl shadow-lg flex flex-col items-center gap-3 max-w-xs text-center"
          >
            <BsCheckCircle size={48} className="text-green-400" />
            <h3 className="text-lg font-semibold">
              {mensaje || "Movimiento guardado correctamente"}
            </h3>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmacionModal;
