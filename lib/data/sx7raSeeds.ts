import { Announcement } from '@/lib/types';

/**
 * SX7RA Committee Newsletter — May 2026
 * Source: "SX7RA Committee Newsletter 2026.pdf"
 */
export const NEWSLETTER_2026_COMMITTEE: Omit<Announcement, 'id'> = {
  title: 'SX7RA: Introducing Your 2026 Committee',
  category: 'Governance',
  authorId: 'system',
  authorName: 'The SX7RA Committee',
  isPinned: true,
  publishedAt: new Date('2026-05-01T09:00:00+02:00').getTime(),
  attachments: [],

  bodyText: `Dear Residents,

Following our recent AGM and first committee meeting, we are excited to introduce the Sundowner Ext. 7 Residents Association (NPC) (i.e. SX7RA) team for the 2026 term.

Our committee members have stepped up to manage specific portfolios to ensure our suburb remains safe, clean, and can become a "suburb of choice."

Your 2026 Committee:
• Chairperson: Deon van Niekerk
• Vice-Chairperson & Facebook Admin: Pinky Isabirye
• Secretary: Deon van Niekerk assisted by Kerry McArthur
• Finance Director: Reon de Vrye
• Security & CPF Liaison and WA Admin: Pam Butterworth
• Councillor Liaison: Greg Schneemann
• Comms, PR & Marketing: Carmia Barnard

A Message to Our Community:
Our current focus is on replenishing our "project fund" to continue with suburb maintenance, such as curb painting and signage refurbishment. We will also soon be introducing a new SX7RA App to streamline fault reporting, resident communication, contributions and much more.

How You Can Help:
If you aren't yet a contributing member, please consider joining us. You can determine your own monthly contribution — R50, R100, R150 or any other amount that you can afford. Your contributions directly fund the security and maintenance initiatives that protect your property value.

Upcoming Event:
Mark your calendars! Our Halloween Meet & Greet is confirmed for Saturday, 31 October 2026. More details to follow!

Thank you for your continued support.

Warm regards,
The SX7RA Committee
"Working towards making SX7 a suburb of choice"`,

  bodyHtml: `
<p>Dear Residents,</p>

<p>Following our recent AGM and first committee meeting, we are excited to introduce the <strong>Sundowner Ext. 7 Residents Association (NPC)</strong> (i.e. SX7RA) team for the 2026 term.</p>

<p>Our committee members have stepped up to manage specific portfolios to ensure our suburb remains safe, clean, and can become a "suburb of choice." Please join us in welcoming the following team:</p>

<ul>
  <li><strong>Chairperson:</strong> Deon van Niekerk</li>
  <li><strong>Vice-Chairperson &amp; Facebook Admin:</strong> Pinky Isabirye</li>
  <li><strong>Secretary:</strong> Deon van Niekerk assisted by Kerry McArthur</li>
  <li><strong>Finance Director:</strong> Reon de Vrye</li>
  <li><strong>Security &amp; CPF Liaison and WA Admin:</strong> Pam Butterworth</li>
  <li><strong>Councillor Liaison:</strong> Greg Schneemann</li>
  <li><strong>Comms, PR &amp; Marketing:</strong> Carmia Barnard</li>
</ul>

<h3>A Message to Our Community:</h3>

<p>Our current focus is on replenishing our "project fund" to continue with suburb maintenance, such as curb painting and signage refurbishment. We will also soon be introducing a new <strong>SX7RA App</strong> to streamline:</p>

<ul>
  <li>Fault reporting to the COJ entities (CityPower, Joburg Water, JRA, etc), and possibly automated issue tracking and escalation</li>
  <li>Communication to residents</li>
  <li>Ease of contribution via EFT or Bank Debit Orders</li>
  <li>Awards for participation in community projects and activities and special draws to reward contributors</li>
  <li>Event co-ordination</li>
  <li>Development of plans and projects to make ours a suburb of choice</li>
  <li>Promoting local businesses</li>
  <li>Access to SX7RA documents (AGM minutes, Annual reports and Newsletters, Constitution, membership forms, project reports, etc.)</li>
  <li>Committee members and portfolios</li>
</ul>

<h3>How You Can Help:</h3>

<p>If you aren't yet a contributing member, please consider joining us. You can determine your own monthly contribution — R50, R100, R150 or <u>any other amount</u> that you can afford. Your contributions directly fund the security and maintenance initiatives that protect your property value.</p>

<h3>Upcoming Event:</h3>

<p>Mark your calendars! Our <strong>Halloween Meet &amp; Greet</strong> is confirmed for <strong>Saturday, 31 October 2026</strong>. More details to follow!</p>

<p>Thank you for your continued support.</p>

<p>Warm regards,<br/><strong>The SX7RA Committee</strong><br/><em>"Working towards making SX7 a suburb of choice"</em></p>
`.trim(),
};
