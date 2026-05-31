"use client";

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
import type { MapEmployee } from "@/lib/types/map";

type EmployeeMapFilterProps = {
  employees: MapEmployee[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
};

export function EmployeeMapFilter({
  employees,
  selectedIds,
  onSelectionChange,
}: EmployeeMapFilterProps) {
  const toggle = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    onSelectionChange(next);
  };

  const selectAll = () => onSelectionChange(employees.map((e) => e.id));
  const clearAll = () => onSelectionChange([]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" size="sm" variant="outline" className="border-border/60">
          Employees
          {selectedIds.length > 0 && (
            <Badge variant="secondary" className="ml-2 font-normal">
              {selectedIds.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-72 w-56 overflow-y-auto">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Show on map</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={selectedIds.length === employees.length && employees.length > 0}
            onCheckedChange={() =>
              selectedIds.length === employees.length ? clearAll() : selectAll()
            }
          >
            Select all
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={selectedIds.length === 0}
            onCheckedChange={() => clearAll()}
          >
            Clear selection
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          {employees.map((emp) => (
            <DropdownMenuCheckboxItem
              key={emp.id}
              checked={selectedIds.includes(emp.id)}
              onCheckedChange={() => toggle(emp.id)}
            >
              <span className="flex flex-col gap-0.5">
                <span>{emp.name}</span>
                <span className="text-xs text-muted-foreground">
                  {emp.transaction_count} transaction
                  {emp.transaction_count !== 1 ? "s" : ""}
                </span>
              </span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
