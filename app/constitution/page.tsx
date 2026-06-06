'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
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
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="font-extrabold text-gray-900">Constitution</h1>
            <p className="text-xs text-gray-400">SX7RA Governing Document v2.1</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl">
        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-900">
            <strong>📋 Official Document:</strong> This constitution is the founding document of the Sundowner Extension 7 Residents Association NPC (SX7RA). It operates beneath the Memorandum of Incorporation (MOI) and is binding on all members, committee members, and Directors.
          </p>
        </div>

        {/* Table of contents */}
        <div className="mb-8">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Contents</h2>
          <div className="grid grid-cols-1 gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => toggleSection(section.id)}
                className="text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700 text-sm">{section.title}</span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedSection === section.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <h3 className="font-bold text-gray-900">{section.title}</h3>
                  {section.subtitle && <p className="text-xs text-gray-500 mt-1">{section.subtitle}</p>}
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 ml-3 transition-transform ${
                    expandedSection === section.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              {expandedSection === section.id && (
                <div className="border-t border-gray-200 px-4 py-4 bg-gray-50">
                  <div className="prose prose-sm max-w-none">
                    {section.content.map((item, idx) => (
                      <div key={idx} className="mb-4 last:mb-0">
                        {item.type === 'heading' && (
                          <h4 className="font-bold text-gray-900 mt-3 mb-2">{item.text}</h4>
                        )}
                        {item.type === 'paragraph' && (
                          <p className="text-gray-700 text-sm leading-relaxed">{item.text}</p>
                        )}
                        {item.type === 'list' && (
                          <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                            {item.items?.map((i, jdx) => (
                              <li key={jdx}>{i}</li>
                            ))}
                          </ul>
                        )}
                        {item.type === 'highlight' && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 my-2">
                            <p className="text-sm text-amber-900 font-semibold">{item.text}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-8 p-4 rounded-xl border border-gray-200 bg-gray-50">
          <h3 className="font-bold text-gray-900 text-sm mb-2">Key Rules Enforced in the App</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>✓ Only paying members can vote in AGM/General Meetings</li>
            <li>✓ One vote per paying member (regardless of property)</li>
            <li>✓ Proxy voting allowed (written, 24 hours notice)</li>
            <li>✓ Committee elections: Only paying members can stand</li>
            <li>✓ Quorum: 25% of paying members OR 10 members (whichever is lower)</li>
            <li>✓ Special resolutions: 75% majority required</li>
            <li>✓ Annual fee due March 1st, lapse March 31st</li>
            <li>✓ Members can suspend/expel for Code of Conduct breaches (with 14-day notice)</li>
          </ul>
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
      {
        type: 'heading',
        text: 'Official Name',
      },
      {
        type: 'paragraph',
        text: 'Sundowner Extension 7 Residents Association NPC (SX7RA)',
      },
      {
        type: 'paragraph',
        text: 'Company Registration Number: 2017/337616/08. Registered as a Non-Profit Company under the Companies Act 71 of 2008.',
      },
      {
        type: 'highlight',
        text: 'The Association is NOT a homeowners association, body corporate, or sectional title scheme. Membership is entirely voluntary.',
      },
    ],
  },
  {
    id: '2-membership',
    title: '2. Membership & Voting Rights',
    subtitle: 'Who can be a member and how voting works',
    content: [
      {
        type: 'heading',
        text: 'Two Membership Categories',
      },
      {
        type: 'list',
        items: [
          'Paying Member: Resident who paid annual fee. Can vote, stand for election, be appointed as Director.',
          'Non-Paying Member: Resident who has not paid annual fee. Can attend meetings and participate, but cannot vote or hold office.',
        ],
      },
      {
        type: 'heading',
        text: 'Voting Rights',
      },
      {
        type: 'list',
        items: [
          'Each paying member in good standing has ONE vote',
          'Equal voting power regardless of property ownership',
          'Proxy voting allowed: Must be in writing, signed, dated, submitted 24 hours before meeting',
          'Proxy can be any natural person, including non-paying household members',
        ],
      },
      {
        type: 'heading',
        text: 'Annual Membership Fee',
      },
      {
        type: 'paragraph',
        text: 'Due: March 1st annually. Members who do not pay by March 31st automatically lapse to non-paying status and lose voting rights until fee is paid.',
      },
      {
        type: 'highlight',
        text: 'The Board may waive or reduce fees for members experiencing genuine financial hardship.',
      },
    ],
  },
  {
    id: '3-governance',
    title: '3. Governance Structure',
    subtitle: 'Board of Directors and Operations Committee',
    content: [
      {
        type: 'heading',
        text: 'Board of Directors',
      },
      {
        type: 'list',
        items: [
          'Minimum 3 Directors at all times',
          'Appointed from paying members in good standing',
          'Bear fiduciary duties under Companies Act',
          'Removed only by ordinary resolution at General Meeting',
        ],
      },
      {
        type: 'heading',
        text: 'Operations Committee',
      },
      {
        type: 'list',
        items: [
          'Manages day-to-day affairs of Association',
          '5-8 members including: Chairperson, Deputy Chairperson, Secretary, Treasurer, Communications Officer, up to 3 Additional Members',
          'All must be paying members in good standing',
          'Elected annually at AGM by ordinary resolution',
          'Must hold minimum 10 meetings per year',
        ],
      },
      {
        type: 'heading',
        text: 'Committee Duties',
      },
      {
        type: 'list',
        items: [
          'Chairperson: Chairs meetings, primary representative, one of two bank signatories',
          'Secretary: Administrative functions, maintains registers, distributes minutes within 10 business days',
          'Treasurer: Financial management, monthly reports, annual statements, one of two bank signatories',
          'Communications Officer: Manages communications, coordinates engagement, surveys, and awareness',
        ],
      },
    ],
  },
  {
    id: '4-meetings',
    title: '4. Meetings & Voting',
    subtitle: 'AGM, General Meetings, and voting procedures',
    content: [
      {
        type: 'heading',
        text: 'Annual General Meeting (AGM)',
      },
      {
        type: 'list',
        items: [
          'Once per calendar year, within 15 months of previous AGM',
          'Notice required: 21 days minimum with agenda',
          'Notice must include current paying member count for quorum calculation',
          'Ordinary business: Minutes, Chair report, financial statements, committee elections, fee fixing',
        ],
      },
      {
        type: 'heading',
        text: 'General Meetings',
      },
      {
        type: 'list',
        items: [
          'Convened by Board/Committee or by written request from 10% of paying members',
          'Notice required: 14 days minimum',
          'Used for regular business',
        ],
      },
      {
        type: 'heading',
        text: 'Special General Meetings (SGM)',
      },
      {
        type: 'list',
        items: [
          'For specific purposes: Constitution amendments, dissolution, amalgamation',
          'Notice required: 30 days minimum with clear statement of business',
          'No other business may be transacted at SGM',
        ],
      },
      {
        type: 'heading',
        text: 'Quorum Requirements',
      },
      {
        type: 'highlight',
        text: 'Quorum = Greater of (a) 25% of paying members OR (b) 10 members, whichever is LOWER.',
      },
      {
        type: 'paragraph',
        text: 'Example: 60 members = 15 quorum. 30 members = 10 quorum.',
      },
      {
        type: 'paragraph',
        text: 'If quorum not met: Meeting adjourns for 1 week. At adjourned meeting, any 10 paying members present = quorum.',
      },
      {
        type: 'heading',
        text: 'Voting',
      },
      {
        type: 'list',
        items: [
          'Ordinary resolution: Simple majority of votes exercised',
          'Special resolution: 75% majority of votes exercised (for constitution changes, dissolution)',
          'Chairperson has casting vote in event of tie',
          'Voting by show of hands unless majority calls for secret ballot',
        ],
      },
    ],
  },
  {
    id: '5-finance',
    title: '5. Financial Management',
    subtitle: 'Money handling and accountability',
    content: [
      {
        type: 'heading',
        text: 'Bank Account & Signatories',
      },
      {
        type: 'list',
        items: [
          'All funds held in dedicated bank account in Association name',
          'Minimum 3 authorized signatories',
          'ALL transactions require 2 signatures (at least one must be Chairperson or Treasurer)',
        ],
      },
      {
        type: 'heading',
        text: 'Approvals Required',
      },
      {
        type: 'list',
        items: [
          'Payments exceeding Board-determined threshold: Board approval',
          'Payments exceeding AGM-determined threshold: AGM approval',
          'Borrowing or debt: Board resolution',
        ],
      },
      {
        type: 'heading',
        text: 'Financial Year & Reporting',
      },
      {
        type: 'paragraph',
        text: 'Financial year: March 1 to February 28 (or as AGM determines)',
      },
      {
        type: 'list',
        items: [
          'Annual statements prepared within 3 months of year-end',
          'Subject to independent review or audit (as AGM determines)',
          'Members may inspect books on written request',
        ],
      },
      {
        type: 'highlight',
        text: 'No member, committee member, or Director can personally benefit from Association funds except as reasonable compensation for services rendered.',
      },
    ],
  },
  {
    id: '6-code-conduct',
    title: '6. Code of Conduct',
    subtitle: 'Behavior standards and enforcement',
    content: [
      {
        type: 'heading',
        text: 'Conduct Standards',
      },
      {
        type: 'list',
        items: [
          'Dignified, respectful, and constructive behavior at all meetings',
          'No action bringing Association into disrepute',
          'No use of Association resources or name for personal gain',
          'No acceptance of gifts/rewards to influence decisions',
          'Declare conflicts of interest and recuse from voting',
          'No firearms or weapons at Association meetings',
          'Maintain confidentiality of Board-designated information',
        ],
      },
      {
        type: 'heading',
        text: 'Enforcement',
      },
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
      {
        type: 'heading',
        text: 'Dissolution Process',
      },
      {
        type: 'list',
        items: [
          'Special resolution required: 75% majority at SGM',
          'Notice: 30 days minimum to all members',
          'If no quorum at first meeting: Adjourned 2 weeks, members present then constitute quorum',
        ],
      },
      {
        type: 'heading',
        text: 'Asset Distribution',
      },
      {
        type: 'highlight',
        text: 'Assets are NOT distributed to members. Remaining assets (after debts paid) transferred to similar non-profit entities as determined by Members or Directors.',
      },
    ],
  },
  {
    id: '8-amendments',
    title: '8. Amendment & Interpretation',
    subtitle: 'Changing the constitution',
    content: [
      {
        type: 'heading',
        text: 'How to Amend',
      },
      {
        type: 'list',
        items: [
          'Special resolution required: 75% majority at SGM',
          'Notice: 30 days minimum with clear statement of changes and reasons',
          'Cannot remove non-profit status or allow personal distribution of assets',
        ],
      },
      {
        type: 'heading',
        text: 'Precedence',
      },
      {
        type: 'paragraph',
        text: 'This Constitution operates beneath the Memorandum of Incorporation (MOI). Where conflict exists, MOI prevails.',
      },
    ],
  },
];
