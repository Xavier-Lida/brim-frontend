"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  ApprovalRequest,
  ApprovalStatus,
  AssistantMessage,
  ImportedPolicyDraft,
  Notification,
  Policy,
  TransactionFlag,
} from "@/lib/types/brim";
import {
  companySpend,
  initialApprovals,
  initialAssistantMessages,
  initialFlags,
  initialNotifications,
  initialPolicies,
  initialTransactions,
  workspaceUser,
} from "@/lib/mocks/fixtures";
import {
  analyzePolicyImport,
  createPolicyFromDraft,
  createPolicyFromForm,
  generateAssistantResponse,
  generateId,
} from "@/lib/mocks/services";
import type { PolicyCategory, Transaction } from "@/lib/types/brim";

type MockStore = {
  policies: Policy[];
  approvals: ApprovalRequest[];
  flags: TransactionFlag[];
  transactions: Transaction[];
  notifications: Notification[];
  assistantMessages: AssistantMessage[];
  searchQuery: string;
  companySpend: typeof companySpend;
  workspaceUser: typeof workspaceUser;
  pendingApprovalsCount: number;
  unreadFlagsCount: number;
  unreadNotificationsCount: number;
  activePoliciesCount: number;
  setSearchQuery: (query: string) => void;
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
  decideApproval: (id: string, status: ApprovalStatus) => void;
  markFlagReviewed: (id: string) => void;
  markNotificationRead: (id: string) => void;
  sendAssistantMessage: (text: string) => Promise<void>;
};

const MockStoreContext = createContext<MockStore | null>(null);

export function MockStoreProvider({ children }: { children: ReactNode }) {
  const [policies, setPolicies] = useState(initialPolicies);
  const [approvals, setApprovals] = useState(initialApprovals);
  const [flags, setFlags] = useState(initialFlags);
  const [transactions] = useState(initialTransactions);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [assistantMessages, setAssistantMessages] = useState(
    initialAssistantMessages
  );
  const [searchQuery, setSearchQuery] = useState("");

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

  const decideApproval = useCallback((id: string, status: ApprovalStatus) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  }, []);

  const markFlagReviewed = useCallback((id: string) => {
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, reviewed: true } : f))
    );
  }, []);

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
    notifications,
    assistantMessages,
    searchQuery,
    companySpend,
    workspaceUser,
    pendingApprovalsCount,
    unreadFlagsCount,
    unreadNotificationsCount,
    activePoliciesCount,
    setSearchQuery,
    togglePolicy,
    deletePolicy,
    addPolicy,
    importPolicies,
    analyzeImport: analyzePolicyImport,
    decideApproval,
    markFlagReviewed,
    markNotificationRead,
    sendAssistantMessage,
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
