"use client";

import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function EntrancePage({ params }: { params: { eventToken: string } }) {
  const { eventToken } = params;

  const [event, setEvent] = useState<any>(null);
  const [phone, setPhone] = useState("");
  const [count, setCount] = useState(1);
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get(`/events/token/${eventToken}`)
      .then(res => setEvent(res.data))
      .catch(() => setStatus("Event not found"));
  }, [eventToken]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    try {
      const guests = await api.get(`/guests/event/${event.id}`);
      const guest = guests.data.find((g: any) => g.phone === phone);

      if (!guest) {
        setStatus("Guest not found");
        return;
      }

      await api.post("/entrance/scan", {
        event_id: event.id,
        guest_id: guest.id,
        actual_people_count: count
      });

      setStatus("Attendance recorded");
    } catch {
      setStatus("Error recording attendance");
    }
  };

  if (!event) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-4">Entrance Check-in</h1>
      <p className="mb-6">{event.event_name}</p>

      <form onSubmit={submit} className="space-y-4">
        <input
          placeholder="Guest Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          min={1}
          value={count}
          onChange={e => setCount(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />

        <button className="w-full bg-emerald-600 text-white py-2 rounded">
          Mark Attendance
        </button>
      </form>

      {status && <p className="mt-4">{status}</p>}
    </div>
  );
}