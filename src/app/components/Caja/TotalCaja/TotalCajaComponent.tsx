"use client";
import { useEffect, useState } from "react";
import { useCajaStore } from "../../../stores/useCajaStore";

export default function TotalCajaComponent() {
  const entradas = useCajaStore((state) => state.entradas);
  const salidas = useCajaStore((state) => state.salidas);
  const getEstadoCaja = useCajaStore((state) => state.estadoCaja);

  const [estadoCaja, setEstadoCaja] = useState(getEstadoCaja());

  useEffect(() => {
    setEstadoCaja(getEstadoCaja());
  }, [entradas, salidas, getEstadoCaja]);

  const color =
    estadoCaja.estado === "sobrante"
      ? "text-green-400"
      : estadoCaja.estado === "faltante"
      ? "text-red-400"
      : "text-gray-300";

  return (
    <div className="mt-10 text-center md:text-right border-t border-gray-700 pt-6">
      <h2 className="text-3xl md:text-4xl font-extrabold text-blue-400">
         Total:{" "}
        <span className={`block md:inline ${color}`}>
          ${estadoCaja.total.toFixed(2)}
        </span>
      </h2>

      <p className="text-lg mt-2 text-gray-400">
       <strong className={color}>{estadoCaja.estado.toUpperCase()}</strong>
      </p>
    </div>
  );
}


