const Loader = () => {
  return (
    <div
      className={`accent-border accent-modal-bg accent-rounded m-6 p-6 mx-auto xsm:w-[95%] md:w-[70%] lg:w-[60%]`}
    >
      {/* User Info Loader Container */}
      <div className="flex animate-pulse items-center h-full justify-start gap-x-2">
        {/* Avatar Loader */}
        <div className="bg-gray-200 rounded-full xsm:w-10 lg:w-16 xsm:h-10 lg:h-16"></div>
        {/* UserInfo Loader */}
        <div className="flex flex-col space-y-3">
          <div className="w-36 bg-gray-300 h-6 rounded-md "></div>
          <div className="w-24 bg-gray-300 h-6 rounded-md "></div>
        </div>
        {/* UserInfo Loader */}
      </div>
      {/* User Info Loader Container */}

      <div className="animate-pulse my-4 w-[40%] bg-gray-300 h-6 rounded-md "></div>
      {/* Lines Loader */}
      <div className="animate-pulse my-10">
        <div className="animate-pulse my-4 w-[80%] bg-gray-300 h-6 rounded-md "></div>
        <div className="animate-pulse my-4 w-[85%] bg-gray-300 h-6 rounded-md "></div>
        <div className="animate-pulse my-4 w-[70%] bg-gray-300 h-6 rounded-md "></div>
        <div className="animate-pulse my-4 w-[77%] bg-gray-300 h-6 rounded-md "></div>
        <div className="animate-pulse my-4 w-[50%] bg-gray-300 h-6 rounded-md "></div>
      </div>
      {/* Lines Loader */}
    </div>
  );
};

export default Loader;
