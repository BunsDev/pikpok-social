import ErrorContent from "@components/molecules/ErrorContent";
import LoadingContent from "@components/molecules/LoadingContent";
import ClipViewer from "@components/organisms/ContentViewers/ClipViewer";
import useAuth from "@hooks/useAuth";
import { usePlayableMedia } from "@hooks/usePlayableMedia";
import useScroll from "@hooks/useScroll";
import { getContentsByType } from "@src/services/api/contentApi";
import { PostContentType } from "@src/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Clips = () => {
  const [volume, setVolume] = useState(0.5);
  const { pauseCurrentMedia } = usePlayableMedia();
  const scrollRef = useScroll(pauseCurrentMedia);
  const { userData } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["videos"],
    queryFn: () => getContentsByType("video", userData?.uid),
    staleTime: Infinity,
  });
  const posts = data as PostContentType[];

  if (isLoading) {
    return <LoadingContent />;
  }

  if (isError) {
    return <ErrorContent />;
  }

  return (
    <div
      ref={scrollRef}
      className="overflow-auto no-scrollbar h-[calc(100vh-72px)]"
      style={{
        scrollSnapType: "y mandatory",
      }}
    >
      {posts.map((post, index) => (
        <ClipViewer
          key={index}
          volume={volume}
          setVolume={setVolume}
          clipInfo={post as PostContentType}
        />
      ))}
    </div>
  );
};

export default Clips;
