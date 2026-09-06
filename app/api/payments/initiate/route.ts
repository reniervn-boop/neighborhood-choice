import { NextRequest, NextResponse } from 'next/server';
import { initiateDonation } from '@/lib/services/financeService';
import { PaymentMethod } from '@/lib/types';
import { verifyRequest } from '@/lib/server/verifyIdToken';

export async function POST(req: NextRequest) {
  // The donor is whoever holds the token. Taking userId from the body let
  // anyone file pending donations against another resident's name.
  const user = await verifyRequest(req);
  if (!user) {
    return NextResponse.json(
      { error: 'You must be signed in to donate.' },
      { status: 401 },
    );
  }

  try {
    const body = await req.json();
    const { projectId, amountCents, method, anonymous, donorDisplayName } = body;

    if (!projectId || !amountCents || !method) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const result = await initiateDonation({
      projectId,
      userId: user.uid,
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
