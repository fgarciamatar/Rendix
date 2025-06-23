import React from "react";
import { useDashboard } from "@/app/stores/useDashboardStore"; // Asegurate que la ruta sea correcta
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const CardTopPreventista = () => {
  const { topPreventistas } = useDashboard();

  if (!topPreventistas || topPreventistas.length === 0) {
    return (
      <div className="bg-[#1a1f2b] text-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-1">Top Preventistas</h2>
        <p className="text-sm text-gray-400">No hay datos disponibles.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1f2b] text-white rounded-2xl p-6 w-full max-w-md shadow-lg">
      <h2 className="text-xl font-semibold mb-1">Top Preventistas</h2>
      <p className="text-sm text-gray-400 mb-4">
        Preventistas con mejor rendimiento este mes
      </p>
      <ul className="space-y-4">
        {topPreventistas.slice(0, 5).map((item) => (
          <li key={item.posicion} className="flex items-center justify-between">
            {/* Izquierda */}
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-300">
                #{item.posicion}
              </span>
              <div className="w-8 h-8 rounded-full bg-gray-500"></div>
              <div>
                <p className="font-medium">{item.preventista}</p>
                <p className="text-xs text-gray-400">
                  {item.transferTotal} transferencias
                </p>
              </div>
            </div>

            {/* Derecha */}
            <div className="text-right">
              <div
                className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                  item.percent < 5
                    ? "bg-red-600 text-white"
                    : "bg-blue-600 text-white"
                }`}
              >
                {item.percent < 5 ? (
                  <ArrowDownRight className="w-3 h-3 mr-1" />
                ) : (
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                )}
                {item.percent.toFixed(1)}%
              </div>
              <p className="text-sm font-semibold mt-1">
                ${item.amount.toLocaleString("es-AR")}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CardTopPreventista;
