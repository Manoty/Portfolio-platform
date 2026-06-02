import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

export default function Card({ children, className, hover, glass }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-gray-200/80 shadow-sm",
        hover && [
          "cursor-pointer",
          "hover:shadow-xl hover:shadow-gray-200/60",
          "hover:-translate-y-1 hover:border-gray-300/80",
          "transition-all duration-300 ease-out",
        ],
        glass && "bg-white/80 backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-6 py-4 border-b border-gray-100/80", className)}>
      {children}
    </div>
  );
}

export function CardBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("px-6 py-5", className)}>{children}</div>;
}