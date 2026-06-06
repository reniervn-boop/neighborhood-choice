'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: 'var(--background)' }}>
      <img
        src="/sx7ra-logo.svg"
        alt="SX7RA"
        className="w-36 h-auto mb-8 opacity-90"
        draggable={false}
      />
      <div
        className="inline-block w-10 h-10 rounded-full border-4 border-t-transparent animate-spin mb-4"
        style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }}
      />
      <p className="text-gray-500 text-sm font-medium">{message}</p>

      {slow && (
        <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-4 max-w-xs text-center shadow-sm">
          <p className="text-sm text-gray-700 font-semibold mb-1">Taking longer than usual</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Check your internet connection. If this persists, try refreshing.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 w-full text-white font-bold py-2.5 rounded-xl text-sm"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}
