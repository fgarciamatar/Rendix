"use client";

import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { TransferenciasCard } from "../../components/Transferencias/TransferenciasCard";
import { NuevaTransferenciaModal } from "../../components/Transferencias/NuevaTransferenciaModal";

export const Transferencias: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="px-0 sm:px-6 py-4 text-gray-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 px-4 sm:px-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Transferencias</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Gestiona y visualiza todas las transferencias del sistema.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm sm:text-base"
        >
          <FiPlus className="w-5 h-5 mr-1" /> Nueva Transferencia
        </button>
      </div>

      <TransferenciasCard />

      {showModal && <NuevaTransferenciaModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Transferencias;
