'use client';

import { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../services/api";
import { useToast } from "../../components/ToastContext";

type CreateEventForm = {
  event_name: string;
  location: string;
  event_date: string;
  expected_count: string;
  invitation_image_url: string;
};

type EventResponse = {
  id: number;
  event_token: string;
  qr_code_url: string;
};

type ApiError = {
  detail?: string;
};

export default function CreateEvent() {
  const router = useRouter();
  const { showToast } = useToast();

  const [form, setForm] = useState<CreateEventForm>({
    event_name: "",
    location: "",
    event_date: "",
    expected_count: "",
    invitation_image_url: "",
  });

  const [qr, setQr] = useState("");
  const [weddingId, setWeddingId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 Role Protection (Organizer Only)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "organizer") {
      router.replace("/login");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm(prev => ({
        ...prev,
        invitation_image_url: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post<EventResponse>("/events/", {
        ...form,
        expected_count: parseInt(form.expected_count, 10) || 0,
      });

      setQr(res.data.qr_code_url);
      setWeddingId(`WED-${new Date().getFullYear()}-${res.data.id}`);

      showToast("Wedding event created successfully ✨", "success");

    } catch (err) {
      const apiErr = err as AxiosError<ApiError>;
      setError(apiErr.response?.data?.detail || "Unable to create event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-24 flex items-center justify-center px-6">
      <div className="w-full max-w-3xl luxury-card">

        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif">
            Create Your Wedding
          </h1>
          <p className="mt-4 text-sm text-[var(--text-soft)]">
            Design your elegant celebration and share your invitation QR
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6">

          <div>
            <label className="block mb-2 text-sm">Wedding Name</label>
            <input
              name="event_name"
              value={form.event_name}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm">Event Date</label>
              <input
                type="datetime-local"
                name="event_date"
                value={form.event_date}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">Expected Guests</label>
              <input
                type="number"
                name="expected_count"
                value={form.expected_count}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm">
              Invitation Background (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[var(--gold)] px-8 py-3 text-white shadow-md hover:bg-[var(--gold-dark)] transition"
          >
            {loading ? "Creating..." : "Create Wedding Event"}
          </button>

        </form>

        {qr && (
          <>
            <div className="luxury-divider" />

            <div className="text-center">
              <h2 className="text-3xl font-serif mb-4">
                Your Invitation QR
              </h2>

              <p className="text-sm text-[var(--text-soft)] mb-4">
                Wedding ID: <span className="font-medium">{weddingId}</span>
              </p>

              <div className="flex justify-center">
                <img
                  src={qr}
                  alt="Wedding QR"
                  className="h-56 w-56 rounded-xl shadow-md"
                />
              </div>
            </div>
          </>
        )}

      </div>
    </main>
  );
}