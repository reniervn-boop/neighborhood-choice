/**
 * Shared shapes for the Association's governance documents.
 *
 * The text in these modules is transcribed from the signed-off Word drafts held
 * by the Secretary. Keep the wording verbatim — residents rely on these screens
 * as the readable copy of the founding documents. Editorial queries and
 * "for deletion before signing" notes in the drafts are deliberately excluded.
 */

export type DocBlock =
  /** A numbered clause, e.g. 5.3.2 */
  | { type: 'clause'; ref: string; text: string }
  /** An unnumbered paragraph inside a clause */
  | { type: 'paragraph'; text: string }
  /** A sub-heading inside a section, e.g. "Vice-Chairperson" */
  | { type: 'heading'; text: string }
  /** A bulleted list */
  | { type: 'list'; items: string[] }
  /** Pulled-out text the reader should not miss */
  | { type: 'highlight'; text: string }
  /** Explanatory note that is part of the document but not operative wording */
  | { type: 'note'; text: string };

export interface DocSection {
  /** Route-safe anchor, e.g. "5-membership" */
  id: string;
  /** Clause number as printed, e.g. "5". Empty for the preamble. */
  number: string;
  title: string;
  subtitle?: string;
  content: DocBlock[];
}

export interface GovernanceDocument {
  slug: string;
  title: string;
  /** Line under the title, e.g. "Founding document of SX7RA NPC" */
  subtitle: string;
  version: string;
  /** Where this text comes from, shown to the reader */
  source: string;
  /** Adoption state — these are final drafts, not yet adopted */
  status: 'final-draft' | 'adopted';
  /** Short plain-language description for the governance hub */
  summary: string;
  sections: DocSection[];
}
