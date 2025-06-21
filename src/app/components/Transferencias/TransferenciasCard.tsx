"use client";
import { useCajaStore } from "@/app/stores/useCajaStore";
import { useTransferenciasStore } from "@/app/stores/useTransferenciasStore";
import React, { useEffect, useState } from "react";
import { Filtro, mapFiltroToEstado } from "../../utils/useHelpers";
import ModalConfirmacion from "../ModalConfirm/ModalConfirm";
import TransferenciaFilters from "./FiltersTransferencias";
import TransferenciaTable from "./TableTransferencias";

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

export const TransferenciasCard: React.FC = () => {
  const [filtro, setFiltro] = useState<Filtro>("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState<string | null>(null);
  const [salesmanFiltro, setSalesmanFiltro] = useState<string | null>(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [transferenciaSeleccionada, setTransferenciaSeleccionada] =
    useState<Transferencia | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const allTransfer = useTransferenciasStore((state) => state.allTransfer);
  const transferLoading = useTransferenciasStore(
    (state) => state.transferLoading
  );
  const setTransferLoading = useTransferenciasStore(
    (state) => state.setTransferLoading
  );
  const getAllTransfer = useTransferenciasStore(
    (state) => state.getAllTransfer
  );
  const changeStateTransfer = useTransferenciasStore(
    (state) => state.changeStateTransfer
  );
  const agregarMovimiento = useCajaStore((state) => state.agregarMovimiento);

  useEffect(() => {
    if (currentPage === 0) getAllTransfer();
    setCurrentPage(1);
  }, [currentPage]);

  useEffect(() => {
    if (transferLoading !== 0) getAllTransfer();
    setTransferLoading();
  }, [transferLoading]);

  const cambiardeEstadoTransferencia = async (id: number, estado: string) => {
    setCurrentPage(0);
    await changeStateTransfer(id, estado);
    getAllTransfer();
  };

  const filtrarDatos = () => {
    const estadoFiltro = mapFiltroToEstado(filtro);
    return (
      allTransfer?.filter((t) => {
        const matchFiltro = !estadoFiltro || t.status === estadoFiltro;
        const matchSearch =
          t.id.toString().includes(busqueda.toLowerCase()) ||
          t.clientName.toLowerCase().includes(busqueda.toLowerCase()) ||
          t.salesman.toLowerCase().includes(busqueda.toLowerCase()) ||
          t.amount.toString().includes(busqueda.toLowerCase());

        const matchFecha =
          !fechaFiltro || t.dateTransfer?.startsWith(fechaFiltro);
        const matchSalesman = !salesmanFiltro || t.salesman === salesmanFiltro;

        return matchFiltro && matchSearch && matchFecha && matchSalesman;
      }) ?? []
    );
  };

  const tabs: Filtro[] = [
    "Todas",
    "Pendientes",
    "En Revisión",
    "Aprobadas",
    "Rechazadas",
  ];

  return (
    <div className="bg-gray-800 rounded-2xl p-2 sm:p-6">
      <button
        onClick={() => window.location.reload()}
        className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition"
      >
        Actualizar
      </button>

      <nav className="flex flex-wrap justify-center sm:justify-start gap-2 mb-6 w-full">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFiltro(tab)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition ${
              filtro === tab
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <TransferenciaFilters
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        mostrarFiltros={mostrarFiltros}
        setMostrarFiltros={setMostrarFiltros}
        fechaFiltro={fechaFiltro}
        setFechaFiltro={setFechaFiltro}
        salesmanFiltro={salesmanFiltro}
        setSalesmanFiltro={setSalesmanFiltro}
      />

      <div className="overflow-x-auto mt-4">
        <TransferenciaTable
          transferencias={filtrarDatos()}
          onReviewClick={(t) => {
            setTransferenciaSeleccionada(t);
            setShowModal(true);
          }}
          onChangeEstado={cambiardeEstadoTransferencia}
        />
      </div>

      {showModal && transferenciaSeleccionada !== null && (
        <ModalConfirmacion
          mensaje="¿Desea pasar a revisión?"
          onConfirmar={async () => {
            setShowModal(false);
            setTransferenciaSeleccionada(null);
            await cambiardeEstadoTransferencia(
              transferenciaSeleccionada.id,
              "review"
            );

            agregarMovimiento(
              `Transferencia ${transferenciaSeleccionada.salesman} ${transferenciaSeleccionada.clientName}`,
              Number(transferenciaSeleccionada.amount),
              "Salida",
              "Movimiento",
              false
            );
          }}
          onCancelar={() => {
            setShowModal(false);
            setTransferenciaSeleccionada(null);
          }}
        />
      )}
    </div>
  );
};
