// components/PDFButtonClient.tsx
"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { FiDownload } from "react-icons/fi";

import PDFReport from "./../PDFReport";

export default function PDFButtonClient() {
  return (
    <PDFDownloadLink document={<PDFReport />} fileName="Planilla_Caja.pdf">
      {({ loading }) => (
        <button className="flex items-center gap-3 bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 text-lg rounded-lg shadow w-full md:w-auto">
          <FiDownload size={24} />
          {loading ? "Generando PDF..." : "Exportar a PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
}
