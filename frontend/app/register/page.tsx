"use client";

import { AxiosError } from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../services/api";
import { useToast } from "../../components/ToastContext";

type RegisterForm = {
  name: string;
  email: string;
  phone: string;
  expected_count: string;
  hall_name: string;
  location: string;
  bus_routes: string;
  bus_stops: string;
};

type ApiError = {
  detail?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    phone: "",
    expected_count: "",
    hall_name: "",
    location: "",
    bus_routes: "",
    bus_stops: "",
  });

  const [qr, setQr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/register", {
        ...form,
        expected_count: parseInt(form.expected_count),
      });

      setQr(res.data.qr_code_url);
      showToast("Registration successful. QR generated!", "success");

      // 🔥 Automatically send OTP after registration
      await api.post("/auth/request-otp", {
        phone: form.phone,
      });

      // Redirect to verify page
      router.push(`/verify-otp?phone=${form.phone}`);

    } catch (err) {
      const apiErr = err as AxiosError<ApiError>;
      setError(apiErr.response?.data?.detail || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] py-12">
      <div className="mx-auto w-full max-w-5xl px-6">

        {!qr && (
          <section className="mx-auto w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg">
            <h1 className="text-3xl font-semibold text-slate-900">
              Organizer Registration
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Create your wedding and login using OTP.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">

              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border px-4 py-3"
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border px-4 py-3"
              />

              <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border px-4 py-3"
              />

              <input
                name="expected_count"
                type="number"
                placeholder="Expected Guests"
                value={form.expected_count}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border px-4 py-3"
              />

              <input
                name="hall_name"
                placeholder="Wedding Hall Name"
                value={form.hall_name}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border px-4 py-3"
              />

              <input
                name="location"
                placeholder="Wedding Location"
                value={form.location}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border px-4 py-3"
              />

              <input
                name="bus_routes"
                placeholder="Bus Routes (e.g 21A, 45B)"
                value={form.bus_routes}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border px-4 py-3"
              />

              <input
                name="bus_stops"
                placeholder="Bus Stopping Points"
                value={form.bus_stops}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border px-4 py-3"
              />

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-emerald-600 px-5 py-3 text-white"
              >
                {loading ? "Creating..." : "Register & Continue"}
              </button>
            </form>
          </section>
        )}

        {qr && (
          <section className="mx-auto mt-10 w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg text-center">
            <h2 className="text-2xl font-semibold text-slate-900">
              Your Wedding QR Code
            </h2>

            <div className="mt-6">
              <img src={qr} alt="QR Code" className="mx-auto h-56 w-56" />
            </div>
          </section>
        )}

      </div>
    </main>
  );
}