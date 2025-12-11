import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive/15 text-destructive",
        outline: 
          "border-border text-foreground bg-transparent",
        success:
          "border-transparent bg-success/15 text-success",
        warning:
          "border-transparent bg-accent/15 text-accent",
        artist:
          "border-transparent bg-role-artist/15 text-role-artist",
        manager:
          "border-transparent bg-role-manager/15 text-role-manager",
        venue:
          "border-transparent bg-role-venue/15 text-role-venue",
        promoter:
          "border-transparent bg-role-promoter/15 text-role-promoter",
        glass:
          "border-foreground/10 bg-foreground/5 text-foreground backdrop-blur-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
