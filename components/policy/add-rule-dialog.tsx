"use client";

import { useState } from "react";
import { PlusIcon } from "@phosphor-icons/react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMockStore } from "@/lib/hooks/use-mock-store";
import type { PolicyCategory } from "@/lib/types/brim";

const categories: { value: PolicyCategory; label: string }[] = [
  { value: "spend", label: "Spend limit" },
  { value: "approval", label: "Approval threshold" },
  { value: "travel", label: "Travel" },
  { value: "restriction", label: "Restriction" },
];

export function AddRuleDialog() {
  const { addPolicy } = useMockStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    policy_name: "",
    value: "",
    description: "",
    reference: "",
    scope: "All",
    category: "spend" as PolicyCategory,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.policy_name || !form.value) {
      toast.error("Name and rule value are required");
      return;
    }
    addPolicy(form);
    toast.success("Rule added");
    setOpen(false);
    setForm({
      policy_name: "",
      value: "",
      description: "",
      reference: "",
      scope: "All",
      category: "spend",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon data-icon="inline-start" />
          Add rule
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add expense rule</DialogTitle>
          <DialogDescription>
            Define a new policy rule. Brim will scan transactions against it in
            real time once connected.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="policy_name">Rule name</Label>
            <Input
              id="policy_name"
              value={form.policy_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, policy_name: e.target.value }))
              }
              placeholder="Individual meal limit"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="value">Rule value</Label>
            <Input
              id="value"
              value={form.value}
              onChange={(e) =>
                setForm((f) => ({ ...f, value: e.target.value }))
              }
              placeholder="$75 / person / meal"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Team meals exempt up to $1,000..."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="reference">Reference</Label>
            <Input
              id="reference"
              value={form.reference}
              onChange={(e) =>
                setForm((f) => ({ ...f, reference: e.target.value }))
              }
              placeholder="policy.pdf §2.1"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="scope">Scope</Label>
              <Input
                id="scope"
                value={form.scope}
                onChange={(e) =>
                  setForm((f) => ({ ...f, scope: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    category: e.target.value as PolicyCategory,
                  }))
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add rule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
