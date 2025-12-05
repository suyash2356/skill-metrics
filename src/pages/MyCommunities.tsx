import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AddCommunityLinkDialog } from "@/components/AddCommunityLinkDialog";
import { useExternalCommunityLinks } from "@/hooks/useExternalCommunityLinks";
import { X, ExternalLink } from "lucide-react";

const MyCommunities = () => {
    const { links: myCommunityLinks, isLoading, deleteLink } = useExternalCommunityLinks();

    return (
        <Layout>
            <div className="container max-w-2xl mx-auto py-6 px-4">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <h1 className="text-2xl font-bold">My Communities</h1>
                    <AddCommunityLinkDialog />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Your Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="text-center py-8 text-muted-foreground">Loading communities...</div>
                            ) : myCommunityLinks.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                        <ExternalLink className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-medium mb-1">No communities yet</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Add links to your favorite Discord servers, Slack workspaces, or forums.
                                    </p>
                                    <AddCommunityLinkDialog />
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {myCommunityLinks.map((c: any) => (
                                        <div
                                            key={c.id}
                                            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
                                        >
                                            <a
                                                href={c.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 flex-1 min-w-0"
                                            >
                                                <Avatar className="h-10 w-10 shrink-0 border">
                                                    <AvatarFallback className="bg-primary/10 text-primary">
                                                        {(c.name || 'C')[0].toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium truncate">{c.name}</div>
                                                    <div className="text-xs text-muted-foreground flex items-start gap-1 min-w-0">
                                                        <span className="break-all flex-1 min-w-0">{c.link}</span>
                                                        <ExternalLink className="h-3 w-3 shrink-0 mt-0.5" />
                                                    </div>
                                                </div>
                                            </a>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0 ml-2"
                                                onClick={() => deleteLink.mutate(c.id)}
                                                aria-label="Delete link"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default MyCommunities;
