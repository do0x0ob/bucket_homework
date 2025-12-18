import { cn } from "@/lib/utils";

interface RetroDividerProps {
  className?: string;
  label?: string;
}

export const RetroDivider = ({ className, label }: RetroDividerProps) => {
  return (
    <div className={cn("flex items-center gap-4 my-6", className)}>
      <div className="flex-1 border-t-2 border-black"></div>
      {label && (
        <span className="text-xs font-semibold uppercase tracking-wider text-black px-2">
          {label}
        </span>
      )}
      <div className="flex-1 border-t-2 border-black"></div>
    </div>
  );
};

