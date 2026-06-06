import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  formatEmailBody,
  formatEmailSubject,
  getAuthorityForCategory,
  ReportSummary,
} from '@/lib/services/municipalityService';
import { ReportCategory } from '@/lib/types';

// Lazily initialise so the build doesn't fail when RESEND_API_KEY isn't set
let resend: import('resend').Resend | null = null;
function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY ?? 'not_configured');
  return resend;
}

/**
 * POST /api/submit-to-municipality
 *
 * Sends a report via email to the relevant Johannesburg municipality.
 * Requires RESEND_API_KEY + RESEND_FROM_EMAIL in .env.local.
 *
 * Body: { report: ReportSummary, authorityId?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { report } = (await request.json()) as { report: ReportSummary };

    if (!report?.category) {
      return NextResponse.json({ error: 'Missing report data' }, { status: 400 });
    }

    const authority = getAuthorityForCategory(report.category as ReportCategory);

    if (authority.method !== 'email' || !authority.email) {
      return NextResponse.json(
        { error: 'This authority does not accept email submissions', authority: authority.id },
        { status: 400 }
      );
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'reports@resend.dev';
    const subject = formatEmailSubject(report);
    const bodyText = formatEmailBody(report, authority);

    // Build HTML version
    const bodyHtml = `<pre style="font-family: monospace; white-space: pre-wrap;">${bodyText}</pre>`;

    const { data, error } = await getResend().emails.send({
      from: fromEmail,
      to: [authority.email],
      // CC the app's own address for tracking (optional — configure in env)
      ...(process.env.RESEND_CC_EMAIL ? { cc: [process.env.RESEND_CC_EMAIL] } : {}),
      subject,
      text: bodyText,
      html: bodyHtml,
    });

    if (error) {
      console.error('[submit-to-municipality] Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      emailId: data?.id,
      authority: authority.id,
      authorityName: authority.name,
      emailTo: authority.email,
      subject,
    });
  } catch (err) {
    console.error('[submit-to-municipality] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
