"use client";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const goToCaja = () => {
    router.push("/dashboard/caja");
  };
  return (
    <div>
      <h1>DASHBOARD</h1>
      <div>
        <button
          onClick={goToCaja}
          className="w-full p-2 bg-blue-600 rounded-md hover:bg-blue-700 transition text-white font-semibold flex items-center justify-center"
        >
       CAJA
        </button>
      </div>
    </div>
  );
}
