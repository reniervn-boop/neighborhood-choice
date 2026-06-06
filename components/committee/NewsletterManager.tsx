'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import {
  getNewsletters,
  createNewsletterWithId,
  newNewsletterRef,
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
  url: '',
};

export default function NewsletterManager({ userId, userName }: Props) {
  const [mode, setMode]               = useState<Mode>('list');
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading]         = useState(true);
  const [editing, setEditing]         = useState<Newsletter | null>(null);

  // Form
  const [form, setForm]               = useState({ ...EMPTY_FORM });
  const [pdfFile, setPdfFile]         = useState<File | null>(null);
  const [uploadPct, setUploadPct]     = useState(0);
  const [uploading, setUploading]     = useState(false);
  const [saving, setSaving]           = useState(false);
  const fileInputRef                  = useRef<HTMLInputElement>(null);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<Newsletter | null>(null);
  const [deleting, setDeleting]         = useState(false);

  // ── Load ────────────────────────────────────────────────────────────────────

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

  // ── Mode helpers ─────────────────────────────────────────────────────────────

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setPdfFile(null);
    setUploadPct(0);
    setMode('create');
  };

  const openEdit = (nl: Newsletter) => {
    setEditing(nl);
    setForm({
      title:       nl.title,
      edition:     nl.edition ?? '',
      description: nl.description ?? '',
      url:         nl.pdfUrl ?? nl.externalUrl ?? '',
    });
    setPdfFile(null);
    setUploadPct(0);
    setMode('edit');
  };

  const cancel = () => {
    setMode('list');
    setEditing(null);
    setPdfFile(null);
  };

  // ── File pick ────────────────────────────────────────────────────────────────

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error('File must be under 20 MB');
      return;
    }
    setPdfFile(file);
    // Clear the URL field — PDF takes precedence
    setForm(f => ({ ...f, url: '' }));
  };

  // ── Save ─────────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }

    setSaving(true);
    try {
      let pdfUrl: string | undefined      = undefined;
      let externalUrl: string | undefined = undefined;

      if (pdfFile) {
        // ── Upload new PDF ──
        setUploading(true);
        setUploadPct(0);

        // For new newsletters we need the ID before creating the doc
        const newsletterId = editing?.id ?? newNewsletterRef();

        // Delete old PDF if replacing
        if (editing?.pdfUrl) {
          await deleteNewsletterPdf(editing.pdfUrl).catch(() => {/* ignore */});
        }

        pdfUrl = await uploadNewsletterPdf(pdfFile, newsletterId, (pct) => {
          setUploadPct(pct);
        });
        setUploading(false);

        const payload: Omit<Newsletter, 'id'> = {
          title:       form.title.trim(),
          edition:     form.edition.trim()      || undefined,
          description: form.description.trim()  || undefined,
          pdfUrl,
          externalUrl: undefined,
          publishedAt: editing?.publishedAt      ?? Date.now(),
          authorId:    editing?.authorId         ?? userId,
          authorName:  editing?.authorName       ?? userName,
        };

        if (mode === 'create') {
          await createNewsletterWithId(newsletterId, payload);
          toast.success('Newsletter published!');
        } else if (editing) {
          await updateNewsletter(editing.id, payload);
          toast.success('Newsletter updated!');
        }

      } else {
        // ── URL-only path ──
        const rawUrl = form.url.trim();
        const isPdf  = rawUrl.toLowerCase().includes('.pdf') ||
                       (rawUrl.includes('drive.google') && rawUrl.includes('export=download'));

        pdfUrl      = isPdf  ? rawUrl || undefined : undefined;
        externalUrl = !isPdf ? rawUrl || undefined : undefined;

        const payload: Omit<Newsletter, 'id'> = {
          title:       form.title.trim(),
          edition:     form.edition.trim()      || undefined,
          description: form.description.trim()  || undefined,
          pdfUrl,
          externalUrl,
          publishedAt: editing?.publishedAt      ?? Date.now(),
          authorId:    editing?.authorId         ?? userId,
          authorName:  editing?.authorName       ?? userName,
        };

        if (mode === 'create') {
          await createNewsletterWithId(newNewsletterRef(), payload);
          toast.success('Newsletter published!');
        } else if (editing) {
          await updateNewsletter(editing.id, payload);
          toast.success('Newsletter updated!');
        }
      }

      await load();
      cancel();
    } catch (err) {
      console.error(err);
      toast.error('Save failed — please try again');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (deleteTarget.pdfUrl) {
        await deleteNewsletterPdf(deleteTarget.pdfUrl).catch(() => {/* ignore */});
      }
      await deleteNewsletter(deleteTarget.id);
      toast.success('Deleted');
      setNewsletters(prev => prev.filter(n => n.id !== deleteTarget.id));
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  // ── List view ────────────────────────────────────────────────────────────────

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
            {newsletters.map(nl => (
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
                  ) : nl.externalUrl ? (
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{nl.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {nl.edition ? `${nl.edition} · ` : ''}
                    {new Date(nl.publishedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {nl.pdfUrl ? ' · PDF' : nl.externalUrl ? ' · Link' : ' · No file'}
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

        {/* Delete confirmation */}
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

  // ── Create / Edit form ────────────────────────────────────────────────────────

  const existingPdfUrl = editing?.pdfUrl;
  const existingLinkUrl = editing?.externalUrl;

  return (
    <div>
      {/* Back + title */}
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
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
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
            onChange={e => setForm(f => ({ ...f, edition: e.target.value }))}
            placeholder="e.g. Vol 1 · May 2026 (optional)"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Short summary shown on the board (optional)"
            rows={2}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none text-sm resize-none"
          />
        </div>

        {/* ── PDF Upload ── */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            PDF File
          </label>

          {/* Current PDF badge (edit mode) */}
          {existingPdfUrl && !pdfFile && (
            <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-green-50 border border-green-100 rounded-xl">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xs text-green-700 flex-1">PDF already attached — upload a new one to replace it</p>
            </div>
          )}

          {/* File chosen indicator */}
          {pdfFile && (
            <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-xl border"
              style={{ backgroundColor: 'var(--primary-bg)', borderColor: 'var(--primary)' }}>
              <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xs flex-1 truncate" style={{ color: 'var(--primary)' }}>
                {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(1)} MB)
              </p>
              <button onClick={() => { setPdfFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                className="text-gray-400 text-xs">✕</button>
            </div>
          )}

          {/* Upload progress */}
          {uploading && (
            <div className="mb-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Uploading…</span>
                <span>{uploadPct}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${uploadPct}%`, backgroundColor: 'var(--primary)' }}
                />
              </div>
            </div>
          )}

          {/* File picker button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-upload"
          />
          <label
            htmlFor="pdf-upload"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-sm font-semibold text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {pdfFile ? 'Choose a different PDF' : 'Upload PDF (max 20 MB)'}
          </label>
        </div>

        {/* ── OR divider ── */}
        <div className="relative flex items-center">
          <div className="flex-1 border-t border-gray-200" />
          <span className="px-3 text-xs text-gray-400 font-medium">or paste a link instead</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        {/* ── URL fallback ── */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            External URL {pdfFile && <span className="text-gray-300 font-normal">(ignored — PDF selected above)</span>}
          </label>
          <input
            type="url"
            value={form.url}
            onChange={e => { setForm(f => ({ ...f, url: e.target.value })); if (e.target.value) setPdfFile(null); }}
            placeholder="https://drive.google.com/… or any public link"
            disabled={!!pdfFile}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none text-sm disabled:opacity-40"
          />

          {/* Google Drive guide — only show when no PDF is selected and no URL yet */}
          {!pdfFile && !form.url && (
            <div className="mt-2 p-3 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-xs font-bold text-blue-700 mb-1.5">📎 How to share via Google Drive</p>
              <ol className="text-xs text-blue-600 space-y-1 leading-relaxed list-decimal list-inside">
                <li>Upload your PDF to Google Drive</li>
                <li>Right-click → <strong>Share</strong></li>
                <li>Set access to <strong>Anyone with the link</strong></li>
                <li>Click <strong>Copy link</strong> and paste above</li>
              </ol>
            </div>
          )}

          {/* Show existing link if editing */}
          {existingLinkUrl && !pdfFile && !form.url && (
            <p className="text-xs text-gray-400 mt-1.5">
              Current link: <a href={existingLinkUrl} target="_blank" rel="noopener noreferrer" className="underline">{existingLinkUrl.slice(0, 50)}…</a>
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={cancel}
            disabled={uploading}
            className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || uploading}
            className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm disabled:opacity-50"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {uploading ? `Uploading ${uploadPct}%…` : saving ? 'Saving…' : mode === 'create' ? 'Publish' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
