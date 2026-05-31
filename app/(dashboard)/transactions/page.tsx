"use client";

import { useMemo } from "react";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { Button } from "@/components/ui/button";
import { useMockStore } from "@/lib/hooks/use-mock-store";

export default function TransactionsPage() {
  const { transactions, searchQuery, isLoading, error, refreshAll } =
    useMockStore();

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return transactions;
    return transactions.filter(
      (t) =>
        t.employee_name.toLowerCase().includes(q) ||
        t.merchant_name.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.merchant_category.toLowerCase().includes(q)
    );
  }, [transactions, searchQuery]);

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <p className="py-8 text-center text-sm text-muted-foreground">
          Loading transactions…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 py-8">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" onClick={() => void refreshAll()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h2 className="text-xl font-normal text-foreground/90">Transactions</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {filtered.length} transactions
          {searchQuery ? ` matching "${searchQuery}"` : ""}
        </p>
      </div>
      <TransactionsTable transactions={filtered} />
    </div>
  );
}
