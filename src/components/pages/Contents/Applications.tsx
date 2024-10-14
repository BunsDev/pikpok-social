import ErrorContent from "@components/molecules/ErrorContent";
import LoadingContent from "@components/molecules/LoadingContent";
import ApplicationViewer from "@components/organisms/ContentViewers/ApplicationViewer";
import useAuth from "@hooks/useAuth";
import { getContentsByType } from "@src/services/api/contentApi";
import { PostContentType } from "@src/types";
import { useQuery } from "@tanstack/react-query";

const Applications = () => {
  const { userData } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["applications"],
    queryFn: () => getContentsByType("application", userData?.uid),
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
        <ApplicationViewer key={index} info={post} />
      ))}
    </div>
  );
};

export default Applications;
