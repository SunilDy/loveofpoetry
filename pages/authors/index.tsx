import Head from "next/head";
import { Inter } from "@next/font/google";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Montserrat } from "@next/font/google";
import { useRouter } from "next/router";
import { PrimaryButton } from "@/components/Buttons";
import Author from "@/models/Author";
import connectMongo from "@/lib/connectMongo";

const montserrat = Montserrat({ subsets: ["latin"] });

const inter = Inter({ subsets: ["latin"] });

type NameBlock = {
  alphabet: string;
  matchingNames: string[];
};

export default function Home({ nameBlocks }: any) {
  const [searchValue, setSearchValue] = useState("");
  const [nameBlocksState, setNameBlocksState] = useState(nameBlocks);
  const router = useRouter();

  useEffect(() => {
    if (searchValue.length < 1) {
      setNameBlocksState(nameBlocks);
    }
    // console.log(nameBlocksState);
  }, [nameBlocksState, searchValue, nameBlocks]);

  // console.log(nameBlocks);

  const handleSearchChange = (e: any) => {
    setSearchValue(e.target.value);

    let updatedNameBlockState = nameBlocks
      .map((nameBlock: any) => {
        const matchingNames = nameBlock.matchingNames.filter(
          (matchingName: string) => {
            return matchingName
              .toLowerCase()
              .includes(searchValue.toLowerCase());
          }
        );
        if (matchingNames.length > 0) {
          return { alphabet: nameBlock.alphabet, matchingNames };
        } else {
          return null;
        }
      })
      .filter(Boolean);

    setNameBlocksState(updatedNameBlockState);
  };

  return (
    <>
      <Head>
        <title>Authors</title>
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
      <main className="m-6 text-primary min-h-screen">
        {/* Search block =========== */}

        <div className="flex justify-center items-center w-full xsm:my-10 md:my-14 lg:my-20">
          <input
            placeholder="Filter author name"
            value={searchValue}
            onChange={(e) => handleSearchChange(e)}
            className={`
              xsm:py-1 md:py-3 px-4
              accent-input border-4 accent-rounded
              lg:text-3xl md:text-xl xsm:text-lg
              text-primary placeholder:text-primary
              xsm:w-[80%] md:w-fit
              ${montserrat.className}
            `}
          />
        </div>

        {/* Search block =========== */}

        {/* Author names block ================*/}
        <div className="w-[80%] mx-auto">
          <h1 className={`${montserrat.className} text-3xl font-bold mb-6`}>
            Authors
          </h1>
          {/* <div className="grid grid-cols-new4 gap-y-6"> */}
          <div
            className={`
          xsm:columns-1 sm:columns-2 md:columns-2 lg:columns-3 xl:columns-4
          `}
          >
            {nameBlocksState.length > 0 ? (
              nameBlocksState.map((nameBlock: NameBlock, i: number) => (
                <div key={i} className="w-full mb-6">
                  <div className="w-[50%] accent-border-bottom">
                    <p
                      className={`${montserrat.className} text-xl mb-2 font-bold`}
                    >
                      {nameBlock.alphabet}
                    </p>
                  </div>
                  <>
                    {nameBlock.matchingNames.map((name: string, i: number) => (
                      <Link key={i} href={`/authors/${name}`}>
                        <p className={`${montserrat.className}`}>{name}</p>
                      </Link>
                    ))}
                  </>
                </div>
              ))
            ) : (
              <div>
                <p className={`${montserrat.className} text-lg`}>
                  Nothing Found!
                </p>
              </div>
            )}
          </div>
          <PrimaryButton
            handleOnClick={() => router.back()}
            classNames={` mt-10`}
          >
            Go Back
          </PrimaryButton>
        </div>

        {/* Author names block =================*/}
      </main>
    </>
  );
}

export const getStaticProps = async () => {
  console.log("CONNECTING TO MONGO");
  await connectMongo();
  console.log("CONNECTED TO MONGO");
  let authors = await Author.find({});
  let authorNames = authors.map((author) => author.name);

  const alphabets = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  let nameBlocks = [];

  for (let i = 0; i < alphabets.length; i++) {
    let pushItem = {
      alphabet: alphabets[i],
      matchingNames: [],
    };
    nameBlocks.push(pushItem);
  }

  for (let i = 0; i < alphabets.length; i++) {
    for (let j = 0; j < authorNames.length; j++) {
      if (
        authorNames[j].toLowerCase().charAt(0) === alphabets[i].toLowerCase()
      ) {
        // @ts-ignore
        nameBlocks[i].matchingNames.push(authorNames[j]);
      }
    }
  }

  nameBlocks = nameBlocks.filter((nameBlock) => {
    return nameBlock.matchingNames.length !== 0;
  });

  return {
    props: {
      nameBlocks,
    },
  };
};
