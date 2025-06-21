"use client";
import React, { useState } from "react";

const buttonStyles = {
  base: "px-6 py-3 rounded-xl text-white font-semibold shadow-md transition transform hover:scale-105 active:scale-95 text-lg",
  hogar: "bg-blue-600 hover:bg-blue-700",
  gastronomicos: "bg-green-600 hover:bg-green-700",
  negocios: "bg-purple-600 hover:bg-purple-700",
};

export const TipoClient: React.FC = () => {
  const [hogar, setHogar] = useState(0);
  const [gastronomicos, setGastronomicos] = useState(0);
  const [negocios, setNegocios] = useState(0);

  const total = hogar + gastronomicos + negocios;

  return (
    <div className="flex flex-col items-center gap-8 p-6 bg-gray-900 text-white rounded-2xl max-w-md mx-auto">
      <h2 className="text-2xl font-bold">Tipo de Cliente</h2>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setHogar(hogar + 1)}
          className={`${buttonStyles.base} ${buttonStyles.hogar}`}
        >
          Hogar ({hogar})
        </button>
        <button
          onClick={() => setGastronomicos(gastronomicos + 1)}
          className={`${buttonStyles.base} ${buttonStyles.gastronomicos}`}
        >
          Gastronómicos ({gastronomicos})
        </button>
        <button
          onClick={() => setNegocios(negocios + 1)}
          className={`${buttonStyles.base} ${buttonStyles.negocios}`}
        >
          Negocios ({negocios})
        </button>
      </div>

      <div className="mt-6 text-xl font-medium text-gray-300">
        Total: <span className="text-white font-bold">{total}</span>
      </div>
    </div>
  );
};

export default TipoClient;
