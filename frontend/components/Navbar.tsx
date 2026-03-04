"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-[#C6A75E]/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl sm:text-3xl font-serif text-[#1F4F46] hover:text-[#C6A75E] transition">
          SustainaWed
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/login"
            className="rounded-full px-6 py-2.5 text-white
                       bg-gradient-to-r from-[#C6A75E] to-[#A88B4C]
                       shadow-md hover:shadow-lg
                       hover:scale-105 transition-all duration-300"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-full px-6 py-2.5 text-white
                       bg-gradient-to-r from-[#1F4F46] to-[#163E38]
                       shadow-md hover:shadow-lg
                       hover:scale-105 transition-all duration-300"
          >
            Organizer Register
          </Link>
        </div>

        <button
          className="md:hidden text-[#1F4F46]"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-6 space-y-4 bg-white/95 backdrop-blur-md">
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="block w-full text-center rounded-full px-6 py-3 text-white
                       bg-gradient-to-r from-[#C6A75E] to-[#A88B4C]
                       shadow-md hover:scale-105 transition-all duration-300"
          >
            Login
          </Link>

          <Link
            href="/register"
            onClick={() => setOpen(false)}
            className="block w-full text-center rounded-full px-6 py-3 text-white
                       bg-gradient-to-r from-[#1F4F46] to-[#163E38]
                       shadow-md hover:scale-105 transition-all duration-300"
          >
            Organizer Register
          </Link>
        </div>
      )}
    </header>
  );
}
