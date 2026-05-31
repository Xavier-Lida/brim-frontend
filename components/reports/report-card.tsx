"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AiRecommendation, ExpenseReport } from "@/lib/types/brim";

const recommendationVariant: Record<
  AiRecommendation,
  "default" | "secondary" | "destructive"
> = {
  approve: "default",
  review: "secondary",
  deny: "destructive",
};

type ReportCardProps = {
  report: ExpenseReport;
};

export function ReportCard({ report }: ReportCardProps) {
  return (
    <Card className="border-border/50 shadow-none">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base font-medium">{report.title}</CardTitle>
            <CardDescription>
              {report.date_from} – {report.date_to} · $
              {report.total_amount.toFixed(2)}
            </CardDescription>
          </div>
          <Badge
            variant={
              report.ai_recommendation === "approve"
                ? "secondary"
                : recommendationVariant[report.ai_recommendation]
            }
            className={
              report.ai_recommendation === "approve"
                ? "border border-primary/20 bg-blue-soft text-primary/80"
                : undefined
            }
          >
            AI: {report.ai_recommendation}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{report.ai_reasoning}</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Badge variant="outline">{report.status}</Badge>
        {report.pdf_url && (
          <a
            href={report.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary/80 hover:underline"
          >
            View PDF →
          </a>
        )}
      </CardFooter>
    </Card>
  );
}
