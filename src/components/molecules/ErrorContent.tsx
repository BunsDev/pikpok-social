import { Paragraph } from "@components/atoms/typography";
import ErrorSvg from "@src/svgs/ErrorSvg";

const ErrorContent = () => {
  return (
    <div className="h-[calc(100vh-72px)] w-full flex items-center justify-center flex-col gap-y-8">
      <ErrorSvg />
      <Paragraph>Something wrong happened. Reload should help.</Paragraph>
    </div>
  );
};

export default ErrorContent;
