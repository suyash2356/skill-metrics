import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Globe, GraduationCap, ArrowRight, Brain, BookOpen } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { iconMap, cardVariants, SwiperSkeleton, EmptyState } from "./ExploreShared";
import type { PersonalizedExploreData } from "@/hooks/usePersonalizedExplore";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/autoplay";

interface PopularTabProps {
  personalizedData: PersonalizedExploreData;
  onExploreClick: (title: string) => void;
}

function CategoryCard({
  title,
  description,
  icon: IconComponent,
  color,
  reason,
  accentColor,
  onExplore,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  reason?: string;
  accentColor: string;
  onExplore: () => void;
}) {
  return (
    <Card className={`group cursor-pointer overflow-hidden bg-card hover:bg-card/80 border border-border/50 hover:border-${accentColor}/30 shadow-sm hover:shadow-xl transition-all duration-300 h-[210px] flex flex-col`}>
      <CardHeader className="flex flex-row items-start gap-3 p-4 pb-2">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${color} text-white shadow-md flex-shrink-0`}>
          <IconComponent className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <CardTitle className="text-base font-bold line-clamp-1">{title}</CardTitle>
          {reason && (
            <Badge variant="secondary" className={`text-[10px] mt-1 bg-${accentColor}/10 text-${accentColor} border-0`}>
              {reason}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between p-4 pt-0">
        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{description}</p>
        <Button
          variant="ghost"
          size="sm"
          className={`mt-3 w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors`}
          onClick={(e) => { e.stopPropagation(); onExplore(); }}
        >
          Explore
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}

const swiperBreakpoints = {
  0: { slidesPerView: 1.2, spaceBetween: 12 },
  480: { slidesPerView: 1.5, spaceBetween: 14 },
  640: { slidesPerView: 2.2, spaceBetween: 16 },
  1024: { slidesPerView: 3.2, spaceBetween: 16 },
  1280: { slidesPerView: 4.2, spaceBetween: 16 },
};

export function PopularTab({ personalizedData, onExploreClick }: PopularTabProps) {
  if (personalizedData.isLoading) {
    return (
      <div className="space-y-10">
        {[1, 2, 3].map((i) => (
          <section key={i}>
            <div className="h-8 w-64 bg-muted rounded-lg animate-pulse mb-6" />
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
            modules={[Autoplay, FreeMode, Pagination]}
            autoplay={{ delay: 3500, disableOnInteraction: true, pauseOnMouseEnter: true }}
            loop={personalizedData.techCategories.length > 3}
            freeMode={{ enabled: true, sticky: true }}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={swiperBreakpoints}
            className="pb-10 !overflow-visible"
            style={{ overflow: "clip visible" } as any}
          >
            {personalizedData.techCategories.map((scoredCategory, idx) => {
              const category = scoredCategory.item;
              const IconComponent = iconMap[category.icon] || Brain;
              return (
                <SwiperSlide key={idx} className="!h-auto">
                  <motion.div initial="hidden" animate="visible" custom={idx} variants={cardVariants}>
                    <CategoryCard
                      title={category.title}
                      description={category.description}
                      icon={IconComponent}
                      color={category.color}
                      reason={scoredCategory.reasons[0]}
                      accentColor="primary"
                      onExplore={() => onExploreClick(category.title)}
                    />
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
            modules={[Autoplay, FreeMode, Pagination]}
            autoplay={{ delay: 3500, disableOnInteraction: true, pauseOnMouseEnter: true, reverseDirection: true }}
            loop={personalizedData.nonTechCategories.length > 3}
            freeMode={{ enabled: true, sticky: true }}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={swiperBreakpoints}
            className="pb-10 !overflow-visible"
          >
            {personalizedData.nonTechCategories.map((scoredCategory, idx) => {
              const category = scoredCategory.item;
              const IconComponent = iconMap[category.icon] || BookOpen;
              return (
                <SwiperSlide key={`nontech-${idx}`} className="!h-auto">
                  <motion.div initial="hidden" animate="visible" custom={idx} variants={cardVariants}>
                    <CategoryCard
                      title={category.title}
                      description={category.description}
                      icon={IconComponent}
                      color={category.color}
                      reason={scoredCategory.reasons[0]}
                      accentColor="emerald-500"
                      onExplore={() => onExploreClick(category.title)}
                    />
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
            modules={[Autoplay, FreeMode, Pagination]}
            autoplay={{ delay: 3500, disableOnInteraction: true, pauseOnMouseEnter: true }}
            loop={personalizedData.exams.length > 3}
            freeMode={{ enabled: true, sticky: true }}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={swiperBreakpoints}
            className="pb-10 !overflow-visible"
          >
            {personalizedData.exams.map((scoredExam, idx) => {
              const exam = scoredExam.item;
              return (
                <SwiperSlide key={`exam-${idx}`} className="!h-auto">
                  <motion.div initial="hidden" animate="visible" custom={idx} variants={cardVariants}>
                    <CategoryCard
                      title={exam.title}
                      description={exam.description}
                      icon={GraduationCap}
                      color={exam.color}
                      reason={scoredExam.reasons[0]}
                      accentColor="amber-500"
                      onExplore={() => onExploreClick(exam.title)}
                    />
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
