import { PrimaryButton } from "@/components/Buttons";
import { useRouter } from "next/router";
import Head from "next/head";

const NotFound = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>404! Page Not Found</title>
        <meta
          name="description"
          content="Discover, Browse or Study from our endless collection of classical poetry right from the period of Renaissance and of The Romantics from our site. We got you all covered."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="min-h-screen flex-justify">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary">
              404
            </h1>
            <p className="mb-4 text-3xl tracking-tight font-bold md:text-4xl text-primary">
              Something&rsquo;s missing.
            </p>
            <p className="mb-4 text-lg font-light text-primary">
              Sorry, we can&rsquo;t find that page. You&rsquo;ll find lots to
              explore on the home page.{" "}
            </p>
            <PrimaryButton handleOnClick={() => router.push("/")}>
              Back to Homepage
            </PrimaryButton>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
