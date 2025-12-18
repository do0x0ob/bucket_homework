import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface RetroInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const RetroInput = forwardRef<HTMLInputElement, RetroInputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold uppercase tracking-wider mb-2 text-black">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full border-2 border-black bg-white px-4 py-3",
            "font-mono text-sm",
            "focus:outline-none focus:ring-0",
            "transition-all duration-150",
            "placeholder:text-gray-400",
            error && "border-red-600",
            className
          )}
          style={{
            boxShadow: "inset 2px 2px 0px 0px #000",
          }}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs font-semibold text-red-600 uppercase">
            {error}
          </p>
        )}
      </div>
    );
  }
);

RetroInput.displayName = "RetroInput";

