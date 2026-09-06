/**
 * Verify a Firebase ID token from a route handler.
 *
 * Server-side only — never import this from a client component. (The
 * `server-only` guard package is not a dependency of this project, so the
 * directory convention is what enforces it.)
 *
 * We deliberately do NOT use firebase-admin here: it needs a service-account
 * credential that this project has never been given. Firebase's Identity
 * Toolkit `accounts:lookup` endpoint validates the token server-side using only
 * the public web API key, which is enough to answer the one question these
 * routes need answered — "did a signed-in user of this project send this?".
 *
 * If the deployment later gains a service account, swap this for
 * `getAuth().verifyIdToken()` and delete the module; the call sites take the
 * same shape.
 */

export interface VerifiedUser {
  uid: string;
  email?: string;
  emailVerified: boolean;
}

const LOOKUP_URL =
  'https://identitytoolkit.googleapis.com/v1/accounts:lookup';

/** Pull the bearer token out of an Authorization header. */
export function bearerToken(request: Request): string | null {
  const header = request.headers.get('authorization');
  if (!header) return null;
  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return token.trim() || null;
}

/**
 * @returns the user behind the token, or null if the token is missing,
 *          expired, malformed, or belongs to a different Firebase project.
 */
export async function verifyIdToken(idToken: string): Promise<VerifiedUser | null> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    console.error('verifyIdToken: NEXT_PUBLIC_FIREBASE_API_KEY is not set');
    return null;
  }

  let response: Response;
  try {
    response = await fetch(`${LOOKUP_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
      cache: 'no-store',
    });
  } catch (err) {
    // Network failure reaching Google — fail closed rather than letting the
    // request through unauthenticated.
    console.error('verifyIdToken: lookup request failed', err);
    return null;
  }

  if (!response.ok) return null;

  const data = (await response.json()) as {
    users?: { localId: string; email?: string; emailVerified?: boolean }[];
  };
  const user = data.users?.[0];
  if (!user?.localId) return null;

  return {
    uid: user.localId,
    email: user.email,
    emailVerified: user.emailVerified ?? false,
  };
}

/** Convenience wrapper: verify straight from the request. */
export async function verifyRequest(request: Request): Promise<VerifiedUser | null> {
  const token = bearerToken(request);
  if (!token) return null;
  return verifyIdToken(token);
}
