import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Montserrat } from "@next/font/google";
// import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
// import "@szhsin/react-menu/dist/index.css";
// import "@szhsin/react-menu/dist/transitions/slide.css";
import { useRouter } from "next/router";
import Image from "next/image";

import {
  SparklesIcon,
  UserGroupIcon,
  BookmarkIcon,
  FolderIcon,
} from "@heroicons/react/24/solid";

const montserrat = Montserrat({ subsets: ["latin"] });

const Navbar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isShowingMenu, setIsShowingMenu] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (router.pathname.includes("/search")) {
      setSearchValue("");
    }
    console.log({ isShowingMenu });
  }, [router, isShowingMenu]);

  const handleSearchKeyDown = (e: any) => {
    if (e.key === "Enter") router.push(`/search?name=${searchValue}`);
  };

  return (
    <nav
      className={`
      flex items-center gap-x-2
      xsm:py-2 md:py-2 lg:py-4 
      xsm:px-2 md:px-16 lg:px-20 xl:px-32 
      justify-between text-primary backdrop-blur-3xl z-50 sticky top-0 border-b-2 border-primary border-opacity-10
      `}
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
            Poetry<span className="text-secondary">.</span>
          </h1>
        </Link>
        <Link href={"/authors"} className="xsm:hidden lg:visible lg:w-fit">
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
      <div className="basis-2/4 flex justify-center">
        <input
          placeholder="Search for Poetry, Posts, Users..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={`
            accent-input
            xsm:text-sm md:text-lg lg:text-xl w-full
            font-semibold mx-auto
           `}
          // onFocus={() => router.push("/search")}
          onKeyDown={(e) => handleSearchKeyDown(e)}
          type="search"
        />
      </div>
      {/* User */}
      <div
        className={`flex items-center justify-end flex-shrink-0 w-fit basis-1/4`}
      >
        <div className="flex justify-end">
          {session &&
          session.user &&
          session.user.image &&
          session.user.name ? (
            // <Link
            //   href={"/auth/user"}
            //   onMouseEnter={() => setIsShowingMenu(true)}
            //   // onMouseLeave={() => setIsShowingMenu(false)}
            // >
            <Image
              className={`xsm:w-10 lg:w-14 aspect-square object-cover object-center rounded-full mr-4 accent-border`}
              src={session.user.image}
              alt={session.user.name}
              height={300}
              width={300}
              onMouseEnter={() => setIsShowingMenu(true)}
              onClick={() => setIsShowingMenu(true)}
            />
          ) : (
            // </Link>
            <Link
              href={"/auth/login"}
              onMouseEnter={() => setIsShowingMenu(true)}
              // onMouseLeave={() => setIsShowingMenu(false)}
            >
              <h1
                className={`xsm:text-md md:text-lg lg:text-xl text-right ${montserrat.className}`}
              >
                Sign In
              </h1>
            </Link>
          )}
        </div>
        {/* Menu Modal */}
        {isShowingMenu && (
          <div
            className={`fixed inset-0 z-50 flex flex-col justify-center items-center xsm:px-6 lg:px-20
          bg-black bg-opacity-20 backdrop-blur-2xl
            ${montserrat.className}
            xsm:h-[100vh] h-[100dvh]
            `}
            onClick={() => setIsShowingMenu(false)}
          >
            {/* Menu */}
            <div
              className={`
                bg-secondary text-primary
                fixed h-full right-0
                flex flex-col justify-between
                xsm:p-6 md:p-10
                `}
              onMouseLeave={() => setIsShowingMenu(false)}
            >
              {/* Profile */}
              <div
                className={`
                accent-modal-bg accent-border rounded-xl
                xsm:p-2 lg:p-4
              `}
              >
                {session &&
                  session.user &&
                  session.user.image &&
                  session.user.name && (
                    <Link
                      href={"/auth/user"}
                      onMouseEnter={() => setIsShowingMenu(true)}
                      // onMouseLeave={() => setIsShowingMenu(false)}
                      className={`flex items-center gap-x-2`}
                    >
                      <Image
                        className={`xsm:w-10 lg:w-14 aspect-square object-cover object-center rounded-full accent-border
                        `}
                        src={session.user.image}
                        alt={session.user.name}
                        height={300}
                        width={300}
                      />
                      <div>
                        <p className="accent-link">{session.user.name}</p>
                        <p className="accent-link">{session.user.email}</p>
                      </div>
                    </Link>
                  )}
              </div>
              {/* Profile */}
              {/* Menu Links */}
              <div className="flex flex-col gap-y-2">
                <Link
                  className={`flex gap-x-2 items-center 
                    accent-link p-2 
                    hover:accent-modal-bg accent-rounded transition
                  `}
                  href={`/posts`}
                >
                  <SparklesIcon className="w-5 h-5" />
                  Posts
                </Link>
                <Link
                  className={`flex gap-x-2 items-center 
                    accent-link p-2 
                    hover:accent-modal-bg accent-rounded transition
                  `}
                  href={`/authors`}
                >
                  <UserGroupIcon className="w-5 h-5" />
                  Authors
                </Link>
                <button
                  className={`flex gap-x-2 items-center 
                    accent-link p-2 
                    hover:accent-modal-bg accent-rounded transition
                  `}
                  onClick={() =>
                    router.push({
                      pathname: `/auth/user`,
                      query: { isCollectionsTabActive: 1 },
                    })
                  }
                  // href={`/auth/user`}
                >
                  <BookmarkIcon className="w-5 h-5" />
                  Your Collections
                </button>
                <Link
                  className={`flex gap-x-2 items-center 
                    accent-link p-2 
                    hover:accent-modal-bg accent-rounded transition
                  `}
                  href={`/auth/user/studies`}
                >
                  <FolderIcon className="w-5 h-5" />
                  Your Studies
                </Link>
              </div>
              {/* Menu Links */}
              {/* More Link */}
              <div className="flex justify-between">
                <p className="font-semibold xsm:text-xs md:text-base">
                  Request a Poem Title
                </p>
                <p className="font-semibold xsm:text-xs md:text-base">About</p>
              </div>
              {/* More Link */}
            </div>
            {/* Menu*/}
          </div>
        )}
        {/* Menu Modal */}
        {/* Menu */}
        {/* <div className="xsm:visible xsm:w-full lg:collapse lg:w-0 flex-1 text-right">
          <Menu
            align="end"
            offsetY={10}
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
              backgroundColor: "white",
              color: "hotpink",
              fontWeight: "bold",
            }}
          >
            <MenuItem>
              <Link href={"/authors"}>Authors</Link>
            </MenuItem>
            <MenuItem>
              <Link href={`/search?name=${searchValue}`}>Search</Link>
            </MenuItem>
            <MenuItem>
              {session ? (
                <Link href={"/auth/user"}>User Profile</Link>
              ) : (
                <Link href={"/auth/login"}>Login</Link>
              )}
            </MenuItem>
          </Menu>
        </div> */}
      </div>
    </nav>
  );
};

export default Navbar;
