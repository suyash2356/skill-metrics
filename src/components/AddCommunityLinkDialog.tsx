import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ExternalLink, Trash2, Pencil } from "lucide-react";
import { useExternalCommunityLinks, ExternalCommunityLink } from "@/hooks/useExternalCommunityLinks";

export function AddCommunityLinkDialog() {
  const [open, setOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ExternalCommunityLink | null>(null);
  const [formData, setFormData] = useState({ name: "", link: "", description: "" });
  
  const { links, isLoading, addLink, updateLink, deleteLink } = useExternalCommunityLinks();

  const resetForm = () => {
    setFormData({ name: "", link: "", description: "" });
    setEditingLink(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.link.trim()) return;

    if (editingLink) {
      updateLink.mutate({ 
        id: editingLink.id, 
        name: formData.name, 
        link: formData.link, 
        description: formData.description || undefined 
      });
    } else {
      addLink.mutate({ 
        name: formData.name, 
        link: formData.link, 
        description: formData.description || undefined 
      });
    }
    resetForm();
  };

  const handleEdit = (link: ExternalCommunityLink) => {
    setEditingLink(link);
    setFormData({ 
      name: link.name, 
      link: link.link, 
      description: link.description || "" 
    });
  };

  const handleDelete = (id: string) => {
    deleteLink.mutate(id);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) resetForm(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />Add Community Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Community Links</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Community Name *</Label>
            <Input 
              id="name" 
              placeholder="e.g., React Discord" 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link">Link URL *</Label>
            <Input 
              id="link" 
              type="url"
              placeholder="https://discord.gg/..." 
              value={formData.link}
              onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea 
              id="description" 
              placeholder="Brief description..." 
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={addLink.isPending || updateLink.isPending} className="flex-1">
              {editingLink ? "Update" : "Add"} Link
            </Button>
            {editingLink && (
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
            )}
          </div>
        </form>

        {/* Existing Links */}
        <div className="mt-4 border-t pt-4">
          <h4 className="text-sm font-medium mb-3">Your Community Links</h4>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : links.length === 0 ? (
            <p className="text-sm text-muted-foreground">No links added yet</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {links.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50 group">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{link.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{link.link}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEdit(link)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => handleDelete(link.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
