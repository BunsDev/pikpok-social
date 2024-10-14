type Props = {
  children: React.ReactNode;
  className?: string;
};

export const H1 = ({ children }: Props) => {
  return <h1 className="text-slate-200 font-semibold text-h1">{children}</h1>;
};
