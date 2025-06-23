export type Filtro = "Todas" | "Pendientes" | "En Revisión" | "Aprobadas" | "Rechazadas";

export const mapFiltroToEstado = (f: Filtro): string | null => {
  switch (f) {
    case "Pendientes":
      return "pending";
    case "En Revisión":
      return "review";
    case "Aprobadas":
      return "approved";
    case "Rechazadas":
      return "rejected";
    default:
      return null;
  }
};

export const traducirEstado = (estado: string): string => {
  switch (estado.toLowerCase()) {
    case "pending":
      return "Pendiente";
    case "review":
      return "Revisión";
    case "approved":
      return "Aprobada";
    case "rejected":
      return "Rechazada";
    default:
      return estado;
  }
};


export function traducirRole(role: string | undefined): string {
  switch (role) {
    case "admin":
      return "Administrador";
    case "salesman":
      return "Preventista";
    case "cashier":
      return "Cajero";
    default:
      return role || "-";
  }
}

export function traducirStatus(status: string | undefined): string {
  switch (status) {
    case "active":
      return "Activo";
    case "inactive":
      return "Inactivo";
    case "pending":
      return "Pendiente";
    default:
      return status || "-";
  }
}
