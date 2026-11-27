import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-[#D7C7B4] bg-[#E9DCCB] text-[#2B1D14]",
        accent: "border-[#A8643A]/30 bg-[#A8643A]/12 text-[#8E512D]",
        success: "border-[#2F6B48]/25 bg-[#2F6B48]/10 text-[#2F6B48]",
        warning: "border-[#9A631A]/25 bg-[#9A631A]/10 text-[#9A631A]",
        danger: "border-[#9E3B33]/25 bg-[#9E3B33]/10 text-[#9E3B33]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
