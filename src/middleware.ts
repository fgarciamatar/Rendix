import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL_LOCAL;

// Rutas permitidas por cada rol
const roleAccess: Record<string, string[]> = {
  admin: ["/dashboard","/dashboard/caja", "/dashboard/preventistas", "/dashboard/transferencias", "/dashboard/perfil", "/dashboard/soporte"],
  cashier: ["/dashboard","/dashboard/caja", "/dashboard/preventistas" ,"/dashboard/transferencias", "/dashboard/perfil", "/dashboard/soporte"],
  salesman: ["/dashboard", "/dashboard/transferencias", "/dashboard/perfil", "/dashboard/soporte"],
};
export async function middleware(request: NextRequest) {
  console.log("Middleware triggered");

  try {
    const token = request.cookies.get("token");
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const res = await fetch(`${API}/verify-token`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const data = await res.json();
    const role = data.user?.role;
    
    if (!role) {
      return NextResponse.redirect(new URL("/login", request.url));
    } 
    
    const pathname = new URL(request.url).pathname;

    const allowedRoutes = roleAccess[role];

    const isAllowed =
      allowedRoutes.includes("*") || allowedRoutes.includes(pathname);

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"], // rutas que querés proteger
};
