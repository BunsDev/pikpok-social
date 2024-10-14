import { useEffect, useRef } from "react";

const useScroll = (onScrollCallback: () => void) => {
  const scrollableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollableElement = scrollableRef.current;

    if (scrollableElement) {
      scrollableElement.addEventListener("scrollsnapchange", onScrollCallback);
    }

    return () => {
      if (scrollableElement) {
        scrollableElement.removeEventListener("scrollsnapchange", onScrollCallback);
      }
    };
  }, [onScrollCallback]);

  return scrollableRef;
};

export default useScroll;
