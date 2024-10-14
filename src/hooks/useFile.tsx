import { FileContext } from "@contexts/FileContext";
import { useContext } from "react";

export const useFile = () => {
  const context = useContext(FileContext);

  if (!context) {
    throw new Error("useMyContext must be used within a MyProvider");
  }

  return context;
};

export default useFile;
