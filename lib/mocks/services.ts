import type {
  AssistantMessage,
  ImportedPolicyDraft,
  Policy,
  PolicyCategory,
} from "@/lib/types/brim";
import { mockImportPreview } from "@/lib/mocks/fixtures";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export async function analyzePolicyImport(
  _content: string
): Promise<ImportedPolicyDraft[]> {
  await delay(800);
  return mockImportPreview.map((draft) => ({ ...draft }));
}

export async function generateAssistantResponse(
  query: string
): Promise<Omit<AssistantMessage, "id" | "created_at">> {
  await delay(600);
  const q = query.toLowerCase();

  if (q.includes("department") || q.includes("spend by")) {
    return {
      role: "assistant",
      text: "Here's Q2 spend by department. Engineering leads at 38% of total company spend, followed by Sales and Marketing.",
      visualization: {
        type: "bar",
        title: "Q2 spend by department",
        data: {
          labels: ["Engineering", "Sales", "Marketing", "Product", "Finance"],
          values: [44380, 31200, 18900, 12400, 9920],
        },
      },
      followUpSuggestions: [
        "Which department has the most flags?",
        "Show Engineering spend trend",
        "Compare to Q1 budget",
      ],
    };
  }

  if (q.includes("flag") && (q.includes("month") || q.includes("how many"))) {
    return {
      role: "assistant",
      text: "You have 4 active compliance flags this month. Two are high-weight (≥4) and require immediate review.",
      visualization: {
        type: "kpi",
        title: "Flags this month",
        data: {
          value: "4",
          label: "Active flags",
          change: "+2 vs last month",
        },
      },
      followUpSuggestions: [
        "Show flagged transactions",
        "Which employees have the most flags?",
        "Break down flags by policy type",
      ],
    };
  }

  if (q.includes("meal") || q.includes("violation")) {
    return {
      role: "assistant",
      text: "3 meal transactions exceeded the $75/person limit this month. Split-payment patterns account for 2 of them.",
      visualization: {
        type: "pie",
        title: "Meal policy violations by type",
        data: {
          segments: [
            { name: "Over limit", value: 1 },
            { name: "Split payment", value: 2 },
          ],
        },
      },
      followUpSuggestions: [
        "Show Sarah Chen's San Diego transactions",
        "List all restaurant flags",
        "What's our meal spend trend?",
      ],
    };
  }

  if (q.includes("transaction") || q.includes("table") || q.includes("recent")) {
    return {
      role: "assistant",
      text: "Here are the 5 most recent flagged transactions across the company.",
      visualization: {
        type: "table",
        title: "Recent flagged transactions",
        data: {
          columns: ["Employee", "Merchant", "Amount", "Weight"],
          rows: [
            ["Sarah Chen", "Nobu San Diego", "$142.50", "4"],
            ["Sarah Chen", "Split payment", "$38.75", "5"],
            ["Maria Santos", "The Whiskey Bar", "$156.00", "3"],
            ["Priya Patel", "Four Seasons", "$2,750.00", "4"],
          ],
        },
      },
      followUpSuggestions: [
        "Approve pending hardware requests",
        "Show compliance scan summary",
        "Export flag report",
      ],
    };
  }

  if (q.includes("trend") || q.includes("line")) {
    return {
      role: "assistant",
      text: "Company spend has increased 12% week-over-week, driven primarily by conference registrations in May.",
      visualization: {
        type: "line",
        title: "Weekly spend trend (Q2)",
        data: {
          labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
          values: [18200, 19400, 21100, 22800, 24500, 26200],
        },
      },
      followUpSuggestions: [
        "Which categories drove the increase?",
        "Show spend by department",
        "Compare to budget pace",
      ],
    };
  }

  return {
    role: "assistant",
    text: "I can help with spend analysis, compliance flags, policy coverage, and approval queues. Try asking about department spend, flags this month, or meal violations.",
    followUpSuggestions: [
      "Show spend by department this quarter",
      "How many flags this month?",
      "Which meals exceeded policy limits?",
    ],
  };
}

export function createPolicyFromDraft(
  draft: ImportedPolicyDraft
): Omit<Policy, "id"> {
  return {
    policy_name: draft.policy_name,
    policy_requirements: {
      value: draft.value,
      description: draft.description,
      reference: draft.reference,
      scope: draft.scope,
      category: draft.category,
    },
    effective_date: new Date().toISOString().split("T")[0],
    active: true,
  };
}

export function createPolicyFromForm(data: {
  policy_name: string;
  value: string;
  description: string;
  reference: string;
  scope: string;
  category: PolicyCategory;
}): Omit<Policy, "id"> {
  return {
    policy_name: data.policy_name,
    policy_requirements: {
      value: data.value,
      description: data.description,
      reference: data.reference,
      scope: data.scope,
      category: data.category,
    },
    effective_date: new Date().toISOString().split("T")[0],
    active: true,
  };
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
