"use client";
import { useCajaStore } from "@/app/stores/useCajaStore";
import React, { useState } from "react";
import { CiCircleCheck, CiReceipt } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import { useLoginStore } from "../../stores/userLoginStore";
import { traducirEstado } from "../../utils/useHelpers";
import ComprobanteModal from "./ComprobanteModal";

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
  transferencias: Transferencia[];
  onReviewClick: (id: number) => void;
  onChangeEstado: (id: number, estado: string) => void;
}

const TransferenciaTable: React.FC<Props> = ({
  transferencias,
  onReviewClick,
  onChangeEstado,
}) => {
  const agregarMovimiento = useCajaStore((state) => state.agregarMovimiento);
  const [currentPage, setCurrentPage] = useState(1);
  const [transferenciaActual, setTransferenciaActual] =
    useState<Transferencia | null>(null);
  const itemsPerPage = 10;
  const { role, name } = useLoginStore((state) => state.userData);

  const transferenciasFiltradas =
    role === "salesman"
      ? transferencias.filter((t) => t.salesman === name)
      : transferencias;

  const totalPages = Math.ceil(transferenciasFiltradas.length / itemsPerPage);
  const paginatedData = transferenciasFiltradas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderAcciones = (t: Transferencia, estado: string) => (
    <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-1 sm:gap-2 mt-2 sm:mt-0">
      {role !== "salesman" &&
        estado === "pending" &&
        (role === "admin" || role === "cashier") && (
          <button
            onClick={() => {
              console.log(t.amount);
              onReviewClick(t.id);
              agregarMovimiento(
                `Transferencia ${t.salesman} ${t.clientName}`,
                Number(t.amount), // 👈 conversión explícita
                "Salida",
                "Movimiento",
                false
              );
            }}
            className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-xs sm:text-base font-semibold rounded-md"
          >
            <FiSearch className="w-4 h-4 sm:w-5 sm:h-5" />
            Revisar
          </button>
        )}

      {role === "admin" && estado === "review" && (
        <>
          <button
            onClick={() => onChangeEstado(t.id, "approved")}
            className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-2 bg-green-700 hover:bg-green-500 text-white text-xs sm:text-base font-semibold rounded-md"
          >
            <CiCircleCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            Aprobar
          </button>
          <button
            onClick={() => onChangeEstado(t.id, "rejected")}
            className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-2 bg-red-700 hover:bg-red-500 text-white text-xs sm:text-base font-semibold rounded-md"
          >
            <MdOutlineCancel className="w-4 h-4 sm:w-5 sm:h-5" />
            Rechazar
          </button>
        </>
      )}

      <button
        onClick={() => setTransferenciaActual(t)}
        className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-2 bg-gray-500 hover:bg-gray-700 text-white text-xs sm:text-base font-semibold rounded-md"
      >
        <CiReceipt className="w-4 h-4 sm:w-5 sm:h-5" />
        Ver Comprobante
      </button>
    </div>
  );

  return (
    <div className="px-1 sm:px-4">
      {/* Tabla para pantallas grandes */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left table-auto border-separate border-spacing-y-2 min-w-full">
          <thead className="bg-gray-800 text-gray-300">
            <tr className="text-center text-xs sm:text-sm">
              <th className="px-1 py-1">ID</th>
              <th className="px-1 py-1">Monto</th>
              <th className="px-1 py-1">Fecha Transferencia</th>
              <th className="px-1 py-1">Cliente</th>
              {role !== "salesman" && (
                <th className="px-1 py-1">Preventista</th>
              )}
              <th className="px-1 py-1">Banco Destino</th>
              <th className="px-1 py-1">Estado</th>
              <th className="px-1 py-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((t) => {
              const estado = t.status.toLowerCase();
              const bgColor =
                estado === "pending"
                  ? "bg-blue-900"
                  : estado === "review"
                  ? "bg-yellow-700"
                  : estado === "approved"
                  ? "bg-green-900"
                  : estado === "rejected"
                  ? "bg-red-900"
                  : "bg-gray-900";

              const badgeStyle =
                estado === "pending"
                  ? "bg-blue-500 text-white"
                  : estado === "review"
                  ? "bg-yellow-500 text-white"
                  : estado === "approved"
                  ? "bg-green-700 text-white"
                  : estado === "rejected"
                  ? "bg-red-500 text-white"
                  : "";

              return (
                <tr
                  key={`table-${t.id}`}
                  className={`${bgColor} hover:bg-gray-600 transition text-center rounded-lg text-xs sm:text-sm`}
                >
                  <td className="px-1 py-1">{t.id}</td>
                  <td className="px-1 py-1">${t.amount.toLocaleString()}</td>
                  <td className="px-1 py-1">{t.dateTransfer}</td>
                  <td className="px-1 py-1">{t.clientName}</td>
                  {role !== "salesman" && (
                    <td className="px-1 py-1">{t.salesman}</td>
                  )}
                  <td className="px-1 py-1">{t.destinationBank}</td>
                  <td className="px-1 py-1">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-[10px] sm:text-sm font-semibold rounded-full ${badgeStyle}`}
                    >
                      {traducirEstado(estado)}
                    </span>
                  </td>
                  <td className="px-1 py-1">{renderAcciones(t, estado)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cards para mobile */}
      <div className="sm:hidden flex flex-col gap-4 mt-4">
        {paginatedData.map((t) => {
          const estado = t.status.toLowerCase();

          const bgColor =
            estado === "pending"
              ? "bg-blue-900"
              : estado === "review"
              ? "bg-yellow-700"
              : estado === "approved"
              ? "bg-green-900"
              : estado === "rejected"
              ? "bg-red-900"
              : "bg-gray-800";

          const badgeStyle =
            estado === "pending"
              ? "bg-blue-500 text-white"
              : estado === "review"
              ? "bg-yellow-500 text-white"
              : estado === "approved"
              ? "bg-green-700 text-white"
              : estado === "rejected"
              ? "bg-red-500 text-white"
              : "";

          return (
            <div
              key={`card-${t.id}`}
              className={`w-[280px] mx-auto p-3 rounded-xl shadow-md text-xs text-gray-200 flex flex-col gap-2 items-center text-center ${bgColor}`}
            >
              <div>
                <strong>Cliente:</strong> {t.clientNumber}
                {" - "}
                <strong>{t.clientName}</strong>
              </div>
              <div>
                <strong>Fecha de Carga:</strong> {t.dateOfLoading}
              </div>
              <div className="text-lg font-bold text-white">
                ${t.amount.toLocaleString()}
              </div>
              <div>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-white ${badgeStyle}`}
                >
                  {traducirEstado(estado)}
                </span>
              </div>
              {renderAcciones(t, estado)}
            </div>
          );
        })}
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-30"
        >
          {"<"}
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-transparent text-gray-300 hover:bg-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-30"
        >
          {">"}
        </button>
      </div>

      {/* Modal */}
      {transferenciaActual && (
        <ComprobanteModal
          transferencia={transferenciaActual}
          onClose={() => setTransferenciaActual(null)}
        />
      )}
    </div>
  );
};

export default TransferenciaTable;
