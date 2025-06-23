"use client";

import { useState } from "react";
import { useSuperAdmin } from "../../stores/useSuperAdmin";

type EmpresaBaseData = {
  name: string;
  superAdminId: number;
};

type EmpresaEditData = EmpresaBaseData & {
  newName: string;
};

export default function EmpresasForm() {
  const { crearEmpresa, editarEmpresa, eliminarEmpresa, traerEmpresas } =
    useSuperAdmin();

  const [showEmpresaOptions, setShowEmpresaOptions] = useState(false);
  const [activeForm, setActiveForm] = useState<
    null | "crear" | "editar" | "eliminar" | "traer todas las"
  >(null);
  const [empresaName, setEmpresaName] = useState("");
  const [empresaNewName, setEmpresaNewName] = useState("");
  const [listaEmpresas, setListaEmpresas] = useState<
    {
      id: number;
      name: string;
      superAdminId: number;
      createdAt: string;
      updatedAt: string;
    }[]
  >([]);

  const handleSubmit = async () => {
    if (activeForm === "traer todas las") {
      const res = await traerEmpresas();
      if (res.success) {
        setListaEmpresas(res.empresas);
        alert(res.message);
      } else {
        alert(`Error: ${res.error}`);
      }
      return;
    }

    if (!empresaName) {
      alert("Debe ingresar el nombre de la empresa");
      return;
    }

    const baseData: EmpresaBaseData = {
      name: empresaName,
      superAdminId: 1,
    };

    let res;
    if (activeForm === "crear") {
      res = await crearEmpresa(baseData);
    } else if (activeForm === "editar") {
      if (!empresaNewName) {
        alert("Debe ingresar el nuevo nombre de la empresa");
        return;
      }
      const data: EmpresaEditData = { ...baseData, newName: empresaNewName };
      res = await editarEmpresa(data);
    } else if (activeForm === "eliminar") {
      res = await eliminarEmpresa({ name: empresaName });
    }

    if (res) {
      alert(res.success ? res.message : `Error: ${res.error}`);
    }

    setEmpresaName("");
    setEmpresaNewName("");
    setActiveForm(null);
    setListaEmpresas([]);
  };

  const buttonBase = "w-full py-2 rounded transition-colors duration-200";
  const getButtonClass = (type: typeof activeForm) =>
    activeForm === type
      ? `bg-purple-600 hover:bg-purple-700 ${buttonBase}`
      : `bg-gray-700 hover:bg-gray-600 ${buttonBase}`;

  return (
    <div className="p-8 max-w-md mx-auto bg-gray-800 text-white rounded-xl shadow-lg">
      <button
        onClick={() => setShowEmpresaOptions(!showEmpresaOptions)}
        className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded w-full mb-4"
      >
        Empresas
      </button>

      {showEmpresaOptions && (
        <div className="space-y-2 transition-all duration-300">
          <button
            onClick={() => setActiveForm("crear")}
            className={getButtonClass("crear")}
          >
            Crear empresa
          </button>
          <button
            onClick={() => setActiveForm("editar")}
            className={getButtonClass("editar")}
          >
            Editar empresa
          </button>
          <button
            onClick={() => setActiveForm("eliminar")}
            className={getButtonClass("eliminar")}
          >
            Eliminar empresa
          </button>
          <button
            onClick={() => setActiveForm("traer todas las")}
            className={getButtonClass("traer todas las")}
          >
            Traer todas las empresas
          </button>
        </div>
      )}

      {activeForm && (
        <div className="mt-4 transition-all duration-500 ease-in-out overflow-hidden">
          {activeForm !== "traer todas las" && (
            <label className="block mb-2 text-sm font-medium">
              Nombre de la empresa:
              <input
                type="text"
                value={empresaName}
                onChange={(e) => setEmpresaName(e.target.value)}
                className="mt-1 p-2 w-full rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Ingrese nombre..."
              />
            </label>
          )}

          {activeForm === "editar" && (
            <label className="block mb-2 text-sm font-medium">
              Nuevo nombre de la empresa:
              <input
                type="text"
                value={empresaNewName}
                onChange={(e) => setEmpresaNewName(e.target.value)}
                className="mt-1 p-2 w-full rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Ingrese nuevo nombre..."
              />
            </label>
          )}

          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded mt-2"
          >
            Confirmar {activeForm}
          </button>
        </div>
      )}

      {listaEmpresas.length > 0 && (
        <div className="mt-6 bg-gray-700 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Lista de empresas:</h2>
          <ul className="list-disc pl-5 space-y-1">
            {listaEmpresas.map((empresa, index) => (
              <div key={index}>
                <h1>{empresa.name}</h1>
                <li>ID:{empresa.id}</li>
                <li>SUPERADMINID:{empresa.superAdminId}</li>
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
