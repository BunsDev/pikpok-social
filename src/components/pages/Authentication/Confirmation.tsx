import { H3, Paragraph } from "@components/atoms/typography";
import useAuth from "@hooks/useAuth";
import { verifyEmail } from "@src/services/authFirebase";
import EmailSentSvg from "@src/svgs/EmailSentSvg";
import { SuccessResponse, ErrorResponse } from "@src/types";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Confirmation = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleVerifyEmail = useCallback(async () => {
    verifyEmail()
      .then((response: SuccessResponse | ErrorResponse) => {
        if (response.status === "success") {
          console.log("email verification success");
          navigate("/");
        } else {
          console.log("email verification error", response.message);
        }
      })
      .catch((error) => {
        console.log("email verification error", error);
      });
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      handleVerifyEmail();
    }
  }, [handleVerifyEmail, isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <div id="image-cover"></div>
        <div className="p-9 flex flex-col gap-y-12 pb-16">
          <div className="flex flex-col">
            <H3>Confirm Your Email!</H3>
            <Paragraph className="text-slate-400">
              We have sent you an email. Click{" "}
              <span
                onClick={() => verifyEmail()}
                className="text-red-500 hover:underline underline-offset-2 cursor-pointer"
              >
                here
              </span>{" "}
              to resend email.
            </Paragraph>
          </div>
          <div className="flex items-center flex-col gap-y-4">
            <div className="w-72 h-72">
              <EmailSentSvg />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
