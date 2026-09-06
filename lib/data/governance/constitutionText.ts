/**
 * The SX7RA Constitution, v2.13.A.
 *
 * Transcribed from "SX7RA_Constitution_Final_Draft 2026.07.18.docx". The
 * drafter's editorial query in clause 5.1.2 and the "for deletion before
 * signing" block after the signature page are omitted; everything else is
 * verbatim.
 *
 * The enforcement logic that acts on these rules lives in lib/constitution.ts —
 * change both together.
 */
import { GovernanceDocument } from './types';

export const constitutionDocument: GovernanceDocument = {
  slug: 'constitution',
  title: 'Constitution',
  subtitle: 'Founding document of Sundowner Extension 7 Residents Association NPC',
  version: 'v2.13.A',
  source: 'SX7RA Constitution — Final Draft, 18 July 2026',
  status: 'final-draft',
  summary:
    'How the Association is set up and run: who may join, how members vote, ' +
    'how the Board and Operations Committee are elected, how meetings work, ' +
    'and how money is handled.',

  sections: [
    {
      id: "preamble",
      number: "",
      title: "Preamble",
      content: [
        {
          type: "paragraph",
          text: "We, the residents of Sundowner Extension 7, a suburb within the City of Johannesburg Metropolitan Municipality in the Province of Gauteng, recognise that the quality of our neighbourhood is a shared responsibility."
        },
        {
          type: "paragraph",
          text: "We establish this Association to give ourselves a formal, democratic, and accountable structure through which we may collectively improve our suburb — its aesthetics, infrastructure, community spirit, and safety — and through which we may engage meaningfully with the City of Johannesburg and other relevant authorities."
        },
        {
          type: "paragraph",
          text: "This constitution is the founding document of the Sundowner Extension 7 Residents Association NPC. It operates beneath and must be read consistently with the Memorandum of Incorporation (MOI) of the Association. Where any provision of this constitution conflicts with the MOI, the MOI shall prevail. This constitution is binding on all members, committee members, and Directors."
        }
      ]
    },
    {
      id: "1-name",
      number: "1",
      title: "Name",
      content: [
        {
          type: "clause",
          ref: "1.1",
          text: "The name of the Association shall be the Sundowner Extension 7 Residents Association NPC, hereinafter referred to as the \"Association\" or \"SX7RA\"."
        },
        {
          type: "clause",
          ref: "1.2",
          text: "The Association is a Non-Profit Company registered under Company Registration Number 2017/337616/08 in terms of Schedule 1 of the Companies Act 71 of 2008."
        },
        {
          type: "clause",
          ref: "1.3",
          text: "The Association may also register as a Non-Profit Organisation (NPO) with the Department of Social Development in terms of the Non-Profit Organisations Act 71 of 1997, as the Board deems appropriate."
        }
      ]
    },
    {
      id: "2-area-of-jurisdiction",
      number: "2",
      title: "Area Of Jurisdiction",
      content: [
        {
          type: "clause",
          ref: "2.1",
          text: "The area of jurisdiction of the Association shall be the suburb of Sundowner Extension 7, within the City of Johannesburg Metropolitan Municipality. The area is bounded as follows:"
        },
        {
          type: "clause",
          ref: "2.1.1",
          text: "North-western border: Honeydew Road West from its intersection with Beyers Naudé Drive in the south-west to its intersection with Northumberland Avenue in the north-east. Properties on both sides of Honeydew Road West along this stretch are included — those on the inner (south-eastern) side facing into the suburb and those on the outer (north-western) side bordering Honeydew Road West from outside. The property on the northern side of Honeydew Road West at the Northumberland Avenue intersection, at the northern apex of the boundary, is also included."
        },
        {
          type: "clause",
          ref: "2.1.2",
          text: "North-eastern border: the inner (south-western) edge of Northumberland Avenue from its intersection with Honeydew Road West in the north to its intersection with Beyers Naudé Drive in the south. Only properties on the inner side of Northumberland Avenue are included. Tourmaline Road and all streets between Honeydew Road West and Northumberland Avenue fall wholly within the boundary and are fully included."
        },
        {
          type: "clause",
          ref: "2.1.3",
          text: "Southern border: the inner (northern) edge of Beyers Naudé Drive from its intersection with Northumberland Avenue in the east to its intersection with Honeydew Road West in the west. Only properties on the inner side of Beyers Naudé Drive are included."
        },
        {
          type: "clause",
          ref: "2.1.4",
          text: "South-western inclusion: the property situated on the western side of Honeydew Road West between Boundary Road and the Beyers Naudé Drive intersection is specifically included within the boundary."
        },
        {
          type: "clause",
          ref: "2.2",
          text: "The boundaries of the area of jurisdiction are to be formally recorded as an annexure to this constitution and updated as necessary by Special General Meeting."
        },
        {
          type: "clause",
          ref: "2.3",
          text: "For the avoidance of doubt, the Association is not a homeowners’ association, a body corporate, an estate, or a sectional title scheme. The Association has no authority over private property and does not levy compulsory contributions on property owners. Membership is voluntary."
        }
      ]
    },
    {
      id: "3-legal-status",
      number: "3",
      title: "Legal Status",
      content: [
        {
          type: "clause",
          ref: "3.1",
          text: "The Association is a juristic person, separate and distinct from its members."
        },
        {
          type: "clause",
          ref: "3.2",
          text: "No person shall be personally liable for any debt or obligation of the Association solely by reason of being an incorporator, Director, or Member of the Association, as provided in the MOI and the Companies Act 71 of 2008. Personal liability may only arise from fraud, gross negligence, or wilful misconduct."
        },
        {
          type: "clause",
          ref: "3.3",
          text: "The Association may sue or be sued in its own name."
        },
        {
          type: "clause",
          ref: "3.4",
          text: "All legal processes, notices, and correspondence directed at the Association shall be regarded as sufficiently served if delivered to the registered address of the Association or to the Chairperson personally."
        },
        {
          type: "clause",
          ref: "3.5",
          text: "The income and property of the Association shall not be distributed to its members, committee members, or Directors except as reasonable compensation for services actually rendered, as permitted by the MOI (see also clauses 4.3 and 8.9)."
        }
      ]
    },
    {
      id: "4-objectives-and-powers",
      number: "4",
      title: "Objectives And Powers",
      content: [
        {
          type: "heading",
          text: "4.1 Primary Objectives"
        },
        {
          type: "paragraph",
          text: "The primary objectives of the Association are:"
        },
        {
          type: "list",
          items: [
            "To promote and protect the general wellbeing, safety, quality of life, and interests of all residents of Sundowner Extension 7.",
            "To maintain, improve, and enhance the aesthetic character and built environment of the suburb.",
            "To represent residents collectively in their relationship with the City of Johannesburg Metropolitan Municipality, utility providers, government departments, and other relevant authorities.",
            "To facilitate community engagement, participation, and communication among residents.",
            "To identify, prioritise, plan, and oversee community improvement projects within the suburb.",
            "To support and promote community spirit, neighbourliness, social cohesion, and a sense of belonging among residents.",
            "To monitor, report on, and advocate for the maintenance of public infrastructure, roads, street lighting, stormwater systems, parks, and open spaces within the suburb.",
            "To foster a safe and secure environment by liaising with law enforcement, community policing forums, and private security providers where appropriate.",
            "To raise and administer funds for the legitimate purposes of the Association."
          ]
        },
        {
          type: "heading",
          text: "4.2 Powers"
        },
        {
          type: "paragraph",
          text: "In furtherance of its objectives, the Association may:"
        },
        {
          type: "list",
          items: [
            "Enter into agreements with third parties, including service providers and government bodies, on behalf of its members.",
            "Open and operate bank accounts in its own name.",
            "Receive donations, grants, subscriptions, and other income.",
            "Employ or contract persons to carry out work on behalf of the Association.",
            "Establish sub-committees, working groups, and project teams as required.",
            "Affiliate with, and co-operate with, other residents’ associations, community organisations, and forums.",
            "Publish and distribute newsletters, notices, and information to members and the broader community.",
            "Take all such other steps as are reasonably necessary to achieve its objectives."
          ]
        },
        {
          type: "heading",
          text: "4.3 Limitations"
        },
        {
          type: "paragraph",
          text: "The Association shall not:"
        },
        {
          type: "list",
          items: [
            "Engage in any political party activity or align itself with any political party.",
            "Discriminate against any person on the grounds of race, gender, sex, pregnancy, marital status, ethnic or social origin, colour, sexual orientation, age, disability, religion, conscience, belief, culture, language, or birth.",
            "Use its funds or resources for the personal benefit of any member, committee member, Director, or associated person (see also clauses 3.5 and 8.9).",
            "Compel any resident to join the Association or to make any financial contribution to it."
          ]
        }
      ]
    },
    {
      id: "5-membership",
      number: "5",
      title: "Membership",
      content: [
        {
          type: "heading",
          text: "5.1 Eligibility and Categories"
        },
        {
          type: "clause",
          ref: "5.1.1",
          text: "Membership of the Association is open to residents of Sundowner Extension 7 and to businesses operating within the area of jurisdiction, as set out in this clause."
        },
        {
          type: "clause",
          ref: "5.1.2",
          text: "There are three categories of member:"
        },
        {
          type: "paragraph",
          text: "Residential Paying Member: a natural person who resides in a property within the area of jurisdiction, whether as an owner-occupier or tenant, and who has paid the annual membership fee. Residential Paying Members are entitled to vote, to stand for election to the Committee, and to be nominated as Directors. A maximum of two (2) Residential Paying Members per residential address may exercise voting rights at any meeting. Where more than two residents of the same address have paid the annual membership fee, the two entitled to vote shall be designated by joint written notice to the Secretary signed by the paid-up resident members of that address or, failing such designation, determined by the order in which their fees were received and recorded by the Secretary. Where only one resident of an address has paid, that household has one vote."
        },
        {
          type: "paragraph",
          text: "Residential Non-Paying Member: a natural person who resides in a property within the area of jurisdiction but who has not paid the annual membership fee. Residential Non-Paying Members may attend meetings and participate in discussions but may not vote and may not stand for election to the Committee or be nominated as Directors."
        },
        {
          type: "paragraph",
          text: "Business Member: a business operating from a fixed address within the area of jurisdiction may register as a Business Member by paying the annual business membership fee and nominating one (1) designated representative in writing to the Secretary. The designated representative has one (1) vote and is eligible to stand for election to the Committee and to be nominated as a Director. The business may update its nominated representative at any time by written notice to the Secretary, subject to the notice-date cut-off in clause 5.4.1 for the purposes of any specific meeting. The business membership and its associated vote belong to the business entity, not to the individual representative. A business owner or manager who also resides within the area of jurisdiction may hold both a Residential Paying Membership and serve as their business’s designated representative, and shall have one vote in each capacity. Where a business operates from a residential address within the area of jurisdiction, the vote of its designated representative counts towards the two-vote cap applicable to that address in the same way as a Residential Paying Member’s vote."
        },
        {
          type: "note",
          text: "Note regarding MOI alignment: The MOI (clause 11.3) currently deems all residents of a single property as one member collectively. The multi-category membership model and per-residence voting cap in this constitution represent the intended long-term model. A MOI amendment in terms of sections 16 and 17 of the Companies Act should be passed and filed with the CIPC to bring the MOI into alignment with these provisions. Until that amendment is effected, the MOI’s one-member-per-property rule technically prevails in the event of any challenge."
        },
        {
          type: "clause",
          ref: "5.1.3",
          text: "Any Residential Paying Member or Business Member designated representative is eligible to stand for election to the Committee and to be nominated as a Director in their own right, provided they are in good standing and meet all applicable eligibility requirements."
        },
        {
          type: "clause",
          ref: "5.1.4",
          text: "Membership is personal and non-transferable, except that Business Membership may be transferred to a new designated or nominated representative by written notice to the Secretary as provided in clause 5.1.2."
        },
        {
          type: "clause",
          ref: "5.1.5",
          text: "Only a natural person who has attained the age of eighteen (18) years may be admitted as a Residential Paying Member, exercise a vote, act as a proxy, or hold office as a committee member or Director. Younger residents may participate in the activities and programmes of the Association."
        },
        {
          type: "heading",
          text: "5.2 Application for Membership"
        },
        {
          type: "clause",
          ref: "5.2.1",
          text: "Membership is obtained by completing the prescribed membership form and submitting it to the Secretary, together with the applicable annual membership fee."
        },
        {
          type: "clause",
          ref: "5.2.2",
          text: "The Committee shall not unreasonably withhold membership. Any rejection shall be communicated in writing with reasons, and the applicant may appeal to the next General Meeting."
        },
        {
          type: "clause",
          ref: "5.2.3",
          text: "Membership is confirmed upon entry in the Members Register maintained by the Secretary, in accordance with the MOI and the Companies Act. The Secretary shall record the date of each membership fee payment alongside the member’s entry. This payment date is the reference point for determining voting eligibility under clauses 5.3.5 and 5.4.1. The Members Register contains personal information and shall be maintained, processed, and made available for inspection subject to the Protection of Personal Information Act 4 of 2013."
        },
        {
          type: "heading",
          text: "5.3 Membership Fees"
        },
        {
          type: "clause",
          ref: "5.3.1",
          text: "The annual membership fees, including the residential membership fee and the business membership fee referred to in clause 5.1.2, shall be set by the Annual General Meeting. In the absence of a resolution to the contrary, the fee shall remain at the previously determined amount."
        },
        {
          type: "clause",
          ref: "5.3.2",
          text: "The annual membership fee is due and payable upon joining and thereafter on 1 July of each year, in accordance with the financial year of the Association which runs from 1 July to 30 June."
        },
        {
          type: "clause",
          ref: "5.3.3",
          text: "The annual membership fee may, with the approval of the Board, be paid in monthly instalments. A member paying by instalments remains in good standing while the instalments are up to date; if the instalments fall more than two (2) months into arrears and the member’s accumulated instalments for the membership year have not yet reached the annual membership fee, the member lapses to non-paying member status until the arrears are paid. A member whose accumulated instalments for the membership year equal or exceed the annual membership fee is regarded as having paid the annual membership fee in full for that year and shall not lapse to non-paying member status, irrespective of whether any further instalments are paid."
        },
        {
          type: "clause",
          ref: "5.3.4",
          text: "The Board may, in its discretion, waive or reduce the fee for members experiencing genuine financial hardship."
        },
        {
          type: "clause",
          ref: "5.3.5",
          text: "A member shall automatically lapse to non-paying member status once both of the following have occurred since their most recent membership fee payment: (a) twelve (12) months have elapsed; and (b) an Annual General Meeting has been held. A lapsed member shall not be entitled to vote or hold office until the fee is paid. Upon payment, voting rights and eligibility for office are restored with immediate effect, subject to clause 5.4.1."
        },
        {
          type: "paragraph",
          text: "Donations shall not be counted in lieu of membership fees. Only the payment of membership fees will confer “member in good standing” status and voting rights."
        },
        {
          type: "clause",
          ref: "5.3.6",
          text: "Membership fees shall be deposited into the Association’s bank account within five (5) business days of receipt."
        },
        {
          type: "heading",
          text: "5.4 Voting Rights"
        },
        {
          type: "clause",
          ref: "5.4.1",
          text: "Each member in good standing has voting rights as follows: each Residential Paying Member has one (1) vote, subject to the per-residence cap in clause 5.1.2; each Business Member has one (1) vote exercised by their designated representative. All votes are equal within each category. For the purposes of any meeting, a member is considered in good standing if their annual membership fee was received and recorded by the Secretary on or before the date on which the notice of that meeting was issued. A member who pays their fee after the notice date shall have their membership status restored with immediate effect but shall not be entitled to vote at the meeting for which notice has already been issued. They shall be entitled to vote at all subsequent meetings."
        },
        {
          type: "clause",
          ref: "5.4.2",
          text: "Members entitled to vote must be present in person or by written proxy to vote. A proxy appointment must be in writing, dated, and signed by the appointing member, and delivered to the Secretary not later than twenty-four (24) hours before the commencement of the meeting, in accordance with MOI clause 15.3. A proxy instrument is valid only for the meeting specified in it, and for any adjournment of that meeting, and is not valid for any other meeting. A fresh proxy is required for each separate General Meeting, Annual General Meeting, or Special General Meeting. This shorter, meeting-specific validity is expressly permitted by MOI clauses 15.2.2.2 and 15.3, which allow a proxy to provide for a shorter period than twelve months."
        },
        {
          type: "clause",
          ref: "5.4.3",
          text: "A paying member who is unable to attend a meeting may grant a written proxy to any natural person, in accordance with section 58 of the Act and MOI clause 15.1, including a non-paying resident of the same household. A member acting as proxy may exercise only the rights of the paying member who appointed them and has no independent vote."
        },
        {
          type: "heading",
          text: "5.5 Resignation"
        },
        {
          type: "clause",
          ref: "5.5.1",
          text: "Any member may resign from the Association at any time by giving written notice to the Secretary."
        },
        {
          type: "paragraph",
          text: "Any member who leaves the RA jurisdiction will be considered to have resigned."
        },
        {
          type: "clause",
          ref: "5.5.2",
          text: "Resignation does not entitle the member to a refund of any fees paid."
        },
        {
          type: "heading",
          text: "5.6 Suspension and Expulsion"
        },
        {
          type: "clause",
          ref: "5.6.1",
          text: "The Committee may recommend the suspension or expulsion of a member who has materially breached the Code of Conduct, acted in a manner that brings the Association into disrepute, or wilfully obstructed the work of the Association. The Board shall make the final determination."
        },
        {
          type: "clause",
          ref: "5.6.2",
          text: "Before any decision to suspend or expel, the member concerned shall be given written notice of the alleged conduct and at least fourteen (14) days within which to respond in writing."
        },
        {
          type: "clause",
          ref: "5.6.3",
          text: "The Board shall consider the member’s response before reaching a decision."
        },
        {
          type: "paragraph",
          text: "If the member does not respond within the period allowed in clause 5.6.2, the Board may proceed to make its decision in the member’s absence, on the basis of the information available to it."
        },
        {
          type: "clause",
          ref: "5.6.4",
          text: "An expelled member may appeal to the next General Meeting, whose decision shall be final."
        }
      ]
    },
    {
      id: "6-governance-structure",
      number: "6",
      title: "Governance Structure",
      content: [
        {
          type: "heading",
          text: "6.1 The Board of Directors"
        },
        {
          type: "clause",
          ref: "6.1.1",
          text: "The Association is governed by a Board of Directors (the “Board”) as required by the Companies Act 71 of 2008 and the MOI. The Board bears ultimate fiduciary responsibility for the Association and has the full legal authority of the Company as set out in the MOI and the Act."
        },
        {
          type: "clause",
          ref: "6.1.2",
          text: "The Board must comprise at least three (3) Directors at all times, in accordance with MOI clause 17.1. Directors shall be appointed from among the paying members in good standing of the Association, provided each person satisfies the eligibility requirements of section 69 of the Act."
        },
        {
          type: "clause",
          ref: "6.1.3",
          text: "Directors bear fiduciary duties to the Association under sections 75 to 77 of the Act, including the duty to act in good faith and in the best interests of the Association, to avoid conflicts of interest, and to act with the care, skill, and diligence that may reasonably be expected of a person in that position."
        },
        {
          type: "clause",
          ref: "6.1.4",
          text: "Each Director serves for the term set out in clause 6.2.6, until substituted or removed."
        },
        {
          type: "clause",
          ref: "6.1.5",
          text: "Directors may be removed by the Members as provided in clause 6.2.7."
        },
        {
          type: "clause",
          ref: "6.1.6",
          text: "The Board may fill a vacancy on the Board on a temporary basis as provided in clause 6.2.4."
        },
        {
          type: "clause",
          ref: "6.1.7",
          text: "Directors are entitled to the advancement of expenses, indemnification, and insurance cover as provided in clause 19 of the MOI and section 78 of the Act."
        },
        {
          type: "heading",
          text: "6.2 Appointment of Directors"
        },
        {
          type: "clause",
          ref: "6.2.1",
          text: "Eligibility. Any Residential Paying Member or Business Member designated representative who is in good standing and is not disqualified under section 69 of the Companies Act is eligible to be nominated and appointed as a Director of the Association. Eligibility is not conditional on residing within the area of jurisdiction, provided the person is a paying member in good standing through one of the recognised membership categories."
        },
        {
          type: "clause",
          ref: "6.2.2",
          text: "Nominations. Nominations for directorships open thirty (30) days before each Annual General Meeting (AGM) and close fourteen (14) days before the AGM. Any member in good standing may nominate any eligible member in good standing, including themselves. Each nomination must be accompanied by a brief written statement of interest of not more than one (1) page, setting out why the candidate wishes to serve and what skills or experience they bring to the Board. The Secretary shall publish all nominations and statements to the membership at least seven (7) days before the AGM."
        },
        {
          type: "clause",
          ref: "6.2.3",
          text: "Election. Directors are elected by eligible members at the AGM by ordinary resolution. Where the number of validly nominated candidates equals or are fewer than the number of vacant Board positions at the close of the nomination period, the AGM Chairperson shall declare those candidates appointed by acclamation without a ballot. The appointment shall nonetheless be formally resolved and recorded in the AGM minutes. The Chairperson shall ask whether any member objects to the appointment by acclamation; if there is no objection the resolution is passed and recorded. If any member objects, a ballot shall be held."
        },
        {
          type: "clause",
          ref: "6.2.4",
          text: "Co-option between AGMs. Where a vacancy arises between Annual General Meetings, the Board may co-opt any eligible member as a Director on an interim basis. A co-opted Director serves until the next AGM, at which the membership elects a Director to fill the remainder of the term or a full new term as the case may be. Any such co-option must be confirmed by the Members at the next General Meeting, in accordance with MOI clause 17.8.1. The number of co-opted Directors holding office at any one time shall not exceed one-third of the Directors then in office."
        },
        {
          type: "clause",
          ref: "6.2.5",
          text: "Acceptance of office. Every newly elected or co-opted Director must sign a written acceptance of office before taking up their position. The acceptance confirms that the Director has read the MOI and this constitution, understands their fiduciary duties under the Companies Act, and consents to their details being lodged with the CIPC as required."
        },
        {
          type: "clause",
          ref: "6.2.6",
          text: "Term and rotation. Directors serve a three-year term and may be re-elected without restriction. To avoid the entire Board turning over simultaneously, approximately one-third of the Board shall stand for election each year, the rotation to be determined by the Board. The three-year term, with roughly one Director changing each year rather than several at once, is intended to preserve continuity of institutional memory and stability of governance."
        },
        {
          type: "clause",
          ref: "6.2.7",
          text: "Removal. The Members may, by ordinary resolution, remove any one or more, or all, of the Directors. Before any such vote, the Director concerned must be given notice of the proposed resolution and the reasons for it, and a reasonable opportunity to make representations to the meeting, in accordance with section 71(2) of the Act. A Director may also resign by written notice to the Chairperson (or to the Vice-Chairperson if the notice is from the Chairperson)."
        },
        {
          type: "clause",
          ref: "6.2.8",
          text: "Increasing or decreasing the number of Director positions. The Board may recommend at the AGM that the number of Director positions be increased, stating the reasons and the proposed new number. The AGM shall vote on this proposal by ordinary resolution. If approved, the resolution is recorded in the AGM minutes and the amended Director complement takes effect from the close of that AGM. The Board shall then advertise the newly created positions, accept nominations in accordance with clause 6.2.2, and hold an election, which may be at a Special General Meeting or at the next AGM. Where the Board determines that the newly created positions are urgently required for operational reasons, an election may be held at a Special General Meeting convened within sixty (60) days of the AGM resolution. The number of Director positions may likewise be decreased by ordinary resolution at an AGM, provided that a decrease may be effected only in respect of a Director position that is then vacant, may not reduce the Board below the statutory minimum of three (3) Directors, and takes effect from the close of the AGM at which it is approved."
        },
        {
          type: "heading",
          text: "6.3 CIPC Records and Update Authority"
        },
        {
          type: "clause",
          ref: "6.3.1",
          text: "The Association shall at all times maintain accurate and current records with the Companies and Intellectual Property Commission (CIPC), including the details of all serving Directors."
        },
        {
          type: "clause",
          ref: "6.3.2",
          text: "The Board shall designate at least one Director as the authorised representative for the purposes of the CIPC e-Services portal. That Director shall have update authority on the Association’s CIPC profile and shall be responsible for lodging all required filings, including director appointments, resignations, and annual returns."
        },
        {
          type: "clause",
          ref: "6.3.3",
          text: "A Director who holds CIPC update authority shall make any update to the CIPC register only once authorised by a Board resolution to do so. The Secretary shall record every such update in the Association’s statutory register, noting the nature of the change, the date it was made, and the resolution authorising it. This record shall be available for inspection by any Director on request."
        },
        {
          type: "clause",
          ref: "6.3.4",
          text: "Bringing the CIPC update function in-house under this clause is a legitimate administrative efficiency measure. It does not diminish the Association’s governance obligations. All updates remain subject to Board authorisation and Secretary record-keeping as set out above."
        },
        {
          type: "heading",
          text: "6.4 The Operations Committee"
        },
        {
          type: "clause",
          ref: "6.4.1",
          text: "The Board shall establish an Operations Committee (referred to in this constitution as “the Committee”) to manage the day-to-day affairs of the Association and to implement the decisions and strategy of the Board."
        },
        {
          type: "clause",
          ref: "6.4.2",
          text: "The Committee is the operational arm of the Association. It reports to, and operates under the oversight and authority of, the Board. All significant Committee decisions are subject to ratification by the Board where the Board determines this to be necessary."
        },
        {
          type: "clause",
          ref: "6.4.3",
          text: "The Committee shall consist of not fewer than three (3) and not more than eight (8) members. It shall include the following positions:"
        },
        {
          type: "list",
          items: [
            "Chairperson",
            "Vice-Chairperson (Deputy Chairperson)",
            "Secretary",
            "Treasurer",
            "Communications and Community Engagement Officer",
            "Up to three (3) additional committee members, who may be assigned portfolios by the Chairperson (for example: Infrastructure, Aesthetics, Security, or Community Projects, and Councillor Liaison)"
          ]
        },
        {
          type: "clause",
          ref: "6.4.4",
          text: "All committee members must be paying members of the Association in good standing at the time of their nomination, election, and throughout their term of office."
        },
        {
          type: "clause",
          ref: "6.4.5",
          text: "Directors of the Board may also serve as members of the Committee. Where a Director serves on the Committee, they do so in both capacities simultaneously. A Director who serves on the Committee retains their Committee seat for the duration of their Board term and is not required to stand for re-election to the Committee each year, notwithstanding clause 6.5.4."
        },
        {
          type: "heading",
          text: "6.5 Election of the Committee"
        },
        {
          type: "clause",
          ref: "6.5.1",
          text: "Committee members are elected by eligible members in good standing at the Annual General Meeting, by ordinary resolution. The general membership elects committee members by  name, without reference to any specific portfolio or role. The allocation of roles within the Committee is determined by the Committee itself at its first post-AGM meeting, as provided in clause 6.5.6."
        },
        {
          type: "clause",
          ref: "6.5.2",
          text: "Elections shall be conducted as a series of individual votes, each on the candidacy of a single individual for a single committee seat, following the procedure prescribed for the election of Directors by MOI clause 17.4. A candidate is elected only if a majority of the votes exercised support that candidate. Where the number of validly nominated candidates is equal to or fewer than the number of available committee positions at the close of the nomination period, the AGM Chairperson shall declare those candidates appointed by acclamation without a formal ballot. The appointment shall nonetheless be formally resolved and recorded in the AGM minutes. The Chairperson shall ask whether any member objects to appointment by acclamation; if there is no objection the resolution is passed and recorded. If any member objects, a ballot shall be held."
        },
        {
          type: "clause",
          ref: "6.5.3",
          text: "Committee members are elected for a term of one (1) year and are eligible for re-election without restriction on the number of terms."
        },
        {
          type: "clause",
          ref: "6.5.4",
          text: "All committee members retire at each Annual General Meeting but may stand for re-election."
        },
        {
          type: "clause",
          ref: "6.5.5",
          text: "In the event of a vacancy arising during the term, the Committee may co-opt a replacement member, including a willing volunteer from the eligible membership, to serve until the next Annual General Meeting, subject to Board ratification. A co-opted committee member need not have stood for election at the most recent AGM. The number of co-opted committee members holding office at any one time shall not exceed one-third of the committee members then in office."
        },
        {
          type: "clause",
          ref: "6.5.6",
          text: "Role allocation. The newly elected Committee shall convene its first meeting within fourteen (14) days of the AGM for the purpose of allocating executive and portfolio roles among themselves. The Committee shall notify members of the role allocations by written notice within a further seven (7) days of that meeting. The Board-level roles of Chairperson and Financial Director are allocated by the Board, from among the Directors, at its first meeting after the AGM, and not by the Committee. This process applies to all other committee roles. Members acknowledge that the Committee is best placed to allocate roles on the basis of skills, availability, and experience of the elected individuals, and the membership’s mandate to the Committee at the AGM is to elect capable individuals, not to determine their specific portfolios."
        },
        {
          type: "clause",
          ref: "6.5.7",
          text: "Insufficient nominations. If the number of valid nominations received by the close of the nomination period is fewer than the minimum of three (3) committee members, the AGM shall not proceed to elect a committee. Instead, the AGM shall resolve to extend the nomination period by thirty (30) days and to convene a Special General Meeting at the end of that period for the sole purpose of electing the committee. During the intervening period, the outgoing committee shall remain in office in a caretaker capacity, with authority limited to routine operational matters, and with no authority to enter into new contractual commitments or expenditure above a threshold determined by the Board. If the Special General Meeting also receives fewer than three valid nominations, the meeting may, by ordinary resolution, appoint willing eligible members present at the meeting to serve as committee members on an interim basis for a maximum period of six (6) months, within which a properly constituted election must be held."
        },
        {
          type: "heading",
          text: "6.6 Duties of Office Bearers"
        },
        {
          type: "paragraph",
          text: "Chairperson (Board Chairperson and Committee Chairperson)"
        },
        {
          type: "clause",
          ref: "6.6.1",
          text: "The same individual serves as both the Board Chairperson (the presiding officer of the Board of Directors) and the Committee Chairperson (the presiding officer of the Operations Committee). In this constitution, the title “Chairperson” refers to this person in both capacities. Where a clause applies specifically to one body only, this is stated explicitly."
        },
        {
          type: "paragraph",
          text: "As Board Chairperson, the Chairperson shall:"
        },
        {
          type: "list",
          items: [
            "Preside at all Board meetings and ensure that Board proceedings are conducted in accordance with the MOI and the Companies Act.",
            "Cast a deciding vote in the event of a tied vote at a Board meeting. The Board Chairperson shall have no ordinary deliberative vote in addition to the casting vote, so as to preserve neutrality in the chair.",
            "Sign contracts, correspondence, and formal submissions on behalf of the Association within financial limits approved by the Board from time to time.",
            "Execute Board resolutions between Board meetings where urgent action is required, subject to ratification at the next Board meeting.",
            "Prepare or oversee the preparation of the Board meeting agenda in consultation with the Board Secretary.",
            "Act as one of the authorised bank signatories."
          ]
        },
        {
          type: "paragraph",
          text: "As Committee Chairperson, the Chairperson shall:"
        },
        {
          type: "list",
          items: [
            "Preside at all AGMs, SGMs, and Committee meetings, and ensure that proceedings are conducted in accordance with this constitution.",
            "Cast a deciding vote in the event of a tied vote at a Committee meeting or General Meeting. The Committee Chairperson shall have no ordinary deliberative vote in addition to the casting vote.",
            "Serve as the primary external representative of the Association in dealings with the City of Johannesburg, ward councillors, contractors, municipal officials, and other bodies. The BOD may delegate Councillor Liaison to an appointed Councillor Liaison role within the Committee",
            "Prepare or oversee the preparation of the Committee meeting agenda in consultation with the Committee Secretary.",
            "Present a Chairperson’s report at each AGM covering the year’s achievements, challenges, and priorities for the coming year.",
            "Report to the Board on the Committee’s activities at each Board meeting."
          ]
        },
        {
          type: "clause",
          ref: "6.6.2",
          text: "The Chairperson shall not simultaneously hold the position of Treasurer or Financial Director, so as to preserve financial oversight and the separation of powers within the Board. No Director may simultaneously hold more than one executive office. For the purposes of this clause, executive offices are the positions of Chairperson, Financial Director, and Secretary in their Board capacities."
        },
        {
          type: "paragraph",
          text: "Vice-Chairperson (Deputy Chairperson)"
        },
        {
          type: "clause",
          ref: "6.6.3",
          text: "The Vice-Chairperson is the designated successor and operational support to the Chairperson. The Vice-Chairperson shall:"
        },
        {
          type: "list",
          items: [
            "Assume the powers and duties of the Committee Chairperson whenever the Chairperson is absent, incapacitated, or has declared a conflict of interest in a matter before the Committee or a General Meeting. The functions of the Board Chairperson in such circumstances are dealt with in clause 6.6.4.",
            "Assist the Chairperson in external representations and community engagement as directed.",
            "Take specific portfolio responsibility for one or more operational areas of the Association as assigned by the Board (for example: infrastructure liaison, safety co-ordination, or community projects).",
            "Take on the role of Committee Chairperson for the remainder of the term if the Chairperson vacates office, until the role of Chairperson is re-allocated by the Board following the next AGM in accordance with clause 6.5.6."
          ]
        },
        {
          type: "clause",
          ref: "6.6.4",
          text: "The Vice-Chairperson is a member of the Operations Committee and is not a Director of the Board. The Vice-Chairperson attends all Board meetings as a standing invitee in their capacity as Committee Vice-Chairperson. In that capacity they may participate fully in Board discussions and report on Committee matters, but they may not vote on any Board resolution and do not carry the fiduciary duties of a Director under the Companies Act. The Vice-Chairperson has full voting rights at all Committee meetings and at General Meetings as a paying member. Because the Vice-Chairperson is not a Director, the functions of the Board Chairperson cannot be assumed by the Vice-Chairperson. Where the Chairperson is absent from a Board meeting, or the office of Chairperson becomes vacant, the Board shall appoint one of the Directors to act as Board Chairperson, for that meeting or until the role is re-allocated under clause 6.5.6, as the case may be."
        },
        {
          type: "paragraph",
          text: "Secretary (Board Secretary and Committee Secretary)"
        },
        {
          type: "clause",
          ref: "6.6.5",
          text: "The Secretary role exists at two levels: the Board Secretary, who serves the Board of Directors, and the Committee Secretary, who serves the Operations Committee. The same individual may hold both positions simultaneously, or separate persons may be appointed. Where a single person serves as both Board Secretary and Committee Secretary, that person’s duties encompass all of the following. Where separate persons are appointed, the duties set out below apply to each in respect of their respective body."
        },
        {
          type: "paragraph",
          text: "As Board Secretary, the Secretary shall:"
        },
        {
          type: "list",
          items: [
            "Prepare and distribute Board meeting agendas in consultation with the Board Chairperson.",
            "Record accurate minutes of all Board meetings and circulate them for approval within ten (10) business days of each meeting.",
            "Maintain the Directors Register, the register of Board resolutions, and all statutory records required under the MOI and the Companies Act.",
            "Maintain the Association’s statutory documents, including the MOI, this constitution, and all CIPC filings.",
            "Record every update made to the CIPC register in accordance with clause 6.3.3."
          ]
        },
        {
          type: "paragraph",
          text: "As Committee Secretary, the Secretary shall:"
        },
        {
          type: "list",
          items: [
            "Prepare and distribute Committee meeting agendas in consultation with the Committee Chairperson.",
            "Record accurate minutes of all Committee meetings and General Meetings, and circulate them for approval within ten (10) business days of each meeting.",
            "Maintain the Members Register and the correspondence register.",
            "Ensure that the City of Johannesburg ward councillor(s) for the area receive copies of meeting minutes and notices.",
            "Give committee members notice of Committee meetings, together with the agenda, as required by clause 6.7.5."
          ]
        },
        {
          type: "clause",
          ref: "6.6.6",
          text: "A Director of the Board may also serve as Board Secretary and/or Committee Secretary. Where a Director serves as Board Secretary, another Board member shall review and countersign the Board minutes before circulation, to ensure impartiality of the record. The Committee Secretary may serve concurrently as Board Secretary, provided their mandate is expressly extended to Board meetings by resolution of the Board. Where separate persons serve as Board Secretary and Committee Secretary, each is responsible for the records of their respective body."
        },
        {
          type: "paragraph",
          text: "Treasurer"
        },
        {
          type: "clause",
          ref: "6.6.7",
          text: "The Treasurer holds the Board-level title of Financial Director, and the duties set out in this clause apply in both capacities. The Treasurer shall:"
        },
        {
          type: "list",
          items: [
            "Be responsible for the financial management of the Association under the oversight of the Board.",
            "Maintain accurate books of account and financial records.",
            "Prepare and present monthly financial reports to the Committee and the Board.",
            "Prepare and present annual financial statements, subject to independent review or audit, to the Annual General Meeting.",
            "Act as one of the authorised bank signatories.",
            "Ensure that all funds are deposited promptly into the Association’s bank account."
          ]
        },
        {
          type: "paragraph",
          text: "Communications and Community Engagement Officer"
        },
        {
          type: "clause",
          ref: "6.6.8",
          text: "The Communications and Community Engagement Officer shall:"
        },
        {
          type: "list",
          items: [
            "Manage all communications with members and the broader community, including WhatsApp groups, social media, newsletters, and noticeboards.",
            "Co-ordinate and facilitate community polls, surveys, and engagement processes.",
            "Promote awareness of the Association’s activities and achievements."
          ]
        },
        {
          type: "heading",
          text: "6.7 Committee Meetings"
        },
        {
          type: "clause",
          ref: "6.7.1",
          text: "The Committee shall hold not fewer than ten (10) meetings per year."
        },
        {
          type: "clause",
          ref: "6.7.2",
          text: "Meetings may be held in person or by electronic means (including video conferencing), provided all participants can communicate simultaneously."
        },
        {
          type: "clause",
          ref: "6.7.3",
          text: "A quorum for Committee meetings shall be a majority of the total number of serving committee members, being all committee members currently in office whether or not they hold a designated portfolio. With a maximum committee of eight (8) members, a quorum shall be five (5) members. With the minimum of three (3) serving members, a quorum shall be two (2)."
        },
        {
          type: "clause",
          ref: "6.7.4",
          text: "Decisions shall be taken by a simple majority of committee members present. In the event of an equality of votes, the Chairperson shall have a casting vote."
        },
        {
          type: "clause",
          ref: "6.7.5",
          text: "The Committee Secretary shall give each committee member at least five (5) days’ notice of a Committee meeting, together with the agenda."
        },
        {
          type: "heading",
          text: "6.8 Board Meetings"
        },
        {
          type: "clause",
          ref: "6.8.1",
          text: "The Board shall meet at least quarterly, or as often as necessary to discharge its responsibilities."
        },
        {
          type: "clause",
          ref: "6.8.2",
          text: "A quorum for a Board meeting shall be a majority of the Directors then in office, provided that at least three (3) Directors are present."
        },
        {
          type: "clause",
          ref: "6.8.3",
          text: "The Board may meet by electronic communication, provided all participants can communicate simultaneously, in accordance with MOI clause 18.4.2."
        },
        {
          type: "clause",
          ref: "6.8.4",
          text: "The Board may also pass resolutions by written consent of a majority of the Directors without holding a meeting, provided each Director has received notice of the matter, in accordance with MOI clause 18.4.1."
        },
        {
          type: "clause",
          ref: "6.8.5",
          text: "Where a vacancy on the Board reduces the number of Directors in office to two (2), those two Directors may, despite the quorum requirement in clause 6.8.2, act jointly for the limited purposes of co-opting one or more Directors to restore the minimum of three (3) Directors, or of convening a General Meeting to fill the vacancy. The two Directors shall not transact any other business until the minimum of three (3) Directors has been restored."
        },
        {
          type: "heading",
          text: "6.9 Absence and Vacation of Office"
        },
        {
          type: "clause",
          ref: "6.9.1",
          text: "Any committee member who is absent from three (3) or more consecutive Committee meetings without leave of absence, or without providing adequate notice, shall automatically vacate their seat on the Committee."
        },
        {
          type: "clause",
          ref: "6.9.2",
          text: "The Committee may, by resolution ratified by the Board, remove a committee member who has materially failed to fulfil their duties, following the notice procedure in clause 5.6.2."
        },
        {
          type: "clause",
          ref: "6.9.3",
          text: "A committee member may resign by giving written notice to the Secretary."
        },
        {
          type: "heading",
          text: "6.10 Sub-Committees and Project Teams"
        },
        {
          type: "clause",
          ref: "6.10.1",
          text: "The Committee may establish sub-committees or project teams to manage specific portfolios or projects, and may invite non-committee volunteers to participate in such teams."
        },
        {
          type: "clause",
          ref: "6.10.2",
          text: "Each sub-committee or project team shall report to the Committee at every Committee meeting."
        },
        {
          type: "clause",
          ref: "6.10.3",
          text: "The Committee retains full oversight and accountability for all sub-committee and project team activities, and the Board retains ultimate oversight."
        },
        {
          type: "clause",
          ref: "6.10.4",
          text: "Participation as a volunteer in a project team does not confer Committee or Board membership."
        }
      ]
    },
    {
      id: "7-meetings-of-the-association",
      number: "7",
      title: "Meetings Of The Association",
      content: [
        {
          type: "heading",
          text: "7.1 Annual General Meeting"
        },
        {
          type: "clause",
          ref: "7.1.1",
          text: "The Association shall hold an Annual General Meeting (AGM) once per calendar year, no more than fifteen (15) months after the previous AGM."
        },
        {
          type: "clause",
          ref: "7.1.2",
          text: "The ordinary business of the AGM shall include:"
        },
        {
          type: "list",
          items: [
            "Confirmation of the minutes of the previous AGM.",
            "Presentation of the Chairperson’s report on the activities of the Association.",
            "Presentation and adoption of the annual financial statements.",
            "Election of the Committee for the ensuing year.",
            "Confirmation or election of Directors as required.",
            "Fixing of the annual membership fee.",
            "Any other business for which proper notice has been given."
          ]
        },
        {
          type: "clause",
          ref: "7.1.3",
          text: "Notice of the AGM, including the agenda, shall be given to all members at least twenty-one (21) days before the meeting. The notice shall include the current count of paying members so that members may determine the quorum in advance."
        },
        {
          type: "heading",
          text: "7.2 General Meetings"
        },
        {
          type: "clause",
          ref: "7.2.1",
          text: "The Board, or the Committee acting with Board authority, may convene a General Meeting at any time."
        },
        {
          type: "clause",
          ref: "7.2.2",
          text: "The Committee shall convene a General Meeting within thirty (30) days of receiving a written request signed by not fewer than ten per cent (10%) of paying members in good standing, specifying the purpose of the meeting, in accordance with MOI clause 13.3 and section 61(3) of the Act."
        },
        {
          type: "clause",
          ref: "7.2.3",
          text: "Notice of a General Meeting shall be given to all members at least fourteen (14) days before the meeting."
        },
        {
          type: "heading",
          text: "7.3 Special General Meetings"
        },
        {
          type: "clause",
          ref: "7.3.1",
          text: "A Special General Meeting (SGM) may be convened for specific purposes, including amendments to this constitution and decisions on dissolution, amalgamation, or similar matters requiring a special resolution."
        },
        {
          type: "clause",
          ref: "7.3.2",
          text: "Not less than thirty (30) days’ notice of an SGM shall be given to all members, clearly setting out the specific business to be transacted. No other business may be transacted at an SGM."
        },
        {
          type: "heading",
          text: "7.4 Quorum for Members’ Meetings"
        },
        {
          type: "clause",
          ref: "7.4.1",
          text: "The quorum for any General Meeting, Annual General Meeting, or Special General Meeting shall be the greater of: (a) twenty-five per cent (25%) of all paying members in good standing on the date of the meeting, or (b) ten (10) paying members. The ten (10) member floor is a variation of the quorum in section 64(1) of the Act, which MOI clause 13.6 currently adopts without variation; the floor accordingly takes full effect only once MOI clause 13.6 is amended to reflect it."
        },
        {
          type: "note",
          text: "Practical note: If the Association has 60 paying members at the time of a meeting, the quorum will be 15 members (25%). If the Association has 30 paying members, the quorum will be 10 (the floor). The Secretary should include the current paying membership count in every meeting notice so that members can calculate the quorum requirement before attending."
        },
        {
          type: "clause",
          ref: "7.4.2",
          text: "If a quorum is not present within one (1) hour of the time fixed for the meeting, the meeting shall stand adjourned in accordance with section 64(4) of the Act. The adjourned meeting shall be held one (1) week later at the same time and venue, with notice given to all members."
        },
        {
          type: "clause",
          ref: "7.4.3",
          text: "At the adjourned meeting, the paying members present in person or by proxy shall constitute a quorum for that meeting, regardless of the number present, in accordance with section 64(5) of the Companies Act. This means that even a small number of members attending the adjourned meeting may validly transact the business for which the meeting was called. No new business may be introduced at the adjourned meeting. The applicable voting threshold for any resolution remains unchanged at the adjourned meeting — in particular, a special resolution still requires seventy-five per cent (75%) of the voting rights exercised, in accordance with clause 7.5.3 and section 65(9) of the Act. The same adjourned-meeting quorum rule applies to all members’ meetings of the Association, including Annual General Meetings, Special General Meetings, and any other General Meeting, provided the adjournment and re-notice requirements of section 64(4) were properly followed."
        },
        {
          type: "heading",
          text: "7.5 Voting at Meetings"
        },
        {
          type: "clause",
          ref: "7.5.1",
          text: "Each member entitled to vote does so in accordance with the voting rights set out in clause 5.4. Decisions at General Meetings and the AGM shall be taken by a simple majority of paying members present and voting (an ordinary resolution), by show of hands, unless a majority of members present calls for a secret ballot."
        },
        {
          type: "clause",
          ref: "7.5.2",
          text: "The Chairperson presides at General Meetings and, in the event of an equality of votes, has a casting vote but no deliberative vote, in accordance with clause 6.6.1."
        },
        {
          type: "clause",
          ref: "7.5.3",
          text: "The following matters require a special resolution, being a resolution supported by at least seventy-five per cent (75%) of the voting rights exercised at a Special General Meeting duly convened for that purpose, in accordance with MOI clause 16.2 and section 65(9) of the Act:"
        },
        {
          type: "list",
          items: [
            "Any amendment to this constitution.",
            "The dissolution or winding up of the Association.",
            "The amalgamation or merger of the Association with another body.",
            "Any amendment to the Memorandum of Incorporation (which additionally requires filing with the CIPC)."
          ]
        },
        {
          type: "heading",
          text: "7.6 Minutes"
        },
        {
          type: "paragraph",
          text: "Minutes shall be kept of all General Meetings, the AGM, Board meetings, and Committee meetings. Confirmed minutes shall be made available to all members within ten (10) business days of confirmation and shall be maintained in the Association’s records for at least seven (7) years, in accordance with MOI clause 21.1.4."
        },
        {
          type: "heading",
          text: "7.7 Written Resolutions of Members"
        },
        {
          type: "paragraph",
          text: "Any resolution that could be voted on at a General Meeting of the Association, other than a matter that the Act requires to be considered at a meeting, may be submitted for consideration and voted on in writing by the members in accordance with section 60 of the Act and MOI clause 15.1.2. A written resolution adopted in this manner has the same effect as if it had been approved at a duly constituted General Meeting."
        }
      ]
    },
    {
      id: "8-financial-management",
      number: "8",
      title: "Financial Management",
      content: [
        {
          type: "clause",
          ref: "8.1",
          text: "All funds of the Association shall be deposited into a dedicated bank account opened in the name of the Association at a registered South African bank."
        },
        {
          type: "clause",
          ref: "8.2",
          text: "No fewer than three (3) authorised signatories shall be designated. All financial transactions shall require the authorisation of any two of the three designated signatories, of whom at least one must be the Chairperson or the Treasurer."
        },
        {
          type: "clause",
          ref: "8.3",
          text: "No payment exceeding an amount determined by the Board from time to time may be made without prior Board approval."
        },
        {
          type: "clause",
          ref: "8.4",
          text: "The Treasurer shall maintain the books of account in accordance with generally accepted accounting practice."
        },
        {
          type: "clause",
          ref: "8.5",
          text: "The financial year of the Association shall run from 1 July to 30 June of the following year."
        },
        {
          type: "clause",
          ref: "8.6",
          text: "Annual financial statements shall be prepared within three (3) months of the end of each financial year and shall be subject to independent review or audit as determined by the AGM or as required by law."
        },
        {
          type: "clause",
          ref: "8.7",
          text: "The books of account and financial records of the Association shall be available for inspection by any paying member on written request, in accordance with MOI clauses 12.3 and 21.1, and by the City of Johannesburg upon lawful request."
        },
        {
          type: "clause",
          ref: "8.8",
          text: "The Association shall not borrow money or incur debt except by resolution of the Board, and for amounts exceeding a threshold set by the AGM, by resolution of the AGM."
        },
        {
          type: "clause",
          ref: "8.9",
          text: "All income, however derived, shall be used exclusively in furtherance of the Association’s objectives. No part of the income or assets of the Association shall be distributed to any member, committee member, Director, or associated person, except as reasonable compensation for services actually rendered, in accordance with MOI clause 5.2 (see also clauses 3.5 and 4.3)."
        }
      ]
    },
    {
      id: "9-strategic-planning-and-community-projects",
      number: "9",
      title: "Strategic Planning And Community Projects",
      content: [
        {
          type: "clause",
          ref: "9.1",
          text: "The Board shall, in consultation with the Committee, undertake a strategic planning process at minimum every two (2) years to identify the priorities and needs of the community."
        },
        {
          type: "clause",
          ref: "9.2",
          text: "The strategic planning process shall include community participation mechanisms, which may include polls, surveys, public meetings, and other forms of engagement, to ensure that the Association’s strategy reflects the actual priorities of residents."
        },
        {
          type: "clause",
          ref: "9.3",
          text: "The Committee shall compile a strategic plan setting out the Association’s objectives, priorities, and planned projects for the relevant period, for approval by the Board."
        },
        {
          type: "clause",
          ref: "9.4",
          text: "Projects undertaken by the Association shall be governed by the following principles:"
        },
        {
          type: "list",
          items: [
            "Each project shall have a defined scope, objectives, timeline, budget, and responsible committee member or volunteer lead.",
            "Projects shall be monitored against agreed milestones and reported to the Committee at every Committee meeting and to the Board at every Board meeting.",
            "Committee members and volunteer leads are accountable to the Committee for the delivery of their assigned projects.",
            "The Association shall actively recruit and acknowledge volunteers from among the resident community to support the delivery of projects."
          ]
        },
        {
          type: "clause",
          ref: "9.5",
          text: "The Committee shall adopt a performance scorecard or similar accountability tool to track the delivery of committee members’ responsibilities and shall report on progress to the Board and to the Association at General Meetings and the AGM."
        }
      ]
    },
    {
      id: "10-code-of-conduct",
      number: "10",
      title: "Code Of Conduct",
      content: [
        {
          type: "clause",
          ref: "10.1",
          text: "All members, committee members, and Directors shall at all times conduct themselves in a manner consistent with the objectives and values of the Association."
        },
        {
          type: "clause",
          ref: "10.2",
          text: "The following rules of conduct are binding on all members, committee members, and Directors:"
        },
        {
          type: "list",
          items: [
            "Members, committee members, and Directors shall behave in a dignified, respectful, and constructive manner at all meetings and in all dealings related to the Association. Any person who conducts themselves inappropriately may be required by the Chairperson to leave a meeting.",
            "No member, committee member, or Director shall act in a manner that brings the Association into disrepute.",
            "No member, committee member, or Director shall use the resources, name, or standing of the Association for personal gain or benefit.",
            "No member, committee member, or Director shall accept any gift, reward, or consideration in exchange for influencing the Association’s decisions.",
            "Directors and committee members shall declare any conflict of interest in matters before the Board or Committee and shall recuse themselves from voting on such matters, in compliance with section 75 of the Act.",
            "Members, committee members, and Directors shall maintain the confidentiality of information designated as confidential by the Board."
          ]
        },
        {
          type: "clause",
          ref: "10.3",
          text: "The Board may issue a supplementary Code of Conduct, which shall be circulated to all members and shall be binding once adopted by General Meeting."
        }
      ]
    },
    {
      id: "11-community-engagement",
      number: "11",
      title: "Community Engagement",
      content: [
        {
          type: "clause",
          ref: "11.1",
          text: "The Association shall actively maintain open and accessible channels of communication with all residents of Sundowner Extension 7, whether or not they are members."
        },
        {
          type: "clause",
          ref: "11.2",
          text: "The Association shall liaise regularly with the City of Johannesburg ward councillor(s) for the area and shall provide copies of meeting minutes and notices (see also the Secretary’s duty in clause 6.6.5)."
        },
        {
          type: "clause",
          ref: "11.3",
          text: "The Association shall seek to build constructive relationships with the South African Police Service, the Johannesburg Metropolitan Police Department, community policing forums, and other relevant authorities."
        },
        {
          type: "clause",
          ref: "11.4",
          text: "All significant community decisions, priorities, and projects shall, to the extent possible, be informed by community input obtained through appropriate engagement mechanisms."
        }
      ]
    },
    {
      id: "12-amendment-of-this-constitution",
      number: "12",
      title: "Amendment Of This Constitution",
      content: [
        {
          type: "clause",
          ref: "12.1",
          text: "This constitution may be amended only by a special resolution passed by at least seventy-five per cent (75%) of the voting rights exercised at a Special General Meeting duly convened for that purpose, in accordance with MOI clause 16.2 and section 65(9) of the Act."
        },
        {
          type: "clause",
          ref: "12.2",
          text: "Written notice of any proposed amendment shall be circulated to all members at least thirty (30) days before the Special General Meeting, together with a clear statement of the proposed changes and the reasons therefor."
        },
        {
          type: "clause",
          ref: "12.3",
          text: "No amendment may be made to this constitution that would cause the Association to cease to be a non-profit entity or that would permit the distribution of assets or income to members for personal gain."
        },
        {
          type: "clause",
          ref: "12.4",
          text: "Where any proposed amendment also requires an amendment to the Memorandum of Incorporation, the MOI amendment must be resolved separately in accordance with sections 16 and 17 of the Companies Act and filed with the CIPC. An amendment to this constitution alone does not amend the MOI."
        }
      ]
    },
    {
      id: "13-dissolution-and-winding-up",
      number: "13",
      title: "Dissolution And Winding Up",
      content: [
        {
          type: "clause",
          ref: "13.1",
          text: "The Association may be dissolved only by a special resolution passed by at least seventy-five per cent (75%) of the voting rights exercised at a Special General Meeting convened for that purpose, provided that at least thirty (30) days’ written notice of the meeting and the proposed dissolution has been given to all members."
        },
        {
          type: "clause",
          ref: "13.2",
          text: "If no quorum is present at the first Special General Meeting convened to consider dissolution, the meeting shall stand adjourned for one (1) week to the same time and venue, with notice given to all members, consistent with clause 7.4.2 and section 64(4) of the Act. Members present at the adjourned meeting shall constitute a quorum for this purpose."
        },
        {
          type: "clause",
          ref: "13.3",
          text: "Upon dissolution, and after the satisfaction of all debts and obligations, the remaining assets of the Association shall not be distributed to members but shall be transferred to one or more non-profit companies, registered external non-profit companies, voluntary associations, or non-profit trusts having objects similar to those of the Association, as determined by the Members or, failing that, the Directors, at or immediately before the time of dissolution, in accordance with MOI clause 5.3."
        },
        {
          type: "clause",
          ref: "13.4",
          text: "Dissolution shall be carried out in accordance with the requirements of the Companies Act 71 of 2008 and any other applicable legislation."
        }
      ]
    },
    {
      id: "14-dispute-resolution",
      number: "14",
      title: "Dispute Resolution",
      content: [
        {
          type: "clause",
          ref: "14.1",
          text: "The Association shall endeavour to resolve all disputes arising within the Association by conciliation and mediation before resorting to formal legal proceedings."
        },
        {
          type: "clause",
          ref: "14.2",
          text: "Any member who has a dispute with the Board, the Committee, or another member in relation to the affairs of the Association shall first raise the matter in writing with the Secretary."
        },
        {
          type: "clause",
          ref: "14.3",
          text: "The Board shall appoint an independent sub-committee of not fewer than three persons to hear and attempt to resolve the dispute within thirty (30) days."
        },
        {
          type: "clause",
          ref: "14.4",
          text: "If the dispute is not resolved by the sub-committee, it shall be referred to the next General Meeting for a final decision."
        },
        {
          type: "clause",
          ref: "14.5",
          text: "Nothing in this clause prevents any party from exercising their legal rights in a court of competent jurisdiction."
        }
      ]
    },
    {
      id: "15-general-provisions",
      number: "15",
      title: "General Provisions",
      content: [
        {
          type: "clause",
          ref: "15.1",
          text: "This constitution operates beneath, and must at all times be read consistently with, the Memorandum of Incorporation of the Association and the Companies Act 71 of 2008. Where any conflict exists between this constitution and the MOI, the MOI shall prevail."
        },
        {
          type: "clause",
          ref: "15.2",
          text: "This constitution shall be interpreted consistently with the Companies Act 71 of 2008, the Non-Profit Organisations Act 71 of 1997, and any other applicable legislation."
        },
        {
          type: "clause",
          ref: "15.3",
          text: "The gender-neutral interpretation shall apply throughout this constitution. No provision shall be read as excluding or limiting any person on grounds of gender, sex, or gender identity."
        },
        {
          type: "clause",
          ref: "15.4",
          text: "The headings in this constitution are for convenience only and shall not affect its interpretation."
        },
        {
          type: "clause",
          ref: "15.5",
          text: "This constitution supersedes all previous constitutions and rules of the Association."
        },
        {
          type: "clause",
          ref: "15.6",
          text: "Any notice required to be given to members under this constitution may be given by electronic mail to the member’s recorded email address, by message to an official electronic communication channel of the Association to which the member subscribes, by hand delivery, or by posting on the Association’s official noticeboard(s) or website, provided that notice of a General Meeting, Annual General Meeting, or Special General Meeting shall in addition be sent individually to each member by electronic mail or message. A notice transmitted electronically is deemed received on the day of transmission, and a notice delivered by hand is deemed received on delivery. Each member is responsible for keeping their contact details in the Members Register up to date, and a notice sent to the recorded details is valid notwithstanding any failure of receipt caused by outdated details."
        },
        {
          type: "clause",
          ref: "15.7",
          text: "The Directors and committee members holding office on the date of adoption of this constitution continue in office and are deemed to have been elected or appointed under this constitution, with their terms of office computed from the date of their most recent election or appointment."
        }
      ]
    },
    {
      id: "16-sources-and-legislative-framework",
      number: "16",
      title: "Sources And Legislative Framework",
      content: [
        {
          type: "paragraph",
          text: "This constitution has been compiled with reference to, and must be read consistently with, the following legislation, governance frameworks, and regulatory requirements. Where specific provisions of this constitution derive from or implement a particular source, that source is noted in the relevant clause. This section provides a consolidated reference guide for the Board, committee members, and the Association’s legal advisers."
        },
        {
          type: "heading",
          text: "16.1 Primary Legislation"
        },
        {
          type: "paragraph",
          text: "Companies Act 71 of 2008 (as amended)"
        },
        {
          type: "paragraph",
          text: "The primary governing statute for the Association as a Non-Profit Company (NPC). The following sections are specifically implemented or referenced in this constitution:"
        },
        {
          type: "list",
          items: [
            "Schedule 1 — Non-Profit Companies: governs the formation, structure, and dissolution of NPCs. Implemented throughout, particularly clauses 1.2, 3, 13, and 15.",
            "Section 15 — Memorandum of Incorporation: the MOI takes precedence over this constitution in all matters. See clauses 1.2, 3.2, 6.1, and 15.1.",
            "Sections 16 and 17 — Amendments to MOI and shareholder (member) amendments: govern the process for amending the Memorandum of Incorporation, including the requirement to file amendments with CIPC. See clauses 5.1.2 (membership note), 12.4, and 13.4.",
            "Section 61 — Members’ meetings: governs the right of members to call general meetings. Section 61(3) underpins the 10% member-requisition right in clause 7.2.2.",
            "Section 64 — Quorum for members’ meetings: governs quorum requirements, adjournment procedures, and the reduced quorum at adjourned meetings. Implemented in clauses 7.4.1, 7.4.2, and 7.4.3.",
            "Section 65(9) — Special resolutions: requires 75% of voting rights exercised for a special resolution. Implemented in clauses 7.5.3, 12.1, and 13.1.",
            "Section 69 — Ineligibility and disqualification of persons to be Directors: sets out persons who may not be appointed or serve as Directors. Referenced in clauses 6.1.2 and 6.2.1.",
            "Section 71 — Removal of Directors: sets out the procedure by which members may remove a Director by ordinary resolution. Implemented in clauses 6.1.5 and 6.2.7.",
            "Sections 75–77 — Directors’ fiduciary duties, standards of conduct, and liability: impose duties of good faith, avoidance of conflict of interest, and reasonable care and skill. Implemented in clauses 6.1.3 and 10.2 (conflict of interest and recusal).",
            "Section 86 — Company Secretary: while not mandatory for NPCs of this size, the Association’s Secretary role fulfils equivalent functions. See clause 6.6.5."
          ]
        },
        {
          type: "paragraph",
          text: "Non-Profit Organisations Act 71 of 1997"
        },
        {
          type: "paragraph",
          text: "Governs voluntary registration as an NPO with the Department of Social Development. NPO registration is discretionary for this Association (as it is already a registered NPC) but may be pursued for fundraising or grant eligibility purposes. See clause 1.3. Key provisions relevant to this constitution include: section 12(2) (required content of, and the obligation to act in accordance with, the organisation’s founding document); section 17 (financial management and accountability); and section 18 (annual reports and financial statements)."
        },
        {
          type: "paragraph",
          text: "Income Tax Act 58 of 1962 — Section 18A and Section 30"
        },
        {
          type: "paragraph",
          text: "Section 30 defines a Public Benefit Organisation (PBO) for tax purposes. Should the Association wish to obtain tax-exempt status and the ability to issue tax-deductible receipts to donors (section 18A), it must apply to SARS for PBO approval and ensure its objects and asset-distribution rules comply with the requirements of section 30 and the Ninth Schedule to the Act. The non-distribution clause in clause 3.5 and the dissolution asset-transfer provision in clause 13.3 are drafted to be consistent with these requirements."
        },
        {
          type: "paragraph",
          text: "Promotion of Access to Information Act 2 of 2000 (PAIA)"
        },
        {
          type: "paragraph",
          text: "The Association, as a private body, must compile and publish a PAIA Manual setting out the records it holds and the procedure for requesting access to them; the exemption previously granted to smaller private bodies lapsed on 31 December 2021 and no exemption now applies. This obligation is relevant to the record-keeping provisions in clauses 7.6 (minutes retention), 8.7 (financial records inspection), and 6.6.5 (Secretary’s statutory records)."
        },
        {
          type: "paragraph",
          text: "Protection of Personal Information Act 4 of 2013 (POPIA)"
        },
        {
          type: "paragraph",
          text: "The Association, as a juristic person processing personal information of its members, is a responsible party under POPIA and must comply with the eight conditions for lawful processing set out in Chapter 3. This is relevant to the Members Register (clause 5.2.3), the correspondence register (clause 6.6.5), and the Association’s communications channels (clause 6.6.8). The Association should appoint an Information Officer (the Chairperson by default) and register with the Information Regulator."
        },
        {
          type: "heading",
          text: "16.2 CIPC Regulatory Requirements"
        },
        {
          type: "paragraph",
          text: "The Companies and Intellectual Property Commission (CIPC) is the regulatory body responsible for the registration and ongoing compliance of companies incorporated under the Companies Act. The following CIPC obligations are directly relevant to the Association:"
        },
        {
          type: "list",
          items: [
            "Annual Return (Companies Act, section 33; CIPC Notice): every registered company must file an annual return with CIPC within thirty (30) business days of its anniversary of incorporation. Companies that are not required to have their annual financial statements audited or independently reviewed submit a financial accountability supplement (FAS) with the annual return. The Association’s annual return filing obligation is managed under clause 6.3.2.",
            "Director changes (Companies Act, section 70(6); CoR 39): when a Director is appointed, resigns, or is removed, the change must be notified to CIPC by filing a CoR 39 form (Notice of Change of Directors/Officers). This must be done within ten (10) business days of the change. See clauses 6.2.5 and 6.3.2 to 6.3.3.",
            "MOI amendments (Companies Act, section 16; CoR 15.2): any amendment to the Memorandum of Incorporation must be filed with CIPC using form CoR 15.2 within ten (10) business days of the resolution being passed, together with a certified copy of the special resolution. The amendment does not take effect until it has been registered by CIPC. See clause 12.4.",
            "Registered office and address: the Association must at all times maintain a registered physical address in South Africa with CIPC. Any change must be filed promptly. See clause 3.4.",
            "Deregistration: failure to file annual returns for two or more consecutive years may result in CIPC placing the Association in final deregistration. The Board must ensure annual return compliance under clause 6.3.2."
          ]
        },
        {
          type: "heading",
          text: "16.3 King IV Report on Corporate Governance for South Africa, 2016"
        },
        {
          type: "paragraph",
          text: "The King IV Report on Corporate Governance for South Africa, 2016 (King IV), published by the Institute of Directors in South Africa (IoDSA), sets out recommended governance principles and practices. King IV applies on an “apply and explain” basis. Although not legally binding on NPCs of this size, its principles inform best practice and were considered in the drafting of this constitution. The following King IV principles are of particular relevance:"
        },
        {
          type: "list",
          items: [
            "Principle 1 (Ethical leadership): the governing body should lead ethically and effectively. Implemented in clause 10 (Code of Conduct) and clause 6.1.3 (fiduciary duties).",
            "Principle 7 (Composition of the governing body): the governing body should have the appropriate balance of knowledge, skills, experience, diversity, and independence. Reflected in the nomination and election provisions of clauses 6.2.2 and 6.2.3, including the requirement for written statements of interest.",
            "Principle 16 (Stakeholder-inclusive approach): King IV recommends that governing bodies respond to the legitimate interests of stakeholders. Implemented in clauses 7.1 to 7.3 (accessible meetings), 9.2 (community participation in strategic planning), 11 (community engagement), and the open-communications requirement of clause 11.1.",
            "Principle 11 (Oversight of risk): the governing body is responsible for overseeing risk. Reflected in the Board’s oversight and ratification role (clause 6.4.2) and the financial controls in clause 8.",
            "Principle 12 (Technology and information governance): King IV recommends that the governing body oversee information management, including digital communications. Relevant to the Communications Officer role in clause 6.6.8 and the POPIA obligations noted in section 16.1 above.",
            "Principle 14 (Remuneration): the governing body should ensure that remuneration is fair, responsible, and transparent. Relevant to the non-distribution clause (clause 3.5) and the prohibition on personal benefit in clause 4.3.",
            "Principle 3 (Responsible corporate citizenship): the governing body should ensure the organisation is and is seen to be a responsible corporate citizen. This underpins the entire community-engagement mandate in clause 11 and the Association’s non-discrimination commitment in clause 4.3.",
            "Quorum and meeting procedure (King IV recommended practices): King IV recommends that the governing body establish meeting procedures that ensure effective decision-making, proper quorum, and adequate notice. These recommendations informed the quorum provisions in clauses 6.7.3 (Committee: a majority of serving members), 6.8.2 (Board: majority of Directors in office, minimum three), and 7.4.1 (General Meetings: 25% or ten members, whichever is the greater).",
            "Separation of roles (King IV, Principle 7): King IV recommends that the roles of the Chair and those responsible for financial oversight be separated. This is implemented in clause 6.6.2, which prohibits the Chairperson from simultaneously holding the position of Treasurer or Financial Director.",
            "Conflict of interest (King IV, Principle 7): Directors and committee members must declare and recuse themselves from matters in which they have a personal interest. Implemented in clause 10.2 and cross-referenced to section 75 of the Companies Act."
          ]
        },
        {
          type: "heading",
          text: "16.4 Financial Management and Accounting Standards"
        },
        {
          type: "paragraph",
          text: "The financial management provisions in clause 8 are informed by the following:"
        },
        {
          type: "list",
          items: [
            "Companies Act, section 28 (Accounting records): every company must keep accurate, complete accounting records. Implemented in clause 8.4.",
            "Companies Act, section 29 (Annual financial statements): requires that annual financial statements be prepared and, where required, independently reviewed or audited. Implemented in clauses 8.6 and 7.1.2.",
            "Companies Regulations 2011, Regulation 28 (Public interest score and financial reporting): an NPC with a public interest score of less than 100 and no public accountability may prepare financial statements in accordance with the International Financial Reporting Standard for Small and Medium-sized Entities (IFRS for SMEs), rather than full IFRS. The Association should determine its public interest score annually.",
            "Companies Act, section 30(2)(b)(ii): independent review (rather than a full audit) is sufficient where the NPC has a public interest score below 350 and its annual financial statements are independently compiled. Where the annual financial statements are internally compiled, an audit is required at a public interest score of 100 or more (Companies Regulations 2011, Regulation 28(2)(c)). Implemented in clause 8.6.",
            "Generally Accepted Accounting Practice (GAAP) / IFRS for SMEs: the standard referenced in clause 8.4 (“generally accepted accounting practice”). In South Africa, this means the IFRS for SMEs, or such other framework as Regulation 27 of the Companies Regulations permits, as determined by the Association’s accountant."
          ]
        },
        {
          type: "heading",
          text: "16.5 City of Johannesburg and Local Government Framework"
        },
        {
          type: "paragraph",
          text: "The Association operates within the City of Johannesburg Metropolitan Municipality. The following legislation and frameworks govern the Association’s engagement with local government:"
        },
        {
          type: "list",
          items: [
            "Local Government: Municipal Systems Act 32 of 2000, Chapter 4 (Community participation): establishes the right and mechanism for communities to participate in municipal governance. The Association’s liaison role with the City of Johannesburg (clause 11.2) and its representation of residents (clause 4.1) are grounded in this framework.",
            "Local Government: Municipal Structures Act 117 of 1998, section 73 (Ward committees): ward committees are established structures for community input into local government. The Association’s obligation to copy meeting notices and minutes to the ward councillor (clause 6.6.5 and clause 11.2) aligns with this framework and assists the ward committee in its representational function.",
            "City of Johannesburg By-laws and Spatial Development Framework: the Association’s objectives regarding aesthetics, infrastructure, and public spaces (clause 4.1) are informed by the City’s applicable by-laws and development frameworks. The Association does not have enforcement authority but may engage the relevant City departments to report non-compliance and advocate for residents."
          ]
        },
        {
          type: "heading",
          text: "16.6 Safety and Security Framework"
        },
        {
          type: "paragraph",
          text: "Relevant to the Association’s liaison role in clause 4.1 and clause 11.3:"
        },
        {
          type: "list",
          items: [
            "South African Police Service Act 68 of 1995, section 18 (Community Police Forums): CPFs are statutory bodies established at police station level to improve relations between the community and the SAPS. The Association is encouraged to engage with the relevant CPF for the area as part of its safety mandate.",
            "Private Security Industry Regulation Act 56 of 2001 (PSIRA): governs the registration and conduct of private security providers. Where the Association co-ordinates or contracts with a private security company, it should ensure that company is registered with PSIRA."
          ]
        },
        {
          type: "heading",
          text: "16.7 Other Reference Documents"
        },
        {
          type: "list",
          items: [
            "Memorandum of Incorporation of the SX7RA (as filed with CIPC): the foundational constitutional document of the Association. Prevails over this constitution in all matters. Referenced throughout.",
            "CIPC Guidance Note on Non-Profit Companies (available at www.cipc.co.za): provides practical guidance on the formation, governance, and compliance obligations of NPCs. Relevant to clauses 6.3 and 12.4.",
            "Institute of Directors in South Africa (IoDSA) — King IV companion guides for NPOs and SMEs: the IoDSA publishes sector-specific guidance on applying King IV to non-profit organisations and smaller entities. These guides were consulted in drafting the governance and committee provisions in clauses 6.1 to 6.10.",
            "SARS Tax Exemption Unit guidance on Public Benefit Organisations and NPCs (www.sars.gov.za): relevant to any application for PBO tax-exempt status under section 30 of the Income Tax Act. The Board should consult this guidance before submitting an application to SARS.",
            "Constitution of the Republic of South Africa, 1996 — sections 18 (freedom of association), 19 (political rights), and 32 (access to information): the constitutional rights underpinning voluntary association, non-discrimination (clause 4.3), and the access-to-records rights of members (clause 8.7)."
          ]
        }
      ]
    },
    {
      id: "adoption-and-certification",
      number: "",
      title: "Adoption And Certification",
      content: [
        {
          type: "paragraph",
          text: "This constitution is a final draft. It takes effect once adopted at a duly constituted meeting of the Association and signed on behalf of the Board of Directors and founding members."
        },
        {
          type: "paragraph",
          text: "The signature page provides for the Director and Chairperson, the Financial Director, and three further Directors."
        },
        {
          type: "highlight",
          text: "Annexure A to this constitution is the map of the area of jurisdiction. The cadastral maps and the boundary description are reproduced in the app under Governance → Area of jurisdiction."
        }
      ]
    }
  ],
};

export default constitutionDocument;
