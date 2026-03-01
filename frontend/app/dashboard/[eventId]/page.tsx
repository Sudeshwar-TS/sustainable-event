"use client";

import { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  Pie,
} from "react-chartjs-2";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import api from "../../../services/api";
import { useToast } from "../../../components/ToastContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

type Summary = {
  total_rsvps: number;
  actual_attendance: number;
  predicted_attendance: number;
  predicted_food: number;
  actual_food: number;
  predicted_parking: number;
  predicted_rooms: number;
  transport_distribution: Record<string, number>;
  waste_saved: number;
  co2_saved: number;
  money_saved: number;
};

type ApiError = { detail?: string };

export default function DashboardPage({ params }: { params: { eventId: string } }) {
  const { eventId } = params;
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<Summary>(`/dashboard/summary/${eventId}`);
      setData(res.data);
      showToast("Dashboard loaded", "success");
    } catch (err) {
      const apiErr = err as AxiosError<ApiError>;
      const msg = apiErr.response?.data?.detail || "Unable to load dashboard.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const barData = useMemo(() => {
    if (!data) return null;
    return {
      labels: ["Predicted", "Actual"],
      datasets: [
        {
          label: "Attendance",
          data: [data.predicted_attendance, data.actual_attendance],
          backgroundColor: ["#22c55e", "#0ea5e9"],
          borderRadius: 12,
        },
      ],
    };
  }, [data]);

  const pieData = useMemo(() => {
    if (!data) return null;
    const labels = Object.keys(data.transport_distribution);
    const values = Object.values(data.transport_distribution);
    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: ["#16a34a", "#0ea5e9", "#f97316", "#a855f7"],
          borderWidth: 1,
        },
      ],
    };
  }, [data]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" as const },
      tooltip: { mode: "index" as const },
    },
  };

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-700">SustainaWed</p>
            <h1 className="text-3xl font-semibold text-slate-900">Event Dashboard</h1>
            <p className="text-sm text-slate-600">Event ID: {eventId}</p>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-70"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </header>

        {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow">{error}</p> : null}

        <section className="grid gap-4 md:grid-cols-5">
          {[
            { label: "Total RSVPs", value: data?.total_rsvps ?? "-" },
            { label: "Predicted Attendance", value: data?.predicted_attendance ?? "-" },
            { label: "Actual Attendance", value: data?.actual_attendance ?? "-" },
            { label: "Food Saved (kg)", value: data ? Math.round(data.waste_saved) : "-" },
            { label: "CO2 Saved", value: data ? data.co2_saved.toFixed(1) : "-" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl bg-white p-4 shadow-lg ring-1 ring-slate-100"
            >
              <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-100">
            <h3 className="text-lg font-semibold text-slate-900">Predicted vs Actual</h3>
            <p className="text-sm text-slate-500">Attendance comparison</p>
            <div className="mt-4 h-72">{barData ? <Bar data={barData} options={chartOptions} /> : null}</div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-100">
            <h3 className="text-lg font-semibold text-slate-900">Transport Distribution</h3>
            <p className="text-sm text-slate-500">How guests plan to travel</p>
            <div className="mt-4 h-72">{pieData ? <Pie data={pieData} options={chartOptions} /> : null}</div>
          </div>
        </section>

        {data ? (
          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-100">
              <p className="text-sm text-slate-500">Predicted Food</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{data.predicted_food}</p>
              <p className="text-xs text-slate-500">plates</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-100">
              <p className="text-sm text-slate-500">Predicted Parking</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{data.predicted_parking}</p>
              <p className="text-xs text-slate-500">spots</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-100">
              <p className="text-sm text-slate-500">Predicted Rooms</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{data.predicted_rooms}</p>
              <p className="text-xs text-slate-500">rooms</p>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

