import { useSuperAdmin } from "@/app/stores/useSuperAdmin";
import React, { useEffect } from "react";
import { FiFilter } from "react-icons/fi";
import { useLoginStore } from "../../stores/userLoginStore";

interface Props {
  busqueda: string;
  setBusqueda: (v: string) => void;
  mostrarFiltros: boolean;
  setMostrarFiltros: (v: boolean) => void;
  fechaFiltro: string | null;
  setFechaFiltro: (v: string | null) => void;
  salesmanFiltro: string | null;
  setSalesmanFiltro: (v: string | null) => void;
}

const TransferenciaFilters: React.FC<Props> = ({
  busqueda,
  setBusqueda,
  mostrarFiltros,
  setMostrarFiltros,
  fechaFiltro,
  setFechaFiltro,
  salesmanFiltro,
  setSalesmanFiltro,
}) => {
  const traerUsuarios = useSuperAdmin((state) => state.traerUsuarios);
  const usuarios = useSuperAdmin((state) => state.usuarios);
  const user = useLoginStore((state) => state.userData);
  const company = user.company;

  useEffect(() => {
    if (company) {
      traerUsuarios(company);
    }
  }, [company]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0 mb-4 relative w-full">
      <input
        type="text"
        placeholder="Buscar transferencia por nombre..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none w-full sm:w-72"
      />
      <button
        onClick={() => setMostrarFiltros(!mostrarFiltros)}
        className="flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer w-full sm:w-auto"
      >
        <FiFilter className="w-5 h-5 mr-1" /> Filtros
      </button>
      {mostrarFiltros && (
        <div className="absolute mt-2 w-full sm:w-72 p-4 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-10 top-full left-0 sm:left-auto">
          <label className="text-sm text-white mb-1 block">Fecha</label>
          <input
            type="date"
            value={fechaFiltro ?? ""}
            onChange={(e) => setFechaFiltro(e.target.value || null)}
            className="mb-3 w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
          />

          {user.role !== "salesman" && (
            <select
              value={salesmanFiltro ?? ""}
              onChange={(e) => setSalesmanFiltro(e.target.value || null)}
              className="mb-3 w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
            >
              <option value="">Seleccionar preventista</option>
              {usuarios.map((user) => (
                <option key={user.id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
          )}

          <button
            className="w-full py-2 mt-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
            onClick={() => {
              setFechaFiltro(null);
              setSalesmanFiltro(null);
              setBusqueda("");
              setMostrarFiltros(false);
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default TransferenciaFilters;
