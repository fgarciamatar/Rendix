"use client";

import { useDashboard } from "@/app/stores/useDashboardStore";
import React, { useEffect } from "react";
import { AiOutlineCloseCircle, AiOutlineWarning } from "react-icons/ai";
import { FaCheckCircle, FaDollarSign } from "react-icons/fa";
import { HiOutlineDocumentReport } from "react-icons/hi";

import CardTopPreventista from "@/app/components/Dashboard/CardTopPreventista";
import Loader from "@/app/components/Loader";
import TransferenciasTrendChart from "@/app/components/Transferencias/TransferenciasTrendChart";

export default function DashboardGlobal() {
  const {
    transferStadistics,
    bankDistribution,
    loading,
    getTransferStadistics,
  } = useDashboard();

  useEffect(() => {
    if (!transferStadistics ) {
      getTransferStadistics();
    }
  }, []);

  
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

        <CardTopPreventista />
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
      <TransferenciasTrendChart />

      <div className="bg-[#1a1f2b] rounded-xl p-4 lg:p-6 xl:p-8 shadow-md border border-[#2e3448] flex flex-col justify-between h-full  mt-6">
        <h2 className="text-xl lg:text-2xl font-semibold mb-1">
          Distribución por Banco
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Transferencias por entidad bancaria
        </p>

        <div className="space-y-4">
          {bankDistribution.map((bank, index) => {
            const amount = bank.amount;
            return (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm lg:text-base text-white font-medium">
                    {bank.bank}
                  </div>
                  <div className="text-sm text-gray-400">{bank.percent}%</div>
                </div>
                <div className="flex justify-between items-center text-gray-400 text-xs mb-1">
                  <span>{bank.count} transferencias</span>
                  <span>${amount.toLocaleString("es-AR")}</span>
                </div>
                <div className="w-full h-2 bg-[#2e3448] rounded-full">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${bank.percent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="p-4"></div>
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
