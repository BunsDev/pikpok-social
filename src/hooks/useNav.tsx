import { NavContext } from "@contexts/NavContext";
import { useContext } from "react";

export const useAuth = () => {
  const context = useContext(NavContext);

  if (!context) {
    throw new Error("useMyContext must be used within a MyProvider");
  }

  return context;
};

export default useAuth;
