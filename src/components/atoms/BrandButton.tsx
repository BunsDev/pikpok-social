import classNames from "classnames";

type Props = {
  children: React.ReactNode;
  variant: "primary" | "secondary" | "error"; // Add error variant
  active: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const BrandButton = ({ children, variant, active, ...rest }: Props) => {
  const buttonClasses = classNames("px-4 py-2 rounded-lg capitalize w-full", {
    // Primary button styles
    "hover:bg-primary-button-hover": !active && variant === "primary", 
    "bg-primary-button-selected font-medium text-white hover:bg-primary-button-active":
      active && variant === "primary",
    "active:bg-primary-button-active": !active && variant === "primary", 
    
    // Secondary button styles
    "hover:bg-secondary-button-hover": !active && variant === "secondary", 
    "bg-secondary-button-selected font-medium text-white hover:bg-secondary-button-hover":
      active && variant === "secondary",
    "active:bg-secondary-button-active": !active && variant === "secondary", 
    
    // Error button styles
    "hover:bg-error-button-hover": !active && variant === "error", // Apply hover style for error button
    "bg-error-button-selected font-medium text-white hover:bg-error-button-active":
      active && variant === "error",
    "active:bg-error-button-active": !active && variant === "error", // Prevent active style when button is already active
  });

  return (
    <button {...rest} className={buttonClasses}>
      {children}
    </button>
  );
};

export default BrandButton;
