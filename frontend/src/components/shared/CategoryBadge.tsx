// =============================================================================
// CATEGORY BADGE — consistent styling for project categories across all pages
// =============================================================================
import { cn } from "@/lib/utils";
import type { ProjectCategory } from "@/types";

interface Props {
  category: ProjectCategory;
  size?: "sm" | "md";
  className?: string;
}

const CATEGORY_STYLES: Record<ProjectCategory, { label: string; classes: string }> = {
  frontend: {
    label:   "Frontend",
    classes: "bg-cyan-500/10 text-cyan-600 border-cyan-200 hover:bg-cyan-500/20",
  },
  backend: {
    label:   "Backend",
    classes: "bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20",
  },
  full_stack: {
    label:   "Full Stack",
    classes: "bg-blue-500/10 text-blue-600 border-blue-200 hover:bg-blue-500/20",
  },
  data_engineering: {
    label:   "Data Engineering",
    classes: "bg-purple-500/10 text-purple-600 border-purple-200 hover:bg-purple-500/20",
  },
};

export default function CategoryBadge({ category, size = "sm", className }: Props) {
  const config = CATEGORY_STYLES[category] ?? {
    label:   category,
    classes: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded-full border transition-colors duration-150",
        size === "sm"  && "px-2.5 py-0.5 text-xs",
        size === "md"  && "px-3 py-1 text-sm",
        config.classes,
        className
      )}
    >
      {config.label}
    </span>
  );
}