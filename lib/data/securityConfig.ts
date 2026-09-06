// ─── Security Provider Configuration ──────────────────────────────────────────
// Brainmap (SECURITY PROVIDER): Contact Details, Preferred Security Provider,
// Selection Report, Request Sales Rep.
//
// ⚠️ CLIENT ACTION: confirm the preferred provider, contact numbers and the
// selection-report link (upload it to the Documents library and paste its URL).

export interface SecurityProvider {
  name: string;
  preferred: boolean;
  controlRoom?: string;
  emergency?: string;
  email?: string;
  website?: string;
  notes?: string;
}

export const SECURITY_PROVIDERS: SecurityProvider[] = [
  {
    name: 'Preferred Security Provider',
    preferred: true,
    controlRoom: '',     // TODO(client): control room number
    emergency: '',       // TODO(client): 24h armed response
    email: '',
    website: '',
    notes: 'Selected by the committee following the provider selection process.',
  },
];

/** URL to the committee's provider selection report (e.g. a Documents library link). */
export const SELECTION_REPORT_URL = '';
