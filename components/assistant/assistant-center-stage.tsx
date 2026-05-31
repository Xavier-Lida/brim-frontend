"use client";

import { AssistantVisualization } from "@/components/assistant/assistant-visualization";
import { AssistantStarterGrid } from "@/components/assistant/assistant-starter-grid";
import type { Visualization } from "@/lib/types/brim";
import { cn } from "@/lib/utils";

type AssistantCenterStageProps = {
  layoutMode: "centered" | "split";
  visualization?: Visualization;
  showStarters: boolean;
  onStarterSelect: (prompt: string) => void;
  startersDisabled?: boolean;
  className?: string;
};

export function AssistantCenterStage({
  layoutMode,
  visualization,
  showStarters,
  onStarterSelect,
  startersDisabled,
  className,
}: AssistantCenterStageProps) {
  if (layoutMode === "centered") {
    if (!showStarters) return null;
    return (
      <div className={cn("flex w-full max-w-2xl flex-col gap-4 px-2", className)}>
        <div className="text-center">
          <h2 className="text-xl font-normal text-foreground/90">
            Brim Assistant
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask about spend, compliance, and policy coverage across Northwind
            Labs.
          </p>
        </div>
        <AssistantStarterGrid
          onSelect={onStarterSelect}
          disabled={startersDisabled}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col items-center justify-center p-4 md:p-8",
        className
      )}
    >
      {visualization ? (
        <div className="w-full max-w-4xl">
          <AssistantVisualization visualization={visualization} size="stage" />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Ask a question to generate a chart or report.
        </p>
      )}
    </div>
  );
}
