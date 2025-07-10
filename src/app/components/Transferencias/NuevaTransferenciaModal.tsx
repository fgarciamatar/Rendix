"use client";

import { useLoginStore } from "@/app/stores/userLoginStore";
import { useTransferenciasStore } from "@/app/stores/useTransferenciasStore";
import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { createWorker } from "tesseract.js";
import MessageModal from "../ModalConfirm/MessageModal";

interface Props {
  onClose: () => void;
}

interface FormState {
  numberOperation: number;
  clientNumber: string;
  clientName: string;
  dateTransfer: string;
  dateOfLoading: string;
  amount: number;
  originBank: string;
  destinationBank: string;
}

interface ModalMessage {
  text: string;
  type?: "success" | "error";
}

export const NuevaTransferenciaModal: React.FC<Props> = ({ onClose }) => {
  const createTransfer = useTransferenciasStore(
    (state) => state.createTransfer
  );
  const user = useLoginStore((state) => state.userData);
  const today = new Date().toISOString().split("T")[0];

  const initialForm: FormState = {
    numberOperation:  "" as unknown as number,
    clientNumber: "",
    clientName: "",
    dateTransfer: "",
    dateOfLoading: today,
    amount: "" as unknown as number,
    originBank: "",
    destinationBank: "",
  };

  const [form, setForm] = useState<FormState>(initialForm);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalMessage, setModalMessage] = useState<ModalMessage | null>(null);
  const [showFullImage, setShowFullImage] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newValue =
      name === "numberOperation" || name === "amount" ? Number(value) : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      await extractTextFromImage(file);
    }
  };

  const extractTextFromImage = async (file: File) => {
    try {
      const worker = await createWorker("spa");
      const {
        data: { text: ocrText },
      } = await worker.recognize(file);

      console.log("Texto OCR:", ocrText);

      // 🟢 1. Número de operación (mejorado)
      const opRegex =
        /(N[ºo°\s:]?|(?:número\s+)?de\s+(?:operación|transacción))[:\s#]*([\d]{4,})/i;
      const opMatch = ocrText.match(opRegex);
      const numberOperation = opMatch?.[2] ? Number(opMatch[2]) : 0;

      // 🟢 2. Fecha con número o con nombre del mes
      const normalizeMonthName = (month: string): string => {
        const months: Record<string, string> = {
          enero: "01",
          febrero: "02",
          marzo: "03",
          abril: "04",
          mayo: "05",
          junio: "06",
          julio: "07",
          agosto: "08",
          septiembre: "09",
          octubre: "10",
          noviembre: "11",
          diciembre: "12",
        };
        return months[month.toLowerCase()] || "01";
      };

      let dateTransfer = "";

      // ➤ dd/mm/yyyy o dd-mm-yyyy
      const dateRegex = /(\d{2})[\/\-](\d{2})[\/\-](\d{4})/;
      const dateMatch = ocrText.match(dateRegex);
      if (dateMatch) {
        const [, day, month, year] = dateMatch;
        dateTransfer = `${year}-${month}-${day}`;
      } else {
        // ➤ dd de <mes> de yyyy
        const namedDateRegex =
          /(\d{1,2})\s+de\s+([a-zA-Záéíóúñ]+)\s+de\s+(\d{4})/i;
        const namedDateMatch = ocrText.match(namedDateRegex);
        if (namedDateMatch) {
          const [, day, monthName, year] = namedDateMatch;
          const month = normalizeMonthName(monthName);
          const dayPadded = day.padStart(2, "0");
          dateTransfer = `${year}-${month}-${dayPadded}`;
        }
      }

      // 🟢 3. Monto
      const montoRegex = /\$\s*([\d.,]+)/;
      const montoMatch = ocrText.match(montoRegex);
      const amount = montoMatch
        ? parseFloat(montoMatch[1].replace(/\./g, "").replace(",", "."))
        : 0;

      // 🟢 4. Banco origen y destino
      const detectBank = (text: string): string => {
        const banks = [
          "Mercado Pago",
          "Ualá",
          "Brubank",
          "Personal Pay",
          "Santander",
          "BBVA",
          "Banco Nación",
          "Banco Macro",
          "Galicia",
        ];
        const found = banks.find((b) =>
          text.toLowerCase().includes(b.toLowerCase())
        );
        return found || "Otro";
      };

      const originBank = detectBank(ocrText);
      const destinationBank = detectBank(ocrText.split(originBank)[1] || "");

      setForm((prev) => ({
        ...prev,
        numberOperation,
        amount,
        dateTransfer,
        originBank,
        destinationBank,
      }));
    } catch (error) {
      console.error("Error al procesar la imagen:", error);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const validateForm = (): boolean => {
    if (
      !form.clientNumber ||
      !form.clientName ||
      !form.dateTransfer ||
      !form.originBank ||
      !form.destinationBank
    ) {
      setModalMessage({
        text: "Todos los campos son obligatorios.",
        type: "error",
      });
      return false;
    }

    if (form.numberOperation === 0 || form.amount === 0) {
      setModalMessage({
        text: "El número de operación y el monto no pueden ser cero.",
        type: "error",
      });
      return false;
    }

    if (!image) {
      setModalMessage({
        text: "Debes subir una imagen del comprobante.",
        type: "error",
      });
      return false;
    }

    return true;
  };

  const buildFormData = (): FormData => {
    const formData = new FormData();
    formData.append("numberOperation", String(form.numberOperation));
    formData.append("clientNumber", form.clientNumber);
    formData.append("clientName", form.clientName);
    formData.append("dateTransfer", form.dateTransfer);
    formData.append("dateOfLoading", form.dateOfLoading);
    formData.append("amount", String(form.amount));
    formData.append("originBank", form.originBank);
    formData.append("destinationBank", form.destinationBank);
    formData.append("salesman", user.name);
    if (image) formData.append("receiptImage", image);
    return formData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    await createTransfer(buildFormData());
    setSubmitting(false);
    setModalMessage({ text: "Transferencia registrada con éxito." });
    setTimeout(() => onClose(), 500);
  };

  const handleSubmitAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    await createTransfer(buildFormData());
    setSubmitting(false);
    setForm(initialForm);
    setImage(null);
    setImagePreview(null);
    setModalMessage({ text: "Transferencia registrada. Puedes cargar otra." });
  };

  return (
    <>
      {modalMessage && (
        <MessageModal
          message={modalMessage.text}
          type={modalMessage.type}
          onClose={() => setModalMessage(null)}
        />
      )}

      {showFullImage && imagePreview && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
          {/* Botón de cierre */}
          <button
            onClick={() => setShowFullImage(false)}
            className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-red-500 transition"
            aria-label="Cerrar imagen ampliada"
          >
            &times;
          </button>

          {/* Imagen ampliada */}
          <img
            src={imagePreview}
            alt="Imagen ampliada"
            className="max-w-full max-h-full rounded-lg shadow-lg"
          />
        </div>
      )}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-gradient-to-b from-[#1e469d] to-[#122b70] text-white p-6 rounded-xl w-full max-w-2xl shadow-lg overflow-y-auto max-h-[90vh]">
          <h2 className="text-xl font-bold mb-1">
            Registrar nueva transferencia
          </h2>
          <p className="mb-6 text-sm text-gray-300">
            Completa los datos de la transferencia y sube el comprobante.
          </p>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm mb-2">Comprobante</label>
              <div className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-500 rounded-lg bg-gray-800 cursor-pointer transition hover:border-white">
                <label
                  htmlFor="receiptImage"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <FiUpload className="text-3xl mb-2" />
                  <span className="text-sm text-gray-300 mb-1">
                    Haz clic para subir una imagen
                  </span>
                  <input
                    id="receiptImage"
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                </label>
                {imagePreview && (
                  <div className="mt-4 text-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-40 mx-auto mb-2 rounded-md cursor-pointer transition hover:opacity-80"
                      onClick={() => setShowFullImage(true)}
                    />

                    <p className="text-sm text-gray-300">{image?.name}</p>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="mt-1 text-red-400 underline text-sm"
                    >
                      Eliminar imagen
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Número de cliente</label>
              <input
                name="clientNumber"
                type="number"
                value={form.clientNumber}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Cliente</label>
              <input
                name="clientName"
                value={form.clientName}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Monto</label>
              <input
                name="amount"
                type="number"
                step="0.01"
                value={form.amount === 0 ? "" : form.amount}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    amount: val === "" ? 0 : Number(val),
                  }));
                }}
                className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Fecha de la transferencia
              </label>
              <input
                name="dateTransfer"
                type="date"
                value={form.dateTransfer}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Número de operación</label>
              <input
                name="numberOperation"
                type="number"
                value={form.numberOperation === 0 ? "" : form.numberOperation}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                required
              />


            </div>

            <div>
              <label className="block text-sm mb-1">Banco origen</label>
              <select
                name="originBank"
                value={form.originBank}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                required
              >
                <option value="">Selecciona banco o billetera</option>
                <option value="Mercado Pago">Mercado Pago</option>
                <option value="Ualá">Ualá</option>
                <option value="Brubank">Brubank</option>
                <option value="Personal Pay">Personal Pay</option>
                <option value="Santander">Santander</option>
                <option value="BBVA">BBVA</option>
                <option value="Banco Nación">Banco Nación</option>
                <option value="Banco Macro">Banco Macro</option>
                <option value="Galicia">Galicia</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Banco destino</label>
              <select
                name="destinationBank"
                value={form.destinationBank}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                required
              >
                <option value="">Selecciona banco</option>
                <option value="Banco Nación">Banco Nación</option>
                <option value="Mercado Pago">Mercado Pago</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-between items-center mt-4 flex-wrap gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
              >
                Cancelar
              </button>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                  onClick={handleSubmitAndReset}
                  disabled={submitting}
                >
                  Registrar otra transferencia
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  Registrar y cerrar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
