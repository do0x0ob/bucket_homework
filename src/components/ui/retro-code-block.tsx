import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface RetroCodeBlockProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export const RetroCodeBlock = ({
  children,
  className,
  title,
}: RetroCodeBlockProps) => {
  return (
    <div
      className={cn(
        "bg-black border-2 border-black p-4 font-mono text-sm",
        className
      )}
      style={{
        boxShadow: "inset 2px 2px 0px 0px #666",
      }}
    >
      {title && (
        <div className="text-[#52b788] uppercase text-xs mb-2 font-semibold">
          {title}
        </div>
      )}
      <pre className="text-[#f4d03f] whitespace-pre-wrap break-words">
        {children}
      </pre>
    </div>
  );
};

