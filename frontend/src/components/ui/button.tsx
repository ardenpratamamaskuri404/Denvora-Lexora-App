import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8643A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6EFE6] disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-[#A8643A] text-[#F6EFE6] hover:bg-[#8E512D] shadow-xs",
        secondary:
          "bg-[#E9DCCB] text-[#2B1D14] hover:bg-[#DFCEB9] border border-[#D7C7B4]",
        outline:
          "border border-[#A8643A] bg-[#FBF7F1] text-[#2B1D14] hover:bg-[#E9DCCB]",
        ghost: "text-[#2B1D14] hover:bg-[#E9DCCB]/70",
        destructive: "bg-[#9E3B33] text-[#F6EFE6] hover:bg-[#832F28]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-3.5 text-xs",
        lg: "h-11 px-7 text-base",
        pill: "h-11 px-7 rounded-full text-sm font-semibold",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { buttonVariants };
