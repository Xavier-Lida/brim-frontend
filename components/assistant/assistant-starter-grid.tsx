"use client";

import { ASSISTANT_STARTER_PROMPTS } from "@/lib/assistant/context-presets";

type AssistantStarterGridProps = {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
};

export function AssistantStarterGrid({
  onSelect,
  disabled,
}: AssistantStarterGridProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {ASSISTANT_STARTER_PROMPTS.map((starter) => (
        <button
          key={starter.prompt}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(starter.prompt)}
          className="rounded-xl border border-border/50 bg-card px-4 py-3 text-left transition-colors hover:bg-blue-soft/40 disabled:opacity-50"
        >
          <p className="text-xs text-muted-foreground">{starter.category}</p>
          <p className="mt-1 text-sm font-normal text-foreground">
            {starter.title}
          </p>
        </button>
      ))}
    </div>
  );
}
