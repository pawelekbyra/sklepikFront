"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterDropdownProps {
  label: string;
  badgeCount?: number;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: React.ReactNode;
  align?: "left" | "right";
}

export function FilterDropdown({
  label,
  badgeCount,
  isOpen,
  onToggle,
  onClose,
  children,
  align = "left",
}: FilterDropdownProps) {
  const hasActive = badgeCount !== undefined && badgeCount > 0;

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={(open) => {
        if (open) onToggle();
        else onClose();
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={isOpen}
          aria-haspopup="menu"
          size="sm"
          className="rounded-full border-[#3b2415]/20 bg-[#fffaf0] font-bold text-[#26180f] hover:border-[#d95d00]/40 hover:bg-[#fff1bf]"
        >
          <span>{label}</span>
          {hasActive && (
            <span className="flex items-center justify-center w-5 h-5 text-xs rounded-full bg-[#d95d00] text-white">
              {badgeCount}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={align === "right" ? "end" : "start"}
        className="rounded-2xl border-[#3b2415]/10 bg-[#fffaf0] p-2 shadow-2xl"
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
