type Props = {
  children: React.ReactNode;
  bold?: boolean;
  className?: string;
};

export const Paragraph = ({ children }: Props) => {
  return <p className=" text-slate-300 text-paragraph font-norma">{children}</p>;
};
