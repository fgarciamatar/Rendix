import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL_LOCAL;

// Rutas permitidas por cada rol
const roleAccess: Record<string, string[]> = {
  admin: [
    "/dashboard",
    "/dashboard/caja",
    "/dashboard/preventistas",
    "/dashboard/transferencias",
    "/dashboard/perfil",
    "/dashboard/soporte",
  ],
  cashier: [
    "/dashboard",
    "/dashboard/caja",
    "/dashboard/preventistas",
    "/dashboard/transferencias",
    "/dashboard/perfil",
    "/dashboard/soporte",
  ],
  salesman: [
    "/dashboard",
    "/dashboard/transferencias",
    "/dashboard/perfil",
    "/dashboard/soporte",
  ],
};

export async function middleware(request: NextRequest) {
  console.log("🔐 Middleware ejecutado");

  const token = request.cookies.get("token")?.value;

  if (!token) {
    console.log("🚫 Sin token, redirigiendo a login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const res = await fetch(`${API}/verify-token`, {
      method: "GET",
      headers: {
        Cookie: `token=${token}`, // reenviar la cookie manualmente
      },
    });

    if (!res.ok) {
      console.log("❌ Token inválido o expirado");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const data = await res.json();
    const role = data.user?.role;
    const pathname = new URL(request.url).pathname;

    if (!role || !roleAccess[role]) {
      console.log("⚠️ Rol no definido o inválido");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const allowedRoutes = roleAccess[role];

    // ✅ Esta línea permite subrutas como /dashboard/caja/ingresos
    const isAllowed = allowedRoutes.some((route) =>
      pathname === route || pathname.startsWith(`${route}/`)
    );

    if (!isAllowed) {
      console.log("⛔ Ruta no permitida para este rol:", pathname);
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("❗ Error en middleware:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Aplicar middleware a rutas protegidas
export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
