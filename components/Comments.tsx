import { Oval } from "react-loader-spinner";
import Image from "next/image";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { HeartIcon } from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import Modal from "./Modal";
import { PrimaryButton, SecondaryButton } from "./Buttons";
import axios from "axios";

type CommentsProps = {
  fetchingComments: boolean;
  loadingComments: boolean;
  areCommentsFetched: boolean;
  comments: any[] | null;
  refetch: () => void;
  isPost: boolean;
};

const Comments = (props: CommentsProps) => {
  const {
    fetchingComments,
    loadingComments,
    areCommentsFetched,
    comments,
    refetch,
    isPost,
  } = props;

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [currentCommentIndex, setCurrentCommentIndex] = useState(0);
  const [currentCommentValue, setCurrentCommentValue] = useState("");
  const [isUploadingComment, setIsUploadingComment] = useState(false);

  if (fetchingComments || loadingComments || !areCommentsFetched) {
    return (
      <div className="flex justify-center">
        <Oval
          height={60}
          width={60}
          color="#fff"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="tr"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    );
  }

  // let date = format(parseISO("2023-02-14T16:51:42.409Z"), "yyyy-LL-dd");

  const handleAddSubcomment = () => {
    setIsUploadingComment(true);
    if (comments)
      axios
        .post(
          `/api/posts/comments/subcomments/add`,
          {
            commentId: comments[currentCommentIndex]._id,
            commentBody: currentCommentValue,
          },
          {
            withCredentials: true,
          }
        )
        .then(async (res) => {
          console.log(res.data);
          await refetch();
          setIsUploadingComment(false);
          setCurrentCommentValue("");
        })
        .catch((err) => {
          setIsUploadingComment(false);
          console.log(err);
        });
  };

  return (
    <div className="text-primary">
      {comments && comments.length < 1 ? (
        <div className="my-10">
          <p>No comments yet! Be the first to comment.</p>
        </div>
      ) : (
        <div className="my-10">
          {comments &&
            comments.map((comment: any, i: number) => (
              <div
                key={i}
                className={`
                flex w-full
                my-4 pb-4
                accent-border-bottom
            `}
              >
                <Image
                  className={`xsm:w-10 md:w-14 aspect-square object-cover object-center rounded-full xsm:mr-2 md:mr-4 self-start`}
                  src={comment.avatar}
                  alt={comment.username}
                  height={300}
                  width={300}
                />
                <div>
                  <div className="flex gap-x-2 items-center xsm:mb-1 md:mb-2">
                    <p className="text-sm font-semibold">{comment.username}</p>
                    <p className="text-sm text-primary">
                      {/* {format(parseISO(comment.date), "yyyy-LL-dd")} */}
                      {formatDistanceToNow(new Date(comment.date), {
                        addSuffix: true,
                      })}
                      {/* {new Date(comment.date).toDateString()} */}
                    </p>
                  </div>
                  <p className="xsm:text-sm md:text-lg xsm:mb-4 lg:mb-6">
                    {comment.comment}
                  </p>
                  {/* Action Buttons */}
                  {isPost && (
                    <div className="flex xsm:gap-x-2 md:gap-x-3 text-sm items-center">
                      {/* <button className={`font-semibold text-slate-200`}>
                      <HeartIcon
                        className={`xsm:w-4 xsm:h-4 md:w-5 md:h-5 stroke-2`}
                      />
                    </button> */}
                      <button
                        className={`text-xs text-primary flex items-center`}
                        onClick={() => {
                          setCurrentCommentIndex(i);
                          setIsCommentModalOpen(true);
                        }}
                      >
                        {/* <ChatBubbleOvalLeftIcon
                        className={`xsm:w-4 xsm:h-4 md:w-5 md:h-5 stroke-2`}
                      /> */}
                        Reply
                        <span className="ml-2 font-bold">
                          {comment.subcomments.length > 0 &&
                            comment.subcomments.length}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
      {/* Comment Modal */}
      {comments && isCommentModalOpen && (
        <Modal>
          <div
            className={`
           accent-border accent-modal-bg accent-rounded p-6
           accent-width
           overflow-y-scroll accent-scrollbar max-h-[90%] my-auto
          `}
          >
            <div
              className={`
                flex
            `}
            >
              <Image
                className={`xsm:w-10 md:w-14 aspect-square object-cover object-center rounded-full xsm:mr-2 md:mr-4 self-start`}
                src={comments[currentCommentIndex].avatar}
                alt={comments[currentCommentIndex].username}
                height={300}
                width={300}
              />
              <div className="w-full">
                <div className="flex justify-between items-center xsm:mb-1 md:mb-2">
                  <div className="flex gap-x-2 items-center">
                    <p className="text-sm font-semibold">
                      {comments[currentCommentIndex].username}
                    </p>
                    <p className="text-sm text-primary">
                      {/* {format(parseISO(comment.date), "yyyy-LL-dd")} */}
                      {formatDistanceToNow(
                        new Date(comments[currentCommentIndex].date),
                        {
                          addSuffix: true,
                        }
                      )}
                      {/* {new Date(comment.date).toDateString()} */}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentCommentValue("");
                      setIsCommentModalOpen(false);
                    }}
                  >
                    <XCircleIcon
                      className={`xsm:w-6 xsm:h-6 md:w-8 md:h-8 stroke-2`}
                    />
                  </button>
                </div>
                <p className="xsm:text-sm md:text-lg xsm:mb-4 lg:mb-6">
                  {comments[currentCommentIndex].comment}
                </p>
                {/* Comment Box */}
                <div className="">
                  <textarea
                    placeholder="Reply"
                    value={currentCommentValue}
                    onChange={(e) => setCurrentCommentValue(e.target.value)}
                    className={`accent-textarea`}
                  />
                  <SecondaryButton
                    handleOnClick={handleAddSubcomment}
                    buttonClassNames={"font-semibold"}
                  >
                    {isUploadingComment ? (
                      <Oval
                        height={15}
                        width={15}
                        color="#fff"
                        visible={true}
                        ariaLabel="oval-loading"
                        secondaryColor="tr"
                        strokeWidth={4}
                        strokeWidthSecondary={4}
                      />
                    ) : (
                      <p>Reply</p>
                    )}
                  </SecondaryButton>
                </div>
                {/* Comment Box */}
                {/* Replies */}
                <div className={`xsm:mt-4 lg:mt-8`}>
                  {/* <h1
                    className={`font-semibold xsm:text-base md:text-md lg:text-lg`}
                  >
                    Replies
                  </h1> */}
                  {comments[currentCommentIndex].subcomments.length > 0 &&
                    comments[currentCommentIndex].subcomments.map(
                      (subcomment: any, i: number) => (
                        <div key={i}>
                          <div className={`flex`}>
                            <Image
                              className={`xsm:w-10 md:w-14 aspect-square object-cover object-center rounded-full xsm:mr-2 md:mr-4 self-start`}
                              src={subcomment.avatar}
                              alt={subcomment.username}
                              height={300}
                              width={300}
                            />
                            <div>
                              <div className="flex gap-x-2 items-center xsm:mb-1 md:mb-2">
                                <p className="text-sm font-semibold">
                                  {subcomment.username}
                                </p>
                                <p className="text-sm text-primary">
                                  {/* {format(parseISO(comment.date), "yyyy-LL-dd")} */}
                                  {formatDistanceToNow(
                                    new Date(subcomment.date),
                                    {
                                      addSuffix: true,
                                    }
                                  )}
                                </p>
                              </div>
                              <p className="xsm:text-sm md:text-lg xsm:mb-4 lg:mb-6">
                                {subcomment.comment}
                              </p>
                              {/* Replies */}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                </div>
                {/* Replies */}
              </div>
            </div>
          </div>
        </Modal>
      )}
      {/* Comment Modal */}
    </div>
  );
};

export default Comments;
