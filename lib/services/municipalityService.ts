import { ReportCategory } from '@/lib/types';

// ─── Authority Definitions ────────────────────────────────────────────────────

export type SubmissionMethod = 'email' | 'dialer' | 'portal';

export interface Authority {
  id: string;
  name: string;
  shortName: string;
  method: SubmissionMethod;
  email?: string;
  /** Primary phone number (used for tel: link) */
  phone?: string;
  /** Additional / alternate numbers shown in UI but not used for dialing */
  phoneAlt?: string;
  portalUrl?: string;
  portalLabel?: string;
  categories: ReportCategory[];
  color: string;
  icon: string;
  description: string;
  methodNote: string;
}

export const AUTHORITIES: Authority[] = [
  // ── JRA covers: Roads, Stormwater, Traffic Lights ─────────────────────────
  {
    id: 'JRA',
    name: 'Johannesburg Roads Agency',
    shortName: 'JRA',
    method: 'email',
    email: 'hotline@jra.org.za',
    phone: '0860562874',          // 0860 562 874 — option 5
    phoneAlt: '0860 562 874 (press 5)',
    categories: ['Pothole', 'Pavement', 'Stormwater', 'Traffic Light'],
    color: '#E65100',
    icon: '🛣',
    description: 'Responsible for roads, potholes, pavements, stormwater drains and traffic light faults.',
    methodNote: 'An email will be sent to hotline@jra.org.za with the full fault details, GPS pin and photos. You can also call 0860 562 874 and select option 5.',
  },

  // ── Joburg Water: Water outages, leaks, sewer ─────────────────────────────
  {
    id: 'JohannesburgWater',
    name: 'Joburg Water',
    shortName: 'Joburg Water',
    method: 'email',
    email: 'fault@jwater.co.za',
    phone: '0116881400',          // 011 688 1400
    phoneAlt: '011 688 1400',
    portalUrl: 'https://customer.forcelink.net/joburg_water/login',
    portalLabel: 'Joburg Water Self-Service Portal',
    categories: ['Water Main'],
    color: '#1565C0',
    icon: '💦',
    description: 'Handles water outages, burst pipes, leaks, and sewer blockages.',
    methodNote: 'An email will be sent to fault@jwater.co.za with GPS location and fault details. You can also log via their online portal or call 011 688 1400.',
  },

  // ── City Power: Streetlights, power outages ───────────────────────────────
  {
    id: 'CityPower',
    name: 'City Power',
    shortName: 'City Power',
    method: 'dialer',
    phone: '0114907484',          // (011) 490-7484
    phoneAlt: '(011) 490-7484',
    portalUrl: 'https://citypower.mobi/login',
    portalLabel: 'City Power Self-Service Portal',
    categories: ['Streetlight'],
    color: '#F9A825',
    icon: '💡',
    description: 'Manages electricity supply, power outages and streetlight faults.',
    methodNote: 'Call (011) 490-7484 or log your fault via the City Power self-service portal. Your report details are pre-formatted below — copy and use them when prompted.',
  },

  // ── City Parks: Graffiti, parks ───────────────────────────────────────────
  {
    id: 'CityParks',
    name: 'City Parks & Zoo',
    shortName: 'City Parks',
    method: 'dialer',
    phone: '0113755555',          // 011 375-5555 (primary)
    phoneAlt: '011 375-5555 / 0860 562 874',
    categories: ['Graffiti'],
    color: '#2E7D32',
    icon: '🍃',
    description: 'Manages parks, public open spaces, and graffiti removal.',
    methodNote: 'Call 011 375-5555 or 0860 562 874 to log a parks and graffiti fault. Your script is pre-filled below.',
  },

  // ── JMPD: Traffic enforcement, bylaws ────────────────────────────────────
  {
    id: 'JMPD',
    name: 'Joburg Metro Police Dept.',
    shortName: 'JMPD',
    method: 'dialer',
    phone: '0113755911',          // (011) 375-5911
    phoneAlt: '(011) 375-5911',
    categories: [],               // Not mapped to a category — selected manually
    color: '#1B5E20',
    icon: '🚔',
    description: 'Handles bylaw enforcement, traffic violations and public safety.',
    methodNote: 'Call (011) 375-5911 to report bylaw infringements or traffic enforcement issues. Your script is pre-filled below.',
  },

  // ── Revenue / Billing ─────────────────────────────────────────────────────
  {
    id: 'Revenue',
    name: 'Revenue Department',
    shortName: 'Revenue',
    method: 'dialer',
    phone: '0860562874',          // 0860 562 874
    phoneAlt: '0860 562 874',
    portalUrl: 'https://www.e-joburg.org.za',
    portalLabel: 'e-Joburg Billing & Services Portal',
    categories: ['Other'],
    color: '#4A148C',
    icon: '🧾',
    description: 'Revenue, billing, and general City of Joburg services.',
    methodNote: 'Call 0860 562 874 for billing and revenue queries, or use the e-Joburg online portal for self-service.',
  },
];

/** Returns the best authority for a given report category */
export function getAuthorityForCategory(category: ReportCategory): Authority {
  return (
    AUTHORITIES.find((a) => a.categories.includes(category)) ??
    AUTHORITIES.find((a) => a.id === 'Revenue')!
  );
}

// ─── Escalation Format ────────────────────────────────────────────────────────

export const WARD_COUNCILLOR = 'Ralf Bitkau — Ward 101';

/** Blank escalation template to fill in after getting a reference number */
export function formatEscalationTemplate(report?: ReportSummary): string {
  return `Escalation
──────────────────────────────
Name:
Cell:
Address:        ${report?.location.address ?? ''}
Ref:
Ref Date & Time logged:
Issue/Problem Statement: ${report ? `${report.category} — ${report.title}` : ''}
Ward Councillor: ${WARD_COUNCILLOR}`;
}

// ─── Email Formatting ─────────────────────────────────────────────────────────

export interface ReportSummary {
  id: string;
  title: string;
  description?: string;
  category: ReportCategory;
  location: { lat: number; lng: number; address?: string };
  photos?: string[];
  createdAt: string | number | Date;
  reporterName?: string;
  reporterBlock?: string;
}

export function formatEmailBody(report: ReportSummary, authority: Authority): string {
  const date = new Date(report.createdAt).toLocaleDateString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const mapsUrl = `https://www.google.com/maps?q=${report.location.lat},${report.location.lng}`;
  const photosSection =
    report.photos && report.photos.length > 0
      ? `\nPhotos:\n${report.photos.map((url, i) => `  Photo ${i + 1}: ${url}`).join('\n')}`
      : '';

  return `Dear ${authority.shortName},

We are writing on behalf of our Neighbourhood Watch community (Ward 101) to report a civic issue requiring your urgent attention.

FAULT DETAILS
─────────────────────────────────────────────────
Category:     ${report.category}
Issue:        ${report.title}
${report.description ? `Description:  ${report.description}\n` : ''}
LOCATION
─────────────────────────────────────────────────
Address:      ${report.location.address || 'See GPS coordinates below'}
GPS:          ${report.location.lat}, ${report.location.lng}
Google Maps:  ${mapsUrl}

DATE REPORTED
─────────────────────────────────────────────────
Reported:     ${date}
${report.reporterBlock ? `Unit / Block: ${report.reporterBlock}` : ''}
${photosSection}

Please action this fault and reply with a reference number using the format below.

ESCALATION DETAILS
─────────────────────────────────────────────────
Name:
Cell:
Address:      ${report.location.address || ''}
Ref:
Ref Date & Time logged:
Issue/Problem Statement: ${report.category} — ${report.title}
Ward Councillor: ${WARD_COUNCILLOR}

Kind regards,
Neighbourhood Watch — Ward 101 Community App
Internal Ref: ${report.id}
`;
}

export function formatEmailSubject(report: ReportSummary): string {
  return `[Ward 101] Fault Report: ${report.category} — ${report.location.address || `GPS: ${report.location.lat}, ${report.location.lng}`}`;
}

/** Generates a mailto: deep link with pre-filled email */
export function buildMailtoLink(report: ReportSummary, authority: Authority): string {
  const subject = encodeURIComponent(formatEmailSubject(report));
  const body = encodeURIComponent(formatEmailBody(report, authority));
  return `mailto:${authority.email}?subject=${subject}&body=${body}`;
}

/** Generates the tel: deep link — uses the clean digits-only phone string */
export function buildDialerLink(authority: Authority): string {
  return `tel:${authority.phone ?? ''}`;
}

/** Pre-written phone script to read out to the call centre agent */
export function formatCallerScript(report: ReportSummary, authority: Authority): string {
  const mapsUrl = `https://maps.google.com?q=${report.location.lat},${report.location.lng}`;
  return `"Good day. I'd like to log a fault for Ward 101.

Category:  ${report.category}
Issue:     ${report.title}${report.description ? `\nDetails:   ${report.description}` : ''}
Address:   ${report.location.address || `GPS: ${report.location.lat}, ${report.location.lng}`}
Maps link: ${mapsUrl}

May I please have a reference number?"

─── After the call, record your reference ───
${formatEscalationTemplate(report)}`;
}
