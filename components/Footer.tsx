import Link from "next/link";
import { Montserrat } from "@next/font/google";
const montserrat = Montserrat({ subsets: ["latin"] });

const Footer = () => {
  // console.log(session);

  return (
    <footer
      className={`
      flex items-center justify-between
      xsm:py-4 lg:py-8 
      xsm:px-6 md:px-16 lg:px-20 xl:px-32 
      text-white backdrop-blur-3xl z-50 shadow-md`}
    >
      <h1
        className={`${montserrat.className} font-bold 
            xsm:text-md md:text-lg lg:text-xl 
          `}
      >
        Poetry<span className="text-pink-300">.</span>
      </h1>
      <h1>All rights reserved.</h1>
    </footer>
  );
};

export default Footer;
