import TotalCajaComponent from "@/app/components/Caja/TotalCaja/TotalCajaComponent";
import MovimientoComponent from "../../components/Caja/Movimientos/MovimientoComponent";
import CajaClient from "./CajaClient";

export default function Caja() {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl flex flex-col flex-grow">
        <CajaClient />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MovimientoComponent
            titulo="Entradas"
            descripcion="Registro de ingresos de caja."
            esEntrada={true}
          />
          <MovimientoComponent
            titulo="Salidas"
            descripcion="Registro de egresos de caja."
            esEntrada={false}
          />
        </div>
      <TotalCajaComponent/>
      </div>
    </div>
  );
}
