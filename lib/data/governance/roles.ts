/**
 * Role descriptions for every elected and appointed office in the Association.
 *
 * Transcribed verbatim from the eight SX7RA_Role_*.docx files. Each role cites
 * the Constitution clause it derives from — when the Constitution changes,
 * these need to change with it.
 */

export interface RoleDescription {
  slug: string;
  /** Role name as printed, e.g. "Vice-Chairperson" */
  title: string;
  /** The capacity line under the title */
  subtitle: string;
  /** Which body the role sits on */
  body: 'board' | 'committee' | 'both';
  emoji: string;
  /** One-line description for the role index */
  blurb: string;
  summary: string;
  reportsTo: string;
  appointment: string;
  term: string;
  eligibility: string;
  duties: string[];
  notes: string[];
  /** The Constitution clause(s) the role derives from */
  source: string;
}

export const roleDescriptions: RoleDescription[] = [
  {
    slug: "director",
    title: "Director",
    subtitle: "Board of Directors",
    body: "board",
    emoji: "⚖️",
    blurb: "Ultimate fiduciary responsibility for the Association",
    summary: "A Director sits on the Board of Directors, which bears ultimate fiduciary responsibility for the Association and holds the full legal authority of the company as set out in the MOI and the Companies Act. The Board must comprise at least three Directors at all times.",
    reportsTo: "Accountable to the Members, formally through the Annual General Meeting.",
    appointment: "Nominated by any member in good standing (including self-nomination), with nominations opening thirty days and closing fourteen days before the AGM. Each nomination is accompanied by a written statement of interest of no more than one page. Directors are then elected by the eligible members at the AGM by ordinary resolution, or appointed by acclamation where nominations equal the number of vacancies and no member objects. A vacancy arising between AGMs may be filled by Board co-option, subject to Member confirmation at the next General Meeting; co-opted Directors may not exceed one-third of the Board at any time. Every newly elected or co-opted Director must sign a written acceptance of office before taking up the position.",
    term: "Three years, with unlimited re-election. Roughly one-third of the Board stands for election each year so that the whole Board does not turn over at once, preserving continuity.",
    eligibility: "Any Residential Paying Member or Business Member's designated representative, in good standing and not disqualified under section 69 of the Companies Act, is eligible for nomination. Residence within the area of jurisdiction is not required.",
    duties: [
      "Act in good faith and in the best interests of the Association, avoid conflicts of interest, and exercise the care, skill and diligence reasonably expected of a person in that position, in line with sections 75 to 77 of the Companies Act.",
      "Attend and participate in Board meetings, which are held at least quarterly, and help maintain the quorum of a majority of Directors then in office (at least three present).",
      "Where designated, act as the Association's authorised representative on the CIPC e-Services portal, and lodge director appointments, resignations and annual returns as authorised by Board resolution.",
      "Be available to serve on the Operations Committee where elected to do so; a Director serving on the Committee holds both roles simultaneously and is not required to stand for annual Committee re-election.",
      "Declare and recuse from any matter in which the Director has a personal interest."
    ],
    notes: [
      "A Director may be removed by the Members by ordinary resolution, after notice and a reasonable opportunity to respond. A Director may resign by written notice to the Chairperson (or to the Vice-Chairperson if the Chairperson is resigning).",
      "Directors are entitled to the advancement of expenses, indemnification and insurance cover as provided in the MOI and the Companies Act."
    ],
    source: "The SX7RA Constitution, clause 6 (Governance Structure).",
  },
  {
    slug: "chairperson",
    title: "Chairperson",
    subtitle: "Board Chairperson and Committee Chairperson",
    body: "both",
    emoji: "🪑",
    blurb: "Presides over both the Board and the Committee",
    summary: "The same individual serves as both the presiding officer of the Board of Directors and the presiding officer of the Operations Committee. This role description covers both capacities.",
    reportsTo: "The Board (for Board-level matters) and the membership (through General Meetings).",
    appointment: "The Board-level role of Chairperson is allocated by the Board, from among the Directors, at its first meeting after the AGM.",
    term: "Runs alongside the Director term (three years) unless the role is re-allocated by the Board following an AGM.",
    eligibility: "Must be a serving Director of the Board.",
    duties: [
      "As Board Chairperson: preside at Board meetings and ensure proceedings follow the MOI and the Companies Act.",
      "Cast a deciding vote in the event of a tied Board vote, without an ordinary deliberative vote, to preserve neutrality in the chair.",
      "Sign contracts, correspondence and formal submissions on behalf of the Association within Board-approved financial limits.",
      "Execute urgent Board resolutions between meetings, subject to ratification at the next Board meeting.",
      "Prepare or oversee the Board meeting agenda in consultation with the Board Secretary, and act as one of the authorised bank signatories.",
      "As Committee Chairperson: preside at AGMs, Special General Meetings and Committee meetings, again with a deciding vote only in the event of a tie.",
      "Serve as the Association's primary external representative to the City of Johannesburg, ward councillors, contractors and other bodies, and may delegate Councillor Liaison to an appointed committee role.",
      "Prepare or oversee the Committee meeting agenda with the Committee Secretary, present a Chairperson's report at each AGM, and report to the Board on Committee activities."
    ],
    notes: [
      "The Chairperson may not simultaneously hold the position of Treasurer or Financial Director, and no Director may hold more than one executive office (Chairperson, Financial Director or Secretary, in their Board capacities).",
      "Where the Chairperson is absent from a Board meeting, or the office falls vacant, the Board appoints one of the Directors to act as Board Chairperson, since this function cannot pass to the Vice-Chairperson."
    ],
    source: "The SX7RA Constitution, clause 6 (Governance Structure).",
  },
  {
    slug: "vice-chairperson",
    title: "Vice-Chairperson",
    subtitle: "Deputy Chairperson, Operations Committee",
    body: "committee",
    emoji: "🤝",
    blurb: "Deputy to the Chairperson at Committee level",
    summary: "The Vice-Chairperson is the designated successor and operational support to the Chairperson, acting at Committee level. The Vice-Chairperson is a member of the Operations Committee and is not a Director of the Board.",
    reportsTo: "The Chairperson, and through the Chairperson, the Board and the membership.",
    appointment: "Elected as a committee member at the AGM; the role of Vice-Chairperson is then allocated among the elected committee members at the Committee's first meeting after the AGM.",
    term: "One year, as for all committee members, with unlimited re-election.",
    eligibility: "Must be a paying member of the Association in good standing at nomination, election and throughout the term.",
    duties: [
      "Assume the powers and duties of the Committee Chairperson whenever the Chairperson is absent, incapacitated, or has declared a conflict of interest in a matter before the Committee or a General Meeting.",
      "Assist the Chairperson in external representations and community engagement as directed.",
      "Take specific portfolio responsibility for one or more operational areas assigned by the Board, for example infrastructure liaison, safety co-ordination or community projects.",
      "Take on the role of Committee Chairperson for the remainder of the term if the Chairperson vacates office, until the Board re-allocates the role following the next AGM.",
      "Attend all Board meetings as a standing invitee, participating fully in discussion and reporting on Committee matters, though without a Board vote.",
      "Exercise full voting rights at Committee meetings and General Meetings as a paying member."
    ],
    notes: [
      "Because the Vice-Chairperson is not a Director, they may not vote on Board resolutions and do not carry a Director's fiduciary duties, and the functions of the Board Chairperson cannot pass to them. Where the Chairperson is absent from a Board meeting, or the office is vacant, the Board appoints one of the Directors to act as Board Chairperson instead."
    ],
    source: "The SX7RA Constitution, clause 6 (Governance Structure).",
  },
  {
    slug: "treasurer",
    title: "Treasurer",
    subtitle: "Financial Director (Board level)",
    body: "both",
    emoji: "💰",
    blurb: "Financial Director at Board level",
    summary: "The Treasurer holds the Board-level title of Financial Director, and carries the same duties in both capacities, subject to the oversight of the Board.",
    reportsTo: "The Board, with monthly reporting to both the Committee and the Board.",
    appointment: "Allocated among the elected Directors at the Board's first meeting after the AGM, alongside the Chairperson role.",
    term: "Runs alongside the Director term (three years) unless re-allocated by the Board following an AGM.",
    eligibility: "Must be a serving Director of the Board.",
    duties: [
      "Be responsible for the financial management of the Association under Board oversight.",
      "Maintain accurate books of account and financial records.",
      "Prepare and present monthly financial reports to the Committee and the Board.",
      "Prepare and present annual financial statements, subject to independent review or audit, to the Annual General Meeting.",
      "Act as one of the Association's authorised bank signatories.",
      "Ensure that all funds are deposited promptly into the Association's bank account."
    ],
    notes: [
      "The Financial Director may not simultaneously hold the position of Chairperson, to preserve the separation of financial oversight from the chair."
    ],
    source: "The SX7RA Constitution, clause 6 (Governance Structure).",
  },
  {
    slug: "secretary",
    title: "Secretary",
    subtitle: "Board Secretary and Committee Secretary",
    body: "both",
    emoji: "📝",
    blurb: "Records and statutory registers for both bodies",
    summary: "The Secretary role exists at two levels: Board Secretary, serving the Board of Directors, and Committee Secretary, serving the Operations Committee. The same individual may hold both positions, or separate persons may be appointed to each. Note: As this role applies to Boar Secretary and Committee Secretary, where the Role Description states Committee is should be substituted with Board for Board Secretary purposes (or where the role for both are filled by the same person).",
    reportsTo: "The Board Chairperson (for Board Secretary duties) and the Committee Chairperson (for Committee Secretary duties).",
    appointment: "Allocated among the elected committee members at the Committee's first meeting after the AGM, following the same process as other committee roles. A Director may also serve as Board Secretary and/or Committee Secretary.",
    term: "One year, as for all committee members, with unlimited re-election.",
    eligibility: "Must be a paying member of the Association in good standing at nomination, election and throughout the term.",
    duties: [
      "As Board Secretary: prepare and distribute Board meeting agendas with the Board Chairperson, and record accurate Board minutes, circulated for approval within ten business days.",
      "Maintain the Directors Register, the register of Board resolutions, and all statutory records required under the MOI and the Companies Act, together with the Association's MOI, constitution and CIPC filings.",
      "Record every update made to the CIPC register, noting the nature and date of the change and the authorising resolution.",
      "As Committee Secretary: prepare and distribute Committee meeting agendas with the Committee Chairperson, and record accurate minutes of Committee and General Meetings, circulated for approval within ten business days.",
      "Maintain the Members Register and the correspondence register, and ensure the City of Johannesburg ward councillor(s) receive copies of meeting minutes and notices.",
      "Give committee members at least five days' notice of Committee meetings, together with the agenda."
    ],
    notes: [
      "Where a Director serves as Board Secretary, another Board member reviews and countersigns the Board minutes before circulation, to preserve impartiality of the record.",
      "Where separate persons hold the two positions, each is responsible for the records of their respective body; the Committee Secretary's mandate may be extended to Board meetings by Board resolution."
    ],
    source: "The SX7RA Constitution, clause 6 (Governance Structure).",
  },
  {
    slug: "communications-officer",
    title: "Communications and Community Engagement Officer",
    subtitle: "Operations Committee",
    body: "committee",
    emoji: "📣",
    blurb: "Member and community communication",
    summary: "The Communications and Community Engagement Officer manages the Association's communication channels and co-ordinates engagement with the broader community.",
    reportsTo: "The Committee Chairperson.",
    appointment: "Allocated among the elected committee members at the Committee's first meeting after the AGM.",
    term: "One year, as for all committee members, with unlimited re-election.",
    eligibility: "Must be a paying member of the Association in good standing at nomination, election and throughout the term.",
    duties: [
      "Manage all communications with members and the broader community, including WhatsApp groups, social media, newsletters and noticeboards.",
      "Co-ordinate and facilitate community polls, surveys and engagement processes.",
      "Promote awareness of the Association's activities and achievements."
    ],
    notes: [],
    source: "The SX7RA Constitution, clause 6 (Governance Structure).",
  },
  {
    slug: "councillor-liaison",
    title: "Councillor Liaison",
    subtitle: "Operations Committee, additional portfolio member",
    body: "committee",
    emoji: "🏛️",
    blurb: "Day-to-day contact with the Ward 134 Councillor",
    summary: "The Councillor Liaison is the Committee's dedicated point of contact with the Ward 134 Councillor. The Chairperson remains the Association's primary external representative, including with other City of Johannesburg politicians and officials, and may delegate the ongoing councillor liaison function to an appointed Councillor Liaison within the Committee.",
    reportsTo: "The Committee Chairperson.",
    appointment: "Assigned by the Chairperson as one of up to three additional committee portfolios, once the newly elected Committee convenes its first meeting after the AGM. Members are elected by name at the AGM without reference to a specific portfolio, so the Councillor Liaison portfolio is allocated afterwards, in the same way as other committee roles.",
    term: "One year, as for all committee members, with unlimited re-election.",
    eligibility: "Must be a paying member of the Association in good standing at nomination, election and throughout the term.",
    duties: [
      "Build and maintain a constructive working relationship with the Ward 134 Councillor.",
      "Act as the day-to-day intermediary between the SX7RA and the Ward 134 Councillor, and the ward's governing and reporting structures.",
      "Maintain regular contact with the Ward 134 Councillor to report and receive updates on infrastructure issues affecting SX7, and feed this back to the Committee.",
      "Regularly review the status of open, closed and pending faults logged with the City (for example via its fault reporting system), and report on progress and outstanding issues to the Committee.",
      "Liaise directly with the affected resident on individual issues, such as a specific fault logged or an infrastructure failure, where this is relevant to progressing that issue.",
      "Pass communications received from the Ward Councillor to the Communications and Community Engagement Officer for onward distribution to residents.",
      "Maintain constant communication with the Ward 134 Councillor and attend relevant meetings affecting the SX7RA, such as Ward 134 IDP meetings."
    ],
    notes: [
      "This portfolio supports, and does not replace, the Chairperson's role as the Association's primary external representative. Liaison with representative politicians and City of Johannesburg officials other than the Ward 134 Councillor remains the Chairperson's responsibility. General internal communication to residents remains the responsibility of the Communications and Community Engagement Officer, and the Councillor Liaison's role is normally to supply that officer with information received from the Councillor rather than to communicate with residents directly. On individual issues such as a specific fault logged or an infrastructure failure, the Councillor Liaison may liaise directly with the affected resident where this is relevant to progressing that issue. Financial matters arising from City engagement remain the responsibility of the Treasurer and Financial Director."
    ],
    source: "The SX7RA Constitution, clauses 6.4.3 and 6.6.1, and the Cllr Liaison Roles and Responsibilities document (V2, 16 October 2023).",
  },
  {
    slug: "portfolio-committee-member",
    title: "Portfolio Committee Member",
    subtitle: "Operations Committee, additional members",
    body: "committee",
    emoji: "📋",
    blurb: "Additional members carrying an assigned portfolio",
    summary: "Up to three additional committee members may be assigned a portfolio by the Chairperson, for example Infrastructure, Aesthetics, Security, Community Projects, or Councillor Liaison. This description covers the general duties common to all committee members, alongside whichever portfolio is assigned.",
    reportsTo: "The Committee Chairperson.",
    appointment: "Elected by name at the AGM, without reference to a specific portfolio. Portfolios are assigned by the Chairperson once the Committee convenes for its first meeting after the AGM.",
    term: "One year, with unlimited re-election. All committee members retire at each AGM but may stand again.",
    eligibility: "Must be a paying member of the Association in good standing at nomination, election and throughout the term.",
    duties: [
      "Take responsibility for the assigned portfolio area and report on it at Committee meetings.",
      "Attend Committee meetings, held at least ten times a year, and help maintain the quorum (a majority of serving committee members).",
      "Participate in decisions taken by simple majority of members present.",
      "Support sub-committees or project teams within the assigned portfolio, which report to the Committee at every meeting."
    ],
    notes: [
      "A committee member absent from three or more consecutive meetings without leave or adequate notice automatically vacates their seat. A member may resign by written notice to the Secretary, and a vacancy may be filled by Committee co-option, subject to Board ratification, provided co-opted members do not exceed one-third of the Committee."
    ],
    source: "The SX7RA Constitution, clause 6 (Governance Structure).",
  },
];

export function getRole(slug: string): RoleDescription | undefined {
  return roleDescriptions.find((r) => r.slug === slug);
}

export default roleDescriptions;
