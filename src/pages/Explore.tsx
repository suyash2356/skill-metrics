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

function Explore() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  // activeTab state is only used to reflect current tab; Tabs component handles visuals
  const [activeTab, setActiveTab] = useState("popular");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/search?q=${encodeURIComponent(category)}`);
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-l-lg border border-gray-300 focus-visible:ring-indigo-500"
            />
            <Button
              type="submit"
              className="rounded-l-none bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Search
            </Button>
          </form>
        </section>

        {/* Tabs for Explore Sections */}
        <Tabs defaultValue="popular" onValueChange={(v) => setActiveTab(v)} className="space-y-8">
          <TabsList className="flex justify-center bg-transparent gap-2">
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
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
                  },
                  {
                    title: "Data Science",
                    icon: Database,
                    color: "from-blue-500 to-cyan-500",
                    description: "Analyze data, visualize insights, and build predictive models.",
                  },
                  {
                    title: "Cloud Computing",
                    icon: Cloud,
                    color: "from-sky-500 to-indigo-500",
                    description: "Master AWS, Azure, and Google Cloud to scale systems globally.",
                  },
                  {
                    title: "Cybersecurity",
                    icon: Shield,
                    color: "from-rose-500 to-red-500",
                    description: "Protect data and networks using ethical hacking and security tools.",
                  },
                  {
                    title: "Blockchain",
                    icon: Layers,
                    color: "from-amber-500 to-orange-500",
                    description: "Dive into Web3, smart contracts, and decentralized finance.",
                  },
                  {
                    title: "DevOps",
                    icon: Zap,
                    color: "from-green-500 to-emerald-500",
                    description: "Automate deployments, CI/CD pipelines, and Kubernetes clusters.",
                  },
                  {
                    title: "Software Development",
                    icon: Laptop,
                    color: "from-purple-600 to-pink-500",
                    description: "Build modern apps with React, Node.js, and full-stack tools.",
                  },
                  {
                    title: "Product Management",
                    icon: Rocket,
                    color: "from-indigo-600 to-sky-500",
                    description: "Learn agile strategy, user research, and product execution.",
                  },
                ].map((category, idx) => (
                  <SwiperSlide key={idx}>
                    <Card
                      onClick={() => handleCategoryClick(category.title)}
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
                          onClick={() => handleCategoryClick(category.title)}
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
                      link: '',
                    },
                    {
                      title: 'Business & Management',
                      icon: Map,
                      color: 'from-indigo-500 to-sky-500',
                      description: 'Strategy, operations, and leadership skills.',
                      link: '',
                    },
                    {
                      title: 'Creative Writing',
                      icon: BookOpen,
                      color: 'from-amber-500 to-orange-500',
                      description: 'Storytelling, content creation and editing.',
                      link: '',
                    },
                    {
                      title: 'Marketing',
                      icon: TrendingUp,
                      color: 'from-green-500 to-emerald-500',
                      description: 'Digital marketing, branding and growth tactics.',
                      link: '',
                    },
                    {
                      title: 'Photography',
                      icon: Globe,
                      color: 'from-violet-500 to-purple-500',
                      description: 'Capture, edit and present compelling images.',
                      link: '',
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
                            onClick={() => { if (category.link) window.open(category.link, '_blank'); else handleCategoryClick(category.title); }}
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
                    { title: 'GRE', icon: GraduationCap, color: 'from-indigo-500 to-blue-500', description: 'Graduate record examinations prep.', link: '' },
                    { title: 'GMAT', icon: GraduationCap, color: 'from-green-500 to-emerald-500', description: 'Business school entrance test prep.', link: '' },
                    { title: 'CAT', icon: GraduationCap, color: 'from-rose-500 to-red-500', description: 'Management entrance exam prep.', link: '' },
                    { title: 'JEE', icon: GraduationCap, color: 'from-yellow-500 to-amber-500', description: 'Engineering entrance exam prep.', link: '' },
                    { title: 'NEET', icon: GraduationCap, color: 'from-pink-500 to-purple-500', description: 'Medical entrance exam prep.', link: '' },
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
                            onClick={() => { if (exam.link) window.open(exam.link, '_blank'); else handleCategoryClick(exam.title); }}
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

          {/* === Categories Section (static grid as alternative view) === */}
          <TabsContent value="categories">
            <section>
              <h2 className="text-2xl font-bold mb-4">All Categories</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  "Artificial Intelligence",
                  "Data Science",
                  "Cloud Computing",
                  "Cybersecurity",
                  "Blockchain",
                  "DevOps",
                  "Software Development",
                  "Product Management",
                ].map((cat) => (
                  <motion.div whileHover={{ y: -4 }} key={cat}>
                    <Card
                      onClick={() => handleCategoryClick(cat)}
                      className="cursor-pointer p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{cat}</h3>
                          <p className="text-sm text-muted-foreground mt-1">Top courses, books & channels</p>
                        </div>
                        <div className="text-muted-foreground">
                          <Badge variant="secondary">Top</Badge>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
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
                  },
                  {
                    title: "AI Engineer Roadmap",
                    steps: 9,
                    duration: "8 months",
                    icon: Brain,
                    color: "from-purple-500 to-indigo-500",
                  },
                  {
                    title: "Full-Stack Developer",
                    steps: 10,
                    duration: "9 months",
                    icon: Laptop,
                    color: "from-pink-500 to-rose-500",
                  },
                  {
                    title: "Cybersecurity Expert",
                    steps: 8,
                    duration: "7 months",
                    icon: Shield,
                    color: "from-red-500 to-orange-500",
                  },
                  {
                    title: "Cloud & DevOps Engineer",
                    steps: 6,
                    duration: "5 months",
                    icon: Cloud,
                    color: "from-sky-500 to-indigo-500",
                  },
                  {
                    title: "Product Manager",
                    steps: 5,
                    duration: "4 months",
                    icon: Rocket,
                    color: "from-indigo-600 to-purple-600",
                  },
                ].map((path, idx) => (
                  <motion.div key={idx} whileHover={{ scale: 1.04 }} transition={{ type: "spring", stiffness: 250 }}>
                    <Card className="bg-gradient-to-br from-background to-muted border-0 shadow-md hover:shadow-xl transition-all duration-500">
                      <CardHeader className="flex items-center gap-3">
                        <div className={`p-3 rounded-full bg-gradient-to-r ${path.color} text-white shadow-lg`}>
                          <path.icon className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-lg font-bold">{path.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">{path.steps} Steps • {path.duration}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full hover:bg-green-600 hover:text-white transition-colors"
                          onClick={() => handleCategoryClick(path.title.toLowerCase())}
                        >
                          Start Path
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
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
