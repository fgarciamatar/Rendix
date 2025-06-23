import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";

interface UserLogin {
  userName: string;
  password: string;
  companyName: string;
}

interface UserData {
  id: number;
  name: string;
  lastName: string;
  role: string;
  password: string;
  status: string;
  company: string;
}

interface LoginState {
  access: boolean;
  role: string;
  userData: UserData;
  setUserData: (data: UserData) => void;
  setAccess: (val: boolean) => void;
  setRole: (val: string) => void;
  login: (input: string, password: string) => Promise<boolean>;
  logout: () => Promise<Response | undefined>;
}

const API = process.env.NEXT_PUBLIC_API_URL_LOCAL;

// ✅ Session storage adaptado a PersistStorage<LoginState>
const sessionStorageProvider: PersistStorage<LoginState> = {
  getItem: (name) => {
    const value = sessionStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name, value) => {
    sessionStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    sessionStorage.removeItem(name);
  },
};

export const useLoginStore = create<LoginState>()(
  persist(
    (set) => ({
      access: false,
      role: "",
      userData: {
        id: 0,
        name: "",
        lastName: "",
        role: "",
        password: "",
        status: "",
        company: "",
      },

      setAccess: (val) => set({ access: val }),
      setRole: (val) => set({ role: val }),
      setUserData: (data) => set({ userData: data }),

      login: async (input: string, password: string) => {
        const [userName, companyName] = input.split("@");
        if (!userName || !companyName) throw new Error("Formato inválido");

        const payload: UserLogin = { userName, companyName, password };

        const res = await fetch(`${API}/login`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Login inválido");
        }

        const data = await res.json();

        set({ role: data.user.role });
        set({ userData: data.user });

        if (data.access) {
          set({ access: data.access });
        } else {
          throw new Error("Acceso denegado");
        }

        return data.access;
      },
logout: async () => {
  try {
    const res = await fetch(`${API}/logout`, {
      method: "POST",
      credentials: "include", // ✅ necesario para que envíe la cookie
    });

    if (res.ok) {
      // Limpiar estado global
      set({
        access: false,
        role: "",
        userData: {
          id: 0,
          name: "",
          lastName: "",
          role: "",
          password: "",
          status: "",
          company: "",
        },
      });

      // Limpiar sesión persistida
      sessionStorage.removeItem("UserAccess");

      // redirigir desde acá 
      // router.push("/login");

      return res;
    } else {
      console.error("❌ Error al cerrar sesión:", await res.text());
    }
  } catch (err) {
    console.error("⚠️ Error en logout:", err);
  }
},

    }),
    {
      name: "UserAccess",
      storage: sessionStorageProvider,
    }
  )
);
