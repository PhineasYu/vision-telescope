import { motion, useMotionTemplate, type MotionValue } from "motion/react";
import { forwardRef } from "react";

type Props = {
  size?: number;
  /** 1 = idle, >1 = pulsing brighter. If omitted, the lens uses a default ambient breath. */
  brightness?: MotionValue<number>;
};

/**
 * Front-view telescope. We look down the barrel.
 * The forwarded ref attaches to the inner lens so the parent can read
 * its bounding rect for hit-testing the card drop.
 *
 * Brass palette is restricted to: #C9A961, #8B7340, #F4E4B8, #1C1A17.
 */
export const Telescope = forwardRef<HTMLDivElement, Props>(function Telescope(
  { size = 240, brightness },
  lensRef,
) {
  const lensSize = size * 0.7;
  const filter = brightness
    ? useMotionTemplate`brightness(${brightness}) saturate(${brightness})`
    : undefined;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Soft brass drop glow — ambient breath (3s loop) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute rounded-full"
        style={{
          inset: -50,
          background:
            "radial-gradient(closest-side, rgba(201,169,97,0.20), rgba(201,169,97,0) 70%)",
          filter: "blur(20px)",
        }}
        animate={{ scale: [1, 1.03, 1], opacity: [1, 1.15, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Outer brass ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          background:
            "radial-gradient(circle at 32% 28%, #F4E4B8 0%, #C9A961 32%, #8B7340 78%, #1C1A17 100%)",
        }}
      />

      {/* Middle ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.84,
          height: size * 0.84,
          background:
            "radial-gradient(circle at 30% 25%, #C9A961 0%, #8B7340 55%, #1C1A17 100%)",
          boxShadow:
            "inset 0 0 18px rgba(28,26,23,0.85), inset 0 2px 2px rgba(244,228,184,0.18)",
        }}
      />

      {/* Inner lens (drop target) */}
      <motion.div
        ref={lensRef}
        className="absolute rounded-full"
        style={{
          width: lensSize,
          height: lensSize,
          background:
            "radial-gradient(circle at 50% 50%, #F4E4B8 0%, #C9A961 18%, #8B7340 48%, #1C1A17 100%)",
          boxShadow:
            "inset 0 0 28px rgba(28,26,23,0.85), inset 0 0 6px rgba(244,228,184,0.35)",
          filter,
        }}
        // Ambient breath on the lens itself when no external brightness ramp.
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Glass texture — refraction rings, aperture blades, crescent + speculars, vignette */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            <radialGradient id="kik-crescent" cx="32%" cy="28%" r="42%">
              <stop offset="0%" stopColor="#F5F1E8" stopOpacity="0.42" />
              <stop offset="60%" stopColor="#F5F1E8" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#F5F1E8" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="kik-lower-glow" cx="68%" cy="78%" r="38%">
              <stop offset="0%" stopColor="#C9A961" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#C9A961" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="kik-vignette" cx="50%" cy="50%" r="50%">
              <stop offset="62%" stopColor="#1C1A17" stopOpacity="0" />
              <stop offset="100%" stopColor="#1C1A17" stopOpacity="0.8" />
            </radialGradient>
            <clipPath id="kik-lens-clip">
              <circle cx="50" cy="50" r="50" />
            </clipPath>
          </defs>
          <g clipPath="url(#kik-lens-clip)">
            {/* Warm reflected brass from below */}
            <rect width="100" height="100" fill="url(#kik-lower-glow)" />

            {/* Concentric refraction rings */}
            <circle cx="50" cy="50" r="44" fill="none" stroke="#F4E4B8" strokeOpacity="0.10" strokeWidth="0.4" />
            <circle cx="50" cy="50" r="36" fill="none" stroke="#F4E4B8" strokeOpacity="0.08" strokeWidth="0.3" />
            <circle cx="50" cy="50" r="26" fill="none" stroke="#F4E4B8" strokeOpacity="0.12" strokeWidth="0.3" />
            <circle cx="50" cy="50" r="16" fill="none" stroke="#F4E4B8" strokeOpacity="0.20" strokeWidth="0.4" />

            {/* Aperture blades — six radial lines, like a lens iris */}
            <g stroke="#1C1A17" strokeOpacity="0.45" strokeWidth="0.35" strokeLinecap="round">
              <line x1="50" y1="50" x2="50" y2="6" />
              <line x1="50" y1="50" x2="88" y2="28" />
              <line x1="50" y1="50" x2="88" y2="72" />
              <line x1="50" y1="50" x2="50" y2="94" />
              <line x1="50" y1="50" x2="12" y2="72" />
              <line x1="50" y1="50" x2="12" y2="28" />
            </g>

            {/* Primary crescent highlight */}
            <path
              d="M 8 40 Q 22 8 60 10 Q 30 14 16 46 Q 10 54 8 40 Z"
              fill="url(#kik-crescent)"
            />

            {/* Specular dot */}
            <circle cx="30" cy="26" r="2.4" fill="#F5F1E8" fillOpacity="0.55" />
            <circle cx="30" cy="26" r="0.9" fill="#F5F1E8" fillOpacity="0.95" />

            {/* Secondary small highlight */}
            <ellipse cx="68" cy="70" rx="6" ry="2.2" fill="#F4E4B8" fillOpacity="0.18" transform="rotate(-28 68 70)" />

            {/* Inner vignette to deepen the lens well */}
            <rect width="100" height="100" fill="url(#kik-vignette)" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
});
