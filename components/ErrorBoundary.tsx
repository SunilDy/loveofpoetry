import { Component } from "react";
import { Montserrat } from "@next/font/google";
import Link from "next/link";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { PrimaryButton } from "./Buttons";

const jose = Montserrat({
  subsets: ["latin"],
});

class ErrorBoundary extends Component {
  constructor(props: any) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  //@ts-ignore
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }
  //@ts-ignore
  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }

  render() {
    let Message = "Sorry. Something went wrong!";
    // Check if the error is thrown
    //@ts-ignore
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <Navbar />
          <div className="flex flex-col items-center my-10 px-24">
            <h1
              className={`
        ${jose.className} text-primary
        xsm:text-sm md:text-lg lg:text-2xl
        `}
            >
              {Message}
            </h1>
            <Link
              href={"/"}
              className={`
              bg-primary text-secondary
              md:px-2 p-1 rounded-md
              hover:scale-95
              transition-transform
              lg:text-md xsm:text-sm
              border-2 border-primary
              md:font-semibold
            `}
            >
              Go Back Home
            </Link>
          </div>
          <Footer />
        </div>
      );
    }

    // Return children components in case of no error

    //@ts-ignore
    return this.props.children;
  }
}

export default ErrorBoundary;
