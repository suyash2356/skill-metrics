import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Globe, GraduationCap, ArrowRight, Brain, BookOpen } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import { motion } from "framer-motion";
import { iconMap, cardVariants, SwiperSkeleton, EmptyState } from "./ExploreShared";
import type { PersonalizedExploreData } from "@/hooks/usePersonalizedExplore";

interface PopularTabProps {
  personalizedData: PersonalizedExploreData;
  onExploreClick: (title: string) => void;
}

export function PopularTab({ personalizedData, onExploreClick }: PopularTabProps) {
  if (personalizedData.isLoading) {
    return (
      <div className="space-y-10">
        {[1, 2, 3].map((i) => (
          <section key={i}>
            <Skeleton className="h-8 w-64 mb-6" />
            <SwiperSkeleton />
          </section>
        ))}
      </div>
    );
  }

  if (
    personalizedData.techCategories.length === 0 &&
    personalizedData.nonTechCategories.length === 0 &&
    personalizedData.exams.length === 0
  ) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="No categories available"
        description="Check back soon — we're adding new learning categories regularly!"
      />
    );
  }

  return (
    <div className="space-y-10">
      {/* Tech Categories */}
      {personalizedData.techCategories.length > 0 && (
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
                  <motion.div initial="hidden" animate="visible" custom={idx} variants={cardVariants}>
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
                          onClick={(e) => { e.stopPropagation(); onExploreClick(category.title); }}
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
      )}

      {/* Non-Tech Fields */}
      {personalizedData.nonTechCategories.length > 0 && (
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
                  <motion.div initial="hidden" animate="visible" custom={idx} variants={cardVariants}>
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
                          onClick={(e) => { e.stopPropagation(); onExploreClick(category.title); }}
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
      )}

      {/* Popular Exams */}
      {personalizedData.exams.length > 0 && (
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
                  <motion.div initial="hidden" animate="visible" custom={idx} variants={cardVariants}>
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
                          onClick={(e) => { e.stopPropagation(); onExploreClick(exam.title); }}
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
      )}
    </div>
  );
}
