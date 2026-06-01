import { cn } from "@/lib/utils";

export default function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin",
        className
      )}
    />
  );
}

export function PageSpinner() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Spinner />
    </div>
  );
}