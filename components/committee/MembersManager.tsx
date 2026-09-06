'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import {
  getAllUsers,
  updateUserGovernance,
  updateMembershipStatus,
} from '@/lib/services/userService';
import {
  getAssociationSettings,
  updateAssociationSettings,
  AssociationSettings,
} from '@/lib/services/settingsService';
import { User, UserRole, MembershipStatus } from '@/lib/types';

interface Props {
  currentUserId: string;
  isSuperAdmin: boolean;
}

const ROLES: UserRole[] = ['resident', 'committee', 'admin', 'super_admin'];
const STATUSES: MembershipStatus[] = ['paying', 'non-paying', 'suspended', 'expelled'];

export default function MembersManager({ currentUserId, isSuperAdmin }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<AssociationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [u, s] = await Promise.all([getAllUsers(), getAssociationSettings()]);
      setUsers(u);
      setSettings(s);
    } catch {
      toast.error('Could not load members');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const staff = useMemo(() => users.filter((u) => u.role !== 'resident'), [users]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.unitBlock?.toLowerCase().includes(q),
    );
  }, [users, search]);

  const patchUser = (uid: string, patch: Partial<User>) =>
    setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, ...patch } : u)));

  const toggleFlag = async () => {
    if (!settings) return;
    const next = !settings.allowNonMemberApproval;
    setSettings({ ...settings, allowNonMemberApproval: next });
    try {
      await updateAssociationSettings({ allowNonMemberApproval: next }, currentUserId);
      toast.success('Setting saved');
    } catch {
      toast.error('Save failed');
      setSettings({ ...settings, allowNonMemberApproval: !next });
    }
  };

  const setRole = async (u: User, role: UserRole) => {
    patchUser(u.uid, { role });
    try { await updateUserGovernance(u.uid, { role }); toast.success(`${u.name}: ${role}`); }
    catch { toast.error('Update failed'); load(); }
  };

  const setPortfolio = async (u: User, portfolio: string) => {
    patchUser(u.uid, { portfolio });
    try { await updateUserGovernance(u.uid, { portfolio }); }
    catch { toast.error('Update failed'); }
  };

  const toggleBoard = async (u: User) => {
    const next = !u.isBoardMember;
    patchUser(u.uid, { isBoardMember: next });
    try { await updateUserGovernance(u.uid, { isBoardMember: next }); }
    catch { toast.error('Update failed'); load(); }
  };

  const setStatus = async (u: User, membershipStatus: MembershipStatus) => {
    const canVote = membershipStatus === 'paying';
    patchUser(u.uid, { membershipStatus, canVote, canStandForOffice: canVote });
    try {
      await updateMembershipStatus(u.uid, { membershipStatus, canVote, canStandForOffice: canVote });
      toast.success(`${u.name}: ${membershipStatus}`);
    } catch { toast.error('Update failed'); load(); }
  };

  const exportCsv = () => {
    const headers = ['Name', 'Email', 'Cell', 'Unit/Block', 'ERF', 'Role', 'Portfolio', 'BOD', 'Membership', 'Can Vote', 'Joined'];
    const rows = users.map((u) => [
      u.name ?? '', u.email ?? '', u.cell ?? u.phone ?? '', u.unitBlock ?? '', u.erfNumber ?? '',
      u.role, u.portfolio ?? '', u.isBoardMember ? 'Yes' : '', u.membershipStatus ?? 'non-paying',
      u.canVote ? 'Yes' : 'No', u.joinedAt ? new Date(u.joinedAt).toISOString().slice(0, 10) : '',
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sx7ra-residents-register-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <p className="text-sm text-gray-400 text-center py-8">Loading members…</p>;

  return (
    <div className="space-y-6">
      {/* ── Authorization flag ─────────────────────────────── */}
      <section>
        <h2 className="font-extrabold text-gray-900 mb-1">Governance settings</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-sm">Allow approval of non-valid members</p>
            <p className="text-xs text-gray-400 mt-0.5">
              When on, committee may admit members who don&apos;t yet meet the &ldquo;valid member&rdquo; criteria (e.g. not yet paid).
            </p>
          </div>
          <button
            onClick={toggleFlag}
            disabled={!isSuperAdmin}
            className="w-12 h-7 rounded-full flex-shrink-0 transition-colors disabled:opacity-40 relative"
            style={{ backgroundColor: settings?.allowNonMemberApproval ? 'var(--primary)' : '#d1d5db' }}
            aria-label="Toggle non-member approval"
          >
            <span
              className="absolute top-1 w-5 h-5 bg-white rounded-full transition-transform"
              style={{ transform: settings?.allowNonMemberApproval ? 'translateX(22px)' : 'translateX(4px)' }}
            />
          </button>
        </div>
        {!isSuperAdmin && (
          <p className="text-[11px] text-gray-400 mt-1">Only a super admin can change this setting.</p>
        )}
      </section>

      {/* ── BOD & Committee roster ─────────────────────────── */}
      <section>
        <h2 className="font-extrabold text-gray-900 mb-2">Committee &amp; Board (BOD)</h2>
        {staff.length === 0 ? (
          <p className="text-xs text-gray-400">No committee members assigned yet.</p>
        ) : (
          <div className="space-y-2">
            {staff.map((u) => (
              <div key={u.uid} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{u.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{u.email}</p>
                  </div>
                  <label className="flex items-center gap-1 text-[11px] text-gray-500 flex-shrink-0">
                    <input type="checkbox" checked={!!u.isBoardMember} onChange={() => toggleBoard(u)} /> BOD
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={u.role}
                    onChange={(e) => setRole(u, e.target.value as UserRole)}
                    disabled={!isSuperAdmin}
                    className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs disabled:opacity-50"
                  >
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <input
                    defaultValue={u.portfolio ?? ''}
                    onBlur={(e) => { if (e.target.value !== (u.portfolio ?? '')) setPortfolio(u, e.target.value); }}
                    placeholder="Portfolio"
                    className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Master Residents Register ──────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-extrabold text-gray-900">Master Residents Register</h2>
          <button
            onClick={exportCsv}
            className="text-xs font-bold px-2.5 py-1.5 rounded-lg border-2"
            style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
          >
            ⬇ CSV
          </button>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or unit…"
          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm mb-3 focus:outline-none"
        />
        <p className="text-[11px] text-gray-400 mb-2">{filtered.length} of {users.length} members</p>
        <div className="space-y-2">
          {filtered.map((u) => (
            <div key={u.uid} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">{u.name}</p>
                <p className="text-[11px] text-gray-400 truncate">
                  {u.unitBlock || '—'}{u.erfNumber ? ` · ERF ${u.erfNumber}` : ''}
                </p>
              </div>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: u.canVote ? '#dcfce7' : '#f3f4f6',
                  color: u.canVote ? '#15803d' : '#6b7280',
                }}
              >
                {u.canVote ? '🗳 Voting' : 'Non-voting'}
              </span>
              <select
                value={u.membershipStatus ?? 'non-paying'}
                onChange={(e) => setStatus(u, e.target.value as MembershipStatus)}
                className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs flex-shrink-0"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
