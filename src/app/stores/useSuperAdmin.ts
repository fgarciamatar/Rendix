import { create } from "zustand";

interface EmpresaData {
  name: string;
  superAdminId: number;
}

interface EmpresaDataGet {
  id: number;
  name: string;
  superAdminId: number;
  createdAt: string;
  updatedAt: string;
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

type UserEditData = {
  id: number;
  name: string;
  lastName: string;
  dni: number;
  companyName: string;
  role: string;
  password: string;
  status: string;
};

type UserDataDelete = {
  name: string;
  id: number;
};

interface UserDataGet {
  id: number;
  name: string;
  lastName: string;
  role: string;
  status: string;
  companyId: number;
}

interface SuperAdminState {
  access: boolean;
  usuarios: UserDataGet[];
  setAccess: (val: boolean) => void;

  sendPin: () => Promise<
    { success: true; message: string } | { success: false; error: string }
  >;
  verifyPin: (
    pin: string
  ) => Promise<{ success: true } | { success: false; error: string }>;

  crearEmpresa: (
    data: EmpresaData
  ) => Promise<
    { success: true; message: string } | { success: false; error: string }
  >;
  editarEmpresa: (
    data: EmpresaData
  ) => Promise<
    { success: true; message: string } | { success: false; error: string }
  >;
  eliminarEmpresa: (data: {
    name: string;
  }) => Promise<
    { success: true; message: string } | { success: false; error: string }
  >;
  traerEmpresas: () => Promise<
    | { success: true; message: string; empresas: EmpresaDataGet[] }
    | { success: false; error: string }
  >;
  // Usuarios
  crearUsuario: (
    data: UserData
  ) => Promise<
    { success: true; message: string } | { success: false; error: string }
  >;
  editarUsuario: (
    data: UserEditData
  ) => Promise<
    { success: true; message: string } | { success: false; error: string }
  >;
  eliminarUsuario: (
    data: UserDataDelete
  ) => Promise<
    { success: true; message: string } | { success: false; error: string }
  >;
  traerUsuarios: (
    companyName: string
  ) => Promise<
    | { success: true; message: string; usuarios: UserDataGet[] }
    | { success: false; error: string }
  >;
}

const API = process.env.NEXT_PUBLIC_API_URL_LOCAL;
export const useSuperAdmin = create<SuperAdminState>((set) => ({
  access: false,
  usuarios: [],
  setAccess: (val: boolean) => set({ access: val }),

  sendPin: async () => {
    try {
      const res = await fetch(`${API}/sendPIN`);
      return { success: true, message: "PIN enviado al email.", res };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      return { success: false, error: message };
    }
  },

  verifyPin: async (pin: string) => {
    try {
      const res = await fetch(`${API}/verifyPIN`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const data: { valid: boolean; error?: string } = await res.json();

      if (!res.ok || !data.valid) {
        throw new Error(data.error || "PIN incorrecto");
      }

      set({ access: true });
      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      return { success: false, error: message };
    }
  },

  //EMPRESAS
  crearEmpresa: async (data) => {
    try {
      const res = await fetch(`${API}/createCompany`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      return {
        success: true,
        message: result.message,
        empresa: result.company,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al crear empresa";
      return { success: false, error: message };
    }
  },
  editarEmpresa: async (data) => {
    try {
      const res = await fetch(`${API}/editCompany`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      return {
        success: true,
        message: result.message,
        empresa: result.company,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al editar empresa";
      return { success: false, error: message };
    }
  },

  eliminarEmpresa: async (name) => {
    try {
      const res = await fetch(`${API}/deleteCompany`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }), // enviar nombre por body
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      return {
        success: true,
        message: result.message,
        empresa: result.company,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al eliminar empresa";
      return { success: false, error: message };
    }
  },
  traerEmpresas: async () => {
    try {
      const res = await fetch(`${API}/getCompanies`);
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      console.log("data", result.companies);

      return {
        success: true,
        message: result.message,
        empresas: result.companies,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al traer las empresas";
      return { success: false, error: message };
    }
  },

  // USUARIOS
  crearUsuario: async (data) => {
    const usuarioData = {
      ...data,
      id: Number(data.id), // 🔄 Aseguramos que id sea number
    };
    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioData),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      return {
        success: true,
        message: result.message,
        usuario: result.user,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al crear usuario";
      return { success: false, error: message };
    }
  },

  editarUsuario: async (data) => {
    const usuarioData = {
      ...data,
      status: data.status || "active",
      dni: Number(data.dni),
      id: Number(data.id), // 🔄 Aseguramos que id sea number
    };
    console.log("data", usuarioData);

    try {
      const res = await fetch(`${API}/editUser`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioData), // { id: 1, name: 'nuevo nombre' }
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      return {
        success: true,
        message: result.message,
        usuario: result.user,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al editar usuario";
      return { success: false, error: message };
    }
  },

  eliminarUsuario: async (data) => {
    const usuarioData = {
      ...data,
      id: Number(data.id), // 🔄 Aseguramos que id sea number
    };
    try {
      const res = await fetch(`${API}/deleteUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioData), // enviar id por body
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      return {
        success: true,
        message: result.message,
        usuario: result.user,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al eliminar usuario";
      return { success: false, error: message };
    }
  },

  traerUsuarios: async (companyName) => {
    try {
      const res = await fetch(`${API}/getUsers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName }), // enviar id por body
      });

      const result = await res.json();
      // console.log("result", result);

      if (!res.ok) throw new Error(result.error);
       set({ usuarios: result.userList });
      //  console.log("result",result.userList);
       
      return {
        success: true,
        message: result.message,
        usuarios: result.userList,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al traer los usuarios";
      return { success: false, error: message };
    }
  },
}));
