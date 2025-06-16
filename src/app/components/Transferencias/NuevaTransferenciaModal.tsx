"use client";

import { useLoginStore } from "@/app/stores/userLoginStore";
import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import MessageModal from "../ModalConfirm/MessageModal";
import { useTransferenciasStore } from "@/app/stores/useTransferenciasStore";

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
  const createTransfer = useTransferenciasStore((state) => state.createTransfer);
  const user = useLoginStore((state) => state.userData);
  const today = new Date().toISOString().split("T")[0];

  const initialForm: FormState = {
    numberOperation: 0,
    clientNumber: "",
    clientName: "",
    dateTransfer: "",
    dateOfLoading: today,
    amount: 0,
    originBank: "",
    destinationBank: "",
  };

  const [form, setForm] = useState<FormState>(initialForm);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalMessage, setModalMessage] = useState<ModalMessage | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newValue = name === "numberOperation" || name === "amount" ? Number(value) : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const validateForm = (): boolean => {
    if (!form.clientNumber || !form.clientName || !form.dateTransfer || !form.originBank || !form.destinationBank) {
      setModalMessage({ text: "Todos los campos son obligatorios.", type: "error" });
      return false;
    }

    if (form.numberOperation === 0 || form.amount === 0) {
      setModalMessage({ text: "El número de operación y el monto no pueden ser cero.", type: "error" });
      return false;
    }

    if (!image) {
      setModalMessage({ text: "Debes subir una imagen del comprobante.", type: "error" });
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
    setTimeout(() => onClose(), 3000);
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

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-gradient-to-b from-[#1e469d] to-[#122b70] text-white p-6 rounded-xl w-full max-w-2xl shadow-lg overflow-y-auto max-h-[90vh]">
          <h2 className="text-xl font-bold mb-1">Registrar nueva transferencia</h2>
          <p className="mb-6 text-sm text-gray-300">Completa los datos de la transferencia y sube el comprobante.</p>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Número de cliente</label>
              <input name="clientNumber" type="number" value={form.clientNumber} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 border border-gray-600" required />
            </div>

            <div>
              <label className="block text-sm mb-1">Cliente</label>
              <input name="clientName" value={form.clientName} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 border border-gray-600" required />
            </div>

            <div>
              <label className="block text-sm mb-1">Monto</label>
              <input name="amount" type="number" step="0.01" value={form.amount} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 border border-gray-600" required />
            </div>

            <div>
              <label className="block text-sm mb-1">Fecha de la transferencia</label>
              <input name="dateTransfer" type="date" value={form.dateTransfer} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 border border-gray-600" required />
            </div>

            <div>
              <label className="block text-sm mb-1">Número de operación</label>
              <input name="numberOperation" type="number" value={form.numberOperation} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 border border-gray-600" required />
            </div>

            <div>
              <label className="block text-sm mb-1">Banco origen</label>
              <select name="originBank" value={form.originBank} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 border border-gray-600" required>
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
              <select name="destinationBank" value={form.destinationBank} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 border border-gray-600" required>
                <option value="">Selecciona banco</option>
                <option value="Banco Nación">Banco Nación</option>
                <option value="Mercado Pago">Mercado Pago</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-2">Comprobante</label>
              <div className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-500 rounded-lg bg-gray-800 cursor-pointer transition hover:border-white">
                <label htmlFor="receiptImage" className="flex flex-col items-center cursor-pointer">
                  <FiUpload className="text-3xl mb-2" />
                  <span className="text-sm text-gray-300 mb-1">Haz clic para subir una imagen</span>
                  <input id="receiptImage" type="file" accept="image/png, image/jpeg" onChange={handleFileChange} className="hidden" required />
                </label>
                {imagePreview && (
                  <div className="mt-4 text-center">
                    <img src={imagePreview} alt="Preview" className="max-h-40 mx-auto mb-2 rounded-md" />
                    <p className="text-sm text-gray-300">{image?.name}</p>
                    <button type="button" onClick={removeImage} className="mt-1 text-red-400 underline text-sm">
                      Eliminar imagen
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 flex justify-between items-center mt-4 flex-wrap gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded">
                Cancelar
              </button>
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded" onClick={handleSubmitAndReset} disabled={submitting}>
                  Registrar otra transferencia
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded" onClick={handleSubmit} disabled={submitting}>
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
