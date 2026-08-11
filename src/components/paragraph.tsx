import { cn } from "@/lib/utils";

export default function Paragraph({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn("font-sans text-sm text-stone-700 md:text-base", className)}
    >
      {children}
    </p>
  );
}
