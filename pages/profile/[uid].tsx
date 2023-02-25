import { useSession } from "next-auth/react";
import { Montserrat } from "@next/font/google";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Link from "next/link";
import { useRouter } from "next/router";
import UserDetails from "@/components/User/UserDetails";
import PostTile from "@/components/Post/PostTile";
import User from "@/models/User";
import UserTitle from "@/models/UserTitles";

const montserrat = Montserrat({ subsets: ["latin"] });

const Profile = ({
  profile: profileStringified,
  posts: postsStringified,
}: any) => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/login");
    },
  });

  let profile = JSON.parse(profileStringified);
  let userPosts = JSON.parse(postsStringified);
  // if (postsStringified.length > 0) {
  //   userPosts =
  // } else {
  //   userPosts = [];
  // }

  console.log(profile);
  console.log(userPosts);

  return (
    <div className="min-h-screen flex flex-col justify-between items-center xsm:w-[90%] lg:w-[80%] mx-auto">
      <div className="w-full mx-auto">
        {/* User Details */}
        <div>
          <UserDetails
            profileImage={profile.image}
            username={profile.name}
            email={profile.email}
            bio={profile.bio}
            personalSite={profile.personalSite}
            handleProfileEdit={() => {}}
            showProfileEditButton={false}
          />
        </div>
        {/* User Details */}

        {/* Tabs */}
        <div className={`mx-auto`}>
          <Tabs className={`box-border min-h-screen`}>
            <TabList
              className={`flex-justify xsm:gap-x-2 lg:gap-x-10
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
              {userPosts.length > 0 ? (
                <>
                  <PostTile userPosts={userPosts} user={profile} />
                </>
              ) : (
                <div className={`flex flex-col items-center py-10`}>
                  <h1 className="xsm:text-lg md:text-xl font-semibold my-4">
                    No Posts!
                  </h1>
                </div>
              )}
            </TabPanel>
            {/* Posts */}
            {/* Liked Poems */}
            <TabPanel>
              {profile.likedPoems.length > 0 ? (
                profile.likedPoems.map((poem: any, i: number) => (
                  <div
                    key={i}
                    className={`flex-center accent-border-bottom gap-x-2 mb-2 pb-2`}
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
                  </div>
                ))
              ) : (
                <div
                  className={`${montserrat.className} flex-justify my-6 text-primary`}
                >
                  <p>No liked poems!</p>
                </div>
              )}
            </TabPanel>
            {/* Liked Poems */}
            {/* Collections */}

            <TabPanel
              className={`xsm:m-2 lg:m-6 box-border md:grid grid-cols-new4 gap-x-6`}
            >
              {profile.collections &&
                profile.collections.map((collection: any, i: number) => (
                  <div
                    key={i}
                    className={`accent-modal-bg accent-border text-primary accent-rounded accent-shadow my-6 p-4 ${montserrat.className}`}
                  >
                    {/* Header */}
                    <div className="flex-justify accent-border-bottom pb-1 mb-2">
                      <h1 className="font-bold">{collection.name}</h1>
                    </div>
                    {/* Titles */}
                    <div>
                      {collection.titles.length > 0 ? (
                        collection.titles.map((poem: any, i: number) => (
                          <div key={i} className="flex-justify my-2">
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
                          </div>
                        ))
                      ) : (
                        <p>No item</p>
                      )}
                    </div>
                  </div>
                ))}
            </TabPanel>
            {/* Collections */}
          </Tabs>
        </div>
        {/* Tabs */}
      </div>
      {/* User Actions */}
    </div>
  );
};

export default Profile;

export const getServerSideProps = async (ctx: any) => {
  let { params } = ctx;
  let user = await User.findById(params.uid);

  let posts = [];
  if (user.posts.length > 0)
    posts = await UserTitle.find({
      title: { $in: user.posts },
      author_email: user.email,
    });

  //   user.posts = posts;

  //   console.log(params);

  return {
    props: {
      profile: JSON.stringify(user),
      posts: JSON.stringify(posts),
    },
  };
};
