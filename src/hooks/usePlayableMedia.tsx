import { useContext } from "react";
import { PlayableMediaContext } from "@contexts/PlayableMediaContext";

export const usePlayableMedia = () => {
  const context = useContext(PlayableMediaContext);
  if (!context) {
    throw new Error(
      "usePlayableMediaContext must be used within an AudioProvider"
    );
  }
  return context;
};
