import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variants = {
  primary: [
    "bg-gradient-to-r from-blue-600 to-blue-500 text-white",
    "hover:from-blue-700 hover:to-blue-600",
    "shadow-sm shadow-blue-500/25 hover:shadow-md hover:shadow-blue-500/30",
    "focus-visible:ring-blue-500",
  ].join(" "),
  secondary: [
    "bg-gray-100 text-gray-900 hover:bg-gray-200",
    "focus-visible:ring-gray-400",
  ].join(" "),
  ghost: [
    "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    "focus-visible:ring-gray-400",
  ].join(" "),
  danger: [
    "bg-gradient-to-r from-red-600 to-red-500 text-white",
    "hover:from-red-700 hover:to-red-600",
    "shadow-sm shadow-red-500/25",
    "focus-visible:ring-red-500",
  ].join(" "),
  outline: [
    "border border-gray-300 text-gray-700 bg-white",
    "hover:bg-gray-50 hover:border-gray-400",
    "focus-visible:ring-gray-400",
  ].join(" "),
};

const sizes = {
  sm: "px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5",
  md: "px-4 py-2 text-sm font-semibold rounded-lg gap-2",
  lg: "px-6 py-3 text-sm font-semibold rounded-xl gap-2",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          "active:scale-[0.98]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;