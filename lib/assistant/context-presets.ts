import type { AssistantContext, AssistantDatePreset } from "@/lib/types/brim";

export const ASSISTANT_DEPARTMENTS = [
  "Engineering",
  "Sales",
  "Marketing",
  "Product",
  "Finance",
] as const;

export type AssistantDepartment = (typeof ASSISTANT_DEPARTMENTS)[number];

const formatDate = (date: Date) => date.toISOString().split("T")[0];

export function resolveDateRange(preset: AssistantDatePreset): {
  date_from: string;
  date_to: string;
} {
  const today = new Date();

  if (preset === "q2") {
    return { date_from: "2026-04-01", date_to: "2026-06-30" };
  }

  if (preset === "this_month") {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return { date_from: formatDate(start), date_to: formatDate(today) };
  }

  const start = new Date(today);
  start.setDate(start.getDate() - 30);
  return { date_from: formatDate(start), date_to: formatDate(today) };
}

export function createDefaultAssistantContext(): AssistantContext {
  const range = resolveDateRange("q2");
  return {
    preset: "q2",
    date_from: range.date_from,
    date_to: range.date_to,
    departments: [],
  };
}

export function applyContextPreset(
  preset: AssistantDatePreset,
  departments: string[] = []
): AssistantContext {
  const range = resolveDateRange(preset);
  return {
    preset,
    date_from: range.date_from,
    date_to: range.date_to,
    departments,
  };
}

export function contextLabel(context: AssistantContext): string {
  const presetLabels: Record<AssistantDatePreset, string> = {
    q2: "Q2",
    last_30d: "Last 30d",
    this_month: "This month",
  };
  const deptLabel =
    context.departments.length === 0
      ? "All depts"
      : context.departments.join(", ");
  return `${presetLabels[context.preset]} · ${deptLabel}`;
}

export const ASSISTANT_STARTER_PROMPTS = [
  {
    title: "Spend by department",
    prompt: "Show spend by department this quarter",
    category: "Spend",
  },
  {
    title: "Active flags",
    prompt: "How many flags this month?",
    category: "Compliance",
  },
  {
    title: "Meal violations",
    prompt: "Which meals exceeded policy limits?",
    category: "Policy",
  },
  {
    title: "Pending approvals",
    prompt: "Summarize pending approval requests",
    category: "Approvals",
  },
  {
    title: "Travel spend",
    prompt: "Show weekly travel spend trend",
    category: "Spend",
  },
  {
    title: "Flagged transactions",
    prompt: "List recent flagged transactions",
    category: "Compliance",
  },
] as const;
