"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TransactionFlag } from "@/lib/types/brim";

type FlagCardProps = {
  flag: TransactionFlag;
  onReview: (id: string) => void | Promise<void>;
  isSubmitting?: boolean;
};

function weightVariant(weight: number): "secondary" | "destructive" | "outline" {
  if (weight >= 3) return "destructive";
  if (weight >= 2) return "outline";
  return "secondary";
}

export function FlagCard({
  flag,
  onReview,
  isSubmitting = false,
}: FlagCardProps) {
  const txn = flag.transaction;

  return (
    <Card className="border-border/50 shadow-none">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base font-medium">
              {flag.employee_name ?? txn?.employee_name ?? "Unknown employee"}
            </CardTitle>
            <CardDescription>
              {txn?.merchant_name ?? flag.transaction_id} · $
              {txn?.amount.toFixed(2) ?? "—"}
            </CardDescription>
          </div>
          <Badge variant={weightVariant(flag.weight)}>
            Weight {flag.weight}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground">{flag.warning_message}</p>
        {txn && (
          <Link
            href="/transactions"
            className="text-xs text-primary/80 hover:underline"
          >
            View transaction →
          </Link>
        )}
      </CardContent>
      {!flag.reviewed && (
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => void onReview(flag.id)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving…" : "Mark reviewed"}
          </Button>
        </CardFooter>
      )}
      {flag.reviewed && (
        <CardFooter>
          <Badge variant="secondary">Reviewed</Badge>
        </CardFooter>
      )}
    </Card>
  );
}
