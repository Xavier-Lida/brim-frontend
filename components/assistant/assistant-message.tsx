"use client";

import { SparkleIcon } from "@phosphor-icons/react";
import { AssistantMarkdown } from "@/components/assistant/assistant-markdown";
import { AssistantThinking } from "@/components/assistant/assistant-thinking";
import { cn } from "@/lib/utils";
import type { AssistantMessage } from "@/lib/types/brim";

type AssistantMessageBubbleProps = {
  message: AssistantMessage;
  onSelectVisualization?: (messageId: string) => void;
  isActiveVisualization?: boolean;
};

export function AssistantMessageBubble({
  message,
  onSelectVisualization,
  isActiveVisualization,
}: AssistantMessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[90%] rounded-lg bg-primary/70 px-3 py-2 text-sm text-primary-foreground">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
        <SparkleIcon weight="fill" className="size-3.5" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div
          className={cn(
            "rounded-lg border border-border/40 bg-blue-soft/50 px-3 py-2",
            message.visualization &&
              onSelectVisualization &&
              "cursor-pointer transition-colors hover:bg-blue-soft",
            isActiveVisualization && "ring-1 ring-primary/30"
          )}
          onClick={
            message.visualization && onSelectVisualization
              ? () => onSelectVisualization(message.id)
              : undefined
          }
          onKeyDown={
            message.visualization && onSelectVisualization
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onSelectVisualization(message.id);
                  }
                }
              : undefined
          }
          role={message.visualization ? "button" : undefined}
          tabIndex={message.visualization ? 0 : undefined}
        >
          {message.streaming && !message.text ? (
            <AssistantThinking />
          ) : message.text ? (
            <AssistantMarkdown content={message.text} />
          ) : (
            <span className="text-sm text-muted-foreground">…</span>
          )}
          {message.visualization && (
            <p className="mt-2 text-xs text-primary/70">
              View chart in center →
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
