import { apiFetch } from "@/lib/api/client";

type ComplianceScanParams = {
  mock_llm?: boolean;
  limit?: number;
};

type ComplianceScanResult = {
  feature: string;
  flag_count: number;
  strike_count: number;
  summary: {
    by_severity: { high: number; medium: number; low: number };
    repeat_offenders: unknown[];
    policy: string;
  };
  persisted: {
    flags_inserted: number;
    strikes_inserted: number;
    notifications_upserted: number;
  };
};

export function runComplianceScan(params: ComplianceScanParams = {}) {
  return apiFetch<ComplianceScanResult>("/api/compliance/scan", {
    method: "POST",
    params: {
      mock_llm: params.mock_llm ?? true,
      limit: params.limit,
    },
  });
}
