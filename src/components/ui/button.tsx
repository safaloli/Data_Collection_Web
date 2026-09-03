import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";
import MaterialIcon from "../../assets/icons/MaterialIcon";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none cursor-pointer focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/80",

        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground",

        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",

        ghost:
          "hover:bg-muted hover:text-foreground",

        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20",

        link:
          "text-primary underline-offset-4 hover:underline",
      },

      size: {
        default: "h-8 px-2.5",

        xs:
          "h-6 rounded-md px-2 text-xs",

        sm:
          "h-7 rounded-md px-2.5 text-[0.8rem]",

        lg:
          "h-9 px-2.5",

        icon:
          "size-8",

        "icon-xs":
          "size-6",

        "icon-sm":
          "size-7",

        "icon-lg":
          "size-9",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    isSubmitting?: boolean;
    width?: "full" | "fit" | "auto";
    icon?: React.ReactNode;
  };

function Button({
  className,
  variant = "default",
  size = "default",
  width,
  isSubmitting = false,
  icon,
  disabled,
  children,
  type = "button",
  ...props
}: ButtonProps) {

  const widthClass =
    width === "full"
      ? "w-full"
      : width === "fit"
        ? "w-fit"
        : width === "auto"
          ? "w-auto"
          : "";

  return (
    <button
      type={type}
      disabled={isSubmitting || disabled}
      className={cn(
        buttonVariants({
          variant,
          size,
        }),
        widthClass,
        className
      )}
      {...props}
    >
      {children}

      {isSubmitting ? (
        <MaterialIcon
          icon="progress_activity"
          className="animate-spin"
        />
      ) : (
        icon
      )}
    </button>
  );
}

export { Button, buttonVariants };