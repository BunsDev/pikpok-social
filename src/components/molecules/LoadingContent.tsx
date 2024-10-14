import { Paragraph } from "@components/atoms/typography"
import BigLoading from "@src/svgs/BigLoading"

const LoadingContent = () => {
  return (
    <div className="h-[calc(100vh-72px)] w-full flex items-center justify-center flex-col gap-y-8">
    <BigLoading />
    <Paragraph>Loading Content...</Paragraph>
  </div>
  )
}

export default LoadingContent