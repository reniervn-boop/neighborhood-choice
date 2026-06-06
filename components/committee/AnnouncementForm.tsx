'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { AnnouncementCategory } from '@/lib/types';
import { publishAnnouncement } from '@/lib/services/noticeboardService';

const CATEGORIES: AnnouncementCategory[] = [
  'General', 'Security', 'Maintenance', 'Event', 'Finance', 'Governance',
];

interface Props {
  authorId: string;
  authorName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AnnouncementForm({ authorId, authorName, onSuccess, onCancel }: Props) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('General');
  const [isPinned, setIsPinned] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await publishAnnouncement({
      title,
      bodyHtml: `<p>${body.replace(/\n/g, '</p><p>')}</p>`,
      bodyText: body,
      category,
      authorId,
      authorName,
      isPinned,
    });

    setLoading(false);

    if ('error' in result) {
      toast.error(result.error);
      return;
    }

    toast.success('Announcement published!');
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border-2 border-gray-200 font-bold py-3 rounded-xl text-sm text-gray-600"
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
          {loading ? 'Publishing…' : 'Publish'}
        </button>
      </div>
    </form>
  );
}
