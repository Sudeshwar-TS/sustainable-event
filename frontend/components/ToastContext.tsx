"use client";

import React, { createContext, useContext, useState } from "react";
import Toast from "./Toast";

type ToastType = "success" | "error";

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ show: boolean; message: string; type: ToastType }>(
    { show: false, message: "", type: "success" }
  );

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ show: true, message, type });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((s) => ({ ...s, show: false }))}
      />
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
