"use client";

import {
  CurrencyDollarIcon,
  ShieldIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Policy } from "@/lib/types/brim";
import { TrashIcon } from "@phosphor-icons/react";

const categoryIcons = {
  spend: CurrencyDollarIcon,
  approval: ShieldIcon,
  travel: CurrencyDollarIcon,
  restriction: WarningIcon,
};

type PolicyRuleCardProps = {
  policy: Policy;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function PolicyRuleCard({
  policy,
  onToggle,
  onDelete,
}: PolicyRuleCardProps) {
  const Icon =
    categoryIcons[policy.policy_requirements.category] ?? CurrencyDollarIcon;
  const req = policy.policy_requirements;

  return (
    <div className="flex items-start gap-4 rounded-xl border border-border/50 bg-card p-6 shadow-none">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-soft text-primary/70">
        <Icon />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">
            {policy.policy_name}
          </h3>
          <Badge variant="secondary">{req.scope}</Badge>
        </div>
        <p className="text-base font-medium text-primary/80">{req.value}</p>
        <p className="text-sm text-muted-foreground">{req.description}</p>
        <p className="text-xs text-muted-foreground">{req.reference}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Switch
          checked={policy.active}
          onCheckedChange={() => onToggle(policy.id)}
        />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <TrashIcon />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this rule?</AlertDialogTitle>
              <AlertDialogDescription>
                &ldquo;{policy.policy_name}&rdquo; will be removed from active
                policies. This action cannot be undone in the mock environment.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(policy.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
