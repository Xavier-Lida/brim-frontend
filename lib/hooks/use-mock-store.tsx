"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { askAssistant } from "@/lib/api/assistant";
import {
  decideApproval as decideApprovalApi,
  getApprovals,
  runApprovalsPipeline as runApprovalsPipelineApi,
} from "@/lib/api/approvals";
import { runComplianceScan as runComplianceScanApi } from "@/lib/api/compliance";
import { getFlags, markFlagReviewed as markFlagReviewedApi } from "@/lib/api/flags";
import {
  getNotifications,
  markNotificationReadApi,
} from "@/lib/api/notifications";
import {
  confirmPolicyImport,
  createPolicy,
  deletePolicy as deletePolicyApi,
  getPolicies,
  importPoliciesPreview,
  updatePolicy,
} from "@/lib/api/policies";
import {
  generateReports as generateReportsApi,
  getReports,
} from "@/lib/api/reports";
import { getTransactions, TRANSACTIONS_PAGE_SIZE } from "@/lib/api/transactions";
import {
  companySpend,
  initialAssistantMessages,
  workspaceUser,
} from "@/lib/mocks/fixtures";
import { generateId } from "@/lib/mocks/services";
import { toast } from "sonner";
import type {
  ApprovalRequest,
  ApprovalStatus,
  AssistantMessage,
  ExpenseReport,
  Notification,
  Policy,
  PolicyImportDraft,
  PolicyRequirements,
  Transaction,
  TransactionFlag,
} from "@/lib/types/brim";

type MockStore = {
  policies: Policy[];
  approvals: ApprovalRequest[];
  flags: TransactionFlag[];
  transactions: Transaction[];
  transactionsHasMore: boolean;
  transactionsLoading: boolean;
  transactionsLoadingMore: boolean;
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
  loadTransactions: () => Promise<void>;
  loadMoreTransactions: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  refreshFlags: () => Promise<void>;
  refreshApprovals: () => Promise<void>;
  refreshReports: () => Promise<void>;
  refreshPolicies: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  refreshAll: () => Promise<void>;
  togglePolicy: (id: string) => Promise<void>;
  deletePolicy: (id: string) => Promise<void>;
  addPolicy: (data: {
    policy_name: string;
    policy_requirements: PolicyRequirements;
    effective_date?: string;
  }) => Promise<void>;
  importPolicies: (drafts: PolicyImportDraft[]) => Promise<void>;
  analyzeImport: (input: {
    content?: string;
    pdf_base64?: string;
  }) => Promise<PolicyImportDraft[]>;
  decideApproval: (id: string, status: ApprovalStatus) => Promise<void>;
  markFlagReviewed: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  sendAssistantMessage: (text: string) => Promise<void>;
  runComplianceScan: () => Promise<void>;
  runApprovalsPipeline: () => Promise<void>;
  generateReports: () => Promise<void>;
};

const MockStoreContext = createContext<MockStore | null>(null);

export function MockStoreProvider({ children }: { children: ReactNode }) {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [flags, setFlags] = useState<TransactionFlag[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const transactionsRef = useRef<Transaction[]>([]);
  const [transactionsHasMore, setTransactionsHasMore] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsLoadingMore, setTransactionsLoadingMore] = useState(false);
  const [reports, setReports] = useState<ExpenseReport[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [assistantMessages, setAssistantMessages] = useState(
    initialAssistantMessages
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    transactionsRef.current = transactions;
  }, [transactions]);

  const mergeTransactions = useCallback(
    (prev: Transaction[], incoming: Transaction[]) => {
      const seen = new Set(prev.map((t) => t.id));
      const unique = incoming.filter((t) => !seen.has(t.id));
      return unique.length > 0 ? [...prev, ...unique] : prev;
    },
    []
  );

  const loadTransactions = useCallback(async () => {
    setTransactionsLoading(true);
    try {
      const page = await getTransactions({
        limit: TRANSACTIONS_PAGE_SIZE,
        offset: 0,
      });
      setTransactions(page.items);
      setTransactionsHasMore(page.has_more);
    } finally {
      setTransactionsLoading(false);
    }
  }, []);

  const loadMoreTransactions = useCallback(async () => {
    if (!transactionsHasMore || transactionsLoadingMore) return;
    setTransactionsLoadingMore(true);
    const offset = transactionsRef.current.length;
    try {
      const page = await getTransactions({
        limit: TRANSACTIONS_PAGE_SIZE,
        offset,
      });
      setTransactions((prev) => mergeTransactions(prev, page.items));
      setTransactionsHasMore(page.has_more);
    } finally {
      setTransactionsLoadingMore(false);
    }
  }, [transactionsHasMore, transactionsLoadingMore, mergeTransactions]);

  const refreshTransactions = loadTransactions;

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

  const refreshPolicies = useCallback(async () => {
    const data = await getPolicies();
    setPolicies(data);
  }, []);

  const refreshNotifications = useCallback(async () => {
    const data = await getNotifications();
    setNotifications(data);
  }, []);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([
        refreshFlags(),
        refreshApprovals(),
        refreshReports(),
        refreshPolicies(),
        refreshNotifications(),
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, [
    refreshFlags,
    refreshApprovals,
    refreshReports,
    refreshPolicies,
    refreshNotifications,
  ]);

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

  const afterPolicyChange = useCallback(async () => {
    await Promise.all([
      refreshFlags(),
      refreshTransactions(),
      refreshNotifications(),
    ]);
    toast.success("Rules updated — compliance rescan complete");
  }, [refreshFlags, refreshTransactions, refreshNotifications]);

  const togglePolicy = useCallback(
    async (id: string) => {
      const policy = policies.find((p) => p.id === id);
      if (!policy) return;
      const updated = await updatePolicy(id, { active: !policy.active });
      setPolicies((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
      );
      await afterPolicyChange();
    },
    [policies, afterPolicyChange]
  );

  const deletePolicy = useCallback(async (id: string) => {
    await deletePolicyApi(id);
    setPolicies((prev) => prev.filter((p) => p.id !== id));
    await afterPolicyChange();
  }, [afterPolicyChange]);

  const addPolicy = useCallback(
    async (data: {
      policy_name: string;
      policy_requirements: PolicyRequirements;
      effective_date?: string;
    }) => {
      const created = await createPolicy(data);
      setPolicies((prev) => [created, ...prev]);
      await afterPolicyChange();
    },
    [afterPolicyChange]
  );

  const importPolicies = useCallback(async (drafts: PolicyImportDraft[]) => {
    const result = await confirmPolicyImport(drafts);
    setPolicies((prev) => [...result.policies, ...prev]);
    await afterPolicyChange();
  }, [afterPolicyChange]);

  const analyzeImport = useCallback(
    async (input: { content?: string; pdf_base64?: string }) => {
      const result = await importPoliciesPreview(input);
      return result.policies;
    },
    []
  );

  const decideApproval = useCallback(
    async (id: string, status: ApprovalStatus) => {
      await decideApprovalApi(id, { status });
      await Promise.all([
        refreshApprovals(),
        refreshTransactions(),
        refreshNotifications(),
      ]);
    },
    [refreshApprovals, refreshTransactions, refreshNotifications]
  );

  const markFlagReviewed = useCallback(
    async (id: string) => {
      await markFlagReviewedApi(id);
      await refreshFlags();
    },
    [refreshFlags]
  );

  const runComplianceScan = useCallback(async () => {
    await runComplianceScanApi();
    await Promise.all([
      refreshFlags(),
      refreshTransactions(),
      refreshNotifications(),
    ]);
  }, [refreshFlags, refreshTransactions, refreshNotifications]);

  const runApprovalsPipeline = useCallback(async () => {
    await runApprovalsPipelineApi({ send: false });
    await Promise.all([refreshApprovals(), refreshNotifications()]);
  }, [refreshApprovals, refreshNotifications]);

  const generateReports = useCallback(async () => {
    await generateReportsApi({});
    await refreshReports();
  }, [refreshReports]);

  const markNotificationRead = useCallback(async (id: string) => {
    await markNotificationReadApi(id);
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

    const history = assistantMessages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-6)
      .reduce<{ question: string; summary: string }[]>((acc, msg, idx, arr) => {
        if (msg.role === "user") {
          const next = arr[idx + 1];
          acc.push({
            question: msg.text,
            summary: next?.role === "assistant" ? next.text : "",
          });
        }
        return acc;
      }, []);

    const response = await askAssistant(text, history);
    const assistantMessage: AssistantMessage = {
      id: generateId("msg"),
      role: "assistant",
      text: response.text,
      visualization: response.visualization,
      followUpSuggestions: response.followUpSuggestions,
      sql: response.sql,
      created_at: new Date().toISOString(),
    };
    setAssistantMessages((prev) => [...prev, assistantMessage]);
  }, [assistantMessages]);

  const value: MockStore = {
    policies,
    approvals,
    flags,
    transactions,
    transactionsHasMore,
    transactionsLoading,
    transactionsLoadingMore,
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
    loadTransactions,
    loadMoreTransactions,
    refreshTransactions,
    refreshFlags,
    refreshApprovals,
    refreshReports,
    refreshPolicies,
    refreshNotifications,
    refreshAll,
    togglePolicy,
    deletePolicy,
    addPolicy,
    importPolicies,
    analyzeImport,
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
