'use client';

import { useEffect, useState } from 'react';
import api from '../../../services/api';
import { formatPhoneForInput, phoneCandidates } from '../../../services/phone';

export default function EntrancePage({ params }: { params: { eventToken: string } }) {
  const { eventToken } = params;

  const [event, setEvent] = useState<any>(null);
  const [phone, setPhone] = useState('');
  const [count, setCount] = useState(1);
  const [status, setStatus] = useState('');

  useEffect(() => {
    api
      .get(`/events/token/${eventToken}`)
      .then((res) => setEvent(res.data))
      .catch(() => setStatus('Event not found'));
  }, [eventToken]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    try {
      const guests = await api.get(`/guests/event/${event.id}`);
      const candidates = phoneCandidates(phone);
      const guest = guests.data.find((g: any) => candidates.includes(g.phone));

      if (!guest) {
        setStatus('Guest not found');
        return;
      }

      await api.post('/entrance/scan', {
        event_id: event.id,
        guest_id: guest.id,
        actual_people_count: count,
      });

      setStatus('Attendance recorded');
    } catch {
      setStatus('Error recording attendance');
    }
  };

  if (!event) return <p className="text-center text-[var(--text-soft)] py-16">Loading...</p>;

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 py-8">
      <section className="premium-card hover:-translate-y-2 transition-all duration-300 w-full max-w-2xl">
        <h1 className="font-serif text-4xl text-center">Entrance Check-In</h1>
        <p className="text-center text-[var(--text-soft)] mt-2">{event.event_name}</p>

        <form onSubmit={submit} className="space-y-4 mt-8">
          <input
            placeholder="Guest Phone"
            value={phone}
            onChange={(e) => setPhone(formatPhoneForInput(e.target.value))}
            inputMode="numeric"
            maxLength={11}
            required
            className="premium-input"
          />

          <input
            type="number"
            min={1}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="premium-input"
          />

          <button className="gold-button w-full">Mark Attendance</button>
        </form>

        {status && <p className="mt-4 text-center text-[var(--emerald)]">{status}</p>}
      </section>
    </main>
  );
}
