import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { addHalloweenPhoto, getHalloweenPhotos } from '@/lib/halloween/photos';

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const monsterType = searchParams.get('monster') ?? undefined;
  const photos = await getHalloweenPhotos(monsterType);
  return NextResponse.json(photos);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('photo') as File | null;
  const title = (formData.get('title') as string | null)?.trim();
  const description = (formData.get('description') as string | null)?.trim() ?? '';
  const lat = parseFloat(formData.get('lat') as string);
  const lng = parseFloat(formData.get('lng') as string);
  const monsterType = (formData.get('monsterType') as string | null) || null;

  if (!file) return NextResponse.json({ error: 'No photo provided' }, { status: 400 });
  if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  if (isNaN(lat) || isNaN(lng))
    return NextResponse.json({ error: 'Valid coordinates are required' }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json({ error: 'Only JPEG, PNG, WebP, or GIF allowed' }, { status: 400 });
  if (file.size > MAX_FILE_SIZE)
    return NextResponse.json({ error: 'File too large (max 8 MB)' }, { status: 400 });

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const filename = `${uuidv4()}.${ext}`;

  const photo = await addHalloweenPhoto(
    {
      filename,
      originalName: file.name,
      title,
      description,
      lat,
      lng,
      monsterType,
      uploadedAt: new Date().toISOString(),
    },
    file,
  );

  return NextResponse.json(photo, { status: 201 });
}
