"use client";
import EmpresasForm from "@/app/components/SUPERADMIN/EmpresasForm";
import UsersForm from "@/app/components/SUPERADMIN/UsersForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSuperAdmin } from "../../stores/useSuperAdmin";

export default function SuperAdminDashboard() {
  const { access } = useSuperAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!access) {
      router.push("/SUPERADMIN/login");
    }
  }, [access, router]);

  if (!access) return null;

  return (
    <div className="p-8 bg-gray-800 text-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Panel de SuperAdmin</h1>

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
