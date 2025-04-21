"use client";

import icon from "./../favicon.ico";
import Link from "next/link";
import { AiFillMoon } from "react-icons/ai";
import Image from "next/image";
import { FaRegUserCircle } from "react-icons/fa";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#1d3163]">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo + Título */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >
          <Image src={icon} alt="Logo" width={34} height={34} />
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            Rendix
          </h1>
        </Link>

        {/* Iconos a la derecha */}
        <div className="flex items-center gap-4">
          <button
            aria-label="Modo Oscuro"
            className="text-gray-300 hover:text-white transition-colors"
          >
            <AiFillMoon size={30} />
          </button>
          <button
            aria-label="Usuario"
            className="text-gray-300 hover:text-white transition-colors"
          >
            <FaRegUserCircle size={30} />
          </button>
        </div>
      </div>
    </header>
  );
}
