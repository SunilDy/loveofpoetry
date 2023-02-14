import { Oval } from "react-loader-spinner";
import Image from "next/image";
import { format, parseISO } from "date-fns";

type CommentsProps = {
  fetchingComments: boolean;
  loadingComments: boolean;
  areCommentsFetched: boolean;
  comments: string[] | null;
};

const Comments = (props: CommentsProps) => {
  const { fetchingComments, loadingComments, areCommentsFetched, comments } =
    props;

  if (fetchingComments || loadingComments || !areCommentsFetched) {
    return (
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
    );
  }

  console.log(comments);
  //   if (comments) {
  // let date = format(comments[0]?.date, "yyyy-MM-dd");
  let date = format(parseISO("2023-02-14T16:51:42.409Z"), "yyyy-LL-dd");
  console.log(date);
  //   }

  return (
    <>
      {!comments ? (
        <p>No comments yet! Be the first to comment.</p>
      ) : (
        <div>
          {comments.map((comment: any, i: number) => (
            <div
              key={i}
              className={`
                flex w-full
                my-4 pb-4
                border-b-2 border-white border-opacity-30
            `}
            >
              <Image
                className="w-16 aspect-square object-cover object-center rounded-full mr-4 self-start"
                src={comment.avatar}
                alt={comment.username}
                height={300}
                width={300}
              />
              <div>
                <p className="text-sm text-slate-200">{comment.username}</p>
                <p className="text-sm text-slate-200 mb-2">
                  {format(parseISO(comment.date), "yyyy-LL-dd")}
                </p>
                <p className="text-md">{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Comments;
