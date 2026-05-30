"use client";

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
import { Separator } from "@/components/ui/separator";
import type { ApprovalRequest, AiRecommendation } from "@/lib/types/brim";

const recommendationVariant: Record<
  AiRecommendation,
  "default" | "secondary" | "destructive"
> = {
  approve: "default",
  review: "secondary",
  deny: "destructive",
};

type ApprovalCardProps = {
  approval: ApprovalRequest;
  onDecide: (id: string, status: "approved" | "denied") => void;
};

export function ApprovalCard({ approval, onDecide }: ApprovalCardProps) {
  const isPending = approval.status === "pending";

  return (
    <Card className="border-border/50 shadow-none">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base font-medium">
              {approval.employee_name}
            </CardTitle>
            <CardDescription>
              {approval.department_name} · ${approval.amount.toFixed(2)}
            </CardDescription>
          </div>
          <Badge
            variant={
              approval.ai_recommendation === "approve"
                ? "secondary"
                : recommendationVariant[approval.ai_recommendation]
            }
            className={
              approval.ai_recommendation === "approve"
                ? "border border-primary/20 bg-blue-soft text-primary/80"
                : undefined
            }
          >
            AI: {approval.ai_recommendation}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-foreground">{approval.reason}</p>
        <p className="text-sm text-muted-foreground">{approval.ai_reasoning}</p>
        <Separator />
        <div className="flex flex-col gap-1">
          <p className="text-xs font-normal text-muted-foreground">
            Department budget remaining: $
            {approval.department_budget_remaining.toLocaleString()}
          </p>
          <p className="text-xs font-normal text-muted-foreground">
            Recent expenses
          </p>
          <ul className="flex flex-col gap-0.5">
            {approval.recent_expenses.map((exp, i) => (
              <li
                key={i}
                className="text-xs text-muted-foreground"
              >
                {exp.date} · {exp.merchant} · ${exp.amount.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      {isPending && (
        <CardFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onDecide(approval.id, "denied")}
          >
            Deny
          </Button>
          <Button onClick={() => onDecide(approval.id, "approved")}>
            Approve
          </Button>
        </CardFooter>
      )}
      {!isPending && (
        <CardFooter>
          <Badge variant="secondary">{approval.status}</Badge>
        </CardFooter>
      )}
    </Card>
  );
}
