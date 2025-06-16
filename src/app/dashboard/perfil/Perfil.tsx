"use client";

import Userperfil from "@/app/components/UserPerfil/Userperfil";
import { useLoginStore } from "./../../stores/userLoginStore";

export default function Perfil() {
  const user = useLoginStore((state) => state.userData);

  const userData = {
    name: user?.name,
    role: user?.role,
    lastName: user?.lastName,
    status: user?.status,
    company: user?.company,
  };



  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Perfil de Usuario
        </h1>
        <p className="text-muted-foreground text-sm text-gray-400">
          Información de tu cuenta en el sistema Rendix.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className=" bg-gradient-to-b from-[#1e469d] to-[#122b70] rounded-xl shadow-md p-6 md:col-span-1">
          <div className="flex flex-col items-center space-y-4">
            <Userperfil size="grande" />
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">{userData.name}</h2>
              <p className="text-sm text-gray-400">{userData.role}</p>
            </div>
          </div>
        </div>

        <div className=" bg-gradient-to-b from-[#1e469d] to-[#122b70] rounded-xl shadow-md p-6 md:col-span-2">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white">
                Información de la Cuenta
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Detalles de tu cuenta en el sistema Rendix.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Nombre " value={userData.name} />
                <InfoItem label="Apellido " value={userData.lastName} />
                <InfoItem label="Rol" value={userData.role} />
                <InfoItem label="Empresa" value={userData.company} />
                <InfoItem label="Estado" value={userData.status} />
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-white mb-4">
                Información del sistema
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Versión del sistema" value="Rendix v1.0" />
                <InfoItem
                  label="Última actualización"
                  value="1 de Junio de 2025"
                />
              </div>
            </div>
          </div>
        </div>

        {/* <div className=" bg-gradient-to-b from-[#1e469d] to-[#122b70] rounded-xl shadow-md p-6 md:col-span-3">
          <h3 className="text-xl font-semibold text-white">
            Actividad reciente
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Historial de tus últimas acciones en el sistema.
          </p>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b border-gray-700 pb-4 last:pb-0 last:border-0"
              >
                <div>
                  <p className="font-medium text-white">{activity.action}</p>
                </div>
                <p className="text-sm text-gray-400">{activity.date}</p>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-white">{label}</p>
      <p className="text-base text-gray-400">{value}</p>
    </div>
  );
}
