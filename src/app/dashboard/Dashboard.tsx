"use client";
import { useEffect } from "react";
import { useLoginStore } from "../../app/stores/userLoginStore";
import DashboardGlobal from "../components/Dashboard/DashboardGlobal";
import DashboardPreventista from "../components/Dashboard/DashboardPreventista";

export default function Dashboard() {
  const { role } = useLoginStore((state) => state.userData);

  useEffect(() => {
    if (!role || role === undefined) {
      const loading = () => {
        // Aquí puedes usar un Spinner o Loader personalizado
        return <h1>Cargando...</h1>;
      };
      loading();
    }
  }, [ role]);

  return (
    <div>
      {(role === "admin" || role === "cashier") && <DashboardGlobal />}
      {role === "salesman" && <DashboardPreventista />}
    </div>
  );
}
