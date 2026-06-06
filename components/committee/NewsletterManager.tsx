'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  getNewsletters,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
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
  url: '',
};

export default function NewsletterManager({ userId, userName }: Props) {
  const [mode, setMode] = useState<Mode>('list');
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Newsletter | null>(null);

  // Form state
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Newsletter | null>(null);
  const [deleting, setDeleting] = useState(false);

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
    setMode('create');
  };

  // Open edit form pre-filled
  const openEdit = (nl: Newsletter) => {
    setEditing(nl);
    setForm({
      title: nl.title,
      edition: nl.edition ?? '',
      description: nl.description ?? '',
      url: nl.pdfUrl ?? nl.externalUrl ?? '',
    });
    setMode('edit');
  };

  const cancel = () => {
    setMode('list');
    setEditing(null);
  };

  // Save (create or update)
  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }

    setSaving(true);
    try {
      const rawUrl = form.url.trim();
      const isPdf = rawUrl.toLowerCase().includes('.pdf') || rawUrl.includes('drive.google') && rawUrl.includes('export=download');

      const payload: Omit<Newsletter, 'id'> = {
        title: form.title.trim(),
        edition: form.edition.trim() || undefined,
        description: form.description.trim() || undefined,
        pdfUrl: isPdf ? rawUrl || undefined : undefined,
        externalUrl: !isPdf ? rawUrl || undefined : undefined,
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
    } finally {
      setSaving(false);
    }
  };

  // Delete with confirmation
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
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

        {/* PDF / Link URL */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            PDF or Link URL
          </label>
          <input
            type="url"
            value={form.url}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            placeholder="https://drive.google.com/… or any link"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
          />

          {/* Google Drive how-to */}
          <div className="mt-2 p-3 rounded-xl bg-blue-50 border border-blue-100">
            <p className="text-xs font-bold text-blue-700 mb-1.5">
              📎 How to share a PDF via Google Drive
            </p>
            <ol className="text-xs text-blue-600 space-y-1 leading-relaxed list-decimal list-inside">
              <li>Upload your PDF to Google Drive</li>
              <li>Right-click the file → <strong>Share</strong></li>
              <li>Set access to <strong>Anyone with the link</strong></li>
              <li>Click <strong>Copy link</strong> and paste it above</li>
            </ol>
          </div>
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
            disabled={saving}
            className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm disabled:opacity-50"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {saving ? 'Saving…' : mode === 'create' ? 'Publish' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
