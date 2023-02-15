import { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import Link from "next/link";
import { Oval } from "react-loader-spinner";

const Search = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(router.query.name);

  console.log(router);

  const getPoetry = async () => {
    return await axios.get(`https://poetrydb.org/title/${searchValue}`);
  };

  const {
    data: searchRes,
    isLoading: loadingPoems,
    isFetching: fetchingPoems,
    refetch,
  } = useQuery(`search-poem-${searchValue}`, getPoetry, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    console.log(searchRes);
  }, [searchRes, searchValue]);

  const handleSearchKeyDown = (e: any) => {
    if (e.key === "Enter") refetch();
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-center items-center w-full md:w-[60%] xsm:my-10 md:my-14 lg:my-20 mx-auto">
        <input
          placeholder="Search for poetry titles"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => handleSearchKeyDown(e)}
          className={`
              xsm:py-1 md:py-3 px-4
              border-4 border-white border-opacity-40 rounded-md outline-none
              lg:text-3xl md:text-xl xsm:text-lg
              bg-transparent
              text-white placeholder:text-white
              xsm:w-[80%] md:w-full
            `}
        />
      </div>
      {/* Poems */}
      <div className="xsm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] mx-auto">
        {loadingPoems || fetchingPoems ? (
          <div className="flex justify-center my-20">
            <Oval
              height={60}
              width={60}
              color="#fff"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="tr"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </div>
        ) : searchRes && searchRes.data.length > 0 ? (
          <div className="text-white mx-10 mb-20">
            {searchRes.data.map((poem: any, i: number) => (
              <Link href={`/authors/${poem.author}/${poem.title}`} key={i}>
                <p
                  className={`font-bold xsm:lg:text-md lg:text-lg border-b-2 border-white border-opacity-20 mb-2`}
                >
                  {poem.title} by{" "}
                  <span className="italic text-slate-200 font-light">
                    {poem.author}
                  </span>
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p>Nothing found!</p>
        )}
      </div>
      {/* Poems */}
    </div>
  );
};

export default Search;
