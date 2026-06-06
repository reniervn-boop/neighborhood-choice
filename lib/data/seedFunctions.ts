'use client';

import { createAnnouncement } from '@/lib/repositories/announcementRepository';
import { NEWSLETTER_2026_COMMITTEE } from '@/lib/data/sx7raSeeds';
import { getAnnouncements } from '@/lib/repositories/announcementRepository';

export async function seedNewsletter2026(): Promise<{ id: string } | { error: string }> {
  try {
    // Check for duplicates
    const existing = await getAnnouncements(50);
    const alreadySeeded = existing.some(
      (a) => a.title === NEWSLETTER_2026_COMMITTEE.title,
    );
    if (alreadySeeded) {
      return { error: 'Newsletter already exists on the noticeboard.' };
    }

    const id = await createAnnouncement(NEWSLETTER_2026_COMMITTEE);
    return { id };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to seed newsletter.' };
  }
}
