import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, BookOpen, Star, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { cardVariants, CardGridSkeleton, EmptyState } from "./ExploreShared";

interface BlogsTabProps {
  blogsAndPapers: any[] | undefined;
  blogsLoading: boolean;
}

export function BlogsTab({ blogsAndPapers, blogsLoading }: BlogsTabProps) {
  return (
    <section>
      <div className="mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/10">
            <FileText className="h-6 w-6 text-violet-500" />
          </div>
          Blogs & Research Papers
        </h2>
        <p className="text-muted-foreground mt-2">
          Curated research papers and blog posts personalized to your interests and learning goals
        </p>
      </div>

      {blogsLoading ? (
        <CardGridSkeleton count={6} height="h-[220px]" />
      ) : blogsAndPapers && blogsAndPapers.length > 0 ? (
        <div className="space-y-8">
          {/* Research Papers */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-violet-500/10">
                <FileText className="h-4 w-4 text-violet-500" />
              </div>
              Research Papers
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {blogsAndPapers.filter(item => item.type === 'research_paper').slice(0, 6).map((item: any, i) => (
                <motion.div key={`paper-${i}`} initial="hidden" animate="visible" custom={i} variants={cardVariants} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card onClick={() => window.open(item.link, "_blank")} className="cursor-pointer bg-card hover:bg-card/80 border border-border/50 hover:border-violet-500/30 shadow-sm hover:shadow-lg transition-all h-[220px] flex flex-col group">
                    <CardHeader className="flex flex-row items-start gap-3 p-4 pb-2">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md flex-shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-[10px] border-violet-500/30 text-violet-600">Research Paper</Badge>
                          {item.rating && (
                            <div className="flex items-center gap-1 text-[10px] text-amber-500">
                              <Star className="h-3 w-3 fill-amber-500" />{item.rating}
                            </div>
                          )}
                        </div>
                        <CardTitle className="text-sm font-semibold line-clamp-2 leading-tight">{item.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between p-4 pt-0">
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                      <div className="space-y-2 mt-2">
                        {item.matchReason && <Badge className="text-[10px] bg-violet-500/10 text-violet-600 border-0">{item.matchReason}</Badge>}
                        <div className="flex items-center justify-between">
                          {item.provider && <span className="text-xs text-muted-foreground truncate max-w-[120px]">{item.provider}</span>}
                          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-violet-500 transition-colors flex-shrink-0" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            {blogsAndPapers.filter(item => item.type === 'research_paper').length === 0 && (
              <p className="text-center text-muted-foreground py-8">No research papers available yet</p>
            )}
          </div>

          {/* Blog Posts */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-pink-500/10">
                <BookOpen className="h-4 w-4 text-pink-500" />
              </div>
              Blog Posts & Articles
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {blogsAndPapers.filter(item => item.type === 'blog').slice(0, 9).map((item: any, i) => (
                <motion.div key={`blog-${i}`} initial="hidden" animate="visible" custom={i} variants={cardVariants} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card onClick={() => window.open(item.link, "_blank")} className="cursor-pointer bg-card hover:bg-card/80 border border-border/50 hover:border-pink-500/30 shadow-sm hover:shadow-lg transition-all h-[220px] flex flex-col group">
                    <CardHeader className="flex flex-row items-start gap-3 p-4 pb-2">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-md flex-shrink-0">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-[10px] border-pink-500/30 text-pink-600">Blog Post</Badge>
                          {item.rating && (
                            <div className="flex items-center gap-1 text-[10px] text-amber-500">
                              <Star className="h-3 w-3 fill-amber-500" />{item.rating}
                            </div>
                          )}
                        </div>
                        <CardTitle className="text-sm font-semibold line-clamp-2 leading-tight">{item.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between p-4 pt-0">
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                      <div className="space-y-2 mt-2">
                        {item.matchReason && <Badge className="text-[10px] bg-pink-500/10 text-pink-600 border-0">{item.matchReason}</Badge>}
                        <div className="flex items-center justify-between">
                          {item.provider && <span className="text-xs text-muted-foreground truncate max-w-[120px]">{item.provider}</span>}
                          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-pink-500 transition-colors flex-shrink-0" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            {blogsAndPapers.filter(item => item.type === 'blog').length === 0 && (
              <p className="text-center text-muted-foreground py-8">No blog posts available yet</p>
            )}
          </div>
        </div>
      ) : (
        <EmptyState icon={FileText} title="No blogs or papers yet" description="Complete your onboarding to get personalized blog and research paper recommendations!" />
      )}
    </section>
  );
}
