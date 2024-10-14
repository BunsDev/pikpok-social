import React from "react";

type Props = {
  htmlFor: string;
  children: React.ReactNode;
};

const Label = ({ htmlFor, children }: Props) => {
  return (
    <label className=" text-subtle text-slate-700" htmlFor={htmlFor}>
      {children}
    </label>
  );
};

export default Label;
