"use client";

import { SparkleIcon } from "@phosphor-icons/react";

export function AssistantThinking() {
  return (
    <div className="flex items-center gap-2 px-1 py-2 text-sm text-muted-foreground">
      <SparkleIcon
        weight="fill"
        className="size-4 animate-pulse text-primary"
      />
      <span>Brim is thinking…</span>
    </div>
  );
}
