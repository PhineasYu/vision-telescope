import { motion } from "motion/react";

type Props = {
  /** Party color for the objective lens glow + beam. Null = no glow yet. */
  glowColor?: string | null;
};

/**
 * Side view telescope. Horizontal brass tube on a small tripod.
 * Eyepiece (left, narrow) → middle (longer, wider) → objective (right, widest).
 */
export function SideTelescope({ glowColor = null }: Props) {
  // Tube geometry (px). Y values are vertical centers / heights.
  const W = 320; // svg width includes a little room for the beam
  const H = 140;
  const cy = 60; // tube centerline

  // Section widths
  const eyeW = 40;
  const midW = 160;
  const objW = 80;

  // Section heights (diameters) — grows toward the objective
  const eyeH = 36;
  const midH = 52;
  const objH = 60;

  // Layout — start at x=10, end at x=10+eyeW+midW+objW = 290
  const x0 = 10;
  const eyeX = x0;
  const midX = eyeX + eyeW;
  const objX = midX + midW;

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="overflow-visible"
      aria-hidden
    >
      <defs>
        <linearGradient id="brass-vert" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B7340" />
          <stop offset="22%" stopColor="#F4E4B8" />
          <stop offset="50%" stopColor="#C9A961" />
          <stop offset="80%" stopColor="#8B7340" />
          <stop offset="100%" stopColor="#1C1A17" />
        </linearGradient>


        <radialGradient id="objective-lens" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glowColor ?? "#F4E4B8"} stopOpacity={glowColor ? 1 : 0.4} />
          <stop offset="55%" stopColor={glowColor ?? "#C9A961"} stopOpacity={glowColor ? 0.55 : 0.3} />
          <stop offset="100%" stopColor="#1C1A17" stopOpacity={1} />
        </radialGradient>

        {glowColor && (
          <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={glowColor} stopOpacity="0.55" />
            <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
          </linearGradient>
        )}

        <filter id="lens-bloom" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Eyepiece — narrow cylinder */}
      <g>
        <rect
          x={eyeX}
          y={cy - eyeH / 2}
          width={eyeW}
          height={eyeH}
          fill="url(#brass-vert)"
        />
        {/* Inner shadow lines for cylindrical depth */}
        <line
          x1={eyeX}
          y1={cy - eyeH / 2 + 3}
          x2={eyeX + eyeW}
          y2={cy - eyeH / 2 + 3}
          stroke="#8B7340"
          strokeWidth="0.5"
          opacity="0.6"
        />
        <line
          x1={eyeX}
          y1={cy + eyeH / 2 - 3}
          x2={eyeX + eyeW}
          y2={cy + eyeH / 2 - 3}
          stroke="#1C1A17"
          strokeWidth="0.5"
          opacity="0.7"
        />
        {/* Eyepiece cap ring */}
        <rect x={eyeX} y={cy - eyeH / 2} width="3" height={eyeH} fill="#1C1A17" />
      </g>

      {/* Middle — longer, wider tube */}
      <g>
        <rect
          x={midX}
          y={cy - midH / 2}
          width={midW}
          height={midH}
          fill="url(#brass-vert)"
        />
        {/* Junction collar at left */}
        <rect x={midX} y={cy - midH / 2} width="4" height={midH} fill="#1C1A17" />
        {/* Three thin depth lines */}
        <line
          x1={midX}
          y1={cy - midH / 2 + 4}
          x2={midX + midW}
          y2={cy - midH / 2 + 4}
          stroke="#8B7340"
          strokeWidth="0.5"
          opacity="0.55"
        />
        <line
          x1={midX}
          y1={cy}
          x2={midX + midW}
          y2={cy}
          stroke="#F4E4B8"
          strokeWidth="0.4"
          opacity="0.25"
        />
        <line
          x1={midX}
          y1={cy + midH / 2 - 4}
          x2={midX + midW}
          y2={cy + midH / 2 - 4}
          stroke="#1C1A17"
          strokeWidth="0.5"
          opacity="0.7"
        />
        {/* Decorative ring at 2/3 along the tube */}
        <rect
          x={midX + midW * 0.66}
          y={cy - midH / 2 - 2}
          width="6"
          height={midH + 4}
          fill="#8B7340"
        />
      </g>

      {/* Objective housing — widest cylinder */}
      <g>
        <rect
          x={objX}
          y={cy - objH / 2}
          width={objW}
          height={objH}
          fill="url(#brass-vert)"
        />
        {/* Left junction collar */}
        <rect x={objX} y={cy - objH / 2} width="5" height={objH} fill="#1C1A17" />
        {/* Right rim */}
        <rect
          x={objX + objW - 6}
          y={cy - objH / 2 - 2}
          width="6"
          height={objH + 4}
          fill="#8B7340"
        />
        {/* Depth lines */}
        <line
          x1={objX}
          y1={cy - objH / 2 + 4}
          x2={objX + objW}
          y2={cy - objH / 2 + 4}
          stroke="#8B7340"
          strokeWidth="0.5"
          opacity="0.55"
        />
        <line
          x1={objX}
          y1={cy + objH / 2 - 4}
          x2={objX + objW}
          y2={cy + objH / 2 - 4}
          stroke="#1C1A17"
          strokeWidth="0.5"
          opacity="0.7"
        />

        {/* Beam — extends from the rim to the right edge of the SVG */}
        {glowColor && (
          <motion.rect
            x={objX + objW}
            y={cy - 6}
            width={W - (objX + objW) - 2}
            height={12}
            fill="url(#beam)"
            initial={{ opacity: 0, scaleX: 0.2 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            style={{ transformOrigin: `${objX + objW}px ${cy}px` }}
          />
        )}

        {/* Objective lens (glass disc on the right rim) */}
        <motion.ellipse
          cx={objX + objW - 3}
          cy={cy}
          rx={5}
          ry={objH / 2 - 4}
          fill="url(#objective-lens)"
          animate={
            glowColor
              ? { rx: [5, 7, 5] }
              : undefined
          }
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        {/* Bloom layer when lit */}
        {glowColor && (
          <motion.ellipse
            cx={objX + objW - 3}
            cy={cy}
            rx={14}
            ry={objH / 2}
            fill={glowColor}
            opacity={0.35}
            filter="url(#lens-bloom)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </g>

      {/* Tripod — two simple angled lines below the middle of the tube */}
      <g stroke="#8B7340" strokeWidth="2" strokeLinecap="round">
        <line x1={midX + midW * 0.5 - 18} y1={cy + midH / 2 + 4} x2={midX + midW * 0.5 - 30} y2={H - 6} />
        <line x1={midX + midW * 0.5 + 18} y1={cy + midH / 2 + 4} x2={midX + midW * 0.5 + 30} y2={H - 6} />
        {/* Small mounting collar */}
        <line
          x1={midX + midW * 0.5 - 12}
          y1={cy + midH / 2 + 2}
          x2={midX + midW * 0.5 + 12}
          y2={cy + midH / 2 + 2}
          strokeWidth="4"
        />
      </g>
    </svg>
  );
}
