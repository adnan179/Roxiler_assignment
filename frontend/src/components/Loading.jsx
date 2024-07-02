import React from "react";

const Loading = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-orange-600"></div>
    </div>
  );
};

export default Loading;
