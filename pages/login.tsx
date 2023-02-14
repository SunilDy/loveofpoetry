import { signIn } from "next-auth/react";

const Login = () => {
  return (
    <div>
      <button
        className="bg-white text-black p-2"
        onClick={() => signIn("github")}
      >
        Login With Github
      </button>
    </div>
  );
};

export default Login;
