import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface RetroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "neutral";
  className?: string;
}

const variantStyles = {
  primary: {
    bg: "bg-[#f4d03f]",
    hover: "hover:bg-[#f7d94c]",
    border: "border-black",
    shadow: "#000",
  },
  secondary: {
    bg: "bg-[#52b788]",
    hover: "hover:bg-[#6bc99a]",
    border: "border-black",
    shadow: "#000",
  },
  danger: {
    bg: "bg-[#d62828]",
    hover: "hover:bg-[#e63946]",
    border: "border-black",
    shadow: "#000",
  },
  neutral: {
    bg: "bg-white",
    hover: "hover:bg-gray-100",
    border: "border-black",
    shadow: "#000",
  },
};

export const RetroButton = ({
  children,
  variant = "primary",
  className,
  disabled,
  ...props
}: RetroButtonProps) => {
  const styles = variantStyles[variant];

  return (
    <button
      className={cn(
        "border-2 font-semibold px-6 py-3 text-sm uppercase tracking-wider",
        "transition-all duration-150",
        "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        styles.bg,
        styles.border,
        !disabled && styles.hover,
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      style={{
        boxShadow: disabled ? "none" : `2px 2px 0px 0px ${styles.shadow}`,
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

