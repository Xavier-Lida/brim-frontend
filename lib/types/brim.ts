export type PolicyRequirements = {
  approval_threshold_cad?: number;
  category_limits_cad?: Record<string, number>;
  restricted_categories?: string[];
  restricted_merchants?: string[];
  notes?: string;
};

export type Policy = {
  id: string;
  policy_name: string;
  policy_requirements: PolicyRequirements;
  effective_date: string;
  active: boolean;
};

/** Policy row returned by import preview (no id yet). */
export type PolicyImportDraft = Omit<Policy, "id"> & { id?: string };

export type Employee = {
  id: string;
  first_name: string;
  last_name: string;
  department_id: string;
  department_name: string;
};

export type TransactionStatus = "pending" | "approved" | "denied" | "flagged";

export type Transaction = {
  id: string;
  employee_id: string;
  employee_name: string;
  date: string;
  amount: number;
  merchant_name: string;
  merchant_category: string;
  city: string;
  status: TransactionStatus;
  flag_count: number;
};

export type TransactionFlag = {
  id: string;
  transaction_id: string;
  warning_message: string;
  weight: number;
  reviewed: boolean;
  transaction?: Transaction;
  employee_name?: string;
};

export type ApprovalStatus = "pending" | "approved" | "denied";

export type AiRecommendation = "approve" | "review" | "deny";

export type ApprovalRequest = {
  id: string;
  transaction_id: string;
  employee_id: string;
  employee_name: string;
  department_name: string;
  amount: number;
  reason: string;
  ai_recommendation: AiRecommendation;
  ai_reasoning: string;
  status: ApprovalStatus;
  department_budget_remaining: number;
  recent_expenses: { date: string; merchant: string; amount: number }[];
};

export type Notification = {
  id: string;
  type: "flag" | "approval" | "decision";
  reference_id: string;
  message: string;
  read: boolean;
  created_at: string;
};

export type VisualizationType = "bar" | "line" | "pie" | "table" | "kpi";

export type SeriesPoint = { name: string; value: number };

// Canonical, server-authoritative shapes. The backend owns column selection so
// the frontend only renders. Normalizers stay tolerant of legacy payloads.
export type Visualization =
  | { type: "bar" | "line"; title: string; data: { series: SeriesPoint[] } }
  | { type: "pie"; title: string; data: { segments: SeriesPoint[] } }
  | { type: "table"; title: string; data: { columns: string[]; rows: string[][] } }
  | {
      type: "kpi";
      title: string;
      data: { value: string; label: string; change?: string };
    };

export type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  activity?: string;
  visualization?: Visualization;
  followUpSuggestions?: string[];
  sql?: string;
  streaming?: boolean;
  created_at: string;
};

export type AssistantDatePreset = "q2" | "last_30d" | "this_month";

export type AssistantContext = {
  preset: AssistantDatePreset;
  date_from: string;
  date_to: string;
  departments: string[];
};

export type AssistantLayoutMode = "centered" | "split";

export type AssistantSessionState = {
  messages: AssistantMessage[];
  context: AssistantContext;
  layoutMode: AssistantLayoutMode;
  activeVisualizationId?: string;
};

export type WorkspaceUser = {
  name: string;
  role: string;
  email: string;
};

export type CompanySpend = {
  period: string;
  spent: number;
  budget: number;
};

export type ExpenseReport = {
  id: string;
  employee_id: string;
  event_group_id: string;
  title: string;
  date_from: string;
  date_to: string;
  total_amount: number;
  status: string;
  pdf_url: string | null;
  ai_recommendation: AiRecommendation;
  ai_reasoning: string;
  created_at?: string;
};

export type FlagsPage = {
  items: TransactionFlag[];
  has_more: boolean;
  limit: number;
  offset: number;
  unread_count: number;
};

export type ReportsPage = {
  items: ExpenseReport[];
  has_more: boolean;
  limit: number;
  offset: number;
  total_count?: number;
};
