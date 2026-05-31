"use client";

import { useEffect, useRef, useState } from "react";
import { PaperPlaneRightIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AssistantMessageBubble } from "@/components/assistant/assistant-message";
import type { AssistantMessage } from "@/lib/types/brim";
import { cn } from "@/lib/utils";

type AssistantChatPanelProps = {
  messages: AssistantMessage[];
  isSending: boolean;
  layoutMode: "centered" | "split";
  activeVisualizationId?: string;
  onSend: (text: string) => void;
  onSelectVisualization?: (messageId: string) => void;
  className?: string;
};

export function AssistantChatPanel({
  messages,
  isSending,
  layoutMode,
  activeVisualizationId,
  onSend,
  onSelectVisualization,
  className,
}: AssistantChatPanelProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const lastAssistant = [...messages]
    .reverse()
    .find((m) => m.role === "assistant" && !m.streaming);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;
    setInput("");
    onSend(trimmed);
  };

  const handleSend = (text: string) => {
    if (isSending) return;
    onSend(text);
  };

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col",
        layoutMode === "centered" ? "w-full max-w-xl" : "h-full w-full md:w-[360px]",
        className
      )}
    >
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-3 p-1 pr-3">
          {messages.map((msg) => (
            <AssistantMessageBubble
              key={msg.id}
              message={msg}
              onSelectVisualization={
                layoutMode === "split" ? onSelectVisualization : undefined
              }
              isActiveVisualization={msg.id === activeVisualizationId}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {lastAssistant?.followUpSuggestions && !isSending && (
        <div className="flex flex-wrap gap-2 px-1 py-2">
          {lastAssistant.followUpSuggestions.map((suggestion) => (
            <Badge
              key={suggestion}
              variant="secondary"
              className="cursor-pointer bg-blue-soft font-normal hover:bg-blue-soft-strong"
              onClick={() => handleSend(suggestion)}
            >
              {suggestion}
            </Badge>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-auto flex gap-2 border-t border-border/40 bg-background/90 p-3 backdrop-blur-sm"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about spend, flags, or policy..."
          disabled={isSending}
          className="border-border/60 bg-muted/50"
        />
        <Button type="submit" disabled={isSending || !input.trim()}>
          <PaperPlaneRightIcon data-icon="inline-start" />
          Send
        </Button>
      </form>
    </div>
  );
}
