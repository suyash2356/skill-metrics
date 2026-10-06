import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight, BookOpen, Clock, GraduationCap, Star } from "lucide-react";

export interface ResourcePreviewData {
  title: string;
  description?: string | null;
  link?: string | null;
  type?: string | null;
  provider?: string | null;
  category?: string | null;
  difficulty?: string | null;
  estimatedTime?: string | null;
  duration?: string | null;
  cost?: string | null;
  rating?: number | string | null;
  relatedSkills?: string[] | null;
  prerequisites?: string[] | null;
  relevantBackgrounds?: string[] | null;
}

interface ResourceDetailsDialogProps {
  resource: ResourcePreviewData | null;
  onClose: () => void;
  onContinue?: () => void;
}

function safeExternalUrl(link?: string | null): string | null {
  if (!link) return null;
  try {
    const url = new URL(link);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function DetailTags({ title, values, icon: Icon }: { title: string; values?: string[] | null; icon?: typeof BookOpen }) {
  if (!values?.length) return null;
  return (
    <section className="space-y-2">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {values.filter(Boolean).map((value) => <Badge key={value} variant="secondary">{value}</Badge>)}
      </div>
    </section>
  );
}

export function ResourceDetailsDialog({ resource, onClose, onContinue }: ResourceDetailsDialogProps) {
  const open = resource !== null;
  const externalUrl = safeExternalUrl(resource?.link);
  const description = resource?.description?.trim();
  const details = [
    resource?.provider && { label: "Provider", value: resource.provider },
    resource?.category && { label: "Category", value: resource.category },
    resource?.difficulty && { label: "Level", value: resource.difficulty },
    (resource?.estimatedTime || resource?.duration) && { label: "Time", value: resource.estimatedTime || resource.duration },
    resource?.cost && { label: "Cost", value: resource.cost },
  ].filter((item): item is { label: string; value: string } => Boolean(item));

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        {resource && (
          <>
            <DialogHeader className="space-y-3 text-left">
              <div className="flex flex-wrap items-center gap-2">
                {resource.type && <Badge variant="outline" className="capitalize">{resource.type.replaceAll("_", " ")}</Badge>}
                {resource.rating != null && String(resource.rating).trim() !== "" && (
                  <Badge variant="secondary" className="gap-1">
                    <Star className="h-3 w-3 fill-current" /> {resource.rating}
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-xl leading-snug">{resource.title}</DialogTitle>
              <DialogDescription className="whitespace-pre-line text-sm leading-6 text-foreground/80">
                {description || "A detailed description has not been added yet. Visit the provider’s page to learn more."}
              </DialogDescription>
            </DialogHeader>

            {details.length > 0 && (
              <>
                <Separator />
                <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                  {details.map((detail) => (
                    <div key={detail.label} className="min-w-0">
                      <dt className="text-xs text-muted-foreground">{detail.label}</dt>
                      <dd className="mt-1 break-words text-sm font-medium capitalize">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}

            {(resource.relatedSkills?.length || resource.prerequisites?.length || resource.relevantBackgrounds?.length) ? (
              <>
                <Separator />
                <div className="space-y-5">
                  <DetailTags title="What you’ll learn" values={resource.relatedSkills} icon={BookOpen} />
                  <DetailTags title="Prerequisites" values={resource.prerequisites} icon={GraduationCap} />
                  <DetailTags title="Suited for" values={resource.relevantBackgrounds} icon={Clock} />
                </div>
              </>
            ) : null}

            <DialogFooter className="gap-2 sm:justify-between">
              <Button variant="outline" onClick={onClose}>Close</Button>
              {onContinue ? (
                <Button onClick={onContinue}>
                  View resource <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              ) : externalUrl ? (
                <Button asChild>
                  <a href={externalUrl} target="_blank" rel="noopener noreferrer">
                    Visit resource <ArrowUpRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              ) : null}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}