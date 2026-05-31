"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AssistantVisualization } from "@/components/assistant/assistant-visualization";
import type { Visualization } from "@/lib/types/brim";

type VizFullscreenDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visualization?: Visualization;
};

export function VizFullscreenDialog({
  open,
  onOpenChange,
  visualization,
}: VizFullscreenDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-auto">
        <DialogHeader>
          <DialogTitle className="font-normal">
            {visualization?.title ?? "Visualization"}
          </DialogTitle>
        </DialogHeader>
        {visualization && (
          <AssistantVisualization visualization={visualization} size="stage" />
        )}
      </DialogContent>
    </Dialog>
  );
}
