"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa6";
import Loader from "../components/Loader"; // Ajusta la ruta si es necesario
import { useLoginStore } from "../stores/userLoginStore";

export default function LoginPage() {
  const [userAndCompany, setUserAndCompany] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [showLoader, setShowLoader] = useState(false);

  const router = useRouter();
  const login = useLoginStore((state) => state.login);

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError("");
  setShowLoader(true); // Activar el loader inmediatamente

  const isValidFormat = /^[^@]+@[^@]+$/.test(userAndCompany);
  if (!isValidFormat) {
    setShowLoader(false);
    setError("El formato debe ser usuario@empresa");
    return;
  }

  try {
    const response = await login(userAndCompany, password);
    if (response === true) {
      router.push("/dashboard");
    } else {
      setError("Credenciales incorrectas.");
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error durante el login:", err.message);
      setError(err.message);
    } else {
      console.error("Error desconocido:", err);
      setError("Error inesperado. Por favor intentá de nuevo.");
    }
  }

  setShowLoader(false); // Apagar el loader al terminar
};


  useEffect(() => {
    const doLogout = async () => {
      await useLoginStore.getState().logout();
    };

    doLogout();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-800 text-white p-4">
      <div className="w-full max-w-sm bg-gradient-to-b from-[#1e469d] to-[#122b70] p-6 rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <FaUser className="h-12 w-12 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold">Iniciar sesión</h1>
          <h3 className="text-gray-400 text-sm">
            Ingresá <strong>usuario@empresa</strong> y tu contraseña
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="user@company" className="block text-sm font-medium">
              Usuario@Empresa
            </label>
            <input
              id="user@company"
              type="text"
              value={userAndCompany}
              onChange={(e) => setUserAndCompany(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 pr-10 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white hover:bg-black rounded-full p-1 transition"
              >
                {showPassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
              </button>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full p-2 bg-blue-600 rounded-md hover:bg-blue-700 transition text-white font-semibold flex items-center justify-center"
            disabled={showLoader}
          >
            {showLoader ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>
      </div>
      {showLoader && <Loader mensaje="Iniciando sesión..." />}
    </div>
  );
}
