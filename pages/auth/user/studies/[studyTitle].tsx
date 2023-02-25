import { StudyType, LineType } from "@/models/User";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { useRouter } from "next/router";
import { Montserrat, Alegreya } from "@next/font/google";
import { useSession } from "next-auth/react";
import {
  PencilSquareIcon,
  PencilIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { Oval } from "react-loader-spinner";
import Modal from "@/components/Modal";
import { useBeforeunload } from "react-beforeunload";
import toast, { Toaster } from "react-hot-toast";

import LineBreak from "@/public/linebreak.svg";
import Image from "next/image";

// Fonts
const alegreya = Alegreya({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

const StudyTitle = () => {
  // States / hooks
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/login");
    },
  });

  //   console.log(router.query.studyTitle);
  const getStudy = async () => {
    return await axios.post(
      `/api/study/getone`,
      {
        studyTitle: router.query.studyTitle,
      },
      {
        withCredentials: true,
      }
    );
  };

  const [studyState, setStudyState] = useState<StudyType | null>(null);
  const [notesState, setNotesState] = useState("");
  const [linesState, setLinesState] = useState<LineType[] | null>(null);
  const [linesModalState, setLinesModalState] = useState({
    isOpen: false,
    lineIndex: 0,
  });
  const [currentLineState, setCurrentLineState] = useState("");
  const [isRefetchingStudies, setIsRefetchingStudies] = useState(false);
  //   const [linesState, setLinesState] = useState(studies[0].lines);

  const {
    data: studyRes,
    isLoading: loadingStudies,
    refetch: refetchStudies,
  } = useQuery(`user-study-${router.query.studyTitle}`, getStudy, {
    refetchOnWindowFocus: false,
  });

  useBeforeunload((event: any) => {
    if (studyState?.lines === linesState && studyState?.notes === notesState) {
      event.preventDefault();
    }
  });

  useEffect(() => {
    if (!studyRes?.data) return;
    if (studyRes?.data.studies) {
      setStudyState(studyRes?.data.studies[0]);
      setNotesState(studyRes?.data.studies[0].notes);
      setLinesState(studyRes?.data.studies[0].lines);
    }
    // console.log("studyRes", studyRes);
  }, [studyRes]);

  useEffect(() => {
    // console.log("studyState", studyState);
    if (studyState && linesState) {
      console.log(
        studyState.lines === linesState && studyState.notes === notesState
      );
    }
    // console.log(notesState);
  }, [studyState, linesState, notesState, isRefetchingStudies]);

  if (loadingStudies || status === "loading" || isRefetchingStudies) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Oval
          height={80}
          width={80}
          color="#fff"
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="tr"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    );
  }

  if (studyRes?.data.status === "err") {
    return (
      <div className="min-h-screen flex flex-col items-center px-6">
        <h1
          className={`${montserrat.className} mt-32 font-bold text-primary
            my-6 text-center xsm:text-2xl md:text-4xl
          `}
        >
          {studyRes.data.message}
        </h1>
        <PrimaryButton handleOnClick={() => router.push("/")}>
          Go Back To Studies
        </PrimaryButton>
      </div>
    );
  }

  const handleLinesUpdate = (i: number) => {
    let newLineState: any = [];
    if (linesState) newLineState = [...linesState];
    newLineState[i].comment = currentLineState;
    setLinesState(newLineState);

    // console.log("jhello");
    setLinesModalState({ ...linesModalState, isOpen: false });
  };

  const handleSave = () => {
    if (studyState?.lines === linesState && studyState?.notes === notesState) {
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
              You have not made any changes!
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
      // create a new obj -> StudyState + LinesState + NotesState
      let payloadObject = {
        ...studyState,
        notes: notesState,
        lines: linesState,
      };

      // Set isRefetchingStudies to true and make the call after we get +ve status
      setIsRefetchingStudies(true);

      let payload = JSON.stringify(payloadObject);

      axios
        .patch(
          `/api/study/getone`,
          {
            payload,
          },
          {
            withCredentials: true,
          }
        )
        .then(async (res) => {
          if (res.data.status === "ok") {
            await refetchStudies();
            setIsRefetchingStudies(false);
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
                    Updated the study.
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
          } else if (res.data.status === "err") {
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
                    Could not update the study. Try again!
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
        .catch((err) => console.log(err));
    }
  };

  return (
    <div>
      {/* Study Container ============ */}
      <div
        className={`
    xsm:w-[90%] md:w-[80%] 
    mx-auto flex flex-col items-center mb-32 z-30 accent-rounded text-primary
    xsm:mt-10 md-16 lg:mt-24 min-h-screen
    `}
      >
        <h1
          className={`${alegreya.className} font-bold mt-8
              xsm:text-[2em] md:text-[3em] lg:text-[4em] text-center
              `}
        >
          {studyState?.title}
        </h1>
        <Link
          href={`/authors/${studyState?.author}`}
          className={`text-primary italic text-center mb-2`}
        >
          {" "}
          by {studyState?.author}
        </Link>
        <Image
          className="w-40 mb-10"
          src={LineBreak}
          alt={"linebreak"}
          height={300}
          width={300}
        />

        {/* Lines ==================*/}
        <div className="w-full">
          {linesState?.map((line: any, i: number) => (
            <div
              key={i}
              className={`md:flex space-x-3 justify-between items-center mb-2
                xsm:text-sm md:text-md lg:text-lg
                accent-border-bottom pb-2
                ${montserrat.className}
            `}
            >
              <p className={`p-2 basis-1/2 `}>{line.line}</p>
              <button
                className={`
                accent-modal-bg p-2 rounded-md
                flex space-x-2 justify-between items-center
                basis-1/2
              `}
                onClick={function () {
                  setCurrentLineState(line.comment);
                  setLinesModalState({
                    isOpen: true,
                    lineIndex: i,
                  });
                }}
              >
                <p className="text-md text-left">
                  {line.comment === "" ? "Add Comment" : line.comment}
                </p>
                {line.comment === "" && (
                  <PencilSquareIcon className="xsm:w-4 xsm:h-4 md:w-5 md:h-5" />
                )}
              </button>
            </div>
          ))}
        </div>
        {/* Lines Modal */}
        {linesModalState.isOpen && (
          <Modal>
            <div
              className={`text-primary p-4 accent-modal-bg accent-border accent-rounded`}
            >
              {/* Header + Action */}
              <div
                className={`flex justify-between items-center accent-border-bottom mb-2 pb-2`}
              >
                <h1 className={`${montserrat.className} font-semibold`}>
                  Update Comment
                </h1>
                <button
                  onClick={() => handleLinesUpdate(linesModalState.lineIndex)}
                >
                  <XCircleIcon className="xsm:w-4 xsm:h-4 md:w-5 md:h-5" />
                </button>
              </div>
              {/* Updation */}
              <div>
                <p
                  className={`${montserrat.className} xsm:text-sm sm:text-md md:text-lg md:p-2`}
                >
                  &rdquo;
                  {linesState && linesState[linesModalState.lineIndex].line}
                  &rdquo;
                </p>
                <textarea
                  value={currentLineState}
                  spellCheck="false"
                  onChange={(e) => setCurrentLineState(e.target.value)}
                  className={`
                    my-4
                    accent-textarea 
                    p-2 w-full
                    xsm:h-40 md:h-32
                `}
                />
              </div>
              {/* ActionButton */}
              <div className="flex justify-end space-x-2">
                <PrimaryButton
                  handleOnClick={() =>
                    handleLinesUpdate(linesModalState.lineIndex)
                  }
                >
                  Add & Close
                </PrimaryButton>
                <SecondaryButton
                  handleOnClick={() =>
                    setLinesModalState({ ...linesModalState, isOpen: false })
                  }
                >
                  Cancel
                </SecondaryButton>
              </div>
            </div>
          </Modal>
        )}
        {/* Lines Modal */}
        {/* Lines ================*/}
        {/* Notes */}
        <div
          className={`text-primary ${montserrat.className} self-start w-full mt-14`}
        >
          <div className={`accent-border-bottom flex space-x-2 items-center`}>
            <h1 className="xsm:text-lg md:text-xl font-bold ">Notes</h1>
            <PencilIcon className="xsm:w-4 xsm:h-4 md:w-5 md:h-5" />
          </div>
          <textarea
            value={notesState === "" ? "No notes!" : notesState}
            spellCheck="false"
            onChange={(e) => setNotesState(e.target.value)}
            className={`
                my-4
                bg-inherit text-primary 
                xsm:text-sm md:text-lg font-semibold
                placeholder:text-primary 
                accent-border focus:outline-none accent-rounded
                p-2 w-full
                h-60
            `}
          />
        </div>
        {/* Notes */}
        <PrimaryButton handleOnClick={handleSave} buttonClassNames={`text-xl`}>
          Save
        </PrimaryButton>
      </div>
      {/* Study Container ============ */}
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
};

export default StudyTitle;
