"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { FiDownload } from "react-icons/fi";
import { useCajaStore } from "../../../stores/useCajaStore";
import PDFReport from "../PDFReport";

export default function PDFButtonClient() {
  const entradas = useCajaStore((state) => state.entradas);
  const salidas = useCajaStore((state) => state.salidas);
  const detalleEfectivo = useCajaStore((state) => state.detalleEfectivo);

  const hayEntradas = entradas.length > 0;
  const haySalidas = salidas.length > 0;
  const hayEfectivo = Object.keys(detalleEfectivo).length > 0;

  // No se muestra el botón si no hay datos
  if (!hayEntradas && !haySalidas && !hayEfectivo) return null;

  return (
    <PDFDownloadLink
      document={
        <PDFReport
          entradas={entradas}
          salidas={salidas}
          detalleEfectivo={detalleEfectivo}
        />
      }
      fileName="Planilla_Caja.pdf"
    >
      {({ loading }) => (
        <button className="flex items-center gap-3 bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 text-lg rounded-lg shadow w-full md:w-auto">
          <FiDownload size={24} />
          {loading ? "Generando PDF..." : "Exportar a PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
}
