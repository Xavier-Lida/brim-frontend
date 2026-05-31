"use client";

import { useMemo } from "react";
import { SparkleIcon } from "@phosphor-icons/react";
import { AssistantMarkdown } from "@/components/assistant/assistant-markdown";
import { AssistantProgressTasks } from "@/components/assistant/assistant-progress-tasks";
import { createInitialProgressSteps } from "@/lib/assistant/assistant-progress";
import { collectSessionEntityHints } from "@/lib/assistant/extract-entity-hints";
import { cn } from "@/lib/utils";
import type { AssistantMessage, Visualization } from "@/lib/types/brim";

type AssistantMessageBubbleProps = {
  message: AssistantMessage;
  sessionVisualizations?: Visualization[];
  onSelectVisualization?: (messageId: string) => void;
  isActiveVisualization?: boolean;
};

export function AssistantMessageBubble({
  message,
  sessionVisualizations = [],
  onSelectVisualization,
  isActiveVisualization,
}: AssistantMessageBubbleProps) {
  const isUser = message.role === "user";

  const entityHints = collectSessionEntityHints([
    ...sessionVisualizations,
    message.visualization,
  ]);

  const progressSteps = useMemo(() => {
    if (message.progressSteps?.length) return message.progressSteps;
    if (message.streaming) return createInitialProgressSteps();
    return [];
  }, [message.progressSteps, message.streaming]);

  const showProgress = Boolean(message.streaming) && progressSteps.length > 0;

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
          {showProgress && (
            <AssistantProgressTasks
              steps={progressSteps}
              activity={message.activity}
              className={message.text ? "mb-3" : undefined}
            />
          )}
          {message.text ? (
            <div>
              <AssistantMarkdown
                content={message.text}
                entityHints={entityHints}
              />
              {message.streaming && (
                <span
                  className="ml-0.5 inline-block animate-pulse text-primary"
                  aria-hidden
                >
                  ▍
                </span>
              )}
            </div>
          ) : !showProgress ? (
            <span className="text-sm text-muted-foreground">…</span>
          ) : null}
          {message.visualization && !message.streaming && (
            <p className="mt-2 text-xs text-primary/70">
              View chart in center →
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
