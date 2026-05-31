"use client";

import type { FollowUpChoice } from "@/lib/assistant/follow-up-catalog";
import { cn } from "@/lib/utils";

type AssistantFollowUpChoicesProps = {
  choices: FollowUpChoice[];
  selected: string | null;
  onSelect: (choice: string | null) => void;
  disabled?: boolean;
  className?: string;
};

export function AssistantFollowUpChoices({
  choices,
  selected,
  onSelect,
  disabled,
  className,
}: AssistantFollowUpChoicesProps) {
  return (
    <div className={cn("flex flex-col gap-1 px-1 py-1.5", className)}>
      {choices.map((entry) => {
        const isSelected =
          selected === entry.prompt || selected === entry.chip;
        return (
          <button
            key={entry.id}
            type="button"
            disabled={disabled}
            title={entry.hint}
            onClick={() => onSelect(isSelected ? null : entry.prompt)}
            className={cn(
              "w-full truncate rounded-md border px-2.5 py-1 text-left text-xs transition-colors",
              "border-border/50 bg-card hover:bg-blue-soft/40",
              "disabled:pointer-events-none disabled:opacity-50",
              isSelected &&
                "border-primary/40 bg-blue-soft ring-1 ring-primary/30"
            )}
          >
            {entry.label}
          </button>
        );
      })}
    </div>
  );
}
