import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-emerald-200 bg-emerald-50 text-emerald-800",
        secondary:
          "border-slate-200 bg-slate-50 text-slate-700",
        destructive:
          "border-rose-200 bg-rose-50 text-rose-700",
        outline:
          "text-slate-700 border-slate-200",
        accent:
          "border-amber-200 bg-amber-50 text-amber-900 font-semibold",
        success:
          "border-emerald-300 bg-emerald-600 text-white font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}
