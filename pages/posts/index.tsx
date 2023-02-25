import Head from "next/head";
import { useSession } from "next-auth/react";
import { Montserrat } from "@next/font/google";
import { useRouter } from "next/router";
import { useInfiniteQuery } from "react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import PostTile from "@/components/Post/PostTile";
import { UserTitleType } from "@/models/UserTitles";
import { PrimaryButton } from "@/components/Buttons";
import IntermediatePost from "@/components/Post/IntermediatePost";
import NewPost from "@/components/Post/NewPost";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Oval } from "react-loader-spinner";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/login");
    },
  });

  // States
  const [posts, setPosts] = useState<UserTitleType[] | null>(null);
  // const [intermediateBodyState, setIntermediateBodyState] = useState("");
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  const {
    status: queryStatus,
    data,
    error,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery(
    ["projects"],
    async ({ pageParam = 1 }) => {
      const res = await axios.get(`/api/posts/get?cursor=${pageParam}`);
      return res.data;
    },
    {
      getPreviousPageParam: (firstPage) => firstPage.previousId ?? undefined,
      getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
  );

  useEffect(() => {
    if (data?.pages) {
      let posts = data.pages.map((page: any) => {
        return page.data;
      });
      setPosts(posts.flat());
    }
    // console.log(data?.pages);
  }, [data, hasNextPage]);

  useEffect(() => {
    // console.log(intermediateBodyState);
  }, [posts]);

  const handleNextPageClick = () => {
    fetchNextPage();
  };

  useEffect(() => {
    // console.log(document);
    let fetching = false;
    const onScroll = async (e: any) => {
      const { scrollHeight, scrollTop, clientHeight } =
        e.target.scrollingElement;

      // let count = 0;
      if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.5) {
        fetching = true;
        // count = count + 1;
        // console.log("scroll ", count);
        await fetchNextPage();
        fetching = false;
      }
    };

    document.addEventListener("scroll", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, [fetchNextPage]);

  if (isLoading) {
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
        <title>PoetryDot - Posts</title>
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
      <main className="xsm:w-[90%] lg:w-[80%] mx-auto text-primary">
        <h1
          className={`
            ${montserrat.className} font-semibold
            xsm:text-xl md:text-2xl lg:text-3xl
            text-center
            my-10
          `}
        >
          Discover What&rsquo;s Going On!
        </h1>
        <IntermediatePost
          handleAddPost={() => setIsNewPostModalOpen(!isNewPostModalOpen)}
        />
        <NewPost
          isOpen={isNewPostModalOpen}
          handleCloseModal={() => setIsNewPostModalOpen(!isNewPostModalOpen)}
        />
        {posts && <PostTile userPosts={posts} user={session?.user} />}

        {/* Add Post Button */}
        <button
          className={`
          fixed z-30
          bottom-6 right-6 lg:bottom-10 lg:right-32
          bg-white rounded-full text-secondary xsm:p-3 md:p-5
          hover:scale-95 transition-transform
          ring-2 ring-secondary
          shadow-2xl
      `}
          onClick={() => setIsNewPostModalOpen(!isNewPostModalOpen)}
        >
          <PlusIcon
            className={`xsm:w-6 xsm:h-6 md:w-8 md:h-8 cursor-pointer`}
          />
        </button>
        {/* Add Post Button */}
        {/* Loader */}
        {isFetching && (
          <div className="my-20 w-full flex justify-center">
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
        {/* Loader */}
      </main>
    </>
  );
}
