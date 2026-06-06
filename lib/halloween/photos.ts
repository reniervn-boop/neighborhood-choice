import fs from 'fs/promises';
import path from 'path';

export interface HalloweenPhoto {
  id: string;
  filename: string;
  originalName: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  monsterType: string | null;
  uploadedAt: string;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'halloween-photos.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'halloween-uploads');

async function ensureDirs() {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

export async function getHalloweenPhotos(): Promise<HalloweenPhoto[]> {
  try {
    await ensureDirs();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data) as HalloweenPhoto[];
  } catch {
    return [];
  }
}

export async function addHalloweenPhoto(photo: HalloweenPhoto): Promise<void> {
  await ensureDirs();
  const photos = await getHalloweenPhotos();
  photos.push(photo);
  await fs.writeFile(DATA_FILE, JSON.stringify(photos, null, 2));
}

export async function removeHalloweenPhoto(id: string): Promise<HalloweenPhoto | null> {
  const photos = await getHalloweenPhotos();
  const photo = photos.find((p) => p.id === id);
  if (!photo) return null;
  const remaining = photos.filter((p) => p.id !== id);
  await fs.writeFile(DATA_FILE, JSON.stringify(remaining, null, 2));
  try {
    await fs.unlink(path.join(UPLOADS_DIR, photo.filename));
  } catch {
    // file may already be gone
  }
  return photo;
}
