type VideoProgressBarProps = {
  progress: number;
};

const VideoProgressBar = ({ progress }: VideoProgressBarProps) => {

  const progressPercentage = `${progress}%`;
  return (
    <div
      style={{
        width: progressPercentage,
        height: "2px",
      }}
      className="bg-white opacity-80 transition-all duration-200 absolute bottom-0 z-40"
    />
  );
};

export default VideoProgressBar;
