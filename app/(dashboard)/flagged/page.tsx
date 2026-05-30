"use client";

import { toast } from "sonner";
import { FlagCard } from "@/components/flagged/flag-card";
import { useMockStore } from "@/lib/hooks/use-mock-store";

export default function FlaggedPage() {
  const { flags, markFlagReviewed } = useMockStore();
  const sorted = [...flags].sort((a, b) => b.weight - a.weight);
  const unread = sorted.filter((f) => !f.reviewed);
  const reviewed = sorted.filter((f) => f.reviewed);

  const handleReview = (id: string) => {
    markFlagReviewed(id);
    toast.success("Flag marked as reviewed");
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h2 className="text-xl font-normal text-foreground/90">
          Flagged transactions
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {unread.length} active flags · sorted by compliance weight
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {unread.map((flag) => (
          <FlagCard key={flag.id} flag={flag} onReview={handleReview} />
        ))}
        {unread.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            All flags reviewed.
          </p>
        )}
      </div>

      {reviewed.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium text-muted-foreground">Reviewed</h3>
          {reviewed.map((flag) => (
            <FlagCard key={flag.id} flag={flag} onReview={handleReview} />
          ))}
        </div>
      )}
    </div>
  );
}
