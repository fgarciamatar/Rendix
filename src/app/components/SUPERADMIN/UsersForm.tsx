"use client";
import React, { useState } from "react";
import { useSuperAdmin } from "../../stores/useSuperAdmin";

// Definición del tipo para los datos del formulario
type UserData = {
  name: string;
  lastName: string;
  id: number;
  companyName: string;
  role: string;
  password: string;
  status: string;
};
type UserEditData = {
  id: number;
  name: string;
  lastName: string;
  dni: number;
  companyName: string;
  role: string;
  password: string;
  status: string;
};
type UserDataDelete = {
  name: string;
  id: number;
};
interface UserDataGet {
  id: number;
  name: string;
  lastName: string;
  role: string;
  status: string;
  companyId: number;
}

export default function UsersForm() {
  const [showUsuariosOptions, setShowUsuariosOptions] = useState(false);
  const [activeForm, setActiveForm] = useState<
    "registrar" | "editar" | "eliminar" | "traer" | null
  >(null);
  const [usuarios, setUsuarios] = useState<UserDataGet[]>([]);
  const [companyName, setCompanyName] = useState<string>("");

  const [dataRegister, setDataRegister] = useState<UserData>({
    name: "",
    lastName: "",
    id: 0,
    companyName: "",
    role: "",
    password: "",
    status: "",
  });
  const [dataEdit, setDataEdit] = useState<UserEditData>({
    name: "",
    lastName: "",
    id: 0,
    companyName: "",
    role: "",
    password: "",
    status: "",
    dni: 0,
  });
  const [dataDelete, setDataDelete] = useState<UserDataDelete>({
    name: "",
    id: 0,
  });
  const { crearUsuario, editarUsuario, eliminarUsuario, traerUsuarios } =
    useSuperAdmin();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDataRegister((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeEditSelected = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDataEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeDelteSelected = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDataDelete((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeGetUsersSelected = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCompanyName(e.target.value);
  };

  // Obtener datos de usuario (si aplica)
  const fetchUserData = async () => {
    const response = await traerUsuarios(companyName);
    if (response.success) {
      console.log("Usuarios:", response.usuarios);
      setUsuarios(response.usuarios); // Asegúrate que esta estructura sea correcta
    } else {
      alert(`Error al cargar el usuario: ${response.error}`);
    }
  };

  const handleFilterAction = async () => {
    if (activeForm === "registrar") {
      const response = await crearUsuario(dataRegister);
      alert(response.success ? response.message : `Error: ${response.error}`);
    } else if (activeForm === "editar") {
      const response = await editarUsuario(dataEdit);
      alert(response.success ? response.message : `Error: ${response.error}`);
    } else if (activeForm === "eliminar") {
      const response = await eliminarUsuario(dataDelete);
      alert(response.success ? response.message : `Error: ${response.error}`);
    }
  };

  const fields: { label: string; name: keyof UserData; type: string }[] = [
    { label: "Nombre", name: "name", type: "text" },
    { label: "Apellido", name: "lastName", type: "text" },
    { label: "DNI", name: "id", type: "number" },
    { label: "Empresa", name: "companyName", type: "text" },
    { label: "Rol", name: "role", type: "text" },
    { label: "Contraseña", name: "password", type: "password" },
    { label: "Estado", name: "status", type: "text" },
  ];

  const buttonBase = "w-full py-2 rounded transition-colors duration-200";
  const getButtonClass = (type: typeof activeForm) =>
    activeForm === type
      ? `bg-purple-600 hover:bg-purple-700 ${buttonBase}`
      : `bg-gray-700 hover:bg-gray-600 ${buttonBase}`;

  console.log(usuarios);

  return (
    <div className="p-8 max-w-md mx-auto bg-gray-800 text-white rounded-xl shadow-lg">
      <button
        onClick={() => setShowUsuariosOptions(!showUsuariosOptions)}
        className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded w-full mb-4"
      >
        Usuarios
      </button>

      {showUsuariosOptions && (
        <div className="space-y-2 transition-all duration-300">
          <button
            onClick={() => setActiveForm("registrar")}
            className={getButtonClass("registrar")}
          >
            Registrar Usuario
          </button>
          <button
            onClick={() => setActiveForm("editar")}
            className={getButtonClass("editar")}
          >
            Editar Usuario
          </button>
          <button
            onClick={() => setActiveForm("eliminar")}
            className={getButtonClass("eliminar")}
          >
            Eliminar Usuario
          </button>
          <button
            onClick={() => setActiveForm("traer")}
            className={getButtonClass("traer")}
          >
            Traer Usuarios
          </button>
        </div>
      )}

      <div className="mt-4 space-y-3">
        {activeForm === "eliminar" && (
          <div>
            <label className="block mb-1 text-sm font-medium">
              DNI del Usuario a eliminar:
            </label>
            <input
              type="number"
              name="id"
              value={dataDelete.id}
              onChange={handleChangeDelteSelected}
              className="mt-1 p-2 w-full rounded bg-white text-black"
              placeholder="Ingrese DNI..."
            />

            <label className="block mb-1 text-sm font-medium">
              Nombre Usuario a eliminar:
            </label>
            <input
              type="text"
              name="name"
              value={dataDelete.name}
              onChange={handleChangeDelteSelected}
              className="mt-1 p-2 w-full rounded bg-white text-black"
              placeholder="Ingrese el nombre..."
            />

            <button
              onClick={handleFilterAction}
              className="mt-4 bg-green-600 hover:bg-green-700 w-full py-2 rounded"
            >
              Confirmar a eliminar
            </button>
          </div>
        )}

        {activeForm === "traer" && (
          <div>
            <label className="block mb-1 text-sm font-medium">
              Nombre de la Empresa:
            </label>
            <input
              type="text"
              name="companyName"
              value={companyName}
              onChange={handleChangeGetUsersSelected}
              className="mt-1 p-2 w-full rounded bg-white text-black"
              placeholder="Ingrese nombre de la empresa..."
            />
            <button
              onClick={fetchUserData}
              className="mt-4 bg-green-600 hover:bg-green-700 w-full py-2 rounded"
            >
              Traer Usuarios
            </button>

            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Lista de Usuarios</h2>
              <ul className="space-y-4">
                {usuarios.map((usuario) => (
                  <li
                    key={usuario.id}
                    className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white"
                  >
                    <div className="font-semibold text-lg text-blue-700">
                      {usuario.name} - ID: {usuario.id}
                    </div>
                    <div className="mt-2 text-gray-700">
                      <p>
                        <span className="font-medium">Apellido:</span>{" "}
                        {usuario.lastName}
                      </p>
                      <p>
                        <span className="font-medium">Rol:</span> {usuario.role}
                      </p>
                      <p>
                        <span className="font-medium">Estado:</span>{" "}
                        {usuario.status}
                      </p>
                      <p>
                        <span className="font-medium">Empresa ID:</span>{" "}
                        {usuario.companyId}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeForm === "editar" && (
          <div>
            <label className="block mb-1 text-sm font-medium">
              DNI del Usuario a Editar:
            </label>
            <input
              type="number"
              name="id"
              value={dataEdit.id}
              onChange={handleChangeEditSelected}
              className="mt-1 p-2 w-full rounded bg-white text-black"
              placeholder="Ingrese DNI..."
            />

            <label className="block mb-1 text-sm font-medium">DNI:</label>
            <input
              type="number"
              name="dni"
              value={dataEdit.dni}
              onChange={handleChangeEditSelected}
              className="mt-1 p-2 w-full rounded bg-white text-black"
              placeholder="Ingrese DNI..."
            />

            <label className="block mb-1 text-sm font-medium">Nombre:</label>
            <input
              type="text"
              name="name"
              value={dataEdit.name}
              onChange={handleChangeEditSelected}
              className="mt-1 p-2 w-full rounded bg-white text-black"
              placeholder="Ingrese nombre..."
            />

            <label className="block mb-1 text-sm font-medium">Apellido:</label>
            <input
              type="text"
              name="lastName"
              value={dataEdit.lastName}
              onChange={handleChangeEditSelected}
              className="mt-1 p-2 w-full rounded bg-white text-black"
              placeholder="Ingrese apellido..."
            />

            <label className="block mb-1 text-sm font-medium">
              Nombre de la empresa:
            </label>
            <input
              type="text"
              name="companyName"
              value={companyName}
              onChange={handleChangeEditSelected}
              className="mt-1 p-2 w-full rounded bg-white text-black"
              placeholder="Ingrese nombre de la empresa..."
            />

            <label className="block mb-1 text-sm font-medium">
              Contraseña:
            </label>
            <input
              type="text"
              name="password"
              value={dataEdit.password}
              onChange={handleChangeEditSelected}
              className="mt-1 p-2 w-full rounded bg-white text-black"
              placeholder="Ingrese contraseña..."
            />

            <label className="block mb-1 text-sm font-medium">status:</label>
            <input
              type="text"
              name="status"
              value={dataEdit.status}
              onChange={handleChangeEditSelected}
              className="mt-1 p-2 w-full rounded bg-white text-black"
              placeholder="active/inactive..."
            />

            <div>
              <label htmlFor="role" className="block mb-1 text-sm font-medium">
                Rol:
              </label>
              <select
                id="role"
                name="role"
                value={dataEdit.role}
                onChange={handleChangeEditSelected}
                className="mt-1 p-2 w-full rounded bg-white text-black"
              >
                <option value="">Seleccionar rol</option>
                <option value="cashier">Cashier</option>
                <option value="admin">Admin</option>
                <option value="salesman">Salesman</option>
              </select>
            </div>

            <button
              onClick={handleFilterAction}
              className="mt-4 bg-green-600 hover:bg-green-700 w-full py-2 rounded"
            >
              Confirmar Edicion
            </button>
          </div>
        )}

        {activeForm === "registrar" && (
          <div>
            {fields.map(({ label, name, type }) => {
              // Verificar si el campo es rol o status para renderizar un select en lugar de un input
              if (name === "role") {
                return (
                  <div key={name}>
                    <label className="block mb-1 text-sm font-medium">
                      {label}:
                    </label>
                    <select
                      name={name}
                      value={dataRegister[name]}
                      onChange={handleChange}
                      className="mt-1 p-2 w-full rounded bg-white text-black"
                    >
                      <option value="cashier">Cashier</option>
                      <option value="admin">Admin</option>
                      <option value="salesman">Salesman</option>
                    </select>
                  </div>
                );
              } else if (name === "status") {
                return (
                  <div key={name}>
                    <label className="block mb-1 text-sm font-medium">
                      {label}:
                    </label>
                    <select
                      name={name}
                      value={dataRegister[name]}
                      onChange={handleChange}
                      className="mt-1 p-2 w-full rounded bg-white text-black"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                );
              } else {
                return (
                  <div key={name}>
                    <label className="block mb-1 text-sm font-medium">
                      {label}:
                    </label>
                    <input
                      type={type}
                      name={name}
                      value={dataRegister[name]}
                      onChange={handleChange}
                      className="mt-1 p-2 w-full rounded bg-white text-black"
                      placeholder={`Ingrese ${label.toLowerCase()}...`}
                    />
                  </div>
                );
              }
            })}
            <button
              onClick={handleFilterAction}
              className="mt-4 bg-green-600 hover:bg-green-700 w-full py-2 rounded"
            >
              Confirmar Registro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
