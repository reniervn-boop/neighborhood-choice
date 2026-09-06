import { NextRequest, NextResponse } from 'next/server';
import { removeHalloweenPhoto } from '@/lib/halloween/photos';

function isAuthorized(req: NextRequest): boolean {
  const expected = process.env.HALLOWEEN_ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD;
  // Fail closed. The previous fallback to a literal in this file meant anyone
  // who could read the repository could moderate event photos.
  if (!expected) {
    console.error(
      'Halloween admin routes are disabled: set HALLOWEEN_ADMIN_PASSWORD (or ADMIN_PASSWORD).',
    );
    return false;
  }
  return req.headers.get('x-admin-password') === expected;
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
