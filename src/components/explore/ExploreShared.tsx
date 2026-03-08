import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen, Brain, Cloud, Database, Globe, Shield, TrendingUp, Zap,
  Laptop, Layers, Rocket, Award, GraduationCap, Code, PenTool,
  MessageSquare, FileText,
} from "lucide-react";

// Shared icon map used across explore tabs
export const iconMap: Record<string, React.ElementType> = {
  BookOpen, Brain, Cloud, Database, Globe, Shield, TrendingUp, Zap,
  Laptop, Layers, Rocket, Award, GraduationCap, Code, PenTool,
  MessageSquare, FileText,
};

// Card animation variants
export const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

// Loading skeleton for card grids
export function CardGridSkeleton({ count = 6, height = "h-[200px]" }: { count?: number; height?: string }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={`${height} rounded-xl`} />
      ))}
    </div>
  );
}

// Loading skeleton for swiper carousels
export function SwiperSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-hidden pb-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-[200px] min-w-[280px] rounded-xl flex-shrink-0" />
      ))}
    </div>
  );
}

// Empty state component
export function EmptyState({ icon: Icon, title, description, children }: { icon: React.ElementType; title: string; description: string; children?: React.ReactNode }) {
  return (
    <div className="text-center py-16 bg-muted/30 rounded-2xl">
      <Icon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-md mx-auto">{description}</p>
      {children}
    </div>
  );
}
