"use client";
import { BsClockHistory } from "react-icons/bs";
import { FaCheckCircle, FaMoneyBillWave, FaUserTie } from "react-icons/fa";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white p-6">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-sm text-gray-400 mb-6">
        Bienvenido al panel de control de transferencias.
      </p>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#131a2a] rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm text-gray-400">Total Transferencias</h2>
              <p className="text-2xl font-bold">$45,231.89</p>
              <p className="text-xs text-green-400 mt-1">
                +20.1% desde el mes pasado
              </p>
            </div>
            <FaMoneyBillWave className="text-2xl text-green-500" />
          </div>
        </div>

        <div className="bg-[#131a2a] rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm text-gray-400">
                Transferencias Pendientes
              </h2>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-red-400 mt-1">
                4 requieren revisión urgente
              </p>
            </div>
            <BsClockHistory className="text-2xl text-yellow-500" />
          </div>
        </div>

        <div className="bg-[#131a2a] rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm text-gray-400">Preventistas Activos</h2>
              <p className="text-2xl font-bold">24</p>
              <p className="text-xs text-blue-400 mt-1">3 nuevos esta semana</p>
            </div>
            <FaUserTie className="text-2xl text-blue-500" />
          </div>
        </div>

        <div className="bg-[#131a2a] rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm text-gray-400">Tasa de Aprobación</h2>
              <p className="text-2xl font-bold">92.5%</p>
              <p className="text-xs text-green-400 mt-1">
                +2.5% desde la semana pasada
              </p>
            </div>
            <FaCheckCircle className="text-2xl text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
