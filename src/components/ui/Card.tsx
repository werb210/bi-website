import { ReactNode } from "react";

export default function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-brand-surface border border-card rounded-xl shadow-soft p-6 ${className}`}
    >
      {children}
    </div>
  );
}
