'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import AppHeader from '@/components/AppHeader';
import LoadingScreen from '@/components/LoadingScreen';

export default function ConstitutionPage() {
  const { user, loading } = useAuth();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (loading) return <LoadingScreen message="Loading Constitution…" />;

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--background)' }}>
      <AppHeader title="Constitution" showBack backHref="/" />

      <div className="px-4 py-5 max-w-2xl mx-auto">

        {/* Info banner */}
        <div
          className="rounded-2xl p-4 mb-5 flex items-start gap-3"
          style={{ backgroundColor: 'var(--brand-black)' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ backgroundColor: 'rgba(204,18,18,0.2)' }}
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="font-extrabold text-white text-sm">Official Document</p>
            <p className="text-white/60 text-xs mt-0.5 leading-relaxed">
              Founding document of SX7RA NPC (Reg. 2017/337616/08). Operates beneath the MOI and is binding on all members, committee members and Directors.
            </p>
            <p className="text-white/40 text-xs mt-1.5">v2.1 · Tap a section to expand</p>
          </div>
        </div>

        {/* Single accordion — no duplicate TOC */}
        <div className="space-y-2">
          {sections.map((section) => {
            const isOpen = expandedSection === section.id;
            return (
              <div
                key={section.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Section header — always visible */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full text-left px-4 py-4 flex items-center gap-3 transition-colors"
                  style={{ backgroundColor: isOpen ? 'var(--brand-black)' : 'white' }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-extrabold"
                    style={{
                      backgroundColor: isOpen ? 'rgba(204,18,18,0.3)' : 'var(--primary-bg)',
                      color: isOpen ? 'white' : 'var(--primary)',
                    }}
                  >
                    {section.id.split('-')[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-bold text-sm leading-snug"
                      style={{ color: isOpen ? 'white' : '#111111' }}
                    >
                      {section.title.replace(/^\d+\.\s*/, '')}
                    </p>
                    {section.subtitle && (
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: isOpen ? 'rgba(255,255,255,0.5)' : '#9ca3af' }}
                      >
                        {section.subtitle}
                      </p>
                    )}
                  </div>
                  <svg
                    className="w-5 h-5 flex-shrink-0 transition-transform"
                    style={{
                      color: isOpen ? 'rgba(255,255,255,0.5)' : '#9ca3af',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="px-4 py-4 bg-gray-50 border-t border-gray-100 space-y-3">
                    {section.content.map((item, idx) => (
                      <div key={idx}>
                        {item.type === 'heading' && (
                          <p className="font-extrabold text-gray-900 text-sm mt-2 mb-1">{item.text}</p>
                        )}
                        {item.type === 'paragraph' && (
                          <p className="text-gray-700 text-sm leading-relaxed">{item.text}</p>
                        )}
                        {item.type === 'list' && (
                          <ul className="space-y-1.5">
                            {item.items?.map((i, jdx) => (
                              <li key={jdx} className="flex items-start gap-2 text-sm text-gray-700">
                                <span
                                  className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: 'var(--primary)' }}
                                />
                                <span className="leading-relaxed">{i}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {item.type === 'highlight' && (
                          <div
                            className="rounded-xl p-3 border"
                            style={{
                              backgroundColor: 'var(--primary-bg)',
                              borderColor: 'rgba(204,18,18,0.2)',
                            }}
                          >
                            <p className="text-sm leading-relaxed font-semibold" style={{ color: 'var(--primary-dark)' }}>
                              {item.text}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Key rules enforced by app */}
        <div className="mt-5 p-4 rounded-2xl border border-gray-200 bg-white">
          <p className="font-extrabold text-gray-900 text-sm mb-3">Key Rules Enforced in This App</p>
          <div className="space-y-2">
            {[
              'Only paying members can vote in AGM / General Meetings',
              'One vote per paying member (equal regardless of property)',
              'Proxy voting allowed — written, signed, 24 hours notice',
              'Only paying members can stand for committee election',
              'Quorum: 25% of paying members OR 10 members (whichever is lower)',
              'Special resolutions require 75% majority',
              'Annual fee due March 1st, lapses March 31st',
              'Suspension / expulsion requires 14-day written notice',
            ].map((rule) => (
              <div key={rule} className="flex items-start gap-2 text-xs text-gray-600">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const sections = [
  {
    id: '1-name',
    title: '1. Name & Legal Status',
    subtitle: 'Official designation and registration',
    content: [
      { type: 'heading', text: 'Official Name' },
      { type: 'paragraph', text: 'Sundowner Extension 7 Residents Association NPC (SX7RA)' },
      { type: 'paragraph', text: 'Company Registration Number: 2017/337616/08. Registered as a Non-Profit Company under the Companies Act 71 of 2008.' },
      { type: 'highlight', text: 'The Association is NOT a homeowners association, body corporate, or sectional title scheme. Membership is entirely voluntary.' },
    ],
  },
  {
    id: '2-membership',
    title: '2. Membership & Voting Rights',
    subtitle: 'Who can be a member and how voting works',
    content: [
      { type: 'heading', text: 'Two Membership Categories' },
      {
        type: 'list',
        items: [
          'Paying Member: Resident who paid annual fee — can vote, stand for election, be appointed as Director.',
          'Non-Paying Member: Resident who has not paid — can attend meetings, but cannot vote or hold office.',
        ],
      },
      { type: 'heading', text: 'Voting Rights' },
      {
        type: 'list',
        items: [
          'Each paying member in good standing has ONE vote',
          'Equal voting power regardless of property ownership',
          'Proxy voting allowed: Must be in writing, signed, dated, submitted 24 hours before meeting',
          'Proxy can be any natural person, including non-paying household members',
        ],
      },
      { type: 'heading', text: 'Annual Membership Fee' },
      { type: 'paragraph', text: 'Due March 1st annually. Members who do not pay by March 31st automatically lapse to non-paying status and lose voting rights until fee is paid.' },
      { type: 'highlight', text: 'The Board may waive or reduce fees for members experiencing genuine financial hardship.' },
    ],
  },
  {
    id: '3-governance',
    title: '3. Governance Structure',
    subtitle: 'Board of Directors and Operations Committee',
    content: [
      { type: 'heading', text: 'Board of Directors' },
      {
        type: 'list',
        items: [
          'Minimum 3 Directors at all times',
          'Appointed from paying members in good standing',
          'Bear fiduciary duties under Companies Act',
          'Removed only by ordinary resolution at General Meeting',
        ],
      },
      { type: 'heading', text: 'Operations Committee' },
      {
        type: 'list',
        items: [
          'Manages day-to-day affairs of the Association',
          '5–8 members: Chairperson, Deputy Chairperson, Secretary, Treasurer, Communications Officer, up to 3 Additional Members',
          'All must be paying members in good standing',
          'Elected annually at AGM by ordinary resolution',
          'Must hold minimum 10 meetings per year',
        ],
      },
      { type: 'heading', text: 'Committee Duties' },
      {
        type: 'list',
        items: [
          'Chairperson: Chairs meetings, primary representative, one of two bank signatories',
          'Secretary: Administrative functions, maintains registers, distributes minutes within 10 business days',
          'Treasurer: Financial management, monthly reports, annual statements, one of two bank signatories',
          'Communications Officer: Manages communications, coordinates engagement, surveys and awareness',
        ],
      },
    ],
  },
  {
    id: '4-meetings',
    title: '4. Meetings & Voting',
    subtitle: 'AGM, General Meetings, and voting procedures',
    content: [
      { type: 'heading', text: 'Annual General Meeting (AGM)' },
      {
        type: 'list',
        items: [
          'Once per calendar year, within 15 months of previous AGM',
          'Notice: 21 days minimum with agenda',
          'Notice must include current paying member count for quorum calculation',
          'Ordinary business: Minutes, Chair report, financial statements, committee elections, fee fixing',
        ],
      },
      { type: 'heading', text: 'General Meetings' },
      {
        type: 'list',
        items: [
          'Convened by Board/Committee or by written request from 10% of paying members',
          'Notice: 14 days minimum',
        ],
      },
      { type: 'heading', text: 'Special General Meetings (SGM)' },
      {
        type: 'list',
        items: [
          'For: Constitution amendments, dissolution, amalgamation',
          'Notice: 30 days minimum with clear statement of business',
          'No other business may be transacted at SGM',
        ],
      },
      { type: 'heading', text: 'Quorum' },
      { type: 'highlight', text: 'Quorum = whichever is LOWER of: (a) 25% of paying members, OR (b) 10 members.' },
      { type: 'paragraph', text: 'If quorum not met: Meeting adjourns 1 week. At adjourned meeting, any 10 paying members present = quorum.' },
      { type: 'heading', text: 'Voting' },
      {
        type: 'list',
        items: [
          'Ordinary resolution: Simple majority of votes exercised',
          'Special resolution: 75% majority (for constitution changes, dissolution)',
          'Chairperson has casting vote in event of a tie',
          'By show of hands unless majority calls for secret ballot',
        ],
      },
    ],
  },
  {
    id: '5-finance',
    title: '5. Financial Management',
    subtitle: 'Money handling and accountability',
    content: [
      { type: 'heading', text: 'Bank Account & Signatories' },
      {
        type: 'list',
        items: [
          'All funds held in dedicated bank account in Association name',
          'Minimum 3 authorised signatories',
          'ALL transactions require 2 signatures (at least one must be Chairperson or Treasurer)',
        ],
      },
      { type: 'heading', text: 'Approvals Required' },
      {
        type: 'list',
        items: [
          'Payments exceeding Board-determined threshold: Board approval',
          'Payments exceeding AGM-determined threshold: AGM approval',
          'Borrowing or debt: Board resolution',
        ],
      },
      { type: 'heading', text: 'Financial Year & Reporting' },
      { type: 'paragraph', text: 'Financial year: March 1 to February 28 (or as AGM determines).' },
      {
        type: 'list',
        items: [
          'Annual statements prepared within 3 months of year-end',
          'Subject to independent review or audit (as AGM determines)',
          'Members may inspect books on written request',
        ],
      },
      { type: 'highlight', text: 'No member, committee member, or Director can personally benefit from Association funds except as reasonable compensation for services rendered.' },
    ],
  },
  {
    id: '6-code-conduct',
    title: '6. Code of Conduct',
    subtitle: 'Behaviour standards and enforcement',
    content: [
      { type: 'heading', text: 'Standards' },
      {
        type: 'list',
        items: [
          'Dignified, respectful and constructive behaviour at all meetings',
          'No action bringing the Association into disrepute',
          'No use of Association resources or name for personal gain',
          'No acceptance of gifts/rewards to influence decisions',
          'Declare conflicts of interest and recuse from voting',
          'No firearms or weapons at Association meetings',
          'Maintain confidentiality of Board-designated information',
        ],
      },
      { type: 'heading', text: 'Enforcement' },
      {
        type: 'list',
        items: [
          'Chairperson may require disruptive person to leave meeting',
          'Suspension/expulsion by Board for material breaches',
          '14-day written notice of alleged conduct required before decision',
          'Member may respond in writing before decision',
          'Expelled member may appeal to next General Meeting (decision final)',
        ],
      },
    ],
  },
  {
    id: '7-dissolution',
    title: '7. Dissolution & Winding Up',
    subtitle: 'End of Association',
    content: [
      { type: 'heading', text: 'Dissolution Process' },
      {
        type: 'list',
        items: [
          'Special resolution required: 75% majority at SGM',
          'Notice: 30 days minimum to all members',
          'If no quorum: Adjourned 2 weeks, members present then constitute quorum',
        ],
      },
      { type: 'highlight', text: 'Assets are NOT distributed to members. Remaining assets (after debts paid) transferred to similar non-profit entities as determined by Members or Directors.' },
    ],
  },
  {
    id: '8-amendments',
    title: '8. Amendment & Interpretation',
    subtitle: 'Changing the constitution',
    content: [
      { type: 'heading', text: 'How to Amend' },
      {
        type: 'list',
        items: [
          'Special resolution required: 75% majority at SGM',
          'Notice: 30 days minimum with clear statement of changes and reasons',
          'Cannot remove non-profit status or allow personal distribution of assets',
        ],
      },
      { type: 'heading', text: 'Precedence' },
      { type: 'paragraph', text: 'This Constitution operates beneath the Memorandum of Incorporation (MOI). Where conflict exists, the MOI prevails.' },
    ],
  },
];
