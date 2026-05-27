/**
 * Four flat Swedish-1970s-poster-style visions of Järva 2030.
 * Each renders a 280x280 SVG, color-restricted to the party color + cream + dark.
 * Geometric, no realism.
 */

const CREAM = "#F5F1E8";
const DARK = "#1C1A17";

type VisionProps = { color: string };

function Frame({ color, children }: VisionProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 280 280" width={280} height={280} aria-hidden>
      {/* Cream sky / backdrop */}
      <rect width="280" height="280" fill={CREAM} />
      {/* Sun / moon — a recurring 70s motif */}
      <circle cx="220" cy="60" r="22" fill={color} opacity="0.9" />
      {children}
    </svg>
  );
}

/** S — housing focus: apartment blocks, tram, walking people */
export function VisionHousing({ color }: VisionProps) {
  return (
    <Frame color={color}>
      {/* Ground */}
      <rect x="0" y="220" width="280" height="60" fill={DARK} />

      {/* Three apartment blocks */}
      {/* Block A */}
      <rect x="20" y="90" width="70" height="130" fill={color} />
      <g fill={CREAM}>
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2].map((c) => (
            <rect
              key={`a-${r}-${c}`}
              x={28 + c * 20}
              y={100 + r * 28}
              width="12"
              height="16"
              opacity={(r + c) % 3 === 0 ? 0.35 : 1}
            />
          )),
        )}
      </g>

      {/* Block B (taller) */}
      <rect x="100" y="60" width="70" height="160" fill={DARK} />
      <g fill={color}>
        {[0, 1, 2, 3, 4].map((r) =>
          [0, 1, 2].map((c) => (
            <rect
              key={`b-${r}-${c}`}
              x={108 + c * 20}
              y={70 + r * 28}
              width="12"
              height="16"
              opacity={(r * c) % 2 === 0 ? 1 : 0.45}
            />
          )),
        )}
      </g>

      {/* Block C */}
      <rect x="180" y="105" width="80" height="115" fill={color} />
      <g fill={CREAM}>
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2].map((c) => (
            <rect
              key={`c-${r}-${c}`}
              x={188 + c * 22}
              y={115 + r * 25}
              width="14"
              height="14"
              opacity={(r + c) % 4 === 0 ? 0.35 : 1}
            />
          )),
        )}
      </g>

      {/* Tram on the ground */}
      <g>
        <rect x="30" y="232" width="130" height="22" fill={CREAM} />
        <rect x="30" y="232" width="130" height="4" fill={color} />
        {/* Tram windows */}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={40 + i * 22} y="240" width="14" height="10" fill={DARK} />
        ))}
        {/* Wheels */}
        <circle cx="50" cy="258" r="4" fill={CREAM} />
        <circle cx="140" cy="258" r="4" fill={CREAM} />
        {/* Catenary line */}
        <line x1="0" y1="226" x2="280" y2="226" stroke={CREAM} strokeWidth="1" />
      </g>

      {/* Two walking people */}
      <g fill={CREAM}>
        <circle cx="180" cy="240" r="4" />
        <rect x="178" y="244" width="4" height="12" />
        <rect x="200" y="244" width="3" height="12" />
        <circle cx="201.5" cy="241" r="3.5" />
      </g>
    </Frame>
  );
}

/** M — jobs focus: office towers, desk + laptop, briefcase */
export function VisionJobs({ color }: VisionProps) {
  return (
    <Frame color={color}>
      <rect x="0" y="220" width="280" height="60" fill={DARK} />

      {/* Tower 1 */}
      <rect x="30" y="50" width="60" height="170" fill={color} />
      <g fill={CREAM}>
        {Array.from({ length: 7 }).map((_, r) =>
          Array.from({ length: 3 }).map((_, c) => (
            <rect
              key={`t1-${r}-${c}`}
              x={38 + c * 18}
              y={60 + r * 22}
              width="12"
              height="12"
              opacity={(r * 3 + c) % 4 === 0 ? 0.4 : 1}
            />
          )),
        )}
      </g>

      {/* Tower 2 — taller, dark */}
      <rect x="100" y="30" width="70" height="190" fill={DARK} />
      <g fill={color}>
        {Array.from({ length: 9 }).map((_, r) =>
          Array.from({ length: 3 }).map((_, c) => (
            <rect
              key={`t2-${r}-${c}`}
              x={108 + c * 20}
              y={40 + r * 20}
              width="14"
              height="10"
            />
          )),
        )}
      </g>

      {/* Tower 3 */}
      <rect x="180" y="80" width="60" height="140" fill={color} opacity="0.85" />
      <g fill={CREAM}>
        {Array.from({ length: 5 }).map((_, r) =>
          Array.from({ length: 3 }).map((_, c) => (
            <rect
              key={`t3-${r}-${c}`}
              x={188 + c * 18}
              y={92 + r * 26}
              width="12"
              height="14"
            />
          )),
        )}
      </g>

      {/* Desk + laptop in foreground */}
      <g>
        <rect x="40" y="246" width="80" height="6" fill={CREAM} />
        <rect x="50" y="252" width="3" height="12" fill={CREAM} />
        <rect x="107" y="252" width="3" height="12" fill={CREAM} />
        {/* Laptop */}
        <rect x="68" y="234" width="28" height="14" fill={DARK} stroke={CREAM} strokeWidth="1" />
        <rect x="68" y="246" width="28" height="2" fill={CREAM} />
      </g>

      {/* Briefcase */}
      <g>
        <rect x="180" y="240" width="40" height="22" fill={color} />
        <rect x="195" y="234" width="10" height="8" fill="none" stroke={CREAM} strokeWidth="2" />
        <rect x="180" y="248" width="40" height="2" fill={CREAM} />
      </g>
    </Frame>
  );
}

/** MP — climate focus: trees, solar panel, bike, park */
export function VisionClimate({ color }: VisionProps) {
  return (
    <Frame color={color}>
      {/* Hills */}
      <path d="M 0 200 Q 70 160 140 195 T 280 190 L 280 280 L 0 280 Z" fill={color} />
      <path d="M 0 230 Q 90 200 180 225 T 280 220 L 280 280 L 0 280 Z" fill={DARK} />

      {/* Tree 1 */}
      <g>
        <rect x="46" y="140" width="6" height="40" fill={DARK} />
        <circle cx="49" cy="130" r="26" fill={DARK} />
        <circle cx="49" cy="130" r="20" fill={color} opacity="0.85" />
      </g>

      {/* Tree 2 — taller */}
      <g>
        <rect x="220" y="120" width="6" height="60" fill={DARK} />
        <circle cx="223" cy="108" r="30" fill={DARK} />
        <circle cx="223" cy="108" r="22" fill={color} opacity="0.85" />
      </g>

      {/* Solar panel — parallelogram with grid */}
      <g>
        <polygon points="100,100 200,100 215,140 85,140" fill={DARK} />
        <g stroke={color} strokeWidth="1.5">
          <line x1="92" y1="120" x2="208" y2="120" />
          <line x1="125" y1="100" x2="115" y2="140" />
          <line x1="150" y1="100" x2="145" y2="140" />
          <line x1="175" y1="100" x2="175" y2="140" />
        </g>
        {/* Stand */}
        <rect x="145" y="140" width="4" height="20" fill={DARK} />
      </g>

      {/* Bike */}
      <g stroke={CREAM} strokeWidth="2" fill="none">
        <circle cx="100" cy="235" r="14" />
        <circle cx="160" cy="235" r="14" />
        <path d="M 100 235 L 130 215 L 160 235 M 130 215 L 145 200 M 100 235 L 120 215" />
      </g>
    </Frame>
  );
}

/** C — community focus: small shops, square with people, café */
export function VisionCommunity({ color }: VisionProps) {
  return (
    <Frame color={color}>
      {/* Ground / square */}
      <rect x="0" y="200" width="280" height="80" fill={DARK} />
      <path
        d="M 0 200 L 280 200 L 240 280 L 40 280 Z"
        fill={color}
        opacity="0.4"
      />

      {/* Row of shop fronts */}
      {/* Shop 1 */}
      <g>
        <rect x="20" y="110" width="65" height="90" fill={CREAM} stroke={DARK} strokeWidth="2" />
        {/* Awning */}
        <polygon points="18,110 87,110 87,124 18,124" fill={color} />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={22 + i * 13} y="116" width="6" height="8" fill={CREAM} />
        ))}
        {/* Window + door */}
        <rect x="28" y="135" width="22" height="40" fill={color} opacity="0.5" />
        <rect x="58" y="135" width="20" height="55" fill={DARK} />
      </g>

      {/* Shop 2 — café */}
      <g>
        <rect x="95" y="100" width="75" height="100" fill={color} />
        <polygon points="93,100 172,100 172,114 93,114" fill={CREAM} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={97 + i * 13} y="105" width="6" height="8" fill={color} />
        ))}
        <rect x="104" y="130" width="30" height="40" fill={CREAM} />
        <text
          x="132"
          y="158"
          fill={DARK}
          fontFamily="serif"
          fontStyle="italic"
          fontSize="14"
          textAnchor="middle"
        >
          café
        </text>
        <rect x="142" y="130" width="22" height="65" fill={DARK} />
      </g>

      {/* Shop 3 */}
      <g>
        <rect x="180" y="115" width="80" height="85" fill={CREAM} stroke={DARK} strokeWidth="2" />
        <polygon points="178,115 262,115 262,128 178,128" fill={color} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={182 + i * 13} y="120" width="6" height="8" fill={CREAM} />
        ))}
        <rect x="188" y="138" width="30" height="50" fill={DARK} />
        <rect x="225" y="138" width="28" height="50" fill={color} opacity="0.5" />
      </g>

      {/* People in the square */}
      <g fill={CREAM}>
        <circle cx="70" cy="230" r="4" />
        <rect x="68" y="234" width="4" height="12" />
        <circle cx="120" cy="235" r="4" />
        <rect x="118" y="239" width="4" height="12" />
        <circle cx="195" cy="228" r="4" />
        <rect x="193" y="232" width="4" height="12" />
        <circle cx="215" cy="232" r="3.5" />
        <rect x="213.5" y="235.5" width="3" height="10" />
      </g>

      {/* Round café table in foreground */}
      <g>
        <ellipse cx="145" cy="258" rx="22" ry="6" fill={CREAM} />
        <rect x="143" y="258" width="4" height="14" fill={CREAM} />
      </g>
    </Frame>
  );
}

export function VisionFor({ partyId, color }: { partyId: string; color: string }) {
  switch (partyId) {
    case "S":
      return <VisionHousing color={color} />;
    case "M":
      return <VisionJobs color={color} />;
    case "MP":
      return <VisionClimate color={color} />;
    case "C":
      return <VisionCommunity color={color} />;
    default:
      return null;
  }
}
