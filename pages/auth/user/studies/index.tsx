import axios from "axios";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Montserrat } from "@next/font/google";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { PrimaryButton } from "@/components/Buttons";
import { format, parseISO } from "date-fns";

const montserrat = Montserrat({ subsets: ["latin"] });

const getStudies = async () => {
  return await axios.get(`/api/study/getmeta`, {
    withCredentials: true,
  });
};

const Studies = () => {
  const [studiesState, setStudiesState] = useState(null);
  const [studiesLength, setStudiesLength] = useState<number | null>(null);
  const [isRefetchingStudies, setIsRefetchingStudies] = useState(false);
  const {
    data: studiesRes,
    isRefetching: refetchingStudies,
    isLoading: loadingStudies,
    refetch: refetchStudies,
  } = useQuery(`user-studies-meta`, getStudies, {
    refetchOnWindowFocus: false,
  });
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/login");
    },
  });

  // Side effects
  useEffect(() => {
    if (studiesRes?.data) {
      setStudiesState(studiesRes.data.studies);
      setStudiesLength(studiesRes.data.studiesLength);
    }
  }, [studiesRes]);

  // States
  useEffect(() => {}, [studiesState, studiesLength]);

  const handleDeleteStudy = (studyTitle: string) => {
    // console.log(studyTitle);
    setIsRefetchingStudies(true);
    axios
      .patch(
        `/api/study/delete`,
        {
          studyTitle,
        },
        {
          withCredentials: true,
        }
      )
      .then(async (res) => {
        console.log(res.data);
        if (res.data.status === "ok") {
          await refetchStudies();
          setIsRefetchingStudies(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (
    status === "loading" ||
    loadingStudies ||
    refetchingStudies ||
    isRefetchingStudies
  ) {
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

  return (
    <div className="min-h-screen xsm:w-[90%] md:w-[80%] text-white mx-auto mt-10">
      <h1
        className={`${montserrat.className} text-3xl font-bold pb-2 mb-2 accent-border-bottom`}
      >
        Studies
      </h1>
      {studiesLength && studiesLength > 0 ? (
        // @ts-ignore
        studiesState?.map((study: any, i: number) => (
          <div
            key={i}
            className={`
                    accent-border
                    bg-rose-100 bg-opacity-20 rounded-xl
                    my-4 p-4 pb-2 shadow-2xl
                `}
          >
            {/* Study title */}
            <div className="flex justify-between items-center mb-2 pb-2 accent-border-bottom">
              <h1 className="xsm:text-md md:text-lg font-bold">
                {study.title}
              </h1>
              <button onClick={() => handleDeleteStudy(study.title)}>
                <XCircleIcon
                  className={`xsm:w-4 xsm:h-4 md:w-5 md:h-5 text-white`}
                />
              </button>
            </div>
            {/* Study title */}
            {/* Content */}
            <div className="accent-border-bottom pb-2 mb-2">
              <p>
                <span className="font-bold bg-white bg-opacity-40 p-1 m-1 rounded-md">
                  Notes:{" "}
                </span>
                {study.notes === "" ? "No Notes Written Yet" : study.notes}
              </p>
            </div>
            {/* Content */}
            {/* Action buttons */}
            <div className="flex justify-between py-2">
              <p>
                {" "}
                <span className="slate-300 italic">Last updated at:</span>{" "}
                {new Date(study.lastUpdatedAt).toDateString()}
                {/* {format(parseISO(study.lastUpdatedAt), "yyyy-LL-dd")} */}
              </p>
              <PrimaryButton
                handleOnClick={() => router.push(`studies/${study.title}`)}
              >
                Study
              </PrimaryButton>
            </div>
            {/* Action buttons */}
          </div>
        ))
      ) : (
        <p>No studies</p>
      )}
    </div>
  );
};

export default Studies;
