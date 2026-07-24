import { useRef, useEffect, useState, useCallback } from "react";
import { PageSEO } from "@/components/PageSEO";

/* ══════════════════════════════════════════════════════════════════
   SKILL-METRICS · SCROLL-DRIVEN FRAME ANIMATION LANDING PAGE
   301 sequential frames rendered on canvas, synced 1:1 with scroll.
   ══════════════════════════════════════════════════════════════════ */

const TOTAL_FRAMES = 301;

/** Build the public path for a given frame index (1-based) */
const framePath = (index: number): string => {
  const padded = String(index).padStart(3, "0");
  return `/landing/frames/ezgif-frame-${padded}.jpg`;
};

const Landing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  /* ── Preload all frames ── */
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    const onLoad = () => {
      loadedCount++;
      setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
      if (loadedCount === TOTAL_FRAMES) {
        imagesRef.current = images;
        setIsLoaded(true);
        // Paint the first frame immediately once all are loaded
        renderFrame(0);
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = framePath(i + 1);
      img.onload = onLoad;
      img.onerror = onLoad; // count errors so we don't stall
      images[i] = img;
    }

    return () => {
      // Cleanup: cancel any pending RAF
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ── Draw a specific frame on the canvas (cover-fit) ── */
  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imagesRef.current[index];
    if (!canvas || !ctx || !img) return;

    // Size canvas to viewport
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // "object-fit: cover" math
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;
    let drawW: number, drawH: number, drawX: number, drawY: number;

    if (imgRatio > canvasRatio) {
      // Image is wider → fit height, crop sides
      drawH = h;
      drawW = h * imgRatio;
      drawX = (w - drawW) / 2;
      drawY = 0;
    } else {
      // Image is taller → fit width, crop top/bottom
      drawW = w;
      drawH = w / imgRatio;
      drawX = 0;
      drawY = (h - drawH) / 2;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  /* ── Scroll → frame index mapping with rAF rendering ── */
  useEffect(() => {
    if (!isLoaded) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      // Calculate scroll progress (0 → 1)
      const scrollTop = window.scrollY;
      const maxScroll = container.scrollHeight - window.innerHeight;
      const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);

      // Map progress to frame index
      const targetFrame = Math.min(
        Math.round(progress * (TOTAL_FRAMES - 1)),
        TOTAL_FRAMES - 1
      );

      // Only re-render if the frame actually changed
      if (targetFrame !== frameIndexRef.current) {
        frameIndexRef.current = targetFrame;
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => renderFrame(targetFrame));
      }
    };

    // Also handle resize (re-draw current frame at new canvas size)
    const handleResize = () => {
      renderFrame(frameIndexRef.current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    // Initial render
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isLoaded, renderFrame]);

  /* ── Add/remove landing-root class on html ── */
  useEffect(() => {
    document.documentElement.classList.add("landing-root");
    return () => {
      document.documentElement.classList.remove("landing-root");
    };
  }, []);

  return (
    <div ref={containerRef} className="relative bg-[#050510]">
      <PageSEO
        title="Skill-Metrics — AI-Powered Learning Operating System"
        description="Transform information overload into structured mastery with AI-powered personalized learning roadmaps."
        path="/"
      />

      {/* ── Loading Indicator ── */}
      {!isLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050510]">
          <div className="relative h-1 w-64 overflow-hidden rounded-full bg-white/10">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-200 ease-out"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <p className="mt-4 text-xs font-medium tracking-widest text-white/40 uppercase">
            Loading experience · {loadProgress}%
          </p>
        </div>
      )}

      {/* ── Fixed Fullscreen Canvas ── */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 h-screen w-screen"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      />

      {/* ── Scroll Spacer (602vh so 301 frames have enough scroll range) ── */}
      <div className="relative z-10" style={{ height: "602vh" }} />
    </div>
  );
};

export default Landing;
