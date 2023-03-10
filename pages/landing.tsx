import Head from "next/head";
import { Alegreya } from "@next/font/google";
import Image from "next/image";
import LineBreak from "@/public/linebreak.svg";
import { Montserrat } from "@next/font/google";
import Title from "@/models/Title";
import connectMongo from "@/lib/connectMongo";
import { PrimaryButton } from "@/components/Buttons";
import { useRouter } from "next/router";

const montserrat = Montserrat({ subsets: ["latin"] });
const alegreya = Alegreya({ subsets: ["latin"] });

export default function Home({ random: randomStringified }: any) {
  let randomPoem = JSON.parse(randomStringified);

  const router = useRouter();

  return (
    <>
      <Head>
        <title>
          PoetryDot - Discover, Browse or Study from our endless collection of
          classical poetry
        </title>
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
      <main className="text-white">
        {/* Hero =============== */}
        <div className="text-white xsm:my-20 lg:my-32 px-10 lg:w-[70%] mx-auto text-center">
          <h1
            className={`${montserrat.className} 
            xsm:text-4xl md:text-4xl lg:text-6xl 
            text-center font-extrabold leading-relaxed tracking-wide`}
          >
            The love for poetry is never ending.
          </h1>
          <h1
            className={`${montserrat.className} text-2xl text-center font-bold mt-4`}
          >
            And we uderstand that. ????
          </h1>
          <h1
            className={`${montserrat.className} xsm:text-xl lg:text-2xl text-center font-light w-[60%] mx-auto mt-4`}
          >
            Discover, Browse or Study from our endless collection of classical
            poetry right from the period of Renaissance and of The Romantics
            from our site. We got you all covered.
          </h1>
        </div>
        {/* Hero =============== */}

        {/* Sign In Prompt =============== */}
        <div className="flex flex-col items-center">
          <h1
            className={`${montserrat.className} xsm:text-xl lg:text-2xl text-center w-[60%] mx-auto font-bold mb-2`}
          >
            Sign In To Explore
          </h1>
          <PrimaryButton
            buttonClassNames={`font-bold`}
            handleOnClick={() => router.push(`/auth/login`)}
          >
            Sign In
          </PrimaryButton>
        </div>
        {/* Sign In Prompt =============== */}

        {/* Random Poem ============= */}
        <div className="xsm:mt-10 md:mt-16 lg:mt-24 text-white">
          <h1
            className={`${montserrat.className} text-xl text-center font-normal w-[60%] mx-auto mb-4`}
          >
            Here&apos;s a recommended poetry to get you started.
          </h1>
          <div
            className={`
          xsm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] 
          mx-auto flex flex-col items-center mb-32 z-30 rounded-xl text-white
          bg-rose-100 border-2 border-slate-100 border-opacity-40 bg-opacity-20 shadow-2xl w-full 
          xsm:py-0 lg:py-10 
          xsm:px-6 md:px-10`}
          >
            <h1
              className={`${alegreya.className} font-bold mt-8 mb-2
              xsm:text-lg md:text-2xl lg:text-3xl text-center
              `}
            >
              {randomPoem.title}
            </h1>
            <Image
              className="xsm:w-28 md:w-40 mb-10"
              src={LineBreak}
              alt={"linebreak"}
              height={300}
              width={300}
            />
            {randomPoem.lines.map((line: string, i: number) => (
              <p
                className={`${alegreya.className} 
                xsm:text-md md:text-lg lg:text-xl 
                text-center mb-3`}
                key={i}
              >
                {line}
              </p>
            ))}
            <Image
              className="xsm:w-28 md:w-40 my-10"
              src={LineBreak}
              alt={"linebreak"}
              height={300}
              width={300}
            />
          </div>
        </div>
        {/* Random Poem ============= */}
      </main>
    </>
  );
}

export const getServerSideProps = async () => {
  await connectMongo();
  let random = await Title.find({
    $expr: { $lt: [{ $size: "$lines" }, 40] },
  });

  function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  let randomPoem = random[randomNumber(0, random.length - 1)];

  return {
    props: {
      random: JSON.stringify(randomPoem),
    },
  };
};
