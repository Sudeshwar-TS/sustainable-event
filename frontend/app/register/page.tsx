'use client';

import { AxiosError } from 'axios';
import { useState } from 'react';
import { Upload } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../components/ToastContext';
import { formatPhoneForInput, normalizePhone } from '../../services/phone';

type RegisterForm = {
  name: string;
  email: string;
  phone: string;
  event_name: string;
  event_date: string;
  location: string;
  hall_name: string;
  expected_count: string;
  bus_routes: string;
  bus_stops: string;
};

type ApiError = { detail?: string };

export default function RegisterPage() {
  const { showToast } = useToast();

  const [form, setForm] = useState<RegisterForm>({
    name: '',
    email: '',
    phone: '',
    event_name: '',
    event_date: '',
    location: '',
    hall_name: '',
    expected_count: '',
    bus_routes: '',
    bus_stops: '',
  });

  const [invitationFile, setInvitationFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'phone' ? formatPhoneForInput(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setInvitationFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
      return;
    }
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Submitting registration with form values', form);
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', normalizePhone(form.phone));
      formData.append('event_name', form.event_name);
      formData.append('event_date', form.event_date ? new Date(form.event_date).toISOString() : '');
      formData.append('location', form.location);
      formData.append('hall_name', form.hall_name);
      // backend expects these keys
      formData.append('expected_guests', form.expected_count);
      formData.append('bus_route', form.bus_routes);
      formData.append('bus_stops', form.bus_stops);
      if (invitationFile) {
        formData.append('invitation_image', invitationFile);
      }

      const res = await api.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Registration response', res.data);
      setQr(res.data.qr_code_url);
      showToast('Registration successful! Your QR code is ready.', 'success');
    } catch (err) {
      console.error('Registration error', err);
      const apiErr = err as AxiosError<ApiError>;
      const message = apiErr.response?.data?.detail || 'Registration failed.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (qr) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center px-6">
        <section className="premium-card hover:-translate-y-2 transition-all duration-300 w-full max-w-2xl text-center">
          <h2 className="font-serif text-4xl">Registration Complete</h2>
          <div className="h-px w-40 bg-gradient-to-r from-transparent via-[#C6A75E] to-transparent mx-auto my-6" />
          <p className="text-[var(--text-soft)] mb-6">Your Wedding QR Code</p>
          <img src={qr} alt="QR Code" className="mx-auto h-60 w-60 rounded-3xl border border-[rgba(198,167,94,0.25)]" />
          <p className="mt-6 text-[var(--text-soft)]">Go to login and verify your phone using OTP.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 py-8">
      <section className="form-shell w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="font-serif text-5xl">Cherish Your Celebration</h1>
          <div className="h-px w-40 bg-gradient-to-r from-transparent via-[#C6A75E] to-transparent mx-auto my-6" />
          <p className="text-[var(--text-soft)]">Create your premium wedding experience.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Organizer Name</label>
              <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required className="premium-input" />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="premium-input" />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required inputMode="numeric" maxLength={11} className="premium-input" />
            </div>
            <div>
              <label className="form-label">Wedding Name</label>
              <input name="event_name" placeholder="Wedding Name" value={form.event_name} onChange={handleChange} required className="premium-input" />
            </div>
            <div>
              <label className="form-label">Wedding Date</label>
              <input name="event_date" type="date" value={form.event_date} onChange={handleChange} required className="premium-input" />
            </div>
            <div>
              <label className="form-label">Expected Guests</label>
              <input name="expected_count" type="number" placeholder="Expected Guests" value={form.expected_count} onChange={handleChange} required className="premium-input" />
            </div>
            <div>
              <label className="form-label">Wedding Hall Name</label>
              <input name="hall_name" placeholder="Wedding Hall Name" value={form.hall_name} onChange={handleChange} required className="premium-input" />
            </div>
            <div>
              <label className="form-label">Wedding Location</label>
              <input name="location" placeholder="Wedding Location" value={form.location} onChange={handleChange} required className="premium-input" />
            </div>
            <div>
              <label className="form-label">Bus Routes</label>
              <input name="bus_routes" placeholder="Bus Routes" value={form.bus_routes} onChange={handleChange} required className="premium-input" />
            </div>
            <div>
              <label className="form-label">Bus Stopping Points</label>
              <input name="bus_stops" placeholder="Bus Stopping Points" value={form.bus_stops} onChange={handleChange} required className="premium-input" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[var(--text-soft)] mb-2">Wedding Invitation Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              id="invitationUpload"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="invitationUpload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-[#C6A75E]/40 rounded-3xl p-8 cursor-pointer hover:border-[#C6A75E] hover:bg-[#C6A75E]/5 transition-all duration-300"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Invitation Preview"
                  className="rounded-2xl max-h-64 w-full object-cover"
                />
              ) : (
                <>
                  <Upload size={40} className="text-[#C6A75E]" />
                  <p className="mt-3 text-lg font-medium text-[#1F4F46]">
                    Upload Wedding Invitation
                  </p>
                  <p className="text-sm text-gray-500 mt-1 text-center">
                    Click to upload or drag image here (Optional)
                  </p>
                </>
              )}
            </label>
            <p className="form-hint">Upload a beautiful invitation card to personalize your guest dashboard.</p>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="gold-button w-full disabled:opacity-60">
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
      </section>
    </main>
  );
}
