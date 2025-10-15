import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { fetchRecommendations, Recommendation } from "@/api/searchAPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const SkillView = () => {
  const { skill } = useParams<{ skill: string }>();
  const [loading, setLoading] = useState(false);
  const [recs, setRecs] = useState<Recommendation[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!skill) return;
      setLoading(true);
      try {
        const results = await fetchRecommendations(decodeURIComponent(skill));
        if (!mounted) return;
        setRecs(results);
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setRecs([]);
      }
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [skill]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{skill ? decodeURIComponent(skill) : 'Skill'}</h1>
              <p className="text-muted-foreground mt-2">Curated resources, videos and books for {skill ? decodeURIComponent(skill) : 'this skill'}.</p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/search" className="text-sm text-muted-foreground hover:underline">Back to search</Link>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading recommendations...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recs.map((item, idx) => (
              <Card key={idx} className="shadow-card hover:shadow-elevated transition-all duration-200">
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {item.description && <p className="text-sm text-muted-foreground mb-3">{item.description}</p>}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">{item.provider || item.type}</div>
                    <Button asChild variant="outline" size="sm">
                      <a href={item.url} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2 inline-block" /> Visit
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SkillView;
