import { ArrowRight, BarChart3, SlidersHorizontal, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import icon from "./favicon.ico";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0f1c] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#243B85] bg-[#243B85]/95 backdrop-blur supports-[backdrop-filter]:bg-[#2A4080]/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Image src={icon} alt="Logo" width={50} height={50} />
            <span>Rendix</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-md px-4 py-2"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        {/* Sección principal */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-[#1f3f8f] to-[#0f172a]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
              {/* Texto principal */}
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Sistema de Gestión de Transferencias y de Planillas de Cajas.
                </h1>
                <p className="max-w-[600px] text-gray-400 md:text-xl">
                  Plataforma integral para el registro, seguimiento y control de
                  transferencias, y para la gestión eficiente de cajas.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/login"
                    className="flex items-center gap-2 rounded-md bg-[#3b82f6] hover:bg-[#2563eb] px-4 py-2"
                  >
                    Comenzar ahora <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                   href="/contact"
                    className="rounded-md border border-[#1a2035] text-white hover:bg-[#1a2035] px-4 py-2"
                  >
                    Contáctanos
                  </Link>
                </div>
              </div>

              {/* "Tarjeta" de transferencias recientes */}
              <div className="flex justify-center">
                <div className="relative w-full max-w-[500px] rounded-xl border border-[#1a2035] bg-[#0f172a] p-6 shadow-lg">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">
                          Transferencias recientes
                        </h3>
                        <p className="text-sm text-gray-400">
                          Últimas 24 horas
                        </p>
                      </div>
                      <BarChart3 className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      {[
                        {
                          status: "Aprobada",
                          amount: "$15,000.00",
                          date: "Hoy, 10:30",
                          color: "text-green-500",
                        },
                        {
                          status: "Pendiente",
                          amount: "$8,750.50",
                          date: "Hoy, 09:15",
                          color: "text-amber-500",
                        },
                        {
                          status: "Rechazada",
                          amount: "$3,200.00",
                          date: "Ayer, 16:45",
                          color: "text-red-500",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border border-[#1a2035] p-3"
                        >
                          <div className="space-y-0.5">
                            <div className="font-medium">{item.amount}</div>
                            <div className="text-xs text-gray-400">
                              {item.date}
                            </div>
                          </div>
                          <div className={`text-sm ${item.color}`}>
                            {item.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de características */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#0a0f1c]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Características principales
                </h2>
                <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Nuestra plataforma ofrece todas las herramientas necesarias
                  para registrar y controlar eficientemente las transferencias
                  bancarias.
                </p>
              </div>
            </div>

            <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <Upload className="h-10 w-10" />,
                  title: "Registro de Transferencias",
                  description:
                    "El sistema permite un seguimiento preciso de las transferencias realizadas por preventistas o consumidores finales, incluyendo el registro de los comprobantes correspondientes.",
                },

                {
                  icon: <BarChart3 className="h-10 w-10" />,
                  title: "Panel de Control",
                  description:
                    "Mejora el proceso de seguimiento de las transferencias y las planillas de caja, asegurando un control más eficiente y claro de los movimientos financieros.",
                },
                {
                  icon: <SlidersHorizontal className="h-10 w-10" />,
                  title: "PLanillas de cajas",
                  description:
                    "Facilita la automatización de las planillas de caja, eliminando la necesidad de realizar registros manuales, lo que optimiza el proceso y reduce posibles errores.",
                },
              ].map((feature, index) => (
                <button
                  key={index}
                  className="w-full rounded-lg border border-[#1a2035] bg-[#0f172a] p-6 text-left shadow-md transition-colors hover:bg-[#1a2035]"
                >
                  <div className="mb-4 w-fit rounded-lg bg-[#3b82f6]/10 p-2 text-[#3b82f6]">
                    {feature.icon}
                  </div>
                  <h2 className="mb-2 text-xl font-semibold">
                    {feature.title}
                  </h2>
                  <p className="text-gray-400">{feature.description}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t py-6  border-[#243B85] bg-[#243B85]/95 backdrop-blur supports-[backdrop-filter]:bg-[#2A4080]/60">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-center md:text-left text-base text-gray-400 tracking-wide mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Rendix. Todos los derechos
            reservados.
          </p>
          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <Link
              href="/contact"
              className="text-base text-gray-400 hover:text-white transition"
            >
              Contacto
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
