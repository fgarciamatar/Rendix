"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { FiDownload } from "react-icons/fi";
import PDFReport from "../PDFReport";
import { useState } from "react";

interface Movimiento {
  id: string;
  concepto: string;
  monto: number;
  tipoMovimiento: "Entrada" | "Salida";
  tipoConcepto: "Efectivo" | "Venta" | "Movimiento";
  detalleEfectivo: boolean;
}
type EstadoCaja = {
  total: number;
  estado: "balanceado" | "faltante" | "sobrante";
  totalEntradas: number;
  totalSalidas: number;
};

type PDFProps = {
  fecha: string;
  turno: string;
  entradas: Movimiento[];
  salidas: Movimiento[];
  detalleEfectivo: Record<string, number>;
  estadoCaja: EstadoCaja;
  onDownloaded?: () => void; // ✨ NUEVO CALLBACK
};

export default function PDFButtonClient({
  fecha,
  turno,
  entradas,
  salidas,
  detalleEfectivo,
  estadoCaja,
  onDownloaded,
}: PDFProps) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (!clicked) {
      setClicked(true);
      // Esperamos un momento para permitir la descarga
      setTimeout(() => {
        if (onDownloaded) onDownloaded();
      }, 1000); // 1 segundo para evitar cortes en la descarga
    }
  };

  return (
    <PDFDownloadLink
      document={
        <PDFReport
          entradas={entradas}
          salidas={salidas}
          detalleEfectivo={detalleEfectivo}
          fecha={fecha}
          turno={turno}
          estadoCaja={estadoCaja}
        />
      }
      fileName={`Caja[${fecha}]-[${turno}].pdf`}
    >
      {({ loading }) => (
        <button
          onClick={handleClick}
          className="flex items-center gap-3 bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 text-lg rounded-lg shadow w-full md:w-auto"
        >
          <FiDownload size={24} />
          {loading ? "Generando PDF..." : "Exportar a PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
}
