'use client';

import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase/config';
import { AnnouncementAttachment, AnnouncementCategory } from '@/lib/types';
import { publishAnnouncement } from '@/lib/services/noticeboardService';

const CATEGORIES: AnnouncementCategory[] = [
  'General', 'Security', 'Maintenance', 'Event', 'Finance', 'Governance',
];

const MAX_FILES = 5;
const MAX_SIZE_MB = 20;

interface Props {
  authorId: string;
  authorName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

function fileIcon(mimeType: string) {
  if (mimeType === 'application/pdf') return '📄';
  if (mimeType.startsWith('image/')) return '🖼️';
  return '📎';
}

export default function AnnouncementForm({ authorId, authorName, onSuccess, onCancel }: Props) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('General');
  const [isPinned, setIsPinned] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── File selection ──────────────────────────────────────────────────────── */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const valid = selected.filter((f) => {
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`${f.name} exceeds the ${MAX_SIZE_MB} MB limit`);
        return false;
      }
      return true;
    });
    setFiles((prev) => {
      const combined = [...prev, ...valid];
      if (combined.length > MAX_FILES) {
        toast.error(`Maximum ${MAX_FILES} attachments allowed`);
        return combined.slice(0, MAX_FILES);
      }
      return combined;
    });
    // Reset so the same file can be re-added after removal
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /* ── Upload all files to Storage ─────────────────────────────────────────── */

  const uploadFiles = (sessionId: string): Promise<AnnouncementAttachment[]> => {
    const results: AnnouncementAttachment[] = new Array(files.length);
    setUploadProgress(files.map(() => 0));

    return Promise.all(
      files.map(
        (file, i) =>
          new Promise<void>((resolve, reject) => {
            const path = `announcements/${sessionId}/${file.name}`;
            const fileRef = storageRef(storage, path);
            const task = uploadBytesResumable(fileRef, file, { contentType: file.type });

            task.on(
              'state_changed',
              (snap) => {
                const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                setUploadProgress((prev) => {
                  const next = [...prev];
                  next[i] = pct;
                  return next;
                });
              },
              reject,
              async () => {
                try {
                  const url = await getDownloadURL(task.snapshot.ref);
                  results[i] = { name: file.name, url, mimeType: file.type, sizeBytes: file.size };
                  resolve();
                } catch (err) {
                  reject(err);
                }
              }
            );
          })
      )
    ).then(() => results);
  };

  /* ── Submit ──────────────────────────────────────────────────────────────── */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let attachments: AnnouncementAttachment[] = [];
      if (files.length > 0) {
        const sessionId = crypto.randomUUID();
        attachments = await uploadFiles(sessionId);
      }

      const result = await publishAnnouncement({
        title,
        bodyHtml: `<p>${body.replace(/\n/g, '</p><p>')}</p>`,
        bodyText: body,
        category,
        authorId,
        authorName,
        isPinned,
        attachments,
      });

      if ('error' in result) {
        toast.error(result.error);
        return;
      }

      toast.success('Announcement published!');
      onSuccess?.();
    } catch (err: unknown) {
      console.error('Announcement publish error:', err);
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Upload failed — please try again';
      toast.error(msg);
    } finally {
      setLoading(false);
      setUploadProgress([]);
    }
  };

  /* ── Render ──────────────────────────────────────────────────────────────── */

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Title */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Announcement title"
          required
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)]"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className="px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-colors"
              style={{
                borderColor: category === c ? 'var(--primary)' : '#E5E7EB',
                backgroundColor: category === c ? 'var(--primary-bg)' : 'white',
                color: category === c ? 'var(--primary)' : '#374151',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
          Message
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your announcement…"
          required
          rows={5}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] resize-none"
        />
      </div>

      {/* Attachments */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
          Attachments
        </label>
        <p className="text-xs text-gray-400 mb-2">
          JPG, PNG or PDF · max {MAX_FILES} files · {MAX_SIZE_MB} MB each
        </p>

        {/* Selected file list */}
        {files.length > 0 && (
          <div className="space-y-2 mb-2">
            {files.map((f, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-100 bg-gray-50 overflow-hidden"
              >
                <div className="flex items-center gap-2 px-3 py-2">
                  <span className="text-base leading-none">{fileIcon(f.type)}</span>
                  <span className="flex-1 text-xs font-medium text-gray-700 truncate">{f.name}</span>
                  <span className="text-xs text-gray-400 shrink-0">
                    {(f.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                  {!loading && (
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="ml-1 text-gray-400 hover:text-red-500 transition-colors text-sm leading-none shrink-0"
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                  )}
                  {loading && uploadProgress[i] !== undefined && (
                    <span className="ml-1 text-xs font-bold shrink-0" style={{ color: 'var(--primary)' }}>
                      {uploadProgress[i]}%
                    </span>
                  )}
                </div>
                {/* Progress bar */}
                {loading && uploadProgress[i] !== undefined && (
                  <div className="h-0.5 bg-gray-200">
                    <div
                      className="h-full transition-all duration-200"
                      style={{
                        width: `${uploadProgress[i]}%`,
                        backgroundColor: 'var(--primary)',
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add files button */}
        {files.length < MAX_FILES && !loading && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-500 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
            >
              + Add attachment
            </button>
          </>
        )}
      </div>

      {/* Pin toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isPinned}
          onChange={(e) => setIsPinned(e.target.checked)}
          className="w-4 h-4 rounded accent-[var(--primary)]"
        />
        <span className="text-sm text-gray-700">
          📌 Pin as alert (shows in ticker on home screen)
        </span>
      </label>

      {/* Actions */}
      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 border-2 border-gray-200 font-bold py-3 rounded-xl text-sm text-gray-600 disabled:opacity-40"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex-1 text-white font-bold py-3 rounded-xl text-sm disabled:opacity-50"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          {loading
            ? files.length > 0
              ? 'Uploading…'
              : 'Publishing…'
            : 'Publish'}
        </button>
      </div>
    </form>
  );
}
