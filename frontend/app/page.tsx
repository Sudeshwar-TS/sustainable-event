import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[80vh] py-24">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-center px-6">
        <section className="w-full rounded-2xl bg-gradient-to-br from-slate-800/60 to-emerald-900/30 p-12 text-center shadow-lg backdrop-blur-sm ring-1 ring-white/5">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-200">SustainaWed</p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-white md:text-6xl">
            Plan a Sustainable Wedding with AI
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-emerald-100 md:text-xl">
            Reduce food waste. Optimize resources. Make your wedding eco-friendly.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex min-w-[220px] items-center justify-center rounded-2xl bg-emerald-500 px-7 py-3 text-base font-semibold text-slate-900 transition hover:bg-emerald-400"
            >
              Create Wedding Event
            </Link>
            <Link
              href="/dashboard/demo"
              className="inline-flex min-w-[220px] items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-7 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              View Dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
