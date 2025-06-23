import React from "react";
import {
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
  FaHashtag,
  FaIdCard,
  FaMoneyBillWave,
  FaRegClock,
  FaTimes,
  FaUser,
  FaUserTag,
} from "react-icons/fa";

interface Transferencia {
  id: number;
  amount: number;
  numberOperation: number;
  dateTransfer: string;
  dateOfLoading: string;
  clientName: string;
  clientNumber: number;
  salesman: string;
  destinationBank: string;
  originBank: string;
  status: string;
  receiptImage: string;
}

interface Props {
  transferencia: Transferencia | null;
  onClose: () => void;
}

const ComprobanteModal: React.FC<Props> = ({ transferencia, onClose }) => {
  if (!transferencia) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 backdrop-blur-sm bg-black/30">
      <div className="relative w-full max-w-7xl bg-gray-900 text-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-red-500 transition text-3xl z-10"
        >
          <FaTimes />
        </button>

        {/* Imagen con fondo degradado */}
              <div className="bg-gradient-to-b from-[#1e469d] to-[#122b70] text-white p-6 rounded-xl w-full max-w-2xl shadow-lg overflow-y-auto max-h-[90vh]">
          <img
            src={transferencia.receiptImage}
            alt="Comprobante"
            className="max-h-[700px] w-full object-contain rounded-xl"
          />
        </div>

        {/* Detalles con scroll en mobile */}
        <div className="md:w-1/2 p-10 overflow-y-auto max-h-screen text-base flex flex-col gap-5">
          <h2 className="text-3xl font-bold text-blue-400">
            Detalles de la Transferencia
          </h2>

          <div className="flex items-center gap-4 text-lg">
            <FaHashtag className="text-yellow-400" />
            <span>ID Operación: {transferencia.numberOperation}</span>
          </div>
          <div className="flex items-center gap-4 text-lg">
            <FaMoneyBillWave className="text-green-400" />
            <span>Monto: ${transferencia.amount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-4 text-lg">
            <FaUser className="text-blue-300" />
            <span>Cliente: {transferencia.clientName}</span>
          </div>
          <div className="flex items-center gap-4 text-lg">
            <FaIdCard className="text-blue-300" />
            <span>N° Cliente: {transferencia.clientNumber}</span>
          </div>
          <div className="flex items-center gap-4 text-lg">
            <FaUserTag className="text-purple-300" />
            <span>Vendedor: {transferencia.salesman}</span>
          </div>
          <div className="flex items-center gap-4 text-lg">
            <FaBuilding className="text-pink-400" />
            <span>Banco Origen: {transferencia.originBank}</span>
          </div>
          <div className="flex items-center gap-4 text-lg">
            <FaBuilding className="text-pink-400" />
            <span>Banco Destino: {transferencia.destinationBank}</span>
          </div>
          <div className="flex items-center gap-4 text-lg">
            <FaCalendarAlt className="text-orange-400" />
            <span>Fecha de Transferencia: {transferencia.dateTransfer}</span>
          </div>
          <div className="flex items-center gap-4 text-lg">
            <FaRegClock className="text-orange-400" />
            <span>Fecha de Carga: {transferencia.dateOfLoading}</span>
          </div>
          <div className="flex items-center gap-4 text-lg">
            <FaCheckCircle className="text-teal-400" />
            <span>Estado: {transferencia.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprobanteModal;
