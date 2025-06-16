import { create } from "zustand";

const API = process.env.NEXT_PUBLIC_API_URL_LOCAL;

interface Transferencia {
  id: number;
  amount: number;
  numberOperation: number;
  dateTransfer: string;
  dateOfLoading: string;
  clientName: string;
  clientNumber: number;
  salesman: string;
  destinationBank: string;
  originBank: string;
  status: string;
  receiptImage: string;
}

interface UserData {
  id: number;
  name: string;
  lastName: string;
  role: string;
  password: string;
  status: string;
  companyName: string;
}

interface UserTransferSummary {
  salesman: string;
  total: number;
  aprobadas: number;
  desaprobadas: number;
}

interface TransferenciasState {
  allTransfer: Transferencia[];
  totalTransfer: number;
  preventistas: UserData[];
  preventistasResumen: UserTransferSummary[];
  loading: boolean;
  error: string | null;
  PreventistasDetail: (companyName: string) => Promise<void>;
  DetailUltimo7: (companyName: string) => Promise<void>;
}

export const usePreventistas = create<TransferenciasState>((set) => ({
  allTransfer: [],
  totalTransfer: 0,
  preventistas: [],
  preventistasResumen: [],
  loading: false,
  error: null,
   allTransfer7: [],
  totalTransfer7: 0,
  preventistas7: [],
  preventistasResumen7: [],

  PreventistasDetail: async (companyName) => {
    set({ loading: true, error: null });

    try {
      // Traer transferencias
      const transferenciasRes = await fetch(`${API}/getAllTransfers`);
      if (!transferenciasRes.ok) throw new Error(`Error HTTP: ${transferenciasRes.status}`);
      const dataTransfer: Transferencia[] = await transferenciasRes.json();

      // Traer preventistas
      const preventistasRes = await fetch(`${API}/getUsers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName }),
      });
      if (!preventistasRes.ok) throw new Error(`Error HTTP: ${preventistasRes.status}`);
      const response = await preventistasRes.json();
      const dataPreventistas: UserData[] = response.userList;

      // console.log("DATA PREVENTISTAS:", dataPreventistas);

      // Calcular resumen por preventista
      const resumen: UserTransferSummary[] = dataPreventistas.map((user) => {
        const transfers = dataTransfer.filter((t) => t.salesman === user.name);
        const total = transfers.length;
        const aprobadas = transfers.filter((t) => t.status.toLowerCase() === "approved").length;
        const desaprobadas = transfers.filter((t) => t.status.toLowerCase() === "rejected").length;

        return {
          salesman: user.name,
          total,
          aprobadas,
          desaprobadas,
        };
      });

      set({
        preventistas: dataPreventistas,
        allTransfer: dataTransfer,
        totalTransfer: dataTransfer.length,
        preventistasResumen: resumen,
        loading: false,
      });
    } catch (err) {
      let message = "Error desconocido";
      if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, loading: false });
    }
  },
 DetailUltimo7: async (companyName) => {
  set({ loading: true, error: null });

  try {
    // Traer transferencias
    const transferenciasRes = await fetch(`${API}/getAllTransfers`);
    if (!transferenciasRes.ok) throw new Error(`Error HTTP: ${transferenciasRes.status}`);
    const dataTransfer: Transferencia[] = await transferenciasRes.json();

    // 👉 Calcular fecha hace 7 días
    const hoy = new Date();
    const hace7dias = new Date(hoy);
    hace7dias.setDate(hoy.getDate() - 7);

    // 👉 Filtrar transferencias de los últimos 7 días
    const transferenciasUltimos7 = dataTransfer.filter((t) => {
      const fecha = new Date(t.dateOfLoading); // Asegurate que esté en formato YYYY-MM-DD
      return fecha >= hace7dias && fecha <= hoy;
    });

    // Traer preventistas
    const preventistasRes = await fetch(`${API}/getUsers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyName }),
    });
    if (!preventistasRes.ok) throw new Error(`Error HTTP: ${preventistasRes.status}`);
    const response = await preventistasRes.json();
    const dataPreventistas: UserData[] = response.userList;

    // Calcular resumen por preventista
    const resumen: UserTransferSummary[] = dataPreventistas.map((user) => {
      const transfers = transferenciasUltimos7.filter((t) => t.salesman === user.name);
      const total = transfers.length;
      const aprobadas = transfers.filter((t) => t.status.toLowerCase() === "approved").length;
      const desaprobadas = transfers.filter((t) => t.status.toLowerCase() === "rejected").length;

      return {
        salesman: user.name,
        total,
        aprobadas,
        desaprobadas,
      };
    });

    set({
      preventistas: dataPreventistas,
        allTransfer: dataTransfer,
        totalTransfer: dataTransfer.length,
        preventistasResumen: resumen,
        loading: false,
    });
  } catch (err) {
    let message = "Error desconocido";
    if (err instanceof Error) {
      message = err.message;
    }
    set({ error: message, loading: false });
  }
}

}));
