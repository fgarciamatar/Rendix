import React, { useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface Props {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

const MessageModal: React.FC<Props> = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const Icon = type === "success" ? CheckCircle : XCircle;
  const iconColor = type === "success" ? "text-green-400" : "text-red-400";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="rounded-xl shadow-lg px-6 py-5 w-full max-w-sm bg-gradient-to-b from-[#0f2c5f] to-[#0a1c3d] text-white text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <Icon className={`w-10 h-10 ${iconColor}`} />
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;

