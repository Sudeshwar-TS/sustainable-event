"use client";

import { useEffect } from "react";

type ToastProps = {
  message: string;
  type?: "success" | "error";
  show: boolean;
  onClose?: () => void;
};

export default function Toast({ message, type = "success", show, onClose }: ToastProps) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => onClose && onClose(), 4500);
    return () => clearTimeout(t);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed right-6 top-6 z-50 w-auto max-w-sm rounded-2xl shadow-2xl">
      <div
        className={`w-full rounded-2xl px-5 py-3 text-sm font-medium text-white ${
          type === "success" ? "bg-emerald-600" : "bg-rose-600"
        }`}
      >
        {message}
      </div>
    </div>
  );
}
