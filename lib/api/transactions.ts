import { apiFetch } from "@/lib/api/client";
import type { Transaction } from "@/lib/types/brim";

export function getTransactions() {
  return apiFetch<Transaction[]>("/api/transactions");
}
