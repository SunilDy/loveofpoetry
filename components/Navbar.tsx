import { useState } from "react";
import { Pacifico } from "@next/font/google";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Montserrat } from "@next/font/google";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

// const lobster = Lobster({ subsets: ["latin"], weight: ["400"] });
const lobster = Pacifico({ subsets: ["latin"], weight: ["400"] });
const montserrat = Montserrat({ subsets: ["latin"] });

const Navbar = () => {
  const [searchValue, setSearchValue] = useState("");
  const { data: session } = useSession();
  // console.log(session);

  const menuClassName = () =>
    `box-border z-50 text-sm bg-white p-1.5 border rounded-md shadow-lg select-none focus:outline-none min-w-[9rem]`;

  return (
    <nav
      className={`
      flex items-center lg:gap-x-2
      xsm:py-0 lg:py-4 
      xsm:px-6 md:px-16 lg:px-20 xl:px-32 
      justify-between text-white backdrop-blur-3xl z-50 sticky top-0 border-b-2 border-white border-opacity-10`}
    >
      {/* Primary Links */}
      <div
        className={`flex items-center
        xsm:gap-x-2 md:gap-x-4 lg:gap-x-6 
        xsm:text-md md:text-lg lg:text-xl
        basis-1/4`}
      >
        <Link href={"/"}>
          <h1
            className={`${montserrat.className} font-bold 
            xsm:text-md md:text-lg lg:text-xl 
          `}
          >
            Poetry<span className="text-pink-300">.</span>
          </h1>
        </Link>
        <Link href={"/authors"} className="xsm:collapse lg:visible">
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
      <div className="justify-center flex-grow-0">
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
      <div className={`basis-1/4 justify-self-end flex items-center`}>
        <div className="xsm:collapse xsm:w-0 lg:visible lg:w-full">
          {session && session.user ? (
            <Link href={"/"}>
              <h1 className={`xsm:text-md md:text-lg lg:text-xl text-right`}>
                Hi, {session?.user.name}
              </h1>
            </Link>
          ) : (
            <Link href={"/login"}>
              <h1 className={`xsm:text-md md:text-lg lg:text-xl text-right`}>
                Login
              </h1>
            </Link>
          )}
        </div>
        {/* Menu */}
        <div className="xsm:visible xsm:w-full lg:collapse lg:w-0 flex-1 text-right">
          <Menu
            menuButton={
              <MenuButton className="bg-white rounded px-2 m-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="hotpink"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 9a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 9zm0 6.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>
              </MenuButton>
            }
            transition
            menuStyle={{
              backgroundColor: "#ffffff97",
              color: "white",
            }}
          >
            <MenuItem>Authors</MenuItem>
            <MenuItem>Search</MenuItem>
            <MenuItem>User Profile</MenuItem>
          </Menu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
