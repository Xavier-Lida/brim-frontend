"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ApprovalCard } from "@/components/approvals/approval-card";
import { Button } from "@/components/ui/button";
import { useMockStore } from "@/lib/hooks/use-mock-store";

export default function ApprovalsPage() {
  const {
    approvals,
    decideApproval,
    runApprovalsPipeline,
    isLoading,
    error,
    refreshAll,
  } = useMockStore();
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);

  const pending = approvals.filter((a) => a.status === "pending");
  const resolved = approvals.filter((a) => a.status !== "pending");

  const handleDecide = async (id: string, status: "approved" | "denied") => {
    setSubmittingId(id);
    try {
      await decideApproval(id, status);
      toast.success(status === "approved" ? "Expense approved" : "Expense denied");
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

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <p className="py-8 text-center text-sm text-muted-foreground">Loading approvals…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 py-8">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" onClick={() => void refreshAll()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-normal text-foreground/90">Approvals</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {pending.length} pending · AI recommendations included
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

      <div className="flex flex-col gap-4">
        {pending.map((approval) => (
          <ApprovalCard
            key={approval.id}
            approval={approval}
            onDecide={handleDecide}
            isSubmitting={submittingId === approval.id}
          />
        ))}
        {pending.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No pending approvals.
          </p>
        )}
      </div>

      {resolved.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium text-muted-foreground">Resolved</h3>
          {resolved.map((approval) => (
            <ApprovalCard
              key={approval.id}
              approval={approval}
              onDecide={handleDecide}
              isSubmitting={submittingId === approval.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
