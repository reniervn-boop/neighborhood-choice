/**
 * This route is a stub. The newsletter seeding is handled client-side
 * via the committee panel "Seed Initial Data" button, which calls
 * publishAnnouncement() directly using the authenticated user's credentials.
 *
 * If you later add the Firebase Admin SDK (service account), you can
 * replace this with a proper server-side seeder.
 */
export async function GET() {
  return new Response(
    JSON.stringify({ message: 'Use the Committee Panel → Seed Data button to seed initial content.' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
}
