import { useSession, signOut } from "next-auth/react";
import { Oval } from "react-loader-spinner";
import Image from "next/image";
import { Montserrat } from "@next/font/google";
import axios from "axios";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Link from "next/link";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { PrimaryButton } from "@/components/Buttons";
import UserDetails from "@/components/User/UserDetails";

const montserrat = Montserrat({ subsets: ["latin"] });

const getLikedPoems = async () => {
  return await axios.get(`/api/poem/like`, {
    withCredentials: true,
  });
};

const getUserCollections = async () => {
  return await axios.get(`/api/collection/get`, {
    withCredentials: true,
  });
};

const getUserStudies = async () => {
  return await axios.get(`/api/study/get`, {
    withCredentials: true,
  });
};

const getAdditionalUserInfo = async () => {
  return await axios.get(`/api/user/get`, { withCredentials: true });
};

const User = () => {
  //  States
  const [userCollectionsState, setUserCollectionsState] = useState(null);
  const [userStudiesState, setUserStudiesState] = useState(null);
  const [userStudiesLength, setUserStudiesLength] = useState(null);
  const [isUpdatingCollection, setIsUpdatingCollection] = useState(false);
  const [additionalUserDetailsState, setAdditionalUserDetailsState] = useState<
    any | null
  >(null);

  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/login");
    },
  });

  // console.log(session?.user);

  const {
    data: likedPoems,
    isLoading: loadingPoems,
    isFetching: fetchingPoems,
    refetch: refetchLikedPoems,
  } = useQuery("user-likedPoems", getLikedPoems, {
    refetchOnWindowFocus: false,
  });

  const {
    data: userCollectionsRes,
    isLoading: loadingCollections,
    isFetching: fetchingCollections,
    refetch: refetchCollections,
  } = useQuery("user-collections", getUserCollections, {
    refetchOnWindowFocus: false,
  });

  const {
    data: userStudiesRes,
    isLoading: loadingStudies,
    isFetching: fetchingStudies,
    refetch: refetchStudies,
  } = useQuery("user-studies", getUserStudies, {
    refetchOnWindowFocus: false,
  });

  const { data: additionalUserInfoRes } = useQuery(
    `additional-user-info`,
    getAdditionalUserInfo,
    {
      refetchOnWindowFocus: false,
    }
  );

  // For Side Effects
  useEffect(() => {
    if (userCollectionsRes?.data) {
      setUserCollectionsState(userCollectionsRes?.data.collections);
    }

    if (userStudiesRes?.data) {
      setUserStudiesState(userStudiesRes.data.studies);
      setUserStudiesLength(userStudiesRes.data.studiesLength);
    }
    if (additionalUserInfoRes?.data) {
      setAdditionalUserDetailsState(additionalUserInfoRes?.data.user);
    }
    console.log("additionalUserInfoRes", additionalUserInfoRes?.data);
  }, [likedPoems, userCollectionsRes, userStudiesRes, additionalUserInfoRes]);

  // For States
  useEffect(() => {}, [
    userCollectionsState,
    userStudiesState,
    userStudiesLength,
  ]);

  useEffect(() => {}, []);

  const handleDeleteLikedPoem = async (title: string) => {
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
        refetchLikedPoems();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteTitleFromCollection = (
    collection: string,
    title: string
  ) => {
    setIsUpdatingCollection(true);
    axios
      .patch(
        `/api/collection/update`,
        {
          collection,
          title,
        },
        {
          withCredentials: true,
        }
      )
      .then(async (res) => {
        if (res.data.status === "ok") {
          await refetchCollections();
          setIsUpdatingCollection(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteCollection = (collectionName: string) => {
    setIsUpdatingCollection(true);
    axios
      .post(
        `/api/collection/update`,
        {
          collectionName,
        },
        {
          withCredentials: true,
        }
      )
      .then(async (res) => {
        if (res.data.status === "ok") {
          await refetchCollections();
          setIsUpdatingCollection(false);
        }
      })
      .catch((err) => console.log(err));
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
    <div className="min-h-screen flex flex-col justify-between items-center xsm:w-[90%] lg:w-[80%] mx-auto">
      <div className="w-full mx-auto">
        {/* User Details */}
        <UserDetails
          profileImage={session?.user?.image}
          username={session?.user?.name}
          email={session?.user?.email}
          bio={additionalUserDetailsState?.bio}
          personalSite={additionalUserDetailsState?.personalSite}
        />
        {/* User Details */}

        {/* Tabs */}
        <div className={`mx-auto`}>
          <Tabs className={`box-border`}>
            <TabList
              className={`flex justify-center xsm:gap-x-2 lg:gap-x-10
              text-white font-bold ${montserrat.className} xsm:text-sm lg:text-lg
              xsm:my-4 lg:my-6
              `}
            >
              <Tab className={`xsm:px-2 lg:px-4 cursor-pointer`}>Posts</Tab>
              <Tab className={`xsm:px-2 lg:px-4 cursor-pointer`}>
                Liked Poems
              </Tab>
              <Tab className={`xsm:px-2 lg:px-4 cursor-pointer`}>
                Collections
              </Tab>
            </TabList>

            {/* Posts */}
            <TabPanel className={`${montserrat.className} my-6 text-white`}>
              <h1>Posts</h1>
            </TabPanel>
            {/* Posts */}
            {/* Liked Poems */}
            {likedPoems?.data && likedPoems.data.likedPoems.length > 0 ? (
              <TabPanel className={`xsm:m-2 lg:m-6 p-4`}>
                {likedPoems?.data.likedPoems &&
                !loadingPoems &&
                !fetchingPoems ? (
                  likedPoems?.data.likedPoems.map((poem: any, i: number) => (
                    <div
                      key={i}
                      className={`flex justify-between items-center border-b-2 border-white border-opacity-20 gap-x-2 mb-2 pb-2`}
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
                  <div className="flex justify-center items-center mt-10">
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
                )}
              </TabPanel>
            ) : (
              <TabPanel
                className={`${montserrat.className} flex justify-center my-6 text-white`}
              >
                <p>No liked poems!</p>
              </TabPanel>
            )}
            {/* Liked Poems */}
            {/* Collections */}

            <TabPanel
              className={`xsm:m-2 lg:m-6 border-white box-border md:grid grid-cols-new4 gap-x-6`}
            >
              {userCollectionsState && !isUpdatingCollection ? (
                userCollectionsState &&
                // @ts-ignore
                userCollectionsState?.map((collection: any, i: number) => (
                  <div
                    key={i}
                    className={`bg-rose-100 border-2 border-slate-100 border-opacity-40 bg-opacity-20 rounded-xl shadow-2xl my-6 text-white p-4 ${montserrat.className}`}
                  >
                    {/* Header */}
                    <div className="flex justify-between border-b-2 border-white border-opacity-40 pb-1 mb-2">
                      <h1 className="font-bold">{collection.name}</h1>
                      <button
                        onClick={() => handleDeleteCollection(collection.name)}
                      >
                        <XCircleIcon
                          className={`xsm:w-4 xsm:h-4 md:w-5 md:h-5 text-white`}
                        />
                      </button>
                    </div>
                    {/* Titles */}
                    <div>
                      {collection.titles.length > 0 ? (
                        collection.titles.map((poem: any, i: number) => (
                          <div key={i} className="flex justify-between my-2">
                            <div className="flex gap-x-2 items-center">
                              <Link
                                href={`/authors/${poem.author}/${poem.title}`}
                              >
                                <p
                                  className={`text-white font-bold xsm:text-sm lg:text-md ${montserrat.className}`}
                                >
                                  {poem.title}
                                </p>
                              </Link>
                              <Link href={`/authors/${poem.author}`}>
                                <span
                                  className={`italic text-slate-200 font-light xsm:text-sm lg:text-md`}
                                >
                                  by {poem.author}
                                </span>
                              </Link>
                            </div>
                            <button
                              onClick={() =>
                                handleDeleteTitleFromCollection(
                                  collection.name,
                                  poem.title
                                )
                              }
                            >
                              <XCircleIcon
                                className={`xsm:w-4 xsm:h-4 md:w-5 md:h-5 text-white`}
                              />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p>No item</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center py-20">
                  <Oval
                    height={60}
                    width={60}
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
            {/* Collections */}
          </Tabs>
        </div>
        {/* Tabs */}
      </div>
      {/* User Actions */}
      <div className="my-4 w-full text-white">
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
