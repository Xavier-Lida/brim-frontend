import { apiFetch } from "@/lib/api/client";
import { mockLlm } from "@/lib/api/config";
import { normalizeReportsPage } from "@/lib/api/pagination";
import type { ExpenseReport, ReportsPage } from "@/lib/types/brim";

export const REPORTS_PAGE_SIZE = 100;

export function getReports(params?: { limit?: number; offset?: number }) {
  const limit = params?.limit ?? REPORTS_PAGE_SIZE;
  const offset = params?.offset ?? 0;
  return apiFetch<unknown>("/api/reports", {
    params: { limit, offset },
  }).then((data) => normalizeReportsPage(data, limit, offset));
}

type GenerateReportsParams = {
  mock_llm?: boolean;
  gap_days?: number;
};

type GenerateReportsBody = {
  event_group_id?: string | null;
};

type GenerateReportsResult = {
  feature: string;
  model: string;
  report_count: number;
  expense_reports: ExpenseReport[];
  persisted: {
    event_groups_updated: number;
    reports_upserted: number;
  };
};

export function generateReports(
  body: GenerateReportsBody = {},
  params: GenerateReportsParams = {}
) {
  return apiFetch<GenerateReportsResult>("/api/reports/generate", {
    method: "POST",
    body,
    params: {
      mock_llm: params.mock_llm ?? mockLlm,
      gap_days: params.gap_days,
    },
  });
}

export type { ReportsPage };
