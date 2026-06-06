import { ValidationResult, AnnouncementCategory, AlertCategory } from '@/lib/types';

const ANNOUNCEMENT_CATEGORIES: AnnouncementCategory[] = [
  'General', 'Security', 'Maintenance', 'Event', 'Finance', 'Governance',
];

const ALERT_CATEGORIES: AlertCategory[] = [
  'Crime', 'Safety', 'Load Shedding', 'Water Outage', 'Road Closure', 'Other',
];

export function validateAnnouncement(data: {
  title: string;
  bodyHtml: string;
  bodyText: string;
  category: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.title.trim() || data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  }

  if (data.title.trim().length > 120) {
    errors.title = 'Title cannot exceed 120 characters.';
  }

  if (!data.bodyText.trim() || data.bodyText.trim().length < 10) {
    errors.body = 'Announcement body must be at least 10 characters.';
  }

  if (!ANNOUNCEMENT_CATEGORIES.includes(data.category as AnnouncementCategory)) {
    errors.category = 'Please select a valid category.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateLocalAlert(data: {
  message: string;
  category: string;
  severity: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.message.trim() || data.message.trim().length < 10) {
    errors.message = 'Alert message must be at least 10 characters.';
  }

  if (data.message.trim().length > 280) {
    errors.message = 'Alert message cannot exceed 280 characters.';
  }

  if (!ALERT_CATEGORIES.includes(data.category as AlertCategory)) {
    errors.category = 'Please select a valid alert category.';
  }

  if (!['info', 'warning', 'critical'].includes(data.severity)) {
    errors.severity = 'Please select a valid severity level.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
