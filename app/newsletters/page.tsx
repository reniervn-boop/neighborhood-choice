import { redirect } from 'next/navigation';

// Newsletters have been merged into the Noticeboard (Newsletters tab).
export default function NewslettersRedirect() {
  redirect('/noticeboard?tab=newsletters');
}
