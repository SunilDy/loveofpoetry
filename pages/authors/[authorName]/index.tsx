import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import LineBreak from "@/public/linebreak.svg";
import { Alegreya } from "@next/font/google";
import PlaceHolder from "@/public/placeholder/ph2.png";
import { PrimaryButton } from "@/components/Buttons";
import { useRouter } from "next/router";
import Author from "@/models/Author";
import connectMongo from "@/lib/connectMongo";

const alegreya = Alegreya({ subsets: ["latin"] });

export default function Home({ responseObject }: any) {
  const author = JSON.parse(responseObject.author);

  const router = useRouter();
  return (
    <>
      <Head>
        <title>{author.name}</title>
        <meta
          name="description"
          content="Discover, Browse or Study from our endless collection of classical poetry right from the period of Renaissance and of The Romantics from our site. We got you all covered."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#F472B6" />
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow" />
        {/* Gives a general age rating based on the document's content */}
        <meta name="rating" content="General" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div
          className={`
            accent-width
            mx-auto flex flex-col items-center mb-32 z-30 accent-rounded text-primary
            xsm:mt-10 md-16 lg:mt-24 h-auto
            `}
        >
          {/* Author name and Linebreak ======= */}
          <h1
            className={`${alegreya.className} font-bold mt-8 mb-2
              xsm:text-[2em] md:text-[3em] lg:text-[4em]
              `}
          >
            {author.name}
          </h1>
          <Image
            className="w-40 mb-10"
            src={LineBreak}
            alt={"linebreak"}
            height={300}
            width={300}
          />
          {/* Author name and Linebreak ======= */}

          <div
            className={`accent-modal-bg accent-border z-30 accent-rounded accent-shadow w-full
            md:flex items-center h-auto p-10
        `}
          >
            {/* Author Image */}
            <div className="m-10 flex-justify">
              {author.images.poster !== "" ? (
                <div className="grid grid-cols-1 grid-rows-1">
                  <div className="z-40 col-span-full row-span-full accent-border accent-rounded xsm:w-40 sm:w-60 md:w-40 h-full"></div>
                  <Image
                    src={author.images.poster}
                    alt={author.name}
                    height={800}
                    width={800}
                    className={`z-50 xsm:w-40 sm:w-60 md:w-40 rounded-xl col-span-full row-span-full 
                    hover:translate-x-0 hover:translate-y-0 -translate-x-5 -translate-y-5
                    transition-transform
                    `}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 grid-rows-1">
                  <div className="z-40 col-span-full row-span-full accent-border rounded-xl xsm:w-40 sm:w-60 md:w-40 h-full"></div>
                  <Image
                    src={PlaceHolder}
                    alt={author.name}
                    height={800}
                    width={800}
                    className={`z-50 xsm:w-40 sm:w-60 md:w-40 accent-rounded col-span-full row-span-full 
                    hover:translate-x-0 hover:translate-y-0 -translate-x-5 -translate-y-5
                    transition-transform
                    `}
                  />
                </div>
              )}
            </div>
            {/* Author Image =======*/}
            {/* Author Details */}
            <div className="flex-1">
              <p className="italic mb-4 font-semibold">{author.description}</p>
              <p
                className={`${alegreya.className} 
                xsm:text-md md:text-lg lg:text-xl 
                mb-1`}
              >
                {author.about}
              </p>
            </div>
            {/* Author Details ======*/}
          </div>
          {/* Poems */}
          <div className="mt-10 self-start">
            <h1 className="text-xl font-bold underline underline-offset-4 mb-4">
              Poems By The Author
            </h1>
            {author.titles.map((title: any, i: number) => (
              <Link href={`${author.name}/${title}`} key={i}>
                <p className={`font-semibold`}>{title}</p>
              </Link>
            ))}
            <PrimaryButton
              handleOnClick={() => router.back()}
              classNames={`mt-4`}
            >
              Go Back
            </PrimaryButton>
          </div>
        </div>
      </main>
    </>
  );
}

// export const getStaticPaths = async () => {
//   console.log("CONNECTING TO MONGO");
//   await connectMongo();
//   console.log("CONNECTED TO MONGO");
//   let authors = await Author.find({});

//   let pathNames = authors.map((author: any) => {
//     return {
//       params: {
//         authorName: author.name,
//       },
//     };
//   });

//   return {
//     paths: pathNames,
//     fallback: false,
//   };
// };

export const getServerSideProps = async (context: any) => {
  let { params } = context;

  console.log("CONNECTING TO MONGO");
  await connectMongo();
  console.log("CONNECTED TO MONGO");
  let author = await Author.findOne({ name: params.authorName });

  let responseObject = {};
  if (!author)
    responseObject = {
      message: "The Author By The Name Could Not Be Found!",
      status: "err",
    };
  else
    responseObject = {
      status: "ok",
      author: JSON.stringify(author),
    };

  return {
    props: {
      responseObject,
    },
  };
};
