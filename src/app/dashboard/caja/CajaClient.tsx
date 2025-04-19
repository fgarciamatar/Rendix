"use client";

import { useCajaStore } from "@/app/stores/useCajaStore";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

//REACT ICON
import { AiTwotoneDelete } from "react-icons/ai";
import { BsCurrencyDollar } from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";
import { LuSave } from "react-icons/lu";

//MODAL
import ConfirmacionMovimientoModal from "../../components/Caja/ConfirmacionMovimientoModal/ConfirmacionMovimientoModal";
import EfectivoModal from "../../components/Caja/EfectivoModal";
import NuevoMovimientoModal from "../../components/Caja/NuevoMovimientoModal";
import LimpiarModal from "./../../components/Caja/EliminarMovimientoModal";

const PDFButtonClient = dynamic(
  () => import("../../components/Caja/PDFButtonClient/PDFButtonClient"),
  { ssr: false }
);

export default function CajaClient() {
  //ESTADO GLOBAL
  const agregarMovimiento = useCajaStore((state) => state.agregarMovimiento);
  const entradas = useCajaStore((state) => state.entradas);
  const salidas = useCajaStore((state) => state.salidas);
  const detalleEfectivoState = useCajaStore(
    (state) => state.detalleEfectivoState
  );
  const LimpiarPlanilla = useCajaStore((state) => state.LimpiarPlanilla);
  const estadoCajaStateGlobal = useCajaStore((state) => state.estadoCaja);
  const estadoDeCaja = estadoCajaStateGlobal();

  //ESTADO LOCAL
  const [fechaActual, setFechaActual] = useState("");
  const [turno, setTurno] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEfectivo, setModalEfectivo] = useState(false);
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [modalLimpiarConfirmacion, setModalLimpiarConfirmacion] =
    useState(false);
  const [mostrarBotonPDF, setMostrarBotonPDF] = useState(false);

  //FUNCTIONS
  const handleGuardarMovimiento = (data: {
    concepto: string;
    monto: number;
    tipoMovimiento: "Entrada" | "Salida";
    tipoConcepto: "Efectivo" | "Venta" | "Movimiento";
    detalleEfectivo: boolean;
  }) => {
    //concepto, monto, tipoMovimiento, tipoConcepto, detalleEfectivo
    agregarMovimiento(
      data.concepto,
      data.monto,
      data.tipoMovimiento,
      data.tipoConcepto,
      data.detalleEfectivo
    );
    setModalConfirmacion(true);
  };

  const handleGuardar = () => {
    setMostrarBotonPDF(true); // Ahora se muestra el botón de PDF
  };
  const handleLimpiarPlanilla = () => {
    setModalLimpiarConfirmacion(true);
  };
  //USEEFECTS
  useEffect(() => {
    const ahora = new Date();
    const hora = ahora.getHours();
    const minutos = ahora.getMinutes();

    // Formatear fecha en formato YYYY-MM-DD
    const fechaFormateada = ahora.toISOString().split("T")[0];
    setFechaActual(fechaFormateada);

    // Calcular turno
    const tiempo = hora + minutos / 60;
    if (tiempo >= 7 && tiempo < 16.5) {
      setTurno("Mañana");
    } else if (tiempo >= 16.5 && tiempo < 22) {
      setTurno("Tarde");
    } else {
      setTurno("Noche");
    }
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
          <span className="text-white text-base md:text-lg">
            Turno: <strong>{turno}</strong>
          </span>
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
          style={{ backgroundColor: "#3D9970" }}
          className="flex items-center justify-center gap-2 hover:brightness-110 text-white px-5 py-3 text-base md:text-lg rounded-lg shadow w-full md:w-auto"
        >
          <BsCurrencyDollar size={22} /> Agregar Efectivo (Ctrl + Q)
        </button>
        <button
          onClick={handleGuardar}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-3 rounded-lg shadow flex gap-2 items-center"
        >
          <LuSave size={22} />
          Guardar
        </button>
        {mostrarBotonPDF && (
          <PDFButtonClient
            fecha={fechaActual}
            turno={turno}
            entradas={entradas}
            salidas={salidas}
            detalleEfectivo={detalleEfectivoState}
            estadoCaja={estadoDeCaja}
            onDownloaded={() => setMostrarBotonPDF(false)}
          />
        )}
        <button
          onClick={handleLimpiarPlanilla}
          className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-3 rounded-lg shadow flex gap-2 items-center"
        >
          <AiTwotoneDelete size={22} />
          Limpiar Planilla
        </button>
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

      <LimpiarModal
        isOpen={modalLimpiarConfirmacion}
        onClose={() => setModalLimpiarConfirmacion(false)}
        onConfirm={() => {
          LimpiarPlanilla();
        }}
        mensaje="¿Estás seguro que querés limpiar la Planilla? Esta acción no se puede deshacer."
        botonConfirmar="Limpiar"
      />
    </>
  );
}
