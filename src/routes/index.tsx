import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  motion,
  useAnimationControls,
  useMotionValue,
  animate,
  AnimatePresence,
} from "motion/react";
import { Telescope } from "@/components/Telescope";

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

function Index() {
  const lensRef = useRef<HTMLDivElement>(null);
  const lensBrightness = useMotionValue(1);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [consumedId, setConsumedId] = useState<string | null>(null);

  /** Returns lens center + radius in viewport coords, or null. */
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

  return (
    <main className="relative mx-auto flex min-h-[100dvh] w-full max-w-[390px] flex-col overflow-hidden">
      <div className="grain" aria-hidden />

      {/* Header */}
      <header className="px-6 pt-8">
        <p className="font-mono-k text-[10px] uppercase text-[#8A847A]">
          Kikaren <span className="mx-1 text-[#3a3631]">/</span> See the future
        </p>
      </header>

      {/* Telescope — hero */}
      <section
        className="flex items-center justify-center"
        style={{ height: "60vh" }}
      >
        <Telescope size={240} brightness={lensBrightness} />
      </section>

      {/* Caption */}
      <section className="px-6 text-center">
        <h1
          className="font-serif-it text-[32px] leading-[1.1] text-[#F5F1E8]"
          style={{ letterSpacing: "-0.01em" }}
        >
          What future do you want to see?
        </h1>
        <p className="mt-5 font-mono-k text-[10px] uppercase text-[#8A847A]">
          Drag a party below into the lens
        </p>
      </section>

      {/* Party cards row */}
      <section className="mt-auto px-6 pb-10 pt-8">
        <div
          className="flex gap-3 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          <AnimatePresence>
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
                    // Screen 2 trigger placeholder — log only for now.
                    console.log("[Kikaren] selected party:", p.id);
                  }}
                />
              ),
            )}
          </AnimatePresence>
        </div>
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
      // Drop on lens — fly to center, shrink, fade out
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
      // Snap back
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
