import BrandButton from "@components/atoms/BrandButton";
import Input from "@components/atoms/Input";
import { H1 } from "@components/atoms/typography";
import { forgotPassword } from "@src/services/authFirebase";
import LoadingSvg from "@src/svgs/LoadingSvg";
import { useState } from "react";

type Props = {
  setLoginState: (value: string) => void;
  onLoginModalClose: () => void;
};

const ForgotPassword = ({ onLoginModalClose, setLoginState }: Props) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      alert("Email is required");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      console.log("Password reset email sent");
    } catch (error) {
      console.log("error client", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-modal-background rounded-lg p-6 gap-y-8 flex flex-col items-end relative min-w-[32%]">
      <div className="flex w-full justify-between">
        <H1>Reset Password</H1>
        <button onClick={onLoginModalClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox=" 0 0 24 24"
            width={24}
            height={24}
            color={"#fff"}
            fill={"none"}
          >
            <path
              d="M19.0005 4.99988L5.00049 18.9999M5.00049 4.99988L19.0005 18.9999"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className="flex items-center justify-center w-full">
        <div className="flex flex-col gap-y-6 w-full">
          <form className="flex flex-col gap-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-y-4">
              <Input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email *"
              />
            </div>
            <BrandButton active variant="primary" type="submit">
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 flex flex-col gap-x-2">
                    <LoadingSvg />
                  </div>
                  <span className="mx-2">Sending...</span>
                </div>
              ) : (
                "Send Reset Link"
              )}
            </BrandButton>
          </form>
          <p className="text-sm text-slate-400 flex gap-x-2">
            <span
              onClick={() => {
                setLoginState("Login");
              }}
              className=" underline underline-offset-2 text-slate-200 font-light"
            >
              Back to login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
