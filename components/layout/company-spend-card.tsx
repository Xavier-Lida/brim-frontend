"use client";

import { Progress } from "@/components/ui/progress";
import { useMockStore } from "@/lib/hooks/use-mock-store";

export function CompanySpendCard() {
  const { companySpend } = useMockStore();
  const pct = Math.round((companySpend.spent / companySpend.budget) * 100);
  const spentLabel = `$${(companySpend.spent / 1000).toFixed(1)}k`;
  const budgetLabel = `$${(companySpend.budget / 1000).toFixed(0)}k`;

  return (
    <div className="rounded-xl border border-border/50 bg-blue-soft/40 p-3">
      <p className="text-xs text-muted-foreground">
        Company spend · {companySpend.period}
      </p>
      <p className="mt-1 text-sm font-normal text-foreground">
        {spentLabel}{" "}
        <span className="font-normal text-muted-foreground">/ {budgetLabel}</span>
      </p>
      <Progress value={pct} className="mt-2 h-1.5" />
    </div>
  );
}
