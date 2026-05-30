export type PolicyCategory = "spend" | "approval" | "travel" | "restriction";

export type PolicyRequirements = {
  value: string;
  description: string;
  reference: string;
  scope: string;
  category: PolicyCategory;
};

export type Policy = {
  id: string;
  policy_name: string;
  policy_requirements: PolicyRequirements;
  effective_date: string;
  active: boolean;
};

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
  type: "flag" | "approval" | "report";
  reference_id: string;
  message: string;
  read: boolean;
  created_at: string;
};

export type VisualizationType = "bar" | "line" | "pie" | "table" | "kpi";

export type Visualization = {
  type: VisualizationType;
  title: string;
  data: Record<string, unknown>;
};

export type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  visualization?: Visualization;
  followUpSuggestions?: string[];
  created_at: string;
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

export type ImportedPolicyDraft = {
  policy_name: string;
  value: string;
  description: string;
  reference: string;
  scope: string;
  category: PolicyCategory;
};
