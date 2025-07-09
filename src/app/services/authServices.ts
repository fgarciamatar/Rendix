const API = process.env.NEXT_PUBLIC_API_URL_LOCAL;

export const refreshToken = async (): Promise<void> => {
  try {
    const res = await fetch(`${API}/refresh-token`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Error al renovar token");

    const data = await res.json();
    console.log("🔁 Token renovado:", data.message);
  } catch (err) {
    console.error("❌ No se pudo renovar el token:", err);
    // Si querés forzar logout, podés llamarlo acá
  }
};
