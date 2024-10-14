type Props = {
  children: React.ReactNode;
};

export const H3 = ({ children }: Props) => {
  return <h3 className="text-slate-200 font-semibold text-h3">{children}</h3>;
};
