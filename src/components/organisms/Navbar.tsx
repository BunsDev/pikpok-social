import Modal from "@components/atoms/Modal";
import Tabs from "@components/atoms/Tabs";
import { H3 } from "@components/atoms/typography";
import { useState } from "react";
import useAuth from "@hooks/useAuth";
import Login from "@components/pages/Authentication/Login";
import useNav from "@hooks/useNav";
import BrandLogoSvg from "@src/svgs/BrandLogoSvg";
import BrandButton from "@components/atoms/BrandButton";
import CoinIcon from "@icons/CoinIcon";
import FileProvider from "@contexts/FileContext";
import FileInformation from "./Upload/FileInformation";
import FileUpload from "./Upload/FileUpload";
import Signup from "@components/pages/Authentication/Signup";
import ForgotPassword from "@components/pages/Authentication/ForgotPassword";
import ProfileDropdown from "./ProfileDropdown";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { isAuthenticated, userData } = useAuth();
  const { activeNav, onNavChange, navLists, showLogin, setShowLogin } =
    useNav();
  const [uploadModalState, setUploadModalState] = useState(false);
  const [loginState, setLoginState] = useState("Login");
  const navigate = useNavigate();

  const handleUploadModal = () => {
    setUploadModalState(!uploadModalState);
  };

  const handleCloseUploadModal = () => {
    setUploadModalState(false);
  };

  const handleLoginModal = () => {
    setShowLogin(!showLogin);
  };

  return (
    <>
      <Modal isOpen={uploadModalState}>
        <FileProvider>
          <FileInformation />
          <FileUpload onClose={handleCloseUploadModal} />
        </FileProvider>
      </Modal>
      <Modal isOpen={showLogin}>
        {loginState === "Login" && (
          <Login
            setLoginState={setLoginState}
            onLoginModalClose={handleLoginModal}
            onSubmit={handleLoginModal}
          />
        )}
        {loginState === "Signup" && (
          <Signup
            setLoginState={setLoginState}
            onLoginModalClose={handleLoginModal}
            onSubmit={handleLoginModal}
          />
        )}
        {loginState === "ForgotPassword" && (
          <ForgotPassword
            setLoginState={setLoginState}
            onLoginModalClose={handleLoginModal}
          />
        )}
      </Modal>
      <nav className="bg-blue-80 text-white flex px-6 py-4 items-center justify-between">
        <div
          className="cursor-pointer"
          tabIndex={0}
          role="button"
          onClick={() => {
            onNavChange("Home");
            navigate("/");
          }}
        >
          <BrandLogoSvg />
        </div>
        <Tabs tabs={navLists} activeTab={activeNav} onTabChange={onNavChange} />
        <div className="flex items-center gap-x-2">
          {!isAuthenticated && (
            <BrandButton active variant="primary" onClick={handleLoginModal}>
              Login
            </BrandButton>
          )}
          {isAuthenticated && (
            <div className="flex items-center gap-x-6">
              <BrandButton variant="primary" onClick={handleUploadModal} active>
                Upload
              </BrandButton>
              <div className="flex gap-x-6">
                <div className="flex items-center gap-x-2">
                  <CoinIcon />
                  <H3>{userData?.points}</H3>
                </div>
                <ProfileDropdown onNavChange={onNavChange} />
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
