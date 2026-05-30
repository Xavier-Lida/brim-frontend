"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Visualization } from "@/lib/types/brim";

const chartConfig = {
  value: { label: "Amount", color: "var(--chart-1)" },
  spend: { label: "Spend", color: "var(--chart-3)" },
} satisfies ChartConfig;

const pieColors = [
  "var(--chart-1)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

type AssistantVisualizationProps = {
  visualization: Visualization;
};

export function AssistantVisualization({
  visualization,
}: AssistantVisualizationProps) {
  const { type, title, data } = visualization;

  if (type === "kpi") {
    const kpiData = data as {
      value: string;
      label: string;
      change?: string;
    };
    return (
      <div className="rounded-xl border border-border/50 bg-card p-4">
        <p className="text-xs font-normal text-muted-foreground">{title}</p>
        <p className="mt-1 text-2xl font-normal text-primary/80">
          {kpiData.value}
        </p>
        <p className="text-sm text-muted-foreground">{kpiData.label}</p>
        {kpiData.change && (
          <p className="mt-1 text-xs text-muted-foreground">{kpiData.change}</p>
        )}
      </div>
    );
  }

  if (type === "table") {
    const tableData = data as {
      columns: string[];
      rows: string[][];
    };
    return (
      <div className="rounded-xl border border-border/50">
        <p className="border-b border-border/40 px-4 py-2 text-xs font-normal text-muted-foreground">
          {title}
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              {tableData.columns.map((col) => (
                <TableHead key={col}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.rows.map((row, i) => (
              <TableRow key={i}>
                {row.map((cell, j) => (
                  <TableCell key={j}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (type === "bar") {
    const barData = data as { labels: string[]; values: number[] };
    const chartData = barData.labels.map((label, i) => ({
      name: label,
      spend: barData.values[i],
    }));
    return (
      <div className="rounded-xl border border-border/50 bg-card p-4">
        <p className="mb-3 text-xs font-normal text-muted-foreground">{title}</p>
        <ChartContainer config={chartConfig} className="h-48 w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="spend" fill="var(--color-spend)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
    );
  }

  if (type === "line") {
    const lineData = data as { labels: string[]; values: number[] };
    const chartData = lineData.labels.map((label, i) => ({
      name: label,
      value: lineData.values[i],
    }));
    return (
      <div className="rounded-xl border border-border/50 bg-card p-4">
        <p className="mb-3 text-xs font-normal text-muted-foreground">{title}</p>
        <ChartContainer config={chartConfig} className="h-48 w-full">
          <LineChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-value)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
    );
  }

  if (type === "pie") {
    const pieData = data as {
      segments: { name: string; value: number }[];
    };
    return (
      <div className="rounded-xl border border-border/50 bg-card p-4">
        <p className="mb-3 text-xs font-normal text-muted-foreground">{title}</p>
        <ChartContainer config={chartConfig} className="mx-auto h-48 w-full max-w-xs">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={pieData.segments}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
            >
              {pieData.segments.map((_, i) => (
                <Cell key={i} fill={pieColors[i % pieColors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
    );
  }

  return null;
}
