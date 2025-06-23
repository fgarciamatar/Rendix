"use client";

import { useDashboard } from "@/app/stores/useDashboardStore";
import { useLoginStore } from "./../../stores/userLoginStore"
import React, { useEffect } from "react";
import { AiOutlineCloseCircle, AiOutlineWarning } from "react-icons/ai";
import { FaCheckCircle, FaDollarSign } from "react-icons/fa";
import { HiOutlineDocumentReport } from "react-icons/hi";

import Loader from "@/app/components/Loader";

export default function DashboardPreventista() {
  const {
    transferStadistics,
    loading,
    getTransferStadisticsPreventista,
  } = useDashboard();

  const { name } = useLoginStore((state) => state.userData);

  useEffect(() => {
    if (!transferStadistics && !loading) {
      getTransferStadisticsPreventista(name);
    }
  }, [transferStadistics, loading]);

  if (loading || !transferStadistics) {
    return <Loader />;
  }

  // console.log(bankDistribution);

  const {
    montoTotal,
    totalProcesadas,
    tasaExito,
    totalPendientes,
    totalAprobadas,
    porcentajeAprobadas,
    totalRechazadas,
    porcentajeRechazadas,
  } = transferStadistics;

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-1">
        Dashboard
      </h1>
      <p className="text-gray-400 mb-6 text-sm lg:text-base xl:text-lg">
        Resumen general del sistema de transferencias.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition"
      >
        Actualizar
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          title="Total Transferencias"
          value={`$ ${montoTotal.toLocaleString("es-AR")}`}
          icon={<FaDollarSign className="text-xl lg:text-2xl" />}
          subValue=""
          subText="desde el mes pasado"
          subColor="text-green-400"
        />
        <Card
          title="Transferencias Procesadas"
          value={totalProcesadas}
          icon={<HiOutlineDocumentReport className="text-xl lg:text-2xl" />}
          subValue=""
          subText="desde el mes pasado"
          subColor="text-green-400"
        />
        <Card
          title="Tasa de Éxito"
          value={`${tasaExito.toFixed(1)}%`}
          icon={<FaCheckCircle className="text-xl lg:text-2xl" />}
          subText={`${totalAprobadas} aprobadas de ${totalProcesadas} totales`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <Card
          title="Pendientes"
          value={totalPendientes}
          icon={
            <AiOutlineWarning className="text-yellow-400 text-xl lg:text-2xl" />
          }
          subText="requieren revisión"
          color="text-yellow-400"
        />
        <Card
          title="Aprobadas"
          value={totalAprobadas}
          icon={
            <FaCheckCircle className="text-green-500 text-xl lg:text-2xl" />
          }
          subText={`${porcentajeAprobadas.toFixed(1)}% del total`}
          color="text-green-400"
        />
        <Card
          title="Rechazadas"
          value={totalRechazadas}
          icon={
            <AiOutlineCloseCircle className="text-red-500 text-xl lg:text-2xl" />
          }
          subText={`${porcentajeRechazadas.toFixed(1)}% del total`}
          color="text-red-400"
        />
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  icon,
  subValue,
  subText,
  color = "text-white",
  subColor = "text-gray-400",
}: {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subValue?: string;
  subText?: string;
  color?: string;
  subColor?: string;
}) {
  return (
    <div className="bg-[#1a1f2b] rounded-xl p-4 lg:p-6 xl:p-8 shadow-md border border-[#2e3448] flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm lg:text-base xl:text-lg text-gray-400">
          {title}
        </h3>
        <div className="ml-2">{icon}</div>
      </div>
      <p className={`text-2xl lg:text-3xl xl:text-4xl font-semibold ${color}`}>
        {value}
      </p>
      {subValue && (
        <p className={`text-sm lg:text-base ${subColor}`}>{subValue}</p>
      )}
      <p className="text-xs lg:text-sm xl:text-base text-gray-500 mt-1">
        {subText}
      </p>
    </div>
  );
}
