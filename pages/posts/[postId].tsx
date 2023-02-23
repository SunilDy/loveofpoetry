import { useRouter } from "next/router";
import UserTitle, { UserTitleType } from "@/models/UserTitles";
import { useSession } from "next-auth/react";
import { Oval } from "react-loader-spinner";
import { HeartIcon, ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import Image from "next/image";
import Placeholder from "@/public/placeholder/ph2.png";
import { Montserrat } from "@next/font/google";
import { PrimaryButton } from "@/components/Buttons";
import Link from "next/link";
import Comments from "@/components/Comments";
import axios from "axios";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import Modal from "@/components/Modal";

const montserrat = Montserrat({ subsets: ["latin"] });

const Post = ({ userTitle }: any) => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/login");
    },
  });

  const getUserTitle = async () => {
    return await axios.post(
      `/api/posts/getone`,
      {
        postId: router.query.postId,
      },
      {
        withCredentials: true,
      }
    );
  };

  const getComments = async () => {
    return await axios.post(`/api/posts/comments/getone`, {
      postId: router.query.postId,
    });
  };

  // States
  const [titleState, setTitleState] = useState<UserTitleType | null>(null);
  const [commentsState, setCommentsState] = useState<any[] | null>(null);
  const [commentValue, setCommentValue] = useState("");
  const [isUploadingComment, setIsUploadingComment] = useState(false);
  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const [likesCount, setLikesCount] = useState(0);

  const { data: title, isLoading: loadingTitle } = useQuery(
    `title-${router.query.postId}`,
    getUserTitle
  );

  const {
    data: comments,
    isLoading: loadingComments,
    isFetched: commentsFetched,
    isFetching: fetchingComments,
    refetch: refetchComments,
  } = useQuery(`comments-${router.query.postId}`, getComments);

  //   Side effects
  useEffect(() => {
    if (title?.data) {
      setTitleState(title?.data.userTitle);
      setIsLiked(title?.data.userTitle.isLiked);
      setLikesCount(title?.data.userTitle.likes.length);
    }

    if (comments?.data) {
      setCommentsState(comments?.data.userTitle.comments);
    }
    // console.log("title", title?.data);
  }, [comments, title]);

  //   State
  useEffect(() => {
    // console.log("commentsState", commentsState);
  }, [commentsState, titleState, isLiked]);

  //   useEffect(() => {}, []);

  const handleAddComment = () => {
    setIsUploadingComment(true);
    axios
      .post(
        `/api/posts/comments/add`,
        {
          commentBody: commentValue,
          titleId: router.query.postId,
        },
        {
          withCredentials: true,
        }
      )
      .then(async (res) => {
        // console.log(res.data);
        setCommentValue("");
        await refetchComments();
        setIsUploadingComment(false);
      })
      .catch((err) => {
        console.log(err);
        setIsUploadingComment(false);
      });
  };

  const handlePostLike = () => {
    if (titleState && titleState.isLiked) {
      // unlike

      axios
        .post(
          `/api/posts/unlike`,
          {
            title: titleState.title,
            author_email: titleState.author_email,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setIsLiked(!isLiked);
          setLikesCount(titleState.likes.length - 1);
        })
        .catch((err) => {
          console.log(err);
        });
      // console.log("post already liked");
    } else if (titleState && !titleState.isLiked) {
      // like
      axios
        .post(
          `/api/posts/like`,
          {
            title: titleState.title,
            author_email: titleState.author_email,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          //   console.log(res.data);
          setLikesCount(titleState.likes.length + 1);
          setIsLiked(!isLiked);
          //   setTitleState({ ...titleState, isLiked: true });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  if (status === "loading" || !titleState) {
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
    <div className="min-h-screen">
      <div
        className={`
            text-white rounded-xl
            m-6 p-6 mx-auto
            xsm:w-full md:w-[80%] lg:w-[70%] xl:w-[50%]
            ${montserrat.className}
            `}
      >
        <div className="accent-border p-4 accent-modal-bg rounded-xl shadow-2xl">
          {/* User avatar + details */}
          <div className={`flex gap-x-2 items-center`}>
            {/* Avatar */}
            <div>
              {titleState.avatar !== ("" || undefined) ? (
                <Image
                  className="xsm:w-10 lg:w-16 aspect-square object-cover object-center rounded-full xsm:mr-2 lg:mr-4 self-start"
                  src={titleState.avatar}
                  alt={titleState.author_name}
                  height={300}
                  width={300}
                />
              ) : (
                <Image
                  className="xsm:w-10 lg:w-16 aspect-square object-cover object-center rounded-full xsm:mr-2 lg:mr-4 self-start"
                  src={Placeholder}
                  alt={titleState.author_name}
                  height={300}
                  width={300}
                />
              )}
            </div>
            {/* Avatar */}
            {/* Details */}
            <div>
              <p className="xsm:text-sm md:text-lg font-semibold">
                {titleState.author_name}
              </p>
              <p className="xsm:text-xs md:text-md text-slate-200">
                {new Date(titleState.created_on).toDateString()}
              </p>
            </div>
            {/* Details */}
          </div>
          {/* Body */}
          <div className="py-6 accent-border-bottom  xsm:text-sm md:text-md">
            <Link href={`/posts/${titleState._id}`}>
              <h1
                className={`
                font-semibold pb-2
                xsm:text-xl md:text-2xl lg:text-3xl 
            `}
              >
                {titleState.title}
              </h1>
            </Link>
            <div className="xsm:px-2 md:px-4">
              {titleState.lines.map((line: string, i: number) => (
                <div
                  key={Math.random()}
                  className={`xsm:text-md md:text-lg lg:text-lg`}
                >
                  {line === "" ? <br /> : <p>{line}</p>}
                </div>
              ))}
            </div>
          </div>
          {/* Body */}
          {/* Icons Buttons */}
          <div className="flex gap-x-6 items-center xsm:mt-2 lg:mt-4">
            <div className="flex gap-x-2 items-center">
              <PrimaryButton
                handleOnClick={handlePostLike}
                buttonClassNames={`${
                  // @ts-ignore
                  isLiked
                    ? `flex items-center gap-x-2 border-none`
                    : `flex items-center gap-x-2 bg-opacity-30 border-none text-white`
                } xsm:px-2 font-bold`}
              >
                {isLiked ? (
                  <HeartIconSolid
                    className={`xsm:w-4 xsm:h-4 md:w-6 md:h-6 stroke-2`}
                  />
                ) : (
                  <HeartIcon
                    className={`xsm:w-4 xsm:h-4 md:w-6 md:h-6 stroke-2`}
                  />
                )}
                <p>{likesCount}</p>
              </PrimaryButton>
            </div>
            <div className="flex items-center gap-x-2">
              <PrimaryButton
                handleOnClick={() => {}}
                buttonClassNames={`flex items-center gap-x-2 bg-opacity-30 border-none text-white xsm:px-2 font-bold`}
              >
                <ChatBubbleOvalLeftIcon
                  className={`xsm:w-4 xsm:h-4 md:w-6 md:h-6 stroke-2`}
                />
                <p>{titleState.comments.length}</p>
              </PrimaryButton>
            </div>
          </div>
          {/* Icons Buttons */}
        </div>
        {/* Comments Section */}
        <div className={`my-10`}>
          <textarea
            placeholder="Comment please 😇"
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
            className={`accent-textarea`}
          />
          <PrimaryButton
            handleOnClick={handleAddComment}
            buttonClassNames={`font-bold`}
          >
            Comment
          </PrimaryButton>
          <Comments
            areCommentsFetched={commentsFetched}
            comments={commentsState}
            fetchingComments={isUploadingComment}
            loadingComments={loadingComments}
          />
        </div>
        {/* Comments Section */}
      </div>
    </div>
  );
};

export default Post;

export const getServerSideProps = async (context: any) => {
  const { params } = context;

  let userTitle = await UserTitle.findById(params.postId);

  return {
    props: {
      userTitle: JSON.stringify(userTitle),
    },
  };
};
