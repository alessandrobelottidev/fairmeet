import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ButtonProps {
  title: string;
  href: string;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}

const Button = ({
  title,
  href,
  variant = "primary",
  className = "",
}: ButtonProps) => {
  const baseStyle =
    "inline-flex items-center gap-1 rounded-full pl-3 pr-1 h-8 text-sm w-max font-medium transition-colors";

  const variants = {
    primary: {
      container: "bg-green-500 text-white hover:bg-green-600",
      arrowBg: "bg-green-600",
    },
    secondary: {
      container: "bg-neutral-700 text-white hover:bg-neutral-800",
      arrowBg: "bg-neutral-800",
    },
    danger: {
      container: "bg-red-600 text-white hover:bg-red-700",
      arrowBg: "bg-red-700",
    },
  };

  return (
    <Link
      href={href}
      className={`${baseStyle} ${variants[variant].container} ${className}`}
    >
      {title}
      <div className={`${variants[variant].arrowBg} p-1 ml-1 rounded-full`}>
        <ArrowRight size={16} />
      </div>
    </Link>
  );
};

export default Button;
