"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useDashboard } from "@/app/stores/useDashboardStore";


export default function TransferenciasTrendChart() {
  const { dailyStatusData } = useDashboard();
  

  if (!dailyStatusData || dailyStatusData.length === 0) return null;
  

  return (
    <div className="bg-[#1a1f2b] p-4 lg:p-6 xl:p-8 mt-8 rounded-xl border border-[#2e3448]">
      <h2 className="text-white text-lg lg:text-xl font-bold mb-1">Tendencia de Transferencias</h2>
      <p className="text-gray-400 text-sm mb-4">Últimos 30 días por estado</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dailyStatusData}>
          <XAxis dataKey="date" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pending" stroke="#eab308" name="Pendientes" strokeWidth={2} />
          <Line type="monotone" dataKey="approved" stroke="#22c55e" name="Aprobadas" strokeWidth={2} />
          <Line type="monotone" dataKey="rejected" stroke="#ef4444" name="Rechazadas" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
