import Image from "next/image";
import { Montserrat } from "@next/font/google";
import Link from "next/link";
import Modal from "../Modal";
import { SecondaryButton } from "../Buttons";

const montserrat = Montserrat({ subsets: ["latin"] });

type UserDetailsType = {
  username: string | null | undefined;
  profileImage: string | null | undefined;
  email: string | null | undefined;
  bio: string | null | undefined;
  personalSite: string | null | undefined;
  handleProfileEdit: () => void;
};

const UserDetails = ({
  username,
  profileImage,
  email,
  bio,
  personalSite,
  handleProfileEdit,
}: UserDetailsType) => {
  return (
    <div
      className={`md:flex my-10 items-center
            xsm:px-6 md:px-10 lg:px-20 accent-border p-10 bg-rose-100 bg-opacity-20 rounded-md
          `}
    >
      <div className="basis-1/5 flex flex-row items-center justify-center">
        {/* User name and Avatar =============*/}
        <div className="">
          {/* Image Transform */}
          <div className="grid grid-cols-1 grid-rows-1 place-items-center">
            <div className="z-30 col-span-full row-span-full xsm:ring-2 lg:ring-4 ring-rose-200 ring-opacity-40 rounded-full xsm:w-20 md:w-28 lg:w-32 h-full"></div>
            <Image
              className={`xsm:w-20 md:w-28 lg:w-32 aspect-square object-cover object-center rounded-full self-start z-40 col-span-full row-span-full 
            hover:translate-x-0 hover:translate-y-0 -translate-x-4 transition-transform
            `}
              // @ts-ignore
              src={profileImage}
              // @ts-ignore
              alt={username}
              height={300}
              width={300}
            />
          </div>
          {/* Image Transform */}
          <h1
            className={`${montserrat.className} text-white xsm:text-md md:text-lg font-semibold text-center mt-4`}
          >
            {username}
          </h1>
        </div>
        {/* User name and Avatar ============*/}
      </div>
      <div className="basis-4/5 md:mx-10">
        <h1
          className={`${montserrat.className} text-white xsm:text-sm md:text-lg accent-border-bottom py-2 my-2`}
        >
          <span className="font-semibold">Email:</span> {email}
        </h1>
        <h1
          className={`${montserrat.className} text-white xsm:text-sm md:text-lg py-2 my-2`}
        >
          <span className="font-semibold">Bio:</span> {bio}
        </h1>
        <Link
          href={`${personalSite}`}
          className={`${montserrat.className} text-white xsm:text-sm md:text-lg py-2 my-2`}
        >
          <span className="font-semibold">Personal Site:</span> {personalSite}
        </Link>
        <div className="my-4">
          <SecondaryButton handleOnClick={handleProfileEdit}>
            Edit Profile
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
