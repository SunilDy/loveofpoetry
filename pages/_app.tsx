import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";
import ErrorBoundary from "@/components/ErrorBoundary";
import { IntermediateBodyProvider } from "@/context/IntermediatePostBody";
import Head from "next/head";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const queryClient = new QueryClient({});

  return (
    <>
      <Head>
        <meta name="theme-color" content="#F472B6" />
      </Head>
      <ErrorBoundary>
        <SessionProvider session={session}>
          <QueryClientProvider client={queryClient}>
            <IntermediateBodyProvider>
              <Navbar />
              <Component {...pageProps} />
              <Footer />
            </IntermediateBodyProvider>
          </QueryClientProvider>
        </SessionProvider>
      </ErrorBoundary>
    </>
  );
}
