import { Report, ReportCategory, ReportSeverity, isRewardCategory } from '@/lib/types';

// ─── SLA Configuration ────────────────────────────────────────────────────────
// Brainmap: "Escalations should automatically happen when the SLA runs out for
// that item — depending on the severity SLA is different. E.g. street lights
// have a different escalation to when all the power in the suburb is [out]."
//
// Base SLA (hours) per category — the time the responsible authority has to
// action a fault before it auto-escalates to the Ward Councillor group.

const BASE_SLA_HOURS: Record<ReportCategory, number> = {
  'Water Main': 12,      // burst pipes / no water — urgent
  'Traffic Light': 24,   // robot down — safety critical
  Stormwater: 72,
  Pothole: 168,          // 7 days
  Streetlight: 120,      // 5 days
  Pavement: 336,         // 14 days
  Graffiti: 336,
  Other: 168,
  // Reward categories — not faults, no meaningful SLA
  'Pavement Care': 8760,
  'Poster Removal': 8760,
  'Garden/Greening': 8760,
};

/** Default severity inferred from category when none is set. */
const DEFAULT_SEVERITY: Record<ReportCategory, ReportSeverity> = {
  'Water Main': 'high',
  'Traffic Light': 'high',
  Stormwater: 'medium',
  Pothole: 'medium',
  Streetlight: 'medium',
  Pavement: 'low',
  Graffiti: 'low',
  Other: 'medium',
  'Pavement Care': 'low',
  'Poster Removal': 'low',
  'Garden/Greening': 'low',
};

/** Multiplier applied to the base SLA by severity (higher → escalates sooner). */
const SEVERITY_FACTOR: Record<ReportSeverity, number> = {
  critical: 0.25,
  high: 0.5,
  medium: 1,
  low: 1.5,
};

export function defaultSeverity(category: ReportCategory): ReportSeverity {
  return DEFAULT_SEVERITY[category] ?? 'medium';
}

/** SLA window in hours for a category + severity. */
export function slaHoursFor(category: ReportCategory, severity?: ReportSeverity): number {
  const base = BASE_SLA_HOURS[category] ?? 168;
  const sev = severity ?? defaultSeverity(category);
  return Math.max(1, Math.round(base * SEVERITY_FACTOR[sev]));
}

/**
 * Compute the SLA due timestamp for a report. Anchored on approval (when the
 * fault is confirmed and sent onward) or creation if not yet approved.
 */
export function computeSlaDueAt(report: Pick<Report, 'category' | 'severity' | 'createdAt' | 'approvedAt'>): number {
  const anchor = report.approvedAt ?? report.createdAt;
  return anchor + slaHoursFor(report.category, report.severity) * 3_600_000;
}

export type EscalationStatus = 'within_sla' | 'breached' | 'escalated' | 'resolved';

/** A report is "resolved" once the council has given a reference or it's rejected. */
function isResolved(report: Report): boolean {
  // Reward submissions are never faults, so they never escalate.
  return report.status === 'rejected' || !!report.councilReference || isRewardCategory(report.category);
}

export function escalationStatus(report: Report, now = Date.now()): EscalationStatus {
  if (report.escalatedToWardAt) return 'escalated';
  if (isResolved(report)) return 'resolved';
  const due = report.slaDueAt ?? computeSlaDueAt(report);
  return now > due ? 'breached' : 'within_sla';
}

/** Reports whose SLA has lapsed and that have NOT yet been escalated. */
export function isEscalatable(report: Report, now = Date.now()): boolean {
  return escalationStatus(report, now) === 'breached';
}

/** Hours remaining (negative if overdue) before SLA breach. */
export function hoursToBreach(report: Report, now = Date.now()): number {
  const due = report.slaDueAt ?? computeSlaDueAt(report);
  return Math.round((due - now) / 3_600_000);
}
