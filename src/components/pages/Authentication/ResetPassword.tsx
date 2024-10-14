import Input from "@components/atoms/Input";
import Label from "@components/atoms/Label";
import {H3, Paragraph } from "@components/atoms/typography";
import HeaderLabel from "@components/molecules/HeaderLabel";
import {
  resetPasswordConfirmation,
  verifyCode,
} from "@src/services/authFirebase";
import ForgotPasswordSvg from "@src/svgs/ForgotPasswordSvg";
import LoadingSvg from "@src/svgs/LoadingSvg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const oobCode = urlParams.get("oobCode");
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(true);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [passwordResetState, setPasswordResetState] = useState({
    loading: false,
    content: "",
  });

  useEffect(() => {
    if (oobCode) {
      verifyCode(oobCode)
        .then((res) => {
          console.log("res client", res);
          if (res.status === "success") {
            setIsCodeValid(true);
          } else {
            alert(res.message);
            console.log("Code invalid");
            setIsCodeValid(false);
            // navigate("/forgot-password");
          }
        })
        .catch((error) => {
          console.log("error client", error);
          setIsCodeValid(false);
        })
        .finally(() => {
          setVerifyingCode(false);
        });
    }
  }, [navigate, oobCode]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password) {
      alert("Password is required");
      return;
    }
    setPasswordResetState({
      loading: true,
      content: "Updating...",
    });
    try {
      if (oobCode && isCodeValid && !verifyingCode && password) {
        await resetPasswordConfirmation(oobCode, password);
        setPasswordResetState({
          loading: false,
          content: "Success! Redirecting to Login...",
        });
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
      console.log("Password reset success");
    } catch (error) {
      console.log("Error client", error);
    } finally {
      setPasswordResetState({
        loading: false,
        content: "",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <div className="p-9 flex flex-col gap-y-8 pb-16">
          <div className="flex flex-col gap-y-8 items-start">
            <HeaderLabel
              header="Password Reset"
              body="Enter your code and new password."
            />
          </div>
          <div className="w-72 h-48">
            <ForgotPasswordSvg />
          </div>
        </div>
        <div>
          <Paragraph>Code</Paragraph>
          <H3>
            {verifyingCode && "Verifying code..."}
            {!verifyingCode && isCodeValid && oobCode}
            {!verifyingCode && !isCodeValid && "Code invalid!"}
          </H3>
        </div>
        <form
          action=""
          className="flex flex-col gap-y-6"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="new-password"
              placeholder="Type your new password here..."
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} label={""}            />
          </div>
          <button type="submit" onClick={() => {}}>
            {passwordResetState.loading && (
              <>
                <div className="w-5 h-5 flex flex-col gap-x-2">
                  <LoadingSvg />
                </div>
                <span className="mx-2">{passwordResetState.content}</span>
              </>
            )}
            {!passwordResetState.loading && "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
