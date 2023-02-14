import { useState } from "react";
import { Pacifico } from "@next/font/google";

// const lobster = Lobster({ subsets: ["latin"], weight: ["400"] });
const lobster = Pacifico({ subsets: ["latin"], weight: ["400"] });

const Navbar = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <nav
      className={`flex py-8 px-32 justify-between text-white backdrop-blur-3xl z-50 sticky top-0 shadow-md`}
    >
      {/* Primary Links */}
      <div className={`flex gap-x-8 text-xl basis-1/4`}>
        <h1 className={`${lobster.className} font-bold text-2xl`}>
          Love of Poetry
        </h1>
        <h1>Authors</h1>
      </div>
      {/* Search Bar */}
      <div className="basis-2/4 flex justify-center">
        <input
          placeholder="Search Poetry"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={`bg-inherit text-white placeholder:text-white border-b-2 border-white grow focus:outline-none text-xl  w-[80%] font-semibold`}
        />
      </div>
      {/* User */}
      <div className={`basis-1/4 justify-self-start`}>
        <h1 className={`text-xl basis-1/4 text-right`}>Login</h1>
      </div>
    </nav>
  );
};

export default Navbar;
