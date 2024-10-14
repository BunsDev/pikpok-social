import { H3, Paragraph } from "@components/atoms/typography";

type Props = {
  header: string;
  body: string;
};

const HeaderLabel = ({ header, body }: Props) => {
  return (
    <div>
      <H3>{header}</H3>
      <Paragraph className="text-slate-400">{body}</Paragraph>
    </div>
  );
};

export default HeaderLabel;
