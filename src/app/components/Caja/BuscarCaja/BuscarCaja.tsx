"use client";

import { useState } from "react";

export default function BuscarCaja() {
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split("T")[0]);
  const [resultados, setResultados] = useState([
    {
      fecha: "11 de mayo de 2025",
      entradas: 12500,
      salidas: 4800,
      saldo: 7700,
    },
  ]);

  const handleBuscar = () => {
    // Aquí puedes conectar a tu backend
    console.log("Buscando planilla para:", fecha);
    setResultados([
    {
      fecha: "11 de mayo de 2025",
      entradas: 12500,
      salidas: 4800,
      saldo: 7700,
    },
  ])
  };

  return (
    <div className=" mt-10 p-6 rounded-lg shadow-lg text-white w-full">
      <h2 className="text-2xl font-bold mb-1">Buscar Planillas de Caja Históricas</h2>
      <p className="text-sm text-gray-400 mb-6">
        Busca y descarga planillas de caja de fechas anteriores.
      </p>

      <div className="mb-8">
        <label className="block mb-2 font-semibold">Fecha de la Planilla</label>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="bg-gray-800 text-white p-2 rounded-md w-full md:w-64 border border-gray-700"
          />
          <button
            onClick={handleBuscar}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition"
          >
            Buscar
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Resultados de la búsqueda</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="py-2">Fecha</th>
                <th>Entradas</th>
                <th>Salidas</th>
                <th>Saldo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((r, i) => (
                <tr key={i} className="border-t border-gray-700">
                  <td className="py-3">{r.fecha}</td>
                  <td className="text-green-500">${r.entradas.toFixed(2)}</td>
                  <td className="text-red-500">${r.salidas.toFixed(2)}</td>
                  <td className="text-green-500">${r.saldo.toFixed(2)}</td>
                  <td>
                    <button className="flex items-center gap-1 text-blue-500 hover:underline">
                      📄 Descargar
                    </button>
                  </td>
                </tr>
              ))}
              {resultados.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-400">
                    No se encontraron resultados para la fecha seleccionada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
