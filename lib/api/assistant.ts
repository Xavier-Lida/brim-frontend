import { apiFetch } from "@/lib/api/client";
import { mockLlm } from "@/lib/api/config";
import type { AssistantMessage } from "@/lib/types/brim";

export type AssistantHistoryTurn = {
  question: string;
  summary?: string;
  text?: string;
};

export type AssistantRequestContext = {
  date_from: string;
  date_to: string;
  departments: string[];
};

export type AssistantResponse = Omit<
  AssistantMessage,
  "id" | "role" | "created_at" | "streaming"
>;

export async function askAssistant(
  question: string,
  history: AssistantHistoryTurn[] = [],
  options?: { mock_llm?: boolean; context?: AssistantRequestContext }
): Promise<AssistantResponse> {
  return apiFetch<AssistantResponse>("/api/assistant", {
    method: "POST",
    params: { mock_llm: options?.mock_llm ?? mockLlm },
    body: {
      question,
      history,
      ...(options?.context ? { context: options.context } : {}),
    },
  });
}
