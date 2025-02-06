import React from "react";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const baseStyles = "relative w-full rounded-lg border p-4";
    const variantStyles = {
      default: "bg-white border-gray-200",
      destructive: "bg-red-50 border-red-500 text-red-700",
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Alert.displayName = "Alert";

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`text-sm text-gray-600 ${className}`} {...props} />
));
AlertDescription.displayName = "AlertDescription";
