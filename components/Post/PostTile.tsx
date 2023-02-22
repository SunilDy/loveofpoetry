import { UserTitleType } from "@/models/UserTitles";
import {
  HeartIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Placeholder from "@/public/placeholder/ph2.png";
import { Montserrat } from "@next/font/google";
import { PrimaryButton } from "../Buttons";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const montserrat = Montserrat({ subsets: ["latin"] });

type PostTileType = {
  userPosts: UserTitleType[];
  user?: any;
};

const PostTile = ({ userPosts, user }: PostTileType) => {
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
  }, [userPosts, user]);

  useEffect(() => {
    console.log(likesCount);
  }, [likesCount, likesStateBoolean]);

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

  return (
    <div className={`${montserrat.className}`}>
      {userPosts.map((post: UserTitleType, i: number) => (
        <div
          className={`
            accent-modal-bg accent-border rounded-xl
            m-6 p-6 mx-auto
            xsm:w-[95%] md:w-[70%] lg:w-[60%]
            shadow-xl
            `}
          key={i}
          // onClick={() => router.push(`/posts/${post._id}`)}
        >
          {/* User avatar + details */}
          <div className={`flex gap-x-2 items-center`}>
            {/* Avatar */}
            <div>
              {post.avatar !== ("" || undefined) ? (
                <Image
                  className="w-16 aspect-square object-cover object-center rounded-full mr-4 self-start"
                  src={post.avatar}
                  alt={post.author_name}
                  height={300}
                  width={300}
                />
              ) : (
                <Image
                  className="xsm:w-14 lg:w-20 aspect-square object-cover object-center rounded-full mr-4 self-start"
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
              <p>{post.author_name}</p>
              <p>{new Date(post.created_on).toDateString()}</p>
            </div>
            {/* Details */}
          </div>
          {/* Body */}
          <div className="py-6 accent-border-bottom  xsm:text-sm md:text-md">
            <Link href={`/posts/${post._id}`}>
              <h1
                className={`
                text-lg font-semibold pb-2
            `}
              >
                {post.title}
              </h1>
            </Link>
            {post.lines.map((line: string, i: number) => (
              <div key={Math.random()}>
                {line === "" ? <br /> : <p>{line}</p>}
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
                } xsm:px-2`}
              >
                <HeartIcon className={`xsm:w-4 xsm:h-4 md:w-6 md:h-6`} />
                <p>{likesCount && likesCount[i]}</p>
              </PrimaryButton>
            </div>
            <div className="flex items-center gap-x-2">
              <PrimaryButton
                handleOnClick={() => {}}
                buttonClassNames={`flex items-center gap-x-2 bg-opacity-30 border-none text-white xsm:px-2`}
              >
                <ChatBubbleLeftEllipsisIcon
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
