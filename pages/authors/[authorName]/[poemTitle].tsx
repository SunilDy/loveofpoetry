import Head from "next/head";
import { Alegreya, Montserrat } from "@next/font/google";
import Image from "next/image";
import Link from "next/link";
import LineBreak from "@/public/linebreak.svg";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import Comments from "@/components/Comments";
import PlaceHolder from "@/public/placeholder/ph2.png";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import toast, { Toaster } from "react-hot-toast";
import Modal from "@/components/Modal";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Oval } from "react-loader-spinner";
import connectMongo from "@/lib/connectMongo";
import Author from "@/models/Author";
import Title from "@/models/Title";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const alegreya = Alegreya({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

export default function Home(props: any) {
  let title = JSON.parse(props.title);
  let author = JSON.parse(props.author);

  // const { title, author } = props;

  const getComments = async () => {
    return await axios.post("/api/comment/get", {
      title: title.title,
    });
  };

  const getCollectionNames = async () => {
    return await axios.get("/api/collection/get", {
      withCredentials: true,
    });
  };

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCollectionValue, setNewCollectionValue] = useState("");
  const [isAddingToCollection, setisAddingToCollection] = useState(false);
  const [isUpdatingStudies, setIsUpdatingStudies] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState("Favorite");
  const [collectionsState, setCollectionsState] = useState([
    {
      name: "Favorite",
      titles: [],
    },
  ]);

  const { data: session } = useSession();
  const router = useRouter();

  const {
    data: commentsRes,
    isLoading: loadingComments,
    isFetching: fetchingComments,
    isFetched: areCommentsFetched,
    refetch: refetchComments,
    isRefetching: isRefetchingComments,
  } = useQuery(`comments-${title.title}`, getComments, {
    refetchOnWindowFocus: true,
  });

  const { data: collectionsRes } = useQuery(`collections`, getCollectionNames, {
    refetchOnWindowFocus: true,
  });

  // Side Effects
  useEffect(() => {
    if (commentsRes?.data.poem) {
      if (commentsRes.data.poem.comments.length < 1) {
        setComments(null);
      } else {
        setComments(commentsRes.data.poem.comments);
      }
    }

    if (collectionsRes?.data) {
      let collection = collectionsRes.data.collections.map(
        (collection: any) => collection.name
      );
      // console.log(collection);
      setCollectionsState(collection);
    }
  }, [commentsRes, collectionsRes]);

  // States
  useEffect(() => {}, [
    newCollectionValue,
    selectedCollection,
    collectionsState,
    comments,
  ]);

  const handleAddComment = async () => {
    if (session?.user) {
      await axios.post(
        "/api/comment/add",
        {
          comment,
          poemName: title.title,
        },
        {
          withCredentials: true,
        }
      );
      await refetchComments();
    } else {
      router.push("/auth/login");
    }
  };

  const handleLikePoem = async () => {
    if (session?.user) {
      axios
        .post(
          "/api/poem/like",
          {
            poemTitle: title.title,
            author: author.name,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.data.message === "updated") {
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
                    Poem added to your your liked-list!
                  </h1>
                </div>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="xsm:w-4 xsm:h-4 lg:w-6 lg:h-6 xsm:mx-1 lg:mx-2 cursor-pointer"
                    onClick={() => toast.dismiss(t.id)}
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            ));
          } else if (res.data.message === "exists") {
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
                    Poem is already in your list of liked poems!
                  </h1>
                </div>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="xsm:w-4 xsm:h-4 lg:w-6 lg:h-6 xsm:mx-1 lg:mx-2 cursor-pointer"
                    onClick={() => toast.dismiss(t.id)}
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            ));
          }
        })
        .catch((err) => console.log("smth went wrong"));
    } else {
      router.push("/auth/login");
    }
  };

  const handleAddToCollection = async () => {
    setisAddingToCollection(true);
    let collectionName = "";
    if (newCollectionValue.length < 1) collectionName = selectedCollection;
    else collectionName = newCollectionValue;

    if (session?.user) {
      axios
        .post(
          `/api/collection/add`,
          {
            poemTitle: title.title,
            collectionName,
            author: author.name,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.data.status === "ok") {
            setisAddingToCollection(false);
            setIsModalOpen(!isModalOpen);
            if (res.data.poemAlreadyInList) {
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
                      Poem is already in the collection!
                    </h1>
                  </div>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="xsm:w-4 xsm:h-4 lg:w-6 lg:h-6 xsm:mx-1 lg:mx-2 cursor-pointer"
                      onClick={() => toast.dismiss(t.id)}
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              ));
            } else {
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
                      Poem added to your collection.
                    </h1>
                  </div>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="xsm:w-4 xsm:h-4 lg:w-6 lg:h-6 xsm:mx-1 lg:mx-2 cursor-pointer"
                      onClick={() => toast.dismiss(t.id)}
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              ));
            }
          }
          setNewCollectionValue("");
        })
        .catch((err) => console.log(err));
    } else {
      router.push("/auth/login");
    }
  };

  const handleAddToStudy = () => {
    setIsUpdatingStudies(true);
    if (session?.user) {
      axios
        .post(
          `/api/study/add`,
          {
            title: title.title,
            author: title.author,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.data.status === "ok") {
            setIsUpdatingStudies(false);
            if (res.data.alreadyExists) {
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
                      Poem is already in your studies!
                    </h1>
                  </div>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="xsm:w-4 xsm:h-4 lg:w-6 lg:h-6 xsm:mx-1 lg:mx-2 cursor-pointer"
                      onClick={() => toast.dismiss(t.id)}
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              ));
            } else if (!res.data.alreadyExists) {
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
                      Poem added to your studies.
                    </h1>
                  </div>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="xsm:w-4 xsm:h-4 lg:w-6 lg:h-6 xsm:mx-1 lg:mx-2 cursor-pointer"
                      onClick={() => toast.dismiss(t.id)}
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              ));
            }
          }
        })
        .catch((err) => console.log(err));
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <>
      <Head>
        <title>{title.title}</title>
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
              xsm:text-[2em] md:text-[3em] lg:text-[4em] text-center
              `}
            >
              {title.title}
            </h1>
            <Image
              className="w-40 mb-10"
              src={LineBreak}
              alt={author.name}
              height={300}
              width={300}
            />
            <div className="bg-rose-100 border-2 border-slate-100 border-opacity-40 bg-opacity-20 mx-auto flex flex-col items-center  z-30 rounded-xl shadow-2xl w-full py-10 xsm:px-6 md:px-10">
              {/* <p className="italic font-xs slate-600 mb-4">
                By: {poem[0].author}
              </p> */}
              {title.lines.map((line: string, i: number) => (
                <p
                  className={`${alegreya.className} 
                xsm:text-md md:text-lg lg:text-xl text-center 
                mb-3`}
                  key={i}
                >
                  {line}
                </p>
              ))}
              <Image
                className="w-40 my-10"
                src={LineBreak}
                alt={"linebreak"}
                height={300}
                width={300}
              />
              {/* Buttons */}
              <div className="flex gap-x-4 mb-10">
                <SecondaryButton handleOnClick={handleLikePoem}>
                  Like
                </SecondaryButton>
                <SecondaryButton
                  handleOnClick={() => setIsModalOpen(!isModalOpen)}
                >
                  Add To Collection
                </SecondaryButton>
                <PrimaryButton handleOnClick={handleAddToStudy}>
                  {isUpdatingStudies ? (
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
                    <p>Add To Study</p>
                  )}
                </PrimaryButton>
              </div>
              {/* Add to collection MODAL */}
              {isModalOpen && (
                <Modal>
                  <div
                    className={`
                    rounded-xl text-white
                    bg-rose-100 border-2 border-slate-100 border-opacity-40 bg-opacity-20 shadow-2xl
                    p-4 w-fit
                  `}
                  >
                    {/* Header */}
                    <div className="border-b-2 border-white border-opacity-40 mb-4">
                      <h1 className="xsm:text-sm md:text-md lg:text-lg mb-2 font-bold">
                        Add To Collection
                      </h1>
                    </div>
                    {/* Dropdown */}
                    <div className="sm:flex justify-between items-center mb-4 gap-x-2">
                      <h1 className="basis-1/3">Collection:</h1>
                      <Menu
                        as="div"
                        className="relative inline-block text-left w-full basis-2/3"
                      >
                        <div>
                          <Menu.Button
                            className={`inline-flex justify-between rounded-md 
                          border-2 border-white border-opacity-40 w-full
                          bg-transparent focus:outline-none
                          px-4 py-1 text-sm font-medium 
                          text-white shadow-sm
                          `}
                          >
                            {selectedCollection || "Options"}
                            <ChevronDownIcon
                              className="-mr-1 ml-2 h-5 w-5"
                              aria-hidden="true"
                            />
                          </Menu.Button>
                        </div>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              {collectionsState.map(
                                (collection: any, i: number) => (
                                  <Menu.Item key={i}>
                                    {({ active }) => (
                                      <button
                                        className={classNames(
                                          active
                                            ? "bg-slate-200 bg-opacity-60 text-[hotpink]"
                                            : "text-[hotpink]",
                                          "block px-4 py-2 text-sm w-full text-left"
                                        )}
                                        onClick={() =>
                                          setSelectedCollection(collection)
                                        }
                                      >
                                        {collection}
                                      </button>
                                    )}
                                  </Menu.Item>
                                )
                              )}
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                    {/* New Collection */}
                    <div className="sm:flex justify-between items-center mb-4 gap-x-2">
                      <h1 className="basis-1/3">New Collection:</h1>
                      <input
                        placeholder="Name of new collection"
                        value={newCollectionValue}
                        onChange={(e) => setNewCollectionValue(e.target.value)}
                        className={`
                      xsm:py-1 md:py-2 px-4
                      border-2 border-white border-opacity-40 rounded-md outline-none
                      text-sm
                      bg-transparent
                      text-white placeholder:text-white
                      ${montserrat.className}
                      basis-2/3
                    `}
                      />
                    </div>
                    {/* Buttons*/}
                    <div className="flex justify-end items-center mb-4 gap-x-2">
                      <PrimaryButton
                        handleOnClick={handleAddToCollection}
                        buttonClassNames={`font-semibold px-4`}
                      >
                        {isAddingToCollection ? (
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
                          <p>Add</p>
                        )}
                      </PrimaryButton>
                      <SecondaryButton
                        handleOnClick={function () {
                          setIsModalOpen(!isModalOpen);
                          setNewCollectionValue("");
                        }}
                      >
                        Close
                      </SecondaryButton>
                    </div>
                    {/* Buttons*/}
                  </div>
                </Modal>
              )}
              {/* Add to collection MODAL */}

              {/* Buttons */}
              {/* Author Details ===========*/}
              <div
                className={`my-10 mx-auto
              xsm:w-[90%] md:w-[80%]
              `}
              >
                {/* Author Image */}
                <div className="flex mb-4 pb-4 border-b-2 border-slate-200 border-opacity-25">
                  {author.images.thumbnail !== "" ? (
                    <Image
                      className="xsm:w-14 lg:w-20 aspect-square object-cover object-center rounded-full mr-4 self-start"
                      src={author.images.thumbnail}
                      alt={author.name}
                      height={300}
                      width={300}
                    />
                  ) : (
                    <Image
                      className="xsm:w-14 lg:w-20 aspect-square object-cover object-center rounded-full mr-4 self-start"
                      src={PlaceHolder}
                      alt={author.name}
                      height={300}
                      width={300}
                    />
                  )}
                  <div>
                    <p
                      className={`${alegreya.className} text-md underline underline-offset-4 decoration-white
                      xsm:text-sm md:text-lg lg:text-lg
                      `}
                    >
                      {author.name}
                    </p>
                    <p
                      className={`${alegreya.className} xsm:text-sm md:text-md lg:text-lg`}
                    >
                      {author.description}
                    </p>
                    <Link href={`/authors/${author.name}`}>
                      <p
                        className={`${alegreya.className} xsm:text-sm md:text-md lg:text-lg flex items-center`}
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
                  <p className={`${alegreya.className} xsm:text-sm md:text-xl`}>
                    {author.about}
                  </p>
                </div>
              </div>
              {/* Author Details ===========*/}
              <PrimaryButton handleOnClick={() => router.back()}>
                Go Back
              </PrimaryButton>
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
              placeholder="Comment please 😇"
              className={`
                bg-inherit text-white 
                xsm:text-sm md:text-lg lg:text-xl font-semibold
                placeholder:text-white 
                border-2 border-white focus:outline-none border-opacity-60 rounded-md 
                p-2 w-full
                `}
            />
            <PrimaryButton
              handleOnClick={handleAddComment}
              isDisabled={isRefetchingComments || comment.length < 1}
            >
              Comment
            </PrimaryButton>
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
        <Toaster position="bottom-center" reverseOrder={false} />
      </main>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  let { params } = context;

  console.log("CONNECTING TO MONGO");
  await connectMongo();
  console.log("CONNECTED TO MONGO");

  let author = await Author.findOne({ name: params.authorName });
  let title = await Title.findOne({
    title: params.poemTitle,
    author: params.authorName,
  });

  return {
    props: {
      title: JSON.stringify(title),
      author: JSON.stringify(author),
    },
  };
};
