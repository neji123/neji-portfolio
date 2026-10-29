import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps } from "react";

import { cn } from "@/lib/cn";

export const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap",
    "transition-[background-color,color,scale] duration-(--duration-quick) ease-smooth-out",
    "active:scale-96 motion-reduce:active:scale-100",
  ],
  {
    variants: {
      variant: {
        // The accent is reserved for the action that matters: contact and "view my work".
        primary: "bg-accent text-accent-ink hover:bg-ink hover:text-ground",
        secondary: "bg-surface text-ink hover:bg-surface-strong",
        ghost: "text-ink hover:bg-surface",
      },
      size: {
        // Optical balance: the side carrying an icon reads heavier, so it gets less padding.
        md: "min-h-11 px-5 type-small has-[>svg:first-child]:ps-4 has-[>svg:last-child]:pe-4",
        lg: "min-h-12 px-6 text-base has-[>svg:first-child]:ps-5 has-[>svg:last-child]:pe-5",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export type ButtonProps = ComponentProps<"button"> & ButtonVariantProps;

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

export type ButtonLinkProps = ComponentProps<"a"> & ButtonVariantProps;

/** Same look and contract as Button, for navigation and downloads. */
export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <a className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
