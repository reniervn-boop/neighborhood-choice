'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  backHref?: string;
  rightElement?: React.ReactNode;
  /** Show the SX7RA wordmark instead of a plain title */
  showBrand?: boolean;
}

export default function AppHeader({
  title,
  showBack = false,
  backHref,
  rightElement,
  showBrand = false,
}: AppHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) router.push(backHref);
    else router.back();
  };

  return (
    <header
      style={{ backgroundColor: 'var(--brand-black)' }}
      className="sticky top-0 z-40 text-white shadow-md"
    >
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        <div className="flex items-center gap-3 min-w-0">
          {showBack ? (
            <button
              onClick={handleBack}
              className="flex-shrink-0 p-1 rounded-full hover:bg-white/15 transition-colors"
              aria-label="Go back"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <Link href="/" className="flex-shrink-0">
              <div className="bg-white rounded-lg p-0.5 w-8 h-8 flex items-center justify-center overflow-hidden">
                <img src="/sx7ra-logo.svg" alt="SX7RA" className="w-full h-full object-contain" draggable={false} />
              </div>
            </Link>
          )}

          {showBrand ? (
            <div className="bg-white rounded-xl px-2 py-1">
              <img src="/sx7ra-logo.svg" alt="SX7RA" className="h-7 w-auto" draggable={false} />
            </div>
          ) : (
            <h1 className="text-base font-bold truncate">{title}</h1>
          )}
        </div>

        {rightElement && <div className="flex-shrink-0 ml-2">{rightElement}</div>}
      </div>
    </header>
  );
}
