import { apiFetch } from "@/lib/api/client";
import type { Transaction } from "@/lib/types/brim";

export const TRANSACTIONS_PAGE_SIZE = 30;

export type TransactionsPage = {
  items: Transaction[];
  has_more: boolean;
  limit: number;
  offset: number;
};

export function getTransactions(params?: {
  limit?: number;
  offset?: number;
}) {
  return apiFetch<TransactionsPage>("/api/transactions", {
    params: {
      limit: params?.limit ?? TRANSACTIONS_PAGE_SIZE,
      offset: params?.offset ?? 0,
    },
  });
}
