import Head from "next/head";
import { Alegreya } from "@next/font/google";
import Image from "next/image";
import Link from "next/link";
import LineBreak from "@/public/linebreak.svg";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import Comments from "@/components/Comments";

const alegreya = Alegreya({ subsets: ["latin"] });

export default function Home({ poem, poemName, authorData }: any) {
  //   console.log(authorData.thumbnail.source);

  const getComments = async () => {
    return await axios.post("/api/comment/get", {
      poemName,
    });
  };

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(null);
  const { data: session } = useSession();
  const router = useRouter();

  const {
    data: commentsRes,
    isLoading: loadingComments,
    isFetching: fetchingComments,
    isFetched: areCommentsFetched,
    refetch: refetchComments,
  } = useQuery(`comments-${poemName}`, getComments, {
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    // console.log("comments", comments);
    if (commentsRes?.data.poem) {
      if (commentsRes.data.poem.comments.length < 1) {
        setComments(null);
      } else {
        setComments(commentsRes.data.poem.comments);
      }
    }
    // console.log("comments", comments);
    // console.log("length", comments.length);
  }, [commentsRes, comments]);

  const handleAddComment = async () => {
    if (session?.user) {
      await axios.post(
        "/api/comment/add",
        {
          comment,
          poemName,
        },
        {
          withCredentials: true,
        }
      );
      await refetchComments();
    } else {
      router.push("/login");
    }
  };

  return (
    <>
      <Head>
        <title>{poemName}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        {/* Container Grid */}
        <div className="">
          {/* Poem Container ====================*/}
          <div
            className={`
            xsm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] 
            mx-auto flex flex-col items-center mb-32 z-30 rounded-xl text-white
            xsm:mt-10 md-16 lg:mt-24
            `}
          >
            <h1
              className={`${alegreya.className} font-bold mt-8 mb-2
              xsm:text-[2em] md:text-[3em] lg:text-[4em]
              `}
            >
              {poemName}
            </h1>
            <Image
              className="w-40 mb-10"
              src={LineBreak}
              alt={authorData.title}
              height={300}
              width={300}
            />
            <div className="bg-rose-100 border-2 border-slate-100 border-opacity-40 bg-opacity-20 mx-auto flex flex-col items-center  z-30 rounded-xl shadow-2xl w-full py-10 xsm:px-6 md:px-10">
              {/* <p className="italic font-xs slate-600 mb-4">
                By: {poem[0].author}
              </p> */}
              {poem[0].lines.map((line: string, i: number) => (
                <p
                  className={`${alegreya.className} 
                xsm:text-md md:text-lg lg:text-xl 
                mb-1`}
                  key={i}
                >
                  {line}
                </p>
              ))}
              <Image
                className="w-40 my-10"
                src={LineBreak}
                alt={authorData.title}
                height={300}
                width={300}
              />
              {/* Author Details ===========*/}
              <div
                className={`my-10 mx-auto
              xsm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%]
              `}
              >
                {/* Author Image */}
                <div className="flex mb-4 pb-4 border-b-2 border-slate-200 border-opacity-25">
                  {authorData.thumbnail ? (
                    <Image
                      className="xsm:w-14 lg:w-20 aspect-square object-cover object-center rounded-full mr-4 self-start"
                      src={authorData.thumbnail.source}
                      alt={authorData.title}
                      height={300}
                      width={300}
                    />
                  ) : (
                    <p>No Image</p>
                  )}
                  <div>
                    <p
                      className={`${alegreya.className} text-md underline underline-offset-4 decoration-white`}
                    >
                      {authorData.title}
                    </p>
                    <p className={`${alegreya.className} text-md`}>
                      {authorData.description}
                    </p>
                    <Link href={`/authors/${authorData.title}`}>
                      <p
                        className={`${alegreya.className} text-md flex items-center`}
                      >
                        See more works
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4 ml-1"
                        >
                          <path
                            fillRule="evenodd"
                            d="M15.75 2.25H21a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V4.81L8.03 17.03a.75.75 0 01-1.06-1.06L19.19 3.75h-3.44a.75.75 0 010-1.5zm-10.5 4.5a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V10.5a.75.75 0 011.5 0v8.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V8.25a3 3 0 013-3h8.25a.75.75 0 010 1.5H5.25z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </p>
                    </Link>
                  </div>
                </div>
                {/* Author extract */}
                <div className="">
                  <p className={`${alegreya.className} text-md`}>
                    {authorData.extract}
                  </p>
                </div>
              </div>
              {/* Author Details ===========*/}
            </div>
          </div>

          {/* Poem Container Ends ==============*/}
        </div>

        {/* Comments Section =================*/}
        <div
          className={`
          bg-rose-100 border-2 border-slate-100 border-opacity-40 bg-opacity-20 flex flex-col items-center z-30 rounded-xl shadow-2xl text-white
          mx-auto py-10 px-10 my-20
          xsm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%]
          `}
        >
          {/* Add Comment */}
          <div className="self-start w-full">
            <h1 className="text-lg my-4 font-bold">ADD COMMENTS</h1>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comment please 😃"
              className={`
                bg-inherit text-white 
                xsm:text-sm md:text-lg lg:text-xl font-semibold
                placeholder:text-white 
                border-2 border-white focus:outline-none border-opacity-60 rounded-md 
                p-2 w-full
                `}
            />
            <button
              className={`
              bg-white text-purple-500
              px-2 p-1 rounded-md
              hover:scale-95
              transition-transform
            `}
              onClick={handleAddComment}
            >
              Comment
            </button>
          </div>

          {/* Comments */}
          <div className="my-10 text-white w-full">
            <Comments
              areCommentsFetched={areCommentsFetched}
              fetchingComments={fetchingComments}
              loadingComments={loadingComments}
              comments={comments}
            />
          </div>
        </div>
        {/* Comments Section =================*/}
      </main>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  let { params } = context;

  let poem = await axios.get(`https://poetrydb.org/title/${params.poemTitle}`);
  let authorData = await axios.get(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${params.authorName}`
  );

  return {
    props: {
      poem: poem.data,
      poemName: params.poemTitle,
      authorData: authorData.data,
    },
  };
};
