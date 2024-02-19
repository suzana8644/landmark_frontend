import React from "react";
import { Skeleton } from "@mui/material";

const LoadingSkeleton = () => {
  return (
    <>
      <div className="flex gap-10">
        {/* <Skeleton variant="rectangular" width={"70vw"} height={"10vh"} /> */}
        <div className="flex flex-col md:gap-10">
          <Skeleton variant="text" width={"80vw"} />
          <Skeleton variant="text" width={"80vw"} height={100} />
        </div>
      </div>
    </>
  );
};

export default LoadingSkeleton;
