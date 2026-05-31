"use client";

import { useEffect, useMemo, useState } from "react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { FlagRow } from "@/components/flagged/flag-row";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useMockStore } from "@/lib/hooks/use-mock-store";
import { getSeverityCounts } from "@/lib/flags/severity";
import type { TransactionFlag } from "@/lib/types/brim";

function matchesQuery(flag: TransactionFlag, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  const txn = flag.transaction;
  return (
    (flag.employee_name ?? "").toLowerCase().includes(q) ||
    (txn?.employee_name ?? "").toLowerCase().includes(q) ||
    (txn?.merchant_name ?? "").toLowerCase().includes(q)
  );
}

export default function FlaggedPage() {
  const {
    flags,
    flagsHasMore,
    flagsLoading,
    flagsLoadingMore,
    unreadFlagsCount,
    markFlagReviewed,
    runComplianceScan,
    loadFlags,
    loadMoreFlags,
    error,
    refreshAll,
  } = useMockStore();
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [unreviewedOnly, setUnreviewedOnly] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (flags.length === 0 && !flagsLoading) {
      void loadFlags();
    }
  }, [flags.length, flagsLoading, loadFlags]);

  const sorted = useMemo(
    () => [...flags].sort((a, b) => b.weight - a.weight),
    [flags]
  );
  const severityCounts = useMemo(() => getSeverityCounts(sorted), [sorted]);
  const visible = useMemo(
    () =>
      sorted.filter(
        (f) => (!unreviewedOnly || !f.reviewed) && matchesQuery(f, query)
      ),
    [sorted, unreviewedOnly, query]
  );

  const handleReview = async (id: string) => {
    setSubmittingId(id);
    try {
      await markFlagReviewed(id);
      toast.success("Flag marked as reviewed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to mark flag reviewed");
    } finally {
      setSubmittingId(null);
    }
  };

  const handleScan = async () => {
    setIsScanning(true);
    try {
      await runComplianceScan();
      toast.success("Compliance scan completed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to run compliance scan");
    } finally {
      setIsScanning(false);
    }
  };

  if (flagsLoading && flags.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <p className="py-8 text-center text-sm text-muted-foreground">Loading flags…</p>
      </div>
    );
  }

  if (error && flags.length === 0) {
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
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-normal text-foreground/90">
            Flagged transactions
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadFlagsCount} unreviewed flag{unreadFlagsCount !== 1 ? "s" : ""} total
            {flagsHasMore ? " · more available" : ""}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => void handleScan()}
          disabled={isScanning}
        >
          {isScanning ? "Scanning…" : "Run compliance scan"}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SeverityCounter label="High" count={severityCounts.high} dotClass="bg-red-600" />
        <SeverityCounter label="Medium" count={severityCounts.medium} dotClass="bg-orange-500" />
        <SeverityCounter label="Low" count={severityCounts.low} dotClass="bg-muted-foreground/40" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-0 flex-1">
          <MagnifyingGlassIcon className="absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by employee or merchant…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-border/60 bg-muted/50 pl-8"
          />
        </div>
        <label className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
          <Switch
            size="sm"
            checked={unreviewedOnly}
            onCheckedChange={setUnreviewedOnly}
          />
          Unreviewed only
        </label>
      </div>

      <div className="flex flex-col gap-2">
        {visible.map((flag) => (
          <FlagRow
            key={flag.id}
            flag={flag}
            onReview={handleReview}
            isSubmitting={submittingId === flag.id}
          />
        ))}
        {visible.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {query.trim()
              ? `No flags match "${query.trim()}".`
              : unreviewedOnly
                ? "All loaded flags reviewed."
                : "No flagged transactions."}
          </p>
        )}
      </div>

      {flagsHasMore && (
        <div className="flex justify-center pb-4">
          <Button
            variant="outline"
            onClick={() => void loadMoreFlags()}
            disabled={flagsLoadingMore}
          >
            {flagsLoadingMore ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}

function SeverityCounter({
  label,
  count,
  dotClass,
}: {
  label: string;
  count: number;
  dotClass: string;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border/60 px-2.5 py-1 text-xs text-muted-foreground">
      <span className={`size-2 rounded-full ${dotClass}`} />
      <span className="font-medium text-foreground">{count}</span>
      {label}
    </div>
  );
}
