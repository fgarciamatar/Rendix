"use client";

import Userperfil from "@/app/components/UserPerfil/Userperfil";
import { useEffect, useState } from "react";
import { useSuperAdmin } from "../../stores/useSuperAdmin";
import {useLoginStore} from "./../../stores/userLoginStore"
import { ChartLine, BadgeCheck, XCircle, X } from "lucide-react";
import { traducirRole, traducirStatus } from "@/app/utils/useHelpers";

type DetailModalProps = {
  id: number;
  total: number;
  aprobadas: number;
  desaprobadas: number;
  onClose?: () => void;
};

interface UserDataGet {
  id: number;
  name: string;
  lastName: string;
  role: string;
  status: string;
}

export default function DetailModal({
  id,
  total,
  aprobadas,
  desaprobadas,
  onClose,
}: DetailModalProps) {
  const [userData, setUserData] = useState<UserDataGet | null>(null);
  const traerUsuarios = useSuperAdmin((state) => state.traerUsuarios);
    const userDataLogin = useLoginStore((state) => state.userData);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await traerUsuarios(userDataLogin.company);
        if (response.success) {
          const usuarioFiltrado = (response.usuarios as UserDataGet[]).find(
            (usuario) => usuario.id === id
          );
          setUserData(usuarioFiltrado || null);
        } else {
          console.error("Error en la respuesta:", response.error);
        }
      } catch (error) {
        console.error("Error al traer usuarios:", error);
      }
    };

    fetchUsuarios();
  }, [id, traerUsuarios]);

  return (
  <div className="relative bg-gradient-to-b from-[#1e3a8a] to-[#172554] rounded-2xl shadow-2xl p-4 sm:p-8 max-w-xl w-full mx-4 sm:mx-auto text-white border border-blue-500 transition-all duration-300">
    {/* Botón de cerrar */}
    {onClose && (
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-red-400 transition"
        aria-label="Cerrar"
      >
        <X size={24} />
      </button>
    )}

    {/* Contenido scrollable solo en mobile */}
    <div className="max-h-[80vh] overflow-y-auto pr-2 sm:pr-0">
      {/* Perfil */}
      <div className="flex flex-col items-center space-y-4 mb-8 mt-6">
        <Userperfil size="mediano" usuario={{ name: userData?.name }} />
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-wide">
            {userData?.name || "Cargando..."}
          </h2>
          <p className="text-sm sm:text-base text-blue-300">{traducirRole(userData?.role)}</p>
        </div>
      </div>

      {/* Información de cuenta */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-3 border-b border-white/20 pb-1">Información de la Cuenta</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoItem label="Nombre" value={userData?.name || "-"} />
          <InfoItem label="Apellido" value={userData?.lastName || "-"} />
          <InfoItem label="Rol" value={traducirRole(userData?.role) || "-"} />
          <InfoItem label="Estado" value={traducirStatus(userData?.status) || "-"} />
        </div>
      </section>

      {/* Transferencias */}
      <section>
        <h3 className="text-lg font-semibold mb-3 border-b border-white/20 pb-1">Resumen de Transferencias</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <ResumenItem label="Total" value={total} bgColor="bg-white/10" textColor="text-white" icon={<ChartLine size={20} />} />
          <ResumenItem label="Aprobadas" value={aprobadas} bgColor="bg-green-600" textColor="text-white" icon={<BadgeCheck size={20} />} />
          <ResumenItem label="Desaprobadas" value={desaprobadas} bgColor="bg-red-600" textColor="text-white" icon={<XCircle size={20} />} />
        </div>
      </section>
    </div>
  </div>
);

}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/10 p-3 rounded-lg shadow-inner hover:bg-white/20 transition duration-200">
      <p className="text-xs font-medium text-white/70">{label}</p>
      <p className="text-base font-semibold text-white">{value}</p>
    </div>
  );
}

function ResumenItem({
  label,
  value,
  icon,
  bgColor,
  textColor,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}) {
  return (
    <div
      className={`rounded-xl px-4 py-3 flex flex-col items-center shadow-md transform hover:scale-105 transition-all duration-200 cursor-pointer ${bgColor}`}
    >
      <div className="mb-1">{icon}</div>
      <p className={`text-sm font-medium ${textColor}`}>{label}</p>
      <p className={`text-lg font-bold ${textColor}`}>{value}</p>
    </div>
  );
}
