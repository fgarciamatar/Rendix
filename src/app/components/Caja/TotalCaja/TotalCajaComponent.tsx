"use client";

import { useEffect, useState } from "react";
import { useCajaStore } from "../../../stores/useCajaStore";

export type EstadoCaja = {
  total: number;
  estado: "sobrante" | "faltante" | "balanceado" | "normal";
};


export default function TotalCajaComponent() {
  // 1. Llamar SIEMPRE los hooks al inicio

  const getEstadoCaja = useCajaStore((state) => state.estadoCaja);

  // 2. Manejar el estado de “montado” para evitar hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 3. Si querés ocultar la UI hasta que monte, hacelo DESPUÉS de llamar los hooks
  if (!mounted) {
    return null; 
  }

  // 4. Ahora que el componente está montado, obtenemos el estado de la caja
  const estadoCaja: EstadoCaja = getEstadoCaja();

  // 5. Definimos la lógica del color
  const color =
    estadoCaja.estado === "sobrante"
      ? "text-green-400"
      : estadoCaja.estado === "faltante"
      ? "text-red-400"
      : "text-gray-300";

  return (
    <div className="mt-10 text-center md:text-right border-t border-gray-700 pt-6">
      <h2 className="text-3xl md:text-4xl font-extrabold text-blue-400">
        Diferencia:{" "}
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
