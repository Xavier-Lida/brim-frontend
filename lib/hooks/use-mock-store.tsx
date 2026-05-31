"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  decideApproval as decideApprovalApi,
  getApprovals,
  runApprovalsPipeline as runApprovalsPipelineApi,
} from "@/lib/api/approvals";
import { runComplianceScan as runComplianceScanApi } from "@/lib/api/compliance";
import { getFlags, markFlagReviewed as markFlagReviewedApi } from "@/lib/api/flags";
import {
  generateReports as generateReportsApi,
  getReports,
} from "@/lib/api/reports";
import { getTransactions } from "@/lib/api/transactions";
import {
  companySpend,
  initialAssistantMessages,
  initialNotifications,
  initialPolicies,
  workspaceUser,
} from "@/lib/mocks/fixtures";
import {
  analyzePolicyImport,
  createPolicyFromDraft,
  createPolicyFromForm,
  generateAssistantResponse,
  generateId,
} from "@/lib/mocks/services";
import type {
  ApprovalRequest,
  ApprovalStatus,
  AssistantMessage,
  ExpenseReport,
  ImportedPolicyDraft,
  Notification,
  Policy,
  PolicyCategory,
  Transaction,
  TransactionFlag,
} from "@/lib/types/brim";

type MockStore = {
  policies: Policy[];
  approvals: ApprovalRequest[];
  flags: TransactionFlag[];
  transactions: Transaction[];
  reports: ExpenseReport[];
  notifications: Notification[];
  assistantMessages: AssistantMessage[];
  searchQuery: string;
  companySpend: typeof companySpend;
  workspaceUser: typeof workspaceUser;
  isLoading: boolean;
  error: string | null;
  pendingApprovalsCount: number;
  unreadFlagsCount: number;
  unreadNotificationsCount: number;
  activePoliciesCount: number;
  setSearchQuery: (query: string) => void;
  refreshTransactions: () => Promise<void>;
  refreshFlags: () => Promise<void>;
  refreshApprovals: () => Promise<void>;
  refreshReports: () => Promise<void>;
  refreshAll: () => Promise<void>;
  togglePolicy: (id: string) => void;
  deletePolicy: (id: string) => void;
  addPolicy: (data: {
    policy_name: string;
    value: string;
    description: string;
    reference: string;
    scope: string;
    category: PolicyCategory;
  }) => void;
  importPolicies: (drafts: ImportedPolicyDraft[]) => void;
  analyzeImport: (content: string) => Promise<ImportedPolicyDraft[]>;
  decideApproval: (id: string, status: ApprovalStatus) => Promise<void>;
  markFlagReviewed: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => void;
  sendAssistantMessage: (text: string) => Promise<void>;
  runComplianceScan: () => Promise<void>;
  runApprovalsPipeline: () => Promise<void>;
  generateReports: () => Promise<void>;
};

const MockStoreContext = createContext<MockStore | null>(null);

export function MockStoreProvider({ children }: { children: ReactNode }) {
  const [policies, setPolicies] = useState(initialPolicies);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [flags, setFlags] = useState<TransactionFlag[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [reports, setReports] = useState<ExpenseReport[]>([]);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [assistantMessages, setAssistantMessages] = useState(
    initialAssistantMessages
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTransactions = useCallback(async () => {
    const data = await getTransactions();
    setTransactions(data);
  }, []);

  const refreshFlags = useCallback(async () => {
    const data = await getFlags();
    setFlags(data);
  }, []);

  const refreshApprovals = useCallback(async () => {
    const data = await getApprovals();
    setApprovals(data);
  }, []);

  const refreshReports = useCallback(async () => {
    const data = await getReports();
    setReports(data);
  }, []);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([
        refreshTransactions(),
        refreshFlags(),
        refreshApprovals(),
        refreshReports(),
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, [refreshTransactions, refreshFlags, refreshApprovals, refreshReports]);

  useEffect(() => {
    void refreshAll();
  }, [refreshAll]);

  const pendingApprovalsCount = useMemo(
    () => approvals.filter((a) => a.status === "pending").length,
    [approvals]
  );

  const unreadFlagsCount = useMemo(
    () => flags.filter((f) => !f.reviewed).length,
    [flags]
  );

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const activePoliciesCount = useMemo(
    () => policies.filter((p) => p.active).length,
    [policies]
  );

  const togglePolicy = useCallback((id: string) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  }, []);

  const deletePolicy = useCallback((id: string) => {
    setPolicies((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addPolicy = useCallback(
    (data: {
      policy_name: string;
      value: string;
      description: string;
      reference: string;
      scope: string;
      category: PolicyCategory;
    }) => {
      const policy: Policy = {
        id: generateId("pol"),
        ...createPolicyFromForm(data),
      };
      setPolicies((prev) => [policy, ...prev]);
    },
    []
  );

  const importPolicies = useCallback((drafts: ImportedPolicyDraft[]) => {
    const newPolicies: Policy[] = drafts.map((draft) => ({
      id: generateId("pol"),
      ...createPolicyFromDraft(draft),
    }));
    setPolicies((prev) => [...newPolicies, ...prev]);
  }, []);

  const decideApproval = useCallback(
    async (id: string, status: ApprovalStatus) => {
      await decideApprovalApi(id, { status });
      await Promise.all([refreshApprovals(), refreshTransactions()]);
    },
    [refreshApprovals, refreshTransactions]
  );

  const markFlagReviewed = useCallback(
    async (id: string) => {
      await markFlagReviewedApi(id);
      await refreshFlags();
    },
    [refreshFlags]
  );

  const runComplianceScan = useCallback(async () => {
    await runComplianceScanApi({ mock_llm: true });
    await Promise.all([refreshFlags(), refreshTransactions()]);
  }, [refreshFlags, refreshTransactions]);

  const runApprovalsPipeline = useCallback(async () => {
    await runApprovalsPipelineApi({ mock_llm: true, send: false });
    await refreshApprovals();
  }, [refreshApprovals]);

  const generateReports = useCallback(async () => {
    await generateReportsApi({}, { mock_llm: true });
    await refreshReports();
  }, [refreshReports]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const sendAssistantMessage = useCallback(async (text: string) => {
    const userMessage: AssistantMessage = {
      id: generateId("msg"),
      role: "user",
      text,
      created_at: new Date().toISOString(),
    };
    setAssistantMessages((prev) => [...prev, userMessage]);

    const response = await generateAssistantResponse(text);
    const assistantMessage: AssistantMessage = {
      id: generateId("msg"),
      ...response,
      created_at: new Date().toISOString(),
    };
    setAssistantMessages((prev) => [...prev, assistantMessage]);
  }, []);

  const value: MockStore = {
    policies,
    approvals,
    flags,
    transactions,
    reports,
    notifications,
    assistantMessages,
    searchQuery,
    companySpend,
    workspaceUser,
    isLoading,
    error,
    pendingApprovalsCount,
    unreadFlagsCount,
    unreadNotificationsCount,
    activePoliciesCount,
    setSearchQuery,
    refreshTransactions,
    refreshFlags,
    refreshApprovals,
    refreshReports,
    refreshAll,
    togglePolicy,
    deletePolicy,
    addPolicy,
    importPolicies,
    analyzeImport: analyzePolicyImport,
    decideApproval,
    markFlagReviewed,
    markNotificationRead,
    sendAssistantMessage,
    runComplianceScan,
    runApprovalsPipeline,
    generateReports,
  };

  return (
    <MockStoreContext.Provider value={value}>
      {children}
    </MockStoreContext.Provider>
  );
}

export function useMockStore() {
  const context = useContext(MockStoreContext);
  if (!context) {
    throw new Error("useMockStore must be used within MockStoreProvider");
  }
  return context;
}
