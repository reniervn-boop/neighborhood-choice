/**
 * Joburg skyline silhouette — matches the black skyline illustration
 * used in SX7RA newsletter footer. The Hillbrow Tower is the central landmark.
 */
export default function JoburgSkyline({
  className = '',
  fill = 'currentColor',
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg
      viewBox="0 0 800 160"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ fill }}
      aria-hidden="true"
    >
      {/* Left low buildings */}
      <rect x="0" y="120" width="30" height="40" />
      <rect x="28" y="108" width="22" height="52" />
      <rect x="48" y="115" width="18" height="45" />
      <rect x="64" y="100" width="25" height="60" />
      <rect x="87" y="112" width="16" height="48" />
      <rect x="101" y="95" width="28" height="65" />
      <rect x="127" y="105" width="20" height="55" />
      <rect x="145" y="88" width="32" height="72" />
      {/* small antenna on 145 building */}
      <rect x="160" y="80" width="3" height="10" />

      {/* Mid-left cluster */}
      <rect x="175" y="102" width="22" height="58" />
      <rect x="195" y="90" width="18" height="70" />
      <rect x="211" y="96" width="24" height="64" />
      <rect x="233" y="78" width="30" height="82" />
      <rect x="261" y="85" width="20" height="75" />
      <rect x="279" y="92" width="26" height="68" />

      {/* ── Hillbrow Tower (central landmark) ─────────────────────── */}
      {/* Base tower block */}
      <rect x="310" y="50" width="22" height="110" />
      {/* Tapered upper section */}
      <polygon points="310,50 332,50 328,22 314,22" />
      {/* Antenna shaft */}
      <rect x="319" y="0" width="4" height="24" />
      {/* Observation deck */}
      <rect x="313" y="18" width="16" height="5" />
      {/* Transmission dish stub */}
      <rect x="305" y="30" width="8" height="3" />
      <rect x="319" y="30" width="8" height="3" />

      {/* Tall building right of tower */}
      <rect x="340" y="60" width="28" height="100" />
      <rect x="336" y="58" width="36" height="4" />

      {/* Mid-right cluster */}
      <rect x="375" y="80" width="24" height="80" />
      <rect x="397" y="70" width="30" height="90" />
      <rect x="424" y="88" width="22" height="72" />
      <rect x="444" y="75" width="28" height="85" />
      <rect x="470" y="92" width="20" height="68" />
      <rect x="488" y="82" width="25" height="78" />
      <rect x="511" y="96" width="18" height="64" />

      {/* Right cluster */}
      <rect x="527" y="88" width="26" height="72" />
      <rect x="551" y="100" width="20" height="60" />
      <rect x="569" y="90" width="24" height="70" />
      <rect x="590" y="105" width="18" height="55" />
      <rect x="606" y="95" width="22" height="65" />
      <rect x="625" y="110" width="30" height="50" />
      <rect x="653" y="100" width="20" height="60" />
      <rect x="671" y="108" width="25" height="52" />
      <rect x="693" y="115" width="18" height="45" />
      <rect x="709" y="105" width="22" height="55" />
      <rect x="729" y="112" width="30" height="48" />
      <rect x="757" y="118" width="20" height="42" />
      <rect x="775" y="122" width="25" height="38" />

      {/* Ground fill */}
      <rect x="0" y="158" width="800" height="4" />
    </svg>
  );
}
