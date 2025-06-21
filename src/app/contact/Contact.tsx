"use client"
import Image from "next/image";
import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Mail,
  MapPin,
  Phone,
  ChevronDown,
  BarChart3,
  Clock,
  Shield,
  Database,
  LineChart,
  CheckCircle2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import icon from "./../favicon.ico";

export default function ContactPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-[#00184a] text-white">
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-slate-900 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-2xl">
            <Image src={icon} alt="Logo" width={45} height={45} />
          <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-wide">
            Rendix
          </h1>
          </div>
          <Link href="/">
            <div className="flex items-center px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700  text-white ">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 container py-12 bg-gradient-to-b from-[#1e469d] to-[#122b70] rounded-lg shadow-inner">
        <h1 className="text-3xl font-bold mb-8 text-center">Contacto</h1>

        <div className="mb-8 border rounded-lg shadow-sm p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent inline-block">
              ¿Por qué contratar nuestro sistema?
            </h2>
            <p className="text-lg text-gray-200">
              Descubre cómo Rendix puede transformar la gestión financiera de tu empresa
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <BarChart3 className="h-6 w-6 text-primary" />, title: "Optimización Operativa",
                description: "Automatiza el registro y control de transferencias, mejorando significativamente la eficiencia operativa y reduciendo errores."
              },
              {
                icon: <Clock className="h-6 w-6 text-primary" />, title: "Información en Tiempo Real",
                description: "Accede de manera rápida y directa a información financiera actualizada, facilitando la toma de decisiones."
              },
              {
                icon: <Shield className="h-6 w-6 text-primary" />, title: "Seguridad y Trazabilidad",
                description: "Seguimiento detallado y transparente de cada transacción, reduciendo riesgos de fraude o mal manejo de información."
              },
              {
                icon: <Database className="h-6 w-6 text-primary" />, title: "Integridad de Datos",
                description: "Elimina la desorganización y duplicidad de datos, garantizando registros precisos y fiables."
              },
              {
                icon: <LineChart className="h-6 w-6 text-primary" />, title: "Escalabilidad",
                description: "Ideal para manejar grandes volúmenes de datos sin perder eficiencia, optimizando recursos operativos."
              },
              {
                icon: <CheckCircle2 className="h-6 w-6 text-primary" />, title: "Resultados Garantizados",
                description: "Incrementa la eficiencia, precisión y transparencia en la gestión financiera de tu empresa."
              },
            ].map((item, i) => (
              <div key={i} className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-600 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full mr-3">{item.icon}</div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                </div>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-lg mb-6 max-w-3xl mx-auto text-gray-200">
              Nuestro sistema está diseñado para optimizar y automatizar el registro y control de las transferencias,
              mejorando significativamente la eficiencia operativa y garantizando una gestión financiera transparente y precisa.
            </p>
            <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-700 transition-all group">
              Quiero más información
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${showForm ? "rotate-180" : ""}`} />
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
                <div className="border rounded-lg shadow-sm p-6 bg-gray-800">
                  <h3 className="text-xl font-semibold mb-2">Información de Contacto</h3>
                  <p className="mb-4 text-gray-300">Estamos aquí para ayudarte</p>
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

      <footer className="w-full border-t py-6 text-white">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <p className="text-center text-sm text-gray-400 md:text-left">
            &copy; {new Date().getFullYear()} Rendix. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 text-gray-300">
            <Link href="/terms" className="text-sm underline-offset-4 hover:underline">
              Términos
            </Link>
            <Link href="/privacy" className="text-sm underline-offset-4 hover:underline">
              Privacidad
            </Link>
            <Link href="/contact" className="text-sm underline-offset-4 hover:underline">
              Contacto
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
