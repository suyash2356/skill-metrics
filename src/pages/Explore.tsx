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
  GraduationCap,
  Code,
  PenTool,
  MessageSquare,
  Search,
  ArrowRight,
  FileText,
  ExternalLink,
  Sparkles,
  Star,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/free-mode";
import { motion, AnimatePresence } from "framer-motion";
import { fetchExploreSuggestions } from "@/api/searchAPI";
import { debounce } from "lodash";
import { usePersonalizedExplore } from "@/hooks/usePersonalizedExplore";
import { useBlogsAndPapers } from "@/hooks/useBlogsAndPapers";

function Explore() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState("popular");

  // Get personalized content based on user profile
  const personalizedData = usePersonalizedExplore();
  const { data: blogsAndPapers, isLoading: blogsLoading } = useBlogsAndPapers();

  const fetchSuggestions = debounce(async (q: string) => {
    if (!q) return setSuggestions([]);
    try {
      const res = await fetchExploreSuggestions(q, 8);
      setSuggestions(res);
    } catch (e) {
      setSuggestions([]);
    }
  }, 200);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}&scope=explore`);
    }
  };

  // Navigate to skill recommendations page
  const handleExploreClick = (title: string) => {
    navigate(`/skills/${encodeURIComponent(title)}`);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const iconMap: any = {
    BookOpen, Brain, Cloud, Database, Globe, Shield, TrendingUp, Zap, Laptop, Layers, Rocket, Award, GraduationCap, Code, PenTool, MessageSquare, FileText
  };

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    })
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Hero Section */}
          <section className="text-center mb-12 pt-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                Discover Your Learning Path
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
                Explore Top Learning Resources
              </h1>
              
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-6">
                Discover trending skills, domains, and career paths with the most popular and useful learning materials.
              </p>

              {/* Dynamic rotating text */}
              <div className="h-8 mb-8">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentWordIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-xl font-semibold text-primary inline-block"
                  >
                    {rotatingWords[currentWordIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Search Bar */}
            <motion.form 
              onSubmit={handleSearch} 
              className="relative max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search skills, exams, or topics..."
                  value={searchTerm}
                  onChange={(e) => { 
                    setSearchTerm(e.target.value); 
                    fetchSuggestions(e.target.value); 
                    setShowSuggestions(true); 
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  className="pl-12 pr-28 h-14 text-base rounded-2xl border-2 border-border/50 bg-background/80 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary transition-all"
                />
                <Button
                  type="submit"
                  className="absolute right-2 h-10 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25"
                >
                  Search
                </Button>
              </div>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute mt-2 bg-card border border-border rounded-xl shadow-xl z-50 w-full overflow-hidden"
                  >
                    {suggestions.map((s: any, idx: number) => (
                      <button 
                        key={`exp-${idx}`} 
                        className="w-full text-left px-4 py-3 hover:bg-muted/50 flex items-center gap-3 transition-colors border-b border-border/50 last:border-0"
                        onMouseDown={(ev) => {
                          ev.preventDefault();
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
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Search className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{s.name}</div>
                          {s.description && <div className="text-xs text-muted-foreground truncate">{s.description}</div>}
                        </div>
                        {s.link && <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.form>
          </section>

          {/* Tabs for Explore Sections */}
          <Tabs defaultValue="popular" onValueChange={(v) => setActiveTab(v)} className="space-y-8">
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg py-4 -mx-4 px-4 border-b border-border/50">
              <TabsList className="flex justify-start md:justify-center overflow-x-auto bg-muted/50 p-1.5 rounded-2xl gap-1 w-full max-w-fit mx-auto no-scrollbar">
                <TabsTrigger 
                  value="popular" 
                  className="shrink-0 px-6 py-2.5 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium transition-all"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Popular
                </TabsTrigger>
                <TabsTrigger 
                  value="categories" 
                  className="shrink-0 px-6 py-2.5 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium transition-all"
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Degrees
                </TabsTrigger>
                <TabsTrigger 
                  value="certifications" 
                  className="shrink-0 px-6 py-2.5 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium transition-all"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Certifications
                </TabsTrigger>
                <TabsTrigger 
                  value="blogs" 
                  className="shrink-0 px-6 py-2.5 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium transition-all"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Blogs & Papers
                </TabsTrigger>
                <TabsTrigger 
                  value="resources" 
                  className="shrink-0 px-6 py-2.5 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium transition-all"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Resources
                </TabsTrigger>
              </TabsList>
            </div>

            {/* === Popular Categories Section === */}
            <TabsContent value="popular" className="space-y-10">
              {/* Tech Categories */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-primary/10">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      Popular Tech Categories
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Explore trending technology domains</p>
                  </div>
                </div>

                <Swiper
                  modules={[Autoplay, FreeMode]}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  loop={personalizedData.techCategories.length > 3}
                  spaceBetween={16}
                  slidesPerView={1.15}
                  breakpoints={{
                    640: { slidesPerView: 2.2 },
                    1024: { slidesPerView: 3.2 },
                    1280: { slidesPerView: 4.2 },
                  }}
                  className="pb-4"
                >
                  {personalizedData.techCategories.map((scoredCategory, idx) => {
                    const category = scoredCategory.item;
                    const IconComponent = iconMap[category.icon] || Brain;

                    return (
                      <SwiperSlide key={idx}>
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          custom={idx}
                          variants={cardVariants}
                        >
                          <Card className="group cursor-pointer overflow-hidden bg-card hover:bg-card/80 border border-border/50 hover:border-primary/30 shadow-sm hover:shadow-xl transition-all duration-300 h-[200px] flex flex-col">
                            <CardHeader className="flex flex-row items-start gap-3 p-4 pb-2">
                              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${category.color} text-white shadow-md flex-shrink-0`}>
                                <IconComponent className="h-5 w-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-base font-bold line-clamp-1">{category.title}</CardTitle>
                                {scoredCategory.reasons[0] && (
                                  <Badge variant="secondary" className="text-[10px] mt-1 bg-primary/10 text-primary border-0">
                                    {scoredCategory.reasons[0]}
                                  </Badge>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-between p-4 pt-0">
                              <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{category.description}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-3 w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleExploreClick(category.title);
                                }}
                              >
                                Explore
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </section>

              {/* Non-Tech Fields */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-emerald-500/10">
                        <Globe className="h-5 w-5 text-emerald-500" />
                      </div>
                      Popular Non-Tech Fields
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Explore business, design, and more</p>
                  </div>
                </div>

                <Swiper
                  modules={[Autoplay, FreeMode]}
                  autoplay={{ delay: 3000, disableOnInteraction: false, reverseDirection: true }}
                  loop={personalizedData.nonTechCategories.length > 3}
                  spaceBetween={16}
                  slidesPerView={1.15}
                  breakpoints={{
                    640: { slidesPerView: 2.2 },
                    1024: { slidesPerView: 3.2 },
                    1280: { slidesPerView: 4.2 },
                  }}
                  className="pb-4"
                >
                  {personalizedData.nonTechCategories.map((scoredCategory, idx) => {
                    const category = scoredCategory.item;
                    const IconComponent = iconMap[category.icon] || BookOpen;

                    return (
                      <SwiperSlide key={`nontech-${idx}`}>
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          custom={idx}
                          variants={cardVariants}
                        >
                          <Card className="group cursor-pointer overflow-hidden bg-card hover:bg-card/80 border border-border/50 hover:border-emerald-500/30 shadow-sm hover:shadow-xl transition-all duration-300 h-[200px] flex flex-col">
                            <CardHeader className="flex flex-row items-start gap-3 p-4 pb-2">
                              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${category.color} text-white shadow-md flex-shrink-0`}>
                                <IconComponent className="h-5 w-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-base font-bold line-clamp-1">{category.title}</CardTitle>
                                {scoredCategory.reasons[0] && (
                                  <Badge variant="secondary" className="text-[10px] mt-1 bg-emerald-500/10 text-emerald-600 border-0">
                                    {scoredCategory.reasons[0]}
                                  </Badge>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-between p-4 pt-0">
                              <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{category.description}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-3 w-full justify-between group-hover:bg-emerald-500 group-hover:text-white transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleExploreClick(category.title);
                                }}
                              >
                                Explore
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </section>

              {/* Popular Exams */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-amber-500/10">
                        <GraduationCap className="h-5 w-5 text-amber-500" />
                      </div>
                      Popular Exams
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Prepare for competitive exams and certifications</p>
                  </div>
                </div>

                <Swiper
                  modules={[Autoplay, FreeMode]}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  loop={personalizedData.exams.length > 3}
                  spaceBetween={16}
                  slidesPerView={1.15}
                  breakpoints={{
                    640: { slidesPerView: 2.2 },
                    1024: { slidesPerView: 3.2 },
                    1280: { slidesPerView: 4.2 },
                  }}
                  className="pb-4"
                >
                  {personalizedData.exams.map((scoredExam, idx) => {
                    const exam = scoredExam.item;

                    return (
                      <SwiperSlide key={`exam-${idx}`}>
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          custom={idx}
                          variants={cardVariants}
                        >
                          <Card className="group cursor-pointer overflow-hidden bg-card hover:bg-card/80 border border-border/50 hover:border-amber-500/30 shadow-sm hover:shadow-xl transition-all duration-300 h-[200px] flex flex-col">
                            <CardHeader className="flex flex-row items-start gap-3 p-4 pb-2">
                              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${exam.color} text-white shadow-md flex-shrink-0`}>
                                <GraduationCap className="h-5 w-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-base font-bold line-clamp-1">{exam.title}</CardTitle>
                                {scoredExam.reasons[0] && (
                                  <Badge variant="secondary" className="text-[10px] mt-1 bg-amber-500/10 text-amber-600 border-0">
                                    {scoredExam.reasons[0]}
                                  </Badge>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-between p-4 pt-0">
                              <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{exam.description}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-3 w-full justify-between group-hover:bg-amber-500 group-hover:text-white transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleExploreClick(exam.title);
                                }}
                              >
                                Explore
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </section>
            </TabsContent>

            {/* === Degrees Section === */}
            <TabsContent value="categories">
              <section>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-sky-500/10">
                      <GraduationCap className="h-6 w-6 text-sky-500" />
                    </div>
                    Top Degrees
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Explore top university degrees (online & offline) — compare fees, duration, rating and what you'll learn.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {personalizedData.degrees.map((scoredDeg, i) => {
                    const deg = scoredDeg.item;
                    return (
                      <motion.div
                        key={`deg-${i}`}
                        initial="hidden"
                        animate="visible"
                        custom={i}
                        variants={cardVariants}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Card
                          onClick={() => setSelectedDegree(deg)}
                          className="cursor-pointer bg-card hover:bg-card/80 border border-border/50 hover:border-sky-500/30 shadow-sm hover:shadow-lg transition-all h-[160px] flex flex-col"
                        >
                          <CardHeader className="flex flex-row items-start gap-3 p-4">
                            <div className={`p-2 rounded-xl bg-gradient-to-br ${deg.mode.toLowerCase().includes("online") ? "from-teal-400 to-cyan-500" : "from-sky-500 to-indigo-500"} text-white shadow-md flex-shrink-0`}>
                              <GraduationCap className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-sm font-semibold line-clamp-2 leading-tight">
                                {deg.title}
                              </CardTitle>
                              <div className="text-xs text-muted-foreground mt-1 truncate">
                                {deg.university}
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-[10px] capitalize">{deg.mode}</Badge>
                                {scoredDeg.reasons[0] && (
                                  <Badge className="text-[10px] bg-sky-500/10 text-sky-600 border-0 hover:bg-sky-500/20">{scoredDeg.reasons[0]}</Badge>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Degree Modal */}
                <AnimatePresence>
                  {selectedDegree && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                      onClick={() => setSelectedDegree(null)}
                    >
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Card
                          className="w-full max-w-3xl max-h-[85vh] overflow-y-auto"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <CardHeader className="border-b border-border/50 bg-muted/30">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${selectedDegree.mode.toLowerCase().includes("online") ? "from-teal-400 to-cyan-500" : "from-sky-500 to-indigo-500"} text-white shadow-md flex-shrink-0`}>
                                  <GraduationCap className="h-6 w-6" />
                                </div>
                                <div>
                                  <CardTitle className="text-xl">{selectedDegree.title}</CardTitle>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {selectedDegree.university} • {selectedDegree.mode}
                                  </p>
                                </div>
                              </div>
                              {selectedDegree.rating && (
                                <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 rounded-lg">
                                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                  <span className="text-sm font-medium">{selectedDegree.rating}</span>
                                </div>
                              )}
                            </div>
                          </CardHeader>

                          <CardContent className="p-6 space-y-6">
                            {selectedDegree.about && (
                              <div className="bg-muted/50 rounded-xl p-4">
                                <p className="text-sm leading-relaxed">{selectedDegree.about}</p>
                              </div>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div className="bg-muted/30 rounded-xl p-3 text-center">
                                <Clock className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                                <div className="text-xs text-muted-foreground">Duration</div>
                                <div className="text-sm font-medium mt-0.5">{selectedDegree.duration || 'N/A'}</div>
                              </div>
                              <div className="bg-muted/30 rounded-xl p-3 text-center">
                                <Globe className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                                <div className="text-xs text-muted-foreground">Mode</div>
                                <div className="text-sm font-medium capitalize mt-0.5">{selectedDegree.mode}</div>
                              </div>
                              <div className="bg-muted/30 rounded-xl p-3 text-center">
                                <Zap className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                                <div className="text-xs text-muted-foreground">Fees</div>
                                <div className="text-sm font-medium mt-0.5">{selectedDegree.fees}</div>
                              </div>
                              <div className="bg-muted/30 rounded-xl p-3 text-center">
                                <Award className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                                <div className="text-xs text-muted-foreground">Admission</div>
                                <div className="text-sm font-medium mt-0.5 truncate">{selectedDegree.exam || 'Direct'}</div>
                              </div>
                            </div>

                            {/* Year-by-year curriculum timeline */}
                            {Array.isArray(selectedDegree.timeline) && selectedDegree.timeline.length > 0 && (
                              <div className="border rounded-xl overflow-hidden">
                                <div className="bg-muted/30 px-4 py-2 text-sm font-medium">Curriculum Timeline</div>
                                <div className="p-4 space-y-4">
                                  {selectedDegree.timeline.map((yr: any, idx: number) => (
                                    <div key={idx} className="flex gap-4">
                                      <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 rounded-full bg-primary" />
                                        {idx < selectedDegree.timeline.length - 1 && (
                                          <div className="w-0.5 h-full bg-border mt-1" />
                                        )}
                                      </div>
                                      <div className="flex-1 pb-4">
                                        <div className="font-medium text-sm">{yr.label}</div>
                                        <ul className="mt-2 space-y-1">
                                          {yr.items.map((it: string, i2: number) => (
                                            <li key={i2} className="text-sm text-muted-foreground flex items-start gap-2">
                                              <ChevronRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                              {it}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/50">
                              <div className="text-xs text-muted-foreground">
                                Source: {Array.isArray(selectedDegree.sources) ? selectedDegree.sources.join(", ") : "Official site"}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" onClick={() => setSelectedDegree(null)}>
                                  Close
                                </Button>
                                <Button onClick={() => window.open(selectedDegree.link, "_blank")}>
                                  Visit Website
                                  <ExternalLink className="h-4 w-4 ml-2" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            </TabsContent>

            {/* === Certifications Section === */}
            <TabsContent value="certifications">
              <section>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10">
                      <Award className="h-6 w-6 text-amber-500" />
                    </div>
                    Top Certifications
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Industry-recognized certifications to boost your career
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {personalizedData.certifications.map((scoredCert, i) => {
                    const cert = scoredCert.item;
                    const IconComponent = iconMap[cert.icon] || Award;
                    return (
                      <motion.div 
                        key={i} 
                        initial="hidden"
                        animate="visible"
                        custom={i}
                        variants={cardVariants}
                        whileHover={{ scale: 1.02 }} 
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Card
                          onClick={() => window.open(cert.link, "_blank")}
                          className="cursor-pointer bg-card hover:bg-card/80 border border-border/50 hover:border-amber-500/30 shadow-sm hover:shadow-lg transition-all h-[180px] flex flex-col"
                        >
                          <CardHeader className="flex flex-row items-start gap-3 p-4">
                            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${cert.color} text-white shadow-md flex-shrink-0`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-sm font-semibold line-clamp-2 leading-tight">{cert.name}</CardTitle>
                              {scoredCert.reasons[0] && (
                                <Badge className="mt-1 text-[10px] bg-amber-500/10 text-amber-600 border-0">{scoredCert.reasons[0]}</Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="flex-1 flex flex-col justify-between p-4 pt-0">
                            <div>
                              <p className="text-sm text-muted-foreground">by {cert.provider}</p>
                              {cert.estimatedTime && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {cert.estimatedTime}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-end mt-2">
                              <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            </TabsContent>

            {/* === Blogs & Research Papers Section === */}
            <TabsContent value="blogs">
              <section>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-violet-500/10">
                      <FileText className="h-6 w-6 text-violet-500" />
                    </div>
                    Blogs & Research Papers
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Curated research papers and blog posts based on your interests
                  </p>
                </div>

                {blogsLoading ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="h-[200px] animate-pulse bg-muted/50" />
                    ))}
                  </div>
                ) : blogsAndPapers && blogsAndPapers.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {blogsAndPapers.map((item, i) => (
                      <motion.div
                        key={i}
                        initial="hidden"
                        animate="visible"
                        custom={i}
                        variants={cardVariants}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Card
                          onClick={() => window.open(item.link, "_blank")}
                          className="cursor-pointer bg-card hover:bg-card/80 border border-border/50 hover:border-violet-500/30 shadow-sm hover:shadow-lg transition-all h-[200px] flex flex-col group"
                        >
                          <CardHeader className="flex flex-row items-start gap-3 p-4">
                            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${item.type === 'research_paper' ? 'from-violet-500 to-purple-600' : 'from-pink-500 to-rose-500'} text-white shadow-md flex-shrink-0`}>
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <Badge variant="outline" className="text-[10px] mb-2 capitalize">
                                {item.type === 'research_paper' ? 'Research Paper' : 'Blog Post'}
                              </Badge>
                              <CardTitle className="text-sm font-semibold line-clamp-2 leading-tight">{item.title}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent className="flex-1 flex flex-col justify-between p-4 pt-0">
                            <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                            <div className="flex items-center justify-between mt-3">
                              {item.provider && (
                                <span className="text-xs text-muted-foreground truncate max-w-[120px]">{item.provider}</span>
                              )}
                              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-violet-500 transition-colors flex-shrink-0" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-muted/30 rounded-2xl">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No blogs or papers yet</h3>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">
                      Add blog posts and research papers through the admin panel to see them here based on user interests.
                    </p>
                  </div>
                )}
              </section>
            </TabsContent>

            {/* === Trending Resources Section === */}
            <TabsContent value="resources">
              <section>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-orange-500/10">
                      <BookOpen className="h-6 w-6 text-orange-500" />
                    </div>
                    Trending Resources
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Featured learning resources handpicked for you
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {personalizedData.trendingResources.map((scoredRes, i) => {
                    const res = scoredRes.item;
                    const IconComponent = iconMap[res.icon] || BookOpen;
                    return (
                      <motion.div 
                        key={i} 
                        initial="hidden"
                        animate="visible"
                        custom={i}
                        variants={cardVariants}
                        whileHover={{ y: -4, scale: 1.02 }} 
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Card
                          onClick={() => window.open(res.link, "_blank")}
                          className="cursor-pointer bg-card hover:bg-card/80 border border-border/50 hover:border-orange-500/30 shadow-sm hover:shadow-lg transition-all h-[180px] flex flex-col group"
                        >
                          <CardHeader className="flex flex-row items-start gap-3 p-4">
                            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${res.color} text-white shadow-md flex-shrink-0`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-sm font-semibold line-clamp-2 leading-tight">{res.title}</CardTitle>
                              {scoredRes.reasons[0] && (
                                <Badge className="mt-1 text-[10px] bg-orange-500/10 text-orange-600 border-0">{scoredRes.reasons[0]}</Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="flex-1 flex flex-col justify-between p-4 pt-0">
                            <p className="text-xs text-muted-foreground line-clamp-2">{res.description}</p>
                            <div className="flex items-center justify-end mt-2">
                              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-orange-500 transition-colors" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            </TabsContent>
          </Tabs>

          {/* === Footer === */}
          <footer className="mt-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-sm text-muted-foreground">
              <Rocket className="h-4 w-4 text-primary" />
              Explore. Learn. Grow. — Powered by SkillMetrics AI
            </div>
          </footer>
        </div>
      </div>
    </Layout>
  );
}

export default Explore;
