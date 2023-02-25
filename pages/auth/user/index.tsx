import { useSession, signOut } from "next-auth/react";
import { Oval } from "react-loader-spinner";
import { Montserrat } from "@next/font/google";
import axios from "axios";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Link from "next/link";
import { XCircleIcon, InformationCircleIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import UserDetails from "@/components/User/UserDetails";
import Modal from "@/components/Modal";
import toast, { Toaster } from "react-hot-toast";
import NewPost from "@/components/Post/NewPost";
import PostTile from "@/components/Post/PostTile";
import IntermediatePost from "@/components/Post/IntermediatePost";
import Head from "next/head";

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

const getUserPosts = async () => {
  return await axios.get(`/api/posts/userposts`, { withCredentials: true });
};

type AdditionalUserDetailsStateType = {
  bio: string | null;
  likedPoems: any;
  personalSite: string | null;
  studies: any;
};

type ProfileUpdateStateType = {
  bio: string | null;
  personalSite: string | null;
};

const User = () => {
  //  States
  const [userCollectionsState, setUserCollectionsState] = useState(null);
  const [userStudiesState, setUserStudiesState] = useState(null);
  const [userStudiesLength, setUserStudiesLength] = useState(null);
  const [isUpdatingCollection, setIsUpdatingCollection] = useState(false);
  const [additionalUserDetailsState, setAdditionalUserDetailsState] =
    useState<AdditionalUserDetailsStateType | null>(null);
  const [isProfileSettingModalOpen, setIsProfileSettingModalOpen] =
    useState(false);
  const [profileUpdateState, setProfileUpdateState] =
    useState<ProfileUpdateStateType>({
      bio: "",
      personalSite: "",
    });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [userPosts, setUserPosts] = useState<any[] | null>(null);
  const [intermediatePostBodyState, setIntermediatePostBodyState] =
    useState("");

  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/login");
    },
  });

  console.log(router?.query?.isCollectionsTabActive);

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

  const { data: additionalUserInfoRes, refetch: refetchAdditionalUserInfo } =
    useQuery(`additional-user-info`, getAdditionalUserInfo, {
      refetchOnWindowFocus: false,
    });

  const { data: userPostsRes, isLoading: loadingUserPosts } = useQuery(
    "user-posts",
    getUserPosts,
    {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
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
      setProfileUpdateState({
        bio: additionalUserInfoRes?.data.user.bio,
        personalSite: additionalUserInfoRes?.data.user.personalSite,
      });
    }

    if (userPostsRes?.data) {
      setUserPosts(userPostsRes?.data.userPosts);
    }

    // console.log("userPostsRes", userPostsRes?.data);
  }, [
    likedPoems,
    userCollectionsRes,
    userStudiesRes,
    additionalUserInfoRes,
    userPostsRes,
  ]);

  // For States
  useEffect(() => {
    // console.log("intermediatePostBodyState x1", intermediatePostBodyState);
  }, [
    userCollectionsState,
    userStudiesState,
    userStudiesLength,
    userPosts,
    intermediatePostBodyState,
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

  const handleProfileEditButtonClick = () => {
    setIsProfileSettingModalOpen(!isProfileSettingModalOpen);
  };

  const handleCancelProfileUpdate = () => {
    if (additionalUserDetailsState !== null)
      setProfileUpdateState({
        bio: additionalUserDetailsState?.bio,
        personalSite: additionalUserDetailsState?.personalSite,
      });
    // console.log(additionalUserDetailsState);
    setIsProfileSettingModalOpen(!isProfileSettingModalOpen);
  };

  const handleProfileUpdate = () => {
    setIsUpdatingProfile(true);
    axios
      .post(
        `/api/user/update`,
        {
          bio: profileUpdateState.bio,
          personalSite: profileUpdateState.personalSite,
        },
        {
          withCredentials: true,
        }
      )
      .then(async (res) => {
        console.log(res.data);
        if (res.data.status === "ok") {
          await refetchAdditionalUserInfo();
          setIsUpdatingProfile(false);
          setIsProfileSettingModalOpen(false);
          toast.custom((t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } w-fit shadow-2xl rounded-lg pointer-events-auto flex items-center ring-1 ring-black ring-opacity-5 p-4 text-white
            backdrop-blur-3xl
            `}
            >
              <div className="">
                <h1
                  className={`${montserrat.className} xsm:text-xs md:text-sm lg:text-lg font-bold`}
                >
                  Profile Updated Successfully.
                </h1>
              </div>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="xsm:w-4 xsm:h-4 lg:w-6 lg:h-6 xsm:mx-1 lg:mx-2 cursor-pointer"
                  onClick={() => toast.dismiss(t.id)}
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          ));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (status === "loading" || loadingUserPosts) {
    return (
      <div className="min-h-screen flex justify-center items-center">
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
    );
  }

  return (
    <>
      <Head>
        <title>User Profile</title>
        <meta
          name="description"
          content="Discover, Browse or Study from our endless collection of classical poetry right from the period of Renaissance and of The Romantics from our site. We got you all covered."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#F472B6" />
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow" />
        {/* Gives a general age rating based on the document's content */}
        <meta name="rating" content="General" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col justify-between items-center xsm:w-[90%] lg:w-[80%] mx-auto">
        <div className="w-full mx-auto">
          {/* User Details */}
          <div>
            <UserDetails
              profileImage={session?.user?.image}
              username={session?.user?.name}
              email={session?.user?.email}
              bio={additionalUserDetailsState?.bio}
              personalSite={additionalUserDetailsState?.personalSite}
              handleProfileEdit={handleProfileEditButtonClick}
              showProfileEditButton={true}
            />
            {isProfileSettingModalOpen && (
              <Modal>
                <div
                  className={`accent-modal-bg accent-border accent-rounded p-6 text-primary 
                xsm:w-[100%] md:w-[60%]
                max-h-[90%] overflow-y-scroll accent-scrollbar
                `}
                >
                  {/* Header */}
                  <h1
                    className={`${montserrat.className} font-bold accent-border-bottom pb-2 mb-2`}
                  >
                    Edit Profile
                  </h1>
                  <div className={`flex justify-between gap-x-2 items-center`}>
                    <InformationCircleIcon
                      className={`w-5 h-5 text-primary flex-shrink-0`}
                    />
                    <p>
                      As of now we do not offer the option to change the Name
                      and Email of a user, as we currently using only
                      authrntication providers to authenticate our users.
                    </p>
                  </div>
                  {/* Information */}
                  {/* Update */}
                  <div className="my-6">
                    {/* Bio */}
                    <div className={`md:flex justify-between my-6`}>
                      <h1 className="basis-1/4 font-semibold xsm:text-sm md:text-lg">
                        Bio:{" "}
                      </h1>
                      <textarea
                        value={
                          profileUpdateState.bio ? profileUpdateState.bio : ""
                        }
                        onChange={(e) =>
                          setProfileUpdateState({
                            ...profileUpdateState,
                            bio: e.target.value,
                          })
                        }
                        placeholder="Empty"
                        className={`accent-textarea basis-3/4 min-h-60 resize-none h-[200px] xsm:my-2 md:my-0`}
                        // style="overflow:hidden"
                      />
                    </div>
                    {/* Personal Site */}
                    <div className={`md:flex justify-between`}>
                      <h1 className="basis-1/4 font-semibold xsm:text-sm md:text-lg">
                        Personal Site:{" "}
                      </h1>
                      <input
                        placeholder="Empty"
                        value={
                          profileUpdateState.personalSite
                            ? profileUpdateState.personalSite
                            : ""
                        }
                        onChange={(e) =>
                          setProfileUpdateState({
                            ...profileUpdateState,
                            personalSite: e.target.value,
                          })
                        }
                        className={`accent-input basis-3/4 w-full xsm:my-2 md:my-0 font-semibold`}
                      />
                    </div>
                  </div>
                  {/* Update */}
                  {/* Action Buttons */}
                  <div
                    className={`accent-border-top py-2 my-2 flex justify-end space-x-2`}
                  >
                    <PrimaryButton handleOnClick={handleProfileUpdate}>
                      {isUpdatingProfile ? (
                        <Oval
                          height={15}
                          width={15}
                          color="#A855F7"
                          visible={true}
                          ariaLabel="oval-loading"
                          secondaryColor="tr"
                          strokeWidth={4}
                          strokeWidthSecondary={4}
                        />
                      ) : (
                        <p>Update</p>
                      )}
                    </PrimaryButton>
                    <SecondaryButton handleOnClick={handleCancelProfileUpdate}>
                      Cancel
                    </SecondaryButton>
                  </div>
                  {/* Action Buttons */}
                </div>
              </Modal>
            )}
          </div>
          {/* User Details */}

          {/* Tabs */}
          <div className={`mx-auto`}>
            <Tabs className={`box-border min-h-screen`}>
              <TabList
                className={`flex justify-center xsm:gap-x-2 lg:gap-x-10
              text-primary font-bold ${montserrat.className} xsm:text-sm lg:text-lg
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
              <TabPanel className={`${montserrat.className} my-6 text-primary`}>
                <IntermediatePost
                  // bodyState={intermediatePostBodyState}
                  handleAddPost={() =>
                    setIsNewPostModalOpen(!isNewPostModalOpen)
                  }
                  // handleBodyChange={(e) =>
                  //   setIntermediatePostBodyState(e.target.value)
                  // }
                />
                {userPosts && userPosts.length > 0 ? (
                  <>
                    <PostTile userPosts={userPosts} user={session?.user} />
                  </>
                ) : (
                  <div className={`flex flex-col items-center py-10`}>
                    <h1 className="xsm:text-lg md:text-xl font-semibold my-4">
                      No Posts!
                    </h1>
                  </div>
                )}
                <NewPost
                  isOpen={isNewPostModalOpen}
                  handleCloseModal={() =>
                    setIsNewPostModalOpen(!isNewPostModalOpen)
                  }
                  intermediateBody={intermediatePostBodyState}
                />
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
                        className={`flex justify-between items-center accent-border-bottom gap-x-2 mb-2 pb-2`}
                      >
                        <Link href={`/authors/${poem.author}/${poem.title}`}>
                          <p
                            className={`text-primary font-bold xsm:text-sm lg:text-lg ${montserrat.className}`}
                          >
                            {poem.title} by{" "}
                            <span className={`italic text-primary font-light`}>
                              {poem.author}
                            </span>
                          </p>
                        </Link>
                        <button
                          onClick={() => handleDeleteLikedPoem(poem.title)}
                        >
                          <XCircleIcon
                            className={`xsm:w-4 xsm:h-4 md:w-5 md:h-5 text-primary`}
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
                  className={`${montserrat.className} flex justify-center my-6 text-primary`}
                >
                  <p>No liked poems!</p>
                </TabPanel>
              )}
              {/* Liked Poems */}
              {/* Collections */}

              <TabPanel
                className={`xsm:m-2 lg:m-6 box-border md:grid grid-cols-new4 gap-x-6`}
                default={
                  // @ts-ignore
                  +router?.query?.isCollectionsTabActive > 0 ? true : false
                }
              >
                {userCollectionsState && !isUpdatingCollection ? (
                  userCollectionsState &&
                  // @ts-ignore
                  userCollectionsState?.map((collection: any, i: number) => (
                    <div
                      key={i}
                      className={`accent-modal-bg accent-border accent-rounded accent-shadow text-primary my-6 p-4 ${montserrat.className}`}
                    >
                      {/* Header */}
                      <div className="flex justify-between accent-border-bottom pb-1 mb-2">
                        <h1 className="font-bold">{collection.name}</h1>
                        <button
                          onClick={() =>
                            handleDeleteCollection(collection.name)
                          }
                        >
                          <XCircleIcon
                            className={`xsm:w-4 xsm:h-4 md:w-5 md:h-5 text-primary`}
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
                                    className={`text-primary font-bold xsm:text-sm lg:text-md ${montserrat.className}`}
                                  >
                                    {poem.title}
                                  </p>
                                </Link>
                                <Link href={`/authors/${poem.author}`}>
                                  <span
                                    className={`italic text-primary font-light xsm:text-sm lg:text-md`}
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
                                  className={`xsm:w-4 xsm:h-4 md:w-5 md:h-5 text-primary`}
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
        <div className="my-4 w-full text-primary">
          <h1
            className={`${montserrat.className} xsm:text-md md:text-lg font-bold accent-border-bottom mb-4`}
          >
            User Actions
          </h1>
          <PrimaryButton handleOnClick={() => signOut()}>Logout</PrimaryButton>
        </div>
        <Toaster position="bottom-center" reverseOrder={false} />
      </div>
    </>
  );
};

export default User;
