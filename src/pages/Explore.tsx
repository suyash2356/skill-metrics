// src/pages/Explore.tsx
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Brain,
  Cloud,
  Database,
  Globe,
  Shield,
  TrendingUp,
  Zap,
  Laptop,
  Layers,
  Rocket,
  Award,
  Map,
  GraduationCap,
  Code,
  PenTool,
  MessageSquare,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { motion } from "framer-motion";
import { fetchExploreSuggestions } from "@/api/searchAPI";
import { debounce } from "lodash";

function Explore() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchSuggestions = debounce(async (q: string) => {
    if (!q) return setSuggestions([]);
    try {
      const res = await fetchExploreSuggestions(q, 8);
      setSuggestions(res);
    } catch (e) {
      setSuggestions([]);
    }
  }, 200);
  // activeTab state is only used to reflect current tab; Tabs component handles visuals
  const [activeTab, setActiveTab] = useState("popular");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // if the user typed and pressed Enter, prefer to navigate to search with scope=explore
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}&scope=explore`);
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/search?q=${encodeURIComponent(category)}&scope=explore`);
  };

  // Animated title words
  const rotatingWords = [
    "AI & Machine Learning",
    "Cybersecurity",
    "Cloud Computing",
    "Blockchain",
    "Data Science",
    "Software Development",
  ];

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedDegree, setSelectedDegree] = useState<any | null>(null);
  const [selectedPath, setSelectedPath] = useState<any | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Explore Top Learning Resources
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover trending skills, domains, and career paths with the most popular and useful learning
            materials on the web.
          </p>

          {/* Dynamic rotating text */}
          <div className="mt-6">
            <span className="text-xl font-semibold text-indigo-600 transition-all duration-500">
              {rotatingWords[currentWordIndex]}
            </span>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-8 flex justify-center max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Search skills, exams, or topics..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); fetchSuggestions(e.target.value); setShowSuggestions(true); }}
              className="rounded-l-lg border border-gray-300 focus-visible:ring-indigo-500"
            />
            <Button
              type="submit"
              className="rounded-l-none bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Search
            </Button>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute mt-12 bg-card border rounded-md shadow z-50 w-full max-w-md">
                {suggestions.map((s: any, idx: number) => (
                  <button key={`exp-${idx}`} className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-3"
                    onMouseDown={(ev) => { ev.preventDefault();
                      // If the suggestion includes an external link, open it directly
                      if (s.link) {
                        window.open(s.link, '_blank');
                      } else if (s.kind === 'skill') {
                        navigate(`/skills/${encodeURIComponent(s.name)}`);
                      } else if (s.kind === 'explore') {
                        navigate(`/search?q=${encodeURIComponent(s.name)}&scope=explore`);
                      }
                      setShowSuggestions(false);
                    }}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{s.name}</div>
                      {s.description && <div className="text-xs text-muted-foreground mt-0.5">{s.description}</div>}
                      {!s.description && <div className="text-xs text-muted-foreground mt-0.5">{s.kind}</div>}
                    </div>
                    {s.link && <div className="text-xs text-primary">External</div>}
                  </button>
                ))}
              </div>
            )}
          </form>
        </section>

        {/* Tabs for Explore Sections */}
        <Tabs defaultValue="popular" onValueChange={(v) => setActiveTab(v)} className="space-y-8">
          <TabsList className="flex justify-center bg-transparent gap-2">
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="categories">Degrees</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="learning">Learning Paths</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

         {/* === Popular Categories Section === */}
<TabsContent value="popular">
  <section>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-indigo-500" />
        Popular Categories
      </h2>
    </div>

    <Swiper
      modules={[Autoplay]}
      autoplay={{
        delay: 2200,
        disableOnInteraction: false,
      }}
      loop={true}
      spaceBetween={24}
      slidesPerView={1.2}
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1280: { slidesPerView: 4 },
      }}
      className="pb-8"
    >
      {[
        {
          title: "Artificial Intelligence",
          icon: Brain,
          color: "from-indigo-500 to-purple-500",
          description: "Learn modern AI tools, ML algorithms, and neural networks.",
          link: "https://www.cs.toronto.edu/~hinton/absps/NatureDeepReview.pdf", // Deep Learning (Nature review)
        },
        {
          title: "Data Science",
          icon: Database,
          color: "from-blue-500 to-cyan-500",
          description: "Analyze data, visualize insights, and build predictive models.",
          link: "https://courses.csail.mit.edu/18.337/2015/docs/50YearsDataScience.pdf", // Donoho: 50 Years of Data Science
        },
        {
          title: "Cloud Computing",
          icon: Cloud,
          color: "from-sky-500 to-indigo-500",
          description: "Master AWS, Azure, and Google Cloud to scale systems globally.",
          link: "https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-145.pdf", // NIST SP 800-145
        },
        {
          title: "Cybersecurity",
          icon: Shield,
          color: "from-rose-500 to-red-500",
          description: "Protect data and networks using ethical hacking and security tools.",
          link: "https://www.cl.cam.ac.uk/teaching/1011/R01/75-protection.pdf", // Saltzer & Schroeder principles
        },
        {
          title: "Blockchain",
          icon: Layers,
          color: "from-amber-500 to-orange-500",
          description: "Dive into Web3, smart contracts, and decentralized finance.",
          link: "https://bitcoin.org/bitcoin.pdf", // Bitcoin whitepaper
        },
        {
          title: "DevOps",
          icon: Zap,
          color: "from-green-500 to-emerald-500",
          description: "Automate deployments, CI/CD pipelines, and Kubernetes clusters.",
          link: "https://services.google.com/fh/files/misc/2024_final_dora_report.pdf", // DORA 2024 (PDF)
        },
        {
          title: "Software Development",
          icon: Laptop,
          color: "from-purple-600 to-pink-500",
          description: "Build modern apps with React, Node.js, and full-stack tools.",
          link: "https://www.cs.unc.edu/techreports/86-020.pdf", // Brooks: No Silver Bullet
        },
        {
          title: "Product Management",
          icon: Rocket,
          color: "from-indigo-600 to-sky-500",
          description: "Learn agile strategy, user research, and product execution.",
          link: "https://theengineer.markallengroup.com/production/content/uploads/2015/11/Idea-to-Launch-Stage-Gate-Model.pdf", // Stage‑Gate overview
        },
      ].map((category, idx) => (
        <SwiperSlide key={idx}>
          <Card
            onClick={() => {
              if ((category as any).link) window.open((category as any).link, '_blank');
              else handleCategoryClick(category.title);
            }}
            className="group cursor-pointer overflow-hidden bg-gradient-to-br from-background to-muted border-0 shadow-md hover:shadow-xl transition-all duration-500"
          >
            <CardHeader className="flex items-center gap-3">
              <div
                className={`p-3 rounded-full bg-gradient-to-r ${category.color} text-white shadow-lg`}
              >
                <category.icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg font-bold">{category.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">{category.description}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  if ((category as any).link) window.open((category as any).link, '_blank');
                  else handleCategoryClick(category.title);
                }}
              >
                Explore
              </Button>
            </CardContent>
          </Card>
        </SwiperSlide>
      ))}
    </Swiper>

    {/* Popular Non-Tech Fields: moving opposite direction */}
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Popular Non-Tech Fields</h3>
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 2200,
          disableOnInteraction: false,
          reverseDirection: true,
        }}
        loop={true}
        spaceBetween={20}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="pb-6"
      >
        {[
          {
            title: 'Design',
            icon: PenTool,
            color: 'from-pink-500 to-rose-500',
            description: 'UI/UX, visual design and product aesthetics.',
            link: 'https://dl.acm.org/doi/pdf/10.1145/97243.97281', // Nielsen & Molich 1990
          },
          {
            title: 'Business & Management',
            icon: Map,
            color: 'from-indigo-500 to-sky-500',
            description: 'Strategy, operations, and leadership skills.',
            link: 'https://www.sfu.ca/~wainwrig/Econ400/jensen-meckling.pdf', // Jensen & Meckling 1976
          },
          {
            title: 'Creative Writing',
            icon: BookOpen,
            color: 'from-amber-500 to-orange-500',
            description: 'Storytelling, content creation and editing.',
            link: 'https://jonahberger.com/wp-content/uploads/2013/02/ViralityB.pdf', // Writing for virality insights
          },
          {
            title: 'Marketing',
            icon: TrendingUp,
            color: 'from-green-500 to-emerald-500',
            description: 'Digital marketing, branding and growth tactics.',
            link: 'https://jonahberger.com/wp-content/uploads/2013/02/ViralityB.pdf', // Berger & Milkman 2012
          },
          {
            title: 'Photography',
            icon: Globe,
            color: 'from-violet-500 to-purple-500',
            description: 'Capture, edit and present compelling images.',
            link: 'https://arxiv.org/abs/1610.00838', // Image Aesthetic Assessment survey
          },
        ].map((category, idx) => (
          <SwiperSlide key={`nontech-${idx}`}>
            <Card
              onClick={() => {
                if (category.link) window.open(category.link, '_blank');
                else handleCategoryClick(category.title);
              }}
              className="group cursor-pointer overflow-hidden bg-gradient-to-br from-background to-muted border-0 shadow-md hover:shadow-xl transition-all duration-500"
            >
              <CardHeader className="flex items-center gap-3">
                <div className={`p-3 rounded-full bg-gradient-to-r ${category.color} text-white shadow-lg`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-bold">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{category.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors"
                  onClick={(e) => { e.stopPropagation(); if (category.link) window.open(category.link, '_blank'); else handleCategoryClick(category.title); }}
                >
                  Explore
                </Button>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>

    {/* Popular Exams: opposite of non-tech (so same direction as tech) */}
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Popular Exams</h3>
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 2200,
          disableOnInteraction: false,
          reverseDirection: false,
        }}
        loop={true}
        spaceBetween={20}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="pb-6"
      >
        {[
          { title: 'GRE', icon: GraduationCap, color: 'from-indigo-500 to-blue-500', description: 'Graduate record examinations prep.', link: 'https://www.in.ets.org/gre/test-takers/general-test/about.html' },
          { title: 'GMAT', icon: GraduationCap, color: 'from-green-500 to-emerald-500', description: 'Business school entrance test prep.', link: 'https://www.mba.com/exams/gmat-exam' },
          { title: 'CAT', icon: GraduationCap, color: 'from-rose-500 to-red-500', description: 'Management entrance exam prep.', link: 'https://iimcat.ac.in' },
          { title: 'JEE', icon: GraduationCap, color: 'from-yellow-500 to-amber-500', description: 'Engineering entrance exam prep.', link: 'https://jeemain.nta.nic.in' },
          { title: 'NEET', icon: GraduationCap, color: 'from-pink-500 to-purple-500', description: 'Medical entrance exam prep.', link: 'https://neet.nta.nic.in' },
        ].map((exam, idx) => (
          <SwiperSlide key={`exam-${idx}`}>
            <Card
              onClick={() => { if (exam.link) window.open(exam.link, '_blank'); else handleCategoryClick(exam.title); }}
              className="group cursor-pointer overflow-hidden bg-gradient-to-br from-background to-muted border-0 shadow-md hover:shadow-xl transition-all duration-500"
            >
              <CardHeader className="flex items-center gap-3">
                <div className={`p-3 rounded-full bg-gradient-to-r ${exam.color} text-white shadow-lg`}>
                  <exam.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-bold">{exam.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{exam.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors"
                  onClick={(e) => { e.stopPropagation(); if (exam.link) window.open(exam.link, '_blank'); else handleCategoryClick(exam.title); }}
                >
                  Explore
                </Button>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </section>
</TabsContent>


{/* === Degrees Section (replaces Categories) === */}
<TabsContent value="categories">
  <section>
    <h2 className="text-2xl font-bold mb-4">Top Degrees</h2>
    <p className="text-sm text-muted-foreground mb-6">
      Explore top university degrees (online & offline) — compare fees, duration, rating and what you'll learn.
    </p>

    {/* Ensure in your component scope: const [selectedDegree, setSelectedDegree] = useState<any | null>(null); */}

    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[
        // TECH (authoritative program links and realistic year-by-year timelines)
        {
          title: "MS in Computer Science",
          university: "Stanford University",
          mode: "offline",
          fees: "See official tuition page",
          rating: "4.6/5",
          duration: "≈ 1.5–2 years (45 units)",
          link: "https://www.cs.stanford.edu/masters-program-overview",
          exam: "See admissions; GRE policy varies",
          timeline: [
            { label: "Year 1", items: ["Graduate core in chosen track (e.g., AI/HCI/Systems/Theory)", "Mathematical foundations and algorithms", "Approved program-sheet coursework"] },
            { label: "Year 2", items: ["Advanced electives and specialization depth", "Project or research-oriented courses (if chosen)", "Complete 45 units and graduation requirements"] },
          ],
          about: "Highly selective on-campus MS with track-based planning via official program sheets and a 45-unit requirement.",
          sources: ["Stanford CS MS overview"],
        }, // [web:262][web:267][web:269]

        {
          title: "OMSCS (MS in Computer Science, Online)",
          university: "Georgia Tech",
          mode: "online",
          fees: "Per‑credit e‑tuition; total varies",
          rating: "4.5/5",
          duration: "Self‑paced (30 credit hours)",
          link: "https://omscs.gatech.edu/cost-and-payment-schedule",
          exam: "See OMSCS admissions (no universal test)",
          timeline: [
            { label: "Year 1", items: ["3–4 graduate CS courses (AI/ML/Systems per interest)", "Balance with work; plan per-credit tuition", "Foundations toward specialization"] },
            { label: "Year 2", items: ["Advanced electives in specialization", "Cap remaining credits to reach 30 hours", "Apply to graduate upon completion"] },
          ],
          about: "Large‑scale, affordable online MSCS with flexible pacing and specializations; costs linked to per‑credit e‑tuition.",
          sources: ["OMSCS cost & FAQs"],
        }, // [web:255][web:258][web:295]

        {
          title: "BS in Data Science and Applications",
          university: "IIT Madras",
          mode: "blended (online content + in‑person assessments)",
          fees: "Varies by level; waivers available",
          rating: "4.4/5",
          duration: "Flexible multi‑exit up to 4 years",
          link: "https://onlinedegree.iitm.ac.in",
          exam: "Qualifier route or JEE Main direct pathway",
          timeline: [
            { label: "Year 1", items: ["Foundation: math, statistics, programming, English", "Weekly online assignments; in‑person quizzes"] },
            { label: "Year 2", items: ["Diploma in Data Science: ML foundations, SQL/DB", "Visualization, business data management"] },
            { label: "Year 3", items: ["Diploma/BS courses: deep learning, big data", "Projects; industry‑aligned coursework"] },
            { label: "Year 4", items: ["BS electives, RL/CV/LLMs as available", "Capstone and advanced applications"] },
          ],
          about: "Modular degree with Foundation → Diploma → BS progression, online learning plus in‑person proctored assessments.",
          sources: ["IITM Online Degree portal"],
        }, // [web:250][web:251]

        // NON‑TECH
        {
          title: "MBA (PGP)",
          university: "IIM Ahmedabad",
          mode: "offline (residential)",
          fees: "As per latest institute notification",
          rating: "4.7",
          duration: "2 years",
          link: "https://www.iima.ac.in/academics/mba",
          exam: "CAT (India) + institute selection process",
          timeline: [
            { label: "Year 1", items: ["Core courses across all management functions", "Case‑method pedagogy and projects"] },
            { label: "Year 2", items: ["Electives to specialize (e.g., Strategy/Finance/Marketing)", "Industry projects and exchange options"] },
          ],
          about: "Flagship two‑year MBA with case‑based learning and broad elective depth in Year 2.",
          sources: ["IIMA MBA program page"],
        }, // [web:273]

        {
          title: "MBBS",
          university: "AIIMS New Delhi",
          mode: "offline",
          fees: "Nominal govt. fee (see prospectus)",
          rating: "4.8/5",
          duration: "5.5 years (incl. 1‑year internship)",
          link: "https://docs.aiimsexams.ac.in/sites/Prospectus_1.pdf",
          exam: "NEET UG",
          timeline: [
            { label: "Year 1", items: ["Pre‑clinical: Anatomy, Physiology, Biochemistry"] },
            { label: "Year 2", items: ["Para‑clinical: Pathology, Microbiology, Pharmacology, Forensic"] },
            { label: "Years 3–4.5", items: ["Clinical postings: Medicine, Surgery, OB‑GYN, Pediatrics, etc."] },
            { label: "Final 1 year", items: ["Rotating internship across specialties"] },
          ],
          about: "Premier undergraduate medical degree with competency‑based curriculum and extensive clinical exposure.",
          sources: ["AIIMS MBBS prospectus"],
        }, // [web:281]

        {
          title: "B.Des (Bachelor of Design)",
          university: "National Institute of Design (NID)",
          mode: "offline",
          fees: "As per NID notification",
          rating: "4.2/5",
          duration: "4 years",
          link: "https://www.nid.edu/academics/programmes/bachelor-of-design-bdes",
          exam: "NID DAT (Prelims + Mains)",
          timeline: [
            { label: "Year 1", items: ["Design Foundation (core studios & fundamentals)"] },
            { label: "Year 2", items: ["Specialization courses (e.g., Product/Comm./UX)", "Studios and labs"] },
            { label: "Year 3", items: ["Advanced specialization, systems & prototyping", "Industry/context projects"] },
            { label: "Year 4", items: ["Internship/practicum, graduation project"] },
          ],
          about: "Studio‑intensive design education with a Foundation year followed by deep specialization.",
          sources: ["NID B.Des official page"],
        }, // [web:279]
      ].map((deg, i) => (
        <motion.div
          key={`deg-${i}`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 280 }}
        >
          {/* MINI CARD: very compact; title + university + mode only */}
          <Card
            onClick={() => setSelectedDegree(deg)}
            className="bg-gradient-to-br from-background to-muted border-0 shadow-sm hover:shadow-md transition-all"
          >
            <CardHeader className="flex items-start gap-3 p-4">
              <div
                className={`p-2.5 rounded-full bg-gradient-to-r ${
                  deg.mode.toLowerCase().includes("online")
                    ? "from-teal-400 to-cyan-500"
                    : "from-sky-500 to-indigo-500"
                } text-white shadow`}
              >
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base font-semibold truncate">
                  {deg.title}
                </CardTitle>
                <div className="text-xs text-muted-foreground truncate">
                  {deg.university} • <span className="capitalize">{deg.mode}</span>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>
      ))}
    </div>

    {/* Big Card Modal with full details and year-by-year curriculum */}
    {selectedDegree && (
      <div
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        onClick={() => setSelectedDegree(null)}
      >
        <Card
          className="w-full max-w-4xl max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">{selectedDegree.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedDegree.university} • {selectedDegree.mode}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm">Rating: {selectedDegree.rating ?? "Not available"}</div>
                <div className="text-xs text-muted-foreground">
                  Reviews: {selectedDegree.reviewsCount ?? "Not available"}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {selectedDegree.about && (
              <div className="rounded-md border p-3 text-sm">{selectedDegree.about}</div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">Duration</div>
                <div className="font-medium">{selectedDegree.duration}</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">Mode</div>
                <div className="font-medium capitalize">{selectedDegree.mode}</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">Fees</div>
                <div className="font-medium">{selectedDegree.fees}</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">Admission Exam / Path</div>
                <div className="font-medium">{selectedDegree.exam ?? "See official site"}</div>
              </div>
            </div>

            {/* Year-by-year curriculum timeline */}
            {Array.isArray(selectedDegree.timeline) && selectedDegree.timeline.length > 0 && (
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground mb-2">Curriculum Timeline</div>
                <div className="space-y-3">
                  {selectedDegree.timeline.map((yr: any, idx: number) => (
                    <div key={idx}>
                      <div className="text-sm font-semibold">{yr.label}</div>
                      <ul className="list-disc pl-5 text-sm">
                        {yr.items.map((it: string, i2: number) => (
                          <li key={i2}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="text-xs text-muted-foreground">
                Source: {Array.isArray(selectedDegree.sources) ? selectedDegree.sources.join(", ") : "Official site"}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setSelectedDegree(null)}>
                  Close
                </Button>
                <Button onClick={() => window.open(selectedDegree.link, "_blank")}>
                  Visit Website
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )}
  </section>
</TabsContent>


          {/* === Certifications Section === */}
          <TabsContent value="certifications">
            <section className="space-y-8">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Award className="h-6 w-6 text-yellow-500" />
                Top Certifications
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: "AWS Certified Solutions Architect",
                    provider: "Amazon Web Services",
                    icon: Cloud,
                    color: "from-sky-500 to-blue-600",
                    link: "https://aws.amazon.com/certification/",
                  },
                  {
                    name: "Google Data Analytics",
                    provider: "Coursera",
                    icon: Database,
                    color: "from-green-500 to-emerald-500",
                    link: "https://www.coursera.org/professional-certificates/google-data-analytics",
                  },
                  {
                    name: "Certified Ethical Hacker (CEH)",
                    provider: "EC-Council",
                    icon: Shield,
                    color: "from-red-500 to-rose-600",
                    link: "https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/",
                  },
                  {
                    name: "TensorFlow Developer Certificate",
                    provider: "Google",
                    icon: Brain,
                    color: "from-purple-500 to-pink-500",
                    link: "https://www.tensorflow.org/certificate",
                  },
                  {
                    name: "PMI Project Management Professional",
                    provider: "PMI",
                    icon: Rocket,
                    color: "from-indigo-500 to-violet-500",
                    link: "https://www.pmi.org/certifications",
                  },
                  {
                    name: "Microsoft Azure Fundamentals",
                    provider: "Microsoft",
                    icon: Cloud,
                    color: "from-blue-600 to-cyan-600",
                    link: "https://learn.microsoft.com/en-us/certifications/azure-fundamentals/",
                  },
                ].map((cert, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card
                      onClick={() => window.open(cert.link, "_blank")}
                      className="cursor-pointer bg-gradient-to-br from-background to-muted shadow-md hover:shadow-lg transition-all border-0"
                    >
                      <CardHeader className="flex items-center gap-3">
                        <div className={`p-3 rounded-full bg-gradient-to-r ${cert.color} text-white shadow-lg`}>
                          <cert.icon className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-lg font-semibold">{cert.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">Offered by {cert.provider}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          </TabsContent>

  {/* === Learning Paths Section === */}
<TabsContent value="learning">
  <section className="space-y-8">
    <h2 className="text-2xl font-bold flex items-center gap-2">
      <Map className="h-6 w-6 text-green-500" />
      Recommended Learning Paths
    </h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        {
          title: "Become a Data Scientist",
          steps: 7,
          duration: "6 months",
          icon: Database,
          color: "from-blue-500 to-cyan-500",
          roadmap: [
            { label: "Month 1", items: ["Python foundations (NumPy, Pandas, plotting)", "Statistics basics: distributions, inference, hypothesis tests", "Linear algebra essentials (vectors, matrices)"] },
            { label: "Month 2", items: ["Machine Learning Crash Course topics: regression, classification, overfitting, regularization", "Model validation: train/val/test, cross‑validation, metrics (RMSE, AUC)", "Feature engineering and preprocessing"] },
            { label: "Month 3", items: ["Supervised ML toolbox: tree‑based methods, ensembles, gradient boosting", "Unsupervised: clustering, dimensionality reduction", "Experiment tracking and reproducibility"] },
            { label: "Month 4", items: ["Deep learning basics: MLPs, CNN/RNN overview, modern optimizers", "Intro to LLMs and embeddings concepts", "Data pipelines: cleaning at scale, scheduling basics"] },
            { label: "Month 5", items: ["End‑to‑end project: EDA → model → evaluation → report", "Model monitoring concepts: drift, data quality checks", "Communication: notebooks to executive summaries"] },
            { label: "Month 6", items: ["Portfolio polishing: 2–3 strong case studies", "Interview prep: SQL, ML theory, statistics questions", "Capstone presentation"] },
          ],
          summary: "A 6‑month plan from core Python and statistics to ML, deep learning basics, and a capstone portfolio."
        },
        {
          title: "AI Engineer Roadmap",
          steps: 9,
          duration: "8 months",
          icon: Brain,
          color: "from-purple-500 to-indigo-500",
          roadmap: [
            { label: "Month 1", items: ["Python/NumPy proficiency, vectorization", "ML foundations refresh: linear/logistic regression, regularization", "Data handling and evaluation metrics"] },
            { label: "Month 2", items: ["Neural nets from scratch: forward/backprop, activations, loss functions", "Training essentials: initializations, batch norm, dropout", "Experiment logging"] },
            { label: "Month 3", items: ["Computer vision intro: CNNs, augmentations", "NLP classical: bag‑of‑words, TF‑IDF, word embeddings", "Sequence modeling basics"] },
            { label: "Month 4", items: ["Modern NLP: transformer intuition, tokenization, embeddings use", "Prompting strategies and evaluation", "Responsible AI basics"] },
            { label: "Month 5", items: ["MLOps basics: packaging, environments, model registry", "Serving: batch vs. online inference, latency/SLOs", "Monitoring: performance + data drift"] },
            { label: "Month 6", items: ["Retrieval‑augmented generation (RAG) basics", "Vector databases fundamentals", "Guardrails and evaluations"] },
            { label: "Month 7", items: ["Applied project: build an AI app (RAG or CV/NLP) end‑to‑end", "Write technical design + postmortem", "Iterate with user feedback"] },
            { label: "Month 8", items: ["Scale and cost tuning", "Security and privacy considerations", "Final polish and demo"] },
          ],
          summary: "An 8‑month path from ML and deep learning fundamentals to transformers, RAG, and MLOps practices."
        },
        {
          title: "Full-Stack Developer",
          steps: 10,
          duration: "9 months",
          icon: Laptop,
          color: "from-pink-500 to-rose-500",
          roadmap: [
            { label: "Month 1", items: ["Web basics: HTML semantics, CSS layout (Flexbox/Grid)", "Core JavaScript (ES6+): scope, async/await, fetch API"] },
            { label: "Month 2", items: ["Frontend workflow: bundlers, linting, formatting", "React fundamentals: components, props/state, hooks"] },
            { label: "Month 3", items: ["React routing and forms", "TypeScript basics in React", "UI patterns and accessibility"] },
            { label: "Month 4", items: ["Backend with Node.js + Express", "REST design, auth (sessions/JWT), validation", "Databases: SQL or NoSQL and ORM/ODM"] },
            { label: "Month 5", items: ["Testing: unit/integration/e2e", "API testing strategies and tools", "Logging and error handling"] },
            { label: "Month 6", items: ["Full‑stack project 1: MVP with CRUD, auth, deployment", "Environment config and secrets"] },
            { label: "Month 7", items: ["Advanced frontend patterns: state management, performance", "Advanced backend: caching, queues, WebSockets"] },
            { label: "Month 8", items: ["DevOps basics for apps: CI, containerization, cloud deploy", "Observability essentials"] },
            { label: "Month 9", items: ["Full‑stack project 2: production‑grade app", "Docs, DX polish, portfolio + interview prep"] },
          ],
          summary: "A 9‑month, project‑heavy sequence from web fundamentals to React + Node/DB, testing, and production deployment."
        },
        {
          title: "Cybersecurity Expert",
          steps: 8,
          duration: "7 months",
          icon: Shield,
          color: "from-red-500 to-orange-500",
          roadmap: [
            { label: "Month 1", items: ["Networking & OS basics (Linux/Windows)", "Security principles: CIA triad, least privilege"] },
            { label: "Month 2", items: ["Threats & vulns: OWASP Top 10 intro", "Secure coding basics and code review"] },
            { label: "Month 3", items: ["Blue team: SIEM basics, logs, incident response runbooks", "Identity & access: MFA, RBAC, SSO"] },
            { label: "Month 4", items: ["Red team intro: recon, basic exploitation in labs", "Vuln management: scanning and prioritization"] },
            { label: "Month 5", items: ["Cloud security foundations (IAM, network segmentation)", "KMS, secrets, backup & recovery drills"] },
            { label: "Month 6", items: ["Governance, risk, and compliance basics", "Security monitoring and tabletop exercises"] },
            { label: "Month 7", items: ["Capstone: secure a small environment end‑to‑end", "Posture report and improvement plan"] },
          ],
          summary: "A 7‑month track aligned to workforce roles and KSAs with blue/red/cloud security touchpoints."
        },
        {
          title: "Cloud & DevOps Engineer",
          steps: 6,
          duration: "5 months",
          icon: Cloud,
          color: "from-sky-500 to-indigo-500",
          roadmap: [
            { label: "Month 1", items: ["Cloud fundamentals: compute, storage, networking", "CLI + IaC basics (e.g., Terraform workflow)"] },
            { label: "Month 2", items: ["Containers + images, Dockerfiles", "Kubernetes basics: pods, services, deployments"] },
            { label: "Month 3", items: ["CI/CD pipelines and artifact management", "Config management and policy as code overview"] },
            { label: "Month 4", items: ["Observability: logging, metrics, tracing; SLOs/SLIs", "Reliability practices: rollback, chaos drills"] },
            { label: "Month 5", items: ["Cost & performance tuning", "Security baselines and incident playbooks; capstone deploy"] },
          ],
          summary: "A 5‑month sequence emphasizing CI/CD, containers/K8s, observability, and reliability practices."
        },
        {
          title: "Product Manager",
          steps: 5,
          duration: "4 months",
          icon: Rocket,
          color: "from-indigo-600 to-purple-600",
          roadmap: [
            { label: "Month 1", items: ["User research & problem discovery", "Opportunity sizing and success metrics (north star)"] },
            { label: "Month 2", items: ["Prioritization frameworks (e.g., RICE/ICE)", "MVP scoping and hypothesis statements"] },
            { label: "Month 3", items: ["Delivery: agile rituals, roadmap comms, stakeholder mgmt", "Design collaboration and heuristics awareness"] },
            { label: "Month 4", items: ["Experimentation and analytics", "Post‑launch retros, iteration, and storytelling"] },
          ],
          summary: "A 4‑month PM arc from discovery and prioritization to delivery, measurement, and iteration."
        },
      ].map((path, idx) => (
        <motion.div key={idx} whileHover={{ scale: 1.04 }} transition={{ type: "spring", stiffness: 250 }}>
          {/* MINI CARD: small footprint, minimal info */}
          <Card
            onClick={() => setSelectedPath(path)}
            className="bg-gradient-to-br from-background to-muted border-0 shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer"
          >
            <CardHeader className="flex items-center gap-3 p-4">
              <div className={`p-3 rounded-full bg-gradient-to-r ${path.color} text-white shadow-lg`}>
                <path.icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-base font-bold">{path.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-4 px-4">
              <p className="text-xs text-muted-foreground">{path.steps} Steps • {path.duration}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full hover:bg-green-600 hover:text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); setSelectedPath(path); }}
              >
                Start Path
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>

    {/* Big Card Modal: month-by-month interactive roadmap */}
    {selectedPath && (
      <div
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        onClick={() => setSelectedPath(null)}
      >
        <Card
          className="w-full max-w-4xl max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">{selectedPath.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedPath.steps} Steps • {selectedPath.duration}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {selectedPath.summary && (
              <div className="rounded-md border p-3 text-sm">
                {selectedPath.summary}
              </div>
            )}

            {/* Month-by-month roadmap */}
            {Array.isArray(selectedPath.roadmap) && selectedPath.roadmap.length > 0 && (
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground mb-2">Roadmap Timeline</div>
                <div className="space-y-4">
                  {selectedPath.roadmap.map((m: any, i: number) => (
                    <div key={i}>
                      <div className="text-sm font-semibold">{m.label}</div>
                      <ul className="list-disc pl-5 text-sm">
                        {m.items.map((it: string, j: number) => (
                          <li key={j}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setSelectedPath(null)}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )}
  </section>
</TabsContent>


          {/* === Trending Resources Section === */}
          <TabsContent value="resources">
            <section className="space-y-8">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-orange-500" />
                Trending Resources
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Deep Learning Specialization — Coursera",
                    desc: "Andrew Ng's legendary deep learning course series.",
                    link: "https://www.coursera.org/specializations/deep-learning",
                    icon: GraduationCap,
                    color: "from-indigo-500 to-blue-600",
                  },
                  {
                    title: "The Data Science Handbook",
                    desc: "Insights from top data scientists around the world.",
                    link: "https://www.thedatasciencehandbook.com/",
                    icon: BookOpen,
                    color: "from-green-500 to-emerald-600",
                  },
                  {
                    title: "FreeCodeCamp — Machine Learning",
                    desc: "Hands-on tutorials for ML, Python, and TensorFlow.",
                    link: "https://www.freecodecamp.org/learn/",
                    icon: Code,
                    color: "from-cyan-500 to-sky-500",
                  },
                  {
                    title: "r/learnprogramming (Reddit)",
                    desc: "Join 4M+ learners discussing tips and resources.",
                    link: "https://www.reddit.com/r/learnprogramming/",
                    icon: MessageSquare,
                    color: "from-orange-500 to-red-500",
                  },
                  {
                    title: "Medium — Towards Data Science",
                    desc: "The most-read blog for AI and ML learners.",
                    link: "https://towardsdatascience.com/",
                    icon: PenTool,
                    color: "from-yellow-500 to-amber-500",
                  },
                  {
                    title: "MIT OpenCourseWare",
                    desc: "Free online courses from MIT covering all domains.",
                    link: "https://ocw.mit.edu/",
                    icon: Globe,
                    color: "from-blue-500 to-violet-500",
                  },
                ].map((res, i) => (
                  <motion.div key={i} whileHover={{ y: -5, scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card
                      onClick={() => window.open(res.link, "_blank")}
                      className="cursor-pointer bg-gradient-to-br from-background to-muted border-0 shadow-md hover:shadow-lg transition-all"
                    >
                      <CardHeader className="flex items-center gap-3">
                        <div className={`p-3 rounded-full bg-gradient-to-r ${res.color} text-white shadow-lg`}>
                          <res.icon className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-lg font-semibold leading-snug">{res.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{res.desc}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          </TabsContent>
        </Tabs>

        {/* === Footer === */}
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>🚀 Explore. Learn. Grow. — Powered by SkillMetrics AI</p>
          <p className="mt-1">
            Built with ❤️ using <span className="text-primary font-semibold">React + Tailwind</span>
          </p>
        </footer>
      </div>
    </Layout>
  );
}

export default Explore;
