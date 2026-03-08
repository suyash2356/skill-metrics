import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Star, PackagePlus, Loader2, Eye, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cardVariants } from "./ExploreShared";

interface CommunityTabProps {
  approvedResources: any[];
  isLoadingApproved: boolean;
}

export function CommunityTab({ approvedResources, isLoadingApproved }: CommunityTabProps) {
  const navigate = useNavigate();

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10">
              <Users className="h-6 w-6 text-teal-500" />
            </div>
            Community Resources
          </h2>
          <p className="text-muted-foreground mt-2">Educational resources shared by the community</p>
        </div>
        <Button onClick={() => navigate("/share-resource")} className="gap-2">
          <PackagePlus className="h-4 w-4" />
          Share a Resource
        </Button>
      </div>

      {isLoadingApproved ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : approvedResources.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-2xl">
          <PackagePlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No community resources yet</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
            Be the first to share an educational resource with the community!
          </p>
          <Button onClick={() => navigate("/share-resource")}>Share a Resource</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {approvedResources.map((resource, i) => (
            <motion.div key={resource.id} initial="hidden" animate="visible" custom={i} variants={cardVariants} whileHover={{ y: -4, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card
                onClick={() => navigate(`/resources/${resource.id}`)}
                className="cursor-pointer bg-card hover:bg-card/80 border border-border/50 hover:border-teal-500/30 shadow-sm hover:shadow-lg transition-all h-[220px] flex flex-col group"
              >
                <CardHeader className="flex flex-row items-start gap-3 p-4 pb-2">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-md flex-shrink-0">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[10px] capitalize border-teal-500/30 text-teal-600">{resource.resource_type}</Badge>
                      {resource.avg_rating && (
                        <div className="flex items-center gap-1 text-[10px] text-amber-500">
                          <Star className="h-3 w-3 fill-amber-500" />
                          {Number(resource.avg_rating).toFixed(1)}
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-sm font-semibold line-clamp-2 leading-tight">{resource.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between p-4 pt-0">
                  <p className="text-xs text-muted-foreground line-clamp-2">{resource.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="capitalize text-[10px]">{resource.difficulty}</Badge>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{resource.view_count}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-teal-500 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
