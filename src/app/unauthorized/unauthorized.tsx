"use client"; // ⬅️ Muy importante en App Router

import Image from "next/image";
import { useRouter } from "next/navigation";
import icon from "./../favicon.ico";

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#172a54] to-[#1f3f8f] text-white px-4">
      <Image src={icon} alt="Logo" width={100} height={100} className="mb-6" />
      <h1 className="text-4xl font-bold text-red-500">Acceso denegado</h1>
      <p className="mt-4 text-lg mb-6">
        No tienes permisos para acceder a esta ruta.
      </p>
      <button
        onClick={() => router.back()}
        className="mt-2 px-6 py-3 rounded-xl bg-white text-[#000000] font-bold text-lg shadow-lg hover:bg-[#495886] hover:scale-105 transition-all duration-300"
      >
        Volver
      </button>
    </div>
  );
}
