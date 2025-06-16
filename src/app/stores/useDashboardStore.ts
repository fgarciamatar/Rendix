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

interface TransferStadistics {
  montoTotal: number;
  totalProcesadas: number;
  tasaExito: number;
  totalPendientes: number;
  totalRechazadas: number;
  porcentajeRechazadas: number;
  totalAprobadas: number;
  porcentajeAprobadas: number;
}

interface DailyStatusData {
  date: string;
  approved: number;
  pending: number;
  rejected: number;
}

interface BankDistribution {
  bank: string;
  count: number;
  amount: number;
  percent: number;
}

interface TopPreventistas {
  preventista: string;
  transferTotal: number;
  posicion: number;
  percent: number;
  amount: number;
}

interface TransferenciasState {
  allTransfer: Transferencia[];
  transferStadistics: TransferStadistics | null;
  loading: boolean;
  error: string | null;
  dailyStatusData: DailyStatusData[];
  bankDistribution: BankDistribution[];
  topPreventistas?: TopPreventistas[];

  getTransferStadistics: () => Promise<void>;
  getTransferStadisticsPreventista: (salesman:string) => Promise<void>;
}

export const useDashboard = create<TransferenciasState>((set) => ({
  allTransfer: [],
  transferStadistics: null,
  loading: false,
  error: null,
  dailyStatusData: [],
  bankDistribution: [],
  topPreventistas: [], // <--- falta agregar esto por defecto

  getTransferStadistics: async () => {
    set({ loading: true, error: null });
    try {
      const transferenciasRes = await fetch(`${API}/getAllTransfers`);
      if (!transferenciasRes.ok)
        throw new Error(`Error HTTP: ${transferenciasRes.status}`);

      const dataTransfer: Transferencia[] = await transferenciasRes.json();

      const getDailyStatusData = (): DailyStatusData[] => {
        const dateMap = new Map<string, DailyStatusData>();

        dataTransfer.forEach((t) => {
          const date = new Date(t.dateTransfer).toISOString().split("T")[0];
          if (!dateMap.has(date)) {
            dateMap.set(date, {
              date,
              approved: 0,
              pending: 0,
              rejected: 0,
            });
          }

          const entry = dateMap.get(date)!;
          if (t.status === "approved") entry.approved += 1;
          else if (t.status === "pending") entry.pending += 1;
          else if (t.status === "rejected") entry.rejected += 1;
        });

        return Array.from(dateMap.values())
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .slice(-30);
      };

      // console.log("DATA TRANSFER", dataTransfer);

      const resumen = (): TransferStadistics => {
        const montoTotal = dataTransfer.reduce(
          (sum, t) => sum + Number(t.amount),
          0
        );
        // console.log("MONTO TOTAL", montoTotal);

        const totalProcesadas = dataTransfer.filter(
          (t) => t.status !== "pending" && t.status !== "review"
        ).length;
        const totalAprobadas = dataTransfer.filter(
          (t) => t.status === "approved"
        ).length;
        const totalRechazadas = dataTransfer.filter(
          (t) => t.status === "rejected"
        ).length;
        const totalPendientes = dataTransfer.filter(
          (t) => t.status === "pending"
        ).length;

        const tasaExito =
          totalProcesadas > 0 ? (totalAprobadas / totalProcesadas) * 100 : 0;

        const porcentajeRechazadas =
          totalProcesadas > 0 ? (totalRechazadas / totalProcesadas) * 100 : 0;
        const porcentajeAprobadas =
          totalProcesadas > 0 ? (totalAprobadas / totalProcesadas) * 100 : 0;

        return {
          montoTotal,
          totalProcesadas,
          tasaExito,
          totalPendientes,
          totalRechazadas,
          porcentajeRechazadas,
          totalAprobadas,
          porcentajeAprobadas,
        };
      };

      const calculateBankDistribution = (): BankDistribution[] => {
        const bankMap = new Map<string, { count: number; amount: number }>();
        const totalCount = dataTransfer.length;

        dataTransfer.forEach((t) => {
          const bank = t.destinationBank || "Desconocido";
          const entry = bankMap.get(bank) || { count: 0, amount: 0 };
          entry.count += 1;
          entry.amount += Number(t.amount);
          bankMap.set(bank, entry);
        });

        return Array.from(bankMap.entries())
          .map(([bank, { count, amount }]) => ({
            bank,
            count,
            amount,
            percent: Number(((count / totalCount) * 100).toFixed(1)),
          }))
          .sort((a, b) => b.count - a.count);
      };

      const topPreventistas = (): TopPreventistas[] => {
        const preventistaMap = new Map<
          string,
          { total: number; count: number }
        >();
        const totalCount = dataTransfer.length;

        dataTransfer.forEach((t) => {
          const preventista = t.salesman || "Desconocido";
          const entry = preventistaMap.get(preventista) || {
            total: 0,
            count: 0,
          };
          entry.total += Number(t.amount);
          entry.count += 1;
          preventistaMap.set(preventista, entry);
        });

        return Array.from(preventistaMap.entries())
          .map(([preventista, { total, count }]) => ({
            preventista,
            transferTotal: count,
            posicion: 0, // temporal, se asigna luego
            percent: Number(((count / totalCount) * 100).toFixed(1)),
            amount: total,
          }))
          .sort((a, b) => b.transferTotal - a.transferTotal)
          .map((item, index) => ({
            ...item,
            posicion: index + 1,
          }));
      };

      set({
        allTransfer: dataTransfer,
        transferStadistics: resumen(),
        dailyStatusData: getDailyStatusData(),
        bankDistribution: calculateBankDistribution(),
        topPreventistas: topPreventistas(), // <--- faltaba este set
        loading: false,
      });
    } catch (err) {
      let message = "Error desconocido";
      if (err instanceof Error) message = err.message;
      set({ error: message, loading: false });
    }
  },
  getTransferStadisticsPreventista: async (salesman) => {
    set({ loading: true, error: null });
    try {
      const transferenciasRes = await fetch(`${API}/getAllTransfers`);
      if (!transferenciasRes.ok)
        throw new Error(`Error HTTP: ${transferenciasRes.status}`);

      const dataTransfer: Transferencia[] = await transferenciasRes.json();

      const dataTransferPreventista = dataTransfer.filter(
  (t) => t.salesman && t.salesman.toLowerCase() === salesman.toLowerCase()
);


      const getDailyStatusData = (): DailyStatusData[] => {
        const dateMap = new Map<string, DailyStatusData>();

        dataTransferPreventista.forEach((t) => {
          const date = new Date(t.dateTransfer).toISOString().split("T")[0];
          if (!dateMap.has(date)) {
            dateMap.set(date, {
              date,
              approved: 0,
              pending: 0,
              rejected: 0,
            });
          }

          const entry = dateMap.get(date)!;
          if (t.status === "approved") entry.approved += 1;
          else if (t.status === "pending") entry.pending += 1;
          else if (t.status === "rejected") entry.rejected += 1;
        });

        return Array.from(dateMap.values())
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .slice(-30);
      };

      // console.log("DATA TRANSFER", dataTransfer);

      const resumen = (): TransferStadistics => {
        const montoTotal = dataTransferPreventista.reduce(
          (sum, t) => sum + Number(t.amount),
          0
        );
        // console.log("MONTO TOTAL", montoTotal);

        const totalProcesadas = dataTransferPreventista.filter(
          (t) => t.status !== "pending" && t.status !== "review"
        ).length;
        const totalAprobadas = dataTransferPreventista.filter(
          (t) => t.status === "approved"
        ).length;
        const totalRechazadas = dataTransferPreventista.filter(
          (t) => t.status === "rejected"
        ).length;
        const totalPendientes = dataTransferPreventista.filter(
          (t) => t.status === "pending"
        ).length;

        const tasaExito =
          totalProcesadas > 0 ? (totalAprobadas / totalProcesadas) * 100 : 0;

        const porcentajeRechazadas =
          totalProcesadas > 0 ? (totalRechazadas / totalProcesadas) * 100 : 0;
        const porcentajeAprobadas =
          totalProcesadas > 0 ? (totalAprobadas / totalProcesadas) * 100 : 0;

        return {
          montoTotal,
          totalProcesadas,
          tasaExito,
          totalPendientes,
          totalRechazadas,
          porcentajeRechazadas,
          totalAprobadas,
          porcentajeAprobadas,
        };
      };

      const calculateBankDistribution = (): BankDistribution[] => {
        const bankMap = new Map<string, { count: number; amount: number }>();
        const totalCount = dataTransferPreventista.length;

        dataTransferPreventista.forEach((t) => {
          const bank = t.destinationBank || "Desconocido";
          const entry = bankMap.get(bank) || { count: 0, amount: 0 };
          entry.count += 1;
          entry.amount += Number(t.amount);
          bankMap.set(bank, entry);
        });

        return Array.from(bankMap.entries())
          .map(([bank, { count, amount }]) => ({
            bank,
            count,
            amount,
            percent: Number(((count / totalCount) * 100).toFixed(1)),
          }))
          .sort((a, b) => b.count - a.count);
      };

      const topPreventistas = (): TopPreventistas[] => {
        const preventistaMap = new Map<
          string,
          { total: number; count: number }
        >();
        const totalCount = dataTransferPreventista.length;

        dataTransferPreventista.forEach((t) => {
          const preventista = t.salesman || "Desconocido";
          const entry = preventistaMap.get(preventista) || {
            total: 0,
            count: 0,
          };
          entry.total += Number(t.amount);
          entry.count += 1;
          preventistaMap.set(preventista, entry);
        });

        return Array.from(preventistaMap.entries())
          .map(([preventista, { total, count }]) => ({
            preventista,
            transferTotal: count,
            posicion: 0, // temporal, se asigna luego
            percent: Number(((count / totalCount) * 100).toFixed(1)),
            amount: total,
          }))
          .sort((a, b) => b.transferTotal - a.transferTotal)
          .map((item, index) => ({
            ...item,
            posicion: index + 1,
          }));
      };

      set({
        allTransfer: dataTransferPreventista,
        transferStadistics: resumen(),
        dailyStatusData: getDailyStatusData(),
        bankDistribution: calculateBankDistribution(),
        topPreventistas: topPreventistas(), 
        loading: false,
      });
    } catch (err) {
      let message = "Error desconocido";
      if (err instanceof Error) message = err.message;
      set({ error: message, loading: false });
    }
  },
}));
