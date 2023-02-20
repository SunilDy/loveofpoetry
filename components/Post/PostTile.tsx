import { UserTitleType } from "@/models/UserTitles";
import {
  HeartIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import PlaceHolder from "@/public/placeholder/ph2.png";
import Placeholder from "@/public/placeholder/ph2.png";

type PostTileType = {
  userPosts: UserTitleType[];
};

const PostTile = ({ userPosts }: PostTileType) => {
  //   console.log("userPosts", userPosts);
  return (
    <div>
      {userPosts.map((post: UserTitleType, i: number) => (
        <div
          className={`
            accent-modal-bg accent-border rounded-xl
            m-6 p-6 mx-auto
            xsm:w-[95%] md:w-[70%] lg:w-[60%]
            shadow-xl
            `}
          key={i}
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
            <h1
              className={`
                text-lg font-semibold pb-2
            `}
            >
              {post.title}
            </h1>
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
              <button>
                <HeartIcon
                  className={`xsm:w-4 xsm:h-4 md:w-6 md:h-6 text-white`}
                />
              </button>
              <p>{post.likes}</p>
            </div>
            <div className="flex items-center gap-x-2">
              <button>
                <ChatBubbleLeftEllipsisIcon
                  className={`xsm:w-4 xsm:h-4 md:w-6 md:h-6 text-white`}
                />
              </button>
              <p>{post.comments.length}</p>
            </div>
          </div>
          {/* Icons Buttons */}
        </div>
      ))}
    </div>
  );
};

export default PostTile;
