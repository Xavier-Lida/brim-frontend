"use client";

import { useState } from "react";
import Link from "next/link";
import { CaretRightIcon } from "@phosphor-icons/react";
import { Switch } from "@/components/ui/switch";
import { formatCad } from "@/lib/approvals/display";
import {
  severityDotClass,
  severityLabel,
} from "@/lib/flags/severity";
import { cn } from "@/lib/utils";
import type { TransactionFlag } from "@/lib/types/brim";

type FlagRowProps = {
  flag: TransactionFlag;
  onReview: (id: string) => void | Promise<void>;
  isSubmitting?: boolean;
};

export function FlagRow({ flag, onReview, isSubmitting = false }: FlagRowProps) {
  const [expanded, setExpanded] = useState(false);
  const txn = flag.transaction;
  const employee = flag.employee_name ?? txn?.employee_name ?? "Unknown employee";
  const flagCount = txn?.flag_count ?? 1;

  return (
    <div
      className={cn(
        "rounded-lg border border-border/50 transition-colors",
        flag.reviewed ? "opacity-50" : "bg-card"
      )}
    >
      <div className="flex items-center gap-3 px-3 py-2.5">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
          aria-expanded={expanded}
        >
          <span
            className={cn(
              "size-2.5 shrink-0 rounded-full",
              severityDotClass(flag.weight)
            )}
            title={`${severityLabel(flag.weight)} severity`}
          />
          <CaretRightIcon
            className={cn(
              "size-3.5 shrink-0 text-muted-foreground transition-transform",
              expanded && "rotate-90"
            )}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {employee}
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                {txn?.merchant_name ?? flag.transaction_id}
                {txn ? ` · ${formatCad(txn.amount)}` : ""}
              </span>
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {flag.warning_message}
            </p>
          </div>
        </button>

        <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
          {flag.weight}/5
        </span>

        <label className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
          <span className="hidden sm:inline">Reviewed</span>
          <Switch
            size="sm"
            checked={flag.reviewed}
            disabled={flag.reviewed || isSubmitting}
            onCheckedChange={(checked) => {
              if (checked && !flag.reviewed) void onReview(flag.id);
            }}
            aria-label="Mark flag reviewed"
          />
        </label>
      </div>

      {expanded && (
        <div className="flex flex-col gap-3 border-t border-border/50 px-3 py-3 pl-[2.1rem]">
          <p className="text-sm text-foreground">{flag.warning_message}</p>

          {flagCount > 1 && (
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
              {flagCount} flags on this transaction
            </p>
          )}

          {txn && (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground sm:grid-cols-3">
              <Detail label="Date" value={txn.date} />
              <Detail label="Merchant" value={txn.merchant_name} />
              <Detail label="Category" value={txn.merchant_category} />
              <Detail label="City" value={txn.city} />
              <Detail label="Amount" value={formatCad(txn.amount)} />
              <Detail label="Status" value={txn.status} />
            </dl>
          )}

          {txn && (
            <Link
              href="/transactions"
              className="text-xs text-primary/80 hover:underline"
            >
              View transaction →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-[0.7rem] uppercase tracking-wide text-muted-foreground/70">
        {label}
      </dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}
