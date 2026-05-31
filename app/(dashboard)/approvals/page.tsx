"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ApprovalCard } from "@/components/approvals/approval-card";
import { ApprovalInspectSheet } from "@/components/approvals/approval-inspect-sheet";
import { ApprovalSearch } from "@/components/approvals/approval-search";
import { Button } from "@/components/ui/button";
import { filterApprovals } from "@/lib/approvals/filters";
import { useMockStore } from "@/lib/hooks/use-mock-store";
import type { ApprovalRequest } from "@/lib/types/brim";

export default function ApprovalsPage() {
  const {
    approvals,
    approvalsHasMore,
    approvalsLoading,
    approvalsLoadingMore,
    pendingApprovalsCount,
    decideApproval,
    runApprovalsPipeline,
    loadApprovals,
    loadMoreApprovals,
    error,
    refreshAll,
  } = useMockStore();
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [employeeQuery, setEmployeeQuery] = useState("");
  const [inspecting, setInspecting] = useState<ApprovalRequest | null>(null);

  useEffect(() => {
    if (approvals.length === 0 && !approvalsLoading) {
      void loadApprovals();
    }
  }, [approvals.length, approvalsLoading, loadApprovals]);

  const filtered = useMemo(
    () => filterApprovals(approvals, employeeQuery),
    [approvals, employeeQuery]
  );

  const handleDecide = async (id: string, status: "approved" | "denied") => {
    setSubmittingId(id);
    try {
      await decideApproval(id, status);
      toast.success(status === "approved" ? "Expense approved" : "Expense denied");
      setInspecting((current) => (current?.id === id ? null : current));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update approval");
    } finally {
      setSubmittingId(null);
    }
  };

  const handleRunPipeline = async () => {
    setIsRunningPipeline(true);
    try {
      await runApprovalsPipeline();
      toast.success("Approval pipeline completed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to run pipeline");
    } finally {
      setIsRunningPipeline(false);
    }
  };

  if (approvalsLoading && approvals.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <p className="py-8 text-center text-sm text-muted-foreground">Loading approvals…</p>
      </div>
    );
  }

  if (error && approvals.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 py-8">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" onClick={() => void refreshAll()}>
          Retry
        </Button>
      </div>
    );
  }

  const trimmedQuery = employeeQuery.trim();
  const emptyMessage = trimmedQuery
    ? `No approvals match "${trimmedQuery}".`
    : "No pending approvals.";

  const subtitleParts = [`${filtered.length} shown`, `${pendingApprovalsCount} pending total`];
  if (trimmedQuery) {
    subtitleParts.push(`matching "${trimmedQuery}"`);
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-normal text-foreground/90">Approvals</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {subtitleParts.join(" · ")}
          </p>
        </div>
        {approvals.length === 0 && (
          <Button
            variant="outline"
            onClick={() => void handleRunPipeline()}
            disabled={isRunningPipeline}
          >
            {isRunningPipeline ? "Running…" : "Run approval pipeline"}
          </Button>
        )}
      </div>

      <ApprovalSearch value={employeeQuery} onChange={setEmployeeQuery} />

      <div className="flex flex-col gap-4">
        {filtered.map((approval) => (
          <ApprovalCard
            key={approval.id}
            approval={approval}
            onDecide={handleDecide}
            onInspect={() => setInspecting(approval)}
            isSubmitting={submittingId === approval.id}
          />
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        )}
      </div>

      {approvalsHasMore && (
        <div className="flex justify-center pb-4">
          <Button
            variant="outline"
            onClick={() => void loadMoreApprovals()}
            disabled={approvalsLoadingMore}
          >
            {approvalsLoadingMore ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}

      <ApprovalInspectSheet
        approval={inspecting}
        open={inspecting !== null}
        onOpenChange={(open) => {
          if (!open) setInspecting(null);
        }}
        onDecide={handleDecide}
        isSubmitting={inspecting !== null && submittingId === inspecting.id}
      />
    </div>
  );
}
