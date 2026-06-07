import {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  getPinnedAnnouncements,
} from '@/lib/repositories/announcementRepository';
import {
  createAlert,
  getActiveAlerts,
  getAllAlerts,
  deactivateAlert,
  deleteAlert,
} from '@/lib/repositories/alertRepository';
import { validateAnnouncement, validateLocalAlert } from '@/lib/validation/noticeboardValidation';
import { Announcement, LocalAlert, AnnouncementCategory, AlertCategory } from '@/lib/types';

// ─── Announcements ────────────────────────────────────────────────────────────

export interface CreateAnnouncementInput {
  title: string;
  bodyHtml: string;
  bodyText: string;
  category: AnnouncementCategory;
  authorId: string;
  authorName: string;
  isPinned?: boolean;
  expiresAt?: number;
  attachments?: Announcement['attachments'];
}

export async function publishAnnouncement(
  input: CreateAnnouncementInput,
): Promise<{ id: string } | { error: string }> {
  const validation = validateAnnouncement(input);
  if (!validation.valid) {
    const firstError = Object.values(validation.errors)[0];
    return { error: firstError };
  }

  const announcementData: Parameters<typeof createAnnouncement>[0] = {
    title: input.title.trim(),
    bodyHtml: input.bodyHtml,
    bodyText: input.bodyText.trim(),
    category: input.category,
    authorId: input.authorId,
    authorName: input.authorName,
    attachments: input.attachments ?? [],
    isPinned: input.isPinned ?? false,
    publishedAt: Date.now(),
  };
  // Only include expiresAt when it has a real value — Firestore rejects undefined
  if (input.expiresAt !== undefined) {
    announcementData.expiresAt = input.expiresAt;
  }

  const id = await createAnnouncement(announcementData);

  return { id };
}

export async function fetchAnnouncements(count = 20): Promise<Announcement[]> {
  return getAnnouncements(count);
}

export async function fetchAnnouncementById(id: string): Promise<Announcement | null> {
  return getAnnouncementById(id);
}

export async function editAnnouncement(
  id: string,
  data: Partial<Pick<Announcement, 'title' | 'bodyHtml' | 'bodyText' | 'isPinned' | 'expiresAt'>>,
): Promise<void> {
  await updateAnnouncement(id, data);
}

export async function removeAnnouncement(id: string): Promise<void> {
  await deleteAnnouncement(id);
}

export async function fetchTickerItems(): Promise<Announcement[]> {
  return getPinnedAnnouncements();
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

export interface CreateAlertInput {
  message: string;
  category: AlertCategory;
  severity: LocalAlert['severity'];
  authorId: string;
  expiresAt?: number;
}

export async function publishAlert(
  input: CreateAlertInput,
): Promise<{ id: string } | { error: string }> {
  const validation = validateLocalAlert(input);
  if (!validation.valid) {
    const firstError = Object.values(validation.errors)[0];
    return { error: firstError };
  }

  const id = await createAlert({
    message: input.message.trim(),
    category: input.category,
    severity: input.severity,
    authorId: input.authorId,
    createdAt: Date.now(),
    expiresAt: input.expiresAt,
    isActive: true,
  });

  return { id };
}

export async function fetchActiveAlerts(): Promise<LocalAlert[]> {
  return getActiveAlerts();
}

export async function fetchAllAlerts(): Promise<LocalAlert[]> {
  return getAllAlerts();
}

export async function dismissAlert(id: string): Promise<void> {
  await deactivateAlert(id);
}

export async function removeAlert(id: string): Promise<void> {
  await deleteAlert(id);
}
