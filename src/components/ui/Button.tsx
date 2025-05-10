import React from "react";
import { cn } from "../../lib/utils";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  disabled = false,
  icon,
  onClick,
  type = "button",
  className,
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary:
      "bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white border-0 shadow-lg shadow-violet-500/25",
    secondary:
      "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-lg shadow-emerald-500/25",
    outline:
      "border border-slate-200 dark:border-slate-800 bg-white/5 hover:bg-white/10 text-slate-900 dark:text-slate-100",
    ghost:
      "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100",
    danger:
      "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white border-0 shadow-lg shadow-red-500/25",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm h-8",
    md: "px-4 py-2 h-10",
    lg: "px-6 py-3 text-lg h-12",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        "rounded-xl font-medium transition-all duration-300 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500",
        "flex items-center justify-center gap-2",
        "hover:scale-[1.02]",
        disabled ? "opacity-50 cursor-not-allowed hover:scale-100" : "",
        fullWidth ? "w-full" : "",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  );
}
