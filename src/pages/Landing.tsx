import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  Sparkles,
  BookOpen,
  Youtube,
  Github,
  FileText,
  GraduationCap,
  Code2,
  Rocket,
  Target,
  BarChart3,
  Users,
  TrendingUp,
  Play,
  Zap,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { PageSEO } from "@/components/PageSEO";
import { useRef, useMemo, useEffect, useState } from "react";

/* ══════════════════════════════════════════════════════════
   SKILL-METRICS · CINEMATIC LANDING
   One continuous scroll-driven journey. 10 scenes, each
   pinned for ~100vh and blended via opacity/scale/blur so
   there are no hard cuts between them.
   ══════════════════════════════════════════════════════════ */

/* ------------------------------------------------------------------ */
/* Utility hooks                                                       */
/* ------------------------------------------------------------------ */

// Blends a scene in/out based on the global scroll progress.
// Each scene occupies a slice [start, end] and cross-fades with neighbors.
function useSceneTransform(
  scroll: MotionValue<number>,
  start: number,
  end: number
) {
  const fadeIn = start + (end - start) * 0.05;
  const hold1 = start + (end - start) * 0.2;
  const hold2 = start + (end - start) * 0.8;
  const fadeOut = end - (end - start) * 0.05;

  const opacity = useTransform(
    scroll,
    [start, fadeIn, hold2, fadeOut],
    [0, 1, 1, 0]
  );
  const scale = useTransform(
    scroll,
    [start, hold1, hold2, fadeOut],
    [0.92, 1, 1, 1.08]
  );
  const blur = useTransform(
    scroll,
    [start, fadeIn, hold2, fadeOut],
    ["12px", "0px", "0px", "10px"]
  );
  const filter = useTransform(blur, (b) => `blur(${b})`);
  const local = useTransform(scroll, [start, end], [0, 1]);
  return { opacity, scale, filter, local };
}

/* ------------------------------------------------------------------ */
/* Ambient background — persistent across all scenes                   */
/* ------------------------------------------------------------------ */

const AmbientBackdrop = ({ scroll }: { scroll: MotionValue<number> }) => {
  const hue = useTransform(scroll, [0, 0.5, 1], [250, 220, 265]);
  const bg = useTransform(
    hue,
    (h) =>
      `radial-gradient(1200px 800px at 20% 10%, hsl(${h} 90% 55% / 0.18), transparent 60%),` +
      `radial-gradient(1000px 700px at 80% 60%, hsl(${
        Number(h) + 40
      } 90% 60% / 0.14), transparent 65%),` +
      `linear-gradient(180deg, #05060d 0%, #08091a 50%, #05060d 100%)`
  );
  return (
    <motion.div
      className="fixed inset-0 -z-10"
      style={{ background: bg }}
      aria-hidden
    />
  );
};

/* Floating particles — subtle, GPU-cheap */
const Particles = ({ count = 40 }: { count?: number }) => {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: 1 + Math.random() * 2.5,
        d: 6 + Math.random() * 12,
        o: 0.15 + Math.random() * 0.35,
      })),
    [count]
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
            opacity: p.o,
            filter: "blur(0.5px)",
            boxShadow: "0 0 8px hsl(250 100% 75% / 0.8)",
          }}
          animate={{ y: [0, -18, 0], opacity: [p.o, p.o * 1.6, p.o] }}
          transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Resource chip — small "learning resource" card that floats in 3D    */
/* ------------------------------------------------------------------ */

const RESOURCE_ICONS = [
  { icon: Youtube, label: "Course", tint: "255 80 80" },
  { icon: BookOpen, label: "Book", tint: "180 140 255" },
  { icon: Github, label: "Repo", tint: "170 200 255" },
  { icon: FileText, label: "Paper", tint: "120 220 200" },
  { icon: GraduationCap, label: "Degree", tint: "255 200 120" },
  { icon: Code2, label: "Project", tint: "140 255 200" },
];

const ResourceChip = ({
  x,
  y,
  z,
  i,
  chaos,
}: {
  x: number;
  y: number;
  z: number;
  i: number;
  chaos: MotionValue<number>;
}) => {
  const meta = RESOURCE_ICONS[i % RESOURCE_ICONS.length];
  const Icon = meta.icon;
  // z acts as depth: smaller z -> further away
  const scale = 0.35 + z * 0.9;
  const translateX = useTransform(chaos, [0, 1], [0, (x - 50) * 0.6]);
  const translateY = useTransform(chaos, [0, 1], [0, (y - 50) * 0.6]);
  const rot = useTransform(chaos, [0, 1], [0, (i % 2 ? 1 : -1) * 18]);
  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2 will-change-transform"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        x: translateX,
        y: translateY,
        rotate: rot,
        scale,
        opacity: 0.55 + z * 0.45,
      }}
    >
      <div
        className="flex items-center gap-2 rounded-xl border px-3 py-2 backdrop-blur-md"
        style={{
          borderColor: `hsl(240 30% 60% / 0.25)`,
          background: `linear-gradient(135deg, hsl(240 40% 12% / 0.65), hsl(250 40% 8% / 0.55))`,
          boxShadow: `0 8px 28px hsl(${meta.tint.split(" ")[0]} 90% 60% / 0.15), inset 0 1px 0 hsl(0 0% 100% / 0.06)`,
        }}
      >
        <Icon
          className="h-3.5 w-3.5"
          style={{ color: `rgb(${meta.tint})` }}
        />
        <span className="text-[11px] font-medium text-white/85 whitespace-nowrap">
          {meta.label}
        </span>
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Neural network SVG (scenes 3-4)                                     */
/* ------------------------------------------------------------------ */

const NeuralNetwork = ({
  progress,
  morph,
}: {
  progress: MotionValue<number>;
  morph: MotionValue<number>; // 0=network 1=roadmap
}) => {
  const nodes = useMemo(() => {
    const arr: { x: number; y: number; rx: number; ry: number }[] = [];
    // Network layout
    const layers = 5;
    const perLayer = 6;
    for (let l = 0; l < layers; l++) {
      for (let n = 0; n < perLayer; n++) {
        const x = 15 + (l / (layers - 1)) * 70;
        const y = 20 + (n / (perLayer - 1)) * 60 + (l % 2 ? 0 : 4);
        // Roadmap layout (skill tree)
        const rx = 20 + (l / (layers - 1)) * 60;
        const ry = 20 + (n / (perLayer - 1)) * 60;
        arr.push({ x, y, rx, ry });
      }
    }
    return arr;
  }, []);

  const edges = useMemo(() => {
    const arr: [number, number][] = [];
    const perLayer = 6;
    for (let l = 0; l < 4; l++) {
      for (let a = 0; a < perLayer; a++) {
        for (let b = 0; b < perLayer; b++) {
          if (Math.abs(a - b) <= 2)
            arr.push([l * perLayer + a, (l + 1) * perLayer + b]);
        }
      }
    }
    return arr;
  }, []);

  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <radialGradient id="node-g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(220 100% 80%)" />
          <stop offset="100%" stopColor="hsl(260 100% 55%)" />
        </radialGradient>
        <linearGradient id="edge-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(220 100% 70%)" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(240 100% 75%)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="hsl(280 100% 70%)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {edges.map(([a, b], i) => {
        const na = nodes[a];
        const nb = nodes[b];
        const x1 = useTransform(morph, [0, 1], [na.x, na.rx]);
        const y1 = useTransform(morph, [0, 1], [na.y, na.ry]);
        const x2 = useTransform(morph, [0, 1], [nb.x, nb.rx]);
        const y2 = useTransform(morph, [0, 1], [nb.y, nb.ry]);
        const op = useTransform(
          progress,
          [0, 0.3 + (i % 10) * 0.03, 1],
          [0, 0.55, 0.4]
        );
        return (
          <motion.line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="url(#edge-g)"
            strokeWidth={0.15}
            style={{ opacity: op }}
          />
        );
      })}
      {nodes.map((n, i) => {
        const cx = useTransform(morph, [0, 1], [n.x, n.rx]);
        const cy = useTransform(morph, [0, 1], [n.y, n.ry]);
        const r = useTransform(
          progress,
          [0, 0.2 + (i % 6) * 0.05, 1],
          [0, 0.7, 0.9]
        );
        return (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="url(#node-g)"
            style={{
              filter: "drop-shadow(0 0 2px hsl(240 100% 70%))",
            }}
          />
        );
      })}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Product UI mock cards — the "70% real product" surface              */
/* ------------------------------------------------------------------ */

const DashboardMock = ({ tilt = 0 }: { tilt?: number }) => (
  <div
    className="relative w-full max-w-[720px] rounded-2xl border border-white/10 bg-[#0b0d1c]/90 p-5 shadow-[0_30px_80px_-20px_hsl(250_100%_50%/0.5)] backdrop-blur-xl"
    style={{ transform: `perspective(1200px) rotateX(${tilt}deg)` }}
  >
    {/* top bar */}
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-500" />
        <span className="text-sm font-semibold text-white/90">
          Skill-Metrics
        </span>
      </div>
      <div className="flex gap-1.5">
        <div className="h-2 w-2 rounded-full bg-red-400/70" />
        <div className="h-2 w-2 rounded-full bg-yellow-400/70" />
        <div className="h-2 w-2 rounded-full bg-emerald-400/70" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-3">
      {/* Progress ring */}
      <div className="col-span-1 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="text-[10px] uppercase tracking-wider text-white/50">
          Journey
        </div>
        <div className="mt-2 flex items-center justify-center">
          <svg viewBox="0 0 60 60" className="h-24 w-24 -rotate-90">
            <circle
              cx="30"
              cy="30"
              r="24"
              fill="none"
              stroke="hsl(240 30% 20%)"
              strokeWidth="5"
            />
            <motion.circle
              cx="30"
              cy="30"
              r="24"
              fill="none"
              stroke="url(#ring-g)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={150.8}
              initial={{ strokeDashoffset: 150.8 }}
              whileInView={{ strokeDashoffset: 45 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="ring-g">
                <stop offset="0%" stopColor="hsl(220 100% 70%)" />
                <stop offset="100%" stopColor="hsl(280 100% 70%)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="mt-1 text-center text-xs text-white/70">
          <span className="text-lg font-semibold text-white">70%</span> complete
        </div>
      </div>
      {/* Bars */}
      <div className="col-span-2 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-wider text-white/50">
            Weekly hours
          </div>
          <div className="text-[10px] text-emerald-400">+18%</div>
        </div>
        <div className="flex h-20 items-end gap-1.5">
          {[38, 52, 30, 66, 48, 74, 60].map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-md"
              style={{
                background:
                  "linear-gradient(180deg, hsl(280 100% 70%), hsl(230 100% 60%))",
              }}
              initial={{ height: 0 }}
              whileInView={{ height: `${h}%` }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i, duration: 0.8, ease: "easeOut" }}
            />
          ))}
        </div>
      </div>
      {/* Skill list */}
      <div className="col-span-3 space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        {[
          { s: "Neural Networks", p: 82 },
          { s: "Transformers", p: 64 },
          { s: "Reinforcement Learning", p: 41 },
        ].map((row, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-40 text-xs text-white/80">{row.s}</span>
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, hsl(220 100% 65%), hsl(280 100% 70%))",
                }}
                initial={{ width: 0 }}
                whileInView={{ width: `${row.p}%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 1, ease: "easeOut" }}
              />
            </div>
            <span className="w-10 text-right text-[11px] text-white/60">
              {row.p}%
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Scenes                                                              */
/* ------------------------------------------------------------------ */

const SCENE_COUNT = 10;
const SCENE = (i: number): [number, number] => [
  i / SCENE_COUNT,
  (i + 1) / SCENE_COUNT,
];

/* Scene 1 — Information Overload */
const Scene1 = ({ scroll }: { scroll: MotionValue<number> }) => {
  const [s, e] = SCENE(0);
  const t = useSceneTransform(scroll, s, e);
  const chaos = useTransform(scroll, [s, e], [0, 1]);
  const cameraZ = useTransform(scroll, [s, e], [1, 2.6]);
  const chips = useMemo(
    () =>
      Array.from({ length: 46 }).map((_, i) => ({
        x: 5 + Math.random() * 90,
        y: 5 + Math.random() * 90,
        z: 0.2 + Math.random() * 0.8,
        i,
      })),
    []
  );
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity: t.opacity, filter: t.filter }}
    >
      <motion.div className="absolute inset-0" style={{ scale: cameraZ }}>
        {chips.map((c) => (
          <ResourceChip key={c.i} {...c} chaos={chaos} />
        ))}
      </motion.div>
      <div className="relative z-10 max-w-3xl text-center px-6">
        <motion.h1
          className="text-5xl md:text-7xl font-semibold tracking-tight text-white"
          style={{
            textShadow: "0 4px 40px hsl(250 100% 60% / 0.5)",
          }}
        >
          Infinite resources.
          <br />
          <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
            Zero direction.
          </span>
        </motion.h1>
        <p className="mt-6 text-lg text-white/60">
          Millions of courses, videos, papers, and repos. And still — the same
          question every morning.
        </p>
      </div>
    </motion.div>
  );
};

/* Scene 2 — The Learner */
const Scene2 = ({ scroll }: { scroll: MotionValue<number> }) => {
  const [s, e] = SCENE(1);
  const t = useSceneTransform(scroll, s, e);
  const orbit = useTransform(scroll, [s, e], [0, 360]);
  const questions = [
    "Where do I start?",
    "What should I learn next?",
    "Which course is best?",
    "Am I learning correctly?",
    "Is this worth my time?",
  ];
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity: t.opacity, filter: t.filter, scale: t.scale }}
    >
      {/* Orbit ring */}
      <motion.div
        className="absolute h-[520px] w-[520px] rounded-full border border-white/10"
        style={{ rotate: orbit }}
      >
        {RESOURCE_ICONS.map((r, i) => {
          const angle = (i / RESOURCE_ICONS.length) * Math.PI * 2;
          const x = Math.cos(angle) * 260;
          const y = Math.sin(angle) * 260;
          const Icon = r.icon;
          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-md"
              style={{ transform: `translate(${x - 24}px, ${y - 24}px)` }}
            >
              <Icon
                className="h-5 w-5"
                style={{ color: `rgb(${r.tint})` }}
              />
            </div>
          );
        })}
      </motion.div>
      {/* Learner silhouette */}
      <div className="relative flex flex-col items-center">
        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-full bg-gradient-radial from-indigo-500/30 to-transparent blur-2xl" />
          <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-white/10 to-white/[0.02] backdrop-blur-md">
            <Brain className="h-12 w-12 text-white/80" />
          </div>
        </div>
        <div className="mt-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white">
            You have the will.
          </h2>
          <p className="mt-2 text-white/60">You just don't have the map.</p>
        </div>
      </div>
      {/* Question cards */}
      {questions.map((q, i) => {
        const angle = (i / questions.length) * Math.PI * 2 + 0.6;
        const x = Math.cos(angle) * 340;
        const y = Math.sin(angle) * 200;
        return (
          <motion.div
            key={i}
            className="absolute rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-md"
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * i, duration: 0.6 }}
          >
            {q}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

/* Scene 3 & 4 — AI Engine → Learning Graph (shared morph) */
const Scene34 = ({ scroll }: { scroll: MotionValue<number> }) => {
  const [s3, e3] = SCENE(2);
  const [s4, e4] = SCENE(3);
  const t3 = useSceneTransform(scroll, s3, e3);
  const t4 = useSceneTransform(scroll, s4, e4);
  const netProgress = useTransform(scroll, [s3, e4], [0, 1]);
  const morph = useTransform(scroll, [e3, s4 + (e4 - s4) * 0.4], [0, 1]);

  return (
    <>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: t3.opacity }}
      >
        <div className="absolute top-[12%] left-1/2 -translate-x-1/2 text-center">
          <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-indigo-300" /> AI Engine
          </div>
          <h2 className="text-4xl md:text-6xl font-semibold text-white">
            Chaos, organized.
          </h2>
          <p className="mt-2 text-white/60">
            A neural engine reads every resource and finds the signal.
          </p>
        </div>
      </motion.div>
      <div className="absolute inset-0">
        <NeuralNetwork progress={netProgress} morph={morph} />
      </div>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: t4.opacity }}
      >
        <div className="absolute bottom-[14%] left-1/2 -translate-x-1/2 text-center">
          <h2 className="text-4xl md:text-6xl font-semibold text-white">
            Your personal
            <span className="bg-gradient-to-r from-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
              {" "}
              skill graph.
            </span>
          </h2>
          <p className="mt-2 text-white/60">
            Every node connects what you know to what you need next.
          </p>
        </div>
      </motion.div>
    </>
  );
};

/* Scene 5 — Product Showcase */
const Scene5 = ({ scroll }: { scroll: MotionValue<number> }) => {
  const [s, e] = SCENE(4);
  const t = useSceneTransform(scroll, s, e);
  const tilt = useTransform(scroll, [s, e], [12, -6]);
  const y = useTransform(scroll, [s, e], [80, -60]);
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6"
      style={{ opacity: t.opacity, filter: t.filter }}
    >
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
          <Rocket className="h-3.5 w-3.5 text-indigo-300" /> The Product
        </div>
        <h2 className="text-4xl md:text-6xl font-semibold text-white">
          This is Skill-Metrics.
        </h2>
      </div>
      <motion.div style={{ y }}>
        <motion.div style={{ rotateX: tilt }}>
          <DashboardMock />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

/* Scene 6 — Personalized Recommendations */
const Scene6 = ({ scroll }: { scroll: MotionValue<number> }) => {
  const [s, e] = SCENE(5);
  const t = useSceneTransform(scroll, s, e);
  const mid = (s + e) / 2;
  const converge = useTransform(scroll, [s, mid], [0, 1]);
  const recs = [
    { title: "Deep Learning Specialization", meta: "Course · 84h", tag: "Foundational" },
    { title: "Attention Is All You Need", meta: "Paper · 20m", tag: "Must read" },
    { title: "Build a Transformer from scratch", meta: "Project · 12h", tag: "Hands-on" },
    { title: "Karpathy — Neural Networks Zero to Hero", meta: "Video · 18h", tag: "Recommended" },
  ];
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-6"
      style={{ opacity: t.opacity, filter: t.filter }}
    >
      {/* Floating chaos in the back */}
      {Array.from({ length: 24 }).map((_, i) => {
        const x = 5 + Math.random() * 90;
        const y = 5 + Math.random() * 90;
        const tx = useTransform(converge, [0, 1], [0, (50 - x) * 0.9]);
        const ty = useTransform(converge, [0, 1], [0, (50 - y) * 0.9]);
        const op = useTransform(converge, [0, 1], [0.5, 0]);
        return (
          <ResourceChip
            key={i}
            x={x}
            y={y}
            z={0.4}
            i={i}
            chaos={useTransform(scroll, () => 0)}
          />
        );
      })}
      <div className="relative z-10 w-full max-w-3xl">
        <div className="mb-6 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-white">
            10,000 resources → <span className="text-indigo-300">the 4 you need.</span>
          </h2>
        </div>
        <div className="grid gap-3">
          {recs.map((r, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/40 to-purple-500/40 border border-white/10">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">{r.title}</div>
                <div className="text-xs text-white/50">{r.meta}</div>
              </div>
              <span className="rounded-full border border-indigo-300/30 bg-indigo-400/10 px-2.5 py-1 text-[11px] text-indigo-200">
                {r.tag}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/* Scene 7 — Analytics */
const Scene7 = ({ scroll }: { scroll: MotionValue<number> }) => {
  const [s, e] = SCENE(6);
  const t = useSceneTransform(scroll, s, e);
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6"
      style={{ opacity: t.opacity, filter: t.filter }}
    >
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
          <BarChart3 className="h-3.5 w-3.5 text-indigo-300" /> Progress
        </div>
        <h2 className="text-4xl md:text-6xl font-semibold text-white">
          Growth you can measure.
        </h2>
      </div>
      <div className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Streak", value: "42d", grad: "from-orange-400 to-red-500" },
          { label: "XP earned", value: "12,480", grad: "from-indigo-400 to-purple-500" },
          { label: "Skills mastered", value: "23", grad: "from-teal-400 to-emerald-500" },
        ].map((k, i) => (
          <motion.div
            key={i}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * i, duration: 0.7 }}
          >
            <div className="text-xs text-white/50 uppercase tracking-wider">
              {k.label}
            </div>
            <div
              className={`mt-2 bg-gradient-to-r ${k.grad} bg-clip-text text-5xl font-semibold text-transparent`}
            >
              {k.value}
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-emerald-400">
              <TrendingUp className="h-3.5 w-3.5" /> trending up
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 w-full max-w-5xl rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm text-white/70">Mastery over time</div>
          <div className="text-xs text-emerald-400">+34% this month</div>
        </div>
        <svg viewBox="0 0 400 100" className="h-24 w-full">
          <defs>
            <linearGradient id="area-g" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="hsl(250 100% 70%)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(250 100% 70%)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,80 C40,70 80,60 120,55 C160,50 200,40 240,30 C280,22 320,18 400,10 L400,100 L0,100 Z"
            fill="url(#area-g)"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8 }}
          />
          <motion.path
            d="M0,80 C40,70 80,60 120,55 C160,50 200,40 240,30 C280,22 320,18 400,10"
            fill="none"
            stroke="hsl(260 100% 75%)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8 }}
          />
        </svg>
      </div>
    </motion.div>
  );
};

/* Scene 8 — Ecosystem */
const Scene8 = ({ scroll }: { scroll: MotionValue<number> }) => {
  const [s, e] = SCENE(7);
  const t = useSceneTransform(scroll, s, e);
  const learners = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        return { x: 50 + Math.cos(angle) * 32, y: 50 + Math.sin(angle) * 32 };
      }),
    []
  );
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity: t.opacity, filter: t.filter, scale: t.scale }}
    >
      <div className="absolute top-[12%] left-1/2 -translate-x-1/2 text-center">
        <h2 className="text-4xl md:text-6xl font-semibold text-white">
          You don't learn alone.
        </h2>
        <p className="mt-2 text-white/60">
          A network of learners, mentors, and projects — quietly connected.
        </p>
      </div>
      <div className="relative h-[560px] w-[560px]">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          {learners.map((a, i) =>
            learners.slice(i + 1).map((b, j) => (
              <motion.line
                key={`${i}-${j}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="hsl(240 100% 75% / 0.18)"
                strokeWidth="0.15"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (i + j) * 0.02, duration: 1 }}
              />
            ))
          )}
        </svg>
        {learners.map((n, i) => (
          <motion.div
            key={i}
            className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-gradient-to-br from-indigo-400/60 to-purple-600/60 backdrop-blur"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 200 }}
          />
        ))}
        <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl">
          <Users className="h-7 w-7 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

/* Scene 9 — Complete Ecosystem */
const Scene9 = ({ scroll }: { scroll: MotionValue<number> }) => {
  const [s, e] = SCENE(8);
  const t = useSceneTransform(scroll, s, e);
  const items = [
    { icon: Brain, label: "AI Engine" },
    { icon: Target, label: "Roadmaps" },
    { icon: Sparkles, label: "Recommendations" },
    { icon: BarChart3, label: "Analytics" },
    { icon: Users, label: "Community" },
    { icon: Zap, label: "Progress" },
  ];
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6"
      style={{ opacity: t.opacity, filter: t.filter, scale: t.scale }}
    >
      <h2 className="text-4xl md:text-6xl font-semibold text-white text-center">
        One learning
        <span className="bg-gradient-to-r from-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
          {" "}
          operating system.
        </span>
      </h2>
      <div className="relative mt-14 h-[420px] w-[420px]">
        {items.map((it, i) => {
          const angle = (i / items.length) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(angle) * 170;
          const y = Math.sin(angle) * 170;
          const Icon = it.icon;
          return (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl"
              style={{ x, y }}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
            >
              <Icon className="h-5 w-5 text-indigo-300" />
              <span className="text-[11px] text-white/80">{it.label}</span>
            </motion.div>
          );
        })}
        <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-indigo-500/40 to-purple-600/40 backdrop-blur-xl shadow-[0_0_80px_hsl(250_100%_60%/0.6)]">
          <span className="text-sm font-semibold text-white text-center">
            Skill-
            <br />
            Metrics
          </span>
        </div>
      </div>
    </motion.div>
  );
};

/* Scene 10 — CTA */
const Scene10 = ({ scroll }: { scroll: MotionValue<number> }) => {
  const [s, e] = SCENE(9);
  const t = useSceneTransform(scroll, s, e);
  const navigate = useNavigate();
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6"
      style={{ opacity: t.opacity, filter: t.filter }}
    >
      <motion.div
        className="scale-90 md:scale-100"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <DashboardMock tilt={0} />
      </motion.div>
      <div className="mt-10 text-center">
        <h2 className="text-4xl md:text-6xl font-semibold text-white">
          Learn with direction.
        </h2>
        <p className="mt-3 text-white/60">
          Your personal AI learning OS. Free to start.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            size="lg"
            className="group h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-7 text-base font-medium text-white shadow-[0_0_40px_hsl(250_100%_60%/0.5)] hover:shadow-[0_0_60px_hsl(250_100%_60%/0.7)]"
            onClick={() => navigate("/signup")}
          >
            Get started
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 rounded-full border-white/15 bg-white/5 px-6 text-white backdrop-blur hover:bg-white/10"
            onClick={() => navigate("/login")}
          >
            <Play className="mr-2 h-4 w-4" /> Sign in
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Top nav                                                             */
/* ------------------------------------------------------------------ */

const TopNav = () => {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled
          ? "border-b border-white/5 bg-black/50 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-indigo-500 to-purple-500" />
          <span className="text-sm font-semibold tracking-tight text-white">
            Skill-Metrics
          </span>
        </Link>
        <nav className="hidden gap-8 text-sm text-white/70 md:flex">
          <a href="#product" className="hover:text-white transition">
            Product
          </a>
          <a href="#ai" className="hover:text-white transition">
            AI Engine
          </a>
          <a href="#community" className="hover:text-white transition">
            Community
          </a>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Button
              asChild
              size="sm"
              className="rounded-full bg-white text-black hover:bg-white/90"
            >
              <Link to="/home">Open app</Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/5"
              >
                <Link to="/login">Sign in</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="rounded-full bg-white text-black hover:bg-white/90"
              >
                <Link to="/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

/* ------------------------------------------------------------------ */
/* Root                                                                */
/* ------------------------------------------------------------------ */

const Landing = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scroll = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  return (
    <div className="relative min-h-screen bg-[#05060d] text-white antialiased">
      <PageSEO
        title="Skill-Metrics — Learn with direction"
        description="A cinematic AI learning operating system: personalized roadmaps, curated resources, and real progress you can measure."
        path="/"
      />
      <AmbientBackdrop scroll={scroll} />
      <TopNav />

      {/* Scroll driver — 10 scenes × 100vh */}
      <div ref={ref} className="relative" style={{ height: `${SCENE_COUNT * 100}vh` }}>
        {/* Sticky stage — every scene renders here, blended via opacity */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <Particles count={50} />
          <Scene1 scroll={scroll} />
          <Scene2 scroll={scroll} />
          <Scene34 scroll={scroll} />
          <div id="product" />
          <Scene5 scroll={scroll} />
          <Scene6 scroll={scroll} />
          <Scene7 scroll={scroll} />
          <div id="community" />
          <Scene8 scroll={scroll} />
          <div id="ai" />
          <Scene9 scroll={scroll} />
          <Scene10 scroll={scroll} />

          {/* Scroll hint */}
          <motion.div
            className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          >
            scroll
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/5 bg-black/40 py-10 text-center text-xs text-white/40 backdrop-blur">
        © {new Date().getFullYear()} Skill-Metrics · Learn with direction
      </footer>
    </div>
  );
};

export default Landing;
