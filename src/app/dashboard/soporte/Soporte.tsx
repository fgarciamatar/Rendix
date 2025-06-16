"use client";

import {
  BookText,
  ChevronDown,
  ChevronUp,
  FileQuestion,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";

export default function SoportePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"soporte" | "faq" | "doc">("faq");
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    message: "",
    category: "",
    cel: 0,
  });

  const faqs = [
    {
      question: "¿Cómo registro una nueva transferencia?",
      answer:
        'Para registrar una nueva transferencia, ve a la sección "Transferencias"...',
    },
    {
      question: "¿Cómo puedo ver el estado de mis transferencias?",
      answer:
        "En la misma sección de Transferencias, encontrarás una tabla con el estado actualizado de cada envío.",
    },
    {
      question: "¿Cómo funciona la planilla de caja?",
      answer:
        "La planilla de caja permite registrar los ingresos y egresos diarios.",
    },
    {
      question: "¿Cómo puedo cambiar mi contraseña?",
      answer:
        "Dirígete a tu perfil, haz clic en 'Cambiar contraseña', ingresa tu contraseña actual y luego la nueva.",
    },
    {
      question: "¿Qué hago si una transferencia es rechazada?",
      answer:
        "Contactate con tu supervisor o el responsable de verificar las transferencias.",
    },
  ];

  const handleToggle = (index: number) => {
    setOpenQuestion((prev) => (prev === index ? null : index));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, category: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      alert(
        `Mensaje enviado!\nNombre: ${formData.name}\nEmpresa: ${formData.company}`
      );
      setFormData({ name: "", company: "", message: "", cel: 0, category: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 sm:px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center sm:text-left">
          Centro de Soporte
        </h1>
        <p className="text-gray-300 mb-6 text-center sm:text-left">
          Obtén ayuda y resuelve tus dudas sobre el sistema Rendix.
        </p>

        <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-6">
          {[
            {
              label: "Contactar Soporte",
              value: "soporte",
              icon: MessageSquare,
            },
            { label: "Preguntas Frecuentes", value: "faq", icon: FileQuestion },
            { label: "Documentación", value: "doc", icon: BookText },
          ].map(({ label, value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setActiveTab(value as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition focus:outline-none text-sm sm:text-base ${
                activeTab === value
                  ? "bg-gradient-to-b from-[#1e469d] to-[#122b70] border border-white text-white shadow-lg"
                  : "bg-gradient-to-b from-[#1e469d]/60 to-[#122b70]/60 text-white border border-transparent hover:border-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        {activeTab === "faq" && (
          <div className="bg-gradient-to-b from-[#1e469d] to-[#122b70] p-4 sm:p-6 rounded-md border border-white shadow-md">
            <h2 className="text-2xl font-semibold mb-3">
              Preguntas Frecuentes
            </h2>
            <p className="text-sm text-white/80 mb-5">
              Encuentra respuestas a las preguntas más comunes sobre el sistema
              Rendix.
            </p>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-white/20 rounded-md p-4 bg-[#15397d]"
                >
                  <button
                    onClick={() => handleToggle(index)}
                    className="flex justify-between items-center w-full text-left font-semibold text-white hover:text-white/90 transition"
                  >
                    {faq.question}
                    {openQuestion === index ? (
                      <ChevronUp className="w-5 h-5 text-white/70" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white/70" />
                    )}
                  </button>
                  {openQuestion === index && (
                    <p className="mt-3 text-sm text-white/90 leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-center text-white/70">
              ¿No encontrás lo que buscás?{" "}
              <span
                className="text-blue-300 hover:underline cursor-pointer"
                onClick={() => setActiveTab("soporte")}
              >
                Contactá a nuestro equipo de soporte.
              </span>
            </p>
          </div>
        )}

        {activeTab === "doc" && (
          <div className="bg-gradient-to-b from-[#1e469d] to-[#122b70] p-8 rounded-md border border-white shadow-md text-center text-white/80">
            <p>La documentación estará disponible próximamente.</p>
          </div>
        )}

        {activeTab === "soporte" && (
          <div className="bg-gradient-to-b from-[#1e469d] to-[#122b70] p-6 sm:p-8 rounded-md border border-white shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Contactar Soporte
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                {
                  label: "Nombre y apellido",
                  name: "name",
                  type: "text",
                  placeholder: "Tu nombre y apellido",
                },
                {
                  label: "Empresa",
                  name: "company",
                  type: "text",
                  placeholder: "Tu empresa",
                },
                {
                  label: "Tu número de WhatsApp",
                  name: "cel",
                  type: "text",
                  placeholder: "Ejemplo: 3512345678",
                },
              ].map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="block mb-1 font-medium text-white"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    required
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className="w-full rounded-md border border-white/50 bg-[#15397d] px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              ))}

              <div className="w-full">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Categoría
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleSelectChange}
                  className="block w-full rounded-md border border-white/50 bg-[#15397d] px-2 py-2 text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="technical">Problema técnico</option>
                  <option value="account">Cuenta y acceso</option>
                  <option value="billing">Cambio de Contraseña</option>
                  <option value="feature">Solicitud de funcionalidad</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block mb-1 font-medium text-white"
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-white/50 bg-[#15397d] px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Describí tu problema o consulta..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-[#0f172a] font-semibold py-2 rounded-md hover:bg-gray-200 transition disabled:opacity-60"
              >
                {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
