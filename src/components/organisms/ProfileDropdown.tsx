import BrandButton from "@components/atoms/BrandButton";
import useAuth from "@hooks/useAuth";
import useOutsideClick from "@hooks/useOutsideClick";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  onNavChange: (nav: string) => void;
};

const ProfileDropdown = ({ onNavChange }: Props) => {
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);
  const { handleSignout } = useAuth();
  const ref = useRef(null);


  useOutsideClick(ref, openProfile, () => {
    setOpenProfile(false);
  });

  return (
    <div className="relative">
      <button
        className="p-2 rounded-lg hover:bg-secondary-button-hover"
        onClick={() => {
          onNavChange("Profile");
          setOpenProfile(!openProfile);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={24}
          height={24}
          color={"#e2e8f0"}
          fill={"none"}
        >
          <path
            d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </button>
      {openProfile && (
        <div
          ref={ref}
          className="absolute top-11 right-0 rounded-lg bg-[#2F3139] w-40 p-2 gap-y-2 flex flex-col"
        >
          <button
            className="hover:bg-secondary-button-hover p-2 rounded-lg"
            onClick={() => {
              navigate("/profile");
              setOpenProfile(false);
            }}
          >
            Profile
          </button>
          <BrandButton
            variant="error"
            active
            onClick={() => {
              handleSignout();
              setOpenProfile(false);
            }}
          >
            Sign out
          </BrandButton>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
