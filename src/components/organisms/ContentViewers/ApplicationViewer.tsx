import { H1, H3, Phrase } from "@components/atoms/typography";
import { Paragraph } from "@components/atoms/typography/Paragraph";
import useAuth from "@hooks/useAuth";
import useUnlockContent from "@hooks/useUnlockContent";
import CoinIcon from "@icons/CoinIcon";
import LikedIcon from "@icons/LikedIcon";
import ViewIcon from "@icons/ViewIcon";
import { PostContentType } from "@src/types";
import { useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import { useCallback, useState } from "react";
import LockSvg from "@src/svgs/LockSvg";
import Download from "@src/svgs/Download";
import useNav from "@hooks/useNav";

type Props = {
  info: PostContentType;
};

const ApplicationViewer = ({ info }: Props) => {
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
  } = info;

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

  const unlockContent = useCallback(() => {
    if (!userData) {
      setShowLogin(true);
      return;
    }

    setUnlocking(true);
    unlockContentAndUpdateObject(cost, cid, "applications")
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
  }, [cost, cid, handleUserDataChange, setShowLogin, userData, unlockContentAndUpdateObject]);

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const backdropClasses = classNames(
    "bg-custom-gradient z-10 w-full h-full absolute pointer-events-none",
    {
      "backdrop-filter backdrop-blur-lg": isLocked,
    }
  );

  return (
    <div
      className="h-[calc(100vh-100px)] m-8 overflow-hidden transition-all duration-300 relative w-[60%] mx-auto rounded-md"
      style={{
        scrollSnapStop: "always",
        scrollSnapAlign: "start center",
        scrollMarginTop: "16px",
      }}
    >
      <div className={backdropClasses} />

      <div className="absolute w-full h-full flex flex-col justify-end z-20 px-8 py-4">
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
        {!isLocked && (
          <div className="flex items-center justify-center w-full flex-1">
            <div
              tabIndex={0}
              role="button"
              onClick={() => {
                handleDownload(signedUrl, "application");
              }}
              className="flex flex-col flex-start rounded-full items-center justify-center h-36 w-36 bg-primary-color cursor-pointer gap-y-1 border border-[#5A67C8] hover:shadow-lock-shadow"
            >
              <Download />
            </div>
          </div>
        )}
        <div className="text-white flex justify-between gap-y-6 flex-col">
          <div className="flex flex-col gap-y-2">
            <H1>{title}</H1>
            <Paragraph>
              {description.length > 500
                ? description.substring(0, 500) + "..."
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
    </div>
  );
};

export default ApplicationViewer;
