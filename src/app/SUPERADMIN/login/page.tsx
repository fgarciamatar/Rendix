"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSuperAdmin } from "./../../stores/useSuperAdmin";

export default function SuperAdminLogin() {
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const router = useRouter();
  const { sendPin, verifyPin } = useSuperAdmin();

  const handleSendPin = async () => {
    const res = await sendPin();
    console.log(res);

    if (res.success) {
      setMessage(res.message);
      setError("");
      alert("PIN ENVIADO");
    } else {
      setError(res.error);
      setMessage("");
      alert("hola");
    }
  };

  const handleVerify = async () => {
    const res = await verifyPin(pin);
    console.log("acceso", res.success);

    if (res.success) {
      router.push("/SUPERADMIN/dashboard");
    } else {
      setError(res.error);
      setMessage("");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Ingresar como SUPERADMIN
      </h1>

      <button
        onClick={handleSendPin}
        className="bg-black text-white px-4 py-2 w-full rounded-lg transition-all duration-200 hover:bg-gray-800 active:scale-95 mb-4"
      >
        Enviar PIN al email
      </button>

      <input
        type="text"
        placeholder="Ingresá tu PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
      />

      <button
        onClick={handleVerify}
        className="bg-black text-white px-4 py-2 w-full rounded-lg transition-all duration-200 hover:bg-gray-800 active:scale-95"
      >
        Verificar PIN
      </button>

      {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
}
