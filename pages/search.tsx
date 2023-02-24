import { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import Link from "next/link";
import { Oval } from "react-loader-spinner";
import { PrimaryButton } from "@/components/Buttons";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PostTile from "@/components/Post/PostTile";
import Placeholder from "@/public/placeholder/ph2.png";
import { Montserrat } from "@next/font/google";
import Image from "next/image";

const montserrat = Montserrat({ subsets: ["latin"] });

const Search = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(router.query.name);
  const [searchState, setSearchState] = useState<any[] | null>(null);
  const [userTitlesState, setUserTitlesState] = useState<any[] | null>(null);
  const [usersState, setUsersState] = useState<any[] | null>(null);

  const getSearch = async () => {
    return await axios.post(`/api/search/get`, { searchValue });
  };

  const {
    data: searchData,
    isLoading: loadingSearch,
    isFetching: fetchingSearch,
    isRefetching: refetchingSearch,
    refetch,
  } = useQuery(`search-data-${searchValue}`, getSearch, {
    refetchOnWindowFocus: false,
    // // @ts-ignore
    // enabled: searchValue?.length > 0,
  });

  // Side effects
  useEffect(() => {
    if (searchData?.data) {
      if (searchData?.data?.titles) setSearchState(searchData.data.titles);
      if (searchData?.data?.userTitles)
        setUserTitlesState(searchData.data.userTitles);
      if (searchData?.data?.users) setUsersState(searchData.data.users);
    }
    // console.log(searchData?.data);
  }, [searchData]);

  // States
  useEffect(() => {
    console.log("titles", searchState);
    console.log("userTitlesState", userTitlesState);
    console.log("usersState", usersState);
  }, [searchValue, searchState, userTitlesState, usersState]);

  const handleSearchKeyDown = (e: any) => {
    if (e.key === "Enter") refetch();
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-center items-center w-full md:w-[60%] xsm:my-10 md:my-14 lg:my-20 mx-auto">
        <input
          placeholder="Search for poetry titles"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => handleSearchKeyDown(e)}
          className={`
              xsm:py-1 md:py-3 px-4
              border-4 border-white border-opacity-40 rounded-md outline-none
              lg:text-3xl md:text-xl xsm:text-lg
              bg-transparent
              text-white placeholder:text-white
              xsm:w-[80%] md:w-full
              ${montserrat.className}
            `}
        />
      </div>
      {/* Tabs */}
      <div className={`mx-auto`}>
        <Tabs className={`box-border min-h-screen`}>
          <TabList
            className={`flex justify-center xsm:gap-x-2 lg:gap-x-10
              text-white font-bold ${montserrat.className} xsm:text-sm lg:text-lg
              xsm:my-4 lg:my-6
              `}
          >
            <Tab className={`xsm:px-2 lg:px-4 cursor-pointer`}>Posts</Tab>
            <Tab className={`xsm:px-2 lg:px-4 cursor-pointer`}>Users</Tab>
            <Tab className={`xsm:px-2 lg:px-4 cursor-pointer`}>
              Classic Titles
            </Tab>
          </TabList>

          {/* Posts */}
          <TabPanel
            className={`${montserrat.className} my-6 text-white xsm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] mx-auto`}
          >
            {userTitlesState && userTitlesState.length > 0 ? (
              <div>
                <PostTile userPosts={userTitlesState} />
              </div>
            ) : (
              <div className="mx-10 mb-20 text-center">
                <p className="text-white mb-4">Nothing found!</p>
                <PrimaryButton
                  handleOnClick={() => router.back()}
                  classNames={`flex justify-center`}
                  buttonClassNames={`font-semibold`}
                >
                  Go Back
                </PrimaryButton>
              </div>
            )}
          </TabPanel>
          {/* Posts */}
          {/* Users */}
          <TabPanel>
            {usersState && usersState.length > 0 ? (
              usersState.map((user: any, i: number) => (
                <div
                  className={`flex gap-x-2 items-center accent-modal-bg accent-border rounded-xl shadow-xl my-4 p-4 text-white mx-auto
                  xsm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[50%]
                  `}
                  key={i}
                >
                  {/* Avatar */}
                  <div className="w-fit flex-shrink-0">
                    {user.image !== ("" || undefined) ? (
                      <Image
                        className="xsm:w-10 lg:w-16 aspect-square object-cover rounded-full xsm:mr-2 lg:mr-4 self-start"
                        src={user.image}
                        alt={user.name}
                        height={300}
                        width={300}
                      />
                    ) : (
                      <Image
                        className="xsm:w-10 lg:w-16 aspect-square object-cover rounded-full xsm:mr-2 lg:mr-4 self-start"
                        src={Placeholder}
                        alt={user.name}
                        height={300}
                        width={300}
                      />
                    )}
                  </div>
                  {/* Avatar */}
                  {/* Details */}
                  <div>
                    <Link href={`/profile/${user._id}`}>
                      <p className="xsm:text-sm md:text-lg font-semibold">
                        {user.name}
                      </p>
                    </Link>
                    <p className="xsm:text-xs md:text-md">{user.bio}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="mx-10 mb-20 text-center">
                <p className="text-white mb-4">Nothing found!</p>
                <PrimaryButton
                  handleOnClick={() => router.back()}
                  classNames={`flex justify-center`}
                  buttonClassNames={`font-semibold`}
                >
                  Go Back
                </PrimaryButton>
              </div>
            )}
          </TabPanel>
          {/* Users */}
          {/* Classic Titles */}

          <TabPanel
            className={`xsm:m-2 lg:m-6 box-border md:grid grid-cols-new4 gap-x-6`}
          >
            <div className="xsm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] mx-auto">
              {loadingSearch || fetchingSearch || refetchingSearch ? (
                <div className="flex justify-center my-20">
                  <Oval
                    height={60}
                    width={60}
                    color="#fff"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="tr"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                  />
                </div>
              ) : searchState && searchState?.length > 0 ? (
                <div className="text-white mx-10 mb-20">
                  {searchState.map((poem: any, i: number) => (
                    <Link
                      href={`/authors/${poem.author}/${poem.title}`}
                      key={i}
                    >
                      <p
                        className={`font-bold xsm:lg:text-md lg:text-lg border-b-2 border-white border-opacity-20 mb-2 ${montserrat.className}`}
                      >
                        {poem.title} by{" "}
                        <span className={`italic text-slate-200 font-light`}>
                          {poem.author}
                        </span>
                      </p>
                    </Link>
                  ))}
                  <PrimaryButton
                    handleOnClick={() => router.back()}
                    classNames={`flex justify-center mt-10`}
                  >
                    Go Back
                  </PrimaryButton>
                </div>
              ) : (
                <div className="mx-10 mb-20 text-center">
                  <p className="text-white mb-4">Nothing found!</p>
                  <PrimaryButton
                    handleOnClick={() => router.back()}
                    classNames={`flex justify-center`}
                    buttonClassNames={`font-semibold`}
                  >
                    Go Back
                  </PrimaryButton>
                </div>
              )}
            </div>
          </TabPanel>
          {/* Classic Titles */}
        </Tabs>
      </div>
      {/* Tabs */}
    </div>
  );
};

export default Search;
