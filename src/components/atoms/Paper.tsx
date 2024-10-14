import classNames from "classnames";
import React, { ForwardedRef, forwardRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  clickable?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const Paper = (
  { children, className, clickable, ...rest }: Props,
  ref: ForwardedRef<HTMLDivElement>
) => {
  const divClasses = classNames(
    "bg-white hover:shadow-custom-shadow border border-slate-200 rounded-main overflow-hidden",
    {
      "cursor-pointer": clickable,
    },
    className
  );
  return (
    <div ref={ref} {...rest} className={divClasses}>
      {children}
    </div>
  );
};

export default forwardRef(Paper);
