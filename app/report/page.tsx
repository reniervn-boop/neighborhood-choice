'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storage, db } from '@/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { createReport } from '@/lib/services/reportService';
import { processReportApproval } from '@/lib/services/gamificationService';
import { useAuth } from '@/lib/hooks/useAuth';
import { ReportCategory } from '@/lib/types';
import { toast } from 'react-hot-toast';

const CATEGORIES: ReportCategory[] = [
  'Pothole',
  'Streetlight',
  'Graffiti',
  'Water Main',
  'Stormwater',
  'Traffic Light',
  'Pavement',
  'Other',
];

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

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
        },
        () => {
          toast.error('Could not get your location. Please enter it manually.');
        }
      );
    }
  }, [user, loading, router]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => file.type.startsWith('image/'));

    if (validFiles.length !== files.length) {
      toast.error('Only image files are allowed');
    }

    if (validFiles.length + photos.length > 5) {
      toast.error('Maximum 5 photos allowed');
      return;
    }

    setPhotos([...photos, ...validFiles]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in');
      return;
    }

    if (!title.trim()) {
      toast.error('Please provide a title');
      return;
    }

    if (!latitude || !longitude) {
      toast.error('Location is required');
      return;
    }

    setSubmitting(true);

    try {
      // Upload photos
      const photoUrls: string[] = [];
      for (const photo of photos) {
        const photoRef = ref(storage, `reports/${user.uid}/${Date.now()}_${photo.name}`);
        await uploadBytes(photoRef, photo);
        const url = await getDownloadURL(photoRef);
        photoUrls.push(url);
      }

      // Create report
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
        points: 0, // Will be awarded on approval
      });

      toast.success('Report submitted! Thank you for helping our community.');
      router.push('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Report Issue</h1>
          <button onClick={() => router.push('/')} className="text-gray-600 hover:text-gray-900">
            Back
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ReportCategory)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Brief description of the issue"
                maxLength={100}
                required
              />
              <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Additional details about the issue"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{description.length}/500</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                <input
                  type="number"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., -26.2023"
                  step="0.0001"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                <input
                  type="number"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., 28.0473"
                  step="0.0001"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address (Optional)</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="e.g., Main Street, Corner of Oak Lane"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos (Optional, but +5 bonus points!)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  disabled={photos.length >= 5}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <p className="text-gray-600 font-medium">Click to upload photos</p>
                  <p className="text-xs text-gray-500 mt-1">Max 5 photos, PNG/JPG only</p>
                </label>
              </div>

              {photos.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> Reports with photos get an extra 5 points! Include clear, well-lit photos of the
                issue for faster review.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
