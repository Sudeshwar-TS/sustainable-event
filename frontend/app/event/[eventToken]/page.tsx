"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import api from "../../../services/api";

export default function GuestPage() {
  const params = useParams();

  // 🔴 IMPORTANT: Make sure this matches your folder name
  // If folder is [eventToken] → use params.eventToken
  // If folder is [token] → use params.token
  const eventToken = params.eventToken as string;

  const [form, setForm] = useState({
  name: "",
  phone: "",
  password: "",   // ✅ ADD
  number_of_people: 1,
  transport_type: "",
  parking_needed: "No",
  needs_room: "No",
});

  const [status, setStatus] = useState("");

  // ✅ Safe change handler
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "number_of_people"
          ? Number(value)
          : value,
    }));
  };

  const submit = async (e: any) => {
    e.preventDefault();

    try {
      // 🔹 Get event by token
      const eventRes = await api.get(`/events/token/${eventToken}`);
      const eventId = eventRes.data.id;

      // 🔹 Submit guest
      await api.post("/guests/", {
        name: form.name,
        phone: form.phone,
        number_of_people: form.number_of_people,
        transport_type: form.transport_type,
        parking_needed: form.parking_needed,
        needs_room: form.needs_room,
        event_id: eventId,
      });

      setStatus("RSVP Submitted Successfully 🎉");

      // 🔹 Reset form
      setForm({
        name: "",
        phone: "",
        password: "",
        number_of_people: 1,
        transport_type: "",
        parking_needed: "No",
        needs_room: "No",
      });

    } catch (err) {
      console.error(err);
      setStatus("Something went wrong");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-green-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Wedding RSVP
        </h1>

        <form onSubmit={submit} className="space-y-4">

          <input
            name="name"
            value={form.name}
            placeholder="Your Name"
            required
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <input
            name="phone"
            value={form.phone}
            placeholder="Phone Number"
            required
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <input
            name="number_of_people"
            type="number"
            min={1}
            value={form.number_of_people}
            placeholder="Total Members"
            required
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <select
            name="transport_type"
            value={form.transport_type}
            required
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          >
            <option value="">Transport Type</option>
            <option value="Bike">Bike</option>
            <option value="Car">Car</option>
            <option value="Public Transport">Public Transport</option>
          </select>

          <select
            name="parking_needed"
            value={form.parking_needed}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          >
            <option value="No">Parking Needed? No</option>
            <option value="Yes">Parking Needed? Yes</option>
          </select>

          <select
            name="needs_room"
            value={form.needs_room}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          >
            <option value="No">Room Needed? No</option>
            <option value="Yes">Room Needed? Yes</option>
          </select>

          <button className="w-full bg-green-600 text-white p-3 rounded-xl">
            Submit RSVP
          </button>
        </form>

        {status && (
          <p className="mt-4 text-center text-green-600">{status}</p>
        )}
      </div>
    </main>
  );
}