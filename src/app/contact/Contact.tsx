"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Clock,
  Database,
  LineChart,
  Mail,
  MapPin,
  Phone,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import icon from "./../favicon.ico";

export default function ContactPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex min-h-screen flex-col text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#243B85] bg-[#243B85]/95 backdrop-blur supports-[backdrop-filter]:bg-[#2A4080]/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Image src={icon} alt="Logo" width={50} height={50} />
            <span>Rendix</span>
          </div>

          <Link href="/">
            <div className="flex items-center px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700  text-white ">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </div>
          </Link>
        </div>
      </header>

    <main className="flex-1 flex items-center justify-center flex-col py-12 bg-gradient-to-b rounded-lg shadow-inner text-center">


        <div className="mb-8 border rounded-lg shadow-sm p-6 bg-gradient-to-b from-[#1e469d] to-[#122b70]">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl bg-gradient-to-r from-primary to-blue-200 bg-clip-text  inline-block">
              ¿Por qué contratar nuestro sistema?
            </h2>
            <p className="text-lg text-gray-200">
              Descubre cómo Rendix puede transformar la gestión financiera de tu
              empresa
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <BarChart3 className="h-6 w-6 text-primary" />,
                title: "Optimización Operativa",
                description:
                  "Automatiza el registro y control de transferencias, mejorando significativamente la eficiencia operativa y reduciendo errores.",
              },
              {
                icon: <Clock className="h-6 w-6 text-primary" />,
                title: "Información en Tiempo Real",
                description:
                  "Accede de manera rápida y directa a información financiera actualizada, facilitando la toma de decisiones.",
              },
              {
                icon: <Shield className="h-6 w-6 text-primary" />,
                title: "Seguridad y Trazabilidad",
                description:
                  "Seguimiento detallado y transparente de cada transacción, reduciendo riesgos de fraude o mal manejo de información.",
              },
              {
                icon: <Database className="h-6 w-6 text-primary" />,
                title: "Integridad de Datos",
                description:
                  "Elimina la desorganización y duplicidad de datos, garantizando registros precisos y fiables.",
              },
              {
                icon: <LineChart className="h-6 w-6 text-primary" />,
                title: "Escalabilidad",
                description:
                  "Ideal para manejar grandes volúmenes de datos sin perder eficiencia, optimizando recursos operativos.",
              },
              {
                icon: <CheckCircle2 className="h-6 w-6 text-primary" />,
                title: "Resultados Garantizados",
                description:
                  "Incrementa la eficiencia, precisión y transparencia en la gestión financiera de tu empresa.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-600 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full mr-3">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                </div>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-lg mb-6 max-w-3xl mx-auto text-gray-200">
              Nuestro sistema está diseñado para optimizar y automatizar el
              registro y control de las transferencias, mejorando
              significativamente la eficiencia operativa y garantizando una
              gestión financiera transparente y precisa.
            </p>
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-900 transition-all group"
            >
              Quiero más información
              <ChevronDown
                className={`ml-2 h-4 w-4 transition-transform duration-200 ${
                  showForm ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid gap-8 md:grid-cols-2 mt-8">
                <div className="border rounded-lg shadow-sm p-10 bg-gradient-to-b from-[#1e469d] to-[#122b70]">
                  <h3 className="text-xl font-semibold mb-2">
                    Información de Contacto
                  </h3>
                  <p className="mb-4 text-gray-300 ">
                    Estamos aquí para ayudarte
                  </p>
                  <div className="space-y-4 text-gray-200">
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-primary" />
                      <span>Concepcion, Tucuman Argentina</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-primary" />
                      <span>+54 3865 568840</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-primary" />
                      <span>fgarciamatar@gmail.com</span>
                    </div>
                  </div>
                </div>

                {/* <ContactForm /> */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
