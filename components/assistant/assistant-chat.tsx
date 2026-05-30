"use client";

import { useRef, useState } from "react";
import { PaperPlaneRightIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AssistantVisualization } from "@/components/assistant/assistant-visualization";
import { useMockStore } from "@/lib/hooks/use-mock-store";
import { cn } from "@/lib/utils";

export function AssistantChat() {
  const { assistantMessages, sendAssistantMessage } = useMockStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");
    setLoading(true);
    try {
      await sendAssistantMessage(trimmed);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const lastAssistant = [...assistantMessages]
    .reverse()
    .find((m) => m.role === "assistant");

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <ScrollArea className="flex-1 pr-4">
        <div ref={scrollRef} className="flex flex-col gap-4 pb-4">
          {assistantMessages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col gap-2",
                msg.role === "user" ? "items-end" : "items-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-lg px-4 py-2.5 text-sm",
                  msg.role === "user"
                    ? "bg-primary/75 text-primary-foreground"
                    : "border border-border/40 bg-blue-soft/50 text-foreground"
                )}
              >
                {msg.text}
              </div>
              {msg.visualization && (
                <div className="w-full max-w-lg">
                  <AssistantVisualization visualization={msg.visualization} />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <p className="text-sm text-muted-foreground">Brim is thinking...</p>
          )}
        </div>
      </ScrollArea>

      {lastAssistant?.followUpSuggestions && !loading && (
        <div className="flex flex-wrap gap-2">
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

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about spend, flags, or policy..."
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !input.trim()}>
          <PaperPlaneRightIcon data-icon="inline-start" />
          Send
        </Button>
      </form>
    </div>
  );
}
