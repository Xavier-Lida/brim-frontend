"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ReportCard } from "@/components/reports/report-card";
import { Button } from "@/components/ui/button";
import { useMockStore } from "@/lib/hooks/use-mock-store";

export default function ReportsPage() {
  const { reports, generateReports, isLoading, error, refreshAll } =
    useMockStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await generateReports();
      toast.success("Reports generated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate reports");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <p className="py-8 text-center text-sm text-muted-foreground">Loading reports…</p>
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
          <h2 className="text-xl font-normal text-foreground/90">Expense reports</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {reports.length} report{reports.length !== 1 ? "s" : ""} · AI recommendations
            included
          </p>
        </div>
        <Button onClick={() => void handleGenerate()} disabled={isGenerating}>
          {isGenerating ? "Generating…" : "Generate reports"}
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
        {reports.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No expense reports yet. Generate reports from unassigned transactions.
          </p>
        )}
      </div>
    </div>
  );
}
