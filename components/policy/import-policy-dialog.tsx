"use client";

import { useState } from "react";
import { UploadIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMockStore } from "@/lib/hooks/use-mock-store";
import type { ImportedPolicyDraft } from "@/lib/types/brim";

export function ImportPolicyDialog() {
  const { analyzeImport, importPolicies } = useMockStore();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"upload" | "preview">("upload");
  const [content, setContent] = useState("");
  const [drafts, setDrafts] = useState<ImportedPolicyDraft[]>([]);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setStep("upload");
    setContent("");
    setDrafts([]);
    setLoading(false);
  };

  const handleAnalyze = async () => {
    if (!content.trim()) {
      toast.error("Paste policy text or upload content first");
      return;
    }
    setLoading(true);
    try {
      const result = await analyzeImport(content);
      setDrafts(result);
      setStep("preview");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    importPolicies(drafts);
    toast.success(`${drafts.length} rules imported`);
    setOpen(false);
    reset();
  };

  const updateDraft = (
    index: number,
    field: keyof ImportedPolicyDraft,
    value: string
  ) => {
    setDrafts((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: value } : d))
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <UploadIcon data-icon="inline-start" />
          Import policy
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import expense policy</DialogTitle>
          <DialogDescription>
            Upload a PDF or paste policy text. Brim will extract rules for your
            review before saving.
          </DialogDescription>
        </DialogHeader>

        {step === "upload" ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="policy-file">PDF upload (mock)</Label>
              <Input
                id="policy-file"
                type="file"
                accept=".pdf,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setContent(`[Uploaded: ${file.name}] Expense policy document content...`);
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="policy-text">Or paste policy text</Label>
              <Textarea
                id="policy-text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your expense policy document here..."
                rows={6}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleAnalyze} disabled={loading}>
                {loading ? "Analyzing..." : "Analyze with AI"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Review extracted rules before confirming import.
            </p>
            <div className="max-h-64 overflow-auto rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Scope</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drafts.map((draft, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Input
                          value={draft.policy_name}
                          onChange={(e) =>
                            updateDraft(i, "policy_name", e.target.value)
                          }
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={draft.value}
                          onChange={(e) =>
                            updateDraft(i, "value", e.target.value)
                          }
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={draft.scope}
                          onChange={(e) =>
                            updateDraft(i, "scope", e.target.value)
                          }
                          className="h-8"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setStep("upload")}>
                Back
              </Button>
              <Button onClick={handleConfirm}>
                Confirm import ({drafts.length})
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
