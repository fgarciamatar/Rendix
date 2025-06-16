"use client";

import { useLoginStore } from "@/app/stores/userLoginStore";

type UserperfilProps = {
  size?: "grande" | "mediano" | "pequeño";
  usuario?: { name?: string };
};

export default function Userperfil({ size = "mediano", usuario }: UserperfilProps) {
  const globalUser = useLoginStore((state) => state.userData);
  const user = usuario || globalUser;

  const sizeClasses = {
    grande: "w-50 h-50 text-4xl",    // 128px, texto grande
    mediano: "w-24 h-24 text-2xl",   // 96px, texto normal
    pequeño: "w-14 h-14 text-xl",    // 64px, texto más chico
  };

  return (
    <div
      className={`rounded-full border border-white bg-gradient-to-b from-[#113789] to-[#a56301] flex items-center justify-center text-white ${sizeClasses[size]}`}
    >
      {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
    </div>
  );
}
