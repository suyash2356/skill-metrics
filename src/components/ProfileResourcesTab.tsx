import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, ExternalLink } from "lucide-react";
import { useUserResources } from "@/hooks/useUserResources";
import { useNavigate } from "react-router-dom";

export const ProfileResourcesTab = ({ userId }: { userId?: string }) => {
  const { userPublicResources, isLoadingUserPublic } = useUserResources(userId);
  const navigate = useNavigate();

  if (isLoadingUserPublic) {
    return <Card><CardContent className="py-8 text-center text-muted-foreground">Loading resources...</CardContent></Card>;
  }

  if (userPublicResources.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <p className="text-lg font-medium">No shared resources yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {userPublicResources.map(resource => (
        <Card
          key={resource.id}
          className="cursor-pointer hover:border-primary/50 transition-all"
          onClick={() => navigate(`/resources/${resource.id}`)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-sm line-clamp-2">{resource.title}</CardTitle>
              <Badge variant="secondary" className="capitalize text-xs ml-2 flex-shrink-0">{resource.resource_type}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{resource.description}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {resource.avg_rating && (
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  {Number(resource.avg_rating).toFixed(1)}
                </span>
              )}
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {resource.view_count}</span>
              <Badge variant="outline" className="capitalize text-[10px]">{resource.difficulty}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
