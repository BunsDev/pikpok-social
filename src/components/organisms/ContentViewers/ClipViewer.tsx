//Parameters: title, description, image, likes, coins earned, views, posterName.
import React, { Suspense, useCallback, useRef, useState } from "react";
import { H1, H3, Phrase } from "@components/atoms/typography";
import { Paragraph } from "@components/atoms/typography/Paragraph";
import useAuth from "@hooks/useAuth";
import useUnlockContent from "@hooks/useUnlockContent";
import { PostContentType } from "@src/types";
import { useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import VideoProgressBar from "../VideoProgressBar";
import BigPlaySvg from "@src/svgs/BigPlaySvg";
import BigPauseSvg from "@src/svgs/BigPauseSvg";
import anime from "animejs";
import VolumeController from "../VolumeController";
import LikedIcon from "@icons/LikedIcon";
import CoinIcon from "@icons/CoinIcon";
import ViewIcon from "@icons/ViewIcon";
import { usePlayableMedia } from "@hooks/usePlayableMedia";
import { OnProgressProps } from "react-player/base";
import LockSvg from "@src/svgs/LockSvg";
import useNav from "@hooks/useNav";
const ReactPlayer = React.lazy(() => import("react-player"));

type Props = {
  clipInfo: PostContentType;
  volume: number;
  setVolume: (volume: number) => void;
};

const ClipViewer = ({ clipInfo, volume, setVolume }: Props) => {
  const {
    title,
    description,
    cid,
    signedUrl,
    likes,
    coinsEarned,
    views,
    posterName,
    isPublic,
  } = clipInfo;

  const cost = 100;
  const [isLocked, setIsLocked] = useState(!isPublic);
  const [unlocking, setUnlocking] = useState(false);
  const queryClient = useQueryClient();
  const { handleUserDataChange, userData } = useAuth();
  const { setShowLogin } = useNav();
  const { unlockContentAndUpdateObject } = useUnlockContent(
    {
      uid: userData?.uid || "",
      points: userData?.points || 0,
    },
    queryClient
  );
  const backdropClasses = classNames(
    "bg-custom-gradient z-10 w-full h-full absolute select-none pointer-events-none",
    {
      "backdrop-filter backdrop-blur-lg": isLocked,
    }
  );
  const [progressBar, setProgressBar] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<HTMLButtonElement>(null);
  const [inPlayer, setInPlayer] = useState(false);
  const { setCurrentPauseFunction } = usePlayableMedia();

  const unlockContent = useCallback(() => {
    if (!userData) {
      setShowLogin(true);
      return;
    }

    setUnlocking(true);
    unlockContentAndUpdateObject(cost, cid, "videos")
      .then(() => {
        // Update the user data in the context after unlocking the content.
        handleUserDataChange({
          ...userData,
          points: userData.points - cost,
        });
        setIsLocked(false);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setUnlocking(false);
      });
  }, [userData, unlockContentAndUpdateObject, cid, setShowLogin, handleUserDataChange]);

  const handleClick = useCallback(() => {
    if (isLocked) {
      return;
    }

    const playerElement = playerRef.current;
    setCurrentPauseFunction(() => () => {
      setIsPlaying(false);
    });

    setIsPlaying((prevIsPlaying) => !prevIsPlaying);

    anime({
      targets: playerElement,
      begin: () => {
        if (playerElement) {
          playerElement.style.visibility = "visible"; // Show the element before the animation starts
        }
      },
      duration: 300,
      opacity: [1, 0], // from full opacity to 0
      easing: "easeOutQuad",
      complete: () => {
        if (playerElement) {
          playerElement.style.visibility = "hidden"; // Hide the element after the animation completes
        }
      },
    });
  }, [isLocked, setCurrentPauseFunction]);

  const handleInPlayer = () => {
    if (isLocked) {
      return;
    }
    setInPlayer(!inPlayer);
  };

  const informationClasses = classNames(
    "text-white justify-between gap-y-6 flex-col",
    {
      hidden: isPlaying && !inPlayer,
      flex: (isPlaying && inPlayer) || !isPlaying,
    }
  );

  return (
    <div
      className="h-[calc(100vh-100px)] m-8 overflow-hidden transition-all duration-300 relative w-[60%] mx-auto rounded-md"
      onMouseEnter={handleInPlayer}
      onMouseLeave={handleInPlayer}
      style={{
        scrollSnapStop: "always",
        scrollSnapAlign: "start center",
        scrollMarginTop: "16px",
      }}
    >
      <div className={backdropClasses} />
      <Suspense fallback={<div />}>
        <ReactPlayer
          volume={volume}
          className="absolute top-0 left-0"
          url={signedUrl} // Replace with your video URL
          width="100%"
          height="100%"
          onProgress={(progress: OnProgressProps) => {
            setProgressBar(Math.round(progress.played * 100));
          }}
          playing={isPlaying}
        />
      </Suspense>
      {!isLocked && (
        <button
          ref={playerRef}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
        >
          {isPlaying ? <BigPauseSvg /> : <BigPlaySvg />}
        </button>
      )}

      {(inPlayer || !isPlaying) && (
        <div className="absolute top-4 right-4 p-2 bg-gray-800 text-white rounded-full z-40">
          <VolumeController volume={volume} onVolumeChange={setVolume} />
        </div>
      )}

      <div
        className="absolute w-full h-full flex flex-col justify-end z-20 px-8 py-4 cursor-pointer"
        onClick={handleClick}
      >
        {isLocked && (
          <div className="flex items-center justify-center w-full flex-1">
            <div
              tabIndex={0}
              role="button"
              onClick={unlockContent}
              className="flex flex-col flex-start rounded-full items-center justify-center h-36 w-36 bg-primary-color cursor-pointer gap-y-1 border border-[#5A67C8] hover:shadow-lock-shadow"
            >
              <LockSvg />
              <H3>{unlocking ? "Opening..." : "100"}</H3>
            </div>
          </div>
        )}
        <div className={informationClasses}>
          <div className="flex flex-col gap-y-2">
            <H1>{title}</H1>
            <Paragraph>
              {description.length > 100
                ? description.substring(0, 100) + "..."
                : description}
            </Paragraph>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-x-6">
              <Phrase>
                <span className="mr-2 float-left">
                  <LikedIcon />
                </span>
                {likes}
              </Phrase>
              <Phrase>
                <span className="mr-2 float-left">
                  <CoinIcon />
                </span>
                {coinsEarned}{" "}
              </Phrase>
              <Phrase>
                <span className="mr-2 float-left">
                  <ViewIcon />
                </span>
                {views}{" "}
              </Phrase>
            </div>
            <div>
              <Phrase>{posterName}</Phrase>
            </div>
          </div>
        </div>
      </div>

      <VideoProgressBar progress={progressBar} />
    </div>
  );
};

export default ClipViewer;
