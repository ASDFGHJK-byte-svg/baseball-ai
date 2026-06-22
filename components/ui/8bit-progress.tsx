import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  variant?: "default" | "retro";
  progressBg?: string;
}

export function Progress({
  value,
  variant = "default",
  progressBg = "bg-primary",
  className,
  ...props
}: ProgressProps) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-full bg-slate-800/60",
        variant === "retro" && "border border-slate-600",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-300",
          progressBg
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
