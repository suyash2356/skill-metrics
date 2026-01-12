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
import { usePersonalizedExplore } from "@/hooks/usePersonalizedExplore";

function Explore() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Get personalized content based on user profile
  const personalizedData = usePersonalizedExplore();

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

  const iconMap: any = {
    BookOpen, Brain, Cloud, Database, Globe, Shield, TrendingUp, Zap, Laptop, Layers, Rocket, Award, Map, GraduationCap, Code, PenTool, MessageSquare
  };

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
                    onMouseDown={(ev) => {
                      ev.preventDefault();
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
          <TabsList className="flex justify-start sm:justify-center overflow-x-auto bg-transparent gap-2 pb-2 w-full no-scrollbar">
            <TabsTrigger value="popular" className="shrink-0">Popular</TabsTrigger>
            <TabsTrigger value="categories" className="shrink-0">Degrees</TabsTrigger>
            <TabsTrigger value="certifications" className="shrink-0">Certifications</TabsTrigger>
            <TabsTrigger value="learning" className="shrink-0">Learning Paths</TabsTrigger>
            <TabsTrigger value="resources" className="shrink-0">Resources</TabsTrigger>
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
                {personalizedData.techCategories.map((scoredCategory, idx) => {
                  const category = scoredCategory.item;
                  const IconComponent = iconMap[category.icon] || Brain;

                  return (
                    <SwiperSlide key={idx}>
                        <Card
                          onClick={() => {
                            if (category.link) window.open(category.link, '_blank');
                            else handleCategoryClick(category.title);
                          }}
                          className="group cursor-pointer overflow-hidden bg-gradient-to-br from-background to-muted border-0 shadow-md hover:shadow-xl transition-all duration-500 h-[220px] flex flex-col"
                        >
                          <CardHeader className="flex items-center gap-3 flex-shrink-0">
                            <div
                              className={`p-3 rounded-full bg-gradient-to-r ${category.color} text-white shadow-lg flex-shrink-0`}
                            >
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-lg font-bold line-clamp-1">{category.title}</CardTitle>
                            {scoredCategory.reasons[0] && (
                              <Badge variant="secondary" className="text-xs flex-shrink-0">{scoredCategory.reasons[0]}</Badge>
                            )}
                          </CardHeader>
                          <CardContent className="flex-1 flex flex-col justify-between">
                            <p className="text-muted-foreground text-sm line-clamp-2">{category.description}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (category.link) window.open(category.link, '_blank');
                                else handleCategoryClick(category.title);
                              }}
                            >
                              Explore
                            </Button>
                          </CardContent>
                        </Card>
                    </SwiperSlide>
                  );
                })}
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
                  {personalizedData.nonTechCategories.map((scoredCategory, idx) => {
                    const category = scoredCategory.item;
                    const IconComponent = iconMap[category.icon] || BookOpen;

                    return (
                      <SwiperSlide key={`nontech-${idx}`}>
                        <Card
                          onClick={() => {
                            if (category.link) window.open(category.link, '_blank');
                            else handleCategoryClick(category.title);
                          }}
                          className="group cursor-pointer overflow-hidden bg-gradient-to-br from-background to-muted border-0 shadow-md hover:shadow-xl transition-all duration-500 h-[220px] flex flex-col"
                        >
                          <CardHeader className="flex items-center gap-3 flex-shrink-0">
                            <div className={`p-3 rounded-full bg-gradient-to-r ${category.color} text-white shadow-lg flex-shrink-0`}>
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-lg font-bold line-clamp-1">{category.title}</CardTitle>
                            {scoredCategory.reasons[0] && (
                              <Badge variant="secondary" className="text-xs flex-shrink-0">{scoredCategory.reasons[0]}</Badge>
                            )}
                          </CardHeader>
                          <CardContent className="flex-1 flex flex-col justify-between">
                            <p className="text-muted-foreground text-sm line-clamp-2">{category.description}</p>
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
                    );
                  })}
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
                  {personalizedData.exams.map((scoredExam, idx) => {
                    const exam = scoredExam.item;

                    return (
                      <SwiperSlide key={`exam-${idx}`}>
                        <Card
                          onClick={() => { if (exam.link) window.open(exam.link, '_blank'); else handleCategoryClick(exam.title); }}
                          className="group cursor-pointer overflow-hidden bg-gradient-to-br from-background to-muted border-0 shadow-md hover:shadow-xl transition-all duration-500 h-[220px] flex flex-col"
                        >
                          <CardHeader className="flex items-center gap-3 flex-shrink-0">
                            <div className={`p-3 rounded-full bg-gradient-to-r ${exam.color} text-white shadow-lg flex-shrink-0`}>
                              <GraduationCap className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-lg font-bold line-clamp-1">{exam.title}</CardTitle>
                            {scoredExam.reasons[0] && (
                              <Badge variant="secondary" className="text-xs flex-shrink-0">{scoredExam.reasons[0]}</Badge>
                            )}
                          </CardHeader>
                          <CardContent className="flex-1 flex flex-col justify-between">
                            <p className="text-muted-foreground text-sm line-clamp-2">{exam.description}</p>
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
                    );
                  })}
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

              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {personalizedData.degrees.map((scoredDeg, i) => {
                  const deg = scoredDeg.item;
                  return (
                    <motion.div
                      key={`deg-${i}`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 280 }}
                    >
                      {/* MINI CARD: very compact; title + university + mode only */}
                      <Card
                        onClick={() => setSelectedDegree(deg)}
                        className="bg-gradient-to-br from-background to-muted border-0 shadow-sm hover:shadow-md transition-all h-[140px] flex flex-col"
                      >
                        <CardHeader className="flex items-start gap-3 p-4 flex-1">
                          <div
                            className={`p-2.5 rounded-full bg-gradient-to-r ${deg.mode.toLowerCase().includes("online")
                              ? "from-teal-400 to-cyan-500"
                              : "from-sky-500 to-indigo-500"
                              } text-white shadow flex-shrink-0`}
                          >
                            <GraduationCap className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base font-semibold line-clamp-1">
                              {deg.title}
                            </CardTitle>
                            <div className="text-xs text-muted-foreground truncate">
                              {deg.university} • <span className="capitalize">{deg.mode}</span>
                            </div>
                            {scoredDeg.reasons[0] && (
                              <Badge variant="secondary" className="mt-2 text-[10px] h-5">{scoredDeg.reasons[0]}</Badge>
                            )}
                          </div>
                        </CardHeader>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>

              {/* Big Card Modal with full details and year-by-year curriculum */}
              {selectedDegree && (
                <div
                  className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                  onClick={() => setSelectedDegree(null)}
                >
                  <Card
                    className="w-full max-w-4xl max-h-[85vh] overflow-y-auto mx-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CardHeader className="space-y-1">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <CardTitle className="text-2xl break-words">{selectedDegree.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {selectedDegree.university} • {selectedDegree.mode}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">Rating: {selectedDegree.rating ?? "Not available"}</div>
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
                {personalizedData.certifications.map((scoredCert, i) => {
                  const cert = scoredCert.item;
                  const IconComponent = iconMap[cert.icon] || Award;
                  return (
                    <motion.div key={i} whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
                      <Card
                        onClick={() => window.open(cert.link, "_blank")}
                        className="cursor-pointer bg-gradient-to-br from-background to-muted shadow-md hover:shadow-lg transition-all border-0 h-[180px] flex flex-col"
                      >
                        <CardHeader className="flex items-center gap-3 flex-shrink-0">
                          <div className={`p-3 rounded-full bg-gradient-to-r ${cert.color} text-white shadow-lg flex-shrink-0`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <CardTitle className="text-lg font-semibold line-clamp-1">{cert.name}</CardTitle>
                          {scoredCert.reasons[0] && (
                            <Badge variant="secondary" className="text-xs flex-shrink-0">{scoredCert.reasons[0]}</Badge>
                          )}
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-center">
                          <p className="text-muted-foreground text-sm">Offered by {cert.provider}</p>
                          {cert.estimatedTime && <p className="text-muted-foreground text-xs mt-1">{cert.estimatedTime}</p>}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
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
                {personalizedData.learningPaths.map((scoredPath, idx) => {
                  const path = scoredPath.item;
                  const pathIconMap: any = { Brain, Database, Laptop, Shield, Cloud, Rocket };
                  const IconComponent = pathIconMap[
                    path.title.includes('Data') ? 'Database' :
                      path.title.includes('Developer') || path.title.includes('Full') ? 'Laptop' :
                        path.title.includes('Cyber') || path.title.includes('Security') ? 'Shield' :
                          path.title.includes('Cloud') || path.title.includes('DevOps') ? 'Cloud' :
                            path.title.includes('AI') || path.title.includes('ML') ? 'Brain' :
                            'Rocket'] || Rocket;

                  const colorMap: any = {
                    'Data Scientist': 'from-blue-500 to-cyan-500',
                    'AI/ML Engineer': 'from-purple-500 to-indigo-500',
                    'Full-Stack Web Developer': 'from-pink-500 to-rose-500',
                    'Cybersecurity Analyst': 'from-red-500 to-orange-500',
                    'Cloud DevOps Engineer': 'from-sky-500 to-indigo-500',
                    'UI/UX Designer': 'from-indigo-600 to-purple-600'
                  };
                  const pathColor = colorMap[path.title] || 'from-green-500 to-emerald-500';

                  return (
                    <motion.div key={idx} whileHover={{ scale: 1.04 }} transition={{ type: "spring", stiffness: 250 }}>
                      <Card
                        onClick={() => setSelectedPath(path)}
                        className="bg-gradient-to-br from-background to-muted border-0 shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer h-[220px] flex flex-col"
                      >
                        <CardHeader className="flex items-center gap-3 p-4 flex-shrink-0">
                          <div className={`p-3 rounded-full bg-gradient-to-r ${pathColor} text-white shadow-lg flex-shrink-0`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <CardTitle className="text-base font-bold line-clamp-1">{path.title}</CardTitle>
                          {scoredPath.reasons[0] && (
                            <Badge variant="secondary" className="text-xs flex-shrink-0">{scoredPath.reasons[0]}</Badge>
                          )}
                        </CardHeader>
                        <CardContent className="pt-0 pb-4 px-4 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">{path.duration}</p>
                            <p className="text-xs text-muted-foreground mt-1 capitalize">{path.difficulty} level</p>
                          </div>
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
                  );
                })}
              </div>

              {/* Big Card Modal: month-by-month interactive roadmap */}
              {selectedPath && (
                <div
                  className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                  onClick={() => setSelectedPath(null)}
                >
                  <Card
                    className="w-full max-w-4xl max-h-[85vh] overflow-y-auto mx-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CardHeader className="space-y-1">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <CardTitle className="text-2xl break-words">{selectedPath.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {selectedPath.roadmap?.length || 0} Steps • {selectedPath.duration}
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {selectedPath.description && (
                        <div className="rounded-md border p-3 text-sm">
                          {selectedPath.description}
                        </div>
                      )}

                      {selectedPath.targetRole && (
                        <div className="text-sm">
                          <span className="font-semibold">Target Role:</span> {selectedPath.targetRole}
                        </div>
                      )}

                      {/* Month-by-month roadmap */}
                      {Array.isArray(selectedPath.roadmap) && selectedPath.roadmap.length > 0 && (
                        <div className="rounded-md border p-3">
                          <div className="text-xs text-muted-foreground mb-2">Roadmap Timeline</div>
                          <div className="space-y-4">
                            {selectedPath.roadmap.map((m: any, i: number) => (
                              <div key={i}>
                                <div className="text-sm font-semibold">{m.phase}</div>
                                <ul className="list-disc pl-5 text-sm">
                                  {m.topics.map((it: string, j: number) => (
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
                {personalizedData.trendingResources.map((scoredRes, i) => {
                  const res = scoredRes.item;
                  const IconComponent = iconMap[res.icon] || BookOpen;
                  return (
                    <motion.div key={i} whileHover={{ y: -5, scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
                      <Card
                        onClick={() => window.open(res.link, "_blank")}
                        className="cursor-pointer bg-gradient-to-br from-background to-muted border-0 shadow-md hover:shadow-lg transition-all h-[180px] flex flex-col"
                      >
                        <CardHeader className="flex items-center gap-3 flex-shrink-0">
                          <div className={`p-3 rounded-full bg-gradient-to-r ${res.color} text-white shadow-lg flex-shrink-0`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <CardTitle className="text-lg font-semibold leading-snug line-clamp-1">{res.title}</CardTitle>
                          {scoredRes.reasons[0] && (
                            <Badge variant="secondary" className="text-xs flex-shrink-0">{scoredRes.reasons[0]}</Badge>
                          )}
                        </CardHeader>
                        <CardContent className="flex-1">
                          <p className="text-sm text-muted-foreground line-clamp-2">{res.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
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
    </Layout >
  );
}

export default Explore;
