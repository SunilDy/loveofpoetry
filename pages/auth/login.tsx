import { signIn } from "next-auth/react";
import { SecondaryButton } from "@/components/Buttons";
import { Montserrat } from "@next/font/google";
import Image from "next/image";
import GithubIcon from "@/public/icons/github.svg";
import GoogleIcon from "@/public/icons/google.svg";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { Oval } from "react-loader-spinner";
import { useEffect } from "react";

const montserrat = Montserrat({ subsets: ["latin"] });

const Login = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.user) router.push("/");
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Oval
          height={80}
          width={80}
          color="#fff"
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="tr"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    );
  }

  return (
    <div
      className={`${montserrat.className} min-h-screen w-full my-20 flex justify-center text-white`}
    >
      {/* Container */}
      <div
        className={`
        accent-modal-bg accent-border
        rounded-xl shadow-xl h-fit
        xsm:p-6 md:p-12 lg:p-16
      `}
      >
        {/* Header */}
        <h1
          className={`${montserrat.className} font-bold 
            xsm:text-xl md:text-2xl lg:text-3xl 
            mb-10 text-center
          `}
        >
          Poetry<span className="text-pink-300">.</span>
        </h1>
        <h1
          className={`
        xsm:text-lg md:text-xl lg:text-2xl font-semibold
        mb-4 text-center
      `}
        >
          Sign In To PoetryDot
        </h1>
        {/* Buttons */}
        <div className="w-full flex flex-col gap-y-2">
          <SecondaryButton
            buttonClassNames="p-2 w-full flex gap-x-2 justify-center"
            handleOnClick={() => signIn("github")}
          >
            <Image
              className="xsm:w-6 md:w-6 object-cover rounded-full h-fit"
              src={GithubIcon}
              alt={"google login"}
              width={20}
              height={20}
            />
            <p>Sign in with Github</p>
          </SecondaryButton>
          <SecondaryButton
            buttonClassNames="p-2 w-full flex gap-x-2 justify-center"
            handleOnClick={() => signIn("google")}
          >
            <Image
              className="xsm:w-6 md:w-6 object-cover rounded-full h-fit"
              src={GoogleIcon}
              alt={"google login"}
              width={20}
              height={20}
            />
            <p>Sign in with Goolgle</p>
          </SecondaryButton>
        </div>
        {/* Buttons */}
      </div>
      {/* Container */}
    </div>
  );
};

export default Login;
