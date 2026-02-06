import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

import { useState } from "react";
import { SharePostDialog } from "./SharePostDialog";
import { Share2 } from "lucide-react";

interface PostOptionsProps {
  postId: string;
}

export const PostOptions = ({ postId }: PostOptionsProps) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-popover backdrop-blur-sm z-50">
          <DropdownMenuItem onClick={() => setShareDialogOpen(true)} className="cursor-pointer">
            <Share2 className="mr-2 h-4 w-4" />
            <span>Share via Message</span>
          </DropdownMenuItem>
          <DropdownMenuItem>Interested</DropdownMenuItem>
          <DropdownMenuItem>Not Interested</DropdownMenuItem>
          <DropdownMenuItem>Report</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SharePostDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        postId={postId}
      />
    </>
  );
};
