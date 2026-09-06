/**
 * Guards against the Firestore SDK's "retry forever" behaviour.
 *
 * On a degraded connection a read does not reject — the SDK keeps retrying, so
 * `await getDocs(...)` never settles and any `finally { setLoading(false) }`
 * never runs. Every page that gates a full-screen spinner on a read therefore
 * has to bound it, or a resident on bad mobile data sits on the spinner
 * indefinitely with only the "Taking longer than usual" card for company.
 */

/** How long any single screen may wait on data before it gives up and renders. */
export const DATA_TIMEOUT_MS = 8000;

/** Rejects with `Error('timeout')` if `promise` has not settled within `ms`. */
export function withTimeout<T>(promise: Promise<T>, ms: number = DATA_TIMEOUT_MS): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

/**
 * Deadline for a subscription-based load (onSnapshot), which cannot be raced
 * the way a promise can.
 *
 * Call it when the listener is attached and call the returned function from the
 * snapshot and error callbacks, and from the effect cleanup. If neither
 * callback fires in time, `onExpire` runs so the page renders whatever it has
 * rather than spinning forever. A late snapshot still arrives and updates the
 * view — the listener is not cancelled.
 *
 * @returns a function that cancels the deadline; safe to call more than once.
 */
export function loadingDeadline(
  onExpire: () => void,
  ms: number = DATA_TIMEOUT_MS,
): () => void {
  const timer = setTimeout(onExpire, ms);
  return () => clearTimeout(timer);
}
