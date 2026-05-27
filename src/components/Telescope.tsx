import { motion, type MotionValue } from "motion/react";
import { forwardRef } from "react";

type Props = {
  size?: number;
  glow?: MotionValue<number> | number;
};

/**
 * Front-view telescope: we look down the barrel.
 * The forwarded ref is attached to the inner lens circle so the parent
 * can read its bounding box to test "did the card drop on the lens?".
 */
export const Telescope = forwardRef<HTMLDivElement, Props>(function Telescope(
  { size = 240, glow = 1 },
  lensRef,
) {
  const lensSize = size * 0.7; // inner glass

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Soft drop glow — radial, no hard shadow */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          inset: -40,
          background:
            "radial-gradient(closest-side, rgba(201,169,97,0.18), rgba(201,169,97,0) 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Outer brass ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          background:
            "radial-gradient(circle at 32% 28%, #E2C684 0%, #C9A961 38%, #8B7340 78%, #5a4a25 100%)",
        }}
      />

      {/* Middle ring — darker brass */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.84,
          height: size * 0.84,
          background:
            "radial-gradient(circle at 30% 25%, #a88a48 0%, #8B7340 55%, #4a3d1f 100%)",
          boxShadow:
            "inset 0 0 18px rgba(0,0,0,0.55), inset 0 2px 2px rgba(244,228,184,0.18)",
        }}
      />

      {/* Inner lens (drop target) with animated brightness */}
      <motion.div
        ref={lensRef}
        className="absolute rounded-full"
        style={{
          width: lensSize,
          height: lensSize,
          // @ts-expect-error CSS var
          "--glow": typeof glow === "number" ? glow : undefined,
          background:
            "radial-gradient(circle at 50% 50%, #F4E4B8 0%, #C9A961 18%, #3a2f1a 55%, #1C1A17 100%)",
          boxShadow:
            "inset 0 0 28px rgba(0,0,0,0.85), inset 0 0 6px rgba(244,228,184,0.35)",
        }}
        // Pulse: brightness + saturation
        animate={
          typeof glow === "number"
            ? { filter: `brightness(${glow}) saturate(${glow})` }
            : undefined
        }
        style-glow={undefined as never}
      >
        {/* Glass reflection crescent — upper-left */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            <radialGradient id="crescent" cx="32%" cy="28%" r="40%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
            <clipPath id="lensClip">
              <circle cx="50" cy="50" r="50" />
            </clipPath>
          </defs>
          <g clipPath="url(#lensClip)">
            <path
              d="M 8 38 Q 22 8 58 10 Q 30 14 16 44 Q 10 52 8 38 Z"
              fill="url(#crescent)"
            />
          </g>
        </svg>
      </motion.div>
    </div>
  );
});
