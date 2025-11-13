import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play, Clock, Eye, Heart, Filter } from "lucide-react";
import { videos } from "@/lib/videosData";

const NewVideos = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
  "All",
  "Programming",
  "AI/ML",
  "Design",
  "Data Science",
  "Finance",
  "Psychology",
  "Science",
  "Motivation",
  "Career",
  "Productivity",
  "Wellbeing",
  "Exam Prep",
  "Education",
  "Business",
  "Technology"
];


  // Videos imported from shared data file



  const filteredVideos = activeCategory === "All"
    ? videos
    : videos.filter((v) => v.category === activeCategory);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">New Videos</h1>
            <p className="text-muted-foreground">
              Helpful and trending educational videos
            </p>
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={category === activeCategory ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground whitespace-nowrap"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card
              key={video.id}
              className="shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer"
            >
              <CardContent className="p-0">
                {/* Embedded YouTube Video */}
                <div className="relative">
                  <iframe
                    className="w-full h-48 rounded-t-lg"
                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>

                  <Badge className="absolute top-2 left-2" variant="secondary">
                    {video.category}
                  </Badge>

                  <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-2 leading-tight line-clamp-2">
                    {video.title}
                  </h3>

                  <div className="flex items-center space-x-2 mb-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={video.channel_avatar} />
                      <AvatarFallback>
                        {(video.channel || "C")[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      {video.channel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {video.views}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {video.upload_time}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-auto p-0">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More placeholder */}
        <div className="text-center py-8">
          <Button variant="outline" className="w-full max-w-sm">
            Loaded
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NewVideos;
