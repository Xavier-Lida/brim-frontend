"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FlagCard } from "@/components/flagged/flag-card";
import { Button } from "@/components/ui/button";
import { useMockStore } from "@/lib/hooks/use-mock-store";

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

  useEffect(() => {
    if (flags.length === 0 && !flagsLoading) {
      void loadFlags();
    }
  }, [flags.length, flagsLoading, loadFlags]);

  const sorted = [...flags].sort((a, b) => b.weight - a.weight);
  const unread = sorted.filter((f) => !f.reviewed);
  const reviewed = sorted.filter((f) => f.reviewed);

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
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-normal text-foreground/90">
            Flagged transactions
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadFlagsCount} unreviewed flag{unreadFlagsCount !== 1 ? "s" : ""} total
            {unread.length > 0
              ? ` · showing ${unread.length} active in loaded batch`
              : ""}
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

      <div className="flex flex-col gap-4">
        {unread.map((flag) => (
          <FlagCard
            key={flag.id}
            flag={flag}
            onReview={handleReview}
            isSubmitting={submittingId === flag.id}
          />
        ))}
        {unread.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            All loaded flags reviewed.
          </p>
        )}
      </div>

      {reviewed.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium text-muted-foreground">Reviewed</h3>
          {reviewed.map((flag) => (
            <FlagCard
              key={flag.id}
              flag={flag}
              onReview={handleReview}
              isSubmitting={submittingId === flag.id}
            />
          ))}
        </div>
      )}

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
