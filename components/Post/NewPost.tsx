import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../Modal";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { useRouter } from "next/router";
import { Montserrat } from "@next/font/google";
import { Oval } from "react-loader-spinner";
import toast, { Toaster } from "react-hot-toast";
import { XCircleIcon, ArrowUpCircleIcon } from "@heroicons/react/20/solid";
import { useContext } from "react";
import { IntermediateBodyContext } from "@/context/IntermediatePostBody";

const montserrat = Montserrat({ subsets: ["latin"] });

type NewPostType = {
  isOpen: boolean;
  handleCloseModal: () => void;
  intermediateBody?: string;
};

const NewPost = ({
  isOpen,
  handleCloseModal,
  intermediateBody,
}: NewPostType) => {
  const [postTitle, setPostTitle] = useState("");
  // @ts-ignore
  const { postBody, setPostBody } = useContext(IntermediateBodyContext);
  const [isUploadingPost, setIsUploadingPost] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // console.log("postState", postState);
    // console.log("intermediateBody", intermediateBody);
  }, [isUploadingPost, intermediateBody, postBody]);

  const handleNewPost = () => {
    setIsUploadingPost(!isUploadingPost);
    axios
      .post(
        `/api/posts/new`,
        {
          title: postTitle,
          body: postBody,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // console.log(res);
        if (res.data.status === "ok") {
          setIsUploadingPost(false);
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
                  Posted!
                </h1>
              </div>
              <div>
                <XCircleIcon
                  className={`xsm:w-4 xsm:h-4 lg:w-6 lg:h-6 xsm:mx-1 lg:mx-2 cursor-pointer`}
                />
              </div>
            </div>
          ));
          router.reload();
        }
      })
      .catch((err) => {
        console.log(err);
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
                You already have the post by the same title!
              </h1>
            </div>
            <div>
              <XCircleIcon
                className={`xsm:w-4 xsm:h-4 lg:w-6 lg:h-6 xsm:mx-1 lg:mx-2 cursor-pointer`}
              />
            </div>
          </div>
        ));
        setIsUploadingPost(false);
      });
  };

  if (!isOpen) return <></>;

  return (
    <Modal>
      <div
        className={`accent-modal-bg accent-border px-6 py-4 rounded-md xsm:w-[100%] md:w-[70%]`}
      >
        {/* Header */}
        <h1
          className={`${montserrat.className} font-bold accent-border-bottom pb-2 mb-4 text-xl`}
        >
          New Post
        </h1>
        {/* Post Title */}
        <div className={`mb-4`}>
          <h1 className="font-semibold xsm:text-sm md:text-lg basis-1/4 xsm:my-2 md:my-0">
            Title
          </h1>
          <input
            placeholder="Post Title"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className={`accent-input basis-3/4 w-full`}
          />
          {postTitle.length <= 4 && (
            <p className="xsm:text-xs md:text-sm mt-2">
              Min. length of title is 4.
            </p>
          )}
        </div>
        {/* Post Title */}
        {/* Post Body */}
        <div>
          <h1 className="font-semibold xsm:text-sm md:text-lg xsm:my-2 md:my-0">
            Post Body
          </h1>
          <textarea
            placeholder="Write a post"
            value={postBody}
            onChange={(e) => setPostBody(e.target.value)}
            className={`accent-textarea xsm:w-[100%] xsm:h-56 md:h-60 w-full p-4 placeholder:font-normal font-normal`}
          />
          {postBody && postBody.length <= 20 && (
            <p className="xsm:text-xs md:text-sm mb-6">
              Min. length of title is 20.
            </p>
          )}
        </div>
        {/* Post Body */}
        {/* Action Buttons */}
        <div className={`flex justify-end items-center gap-x-2`}>
          <PrimaryButton
            buttonClassNames={`font-semibold flex gap-x-2 justify-between items-center`}
            handleOnClick={handleNewPost}
            // @ts-ignore
            isDisabled={postBody.length < 20 || postTitle.length < 4}
          >
            {isUploadingPost ? (
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
              <>
                <p>Post</p>
                <ArrowUpCircleIcon
                  className={`xsm:w-5 xsm:h-5 cursor-pointer`}
                />
              </>
            )}
          </PrimaryButton>
          <SecondaryButton
            handleOnClick={handleCloseModal}
            buttonClassNames={`font-semibold`}
          >
            Cancel
          </SecondaryButton>
        </div>
      </div>
      <Toaster position="bottom-center" reverseOrder={false} />
    </Modal>
  );
};

export default NewPost;
