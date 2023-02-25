import { UserTitleType } from "@/models/UserTitles";
import { HeartIcon, ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import Image from "next/image";
import Placeholder from "@/public/placeholder/ph2.png";
import { Montserrat } from "@next/font/google";
import { PrimaryButton } from "../Buttons";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const montserrat = Montserrat({ subsets: ["latin"] });

type PostTileType = {
  userPosts: UserTitleType[];
  user?: any;
  shouldShowDelete: boolean;
};

const PostTile = ({ userPosts, user, shouldShowDelete }: PostTileType) => {
  const router = useRouter();
  const [likesStateBoolean, setLikesStateBoolean] = useState<boolean[] | null>(
    null
  );
  const [likesCount, setLikesCount] = useState<number[] | null>(null);

  // console.log(userPosts);

  useEffect(() => {
    let likesBooleanMapped = userPosts.map((post) => {
      return post.isLiked;
    });
    let likesMapped = userPosts.map((post) => {
      return post.likes.length;
    });
    setLikesCount(likesMapped);
    setLikesStateBoolean(likesBooleanMapped);
    // console.log(user);
    console.log(userPosts);
  }, [userPosts, user]);

  useEffect(() => {}, [likesCount, likesStateBoolean]);

  const handlePostLike = (title: string, author_email: string, i: number) => {
    console.log(i);
    if (likesCount && likesStateBoolean && likesStateBoolean[i]) {
      // unlike
      axios
        .post(
          `/api/posts/unlike`,
          {
            title,
            author_email,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          // console.log(res.data.dummy);
          let updatedLikesArray = [...likesStateBoolean];
          updatedLikesArray[i] = false;
          setLikesStateBoolean(updatedLikesArray);
          let updatedLikesCountArray = [...likesCount];
          updatedLikesCountArray[i] = updatedLikesCountArray[i] - 1;
          setLikesCount(updatedLikesCountArray);
        })
        .catch((err) => {
          console.log(err);
        });
      console.log("post already liked");
    } else if (likesCount && likesStateBoolean && !likesStateBoolean[i]) {
      // like
      axios
        .post(
          `/api/posts/like`,
          {
            title,
            author_email,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          // console.log(res.data.dummy);
          let updatedLikesArray = [...likesStateBoolean];
          updatedLikesArray[i] = true;
          setLikesStateBoolean(updatedLikesArray);
          let updatedLikesCountArray = [...likesCount];
          updatedLikesCountArray[i] = updatedLikesCountArray[i] + 1;
          setLikesCount(updatedLikesCountArray);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handlePostDelete = (title: string) => {
    console.log("title", title);
    axios
      .post(
        `/api/posts/deleteone`,
        {
          title,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // console.log(res.data);
        router.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={`${montserrat.className} text-primary`}>
      {userPosts.map((post: UserTitleType, i: number) => (
        <div
          className={`
            accent-modal-bg accent-border accent-rounded
            m-6 p-6 mx-auto
            xsm:w-[95%] md:w-[70%] lg:w-[60%]
            accent-shadow
            `}
          key={i}
          // onClick={() => router.push(`/posts/${post._id}`)}
        >
          {/* User avatar + details */}
          <div className="flex justify-between items-start">
            <div className={`flex gap-x-2 items-center`}>
              {/* Avatar */}
              <div>
                {post.avatar !== ("" || undefined) ? (
                  <Image
                    className="xsm:w-10 lg:w-16 aspect-square object-cover object-center rounded-full xsm:mr-2 lg:mr-4 self-start"
                    src={post.avatar}
                    alt={post.author_name}
                    height={300}
                    width={300}
                  />
                ) : (
                  <Image
                    className="xsm:w-10 lg:w-16 aspect-square object-cover object-center rounded-full xsm:mr-2 lg:mr-4 self-start"
                    src={Placeholder}
                    alt={post.author_name}
                    height={300}
                    width={300}
                  />
                )}
              </div>
              {/* Avatar */}
              {/* Details */}
              <div>
                <Link href={`/profile/${post.uid}`}>
                  <p className="xsm:text-sm md:text-lg font-semibold">
                    {post.author_name}
                  </p>
                </Link>
                <p className="xsm:text-xs md:text-md text-slate-200">
                  {/* {new Date(post.created_on).toDateString()} */}
                  {formatDistanceToNow(new Date(post.created_on), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            {shouldShowDelete && (
              <button onClick={() => handlePostDelete(post.title)}>
                <XCircleIcon className={`w-6 h-6`} />
              </button>
            )}
          </div>
          {/* Details */}

          {/* Body */}
          <div className="py-6 accent-border-bottom xsm:text-sm md:text-md">
            <Link href={`/posts/${post._id}`}>
              <h1
                className={`
                xsm:text-lg md:text-xl lg:text-2xl font-semibold pb-2
            `}
              >
                {post.title}
              </h1>
            </Link>
            {/* Image */}
            {post.image && post.image.url && (
              // <div className={`my-4 min-h-[${+post.image.height}px]`}>
              <div className={`my-4`}>
                <Image
                  alt={post.image.name}
                  // @ts-ignore
                  src={post.image.url}
                  width={+post.image.width}
                  height={+post.image.height}
                  className={`aspect-square object-cover rounded-xl col-span-full row-span-full max-h-80 w-fit`}
                />
              </div>
            )}
            {/* Image */}
            {post.lines.map((line: string, i: number) => (
              <div
                key={Math.random()}
                className="xsm:text-sm md:text-base lg:text-lg text-primary"
              >
                {line === "" ? <br /> : <p className="break-words">{line}</p>}
              </div>
            ))}
          </div>
          {/* Body */}
          {/* Icons Buttons */}
          <div className="flex gap-x-6 items-center mt-2">
            <div className="flex gap-x-2 items-center">
              <PrimaryButton
                handleOnClick={() =>
                  handlePostLike(post.title, post.author_email, i)
                }
                buttonClassNames={`${
                  likesStateBoolean && likesStateBoolean[i]
                    ? `flex items-center gap-x-2 border-none`
                    : `flex items-center gap-x-2 bg-opacity-30 border-none text-white`
                } xsm:px-2 font-semibold`}
              >
                {likesStateBoolean && likesStateBoolean[i] ? (
                  <HeartIconSolid
                    className={`xsm:w-4 xsm:h-4 md:w-6 md:h-6 stroke-2`}
                  />
                ) : (
                  <HeartIcon
                    className={`xsm:w-4 xsm:h-4 md:w-6 md:h-6 stroke-2`}
                  />
                )}
                <p>{likesCount && likesCount[i]}</p>
              </PrimaryButton>
            </div>
            <div className="flex items-center gap-x-2">
              <PrimaryButton
                handleOnClick={() => router.push(`/posts/${post._id}`)}
                buttonClassNames={`flex items-center gap-x-2 bg-opacity-30 border-none text-white xsm:px-2 font-semibold`}
              >
                <ChatBubbleOvalLeftIcon
                  className={`xsm:w-4 xsm:h-4 md:w-6 md:h-6`}
                />
                <p>{post.comments.length}</p>
              </PrimaryButton>
            </div>
          </div>
          {/* Icons Buttons */}
        </div>
      ))}
    </div>
  );
};

export default PostTile;
