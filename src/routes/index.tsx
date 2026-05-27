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

export const Route = createFileRoute("/")({
  component: Index,
});

type Party = {
  id: string;
  letter: string;
  name: string;
  color: string;
};

const PARTIES: Party[] = [
  { id: "S", letter: "S", name: "Socialdemokraterna", color: "#D62828" },
  { id: "M", letter: "M", name: "Moderaterna", color: "#1E6091" },
  { id: "MP", letter: "MP", name: "Miljöpartiet", color: "#4A9D3F" },
  { id: "C", letter: "C", name: "Centerpartiet", color: "#F4A261" },
];

type Phase =
  | "idle"      // showing front telescope, cards available
  | "rotating"  // front fades out → side fades in
  | "viewing"   // side telescope, objective lens glowing + beam
  | "screen3";  // hook point for next screen

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

  // After the card is absorbed, kick off Screen 2: rotate → view → screen3.
  useEffect(() => {
    if (phase !== "rotating") return;
    // Front fades out (~400ms) then side fades in (~400ms) — handled by
    // AnimatePresence on the telescope swap below. We just time the next phase.
    const t1 = setTimeout(() => setPhase("viewing"), 800);
    return () => clearTimeout(t1);
  }, [phase]);

  useEffect(() => {
    if (phase !== "viewing") return;
    // Hold the lit objective + beam for 400ms, then trigger Screen 3.
    // Screen 3 is not built yet — we just transition state and log.
    const t = setTimeout(() => {
      setPhase("screen3");
      console.log("[Kikaren] → Screen 3 (vision)", selectedParty?.id);
    }, 400 + 600); // small grace so the glow animation reads
    return () => clearTimeout(t);
  }, [phase, selectedParty]);

  const isViewing = phase === "viewing" || phase === "screen3";
  const headerKey = isViewing ? "viewing" : "idle";



  return (
    <main className="relative mx-auto flex min-h-[100dvh] w-full max-w-[390px] flex-col overflow-hidden">
      <div className="grain" aria-hidden />

      {/* Header — text swaps once viewing */}
      <header className="px-6 pt-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={headerKey}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.3 }}
            className="font-mono-k text-[10px] uppercase text-[#8A847A]"
          >
            {phase === "viewing" || phase === "screen3" ? (
              <>
                Viewing <span className="mx-1 text-[#3a3631]">:</span>{" "}
                <span style={{ color: selectedParty?.color }}>
                  {selectedParty?.name}
                </span>
                's 2030 Järva
              </>
            ) : (
              <>
                Kikaren <span className="mx-1 text-[#3a3631]">/</span> See the future
              </>
            )}
          </motion.p>
        </AnimatePresence>
      </header>

      {/* Telescope stage — crossfade between front + side */}
      <section
        className="relative flex items-center justify-center"
        style={{ height: "60vh" }}
      >
        <AnimatePresence mode="wait">
          {phase === "idle" || phase === "rotating" ? (
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
          ) : (
            <motion.div
              key="side"
              initial={{ opacity: 0, scale: 0.92, rotateY: -70 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut", delay: 0.05 }}
              style={{ transformPerspective: 1000 }}
            >
              <SideTelescope glowColor={selectedParty?.color ?? null} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Caption — hide once we leave idle */}
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

      {/* Party cards row — also hidden after selection */}
      <section className="mt-auto px-6 pb-10 pt-8">
        <AnimatePresence>
          {phase === "idle" && (
            <motion.div
              key="cards"
              initial={{ opacity: 1 }}
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
                      // Wait for the absorb animation to play out, then rotate.
                      setTimeout(() => setPhase("rotating"), 320);
                    }}
                  />
                ),
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
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
