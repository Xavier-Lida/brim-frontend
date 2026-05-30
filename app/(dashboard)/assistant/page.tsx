import { AssistantChat } from "@/components/assistant/assistant-chat";

export default function AssistantPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <div>
        <h2 className="text-xl font-normal text-foreground/90">
          Brim Assistant
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ask about spend, compliance, and policy coverage across Northwind Labs.
        </p>
      </div>
      <AssistantChat />
    </div>
  );
}
