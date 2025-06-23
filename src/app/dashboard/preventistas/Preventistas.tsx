
import PreventistasTable from "@/app/components/Preventistas/PreventistasTable";
import React from "react";


export const Preventistas: React.FC = () => {
 

  return (
    <div className="p-6 text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Preventistas</h1>
          <p className="text-gray-400">
            Gestiona y visualiza todos los preventistas registrados en el sistema.
          </p>
        </div>
       
      </div>

     <div>
      <PreventistasTable/>
     </div>

     
    </div>
  );
};

// justo después de tu export const Transferencias…
export default Preventistas;
