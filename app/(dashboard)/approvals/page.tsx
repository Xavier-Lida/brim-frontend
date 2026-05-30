"use client";

import { toast } from "sonner";
import { ApprovalCard } from "@/components/approvals/approval-card";
import { useMockStore } from "@/lib/hooks/use-mock-store";

export default function ApprovalsPage() {
  const { approvals, decideApproval } = useMockStore();
  const pending = approvals.filter((a) => a.status === "pending");
  const resolved = approvals.filter((a) => a.status !== "pending");

  const handleDecide = (id: string, status: "approved" | "denied") => {
    decideApproval(id, status);
    toast.success(status === "approved" ? "Expense approved" : "Expense denied");
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h2 className="text-xl font-normal text-foreground/90">
          Approvals
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {pending.length} pending · AI recommendations included
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {pending.map((approval) => (
          <ApprovalCard
            key={approval.id}
            approval={approval}
            onDecide={handleDecide}
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
