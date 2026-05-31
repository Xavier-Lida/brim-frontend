import { apiFetch } from "@/lib/api/client";
import { mockLlm } from "@/lib/api/config";
import type { ExpenseReport } from "@/lib/types/brim";

export function getReports() {
  return apiFetch<ExpenseReport[]>("/api/reports");
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
