"use client";

import { useCajaStore } from "@/app/stores/useCajaStore";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

//REACT ICON
import { BsCurrencyDollar } from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";

//MODAL
import ConfirmacionMovimientoModal from "../../components/Caja/ConfirmacionMovimientoModal/ConfirmacionMovimientoModal";
import EfectivoModal from "../../components/Caja/EfectivoModal";
import NuevoMovimientoModal from "../../components/Caja/NuevoMovimientoModal";

const PDFButtonClient = dynamic(
  () => import("../../components/Caja/PDFButtonClient/PDFButtonClient"),
  { ssr: false }
);

export default function CajaClient() {
  //ESTADO GLOBAL
  const agregarMovimiento = useCajaStore((state) => state.agregarMovimiento);

  //ESTADO LOCAL
  const [fechaActual, setFechaActual] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEfectivo, setModalEfectivo] = useState(false);
  const [modalConfirmacion, setModalConfirmacion] = useState(false);

  //FUNCTIONS
  const handleGuardarMovimiento = (data: {
    tipo: "Entrada" | "Salida";
    concepto: string;
    monto: number;
  }) => {
    agregarMovimiento(data.concepto, data.monto, data.tipo);
    setModalConfirmacion(true);
  };

  //USEEFECTS
  useEffect(() => {
    const hoy = new Date().toISOString().split("T")[0];
    setFechaActual(hoy);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Abrir modal general con Ctrl + M
      if (event.ctrlKey && event.key.toLowerCase() === "m") {
        event.preventDefault();
        setModalAbierto(true);
      }

      // Abrir modal de efectivo con Ctrl + Q
      if (event.ctrlKey && event.key.toLowerCase() === "q") {
        event.preventDefault();
        setModalEfectivo(true);
      }
    };

    // Agregar el evento al montar
    document.addEventListener("keydown", handleKeyDown);

    // Limpiar el evento al desmontar
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-700 pb-4 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Planilla de Caja</h1>
          <p className="text-gray-300 text-base md:text-lg">
            Gestiona las entradas y salidas de caja.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3">
          <label className="text-gray-300 text-base md:text-lg">
            Fecha de la Planilla:
          </label>
          <input
            type="date"
            value={fechaActual}
            readOnly
            className="bg-gray-800 text-white p-2 md:p-3 text-base md:text-lg rounded-md border border-gray-600"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 w-full">
        <button
          onClick={() => setModalAbierto(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 text-base md:text-lg rounded-lg shadow w-full md:w-auto"
        >
          <CiCirclePlus size={22} /> Nuevo Movimiento (Ctrl + M)
        </button>

        <button
          onClick={() => setModalEfectivo(true)}
          style={{ backgroundColor: "#3D9970" }} // Verde tipo dólar
          className="flex items-center justify-center gap-2 hover:brightness-110 text-white px-5 py-3 text-base md:text-lg rounded-lg shadow w-full md:w-auto"
        >
          <BsCurrencyDollar size={22} /> Agregar Efectivo (Ctrl + Q)
        </button>

        <PDFButtonClient />
      </div>

      <NuevoMovimientoModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSave={handleGuardarMovimiento}
      />

      <EfectivoModal
        isOpen={modalEfectivo}
        onClose={() => setModalEfectivo(false)}
        onSave={handleGuardarMovimiento}
      />

      <ConfirmacionMovimientoModal
        isOpen={modalConfirmacion}
        onClose={() => setModalConfirmacion(false)}
      />
    </>
  );
}
