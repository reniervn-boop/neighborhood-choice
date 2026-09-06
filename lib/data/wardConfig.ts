// ─── Ward & Councillor Configuration ──────────────────────────────────────────
// Single source of truth for ward / councillor details used across fault
// escalation, the Ward page and petitions. Brainmap: "Ward Number (Ward 134)
// CouncillorName Contact Details", "Link to IEC Website And WA".
//
// ⚠️ CLIENT ACTION: confirm the councillor name, contact details and the
// WhatsApp / IEC links below. Placeholders are clearly marked.

export interface WardConfig {
  wardNumber: number;
  /** e.g. "Sundowner Ext 7" */
  suburb: string;
  councillor: {
    name: string;
    party?: string;
    phone?: string;
    email?: string;
    /** WhatsApp number in international format for wa.me links, e.g. 27821234567 */
    whatsApp?: string;
  };
  /** IEC "Find your councillor / ward" lookup */
  iecUrl: string;
  /** Community WhatsApp group invite link */
  whatsAppGroupUrl?: string;
}

export const WARD: WardConfig = {
  wardNumber: 134,
  suburb: 'Sundowner Ext 7',
  councillor: {
    // TODO(client): confirm the current Ward 134 councillor details
    name: 'Ward 134 Councillor',
    party: '',
    phone: '',
    email: '',
    whatsApp: '',
  },
  iecUrl: 'https://www.elections.org.za/',
  whatsAppGroupUrl: '',
};

/** Human label, e.g. "Ward 134". */
export const WARD_LABEL = `Ward ${WARD.wardNumber}`;

/** Full councillor label used in escalation templates. */
export const WARD_COUNCILLOR_LABEL = `${WARD.councillor.name} — ${WARD_LABEL}`;
