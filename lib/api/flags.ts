import { apiFetch } from "@/lib/api/client";
import type { TransactionFlag } from "@/lib/types/brim";

export function getFlags() {
  return apiFetch<TransactionFlag[]>("/api/flags");
}

export function markFlagReviewed(flagId: string) {
  return apiFetch<{ id: string; reviewed: boolean }>(
    `/api/flags/${flagId}/reviewed`,
    { method: "PATCH" }
  );
}
