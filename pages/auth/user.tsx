import { useSession, signOut } from "next-auth/react";
import { Oval } from "react-loader-spinner";
import Image from "next/image";
import { Montserrat } from "@next/font/google";
import axios from "axios";
import { useQuery } from "react-query";
import { useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Link from "next/link";
// import "react-tabs/style/react-tabs.css";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { PrimaryButton } from "@/components/Buttons";

const montserrat = Montserrat({ subsets: ["latin"] });

const getLikedPoems = async () => {
  return await axios.get(`/api/poem/like`, {
    withCredentials: true,
  });
};

const User = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/login");
    },
  });

  const {
    data: likedPoems,
    isLoading: loadingPoems,
    isFetching: fetchingPoems,
    refetch: refetchLikedPoems,
  } = useQuery("user-likedPoems", getLikedPoems, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    // console.log(likedPoems?.data.likedPoems);
  }, [likedPoems]);

  const handleDeleteLikedPoem = async (title: string) => {
    console.log(title);
    axios
      .patch(
        `/api/poem/like`,
        {
          title,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
        refetchLikedPoems();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Oval
          height={100}
          width={100}
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
    <div className="min-h-screen flex flex-col justify-between items-center">
      <div>
        {/* User Details */}
        <div
          className={`flex my-10 items-center
        xsm:px-6 md:px-10 lg:px-20
    `}
        >
          <div>
            <Image
              className="xsm:w-14 lg:w-20 aspect-square object-cover object-center rounded-full mr-4 self-start"
              // @ts-ignore
              src={session?.user?.image}
              // @ts-ignore
              alt={session?.user?.name}
              height={300}
              width={300}
            />
          </div>
          <div>
            <h1 className={`${montserrat.className} text-white text-md`}>
              {session?.user?.name}
            </h1>
            <h1 className={`${montserrat.className} text-white text-md`}>
              {session?.user?.email}
            </h1>
          </div>
        </div>
        {/* User Details */}

        {/* Tabs */}
        <div className={`flex justify-center`}>
          <Tabs
            className={`box-border
          xsm:w-[90%] lg:w-[80%]
        `}
          >
            <TabList
              className={`flex justify-center xsm:gap-x-2 lg:gap-x-10
              text-white font-bold ${montserrat.className} xsm:text-sm lg:text-lg
              xsm:my-4 lg:my-6
              `}
            >
              <Tab className={`xsm:px-2 lg:px-4 cursor-pointer`}>
                Liked Poems
              </Tab>
              <Tab className={`xsm:px-2 lg:px-4 cursor-pointer`}>
                Collections
              </Tab>
              <Tab className={`xsm:px-2 lg:px-4 cursor-pointer`}>Studies</Tab>
            </TabList>

            {likedPoems?.data && likedPoems.data.likedPoems.length > 0 ? (
              <TabPanel className={`xsm:m-2 lg:m-6`}>
                {likedPoems?.data.likedPoems ||
                !loadingPoems ||
                !fetchingPoems ? (
                  likedPoems?.data.likedPoems.map((poem: any, i: number) => (
                    <div
                      key={i}
                      className={`flex justify-between items-center border-b-2 border-white border-opacity-20 mb-2 gap-x-2`}
                    >
                      <Link href={`/authors/${poem.author}/${poem.title}`}>
                        <p
                          className={`text-white font-bold xsm:text-sm lg:text-lg ${montserrat.className}`}
                        >
                          {poem.title} by{" "}
                          <span className={`italic text-slate-200 font-light`}>
                            {poem.author}
                          </span>
                        </p>
                      </Link>
                      <button onClick={() => handleDeleteLikedPoem(poem.title)}>
                        <XCircleIcon
                          className={`xsm:w-4 xsm:h-4 md:w-5 md:h-5 text-white`}
                        />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center items-center">
                    <Oval
                      height={100}
                      width={100}
                      color="#fff"
                      visible={true}
                      ariaLabel="oval-loading"
                      secondaryColor="tr"
                      strokeWidth={2}
                      strokeWidthSecondary={2}
                    />
                  </div>
                )}
              </TabPanel>
            ) : (
              <TabPanel
                className={`${montserrat.className} flex justify-center my-6 text-white`}
              >
                <p>No liked poems!</p>
              </TabPanel>
            )}
            <TabPanel className={`xsm:m-2 lg:m-6 border-white box-border`}>
              <h2>Collections</h2>
            </TabPanel>
            <TabPanel className={`xsm:m-2 lg:m-6 border-white box-border`}>
              <h2>Studies</h2>
            </TabPanel>
          </Tabs>
        </div>
        {/* Tabs */}
      </div>
      {/* User Actions */}
      <div className="my-4 xsm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] text-white">
        <h1
          className={`${montserrat.className} xsm:text-md md:text-lg font-bold border-b-2 border-white border-opacity-40 mb-4`}
        >
          User Actions
        </h1>
        <PrimaryButton handleOnClick={() => signOut()}>Logout</PrimaryButton>
      </div>
    </div>
  );
};

export default User;
