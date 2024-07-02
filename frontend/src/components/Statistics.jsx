import React from "react";

const Statistics = ({ data, month }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex w-full text-orange-600 font-medium justify-center items-center">
        no data available!
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full justify-start ">
      <h2 className="text-2xl font-bold text-white pb-5">
        Statistics - {month}
      </h2>
      <div className="flex md:flex-row flex-col gap-5 text-white text-lg font-medium">
        <div className="flex flex-col gap-2">
          <h2 className="text-gray-600">Total Sale Amount:</h2>
          <div className="ml-5 w-[100px] h-[100px] justify-center items-center flex rounded-md bg-orange-500 shadow shadow-white/90">
            {data.totalSaleAmount}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-gray-600">Total Sold Items:</h2>
          <div className="ml-5 w-[100px] h-[100px] justify-center items-center flex rounded-md bg-orange-500 shadow shadow-white/90">
            {data.totalSoldItems}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-gray-600">Total Not Sold Items:</h2>
          <div className="ml-5 w-[100px] h-[100px] justify-center items-center flex rounded-md bg-orange-500 shadow shadow-white/90">
            {data.totalNotSoldItems}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
