import ErrorContent from "@components/molecules/ErrorContent";
import LoadingContent from "@components/molecules/LoadingContent";
import AudioPlayer from "@components/organisms/ContentPlayers/AudioPlayer";
import useAuth from "@hooks/useAuth";
import { usePlayableMedia } from "@hooks/usePlayableMedia";
import useScroll from "@hooks/useScroll";
import { getContentsByType } from "@src/services/api/contentApi";
import { PostContentType } from "@src/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Audios = () => {
  const [volume, setVolume] = useState(0.5);
  const { pauseCurrentMedia } = usePlayableMedia();
  const { userData } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["audios"],
    queryFn: () => getContentsByType("audio", userData?.uid),
    staleTime: Infinity,
  });

  const audioLists = data as PostContentType[];
  const scrollRef = useScroll(pauseCurrentMedia);

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
      {audioLists.map((post, index) => (
        <AudioPlayer
          key={index}
          volume={volume}
          setVolume={setVolume}
          imageInfo={post as PostContentType}
        />
      ))}
    </div>
  );
};

export default Audios;
