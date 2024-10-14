import React, { createContext, useCallback, useState } from "react";

// Define the shape of the context
type PlayableMediaContextType = {
  setCurrentPauseFunction: (pauseFn: () => void) => void;
  pauseCurrentMedia: () => void;
};

// Create the context
export const PlayableMediaContext = createContext<
  PlayableMediaContextType | undefined
>(undefined);

// Context provider
const PlayableMediaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pauseCurrentMediaFunction, setPauseCurrentMediaFunction] = useState<
    (() => void) | null
  >(null);

  const pauseCurrentMedia = useCallback(() => {

    if (pauseCurrentMediaFunction) {
      pauseCurrentMediaFunction(); 
    }
  }, [pauseCurrentMediaFunction]);

  return (
    <PlayableMediaContext.Provider
      value={{
        setCurrentPauseFunction: setPauseCurrentMediaFunction,
        pauseCurrentMedia,
      }}
    >
      {children}
    </PlayableMediaContext.Provider>
  );
};

export default PlayableMediaProvider;
