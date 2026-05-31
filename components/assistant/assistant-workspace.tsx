"use client";

import { AssistantToolbar } from "@/components/assistant/assistant-toolbar";
import { AssistantCenterStage } from "@/components/assistant/assistant-center-stage";
import { AssistantChatPanel } from "@/components/assistant/assistant-chat-panel";
import { VizFullscreenDialog } from "@/components/assistant/viz-fullscreen-dialog";
import { useMockStore } from "@/lib/hooks/use-mock-store";
import { cn } from "@/lib/utils";

export function AssistantWorkspace() {
  const {
    assistantSession,
    assistantActiveVisualization,
    assistantIsSending,
    assistantVizFullscreenOpen,
    setAssistantVizFullscreenOpen,
    setAssistantContextPreset,
    setAssistantDepartments,
    clearAssistantChat,
    selectAssistantVisualization,
    sendAssistantMessage,
  } = useMockStore();

  const { messages, context, layoutMode, activeVisualizationId } =
    assistantSession;

  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const showStarters = userMessageCount === 0;

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col gap-3">
      <AssistantToolbar
        context={context}
        layoutMode={layoutMode}
        onPresetChange={setAssistantContextPreset}
        onDepartmentsChange={setAssistantDepartments}
        onNewChat={clearAssistantChat}
        onExpandViz={() => setAssistantVizFullscreenOpen(true)}
        canExpandViz={layoutMode === "split" && !!assistantActiveVisualization}
      />

      <div
        className={cn(
          "flex min-h-0 flex-1 transition-all duration-300",
          layoutMode === "split"
            ? "flex-col md:flex-row md:gap-0"
            : "flex-col items-center justify-center gap-4"
        )}
      >
        {layoutMode === "split" && (
          <AssistantCenterStage
            layoutMode={layoutMode}
            visualization={assistantActiveVisualization}
            showStarters={false}
            onStarterSelect={sendAssistantMessage}
            startersDisabled={assistantIsSending}
            className="min-h-[40vh] md:min-h-0 md:border-r md:border-border/40"
          />
        )}

        {layoutMode === "centered" && (
          <AssistantCenterStage
            layoutMode={layoutMode}
            showStarters={showStarters}
            onStarterSelect={sendAssistantMessage}
            startersDisabled={assistantIsSending}
          />
        )}

        <AssistantChatPanel
          messages={messages}
          isSending={assistantIsSending}
          layoutMode={layoutMode}
          activeVisualizationId={activeVisualizationId}
          onSend={sendAssistantMessage}
          onSelectVisualization={selectAssistantVisualization}
          className={cn(
            layoutMode === "split" &&
              "border-t border-border/40 md:border-t-0 md:shrink-0"
          )}
        />
      </div>

      <VizFullscreenDialog
        open={assistantVizFullscreenOpen}
        onOpenChange={setAssistantVizFullscreenOpen}
        visualization={assistantActiveVisualization}
      />
    </div>
  );
}
