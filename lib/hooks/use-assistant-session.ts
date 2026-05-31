"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { initialAssistantMessages } from "@/lib/mocks/fixtures";
import { generateId } from "@/lib/mocks/services";
import {
  applyContextPreset,
  createDefaultAssistantContext,
} from "@/lib/assistant/context-presets";
import type {
  AssistantContext,
  AssistantDatePreset,
  AssistantLayoutMode,
  AssistantMessage,
  AssistantSessionState,
  Visualization,
} from "@/lib/types/brim";

const STORAGE_KEY = "brim-assistant-session";

function deriveLayoutMode(messages: AssistantMessage[]): AssistantLayoutMode {
  return messages.some((m) => m.visualization) ? "split" : "centered";
}

function getDefaultSession(): AssistantSessionState {
  return {
    messages: initialAssistantMessages,
    context: createDefaultAssistantContext(),
    layoutMode: "centered",
    activeVisualizationId: undefined,
  };
}

function loadSession(): AssistantSessionState {
  if (typeof window === "undefined") return getDefaultSession();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultSession();
    const parsed = JSON.parse(raw) as AssistantSessionState;
    const messages = parsed.messages?.length ? parsed.messages : initialAssistantMessages;
    return {
      messages,
      context: parsed.context ?? createDefaultAssistantContext(),
      layoutMode: deriveLayoutMode(messages),
      activeVisualizationId: parsed.activeVisualizationId,
    };
  } catch {
    return getDefaultSession();
  }
}

export function useAssistantSession() {
  const [session, setSession] = useState<AssistantSessionState>(getDefaultSession);
  const [hydrated, setHydrated] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [vizFullscreenOpen, setVizFullscreenOpen] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSession(loadSession());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }, 300);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [session, hydrated]);

  const activeVisualization = useMemo((): Visualization | undefined => {
    const targetId = session.activeVisualizationId;
    if (targetId) {
      const msg = session.messages.find((m) => m.id === targetId);
      if (msg?.visualization) return msg.visualization;
    }
    const lastWithViz = [...session.messages]
      .reverse()
      .find((m) => m.visualization);
    return lastWithViz?.visualization;
  }, [session.messages, session.activeVisualizationId]);

  const setContextPreset = useCallback((preset: AssistantDatePreset) => {
    setSession((prev) => ({
      ...prev,
      context: applyContextPreset(preset, prev.context.departments),
    }));
  }, []);

  const setDepartments = useCallback((departments: string[]) => {
    setSession((prev) => ({
      ...prev,
      context: { ...prev.context, departments },
    }));
  }, []);

  const clearChat = useCallback(() => {
    setSession({
      messages: initialAssistantMessages,
      context: createDefaultAssistantContext(),
      layoutMode: "centered",
      activeVisualizationId: undefined,
    });
    setVizFullscreenOpen(false);
  }, []);

  const selectVisualization = useCallback((messageId: string) => {
    setSession((prev) => ({
      ...prev,
      activeVisualizationId: messageId,
    }));
  }, []);

  const appendUserMessage = useCallback((text: string) => {
    const userMessage: AssistantMessage = {
      id: generateId("msg"),
      role: "user",
      text,
      created_at: new Date().toISOString(),
    };
    setSession((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));
    return userMessage.id;
  }, []);

  const beginAssistantMessage = useCallback(() => {
    const id = generateId("msg");
    const assistantMessage: AssistantMessage = {
      id,
      role: "assistant",
      text: "",
      streaming: true,
      created_at: new Date().toISOString(),
    };
    setSession((prev) => ({
      ...prev,
      messages: [...prev.messages, assistantMessage],
    }));
    return id;
  }, []);

  const patchAssistantMessage = useCallback(
    (
      id: string,
      patch: Partial<
        Pick<
          AssistantMessage,
          "text" | "activity" | "visualization" | "followUpSuggestions" | "streaming"
        >
      >
    ) => {
      setSession((prev) => {
        let activeVisualizationId = prev.activeVisualizationId;
        if (patch.visualization) {
          activeVisualizationId = id;
        }
        const messages = prev.messages.map((m) =>
          m.id === id ? { ...m, ...patch } : m
        );
        return {
          ...prev,
          messages,
          layoutMode: deriveLayoutMode(messages),
          activeVisualizationId,
        };
      });
    },
    []
  );

  const buildHistory = useCallback((messages: AssistantMessage[]) => {
    return messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-6)
      .reduce<{ question: string; summary: string }[]>((acc, msg, idx, arr) => {
        if (msg.role === "user") {
          const next = arr[idx + 1];
          acc.push({
            question: msg.text,
            summary: next?.role === "assistant" ? next.text : "",
          });
        }
        return acc;
      }, []);
  }, []);

  return {
    session,
    hydrated,
    isSending,
    setIsSending,
    activeVisualization,
    vizFullscreenOpen,
    setVizFullscreenOpen,
    setContextPreset,
    setDepartments,
    clearChat,
    selectVisualization,
    appendUserMessage,
    beginAssistantMessage,
    patchAssistantMessage,
    buildHistory,
    setSession,
  };
}

export type AssistantSessionApi = ReturnType<typeof useAssistantSession>;
