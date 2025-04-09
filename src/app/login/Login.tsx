"use client";

import { FileText, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const users: User[] = [
  { id: "1", name: "Juan Pérez", email: "juan@preventista.com", role: "preventista" },
  { id: "2", name: "María López", email: "maria@cajera.com", role: "cajera" },
  { id: "3", name: "Carlos Gómez", email: "carlos@admin.com", role: "administrador" },
];

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user = users.find((u) => u.id === selectedUser);
      if (user) {
        router.push("/dashboard");
      } else {
        alert("Usuario no válido");
      }
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-sm bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <FileText className="h-12 w-12 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold">Iniciar sesión</h1>
          <h3 className="text-gray-400">Selecciona un usuario para acceder al sistema</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="user" className="block text-sm font-medium">Usuario</label>
            <select
              id="user"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona un usuario</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">Contraseña</label>
            <input
              id="password"
              type="password"
              value="password"
              readOnly
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-blue-600 rounded-md hover:bg-blue-700 transition text-white font-semibold flex items-center justify-center"
            disabled={isLoading || !selectedUser}
          >
            {isLoading ? (
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
    </div>
  );
}
