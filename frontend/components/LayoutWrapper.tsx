import { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F7F3] to-[#F1EFE8] section-fade">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10">{children}</main>
    </div>
  );
}
