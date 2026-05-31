"use client";

import {
  ArrowsOutIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ASSISTANT_DEPARTMENTS,
  contextLabel,
} from "@/lib/assistant/context-presets";
import type { AssistantDatePreset, AssistantLayoutMode } from "@/lib/types/brim";
import { cn } from "@/lib/utils";
import type { AssistantContext } from "@/lib/types/brim";

const PRESETS: { id: AssistantDatePreset; label: string }[] = [
  { id: "q2", label: "Q2" },
  { id: "last_30d", label: "Last 30d" },
  { id: "this_month", label: "This month" },
];

type AssistantToolbarProps = {
  context: AssistantContext;
  layoutMode: AssistantLayoutMode;
  onPresetChange: (preset: AssistantDatePreset) => void;
  onDepartmentsChange: (departments: string[]) => void;
  onNewChat: () => void;
  onExpandViz?: () => void;
  canExpandViz?: boolean;
};

export function AssistantToolbar({
  context,
  layoutMode,
  onPresetChange,
  onDepartmentsChange,
  onNewChat,
  onExpandViz,
  canExpandViz,
}: AssistantToolbarProps) {
  const toggleDepartment = (dept: string) => {
    const selected = context.departments.includes(dept)
      ? context.departments.filter((d) => d !== dept)
      : [...context.departments, dept];
    onDepartmentsChange(selected);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-3">
      <div className="flex flex-wrap items-center gap-1">
        {PRESETS.map((preset) => (
          <Button
            key={preset.id}
            type="button"
            size="sm"
            variant={context.preset === preset.id ? "default" : "outline"}
            className={cn(
              context.preset !== preset.id && "border-border/60 bg-transparent"
            )}
            onClick={() => onPresetChange(preset.id)}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" size="sm" variant="outline" className="border-border/60">
            Departments
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Filter by department</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={context.departments.length === 0}
              onCheckedChange={() => onDepartmentsChange([])}
            >
              All departments
            </DropdownMenuCheckboxItem>
            {ASSISTANT_DEPARTMENTS.map((dept) => (
              <DropdownMenuCheckboxItem
                key={dept}
                checked={context.departments.includes(dept)}
                onCheckedChange={() => toggleDepartment(dept)}
              >
                {dept}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Badge variant="secondary" className="font-normal">
        Context: {contextLabel(context)}
      </Badge>

      <div className="ml-auto flex items-center gap-2">
        {layoutMode === "split" && canExpandViz && onExpandViz && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-border/60"
            onClick={onExpandViz}
          >
            <ArrowsOutIcon data-icon="inline-start" />
            Expand
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="border-border/60"
          onClick={onNewChat}
        >
          <PlusIcon data-icon="inline-start" />
          New chat
        </Button>
      </div>
    </div>
  );
}
