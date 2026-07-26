import { useRef, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Compass,
  BrainCircuit,
  Network,
  LineChart,
  
  ShieldCheck,
  Twitter,
  Github,
  Linkedin,
} from "lucide-react";
import { PageSEO } from "@/components/PageSEO";

/* ══════════════════════════════════════════════════════════════════
   SKILL-METRICS · SCROLL-DRIVEN FRAME ANIMATION LANDING PAGE
   301 sequential frames rendered on canvas, synced 1:1 with scroll.
   Content is layered inside CLEAR ZONES so nothing collides with the
   rocket / person / flower / dashboard objects across all frames.
   ══════════════════════════════════════════════════════════════════ */

const TOTAL_FRAMES = 301;
const framePath = (index: number): string =>
  `/landing/frames/ezgif-frame-${String(index).padStart(3, "0")}.jpg`;

/* ─────────────────────────────────────────────
   Reusable motion presets
   ───────────────────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

/* ─────────────────────────────────────────────
   Glass panel wrapper
   ───────────────────────────────────────────── */
const Panel = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8 ${className}`}
    style={{
      boxShadow:
        "0 24px 60px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
    }}
  >
    {children}
  </div>
);

/* ─────────────────────────────────────────────
   Primary + ghost buttons
   ───────────────────────────────────────────── */
const PrimaryBtn = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <Link
    to={to}
    className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-all duration-300 hover:bg-white/90 hover:shadow-[0_0_40px_rgba(167,139,250,0.4)]"
  >
    {children}
    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
  </Link>
);

const GhostBtn = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <Link
    to={to}
    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white/90 backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/[0.08]"
  >
    {children}
  </Link>
);

/* ─────────────────────────────────────────────
   Skill-Metrics brand logo — matches the mark used
   across the app (Login, Signup, in-app header).
   ───────────────────────────────────────────── */
const BrandLogo = ({ size = "sm" }: { size?: "sm" | "md" }) => {
  const box = size === "md" ? "h-10 w-10" : "h-8 w-8";
  const text = size === "md" ? "text-base" : "text-sm";
  return (
    <span className="flex items-center gap-2">
      <img
        src={brandLogoImg}
        alt="Skill Metrics"
        className={`${box} rounded-lg object-cover shadow-[0_6px_20px_-6px_rgba(139,92,246,0.6)]`}
      />
      <span
        className={`${text} font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent`}
      >
        Skill-Metrics
      </span>
    </span>
  );
};

/* ─────────────────────────────────────────────
   Sticky top navigation
   ───────────────────────────────────────────── */
const TopNav = ({ scrolled }: { scrolled: boolean }) => (
  <header
    className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
      scrolled
        ? "border-b border-white/[0.06] bg-black/40 backdrop-blur-xl"
        : "bg-transparent"
    }`}
  >
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
      <Link to="/" aria-label="Skill-Metrics home">
        <BrandLogo />
      </Link>

      <div className="hidden items-center gap-8 md:flex">
        <a
          href="#features"
          className="text-sm text-white/60 transition hover:text-white"
        >
          Features
        </a>
        <a
          href="#how"
          className="text-sm text-white/60 transition hover:text-white"
        >
          How it works
        </a>
        <a
          href="#why"
          className="text-sm text-white/60 transition hover:text-white"
        >
          Why us
        </a>
        <Link
          to="/explore"
          className="text-sm text-white/60 transition hover:text-white"
        >
          Explore
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="hidden text-sm text-white/70 transition hover:text-white sm:inline"
        >
          Sign in
        </Link>
        <Link
          to="/signup"
          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90"
        >
          Get started
        </Link>
      </div>
    </nav>
  </header>
);

/* ─────────────────────────────────────────────
   Section shell — pins content to the clear zone of a given
   scroll phase. Each phase is one viewport tall.
   Positions available: "bottom", "left", "right", "top", "split"
   ───────────────────────────────────────────── */
type Zone = "bottom" | "left" | "right" | "top" | "center";

const Scene = ({
  children,
  zone,
  label,
  id,
}: {
  children: React.ReactNode;
  zone: Zone;
  label?: string;
  id?: string;
}) => {
  const positionClass: Record<Zone, string> = {
    bottom: "items-end justify-center pb-16 sm:pb-24",
    top: "items-start justify-center pt-28",
    left: "items-center justify-start pl-6 sm:pl-16",
    right: "items-center justify-end pr-6 sm:pr-16",
    center: "items-center justify-center",
  };

  return (
    <section
      id={id}
      className={`relative flex h-screen w-full ${positionClass[zone]}`}
      aria-label={label}
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.4 }}
        className="w-full max-w-[560px]"
      >
        {children}
      </motion.div>
    </section>
  );
};

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <motion.div variants={fadeUp}>
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/70 backdrop-blur">
      <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
      {children}
    </span>
  </motion.div>
);

const Heading = ({ children }: { children: React.ReactNode }) => (
  <motion.h2
    variants={fadeUp}
    className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl"
  >
    {children}
  </motion.h2>
);

const Sub = ({ children }: { children: React.ReactNode }) => (
  <motion.p
    variants={fadeUp}
    className="mt-5 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg"
  >
    {children}
  </motion.p>
);

/* ─────────────────────────────────────────────
   Feature card
   ───────────────────────────────────────────── */
const Feature = ({
  icon: Icon,
  title,
  copy,
}: {
  icon: typeof Sparkles;
  title: string;
  copy: string;
}) => (
  <motion.div variants={fadeUp}>
    <Panel className="h-full">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/30 to-indigo-500/30 ring-1 ring-white/10">
        <Icon className="h-4 w-4 text-white" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/55">{copy}</p>
    </Panel>
  </motion.div>
);

/* ══════════════════════════════════════════════════════════════════
   Landing
   ══════════════════════════════════════════════════════════════════ */
const Landing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* ── Preload frames ── */
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    const onLoad = () => {
      loadedCount++;
      setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
      if (loadedCount === TOTAL_FRAMES) {
        imagesRef.current = images;
        setIsLoaded(true);
        renderFrame(0);
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = framePath(i + 1);
      img.onload = onLoad;
      img.onerror = onLoad;
      images[i] = img;
    }

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ── Draw frame (cover-fit) ── */
  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imagesRef.current[index];
    if (!canvas || !ctx || !img) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;
    let drawW: number, drawH: number, drawX: number, drawY: number;

    if (imgRatio > canvasRatio) {
      drawH = h;
      drawW = h * imgRatio;
      drawX = (w - drawW) / 2;
      drawY = 0;
    } else {
      drawW = w;
      drawH = w / imgRatio;
      drawX = 0;
      drawY = (h - drawH) / 2;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  /* ── Scroll → frame + header state ── */
  useEffect(() => {
    if (!isLoaded) return;

    const handleScroll = () => {
      const main = mainRef.current;
      if (!main) return;

      const scrollTop = window.scrollY;
      setScrolled(scrollTop > 20);

      // Progress is measured only over the scenes area so the final laptop
      // frame stays fully visible before the footer scrolls into view.
      const maxScroll = Math.max(main.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
      const targetFrame = Math.min(
        Math.round(progress * (TOTAL_FRAMES - 1)),
        TOTAL_FRAMES - 1
      );

      if (targetFrame !== frameIndexRef.current) {
        frameIndexRef.current = targetFrame;
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => renderFrame(targetFrame));
      }
    };

    const handleResize = () => renderFrame(frameIndexRef.current);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isLoaded, renderFrame]);

  /* ── landing-root class ── */
  useEffect(() => {
    document.documentElement.classList.add("landing-root");
    return () => document.documentElement.classList.remove("landing-root");
  }, []);

  return (
    <div ref={containerRef} className="relative bg-[#050510] text-white">
      <PageSEO
        title="Skill-Metrics — AI-Powered Learning Operating System"
        description="Transform information overload into structured mastery. Personalized AI roadmaps, curated resources, and a cinematic learning journey across every domain."
        path="/"
      />

      {/* ── Loading overlay ── */}
      {!isLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050510]">
          <div className="relative h-1 w-64 overflow-hidden rounded-full bg-white/10">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-200 ease-out"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <p className="mt-4 text-xs font-medium uppercase tracking-widest text-white/40">
            Loading experience · {loadProgress}%
          </p>
        </div>
      )}

      {/* ── Fixed canvas ── */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 h-screen w-screen"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      />

      {/* ── Sticky vignette to boost text contrast without hiding art ── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      <TopNav scrolled={scrolled} />

      {/* ══════════════════════════════════════════
          Content layer — 6 scenes × 100vh = 600vh.
          Position tuned to each frame phase's clear zone.
          ══════════════════════════════════════════ */}
      <main ref={mainRef} className="relative z-10">
        {/* Scene 1 — Frames 1-60 · Rocket TOP-CENTER · CLEAR ZONE: bottom */}
        <Scene zone="bottom" label="Hero" id="hero">
          <div className="text-center">
            <Eyebrow>The Learning Operating System</Eyebrow>
            <motion.h1
              variants={fadeUp}
              className="mx-auto mt-6 max-w-3xl text-balance text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl"
            >
              Launch your{" "}
              <span className="bg-gradient-to-r from-violet-300 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                curiosity
              </span>{" "}
              into mastery.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg"
            >
              AI-generated roadmaps, hand-curated resources, and a
              cinematic learning journey — for every domain, every learner.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="mt-9 flex flex-wrap items-center justify-center gap-3"
            >
              <PrimaryBtn to="/signup">Start free</PrimaryBtn>
              <GhostBtn to="/explore">Explore the library</GhostBtn>
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="mt-10 text-xs uppercase tracking-[0.3em] text-white/30"
            >
              Scroll to begin the journey
            </motion.p>
          </div>
        </Scene>

        {/* Scene 2 — Frames ~60-120 · Rocket center rising · CLEAR: left */}
        <Scene zone="left" label="Platform overview">
          <Eyebrow>The Platform</Eyebrow>
          <Heading>
            One home for every
            <br />
            skill you'll ever chase.
          </Heading>
          <Sub>
            Skill-Metrics unifies tech, arts, finance, sciences and beyond into
            a single, structured operating system for lifelong learners.
            Personal, precise, and beautifully organised.
          </Sub>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-2">
            {[
              "AI Roadmaps",
              "Curated Resources",
              "Skill Graph",
              "Video Hub",
              "Community",
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/70 backdrop-blur"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </Scene>

        {/* Scene 3 — Frames ~120-180 · Rocket in clouds · CLEAR: right */}
        <Scene zone="right" label="Key features" id="features">
          <Eyebrow>Key Features</Eyebrow>
          <Heading>Built for depth,
            <br />designed for flow.</Heading>
          <motion.div
            variants={stagger}
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <Feature
              icon={BrainCircuit}
              title="AI-Generated Roadmaps"
              copy="Gemini crafts step-by-step paths from your goal and skill level."
            />
            <Feature
              icon={Network}
              title="Skill Graph"
              copy="Every skill mapped to its prerequisites — never learn in the wrong order."
            />
            <Feature
              icon={Compass}
              title="Hand-Curated Library"
              copy="Admin-vetted resources across degrees, certs, blogs, videos & more."
            />
            <Feature
              icon={LineChart}
              title="Hybrid Recommender"
              copy="Content + collaborative + freshness signals, personalised to you."
            />
          </motion.div>
        </Scene>

        {/* Scene 4 — Frames ~180-240 · Person appearing LEFT · CLEAR: right */}
        <Scene zone="right" label="How it works" id="how">
          <Eyebrow>How It Works</Eyebrow>
          <Heading>Three steps from
            <br />intent to mastery.</Heading>
          <motion.ol variants={stagger} className="mt-8 space-y-4">
            {[
              {
                n: "01",
                t: "Tell us your goal",
                d: "Pick a domain, drop a skill, or paste an exam name.",
              },
              {
                n: "02",
                t: "Get your personal roadmap",
                d: "AI builds the path; our library fills each step with vetted resources.",
              },
              {
                n: "03",
                t: "Learn, track, level up",
                d: "Streaks, focus sessions, and a growing skill graph track real progress.",
              },
            ].map((s) => (
              <motion.li key={s.n} variants={fadeUp}>
                <Panel className="!p-5">
                  <div className="flex items-start gap-4">
                    <span className="text-xs font-mono text-violet-300/80">
                      {s.n}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {s.t}
                      </h4>
                      <p className="mt-1 text-sm text-white/55">{s.d}</p>
                    </div>
                  </div>
                </Panel>
              </motion.li>
            ))}
          </motion.ol>
        </Scene>

        {/* Scene 5 — Frames ~240-280 · Person + flowers left, dashboards right · CLEAR: top */}
        <Scene zone="top" label="Why choose us" id="why">
          <div className="text-center">
            <Eyebrow>Why Skill-Metrics</Eyebrow>
            <Heading>The internet gave us information.
              <br />We give you a path.</Heading>
          </div>
          <motion.div
            variants={stagger}
            className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {[
              { k: "895+", v: "Curated resources" },
              { k: "8", v: "Domains covered" },
              { k: "AI", v: "Roadmap engine" },
              { k: "100%", v: "Admin-vetted" },
            ].map((s) => (
              <motion.div key={s.v} variants={fadeUp}>
                <Panel className="!p-4 text-center">
                  <div className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-2xl font-semibold text-transparent">
                    {s.k}
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-wider text-white/50">
                    {s.v}
                  </div>
                </Panel>
              </motion.div>
            ))}
          </motion.div>
        </Scene>

        {/* Scene 6 — Frames ~280-301 · Product monitor scene · CLEAR: top + bottom (center busy) */}
        <Scene zone="top" label="Call to action" id="cta">
          <div className="text-center">
            <Eyebrow>Ready when you are</Eyebrow>
            <Heading>Your first roadmap is
              <br />sixty seconds away.</Heading>
            <Sub>
              Free forever for learners. Sign in, tell us what you want to
              master, and watch your path bloom.
            </Sub>
            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <PrimaryBtn to="/signup">Create your account</PrimaryBtn>
              <GhostBtn to="/explore">Browse resources</GhostBtn>
            </motion.div>
          </div>
        </Scene>

        {/* Final reveal — empty spacer viewport so the last laptop-on-desk
            frame is visible in full before the footer scrolls into view. */}
        <section
          aria-hidden
          className="relative h-screen w-full"
        />
      </main>

      {/* ── Footer (below the pinned animation range) ── */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-[#050510]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            <div className="col-span-2">
              <BrandLogo size="md" />
              <p className="mt-4 max-w-sm text-sm text-white/50">
                An AI-powered learning operating system for lifelong learners
                across tech, arts, finance, and sciences.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="rounded-full border border-white/10 p-2 text-white/60 transition hover:border-white/30 hover:text-white"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="rounded-full border border-white/10 p-2 text-white/60 transition hover:border-white/30 hover:text-white"
                >
                  <Github className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="rounded-full border border-white/10 p-2 text-white/60 transition hover:border-white/30 hover:text-white"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Product
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>
                  <Link to="/explore" className="hover:text-white">
                    Explore
                  </Link>
                </li>
                <li>
                  <Link to="/roadmaps" className="hover:text-white">
                    Roadmaps
                  </Link>
                </li>
                <li>
                  <Link to="/new-videos" className="hover:text-white">
                    New videos
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="hover:text-white">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Account
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>
                  <Link to="/login" className="hover:text-white">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-white">
                    Sign up
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} Skill-Metrics. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-white/40">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Privacy-first · Admin-vetted</span>
              <Link
                to="/admin/login"
                className="ml-2 rounded-md border border-white/10 px-2.5 py-1 text-white/40 transition hover:border-white/25 hover:text-white/70"
              >
                Admin login
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
