import ErrorContent from "@components/molecules/ErrorContent";
import LoadingContent from "@components/molecules/LoadingContent";
import ImageViewer from "@components/organisms/ContentViewers/ImageViewer";
import useAuth from "@hooks/useAuth";
import { getContentsByType } from "@src/services/api/contentApi";
import { PostContentType } from "@src/types";
import { useQuery } from "@tanstack/react-query";

const Images = () => {

  const { userData } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["images"],
    queryFn: () => getContentsByType("image", userData?.uid),
    staleTime: Infinity,
  });


  if (isLoading) {
    return <LoadingContent />;
  }

  if (isError) {
    return <ErrorContent />;
  }
  
  const posts = data as PostContentType[];
  
  return (
    <div
      className="overflow-auto no-scrollbar h-[calc(100vh-72px)]"
      style={{
        scrollSnapType: "y mandatory",
      }}
    >
      {posts.map((post, index) => (
        <ImageViewer key={index} imageInfo={post} />
      ))}
    </div>
  );
};

export default Images;
