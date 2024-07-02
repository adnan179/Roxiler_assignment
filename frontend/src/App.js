import React from "react";
import Transactions from "./components/Transactions";

const App = () => {
  return (
    <div className="flex flex-col w-full min-h-screen p-24 bg-black/90">
      <h1 className="text-4xl text-orange-600 font-bold">
        Transaction Dashboard
      </h1>
      <div className="pt-20">
        <Transactions />
      </div>
    </div>
  );
};

export default App;
