'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { User } from '@/lib/types';
import { createServiceRequest } from '@/lib/services/requestService';
import { MEMBERSHIP, membershipReference } from '@/lib/data/membershipConfig';
import { formatZAR } from '@/lib/validation/financeValidation';

interface Props {
  user: User;
}

type Sheet = null | 'pay' | 'debit';

export default function MembershipActions({ user }: Props) {
  const [sheet, setSheet] = useState<Sheet>(null);
  const [busy, setBusy] = useState(false);
  const ref = membershipReference(user.name, user.unitBlock);

  const submit = async (
    type: Parameters<typeof createServiceRequest>[0]['type'],
    details: string,
    successMsg: string,
  ) => {
    setBusy(true);
    try {
      await createServiceRequest({
        type,
        userId: user.uid,
        userName: user.name,
        userEmail: user.email,
        userCell: user.cell ?? user.phone,
        details,
      });
      toast.success(successMsg);
      setSheet(null);
    } catch {
      toast.error('Could not send request');
    } finally {
      setBusy(false);
    }
  };

  const printInvoice = () => {
    const html = invoiceHtml(user, ref);
    const w = window.open('', '_blank', 'width=720,height=900');
    if (!w) { toast.error('Allow pop-ups to print the invoice'); return; }
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 400);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Membership &amp; Payments</h3>

      <div className="grid grid-cols-2 gap-2">
        <ActionButton emoji="💳" label="Pay membership" onClick={() => setSheet('pay')} />
        <ActionButton emoji="🔁" label="Debit order" onClick={() => setSheet('debit')} />
        <ActionButton emoji="🧾" label="Print invoice" onClick={printInvoice} />
        <ActionButton emoji="📄" label="Hardcopy form" onClick={() => submit('debit_order_hardcopy', 'Resident requested a hardcopy debit-order form.', 'Request sent to the committee')} />
      </div>

      {/* Pay membership sheet */}
      {sheet === 'pay' && (
        <Sheet onClose={() => setSheet(null)} title="Pay membership">
          <p className="text-sm text-gray-600 mb-3">
            Annual fee: <strong>{formatZAR(MEMBERSHIP.annualFeeCents)}</strong>
          </p>
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-sm space-y-1 mb-3">
            {MEMBERSHIP.payShapProxy ? (
              <p>⚡ <strong>PayShap:</strong> {MEMBERSHIP.payShapProxy}</p>
            ) : (
              <p className="text-gray-400 text-xs">PayShap proxy to be confirmed by the committee.</p>
            )}
            <p>🏦 <strong>{MEMBERSHIP.banking.bank}</strong> · {MEMBERSHIP.banking.accountName}</p>
            {MEMBERSHIP.banking.accountNumber && <p>Acc: {MEMBERSHIP.banking.accountNumber} · Branch {MEMBERSHIP.banking.branchCode}</p>}
            <p>Reference: <strong>{ref}</strong></p>
          </div>
          <p className="text-[11px] text-gray-400 mb-3">
            After paying, tap below so the committee can match and confirm your payment.
          </p>
          <button
            onClick={() => submit('membership_payment', `Membership payment notified. Ref ${ref}, amount ${formatZAR(MEMBERSHIP.annualFeeCents)}.`, "Thanks — we'll confirm your payment")}
            disabled={busy}
            className="w-full py-3 rounded-xl text-white font-bold text-sm disabled:opacity-50"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {busy ? 'Sending…' : "I've paid — notify committee"}
          </button>
        </Sheet>
      )}

      {/* Debit order sheet */}
      {sheet === 'debit' && (
        <Sheet onClose={() => setSheet(null)} title="Debit order">
          <p className="text-sm text-gray-600 mb-3">Manage your monthly debit order.</p>
          <div className="space-y-2">
            <button
              onClick={() => submit('debit_order_create', 'Resident requested to SET UP a debit order.', 'Debit-order setup requested')}
              disabled={busy}
              className="w-full py-3 rounded-xl text-white font-bold text-sm disabled:opacity-50"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Set up a debit order
            </button>
            <button
              onClick={() => submit('debit_order_cancel', 'Resident requested to CANCEL their debit order.', 'Cancellation requested — committee notified')}
              disabled={busy}
              className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-bold text-sm disabled:opacity-50"
            >
              Cancel my debit order
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-3">
            Requests are sent to the treasurer. You&apos;ll be notified once actioned.
          </p>
        </Sheet>
      )}
    </div>
  );
}

function ActionButton({ emoji, label, onClick }: { emoji: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-3 text-left active:scale-[0.98] transition-transform">
      <span className="text-lg">{emoji}</span>
      <span className="text-xs font-bold text-gray-800">{label}</span>
    </button>
  );
}

function Sheet({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-w-lg p-5 pb-8 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 text-xl">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function invoiceHtml(user: User, ref: string): string {
  const date = new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
  const amount = formatZAR(MEMBERSHIP.annualFeeCents);
  return `<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${ref}</title>
  <style>
    body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#111;padding:40px;max-width:640px;margin:auto}
    h1{font-size:22px;margin:0 0 4px} .muted{color:#666;font-size:13px}
    table{width:100%;border-collapse:collapse;margin-top:24px}
    th,td{text-align:left;padding:10px 8px;border-bottom:1px solid #eee;font-size:14px}
    .total{font-weight:800;font-size:18px} .box{background:#f7f7f7;border-radius:10px;padding:14px;margin-top:20px;font-size:13px}
    .head{display:flex;justify-content:space-between;align-items:flex-start}
  </style></head><body>
  <div class="head">
    <div><h1>${MEMBERSHIP.organisation}</h1><p class="muted">Membership Invoice</p></div>
    <div class="muted" style="text-align:right">Invoice #${ref}<br/>${date}</div>
  </div>
  <table>
    <tr><th>Billed to</th><th style="text-align:right">Details</th></tr>
    <tr><td>${user.name}</td><td style="text-align:right">${user.email}</td></tr>
    <tr><td>Unit / Block</td><td style="text-align:right">${user.unitBlock || '—'}</td></tr>
  </table>
  <table>
    <tr><th>Description</th><th style="text-align:right">Amount</th></tr>
    <tr><td>Annual membership fee</td><td style="text-align:right">${amount}</td></tr>
    <tr><td class="total">Total due</td><td class="total" style="text-align:right">${amount}</td></tr>
  </table>
  <div class="box">
    <strong>Payment</strong><br/>
    ${MEMBERSHIP.payShapProxy ? `PayShap: ${MEMBERSHIP.payShapProxy}<br/>` : ''}
    Bank: ${MEMBERSHIP.banking.bank} · ${MEMBERSHIP.banking.accountName}<br/>
    ${MEMBERSHIP.banking.accountNumber ? `Account: ${MEMBERSHIP.banking.accountNumber} · Branch ${MEMBERSHIP.banking.branchCode}<br/>` : ''}
    Reference: <strong>${ref}</strong>
  </div>
  <p class="muted" style="margin-top:30px">Membership must be paid to retain voting rights per the SX7RA Constitution.</p>
  </body></html>`;
}
