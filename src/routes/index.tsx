import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationControls,
  useMotionValue,
  animate,
  AnimatePresence,
} from "motion/react";
import { Telescope } from "@/components/Telescope";
import { SideTelescope } from "@/components/SideTelescope";
import { VisionFor } from "@/components/Visions";

export const Route = createFileRoute("/")({
  component: Index,
});

type Party = {
  id: string;
  letter: string;
  name: string;
  color: string;
  /** Three short policy/outcome labels, mono uppercase. */
  labels: [string, string, string];
};

const PARTIES: Party[] = [
  {
    id: "S",
    letter: "S",
    name: "Socialdemokraterna",
    color: "#D62828",
    labels: ["+12,000 BOSTÄDER", "FREE COLLECTIVE TRAFIK", "RENT CAP IN JÄRVA"],
  },
  {
    id: "M",
    letter: "M",
    name: "Moderaterna",
    color: "#1E6091",
    labels: ["+8,000 NEW JOBS", "LOWER COMPANY TAX", "JÄRVA TECH HUB"],
  },
  {
    id: "MP",
    letter: "MP",
    name: "Miljöpartiet",
    color: "#4A9D3F",
    labels: ["100% FOSSIL-FREE", "+40 HA PARKLAND", "CYCLE NETWORK 2×"],
  },
  {
    id: "C",
    letter: "C",
    name: "Centerpartiet",
    color: "#F4A261",
    labels: ["50 LOCAL SHOPS", "OPEN SQUARES", "COMMUNITY GRANTS"],
  },
];

type Phase =
  | "idle"      // front telescope, cards available
  | "rotating"  // front → side
  | "viewing"   // side telescope lit, beam out
  | "screen3"   // vision portal expanded
  | "returning"; // portal collapses, side → front

function Index() {
  const lensRef = useRef<HTMLDivElement>(null);
  const lensBrightness = useMotionValue(1);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [consumedId, setConsumedId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");

  const getLensRect = () => {
    const el = lensRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      cx: r.left + r.width / 2,
      cy: r.top + r.height / 2,
      radius: r.width / 2,
    };
  };

  const pulseLens = () => {
    animate(lensBrightness, [1, 1.9, 1], {
      duration: 0.45,
      times: [0, 0.3, 1],
      ease: "easeOut",
    });
  };

  /**
   * Haptic-style visual feedback: as a card approaches the lens center,
   * brightness ramps from 1 → 1.6. Reset back to 1 when not dragging.
   */
  const onDragMove = (cardCx: number, cardCy: number) => {
    const lens = getLensRect();
    if (!lens) return;
    const d = Math.hypot(cardCx - lens.cx, cardCy - lens.cy);
    // 0 at lens center, 1 at ~2× the radius (no influence beyond that)
    const t = Math.max(0, Math.min(1, 1 - d / (lens.radius * 2)));
    lensBrightness.set(1 + t * 0.6);
  };
  const resetBrightness = () => {
    animate(lensBrightness, 1, { duration: 0.25, ease: "easeOut" });
  };

  // Idle hint: after 4s of no interaction on screen 1, bounce the first card.
  const [hintTick, setHintTick] = useState(0);
  useEffect(() => {
    if (phase !== "idle") return;
    const t = setTimeout(() => setHintTick((n) => n + 1), 4000);
    return () => clearTimeout(t);
  }, [phase, consumedId, hintTick]);

  // rotating → viewing
  useEffect(() => {
    if (phase !== "rotating") return;
    const t = setTimeout(() => setPhase("viewing"), 800);
    return () => clearTimeout(t);
  }, [phase]);

  // viewing → screen3
  useEffect(() => {
    if (phase !== "viewing") return;
    const t = setTimeout(() => setPhase("screen3"), 1000);
    return () => clearTimeout(t);
  }, [phase]);

  // returning → idle (after portal collapse + rotate back)
  useEffect(() => {
    if (phase !== "returning") return;
    const t = setTimeout(() => {
      setConsumedId(null);
      setSelectedParty(null);
      setPhase("idle");
    }, 750);
    return () => clearTimeout(t);
  }, [phase]);



  const isPostSelect =
    phase === "viewing" || phase === "screen3" || phase === "returning";
  const showFrontTele = phase === "idle" || phase === "rotating";
  const showSideTele = phase === "viewing" || phase === "screen3" || phase === "returning";
  const showPortal = phase === "screen3";

  return (
    <main className="relative mx-auto flex min-h-[100dvh] w-full max-w-[390px] flex-col overflow-hidden">
      <div className="grain" aria-hidden />

      {/* Header */}
      <header className="px-6 pt-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={isPostSelect ? "viewing" : "idle"}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.3 }}
            className="font-mono-k text-[10px] uppercase text-[#8A847A]"
          >
            {isPostSelect && selectedParty ? (
              <>
                Viewing <span className="mx-1 text-[#8A847A]/30">:</span>{" "}
                <span style={{ color: selectedParty.color }}>
                  {selectedParty.name}
                </span>
                's 2030 Järva
              </>
            ) : (
              <>
                Kikaren <span className="mx-1 text-[#8A847A]/30">/</span> See the future
              </>
            )}
          </motion.p>
        </AnimatePresence>
      </header>

      {/* Screen 3 headline (italic serif, 28px) — appears in place of the
          idle caption when the vision portal is up. */}
      <AnimatePresence>
        {phase === "screen3" && selectedParty && (
          <motion.div
            key="screen3-headline"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="px-6 pt-4 text-center"
          >
            <h1
              className="font-serif-it text-[28px] leading-[1.15] text-[#F5F1E8]"
              style={{ letterSpacing: "-0.01em" }}
            >
              If you vote{" "}
              <span style={{ color: selectedParty.color }}>
                {selectedParty.letter}
              </span>
              , Järva in 5 years could look like this.
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage: telescope + vision portal */}
      <section
        className="relative flex items-center justify-center"
        style={{ height: showPortal ? "44vh" : "60vh" }}
      >
        {/* Telescope: front OR side. Side telescope slides left when the
            portal is shown so the lens visually feeds the portal. */}
        <AnimatePresence mode="wait">
          {showFrontTele && (
            <motion.div
              key="front"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.08, rotateY: 70 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{ transformPerspective: 1000 }}
            >
              <Telescope size={240} brightness={lensBrightness} ref={lensRef} />
            </motion.div>
          )}
          {showSideTele && (
            <motion.div
              key="side"
              initial={{ opacity: 0, scale: 0.92, rotateY: -70 }}
              animate={{
                opacity: 1,
                scale: showPortal ? 0.62 : 1,
                rotateY: 0,
                x: showPortal ? -110 : 0,
              }}
              exit={{ opacity: 0, scale: 0.9, rotateY: 70 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ transformPerspective: 1000, position: "absolute" }}
            >
              <SideTelescope glowColor={selectedParty?.color ?? null} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vision portal */}
        <AnimatePresence>
          {showPortal && selectedParty && (
            <motion.div
              key="portal"
              className="absolute"
              style={{ right: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <VisionPortal party={selectedParty} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Idle caption */}
      <section className="px-6 text-center">
        <AnimatePresence>
          {phase === "idle" && (
            <motion.div
              key="caption"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            >
              <h1
                className="font-serif-it text-[32px] leading-[1.1] text-[#F5F1E8]"
                style={{ letterSpacing: "-0.01em" }}
              >
                What future do you want to see?
              </h1>
              <p className="mt-5 font-mono-k text-[10px] uppercase text-[#8A847A]">
                Drag a party below into the lens
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Reset link — only on screen3 */}
      <AnimatePresence>
        {phase === "screen3" && (
          <motion.div
            key="reset"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.9 }}
            className="px-6 pt-4 text-center"
          >
            <button
              type="button"
              onClick={() => setPhase("returning")}
              className="font-serif-it text-[18px] italic text-[#F5F1E8]/80 underline decoration-[#C9A961]/40 underline-offset-4 transition-colors hover:text-[#F5F1E8]"
            >
              ← see another party
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Party cards row */}
      <section className="mt-auto px-6 pb-6 pt-8">
        <AnimatePresence>
          {phase === "idle" && (
            <motion.div
              key="cards"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.35 }}
              className="flex gap-3 overflow-x-auto pb-2"
              style={{ scrollbarWidth: "none" }}
            >
              {PARTIES.map((p) =>
                consumedId === p.id ? null : (
                  <PartyCard
                    key={p.id}
                    party={p}
                    getLensRect={getLensRect}
                    onConsume={() => {
                      pulseLens();
                      setSelectedParty(p);
                      setConsumedId(p.id);
                      setTimeout(() => setPhase("rotating"), 320);
                    }}
                  />
                ),
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Disclaimer */}
      <footer className="px-6 pb-6 pt-2 text-center">
        <p className="font-mono-k text-[8px] uppercase text-[#8A847A]/60">
          Based on party platform 2026.{" "}
          <span className="text-[#8A847A]/40">·</span> Not an official forecast.
        </p>

      </footer>
    </main>
  );
}

/**
 * Vision portal: circular illustration that expands 0 → 280px in 600ms ease-out,
 * with three small data-label pills appearing in sequence around it.
 */
function VisionPortal({ party }: { party: Party }) {
  const SIZE = 280;
  // Label anchors: angles around the circle (degrees), distance from center.
  // 12 o'clock, 4 o'clock, 8 o'clock.
  const anchors = [
    { angle: -90, distance: 0.55 }, // top
    { angle: 35, distance: 0.65 },  // lower-right
    { angle: 200, distance: 0.6 },  // lower-left
  ];

  return (
    <div
      className="relative"
      style={{
        width: SIZE,
        height: SIZE,
        // Allow labels to render beyond the circle's bounds
        overflow: "visible",
      }}
    >
      {/* Brass ring around portal */}
      <motion.div
        className="absolute inset-0 rounded-full"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background:
            "radial-gradient(circle at 30% 25%, #F4E4B8 0%, #C9A961 32%, #8B7340 78%, #1C1A17 100%)",
          padding: 6,
        }}

      >
        {/* Clipped illustration */}
        <div
          className="relative h-full w-full overflow-hidden rounded-full"
          style={{
            boxShadow: "inset 0 0 30px rgba(0,0,0,0.55)",
          }}
        >
          {/* Tinted halo using party color */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${party.color}22 0%, transparent 60%)`,
              mixBlendMode: "screen",
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1, rotate: 360 }}
            transition={{
              opacity: { duration: 0.6, delay: 0.2, ease: "easeOut" },
              scale: { duration: 0.6, delay: 0.2, ease: "easeOut" },
              rotate: { duration: 60, repeat: Infinity, ease: "linear" },
            }}
            className="flex h-full w-full items-center justify-center"
          >
            <VisionFor partyId={party.id} color={party.color} />
          </motion.div>

        </div>
      </motion.div>

      {/* Floating data labels — staggered fade-in, 200ms apart, starts after
          the portal has finished expanding. */}
      {party.labels.map((label, i) => {
        const a = anchors[i];
        const rad = (a.angle * Math.PI) / 180;
        const r = (SIZE / 2) * a.distance + 30;
        const x = Math.cos(rad) * r;
        const y = Math.sin(rad) * r;
        return (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.9, y: y + 6 }}
            animate={{ opacity: 1, scale: 1, y }}
            transition={{
              duration: 0.4,
              delay: 0.6 + i * 0.2,
              ease: "easeOut",
            }}
            className="font-mono-k absolute left-1/2 top-1/2 whitespace-nowrap rounded-full border px-3 py-1 text-[11px] uppercase text-[#F5F1E8]"
            style={{
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              backgroundColor: "#1C1A17",
              borderColor: "#C9A961",
            }}
          >
            {label}
          </motion.div>
        );
      })}
    </div>
  );
}

function PartyCard({
  party,
  getLensRect,
  onConsume,
}: {
  party: Party;
  getLensRect: () => { cx: number; cy: number; radius: number } | null;
  onConsume: () => void;
}) {
  const controls = useAnimationControls();
  const cardRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDragEnd = async () => {
    setDragging(false);
    const el = cardRef.current;
    const lens = getLensRect();
    if (!el || !lens) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dist = Math.hypot(cx - lens.cx, cy - lens.cy);

    if (dist <= lens.radius) {
      const dx = lens.cx - cx;
      const dy = lens.cy - cy;
      onConsume();
      await controls.start({
        x: `+=${dx}`,
        y: `+=${dy}`,
        scale: 0.4,
        opacity: 0,
        transition: {
          duration: 0.3,
          ease: "easeIn",
          opacity: { duration: 0.1, delay: 0.2 },
        },
      });
    } else {
      controls.start({
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        transition: { type: "spring", stiffness: 380, damping: 28 },
      });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      drag
      dragMomentum={false}
      dragElastic={0.6}
      onDragStart={() => setDragging(true)}
      onDragEnd={handleDragEnd}
      animate={controls}
      whileDrag={{ scale: 1.06, zIndex: 40 }}
      className="relative shrink-0 cursor-grab select-none active:cursor-grabbing"
      style={{
        width: 100,
        height: 140,
        backgroundColor: party.color,
        zIndex: dragging ? 40 : 1,
        touchAction: "none",
      }}
    >
      <span
        className="font-serif-it absolute left-2 top-0 text-[64px] leading-none text-white"
        style={{ letterSpacing: "-0.02em" }}
      >
        {party.letter}
      </span>
      <span className="font-mono-k absolute bottom-2 left-2 right-2 text-[8px] uppercase text-white/90">
        {party.name}
      </span>
    </motion.div>
  );
}
