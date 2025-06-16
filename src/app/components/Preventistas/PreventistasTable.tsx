"use client";

import { useEffect, useState } from "react";
import { usePreventistas } from "../../stores/usePreventistas";
import { useLoginStore } from "../../stores/userLoginStore";
import DetailModal from "./DetailModal";


const PreventistasTable = () => {
  const [detailModal, setDetailModal] = useState(false);
  const [preventistaSeleccionado, setPreventistaSeleccionado] = useState<{
  id: number;
  total: number;
  aprobadas: number;
  desaprobadas: number;
} | null>(null);
  const [showLast7Days, setShowLast7Days] = useState(false);


  const preventistasDetail = usePreventistas(
    (state) => state.PreventistasDetail
  );
    const detailUltimo7 = usePreventistas(
    (state) => state.DetailUltimo7);
  const preventistasResumen = usePreventistas(
    (state) => state.preventistasResumen
  );
  const preventistasUsuarios = usePreventistas((state) => state.preventistas);
  const user = useLoginStore((state) => state.userData);
  const company = user.company;

  useEffect(() => {
    preventistasDetail(company);
  }, [user]);

  const preventistasCombinados = preventistasResumen.map((resumen) => {
    const userData = preventistasUsuarios.find(
      (u) => u.name === resumen.salesman
    );
    const estado =
      userData?.status === "active"
        ? "Activo"
        : userData?.status === "inactive"
        ? "Inactivo"
        : "Desconocido";

    return {
      id: userData?.id,
      nombre: resumen.salesman,
      apellido: userData?.lastName,
      total: resumen.total,
      aprobadas: resumen.aprobadas,
      desaprobadas: resumen.desaprobadas,
      estado,
    };
  });


    const handleToggle = async () => {
    const newValue = !showLast7Days;
    setShowLast7Days(newValue);

    if (newValue) {
      await detailUltimo7("Mondello");
    } else {
      await preventistasDetail("Mondello");
    }
  };

const handleClickDetalle = (id?: number) => {
  if (id === undefined) return;

  const seleccionado = preventistasCombinados.find((p) => p.id === id);
  if (!seleccionado) return;

  setPreventistaSeleccionado({
    id: seleccionado.id!,
    total: seleccionado.total,
    aprobadas: seleccionado.aprobadas,
    desaprobadas: seleccionado.desaprobadas,
  });

  setDetailModal(true);
};

  return (
    <div className="w-full px-2 sm:px-4 py-6">
      <div className="w-full bg-[#1a1f2b] rounded-2xl p-4 sm:p-6 shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">
          Listado de Preventistas
        </h2>
<div className="flex justify-center mb-6 gap-3 items-center">
  <span className="text-white text-sm font-medium">
    {showLast7Days ? "Últimos 7 días" : "Todo"}
  </span>
  <button
    onClick={handleToggle}
    className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
      showLast7Days ? "bg-gray-600" : "bg-blue-600"
    }`}
  >
    <div
      className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
        showLast7Days ? "translate-x-0" : "translate-x-6"
      }`}
    />
  </button>
</div>




        {/* Vista tipo tabla para pantallas grandes */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm text-center text-white border-collapse">
            <thead>
              <tr className="bg-[#1e293b] text-gray-300">
                <th className="py-3">Nombre</th>
                <th>Apellido</th>
                <th>Total transferencias</th>
                <th className="text-green-400">Aprobadas</th>
                <th className="text-red-400">Desaprobadas</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {preventistasCombinados.map((p, index) => (
                <tr
                  key={index}
                  className="border-b border-[#334155] hover:bg-[#0f172a] transition duration-200"
                >
                  <td className="py-3">{p.nombre}</td>
                  <td>{p.apellido}</td>
                  <td>{p.total}</td>
                  <td className="text-green-400">{p.aprobadas}</td>
                  <td className="text-red-400">{p.desaprobadas}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        p.estado === "Activo"
                          ? "bg-green-600 text-white"
                          : p.estado === "Inactivo"
                          ? "bg-red-600 text-white"
                          : "bg-gray-600 text-white"
                      }`}
                    >
                      {p.estado}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleClickDetalle(p.id)}
                      className="text-blue-400 hover:underline"
                    >
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vista tipo cards para pantallas pequeñas */}
        <div className="sm:hidden flex flex-col gap-4">
          {preventistasCombinados.map((p, index) => (
            <div
              key={index}
              className="bg-[#1e293b] rounded-lg p-4 text-white shadow-md hover:bg-[#0f172a] transition"
            >
              <p className="font-bold text-lg mb-2">
                {p.nombre} {p.apellido}
              </p>
              <div className="text-sm space-y-1">
                <p>
                  Total transferencias:{" "}
                  <span className="font-semibold">{p.total}</span>
                </p>
                <p className="text-green-400">
                  Aprobadas:{" "}
                  <span className="font-semibold">{p.aprobadas}</span>
                </p>
                <p className="text-red-400">
                  Desaprobadas:{" "}
                  <span className="font-semibold">{p.desaprobadas}</span>
                </p>
                <p>
                  Estado:{" "}
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      p.estado === "Activo"
                        ? "bg-green-600 text-white"
                        : p.estado === "Inactivo"
                        ? "bg-red-600 text-white"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {p.estado}
                  </span>
                </p>
              </div>
              <button onClick={() => handleClickDetalle(p.id)} className="mt-3 text-blue-400 hover:underline text-sm">
  Ver detalles
</button>

            </div>
          ))}
        </div>
      </div>

    {detailModal && preventistaSeleccionado && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <DetailModal
      id={preventistaSeleccionado.id}
      total={preventistaSeleccionado.total}
      aprobadas={preventistaSeleccionado.aprobadas}
      desaprobadas={preventistaSeleccionado.desaprobadas}
      onClose={() => setDetailModal(false)}
    />
  </div>
)}


    </div>
  );
};

export default PreventistasTable;
