"use client";

import { ASSISTANT_STARTER_PROMPTS } from "@/lib/assistant/starter-prompts";
import { cn } from "@/lib/utils";

type AssistantStarterGridProps = {
  selected: string | null;
  onSelect: (prompt: string | null) => void;
  disabled?: boolean;
};

export function AssistantStarterGrid({
  selected,
  onSelect,
  disabled,
}: AssistantStarterGridProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {ASSISTANT_STARTER_PROMPTS.map((starter) => {
        const isSelected = selected === starter.prompt;
        return (
          <button
            key={starter.prompt}
            type="button"
            disabled={disabled}
            onClick={() =>
              onSelect(isSelected ? null : starter.prompt)
            }
            className={cn(
              "rounded-xl border px-4 py-3 text-left transition-colors",
              "border-border/50 bg-card hover:bg-blue-soft/40 disabled:opacity-50",
              isSelected &&
                "border-primary/40 bg-blue-soft ring-1 ring-primary/30"
            )}
          >
            <p className="text-xs text-muted-foreground">{starter.category}</p>
            <p className="mt-1 text-sm font-normal text-foreground">
              {starter.title}
            </p>
          </button>
        );
      })}
    </div>
  );
}
