// ─── Membership & Banking Configuration ───────────────────────────────────────
// Brainmap (User Profile): pay monthly membership via PayShap "with minimum
// clicks", create/cancel debit orders, request hardcopy form, auto-generate
// invoice.
//
// ⚠️ CLIENT ACTION: confirm the fee, banking details and PayShap proxy.

export const MEMBERSHIP = {
  /** Annual membership fee in ZAR cents */
  annualFeeCents: 60000, // R600.00 — TODO(client) confirm
  organisation: 'Sundowner Ext 7 Residents Association (SX7RA)',
  banking: {
    bank: 'FNB',          // TODO(client)
    accountName: 'SX7RA', // TODO(client)
    accountNumber: '',    // TODO(client)
    branchCode: '250655', // TODO(client)
  },
  /** PayShap proxy (cellphone or ShapID) for instant rapid payments */
  payShapProxy: '',       // TODO(client)
};

export function membershipReference(name: string, unitBlock?: string): string {
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 3);
  return `SX7-${initials}${unitBlock ? `-${unitBlock.replace(/\s/g, '')}` : ''}`;
}
