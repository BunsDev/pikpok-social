import React from "react";
import classNames from "classnames";

type Variant =
  | "button"
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "ghost"
  | "link";
type Size = "sm" | "md" | "lg";

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  variant = "button",
  size = "md",
  disabled = false,
  children,
  onClick,
  ...rest
}: ButtonProps) => {
  const buttonClasses = classNames(
    "inline-flex items-center justify-center rounded transition-all duration-200", // Base classes
    {
      // Variant styles based on your image
      "bg-gray-800 text-white hover:bg-gray-900": variant === "button", // Default button
      "bg-gray-400 text-white hover:bg-gray-700": variant === "neutral", // Neutral button
      "bg-blue-500 text-white hover:bg-blue-600": variant === "primary", // Primary button
      "bg-pink-500 text-white hover:bg-pink-600": variant === "secondary", // Secondary button
      "bg-teal-500 text-white hover:bg-teal-600": variant === "accent", // Accent button
      "bg-transparent text-white hover:bg-gray-600": variant === "ghost", // Ghost button
      "text-blue-500 underline hover:text-blue-600": variant === "link", // Link styled button

      // Size styles
      "px-2 py-1 text-sm": size === "sm",
      "px-4 py-2 text-base": size === "md",
      "px-6 py-3 text-lg": size === "lg",

      // Disabled state
      "opacity-50 cursor-not-allowed": disabled,
    }
  );

  return (
    <button
      {...rest}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
