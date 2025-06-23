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

interface TransferenciasState {
  allTransfer: Transferencia[];
  transferByDate: Transferencia[];
  transferBySalesman: Transferencia[];
  transferLoading: number;
  loading: boolean;
  error: string | null;
  getAllTransfer: () => Promise<void>;
  changeStateTransfer: (id: number, status: string) => Promise<void>;
  createTransfer: (formData: FormData) => Promise<void>;
  setTransferencias: (data: Transferencia[]) => void;
   setTransferLoading: () => void;

}
interface StateTransfer {
  id: number;
  status: string;
}

export const useTransferenciasStore = create<TransferenciasState>((set) => ({
  allTransfer: [],
  transferByDate: [],
  transferByStatus: [],
  transferBySalesman: [],
  transferLoading:0,
  loading: false,
  error: null,

  getAllTransfer: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API}/getAllTransfers`);
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      const data: Transferencia[] = await res.json();
      // console.log("TRANSFERENCIA DATA",data);

      set({ allTransfer: data, loading: false });
    } catch (err) {
      let message = "Error desconocido";
      if (err instanceof Error) {
        message = err.message;
      }
      set({
        error: message,
        loading: false,
      });
    }
  },
  createTransfer: async (formData: FormData) => {
    try {
      const res = await fetch(`${API}/createTransfer`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      const newTransfer: Transferencia = await res.json();

      // Actualizar el estado con la nueva transferencia
      set((state) => ({
        allTransfer: [...state.allTransfer, newTransfer],
        transferLoading: state.transferLoading + 1,
      }));
    } catch (error) {
      let message = "Error desconocido";
      if (error instanceof Error) message = error.message;
      set({ error: message });
    }
  },

    setTransferLoading: () => set({ transferLoading: 0 }),

  changeStateTransfer: async (id: number, status: string) => {
    set({ loading: true, error: null });
    const payload: StateTransfer = { id, status };

    try {
      const res = await fetch(`${API}/changeStateTransfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // ✅ El body va fuera de headers
      });

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

      const updatedTransfer: Transferencia = await res.json();

      // ✅ Actualiza solo la transferencia modificada, sin reemplazar todo el array
      set((state) => ({
        allTransfer: state.allTransfer.map((t) =>
          t.id === updatedTransfer.id ? updatedTransfer : t
        ),
        loading: false,
      }));
    } catch (err) {
      let message = "Error desconocido";
      if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, loading: false });
    }
  },

  setTransferencias: (data) => set({ allTransfer: data }),
}));
