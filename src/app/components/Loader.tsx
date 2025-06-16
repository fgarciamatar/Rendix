"use client";

import Image from "next/image";

interface LoaderProps {
  mensaje?: string;
}

export default function Loader({ mensaje = "Cargando..." }: LoaderProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
      {/* Fondo animado y difuminado */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1e469d83] to-[#01113e92] bg-[length:400%_400%] backdrop-blur-sm opacity-90 z-0" />

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center space-y-4">
        <div className="relative w-24 h-24">
          {/* Spinner externo (más grueso y color chillón) */}
          <div className="absolute inset-0 border-[6px] border-t-transparent border-b-transparent border-[#60a5fa] rounded-full animate-spin" />

          {/* Spinner interno (más oscuro) */}
          <div className="absolute inset-[6px] border-[6px] border-l-transparent border-r-transparent border-[#1e3a8a] rounded-full animate-spin-reverse" />

          {/* Ícono con sombra suave y animación de pulso */}
          <Image
            src="/icono.png"
            alt="Ícono"
            width={48}
            height={48}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]"
          />
        </div>

        {/* Mensaje de carga */}
        <p className="text-white text-lg font-semibold animate-pulse">
          {mensaje}
        </p>
      </div>
    </div>
  );
}
