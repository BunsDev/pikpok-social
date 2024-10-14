type Props = {
  children: React.ReactNode;
  className?: string;
};

export const Phrase = ({ children }: Props) => {

  return <p className="text-phrase text-slate-400">{children}</p>;
};
