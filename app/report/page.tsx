'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { createReport } from '@/lib/services/reportService';
import { useAuth } from '@/lib/hooks/useAuth';
import { ReportCategory } from '@/lib/types';
import { toast } from 'react-hot-toast';
import AppHeader from '@/components/AppHeader';
import LoadingScreen from '@/components/LoadingScreen';
import {
  getAuthorityForCategory,
  buildMailtoLink,
  buildDialerLink,
  formatCallerScript,
  ReportSummary,
} from '@/lib/services/municipalityService';

const CATEGORIES: { value: ReportCategory; icon: string; color: string }[] = [
  { value: 'Pothole',      icon: '🕳️', color: '#FFF3CD' },
  { value: 'Streetlight',  icon: '💡', color: '#FFF3CD' },
  { value: 'Graffiti',     icon: '🎨', color: '#FCE4EC' },
  { value: 'Water Main',   icon: '💧', color: '#E3F2FD' },
  { value: 'Stormwater',   icon: '🌧️', color: '#E3F2FD' },
  { value: 'Traffic Light',icon: '🚦', color: '#E8F5E9' },
  { value: 'Pavement',     icon: '🛤️', color: '#F3E5F5' },
  { value: 'Other',        icon: '📌', color: '#F5F5F5' },
  // Community improvements — earn points for uplifting the suburb
  { value: 'Pavement Care',   icon: '🌱', color: '#E8F5E9' },
  { value: 'Poster Removal',  icon: '🪧', color: '#E8F5E9' },
  { value: 'Garden/Greening', icon: '🌸', color: '#E8F5E9' },
];

/** Categories that are positive contributions rather than faults. */
const REWARD_VALUES: ReportCategory[] = ['Pavement Care', 'Poster Removal', 'Garden/Greening'];

export default function ReportPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [category, setCategory] = useState<ReportCategory>('Pothole');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [address, setAddress] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [submittedReport, setSubmittedReport] = useState<ReportSummary | null>(null);
  const [scriptCopied, setScriptCopied] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(6));
          setLongitude(position.coords.longitude.toFixed(6));
          setLocationLoading(false);
        },
        () => {
          toast.error('Could not get your location. Please enter it manually.');
          setLocationLoading(false);
        }
      );
    } else {
      setLocationLoading(false);
    }
  }, [user, loading, router]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((f) => f.type.startsWith('image/'));
    if (validFiles.length !== files.length) toast.error('Only image files are allowed');
    if (validFiles.length + photos.length > 5) {
      toast.error('Maximum 5 photos allowed');
      return;
    }
    setPhotos([...photos, ...validFiles]);
  };

  const removePhoto = (index: number) => setPhotos(photos.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error('You must be logged in'); return; }
    if (!title.trim()) { toast.error('Please provide a title'); return; }
    if (!latitude || !longitude) { toast.error('Location is required'); return; }

    setSubmitting(true);
    try {
      const photoUrls: string[] = [];
      for (const photo of photos) {
        const photoRef = ref(storage, `reports/${user.uid}/${Date.now()}_${photo.name}`);
        await uploadBytes(photoRef, photo);
        photoUrls.push(await getDownloadURL(photoRef));
      }

      const reportId = await createReport(user.uid, {
        category,
        title,
        description,
        location: {
          lat: parseFloat(latitude),
          lng: parseFloat(longitude),
          address: address || `${latitude}, ${longitude}`,
        },
        photos: photoUrls,
        status: 'submitted',
        points: 0,
      });

      // Show the success + municipality next-steps screen instead of going straight home
      setSubmittedReport({
        id: reportId,
        title,
        description,
        category,
        location: {
          lat: parseFloat(latitude),
          lng: parseFloat(longitude),
          address: address || `${latitude}, ${longitude}`,
        },
        photos: photoUrls,
        createdAt: Date.now(),
        reporterName: user.name,
        reporterBlock: user.unitBlock,
      });
      toast.success('Report saved! 🎉');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingScreen />;
  if (!user) return null;

  // ── Success screen shown after submission ─────────────────────────────────
  if (submittedReport) {
    const authority = getAuthorityForCategory(submittedReport.category);

    const copyScript = () => {
      navigator.clipboard.writeText(formatCallerScript(submittedReport));
      setScriptCopied(true);
      setTimeout(() => setScriptCopied(false), 2500);
      toast.success('Script copied!');
    };

    return (
      <div className="min-h-dvh pb-24 lg:pb-8" style={{ backgroundColor: 'var(--background)' }}>
        <AppHeader title="Report Submitted" />

        <main className="max-w-lg lg:max-w-4xl mx-auto px-4 lg:px-8 py-6 space-y-4">
          {/* Success card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
              style={{ backgroundColor: 'var(--primary-bg)' }}
            >
              ✅
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-1">Report logged!</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your report for <strong>{submittedReport.category}</strong> has been saved. An admin will review it and award your points.
            </p>
          </div>

          {/* Reward submissions: no municipality step — just a thank-you */}
          {REWARD_VALUES.includes(submittedReport.category) && (
            <div className="bg-green-50 rounded-2xl border border-green-100 p-4 text-center">
              <p className="text-sm text-green-700 leading-relaxed">
                🌟 Thank you for uplifting {`SX7`}! Once the committee approves your
                contribution you&apos;ll earn points and climb the leaderboard.
              </p>
            </div>
          )}

          {/* Municipality next step (faults only) */}
          {!REWARD_VALUES.includes(submittedReport.category) && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div
              className="px-4 py-3 flex items-center gap-3"
              style={{ backgroundColor: authority.color + '22' }}
            >
              <span className="text-2xl">{authority.icon}</span>
              <div>
                <p className="font-extrabold text-gray-900 text-sm">Want faster action?</p>
                <p className="text-xs text-gray-500">Contact {authority.shortName} directly</p>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {/* Dialer method */}
              {authority.method === 'dialer' && (
                <>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your script</p>
                      <button
                        onClick={copyScript}
                        className="text-xs font-bold"
                        style={{ color: 'var(--primary)' }}
                      >
                        {scriptCopied ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed font-mono whitespace-pre-wrap">
                      {formatCallerScript(submittedReport)}
                    </p>
                  </div>

                  {authority.portalUrl && (
                    <a
                      href={authority.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center border-2 font-bold py-3 rounded-xl text-sm"
                      style={{ borderColor: authority.color, color: authority.color }}
                    >
                      {authority.portalLabel ?? `Open ${authority.shortName} Portal`} ↗
                    </a>
                  )}

                  <a
                    href={buildDialerLink(authority)}
                    className="block w-full text-center text-white font-bold py-3.5 rounded-xl text-sm"
                    style={{ backgroundColor: authority.color }}
                  >
                    📞 Call {authority.shortName} — {authority.phoneAlt ?? authority.phone}
                  </a>
                </>
              )}

              {/* Email method */}
              {authority.method === 'email' && (
                <>
                  <p className="text-xs text-gray-500 leading-relaxed">{authority.methodNote}</p>
                  <a
                    href={buildMailtoLink(submittedReport, authority)}
                    className="block w-full text-center text-white font-bold py-3.5 rounded-xl text-sm"
                    style={{ backgroundColor: authority.color }}
                  >
                    📧 Email {authority.shortName}
                  </a>
                  {authority.portalUrl && (
                    <a
                      href={authority.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center border border-gray-200 font-semibold py-2.5 rounded-xl text-sm text-gray-600"
                    >
                      {authority.portalLabel ?? 'Open Self-Service Portal'} ↗
                    </a>
                  )}
                  <p className="text-xs text-gray-400 text-center">
                    {authority.email}
                    {authority.phoneAlt && ` · ${authority.phoneAlt}`}
                  </p>
                </>
              )}
            </div>
          </div>
          )}

          <button
            onClick={() => router.push('/')}
            className="w-full text-white font-bold py-4 rounded-2xl text-base shadow-sm"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            Done — Go Home
          </button>
        </main>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none text-sm";
  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'var(--primary)';
    e.target.style.boxShadow = '0 0 0 2px #e8501a22';
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#e5e7eb';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className="min-h-dvh pb-24 lg:pb-8" style={{ backgroundColor: 'var(--background)' }}>
      <AppHeader title="Report an Issue" showBack backHref="/" />

      <main className="max-w-lg lg:max-w-4xl mx-auto px-4 lg:px-8 py-4">
        {/* Category picker */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className="flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all text-center"
                style={{
                  backgroundColor: category === cat.value ? 'var(--primary-bg)' : 'white',
                  borderColor: category === cat.value ? 'var(--primary)' : '#e5e7eb',
                }}
              >
                <span className="text-xl">{cat.icon}</span>
                <span
                  className="text-xs font-semibold leading-tight"
                  style={{ color: category === cat.value ? 'var(--primary)' : '#6b7280' }}
                >
                  {cat.value}
                </span>
              </button>
            ))}
          </div>
          {REWARD_VALUES.includes(category) && (
            <div className="mt-2 p-3 rounded-xl bg-green-50 border border-green-100">
              <p className="text-xs text-green-700 leading-snug">
                🌟 <strong>Community reward:</strong> uplifting the suburb earns points. Add a
                photo of your tidy pavement, cleared lamp post or garden — the committee
                approves it and awards your points. Sponsored monthly prizes for top contributors!
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
            <h2 className="font-bold text-gray-900">Issue Details</h2>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
                onFocus={focusStyle}
                onBlur={blurStyle}
                placeholder="Brief description of the issue"
                maxLength={100}
                required
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/100</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Description <span className="text-gray-300 font-normal">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none text-sm resize-none"
                onFocus={focusStyle}
                onBlur={blurStyle}
                placeholder="Any additional details about the issue..."
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{description.length}/500</p>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Location</h2>
              {locationLoading && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <svg className="animate-spin w-3 h-3" style={{ color: 'var(--primary)' }} viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Getting location...
                </span>
              )}
              {latitude && !locationLoading && (
                <span className="text-xs text-green-600 flex items-center gap-1 font-medium">
                  ✓ Location detected
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Latitude</label>
                <input
                  type="number"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className={inputClass}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                  placeholder="-26.2023"
                  step="0.000001"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Longitude</label>
                <input
                  type="number"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className={inputClass}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                  placeholder="28.0473"
                  step="0.000001"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Street Address <span className="text-gray-300 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={inputClass}
                onFocus={focusStyle}
                onBlur={blurStyle}
                placeholder="e.g. Main Street, Corner of Oak Lane"
              />
            </div>
          </div>

          {/* Photo upload */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-900">Photos</h2>
              <span
                className="text-xs font-bold px-2 py-1 rounded-full"
                style={{ backgroundColor: 'var(--primary-bg)', color: 'var(--primary)' }}
              >
                +5 bonus pts
              </span>
            </div>

            <label
              htmlFor="photo-upload"
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors ${
                photos.length >= 5 ? 'opacity-50 cursor-not-allowed border-gray-200' : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--primary-bg)' }}
              >
                <svg className="w-5 h-5" style={{ color: 'var(--primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-600">
                {photos.length >= 5 ? 'Maximum 5 photos reached' : 'Tap to add photos'}
              </span>
              <span className="text-xs text-gray-400">{photos.length}/5 photos added</span>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                disabled={photos.length >= 5}
                className="hidden"
              />
            </label>

            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full text-white font-bold py-4 rounded-xl transition-opacity text-base shadow-md disabled:opacity-60"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </span>
            ) : 'Submit Report'}
          </button>
        </form>
      </main>
    </div>
  );
}
