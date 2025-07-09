// import BuscarCaja from "@/app/components/Caja/BuscarCaja/BuscarCaja";
import TotalCajaComponent from "@/app/components/Caja/TotalCaja/TotalCajaComponent";
import MovimientoComponent from "../../components/Caja/Movimientos/MovimientoComponent";
import CajaClient from "./CajaClient";
// import TipoClient from "@/app/components/Caja/TipoClient/TipoClient";

export default function Caja() {
  return (
    <div className="min-h-screen w-full text-white p-4 md:p-8 flex flex-col items-center">
      <div className="bg-gray-800 rounded-2xl sm:rounded-2xl p-2 sm:p-6 w-full max-w-6xl flex flex-col flex-grow">
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
        <TotalCajaComponent />
      </div>
      <div className="bg-gray-800 rounded-2xl">
        {/* <TipoClient/> */}

      {/* <BuscarCaja /> */}
      </div>
    </div>
  );
}
