'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import {
  getNewsletters,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
  uploadNewsletterPdf,
  deleteNewsletterPdf,
} from '@/lib/services/newsletterService';
import { Newsletter } from '@/lib/types';

interface Props {
  userId: string;
  userName: string;
}

type Mode = 'list' | 'create' | 'edit';

const EMPTY_FORM = {
  title: '',
  edition: '',
  description: '',
  sourceType: 'url' as 'pdf' | 'url',
  url: '',
};

export default function NewsletterManager({ userId, userName }: Props) {
  const [mode, setMode] = useState<Mode>('list');
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Newsletter | null>(null);

  // Form state
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploadPct, setUploadPct] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Newsletter | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  // Load list
  const load = async () => {
    setLoading(true);
    try {
      const data = await getNewsletters(50);
      setNewsletters(data);
    } catch {
      toast.error('Could not load newsletters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Open create form
  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setPdfFile(null);
    setUploadPct(null);
    setMode('create');
  };

  // Open edit form pre-filled
  const openEdit = (nl: Newsletter) => {
    setEditing(nl);
    setForm({
      title: nl.title,
      edition: nl.edition ?? '',
      description: nl.description ?? '',
      sourceType: nl.pdfUrl ? 'pdf' : 'url',
      url: nl.pdfUrl ?? nl.externalUrl ?? '',
    });
    setPdfFile(null);
    setUploadPct(null);
    setMode('edit');
  };

  const cancel = () => {
    setMode('list');
    setEditing(null);
    setPdfFile(null);
    setUploadPct(null);
  };

  // Save (create or update)
  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (form.sourceType === 'url' && !form.url.trim() && mode === 'create') {
      toast.error('Please add a URL or switch to PDF upload'); return;
    }
    if (form.sourceType === 'pdf' && !pdfFile && mode === 'create') {
      toast.error('Please select a PDF file'); return;
    }

    setSaving(true);
    try {
      let pdfUrl: string | undefined = editing?.pdfUrl;
      let externalUrl: string | undefined = editing?.externalUrl;

      if (form.sourceType === 'pdf' && pdfFile) {
        // Need an ID to store the file under — use a temp one for new, existing ID for edits
        const tempId = editing?.id ?? `temp_${Date.now()}`;
        setUploadPct(0);
        pdfUrl = await uploadNewsletterPdf(pdfFile, tempId, setUploadPct);
        externalUrl = undefined;
        setUploadPct(null);
      } else if (form.sourceType === 'url') {
        externalUrl = form.url.trim() || undefined;
        pdfUrl = undefined;
      }

      const payload: Omit<Newsletter, 'id'> = {
        title: form.title.trim(),
        edition: form.edition.trim() || undefined,
        description: form.description.trim() || undefined,
        pdfUrl,
        externalUrl,
        publishedAt: editing?.publishedAt ?? Date.now(),
        authorId: editing?.authorId ?? userId,
        authorName: editing?.authorName ?? userName,
      };

      if (mode === 'create') {
        await createNewsletter(payload);
        toast.success('Newsletter published!');
      } else if (editing) {
        await updateNewsletter(editing.id, payload);
        toast.success('Newsletter updated!');
      }

      await load();
      cancel();
    } catch (err) {
      console.error(err);
      toast.error('Save failed — please try again');
      setUploadPct(null);
    } finally {
      setSaving(false);
    }
  };

  // Delete with confirmation
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      // Remove PDF from Storage if it was uploaded there
      if (deleteTarget.pdfUrl) {
        await deleteNewsletterPdf(deleteTarget.pdfUrl);
      }
      await deleteNewsletter(deleteTarget.id);
      toast.success('Deleted');
      setNewsletters((prev) => prev.filter((n) => n.id !== deleteTarget.id));
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  // ── List view ──────────────────────────────────────────────────────────────
  if (mode === 'list') {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-extrabold text-gray-900">Newsletters</h2>
            <p className="text-xs text-gray-400 mt-0.5">Manage editions visible to all residents</p>
          </div>
          <button
            onClick={openCreate}
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

        {!loading && newsletters.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-2">📰</div>
            <p className="text-gray-500 text-sm font-semibold">No newsletters yet</p>
            <p className="text-gray-400 text-xs mt-1">Tap <strong>New</strong> to publish your first edition.</p>
          </div>
        )}

        {!loading && newsletters.length > 0 && (
          <div className="space-y-2">
            {newsletters.map((nl) => (
              <div
                key={nl.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex items-center gap-3"
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: nl.pdfUrl || nl.externalUrl ? 'var(--primary-bg)' : '#f3f4f6' }}
                >
                  {nl.pdfUrl ? (
                    <svg className="w-5 h-5" style={{ color: 'var(--primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{nl.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {nl.edition ? `${nl.edition} · ` : ''}
                    {new Date(nl.publishedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {nl.pdfUrl ? ' · PDF' : nl.externalUrl ? ' · Link' : ' · No link'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEdit(nl)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                    aria-label="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteTarget(nl)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                    style={{ color: 'var(--primary)' }}
                    aria-label="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete confirmation dialog */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteTarget(null)} />
            <div className="relative bg-white rounded-2xl p-6 shadow-2xl w-full max-w-sm">
              <div className="text-3xl text-center mb-3">🗑️</div>
              <h3 className="font-extrabold text-gray-900 text-center mb-1">Delete newsletter?</h3>
              <p className="text-gray-500 text-sm text-center mb-5 leading-snug">
                &ldquo;{deleteTarget.title}&rdquo; will be permanently removed
                {deleteTarget.pdfUrl ? ' and its PDF deleted from storage' : ''}.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-3 rounded-xl text-white font-bold text-sm disabled:opacity-50"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Create / Edit form ─────────────────────────────────────────────────────
  return (
    <div>
      {/* Form header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={cancel}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 bg-gray-100"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="font-extrabold text-gray-900">
          {mode === 'create' ? 'New Newsletter' : 'Edit Newsletter'}
        </h2>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Title <span style={{ color: 'var(--primary)' }}>*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. May 2026 Committee Update"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
          />
        </div>

        {/* Edition */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Edition</label>
          <input
            type="text"
            value={form.edition}
            onChange={(e) => setForm((f) => ({ ...f, edition: e.target.value }))}
            placeholder="e.g. Vol 1 · May 2026 (optional)"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Short summary shown on the board (optional)"
            rows={2}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none text-sm resize-none"
          />
        </div>

        {/* Source type toggle */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Content</label>
          <div
            className="flex rounded-xl p-1 gap-1 mb-3"
            style={{ backgroundColor: '#f3f4f6' }}
          >
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, sourceType: 'pdf' }))}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-colors"
              style={{
                backgroundColor: form.sourceType === 'pdf' ? 'white' : 'transparent',
                color: form.sourceType === 'pdf' ? 'var(--brand-black)' : '#6b7280',
                boxShadow: form.sourceType === 'pdf' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload PDF
            </button>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, sourceType: 'url' }))}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-colors"
              style={{
                backgroundColor: form.sourceType === 'url' ? 'white' : 'transparent',
                color: form.sourceType === 'url' ? 'var(--brand-black)' : '#6b7280',
                boxShadow: form.sourceType === 'url' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              External URL
            </button>
          </div>

          {/* PDF upload */}
          {form.sourceType === 'pdf' && (
            <div>
              {/* Current PDF when editing */}
              {editing?.pdfUrl && !pdfFile && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl mb-2">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs font-semibold text-green-700 flex-1 truncate">Current PDF attached</p>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="text-xs font-bold"
                    style={{ color: 'var(--primary)' }}
                  >
                    Replace
                  </button>
                </div>
              )}

              {/* File picker */}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl py-6 flex flex-col items-center gap-2 text-gray-400 hover:border-gray-400 transition-colors"
                style={pdfFile ? { borderColor: 'var(--primary)', backgroundColor: 'var(--primary-bg)' } : {}}
              >
                <svg
                  className="w-8 h-8"
                  style={{ color: pdfFile ? 'var(--primary)' : '#9ca3af' }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {pdfFile ? (
                  <div className="text-center">
                    <p className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{pdfFile.name}</p>
                    <p className="text-xs text-gray-400">{(pdfFile.size / 1024 / 1024).toFixed(1)} MB · tap to change</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600">Tap to select PDF</p>
                    <p className="text-xs">Max 20 MB</p>
                  </div>
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 20 * 1024 * 1024) {
                    toast.error('File too large — max 20 MB');
                    return;
                  }
                  setPdfFile(file);
                  // Reset input so same file can be re-selected
                  e.target.value = '';
                }}
              />

              {/* Upload progress */}
              {uploadPct !== null && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Uploading…</span>
                    <span>{uploadPct}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${uploadPct}%`, backgroundColor: 'var(--primary)' }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* External URL */}
          {form.sourceType === 'url' && (
            <input
              type="url"
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              placeholder="https://… (webpage or PDF link)"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={cancel}
            className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || uploadPct !== null}
            className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm disabled:opacity-50"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {saving
              ? uploadPct !== null
                ? `Uploading ${uploadPct}%…`
                : 'Saving…'
              : mode === 'create'
              ? 'Publish'
              : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
