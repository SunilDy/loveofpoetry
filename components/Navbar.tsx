import { useState } from "react";
import { Pacifico } from "@next/font/google";
import Link from "next/link";
import { useSession } from "next-auth/react";

// const lobster = Lobster({ subsets: ["latin"], weight: ["400"] });
const lobster = Pacifico({ subsets: ["latin"], weight: ["400"] });

const Navbar = () => {
  const [searchValue, setSearchValue] = useState("");
  const { data: session } = useSession();
  // console.log(session);

  return (
    <nav
      className={`
      flex items-center gap-x-2
      xsm:py-4 lg:py-8 
      xsm:px-6 md:px-16 lg:px-20 xl:px-32 
      justify-between text-white backdrop-blur-3xl z-50 sticky top-0 shadow-md`}
    >
      {/* Primary Links */}
      <div
        className={`flex items-center
        xsm:gap-x-2 md:gap-x-0 lg:gap-x-2 
        xsm:text-md md:text-lg lg:text-xl 
        basis-1/4`}
      >
        <Link href={"/"}>
          <h1
            className={`${lobster.className} font-bold 
            xsm:text-md md:text-lg lg:text-xl 
          `}
          >
            Love of Poetry
          </h1>
        </Link>
        <Link href={"/authors"}>
          <h1
            className={` 
            xsm:text-md md:text-lg lg:text-xl 
         `}
          >
            Authors
          </h1>
        </Link>
      </div>
      {/* Search Bar */}
      <div className="justify-center">
        <input
          placeholder="Search Poetry"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={`
          bg-inherit text-white placeholder:text-white 
          border-b-2 border-white border-opacity-40
          grow focus:outline-none 
          xsm:text-sm md:text-lg lg:text-xl mx-auto
           font-semibold`}
        />
      </div>
      {/* User */}
      <div className={`basis-1/4 justify-self-start`}>
        <Link href={"/login"}>
          {session && session.user ? (
            <h1
              className={`xsm:text-md md:text-lg lg:text-xl  basis-1/4 text-right`}
            >
              Hi, {session?.user.name}
            </h1>
          ) : (
            <h1
              className={`xsm:text-md md:text-lg lg:text-xl  basis-1/4 text-right`}
            >
              Login
            </h1>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
