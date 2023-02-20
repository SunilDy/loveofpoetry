import { useState } from "react";
import axios from "axios";
import Modal from "../Modal";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { useRouter } from "next/router";
import { Montserrat } from "@next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

type NewPostType = {
  isOpen: boolean;
  handleCloseModal: () => void;
};

const NewPost = ({ isOpen, handleCloseModal }: NewPostType) => {
  const [postState, setPostState] = useState("");

  const router = useRouter();

  if (!isOpen) return <></>;

  //   console.log()

  return (
    <Modal>
      <div
        className={`accent-modal-bg accent-border px-6 py-4 rounded-md xsm:w-[100%] md:w-fit`}
      >
        {/* Header */}
        <h1
          className={`${montserrat.className} font-bold accent-border-bottom pb-2 mb-4 text-xl`}
        >
          New Post
        </h1>
        {/* Post Field */}
        <textarea
          placeholder="Write a post"
          value={postState}
          onChange={(e) => setPostState(e.target.value)}
          className={`accent-textarea xsm:w-[100%] xsm:h-56 md:h-60 md:w-96 p-4`}
        />
        {/* Action Buttons */}
        <div className={`flex justify-end items-center gap-x-2`}>
          <PrimaryButton handleOnClick={() => router.reload()}>
            Post
          </PrimaryButton>
          <SecondaryButton handleOnClick={handleCloseModal}>
            Cancel
          </SecondaryButton>
        </div>
      </div>
    </Modal>
  );
};

export default NewPost;
