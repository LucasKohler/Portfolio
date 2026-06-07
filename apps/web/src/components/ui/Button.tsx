import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-primary/70 bg-primary text-[#002e6a] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] hover:bg-primary/90",
  secondary:
    "border-border bg-surface text-foreground hover:border-[#444] hover:bg-[#101010]",
  ghost:
    "border-transparent bg-transparent text-muted hover:bg-[rgba(255,255,255,0.05)] hover:text-foreground",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-6 text-base",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md border font-medium transition-[color,background-color,border-color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.96] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45";

type SharedButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type LinkButtonProps = SharedButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & {
    href: string;
  };

type NativeButtonProps = SharedButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: never;
  };

export type ButtonProps = LinkButtonProps | NativeButtonProps;

function buttonClasses({
  className,
  size = "md",
  variant = "secondary",
}: Pick<SharedButtonProps, "className" | "size" | "variant">) {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
}

export function Button(props: ButtonProps) {
  if ("href" in props && props.href) {
    const {
      children,
      className,
      size = "md",
      variant = "secondary",
      ...rest
    } = props;
    const isExternal = /^https?:\/\//.test(rest.href);
    const linkClassName = buttonClasses({ className, size, variant });

    if (isExternal || rest.href.startsWith("mailto:")) {
      return (
        <a
          className={linkClassName}
          rel={isExternal ? "noreferrer" : undefined}
          target={isExternal ? "_blank" : undefined}
          {...rest}
        >
          {children}
        </a>
      );
    }

    return (
      <Link className={linkClassName} {...rest}>
        {children}
      </Link>
    );
  }

  const nativeProps = props as NativeButtonProps;
  const {
    children,
    className,
    size = "md",
    type = "button",
    variant = "secondary",
    ...rest
  } = nativeProps;

  return (
    <button
      className={buttonClasses({ className, size, variant })}
      {...rest}
      type={type}
    >
      {children}
    </button>
  );
}
