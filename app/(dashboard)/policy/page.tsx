"use client";

import { toast } from "sonner";
import { AddRuleDialog } from "@/components/policy/add-rule-dialog";
import { ImportPolicyDialog } from "@/components/policy/import-policy-dialog";
import { PolicyRuleCard } from "@/components/policy/policy-rule-card";
import { useMockStore } from "@/lib/hooks/use-mock-store";

export default function PolicyPage() {
  const {
    policies,
    activePoliciesCount,
    togglePolicy,
    deletePolicy,
  } = useMockStore();

  const handleToggle = (id: string) => {
    togglePolicy(id);
    toast.success("Rule updated");
  };

  const handleDelete = (id: string) => {
    deletePolicy(id);
    toast.success("Rule deleted");
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-normal text-foreground/90">
            Expense policy
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The rules Brim checks every transaction against. {activePoliciesCount}{" "}
            active · scans run in real time
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <AddRuleDialog />
          <ImportPolicyDialog />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {policies.map((policy) => (
          <PolicyRuleCard
            key={policy.id}
            policy={policy}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
        {policies.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No active rules. Add a rule or import a policy document.
          </p>
        )}
      </div>
    </div>
  );
}
