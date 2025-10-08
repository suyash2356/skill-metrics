import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Users, Hash, Plus, Search as SearchIcon, ArrowRight
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const MyCommunities = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: joinedCommunities, isLoading, error } = useQuery({
    queryKey: ['joinedCommunities', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('community_members')
        .select(`
          communities (*, community_members(count))
        `)
        .eq('user_id', user.id);

      if (error) throw new Error(error.message);
      return data?.map(member => ({
        ...member.communities,
        member_count: member.communities.community_members[0].count
      })) || [];
    },
    enabled: !!user,
  });

  const filteredCommunities = joinedCommunities?.filter(community =>
    community?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community?.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold">My Communities</h1>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/communities"><Plus className="mr-2 h-4 w-4" /> Explore Communities</Link>
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your communities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {isLoading ? (
            <div className="text-center text-muted-foreground py-10">Loading communities...</div>
        ) : error ? (
             <div className="text-center text-red-500 py-10">Error: {error.message}</div>
        ) : filteredCommunities.length === 0 ? (
            <Card className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10">
              <CardContent className="flex flex-col items-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg mb-4">You haven't joined any communities yet.</p>
                <Button asChild>
                  <Link to="/communities"><SearchIcon className="mr-2 h-4 w-4" /> Discover Communities</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map((community: any) => (
                <Card key={community.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                  <CardContent className="p-6 flex flex-col items-start flex-grow">
                    <Avatar className="h-16 w-16 mb-4">
                      <AvatarImage src={community.avatar_url || `/placeholder.svg`} alt={community.name} />
                      <AvatarFallback>{community.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold mb-2">{community.name}</h2>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">{community.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                      <Hash className="h-4 w-4" /> <span>{community.topic || 'General'}</span>
                      <Users className="h-4 w-4 ml-4" /> <span>{community.member_count || 0} members</span>
                    </div>
                    <Button asChild className="mt-auto w-full">
                      <Link to={`/communities/${community.id}/feed`}>View Community <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
        )}
      </div>
    </Layout>
  );
};

export default MyCommunities;
