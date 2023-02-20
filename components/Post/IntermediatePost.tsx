import { PrimaryButton } from "../Buttons";
import { Montserrat } from "@next/font/google";
import { ArrowUpCircleIcon } from "@heroicons/react/20/solid";

const montserrat = Montserrat({ subsets: ["latin"] });

type IntermediatePostType = {
  handleAddPost: () => void;
  bodyState: string;
  handleBodyChange: (e: any) => void;
};

const IntermediatePost = ({
  handleAddPost,
  bodyState,
  handleBodyChange,
}: IntermediatePostType) => {
  //   console.log("intermediatePostBodyState x2", bodyState);

  return (
    <div
      className={`mx-auto w-full
              xsm:w-[95%] md:w-[70%] lg:w-[60%]
              accent-modal-bg accent-border rounded-xl p-6
              `}
    >
      {/* Header + Action Button */}
      <div className="flex justify-between">
        <h1 className={`${montserrat.className} font-bold text-xl`}>
          New Post
        </h1>
        <PrimaryButton
          handleOnClick={handleAddPost}
          buttonClassNames={`flex items-center gap-x-1`}
        >
          <p>Post</p>
          <ArrowUpCircleIcon className={`xsm:w-5 xsm:h-5 cursor-pointer`} />
        </PrimaryButton>
      </div>
      {/* Header + Action Button */}
      {/* Body */}
      <input
        value={bodyState}
        onChange={(e) => handleBodyChange(e)}
        placeholder={`What's on your mind?`}
        className={`accent-input w-full my-4`}
      />
      {/* Body */}
    </div>
  );
};

export default IntermediatePost;
