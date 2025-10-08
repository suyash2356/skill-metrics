import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MessageCircle, TrendingUp, Plus, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useCommunityMembership } from "@/hooks/useCommunityMembership";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const Communities = () => {
  const { user } = useAuth();

  const { data: communities, isLoading: isLoadingCommunities, error: communitiesError } = useQuery({
    queryKey: ['communities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select(`
          *,
          community_members(count)
        `)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw new Error(error.message);
      return data?.map(comm => ({
        ...comm,
        member_count: comm.community_members[0]?.count || 0
      })) || [];
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  if (isLoadingCommunities) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (communitiesError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">Error loading communities: {communitiesError.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Find your community</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover and join communities to learn, share knowledge, and connect with peers.
        </p>
      </div>

      {/* Search and Create */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search communities..." className="pl-10" />
        </div>
        <Button className="flex-shrink-0">
          <Plus className="h-5 w-5 mr-2" />
          Create Community
        </Button>
      </div>

      {/* Popular Topics */}
      <div className="mb-12 text-center">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">POPULAR TOPICS</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {["React", "Python", "Machine Learning", "UI/UX", "DevOps", "Data Science", "Productivity"].map((topic) => (
            <Badge key={topic} variant="outline" className="text-base py-1 px-3 cursor-pointer hover:bg-accent">
              {topic}
            </Badge>
          ))}
        </div>
      </div>

      {/* Community Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(communities || []).map((community: any) => (
          <CommunityCard key={community.id} community={community} />
        ))}
      </div>
    </div>
  );
};

interface CommunityCardProps {
  community: any;
}

const CommunityCard = ({ community }: CommunityCardProps) => {
  const { isMember, isLoadingMembershipStatus, toggleMembership } = useCommunityMembership(community.id);
  const { user } = useAuth();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${community.image || 'https://source.unsplash.com/random/400x200?community'})` }}></div>
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex items-center mb-3">
          <Avatar className="h-10 w-10 mr-3 border-2 border-background">
            <AvatarImage src={community.avatar_url || ''} />
            <AvatarFallback>{community.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg leading-tight">{community.name}</h3>
            <Badge variant="secondary" className="text-xs mt-1">{community.category || 'General'}</Badge>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mb-4 flex-grow">
          {community.description}
        </p>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 pt-4 border-t">
          <span className="flex items-center">
            <Users className="h-4 w-4 mr-1.5" />
            {community.member_count} members
          </span>
          <span className="flex items-center">
            <MessageCircle className="h-4 w-4 mr-1.5" />
            {(community.posts_count || 0)} posts/wk
          </span>
        </div>

        <Button 
          asChild={isMember}
          variant={isMember ? 'secondary' : 'default'}
          onClick={() => !isMember && toggleMembership()}
          disabled={isLoadingMembershipStatus || !user}
          className="w-full mt-auto"
        >
          {isMember ? <Link to={`/communities/${community.id}/feed`}>Open</Link> : 'Join Community'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Communities;
