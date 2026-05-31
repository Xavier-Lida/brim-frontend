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
import { askAssistantStream } from "@/lib/api/assistant-stream";
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
  workspaceUser,
} from "@/lib/mocks/fixtures";
import { useAssistantSession } from "@/lib/hooks/use-assistant-session";
import type {
  ApprovalRequest,
  ApprovalStatus,
  AssistantDatePreset,
  AssistantMessage,
  AssistantSessionState,
  ExpenseReport,
  Notification,
  Policy,
  PolicyImportDraft,
  PolicyRequirements,
  Transaction,
  TransactionFlag,
  Visualization,
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
  assistantSession: AssistantSessionState;
  assistantActiveVisualization?: Visualization;
  assistantIsSending: boolean;
  assistantVizFullscreenOpen: boolean;
  setAssistantVizFullscreenOpen: (open: boolean) => void;
  setAssistantContextPreset: (preset: AssistantDatePreset) => void;
  setAssistantDepartments: (departments: string[]) => void;
  clearAssistantChat: () => void;
  selectAssistantVisualization: (messageId: string) => void;
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
  const assistant = useAssistantSession();
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

  const togglePolicy = useCallback(
    async (id: string) => {
      const policy = policies.find((p) => p.id === id);
      if (!policy) return;
      const updated = await updatePolicy(id, { active: !policy.active });
      setPolicies((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
      );
    },
    [policies]
  );

  const deletePolicy = useCallback(async (id: string) => {
    await deletePolicyApi(id);
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: false } : p))
    );
  }, []);

  const addPolicy = useCallback(
    async (data: {
      policy_name: string;
      policy_requirements: PolicyRequirements;
      effective_date?: string;
    }) => {
      const created = await createPolicy(data);
      setPolicies((prev) => [created, ...prev]);
    },
    []
  );

  const importPolicies = useCallback(async (drafts: PolicyImportDraft[]) => {
    const result = await confirmPolicyImport(drafts);
    setPolicies((prev) => [...result.policies, ...prev]);
  }, []);

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

  const sendAssistantMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || assistant.isSending) return;

      assistant.setIsSending(true);
      const history = assistant.buildHistory(assistant.session.messages);
      assistant.appendUserMessage(trimmed);
      const assistantId = assistant.beginAssistantMessage();
      let accumulated = "";

      try {
        await askAssistantStream(
          trimmed,
          history,
          {
            date_from: assistant.session.context.date_from,
            date_to: assistant.session.context.date_to,
            departments: assistant.session.context.departments,
          },
          (event) => {
            switch (event.type) {
              case "text_delta":
                accumulated += event.delta;
                assistant.patchAssistantMessage(assistantId, {
                  text: accumulated,
                  streaming: true,
                });
                break;
              case "visualization":
                assistant.patchAssistantMessage(assistantId, {
                  visualization: event.visualization,
                });
                break;
              case "follow_up":
                assistant.patchAssistantMessage(assistantId, {
                  followUpSuggestions: event.suggestions,
                });
                break;
              case "error":
                assistant.patchAssistantMessage(assistantId, {
                  text: accumulated || event.message,
                  streaming: false,
                });
                break;
              case "done":
                assistant.patchAssistantMessage(assistantId, {
                  streaming: false,
                });
                break;
            }
          }
        );
      } finally {
        assistant.setIsSending(false);
      }
    },
    [assistant]
  );

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
    assistantMessages: assistant.session.messages,
    assistantSession: assistant.session,
    assistantActiveVisualization: assistant.activeVisualization,
    assistantIsSending: assistant.isSending,
    assistantVizFullscreenOpen: assistant.vizFullscreenOpen,
    setAssistantVizFullscreenOpen: assistant.setVizFullscreenOpen,
    setAssistantContextPreset: assistant.setContextPreset,
    setAssistantDepartments: assistant.setDepartments,
    clearAssistantChat: assistant.clearChat,
    selectAssistantVisualization: assistant.selectVisualization,
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
