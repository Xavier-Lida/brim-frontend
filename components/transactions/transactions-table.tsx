"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Transaction } from "@/lib/types/brim";

type TransactionsTableProps = {
  transactions: Transaction[];
};

const statusVariant: Record<
  Transaction["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  approved: "default",
  pending: "secondary",
  denied: "destructive",
  flagged: "outline",
};

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No transactions match your search.
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-border/50">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs font-normal text-muted-foreground">Date</TableHead>
            <TableHead className="text-xs font-normal text-muted-foreground">Employee</TableHead>
            <TableHead className="text-xs font-normal text-muted-foreground">Merchant</TableHead>
            <TableHead className="text-xs font-normal text-muted-foreground">Category</TableHead>
            <TableHead className="text-xs font-normal text-muted-foreground">City</TableHead>
            <TableHead className="text-right text-xs font-normal text-muted-foreground">Amount</TableHead>
            <TableHead className="text-xs font-normal text-muted-foreground">Status</TableHead>
            <TableHead className="text-right text-xs font-normal text-muted-foreground">Flags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((txn) => (
            <TableRow key={txn.id} className="hover:bg-blue-soft/30">
              <TableCell className="text-muted-foreground">{txn.date}</TableCell>
              <TableCell>{txn.employee_name}</TableCell>
              <TableCell>{txn.merchant_name}</TableCell>
              <TableCell className="text-muted-foreground">
                {txn.merchant_category}
              </TableCell>
              <TableCell className="text-muted-foreground">{txn.city}</TableCell>
              <TableCell className="text-right font-normal">
                ${txn.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant[txn.status]}>{txn.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                {txn.flag_count > 0 ? (
                  <Badge variant="destructive">{txn.flag_count}</Badge>
                ) : (
                  "—"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
