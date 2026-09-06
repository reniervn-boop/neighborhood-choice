'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import AppHeader from '@/components/AppHeader';

// ─── Static contact data ────────────────────────────────────────────────────
// Update these with real SX7RA committee / estate contacts

const EMERGENCY_CONTACTS = [
  { name: 'SA Police Service', number: '10111', icon: '🚔' },
  { name: 'Ambulance / EMS', number: '10177', icon: '🚑' },
  { name: 'Fire Department', number: '10177', icon: '🚒' },
  { name: 'Emer-G-Med', number: '0861 50 50 50', icon: '🏥' },
  { name: 'City Power Fault Line', number: '011 490 7516', icon: '⚡' },
  { name: 'Johannesburg Water', number: '0860 562 874', icon: '💧' },
];

const COMMITTEE_CONTACTS = [
  { role: 'Chairperson', name: 'Committee Member', phone: '', email: 'chair@sx7ra.co.za' },
  { role: 'Secretary', name: 'Committee Member', phone: '', email: 'secretary@sx7ra.co.za' },
  { role: 'Treasurer', name: 'Committee Member', phone: '', email: 'treasurer@sx7ra.co.za' },
];

const SERVICE_CONTACTS = [
  { name: 'Joburg Roads Agency (JRA)', number: '0860 562 874', icon: '🛣️' },
  { name: 'JRA eServices', number: '011 375 5555', icon: '🏙️' },
  { name: 'Pikitup (Waste)', number: '011 712 5000', icon: '♻️' },
  { name: 'Eskom Emergency', number: '086 003 7566', icon: '🔌' },
];

export default function ContactsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Everything on this page is static, so there is nothing to wait for. Render
  // immediately — these are emergency numbers, and making someone watch a
  // spinner resolve Firebase auth before showing 10111 is the wrong trade.
  // Redirect only once auth has actually settled as signed-out.
  useEffect(() => {
    if (!loading && !user) router.replace('/auth/login');
  }, [loading, user, router]);

  return (
    <div className="min-h-dvh pb-24 lg:pb-8" style={{ backgroundColor: 'var(--background)' }}>
      <AppHeader title="Contacts" showBack backHref="/" />

      <div className="max-w-lg lg:max-w-4xl mx-auto px-4 lg:px-8 py-5 space-y-6">

        {/* ── PANIC / EMERGENCY ─────────────────────────────── */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Emergency Services
          </h2>
          <div
            className="rounded-2xl p-4 mb-3 flex items-center gap-3"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="font-extrabold text-white">In case of emergency</p>
              <p className="text-white/70 text-xs mt-0.5">Tap any number below to call directly</p>
            </div>
          </div>

          <div className="space-y-2">
            {EMERGENCY_CONTACTS.map((c) => (
              <a
                key={c.name}
                href={`tel:${c.number.replace(/\s/g, '')}`}
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 transition-transform active:scale-[0.98]"
              >
                <span className="text-2xl w-9 text-center flex-shrink-0">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.number}</p>
                </div>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'var(--primary-bg)' }}
                >
                  <svg className="w-5 h-5" style={{ color: 'var(--primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 5.25v1.5z" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── COMMITTEE ─────────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            SX7RA Committee
          </h2>
          <div className="space-y-2">
            {COMMITTEE_CONTACTS.map((c) => (
              <div
                key={c.role}
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100"
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 font-extrabold text-white text-sm"
                  style={{ backgroundColor: 'var(--brand-black)' }}
                >
                  {c.name !== 'Committee Member' ? c.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{c.role}</p>
                  <p className="text-xs text-gray-500 truncate">{c.name !== 'Committee Member' ? c.name : 'Contact via email'}</p>
                </div>
                {c.email && (
                  <a
                    href={`mailto:${c.email}`}
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--primary-bg)' }}
                  >
                    <svg className="w-5 h-5" style={{ color: 'var(--primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </a>
                )}
                {c.phone && (
                  <a
                    href={`tel:${c.phone.replace(/\s/g, '')}`}
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--primary-bg)' }}
                  >
                    <svg className="w-5 h-5" style={{ color: 'var(--primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 5.25v1.5z" />
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">
            Update contact details via the committee panel
          </p>
        </section>

        {/* ── CITY SERVICES ─────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            City Services
          </h2>
          <div className="space-y-2">
            {SERVICE_CONTACTS.map((c) => (
              <a
                key={c.name}
                href={`tel:${c.number.replace(/\s/g, '')}`}
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 transition-transform active:scale-[0.98]"
              >
                <span className="text-2xl w-9 text-center flex-shrink-0">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.number}</p>
                </div>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#f0fdf4' }}
                >
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 5.25v1.5z" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
