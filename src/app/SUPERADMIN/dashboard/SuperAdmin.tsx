"use client";
import EmpresasForm from "@/app/components/SUPERADMIN/EmpresasForm";
import UsersForm from "@/app/components/SUPERADMIN/UsersForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSuperAdmin } from "../../stores/useSuperAdmin";

export default function SuperAdminDashboard() {
  const { access, logout } = useSuperAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!access) {
      router.replace("/SUPERADMIN/login");
    }
  }, [access, router]);
  useEffect(() => {
    const token = sessionStorage.getItem("saToken");
    if (!token) {
      router.replace("/SUPERADMIN/login");
    }
  }, []);

  const handleLogout = () => {
    logout(); // ✅ borra token y acceso
    router.replace("/SUPERADMIN/login"); // ✅ redirige al login
  };

  if (!access) return null;

  return (
    <div className="p-8 bg-gray-800 text-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Panel de SuperAdmin</h1>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        Cerrar sesión
      </button>

      {/* Contenedor de columnas */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 bg-gray-700 p-4 rounded-lg shadow">
          <EmpresasForm />
        </div>
        <div className="flex-1 bg-gray-700 p-4 rounded-lg shadow">
          <UsersForm />
        </div>
      </div>
    </div>
  );
}
