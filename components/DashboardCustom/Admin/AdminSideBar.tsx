"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  href?: string;
  onClick?: () => void;
  subItems?: {
    icon: React.ElementType;
    label: string;
    href?: string;
    active?: boolean;
  }[];
}

const SidebarItem = ({
  icon: Icon,
  label,
  active,
  collapsed,
  href,
  onClick,
  subItems,
}: SidebarItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const hasSubItems = subItems && subItems.length > 0;
  const pathname = usePathname();

  useEffect(() => {
    if (hasSubItems && subItems?.some((item) => item.href === pathname)) {
      setExpanded(true);
    }
  }, [pathname, hasSubItems, subItems]);

  const toggleExpand = (e: React.MouseEvent) => {
    if (hasSubItems) {
      e.preventDefault();
      setExpanded(!expanded);
    }
  };

  const isActive =
    active ||
    pathname === href ||
    (hasSubItems && subItems?.some((item) => item.href === pathname));

  if (collapsed) {
    return (
      <div className="relative">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                {href && !hasSubItems ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "w-full h-10 p-0 my-1 hover:bg-primary dark:hover:bg-[#ff7200] hover:text-white",
                      isActive && "bg-primary hover:bg-primary dark:bg-[#ff7200] hover:text-white text-white"
                    )}
                    asChild
                  >
                    <Link href={href}>
                      <Icon className="h-5 w-5" />
                      <span className="sr-only">{label}</span>
                    </Link>
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "w-full h-10 p-0 my-1 hover:bg-primary dark:hover:bg-[#ff7200] hover:text-white",
                      isActive && "bg-primary hover:bg-primary dark:bg-[#ff7200] hover:text-white text-red-500"
                    )}
                    onClick={hasSubItems ? toggleExpand : onClick}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{label}</span>
                  </Button>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-1">
              {label}
              {hasSubItems && (
                <span className="ml-1">
                  {expanded ? "(expanded)" : "(collapsed)"}
                </span>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Sub-items in collapsed mode */}
        {hasSubItems && expanded && (
          <div className="absolute left-full top-0 ml-2 w-48 rounded-md bg-slate-800 py-1 shadow-lg">
            {subItems.map((item, index) => {
              const SubIcon = item.icon;
              const isSubItemActive = item.active || pathname === item.href;

              return (
                <Button
                  key={index}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-primary hover:text-white",
                    isSubItemActive && "bg-primary text-white"
                  )}
                  asChild
                >
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 w-full"
                    >
                      <SubIcon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ) : (
                    <button className="flex items-center gap-3 w-full">
                      <SubIcon className="h-4 w-4" />
                      {item.label}
                    </button>
                  )}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {href && !hasSubItems ? (
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-primary  dark:hover:bg-[#ff7200] hover:text-white",
            isActive && "bg-primary dark:bg-orange-500 dark:hover:bg-[#ff7200] text-white"
          )}
          asChild
        >
          <Link href={href} className="flex items-center gap-3 w-full">
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        </Button>
      ) : (
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 px-3 py-2 group text-sm font-medium text-slate-300 hover:bg-primary dark:hover:bg-[#ff7200] hover:text-white",
            isActive && "border-b border-primary dark:border-[#ff7200] text-white"
          )}
          onClick={hasSubItems ? toggleExpand : onClick}
        >
          <Icon className="h-5 w-5" />
          <span>{label}</span>
          {hasSubItems && (
            <span className={cn("ml-auto", isActive ?" text-primary group-hover:text-white":" text-white")}>
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </span>
          )}
        </Button>
      )}

      {/* Sub-items 6 -2 */}
      {hasSubItems && expanded && (
        <div className="ml-0 mt-1 border border-slate-700 rounded-md space-y-1">
          {subItems.map((item, index) => {
            const SubIcon = item.icon;
            const isSubItemActive = item.active || pathname === item.href;

            return (
              <Button
                key={index}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-primary dark:hover:bg-[#ff7200] hover:text-white",
                  isSubItemActive && "bg-primary dark:bg-[#ff7200] text-white"
                )}
                asChild
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 w-full"
                  >
                    <SubIcon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ) : (
                  <button className="flex items-center gap-3 w-full">
                    <SubIcon className="h-4 w-4" />
                    {item.label}
                  </button>
                )}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
