import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../Modal";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { useRouter } from "next/router";
import { Montserrat } from "@next/font/google";
import { Oval } from "react-loader-spinner";
import toast, { Toaster } from "react-hot-toast";
import {
  XCircleIcon,
  ArrowUpCircleIcon,
  PhotoIcon,
} from "@heroicons/react/20/solid";
import { useContext } from "react";
import { IntermediateBodyContext } from "@/context/IntermediatePostBody";
import Image from "next/image";

const montserrat = Montserrat({ subsets: ["latin"] });

type NewPostType = {
  isOpen: boolean;
  handleCloseModal: () => void;
  intermediateBody?: string;
};

const NewPost = ({ isOpen, handleCloseModal }: NewPostType) => {
  const [postTitle, setPostTitle] = useState("");
  // @ts-ignore
  const { postBody, setPostBody } = useContext(IntermediateBodyContext);
  const [isUploadingPost, setIsUploadingPost] = useState(false);
  const [imageSrc, setImageSrc] = useState<
    string | ArrayBuffer | null | undefined
  >(null);
  const [imageUploadData, setImageUploadData] = useState(null);

  const router = useRouter();

  useEffect(() => {
    // console.log("from useEffect", imageUploadData);
  }, [isUploadingPost, postBody, imageUploadData]);

  const handleNewPost = async () => {
    setIsUploadingPost(!isUploadingPost);

    // Setting Image to FormData

    // let preset = "poetry-dot";
    let imageBody = {};
    if (imageUploadData) {
      let image = new FormData();
      console.log("imageUploadData", imageUploadData);
      image.append("file", imageUploadData);
      image.append("upload_preset", "v9drf53n");
      // console.log(image?.values());
      let res = await axios.post(
        `https://api.cloudinary.com/v1_1/dgbanf9zo/image/upload`,
        image
      );
      console.log(res.data);
      imageBody = {
        name: res.data.original_filename,
        url: res.data.secure_url,
        height: res.data.height,
        width: res.data.width,
      };
    }

    // console.log(imageBody);
    let imageBodyStringified = JSON.stringify(imageBody);

    axios
      .post(
        `/api/posts/new`,
        {
          title: postTitle,
          body: postBody,
          imageBody: imageBodyStringified,
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
          setPostTitle("");
          setImageSrc(null);
          setPostBody("");
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

  const handleImageChange = (e: any) => {
    // e.preventDefault();
    // console.log("yyy");
    const reader = new FileReader();

    reader.readAsDataURL(e.target.files[0]);
    reader.onload = async (onLoadEvent) => {
      setImageSrc(onLoadEvent?.target?.result);
    };
    // console.log(e.currentTarget);
    const form = e.currentTarget;
    let imageInput: any = Array.from(form.elements).find(
      // @ts-ignore
      ({ name }) => name === "image-file"
    );
    let imageData = imageInput.files[0];
    // console.log("imageUploadData", imageInput.files[0]);
    setImageUploadData(imageData);
  };

  if (!isOpen) return <></>;

  return (
    <Modal>
      <div
        className={`accent-modal-bg accent-border px-6 py-4 rounded-md xsm:w-[100%] md:w-[70%] max-h-[90%] overflow-y-scroll accent-scrollbar`}
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
        {/* Images -> Input */}
        <form className={`my-4`} onChange={(e) => handleImageChange(e)}>
          {!imageSrc && (
            <div>
              <label
                htmlFor="file-upload"
                className="flex gap-x-2 items-center cursor-pointer bg-white text-secondary
            md:px-2 p-1 rounded-md
            hover:scale-95
            transition-transform
            lg:text-md xsm:text-sm
            border-2 border-white
            font-semibold w-fit"
              >
                <PhotoIcon
                  className={`xsm:w-4 xsm:h-4 lg:w-6 lg:h-6 xsm:mx-1 lg:mx-2 cursor-pointer`}
                />
                Select Image
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                name="image-file"
              />
            </div>
          )}
          {imageSrc && (
            <div className="grid grid-cols-1 grid-rows-1 w-fit">
              <Image
                alt="image"
                // @ts-ignore
                src={imageSrc}
                width={200}
                height={200}
                className={`aspect-square object-cover rounded-xl col-span-full row-span-full`}
              />
              <button
                onClick={() => setImageSrc(null)}
                className="col-span-full row-span-full self-start justify-self-end text-secondary mr-1 mt-1  rounded-full p-2 backdrop-blur-3xl"
              >
                <XCircleIcon
                  className={`xsm:w-4 xsm:h-4 lg:w-6 lg:h-6 xsm:mx-1 lg:mx-2 cursor-pointer`}
                />
              </button>
            </div>
          )}
        </form>
        {/* Images -> Input */}
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
