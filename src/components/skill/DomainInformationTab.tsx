import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  BookOpen, GraduationCap, PlayCircle, FileText, Wrench, Rocket,
  Award, Globe, Star, ExternalLink, ChevronLeft, ChevronRight,
  Sparkles, Layers, Compass,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { MLRecommendationsSection } from "@/components/recommendations/MLRecommendationsSection";

/* ────────────────────────────────────────────────────────────
 *  Domain meta → quick reference for the article header
 * ──────────────────────────────────────────────────────────── */
const DOMAIN_META: Record<
  string,
  { resourceDomain: string; tagline: string; about: string; highlights: string[] }
> = {
  "Machine Learning": {
    resourceDomain: "AI & Data",
    tagline: "Teach machines to learn from data, reason, and adapt.",
    about:
      "Machine Learning sits at the intersection of statistics, computer science, and domain expertise. You'll build models that recognize patterns, make predictions, and improve over time — powering everything from recommendation engines to autonomous systems.",
    highlights: ["Python & PyTorch", "Math foundations", "Model evaluation", "Production MLOps"],
  },
  "Data Science": {
    resourceDomain: "AI & Data",
    tagline: "Turn raw data into decisions, dashboards, and discoveries.",
    about:
      "Data Science combines statistics, programming, and storytelling. You'll explore datasets, design experiments, and surface insights that change how teams operate.",
    highlights: ["SQL & pandas", "Statistical thinking", "Visualization", "Experimentation"],
  },
  "Web Development": {
    resourceDomain: "Technology",
    tagline: "Build the products people use every day on the open web.",
    about:
      "Web Development spans the frontend interfaces users touch and the backend systems that power them. Modern stacks demand fluency in components, APIs, performance, and accessibility.",
    highlights: ["HTML / CSS / JS", "React & TypeScript", "APIs & databases", "Performance & a11y"],
  },
  "Cybersecurity": {
    resourceDomain: "Technology",
    tagline: "Defend systems, data, and people from evolving threats.",
    about:
      "Cybersecurity blends offensive and defensive thinking. You'll learn how attackers operate so you can architect resilient systems, harden infrastructure, and respond to incidents with confidence.",
    highlights: ["Networking", "Crypto basics", "Threat modeling", "Incident response"],
  },
  "Cloud Computing": {
    resourceDomain: "Technology",
    tagline: "Design elastic, reliable systems on the world's biggest platforms.",
    about:
      "Cloud Computing is how modern software is delivered. You'll work with compute, storage, networking, and managed services across AWS, Azure, and GCP — and the automation that ties them together.",
    highlights: ["IaaS & PaaS", "Containers & K8s", "IaC", "Cost & reliability"],
  },
  "GATE": {
    resourceDomain: "Exam Prep",
    tagline: "Crack the gateway to top engineering programs and PSUs.",
    about:
      "GATE tests deep conceptual understanding across engineering and CS topics. Success comes from structured revision, past-paper practice, and a strong grasp of fundamentals.",
    highlights: ["Subject mastery", "Mock tests", "PYQ analysis", "Time management"],
  },
  "CAT": {
    resourceDomain: "Exam Prep",
    tagline: "Earn your seat at India's premier business schools.",
    about:
      "CAT measures quantitative aptitude, verbal ability, and logical reasoning under tight time constraints. Smart preparation balances concept building with relentless mock practice.",
    highlights: ["QA", "VARC", "LRDI", "Mocks"],
  },
  "GRE": {
    resourceDomain: "Exam Prep",
    tagline: "Open doors to graduate programs worldwide.",
    about:
      "GRE is a globally accepted graduate admissions test. It rewards vocabulary depth, structured problem-solving, and analytical writing.",
    highlights: ["Vocab", "Quant", "AWA", "Practice tests"],
  },
  "JEE": {
    resourceDomain: "Exam Prep",
    tagline: "The pathway to India's top engineering institutes.",
    about:
      "JEE rewards strong Physics, Chemistry, and Maths foundations combined with high-volume problem-solving practice.",
    highlights: ["PCM mastery", "PYQ practice", "Mock series", "Conceptual depth"],
  },
  "NEET": {
    resourceDomain: "Exam Prep",
    tagline: "Step into India's premier medical colleges.",
    about:
      "NEET tests Biology, Chemistry, and Physics. A disciplined revision cycle and NCERT mastery are non-negotiable for top ranks.",
    highlights: ["NCERT focus", "Biology depth", "PYQ practice", "Mocks"],
  },
  "Finance": {
    resourceDomain: "Business & Finance",
    tagline: "Master money, markets, and the language of business.",
    about:
      "Finance covers personal money management, corporate finance, capital markets, and investment analysis. A blend of theory and practical tools unlocks real decision-making power.",
    highlights: ["Accounting basics", "Valuation", "Markets", "Portfolio theory"],
  },
  "Fine Arts": {
    resourceDomain: "Arts & Design",
    tagline: "Express ideas through form, color, and craft.",
    about:
      "Fine Arts is the practice of seeing and making. From classical fundamentals to contemporary mediums, you'll develop a personal voice grounded in technique.",
    highlights: ["Drawing", "Color", "Composition", "Critique"],
  },
  "Music": {
    resourceDomain: "Arts & Design",
    tagline: "Compose, perform, and produce with intention.",
    about:
      "Music spans theory, instrument practice, songwriting, and production. Modern musicians blend traditional craft with digital tools.",
    highlights: ["Theory", "Ear training", "Production", "Performance"],
  },
  "Photography": {
    resourceDomain: "Arts & Design",
    tagline: "Tell stories with light, time, and frame.",
    about:
      "Photography is technique plus vision. You'll master your camera, light, and editing — and the deeper craft of seeing.",
    highlights: ["Exposure", "Composition", "Lighting", "Post-processing"],
  },
  "Graphic Design": {
    resourceDomain: "Arts & Design",
    tagline: "Shape how people see, feel, and use information.",
    about:
      "Graphic Design covers typography, color, layout, branding, and digital product design. Great designers communicate clearly and beautifully.",
    highlights: ["Type & color", "Layout", "Brand systems", "UI / UX"],
  },
  "Computer Applications": {
    resourceDomain: "Technology",
    tagline: "Master the digital tools that power every modern workplace.",
    about:
      "Computer Applications covers everything from hardware basics and operating systems to office suites, databases, and IT support. It's the foundation for digital literacy and a gateway to deeper tech skills.",
    highlights: ["OS & file management", "Office suite", "Databases", "IT support"],
  },
  "Networking": {
    resourceDomain: "Technology",
    tagline: "Connect the world — one packet at a time.",
    about:
      "Networking is the backbone of the internet and every organization's IT infrastructure. You'll learn how data travels across networks, how to secure it, and how to build and maintain enterprise-grade systems.",
    highlights: ["TCP/IP & OSI", "Routing & switching", "Security", "Cloud networking"],
  },
  "Economics": {
    resourceDomain: "Business & Finance",
    tagline: "Understand the forces that shape markets, policy, and everyday life.",
    about:
      "Economics blends analytical thinking with real-world impact. From supply-demand curves to GDP and trade policy, you'll build the mental models to analyze decisions at every scale — personal, corporate, and national.",
    highlights: ["Micro & Macro", "Trade & policy", "Econometrics", "Behavioral econ"],
  },
  "Human Resources": {
    resourceDomain: "Business & Finance",
    tagline: "Build, develop, and retain the people who power organizations.",
    about:
      "Human Resources is where business strategy meets people management. You'll learn to recruit talent, design compensation systems, manage employee relations, and use analytics to drive workforce decisions.",
    highlights: ["Recruitment", "L&D", "Compensation", "HR analytics"],
  },
  "Education": {
    resourceDomain: "Humanities & Social Sciences",
    tagline: "Shape minds, design learning, and transform futures.",
    about:
      "Education is both an art and a science. You'll master pedagogy, classroom management, curriculum design, and educational technology — everything needed to be an effective educator in modern settings.",
    highlights: ["Pedagogy", "EdTech", "Curriculum", "Inclusive education"],
  },
  "Environmental Science": {
    resourceDomain: "General Studies",
    tagline: "Study Earth's systems and learn to protect them.",
    about:
      "Environmental Science integrates biology, chemistry, and policy to understand ecological systems, climate change, pollution, and conservation. It's where science meets sustainability.",
    highlights: ["Ecology", "Climate science", "Conservation", "EIA & policy"],
  },
  "Health & Fitness": {
    resourceDomain: "Health & Lifestyle",
    tagline: "Understand the human body and help people live better.",
    about:
      "Health & Fitness combines anatomy, nutrition science, exercise physiology, and coaching methodology. Whether you want to transform your own health or build a career in fitness, this path covers it all.",
    highlights: ["Anatomy", "Nutrition", "Training science", "Coaching"],
  },
  "Culinary Arts": {
    resourceDomain: "Arts & Design",
    tagline: "Turn ingredients into experiences — from kitchen basics to culinary mastery.",
    about:
      "Culinary Arts is technique, creativity, and science on a plate. You'll master knife skills, cooking methods, global cuisines, baking, and the business side of food — whether you're cooking at home or building a career.",
    highlights: ["Techniques", "World cuisines", "Baking & pastry", "Food business"],
  },
  "Interior Design": {
    resourceDomain: "Arts & Design",
    tagline: "Transform spaces into experiences that inspire and function.",
    about:
      "Interior Design blends aesthetics with functionality. You'll learn space planning, color theory, CAD visualization, and project management — creating environments that enhance how people live and work.",
    highlights: ["Space planning", "Materials", "CAD & 3D", "Residential & commercial"],
  },
  "Philosophy": {
    resourceDomain: "Humanities & Social Sciences",
    tagline: "Ask the deepest questions and sharpen your thinking.",
    about:
      "Philosophy trains you to think critically, argue precisely, and examine ideas that have shaped civilization. From ethics and logic to metaphysics, it builds intellectual foundations that apply everywhere.",
    highlights: ["Ethics", "Logic", "Political philosophy", "Metaphysics"],
  },
  "Political Science": {
    resourceDomain: "Humanities & Social Sciences",
    tagline: "Understand power, governance, and the systems that shape society.",
    about:
      "Political Science analyzes how political systems work — from local governance to international relations. You'll study constitutions, compare democracies, evaluate public policy, and understand India's place in global politics.",
    highlights: ["Political theory", "IR & diplomacy", "Indian polity", "Public policy"],
  },
  "Social Work": {
    resourceDomain: "Humanities & Social Sciences",
    tagline: "Empower individuals, strengthen communities, advance justice.",
    about:
      "Social Work is a profession rooted in empathy, ethics, and evidence. You'll learn assessment, counseling, community organizing, and policy advocacy — preparing to make real impact in people's lives.",
    highlights: ["Casework", "Community practice", "Clinical skills", "Policy advocacy"],
  },
};

const RESOURCE_TYPE_GROUPS: Array<{
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  types: string[];
}> = [
  { key: "degree", label: "Degrees", icon: GraduationCap, accent: "text-violet-500", types: ["degree"] },
  { key: "certification", label: "Certifications", icon: Award, accent: "text-emerald-500", types: ["certification"] },
  { key: "course", label: "Courses", icon: BookOpen, accent: "text-blue-500", types: ["course"] },
  { key: "video", label: "Videos", icon: PlayCircle, accent: "text-red-500", types: ["video", "youtube"] },
  { key: "blog", label: "Blogs & Papers", icon: FileText, accent: "text-cyan-500", types: ["blog", "paper", "research_paper", "documentation"] },
  { key: "book", label: "Books", icon: BookOpen, accent: "text-amber-500", types: ["book"] },
  { key: "tool", label: "Tools & Practice", icon: Wrench, accent: "text-teal-500", types: ["tool", "exam_prep"] },
  { key: "project", label: "Projects & Paths", icon: Rocket, accent: "text-pink-500", types: ["project", "learning_path", "website"] },
];

interface Props {
  graphDomain: string | null;
  query: string;
}

interface ResourceRow {
  id: string;
  title: string;
  description: string | null;
  link: string | null;
  resource_type: string | null;
  domain: string | null;
  subdomain: string | null;
  category: string | null;
  provider: string | null;
  is_free: boolean | null;
  difficulty: string | null;
  weighted_rating: number | null;
  avg_rating: number | null;
  rating: number | null;
  total_ratings: number | null;
}

function useDomainResources(graphDomain: string | null, query: string) {
  const resourceDomain = graphDomain ? DOMAIN_META[graphDomain]?.resourceDomain ?? null : null;

  return useQuery({
    queryKey: ["domain-resources", graphDomain, query, resourceDomain],
    queryFn: async () => {
      const q = query?.trim();
      let req = supabase
        .from("resources")
        .select(
          "id,title,description,link,resource_type,domain,subdomain,category,provider,is_free,difficulty,weighted_rating,avg_rating,rating,total_ratings",
        )
        .eq("is_active", true)
        .order("weighted_rating", { ascending: false, nullsFirst: false })
        .limit(400);

      // STRICT scoping: match the SPECIFIC subdomain/category, not the broad
      // domain bucket. e.g. for "GRE" we want only the 13 GRE rows, not all
      // ~180 Exam-Prep rows. The broad `resourceDomain` is only used as a
      // last-resort fallback when no query is provided.
      if (q) {
        const safe = q.replace(/[,()]/g, " ").trim();
        req = req.or(
          `subdomain.ilike.${safe},category.ilike.${safe},subdomain.ilike.%${safe}%,category.ilike.%${safe}%`,
        );
      } else if (resourceDomain) {
        req = req.eq("domain", resourceDomain);
      }

      const { data, error } = await req;
      if (error) throw error;
      return (data ?? []) as ResourceRow[];
    },
    staleTime: 60_000,
  });
}

export function DomainInformationTab({ graphDomain, query }: Props) {
  const meta = graphDomain ? DOMAIN_META[graphDomain] : undefined;
  const resourceDomain = meta?.resourceDomain ?? null;
  const { data: resources = [], isLoading } = useDomainResources(graphDomain, query);

  const grouped = useMemo(() => {
    const out: Record<string, ResourceRow[]> = {};
    for (const group of RESOURCE_TYPE_GROUPS) {
      out[group.key] = resources.filter(r =>
        group.types.includes((r.resource_type || "").toLowerCase()),
      );
    }
    return out;
  }, [resources]);

  const totalResources = resources.length;
  const freeCount = resources.filter(r => r.is_free).length;
  const avgRating =
    resources.length > 0
      ? resources.reduce(
          (sum, r) => sum + (Number(r.weighted_rating ?? r.avg_rating ?? r.rating ?? 0) || 0),
          0,
        ) / resources.length
      : 0;

  return (
    <div className="space-y-8">
      {/* ARTICLE-STYLE HERO */}
      <motion.article
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/5 via-background to-background"
      >
        <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative p-6 md:p-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary/80 mb-3">
            <Compass className="w-3.5 h-3.5" />
            Domain Overview
            {resourceDomain && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <Badge variant="outline" className="text-[10px]">{resourceDomain}</Badge>
              </>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            {query}
          </h1>

          {meta?.tagline && (
            <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-3xl font-medium">
              {meta.tagline}
            </p>
          )}

          {meta?.about ? (
            <p className="mt-5 text-[15px] leading-relaxed text-foreground/85 max-w-3xl">
              {meta.about}
            </p>
          ) : (
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground max-w-3xl">
              Explore curated resources for <span className="font-semibold text-foreground">{query}</span> — from foundations to advanced practice — handpicked from our library.
            </p>
          )}

          {/* Highlights */}
          {meta?.highlights && (
            <div className="flex flex-wrap gap-2 mt-6">
              {meta.highlights.map(h => (
                <Badge
                  key={h}
                  variant="secondary"
                  className="text-xs font-medium bg-primary/5 hover:bg-primary/10 border border-primary/15"
                >
                  {h}
                </Badge>
              ))}
            </div>
          )}

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 md:gap-6 mt-7 max-w-xl">
            <StatPill icon={<Layers className="w-4 h-4" />} value={totalResources} label="Resources" />
            <StatPill icon={<Globe className="w-4 h-4" />} value={freeCount} label="Free" />
            <StatPill icon={<Star className="w-4 h-4" />} value={avgRating ? avgRating.toFixed(1) : "—"} label="Avg rating" />
          </div>
        </div>
      </motion.article>

      {/* NETFLIX-STYLE ML RECOMMENDATION — scoped strictly to this domain */}
      <MLRecommendationsSection
        surface="skill"
        domain={query}
        query={query}
        limit={12}
        ignoreDomain={false}
        title="Recommended for you"
        subtitle={`Personalized via hybrid ML ranking — only from ${query} resources`}
        hideIfEmpty
      />

      {/* RESOURCE ROWS — Netflix-style horizontal rails */}
      <div className="space-y-7">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight">All resources in this domain</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Every curated resource we have for {query} — grouped by format. Scroll each row to browse.
            </p>
          </div>
          {!isLoading && (
            <Badge variant="outline" className="text-[10px]">{totalResources} total</Badge>
          )}
        </div>

        {!isLoading && totalResources > 0 && totalResources < 10 && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
            Low resource pool — only {totalResources} {totalResources === 1 ? "item" : "items"} curated for {query} so far. Showing all available.
          </div>
        )}

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-5 w-40" />
                <div className="flex gap-3 overflow-hidden">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="h-[170px] w-[280px] shrink-0 rounded-xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : totalResources === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-10 text-center">
              <Sparkles className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
              <h3 className="font-bold mb-1">No resources yet</h3>
              <p className="text-sm text-muted-foreground">
                Our team is curating resources for this domain. Check back soon.
              </p>
            </CardContent>
          </Card>
        ) : (
          RESOURCE_TYPE_GROUPS.map(group => {
            const items = grouped[group.key] || [];
            if (items.length === 0) return null;
            return (
              <ResourceRail
                key={group.key}
                label={group.label}
                Icon={group.icon}
                accent={group.accent}
                items={items}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
 *  Pieces
 * ──────────────────────────────────────────────────────────── */
function StatPill({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="text-xl font-black mt-0.5">{value}</div>
    </div>
  );
}

interface ResourceRailProps {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  accent: string;
  items: ResourceRow[];
}

function ResourceRail({ label, Icon, accent, items }: ResourceRailProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: "smooth" });
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Icon className={cn("w-5 h-5", accent)} />
          {label}
          <Badge variant="secondary" className="text-[10px]">{items.length}</Badge>
        </h3>
        <div className="hidden sm:flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => scrollBy(-1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => scrollBy(1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map(r => (
          <ResourceCard key={r.id} r={r} />
        ))}
      </div>
    </section>
  );
}

function ResourceCard({ r }: { r: ResourceRow }) {
  const rating = Number(r.weighted_rating ?? r.avg_rating ?? r.rating ?? 0);
  return (
    <a
      href={r.link || "#"}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "group snap-start shrink-0 w-[280px] md:w-[300px] rounded-xl border border-border/60 bg-card",
        "hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200",
        "flex flex-col overflow-hidden",
      )}
    >
      <div className="relative h-24 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent flex items-center justify-center">
        <span className="text-[11px] font-bold uppercase tracking-wider text-primary/80">
          {(r.resource_type || "resource").replace(/_/g, " ")}
        </span>
        {r.is_free && (
          <Badge className="absolute top-2 right-2 text-[9px] bg-emerald-500/15 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/15">
            Free
          </Badge>
        )}
      </div>
      <div className="flex-1 p-3.5 flex flex-col">
        <h4 className="font-bold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {r.title}
        </h4>
        {r.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5">{r.description}</p>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="truncate max-w-[60%] font-medium">{r.provider || r.subdomain || "—"}</span>
          <span className="flex items-center gap-2">
            {rating > 0 && (
              <span className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                {rating.toFixed(1)}
              </span>
            )}
            <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
          </span>
        </div>
      </div>
    </a>
  );
}
