import { NextRequest, NextResponse } from 'next/server';
import { removeHalloweenPhoto } from '@/lib/halloween/photos';

function isAuthorized(req: NextRequest): boolean {
  const pw = req.headers.get('x-admin-password');
  return pw === (process.env.HALLOWEEN_ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD ?? 'halloween2025');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const removed = await removeHalloweenPhoto(id);
  if (!removed) {
    return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
