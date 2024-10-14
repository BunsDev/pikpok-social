import React, { createContext, useCallback, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

type NavType = {
  name: string;
  path: string;
};

type NavContextType = {
  activeNav: string;
  navLists: NavType[];
  showLogin: boolean;
  setShowLogin: (show: boolean) => void;
  onNavChange: (tab: string) => void;
};

export const NavContext = createContext<NavContextType | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export default function NavProvider({ children }: Props) {
  const location = useLocation();
  const pathname = useMemo(
    () => location.pathname.replace("/", ""),
    [location.pathname]
  );
  const [activeNav, setActiveNav] = useState(pathname);
  const navLists = useMemo(() => {
    return [
      { name: "clips", path: "/clips" },
      { name: "images", path: "/images" },
      { name: "applications", path: "/applications" },
      { name: "audios", path: "/audios" },
    ];
  }, []);
  const [showLogin, setShowLogin] = useState(false);

  const onNavChange = useCallback((tab: string) => {
    setActiveNav(tab);
  }, []);

  const value: NavContextType = useMemo(
    () => ({
      activeNav: activeNav,
      navLists: navLists,
      onNavChange: onNavChange,
      showLogin: showLogin,
      setShowLogin: setShowLogin,
    }),
    [activeNav, navLists, onNavChange, showLogin]
  );

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}
