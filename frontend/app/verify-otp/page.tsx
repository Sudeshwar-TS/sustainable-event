'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import api from '../../services/api';
import { normalizePhone } from '../../services/phone';
import { useAuth } from '../../context/AuthContext';

export default function VerifyOtpPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const phoneClean = normalizePhone(phone);
      const res = await api.post('/auth/verify-otp', { phone: phoneClean, otp });

      const { access_token, role, event_id } = res.data;
      setSession(access_token, role);
      if (typeof event_id !== 'undefined') localStorage.setItem('event_id', String(event_id));

      if (role === 'organizer') router.push('/organizer/dashboard');
      else if (role === 'guest') router.push('/guest/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6">
      <section className="premium-card hover:-translate-y-2 transition-all duration-300 w-full max-w-xl text-center">
        <h1 className="font-serif text-5xl">Cherish Your Celebration</h1>
        <div className="h-px w-40 bg-gradient-to-r from-transparent via-[#C6A75E] to-transparent mx-auto my-6" />
        <p className="text-[var(--text-soft)] mb-8">Enter the OTP sent to your mobile number.</p>

        <form onSubmit={submit} className="space-y-4 text-left">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="premium-input"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="gold-button w-full disabled:opacity-60">
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </section>
    </main>
  );
}
