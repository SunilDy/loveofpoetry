import React, { createContext, useState } from "react";

// export const IntermediateBodyContext = createContext({
//     postBody: "",
//     setPostBody: () => void
// });
export const IntermediateBodyContext = createContext({});

type IntermediateBodyProvider = {
  children: React.ReactNode;
};

export const IntermediateBodyProvider = ({
  children,
}: IntermediateBodyProvider) => {
  const [postBody, setPostBody] = useState("");
  return (
    <IntermediateBodyContext.Provider value={{ postBody, setPostBody }}>
      {children}
    </IntermediateBodyContext.Provider>
  );
};
