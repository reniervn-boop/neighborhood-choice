import { NextRequest, NextResponse } from 'next/server';
import { initiateDonation } from '@/lib/services/financeService';
import { PaymentMethod } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, userId, amountCents, method, anonymous, donorDisplayName } = body;

    if (!projectId || !userId || !amountCents || !method) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const result = await initiateDonation({
      projectId,
      userId,
      amountCents,
      method: method as PaymentMethod,
      anonymous: Boolean(anonymous),
      donorDisplayName,
    });

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ id: result.id, success: true });
  } catch (err) {
    console.error('[payments/initiate]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
