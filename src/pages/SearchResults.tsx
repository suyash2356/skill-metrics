// pages/SearchResults.tsx
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  ExternalLink, 
  Youtube, 
  Globe, 
  MessageSquare, 
  GraduationCap 
} from "lucide-react";
import { fetchRecommendations, Recommendation } from "@/api/searchAPI";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    const getRecommendations = async () => {
      setLoading(true);
      try {
        const res = await fetchRecommendations(query);
        setRecommendations(res);
      } catch (err) {
        console.error(err);
        setRecommendations([]);
      }
      setLoading(false);
    };
    getRecommendations();
  }, [query]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "youtube": return Youtube;
      case "book": return BookOpen;
      case "course": return GraduationCap;
      case "website": return Globe;
      case "reddit": return MessageSquare;
      case "discord": return MessageSquare;
      case "blog": return BookOpen;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "youtube": return "bg-red-500";
      case "book": return "bg-green-500";
      case "course": return "bg-blue-500";
      case "website": return "bg-purple-500";
      case "reddit": return "bg-orange-500";
      case "discord": return "bg-indigo-500";
      case "blog": return "bg-pink-500";
      default: return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <p className="text-lg text-muted-foreground">Loading recommendations...</p>
        </div>
      </Layout>
    );
  }

  if (!recommendations.length) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <h1 className="text-3xl font-bold mb-4">Search results for "{query}"</h1>
          <p className="text-muted-foreground text-lg">No recommendations found. Try another topic.</p>
        </div>
      </Layout>
    );
  }

  const types = ["youtube","book","course","website","reddit","discord","blog"];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search results for "{query}"</h1>
          <p className="text-muted-foreground">Found {recommendations.length} resources</p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all">All</TabsTrigger>
            {types.map((type) => (
              <TabsTrigger key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* All Recommendations */}
          <TabsContent value="all" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((item, index) => {
                const Icon = getTypeIcon(item.type);
                return (
                  <Card key={index} className="shadow-card hover:shadow-elevated transition-all duration-300">
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className={`w-10 h-10 ${getTypeColor(item.type)} rounded-lg flex items-center justify-center`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <Badge variant="outline" className="text-xs capitalize">{item.type}</Badge>
                        </div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        {item.description && <p className="text-muted-foreground text-sm">{item.description}</p>}
                        {item.author && <p className="text-muted-foreground text-sm">Author: {item.author}</p>}
                        {item.provider && <p className="text-muted-foreground text-sm">Provider: {item.provider}</p>}
                        {item.duration && <p className="text-muted-foreground text-sm">Duration: {item.duration}</p>}
                        {item.rating && <p className="text-muted-foreground text-sm">Rating: {item.rating}</p>}
                      </div>
                      <Button 
                        asChild
                        variant="outline" 
                        className="w-full mt-4"
                      >
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2 inline-block" /> Visit
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Individual type tabs */}
          {types.map((type) => (
            <TabsContent key={type} value={type} className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.filter(item => item.type === type).map((item, index) => {
                  const Icon = getTypeIcon(item.type);
                  return (
                    <Card key={index} className="shadow-card hover:shadow-elevated transition-all duration-300">
                      <CardContent className="p-6 flex flex-col justify-between h-full">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className={`w-10 h-10 ${getTypeColor(item.type)} rounded-lg flex items-center justify-center`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <Badge variant="outline" className="text-xs capitalize">{item.type}</Badge>
                          </div>
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                          {item.description && <p className="text-muted-foreground text-sm">{item.description}</p>}
                          {item.author && <p className="text-muted-foreground text-sm">Author: {item.author}</p>}
                          {item.provider && <p className="text-muted-foreground text-sm">Provider: {item.provider}</p>}
                          {item.duration && <p className="text-muted-foreground text-sm">Duration: {item.duration}</p>}
                          {item.rating && <p className="text-muted-foreground text-sm">Rating: {item.rating}</p>}
                        </div>
                        <Button 
                          asChild
                          variant="outline" 
                          className="w-full mt-4"
                        >
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2 inline-block" /> Visit
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
};

export default SearchResults;
