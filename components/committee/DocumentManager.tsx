'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import {
  fetchDocuments,
  publishDocument,
  removeDocument,
  MAX_DOCUMENT_SIZE,
} from '@/lib/services/documentService';
import {
  LibraryDocument,
  DocumentCategory,
  DocumentClassification,
} from '@/lib/types';

interface Props {
  userId: string;
  userName: string;
}

const CATEGORIES: DocumentCategory[] = [
  'Minutes',
  'BOD Decision',
  'Financial Statement',
  'Project Report',
  'Constitution & MOI',
  'CIPC',
  'Template',
  'Other',
];

const CLASSIFICATIONS: { value: DocumentClassification; label: string; hint: string }[] = [
  { value: 'public', label: 'Public', hint: 'Any signed-in resident' },
  { value: 'members', label: 'Members', hint: 'Paying members only' },
  { value: 'committee', label: 'Committee', hint: 'Committee / BOD only' },
];

const EMPTY = {
  title: '',
  description: '',
  category: 'Minutes' as DocumentCategory,
  classification: 'members' as DocumentClassification,
  url: '',
};

export default function DocumentManager({ userId, userName }: Props) {
  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [docs, setDocs] = useState<LibraryDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ ...EMPTY });
  const [file, setFile] = useState<File | null>(null);
  const [uploadPct, setUploadPct] = useState(0);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<LibraryDocument | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      // Committee sees everything → pass an elevated role
      const data = await fetchDocuments({ role: 'committee', membershipStatus: 'paying' });
      setDocs(data);
    } catch {
      toast.error('Could not load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_DOCUMENT_SIZE) {
      toast.error('File must be under 25 MB');
      return;
    }
    setFile(f);
    setForm((s) => ({ ...s, url: '' }));
  };

  const reset = () => {
    setForm({ ...EMPTY });
    setFile(null);
    setUploadPct(0);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!file && !form.url.trim()) {
      toast.error('Attach a file or paste a link');
      return;
    }
    setSaving(true);
    try {
      const result = await publishDocument({
        title: form.title,
        description: form.description,
        category: form.category,
        classification: form.classification,
        uploadedBy: userId,
        uploadedByName: userName,
        file,
        externalUrl: file ? undefined : form.url,
        onProgress: setUploadPct,
      });
      if ('error' in result) {
        toast.error(result.error);
        return;
      }
      toast.success('Document published');
      reset();
      setMode('list');
      await load();
    } catch (err) {
      console.error(err);
      toast.error('Save failed — please try again');
    } finally {
      setSaving(false);
      setUploadPct(0);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeDocument(deleteTarget);
      setDocs((prev) => prev.filter((d) => d.id !== deleteTarget.id));
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleteTarget(null);
    }
  };

  // ── Create form ──────────────────────────────────────────────────────────────
  if (mode === 'create') {
    return (
      <div>
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => { reset(); setMode('list'); }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="font-extrabold text-gray-900">New Document</h2>
        </div>

        <div className="space-y-4">
          <Field label="Title" required>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
              placeholder="e.g. AGM Minutes — March 2026"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
            />
          </Field>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
              placeholder="Short summary (optional)"
              rows={2}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none text-sm resize-none"
            />
          </Field>

          <Field label="Category">
            <select
              value={form.category}
              onChange={(e) => setForm((s) => ({ ...s, category: e.target.value as DocumentCategory }))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>

          <Field label="Who can view this?">
            <div className="grid grid-cols-3 gap-2">
              {CLASSIFICATIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setForm((s) => ({ ...s, classification: c.value }))}
                  className="px-2 py-2.5 rounded-xl text-xs font-bold border-2 transition-colors"
                  style={{
                    borderColor: form.classification === c.value ? 'var(--primary)' : '#e5e7eb',
                    backgroundColor: form.classification === c.value ? 'var(--primary-bg)' : 'white',
                    color: form.classification === c.value ? 'var(--primary)' : '#6b7280',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-1.5">
              {CLASSIFICATIONS.find((c) => c.value === form.classification)?.hint}
            </p>
          </Field>

          {/* File upload */}
          <Field label="File">
            {file && (
              <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-xl border"
                style={{ backgroundColor: 'var(--primary-bg)', borderColor: 'var(--primary)' }}>
                <p className="text-xs flex-1 truncate" style={{ color: 'var(--primary)' }}>
                  {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
                </p>
                <button onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ''; }} className="text-gray-400 text-xs">✕</button>
              </div>
            )}
            {saving && uploadPct > 0 && (
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Uploading…</span><span>{uploadPct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${uploadPct}%`, backgroundColor: 'var(--primary)' }} />
                </div>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf,.pdf,.doc,.docx,.xls,.xlsx,image/*"
              onChange={handleFile}
              className="hidden"
              id="doc-upload"
            />
            <label
              htmlFor="doc-upload"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-sm font-semibold text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors active:scale-[0.98]"
            >
              {file ? 'Choose a different file' : 'Upload file (max 25 MB)'}
            </label>
          </Field>

          <div className="relative flex items-center">
            <div className="flex-1 border-t border-gray-200" />
            <span className="px-3 text-xs text-gray-400 font-medium">or paste a link instead</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          <Field label={`External URL${file ? ' (ignored — file selected)' : ''}`}>
            <input
              type="url"
              value={form.url}
              onChange={(e) => { setForm((s) => ({ ...s, url: e.target.value })); if (e.target.value) setFile(null); }}
              placeholder="https://drive.google.com/… or any public link"
              disabled={!!file}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none text-sm disabled:opacity-40"
            />
          </Field>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { reset(); setMode('list'); }}
              disabled={saving}
              className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold text-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm disabled:opacity-50"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {saving ? (uploadPct > 0 ? `Uploading ${uploadPct}%…` : 'Saving…') : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── List view ──────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-extrabold text-gray-900">Documents</h2>
          <p className="text-xs text-gray-400 mt-0.5">Minutes, statements, reports &amp; templates</p>
        </div>
        <button
          onClick={() => setMode('create')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs font-bold"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New
        </button>
      </div>

      {loading && <p className="text-sm text-gray-400 text-center py-8">Loading…</p>}

      {!loading && docs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-2">📁</div>
          <p className="text-gray-500 text-sm font-semibold">No documents yet</p>
          <p className="text-gray-400 text-xs mt-1">Tap <strong>New</strong> to publish one.</p>
        </div>
      )}

      {!loading && docs.length > 0 && (
        <div className="space-y-2">
          {docs.map((d) => (
            <div key={d.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">{d.title}</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {d.category} · {d.classification}
                  {d.fileUrl ? ' · File' : d.externalUrl ? ' · Link' : ''}
                </p>
              </div>
              <a
                href={d.fileUrl || d.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100"
                aria-label="Open"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <button
                onClick={() => setDeleteTarget(d)}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ color: 'var(--primary)' }}
                aria-label="Delete"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl p-6 shadow-2xl w-full max-w-sm">
            <div className="text-3xl text-center mb-3">🗑️</div>
            <h3 className="font-extrabold text-gray-900 text-center mb-1">Delete document?</h3>
            <p className="text-gray-500 text-sm text-center mb-5 leading-snug">
              &ldquo;{deleteTarget.title}&rdquo; will be permanently removed
              {deleteTarget.fileUrl ? ' and its file deleted from storage' : ''}.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-bold text-sm">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 py-3 rounded-xl text-white font-bold text-sm" style={{ backgroundColor: 'var(--primary)' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
        {label} {required && <span style={{ color: 'var(--primary)' }}>*</span>}
      </label>
      {children}
    </div>
  );
}
