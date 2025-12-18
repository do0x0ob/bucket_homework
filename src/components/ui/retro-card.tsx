import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface RetroCardProps {
  children: ReactNode;
  className?: string;
  shadowColor?: string;
}

export const RetroCard = ({
  children,
  className,
  shadowColor = "#000",
}: RetroCardProps) => {
  return (
    <div
      className={cn(
        "bg-[#f5f5f0] border-2 border-black p-6",
        "transition-all duration-200",
        className
      )}
      style={{
        boxShadow: `4px 4px 0px 0px ${shadowColor}`,
      }}
    >
      {children}
    </div>
  );
};

