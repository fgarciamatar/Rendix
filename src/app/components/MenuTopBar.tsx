"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BsPerson, BsQuestionCircle } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { useLoginStore } from "../stores/userLoginStore";
import { UserData } from "./Caja/Movimientos/types";
import ModalConfirmacion from "./ModalConfirm/ModalConfirm";
import Loader from "./Loader"; 


type Props = UserData & {
  onCloseMenu: () => void;
};

export default function MenuTopBar({ name, company, onCloseMenu }: Props) {
  const router = useRouter();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAbrirModal = () => {
    setMostrarModal(true);
  };

  const handleCancelar = () => setMostrarModal(false);

  const handleConfirmar = async () => {
    setLoading(true);
    setMostrarModal(false);

    // Esperar un breve momento para mostrar el loader con animación
    setTimeout(async () => {
      try {
        await useLoginStore.getState().logout();
        router.push("/login");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        setLoading(false);
      }
    }, 20);
  };

  const handleRedirect = (path: string) => {
    onCloseMenu();
    router.push(path);
  };

  return (
    <>
      <div className="absolute top-14 right-0 w-60 bg-gradient-to-b from-[#1e469d] to-[#122b70] text-white rounded-xl shadow-2xl z-40">
        <div className="p-4 border-b border-white/20">
          <p className="text-s font-semibold">{name}</p>
          <p className="text-sm text-gray-200">{company}</p>
        </div>
        <ul className="p-2 space-y-1">
          <li>
            <button
              onClick={() => handleRedirect("/dashboard/perfil")}
              className="flex items-center gap-2 w-full text-left hover:bg-[#455f82fa] p-2 rounded"
            >
              <BsPerson className="text-lg" /> Perfil
            </button>
          </li>
          <li>
            <button
              onClick={() => handleRedirect("/dashboard/soporte")}
              className="flex items-center gap-2 w-full text-left hover:bg-[#455f82fa] p-2 rounded"
            >
              <BsQuestionCircle className="text-lg" /> Soporte
            </button>
          </li>
          <li>
            <button
              onClick={handleAbrirModal}
              className="flex items-center gap-2 w-full text-left hover:bg-[#455f82fa] p-2 rounded"
            >
              <FiLogOut className="text-lg" /> Cerrar sesión
            </button>
          </li>
        </ul>
      </div>

      {loading && <Loader mensaje="Cerrando sesión..." />}

      {mostrarModal && (
        <ModalConfirmacion
          mensaje="¿Estás seguro de cerrar sesión?"
          onConfirmar={handleConfirmar}
          onCancelar={handleCancelar}
        />
      )}
    </>
  );
}
