import {
  getUserAuthInfo,
  getUserCollectionInfo,
  signOutUser,
} from "@src/services/authFirebase";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

type UserData = {
  uid: string;
  points: number;
  displayName: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  handleAuthentication: () => void;
  userData: UserData | null;
  handleUserDataChange: (newUserData: UserData) => void;
  handleSignout: () => void;
  error: string;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleUserDataChange = (newUserData: UserData) => {
    setUserData(newUserData);
  };

  const handleAuthentication = useCallback(async () => {
    getUserAuthInfo().then((user) => {
      if (user) {
        getUserCollectionInfo(user.uid)
          .then((userData) => {
            setUserData({
              uid: user.uid,
              points: userData?.points || 1000,
              displayName: userData?.name || "No Name",
            });
            setIsAuthenticated(true);
          })
          .catch((error) => {
            setError("User not found");
            console.error("Error:", error);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setError("User not found");
      }
    })
    .catch((error) => {
      setError("User not found");
      console.error("Error:", error);
    })
    .finally(() => {
      setLoading(false);
    });

  }, []);

  const handleSignout = useCallback(async () => {
    signOutUser()
      .then(() => {
        navigate("/home");
        setIsAuthenticated(false);
        console.log("sign out success");
      })
      .catch((error) => {
        setError("Error signing out");
        console.log("sign out error", error);
      });
  }, [navigate]);

  useEffect(() => {
    async function checkUser() {
      await handleAuthentication();
    }
    if (!isAuthenticated) {
      checkUser();
    }
  }, [handleAuthentication, isAuthenticated]);

  const value: AuthContextType = useMemo(
    () => ({
      isAuthenticated: isAuthenticated,
      handleAuthentication: handleAuthentication,
      userData: userData,
      handleSignout: handleSignout,
      handleUserDataChange: handleUserDataChange,
      error: error,
      loading: loading,
    }),
    [
      isAuthenticated,
      handleAuthentication,
      userData,
      handleSignout,
      error,
      loading,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
