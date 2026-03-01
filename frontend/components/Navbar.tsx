import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-amber-200 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        
        <Link href="/" className="flex flex-col">
          <span className="text-2xl font-serif text-amber-800 tracking-wide">
            SustainaWed
          </span>
          <span className="text-xs text-amber-600">
            Elegant Sustainable Weddings
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-amber-900">
          <Link href="/login" className="hover:text-amber-700 transition">
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-full bg-amber-700 px-6 py-2 text-white shadow-md hover:bg-amber-800 transition"
          >
            Organizer Register
          </Link>
        </nav>
      </div>
    </header>
  );
}