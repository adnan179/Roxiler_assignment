import React, { useEffect, useState } from "react";
import axios from "axios";
import BarChart from "./BarChart";
import Loading from "./Loading";
import PieChartComponent from "./PieChart";
import Statistics from "./Statistics";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("March");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [error, setError] = useState("");
  const [statsData, setStatsData] = useState({});
  const [barData, setBarData] = useState({});
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(false);

  // function to fetch transactions from the database
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:4000/transactions", {
          params: { month, search, page, perPage },
        });
        setTransactions(response.data.transactions);
        setLoading(false);
      } catch (err) {
        setError("Error fetching the transactions!");
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [month, search, page, perPage]);

  // function to fetch combined data (barchart, piechart, statistics)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/combined", {
          params: { month },
        });
        setBarData(response.data.barChart || {});
        setPieData(response.data.pieChart || []);
        setStatsData(response.data.statistics || {});
      } catch (err) {
        setError("Error fetching combined data");
        console.log("Error fetching combined data:", err);
      }
    };
    fetchData();
  }, [month]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="flex flex-col w-full">
      {/* select & search container */}
      {error && <h3 className="font-medium text-red-600">{error}</h3>}
      <div className="flex flex-row gap-5">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="flex rounded-md px-4 py-2 bg-orange-500 text-white font-medium outline-none"
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="px-4 py-2 rounded-md text-gray-600 outline-none focus:ring-1 focus:ring-orange-600"
        />
      </div>
      <h1 className="text-white font-bold text-2xl pt-3 pb-3">
        Transactions of {month}
      </h1>
      {/* table container */}
      <div className="flex flex-col w-full justify-center items-center">
        {transactions.length > 0 ? (
          <table className="text-white table-auto border border-slate-500 border-spacing-1 border-separate">
            <thead>
              <tr>
                <th className="border border-slate-500 px-3">Title</th>
                <th className="border border-slate-500">Description</th>
                <th className="border border-slate-500">Price</th>
                <th className="border border-slate-500 px-3">Date of Sale</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id}>
                  <td className="border border-slate-500">{t.title}</td>
                  <td className="border border-slate-500">{t.description}</td>
                  <td className="border border-slate-500">{t.price}</td>
                  <td className="border border-slate-500">
                    {new Date(t.dateOfSale).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h1 className="font-bold text-2xl text-orange-500">
            Oops! No transactions exist
          </h1>
        )}
        {/* buttons container */}
        <div className="flex flex-row w-full justify-center items-center gap-3 pt-5">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="border-none bg-transparent text-orange-600 font-medium"
          >
            Previous
          </button>
          <div className="text-orange-600 font-medium">{page}</div>
          <button
            onClick={() => setPage(page + 1)}
            className="border-none bg-transparent text-orange-600 font-medium"
          >
            Next
          </button>
        </div>
      </div>
      <div className=" flex w-full pt-20">
        <Statistics data={statsData} month={month} />
      </div>
      {/* charts container */}
      <div className="flex w-full pt-10">
        <BarChart data={barData} month={month} />
      </div>
      <div className="flex w-full pt-10">
        <PieChartComponent data={pieData} month={month} />
      </div>
    </div>
  );
};

export default Transactions;
