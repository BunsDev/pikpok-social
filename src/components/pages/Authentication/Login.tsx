import BrandButton from "@components/atoms/BrandButton";
import Input from "@components/atoms/Input";
import { H1 } from "@components/atoms/typography";
import useAuth from "@hooks/useAuth";
import { signIn, signInWithGoogle } from "@src/services/authFirebase";
import LoadingSvg from "@src/svgs/LoadingSvg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  onSubmit: () => void;
  setLoginState: (value: string) => void;
  onLoginModalClose: () => void;
};

const Login = ({ onSubmit, onLoginModalClose, setLoginState }: Props) => {
  const navigate = useNavigate();
  const { handleAuthentication } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log("email", email, "password", password);
    signIn(email, password, true)
      .then((res) => {

        if (res.status === "success") {
          setTimeout(() => {
            console.log("logged in successfully");
            onSubmit();
            handleAuthentication();
            navigate("/home");
          }, 1000);
        } else {
          console.log("error suc ", res.message);
        }
      })
      .catch((error) => {
        console.log("error client", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGoogleSignIn = async () => {
    console.log("google sign in");
    signInWithGoogle()
      .then((res) => {
        console.log("res client", res);

        if (res.status === "success") {
          console.log("logged in successfully");
          onSubmit();
          handleAuthentication();
          // navigate("/");
        } else {
          console.log("error suc ", res.message);
        }
      })
      .catch((error) => {
        console.log("error client", error);
      });
  };

  return (
    <div className="bg-modal-background rounded-lg p-6 gap-y-8 flex flex-col items-end relative min-w-[32%]">
      <div className="flex w-full justify-between">
        <H1>Login</H1>
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
          <BrandButton variant="secondary" active onClick={handleGoogleSignIn}>
            <span className="ml-2">Continue with Google</span>
          </BrandButton>
          <div className="w-full h-px bg-slate-400 opacity-50" />
          <form
            className="flex flex-col gap-y-4 form-control"
            onSubmit={handleSubmit}
          >
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
            <Input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password *"
            />
            <p
              className=" underline underline-offset-2 text-slate-200 font-light text-sm text-right cursor-pointer"
              role="link"
              onClick={() => {
                setLoginState("ForgotPassword");
              }}
            >
              Forgot password?
            </p>
            <BrandButton active variant="primary" type="submit">
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 flex flex-col gap-x-2">
                    <LoadingSvg />
                  </div>
                  <span className="mx-2">Logging in...</span>
                </div>
              ) : (
                "Login"
              )}
            </BrandButton>
          </form>
          <p className="text-sm text-slate-400 flex gap-x-2">
            <span>Don't have an account?</span>
            <span
              onClick={() => {
                setLoginState("Signup");
              }}
              className=" underline underline-offset-2 text-slate-200 font-light cursor-pointer"
            >
              Create an account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
