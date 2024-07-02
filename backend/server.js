const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const Transaction = require("./models/TransactionSchema");

const app = express();
app.use(bodyParser.json());
app.use(cors());

//attach your own mongodb atlas url with username and password
mongoose.connect("your mongodb url here");

//only used once to seed data in the mongodb atlas using postman to hit the API call.
app.get("/initialize", async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const transactions = response.data;

    await Transaction.insertMany(transactions);
    res.status(200).send("Database intialized with seed data");
  } catch (err) {
    res.status(500).send("Error initializing database");
  }
});

//routes
//Api to  list all transactions with search and pagination

app.get("/transactions", async (req, res) => {
  const { month, search, page = 1, perPage = 10 } = req.query;

  const match = {};
  if (month) {
    const monthIndex = new Date(Date.parse(month + " 1, 2023")).getMonth() + 1;
    match.$expr = { $eq: [{ $month: "$dateOfSale" }, monthIndex] };
  }

  if (search) {
    match.$or = [
      { title: new RegExp(search, "i") },
      { description: new RegExp(search, "i") },
      { price: isNaN(search) ? -1 : Number(search) },
    ];
  }

  try {
    const transactions = await Transaction.aggregate([
      { $match: match },
      { $skip: (page - 1) * perPage },
      { $limit: Number(perPage) },
    ]);

    const totalTransactions = await Transaction.countDocuments(match);

    res.json({
      transactions,
      totalTransactions,
      totalPages: Math.ceil(totalTransactions / perPage),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send("Error fetching transactions");
  }
});

//API to get statistics
app.get("/statistics", async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).send("Month is required");
  }

  const monthIndex = new Date(Date.parse(month + "1,2023")).getMonth() + 1;
  const match = {
    $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] },
  };

  try {
    const [stats] = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalSaleAmount: { $sum: "$price" },
          totalSoldItems: { $sum: { $cond: ["$sold", 1, 0] } },
          totalNotSoldItems: { $sum: { $cond: ["$sold", 0, 1] } },
        },
      },
    ]);
    res.json({
      totalSaleAmount: stats.totalSaleAmount,
      totalSoldItems: stats.totalSoldItems,
      totalNotSoldItems: stats.totalNotSoldItems,
    });
  } catch (err) {
    console.log("Error fetching statistics", err);
    res.status(500).send("Error fetching statistics");
  }
});

//API to get barchart data
app.get("/barchart", async (req, res) => {
  const { month } = req.query;
  if (!month) {
    return res.status(400).send("Month is required");
  }

  const monthIndex = new Date(Date.parse(month + " 1, 2023")).getMonth() + 1;
  const match = {
    $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] },
  };

  try {
    const ranges = [
      { range: "0-100", min: 0, max: 100 },
      { range: "101-200", min: 101, max: 200 },
      { range: "201-300", min: 201, max: 300 },
      { range: "301-400", min: 301, max: 400 },
      { range: "401-500", min: 401, max: 500 },
      { range: "501-600", min: 501, max: 600 },
      { range: "601-700", min: 601, max: 700 },
      { range: "701-800", min: 701, max: 800 },
      { range: "801-900", min: 801, max: 900 },
      { range: "901-above", min: 901, max: Infinity },
    ];

    const barChart = await Transaction.aggregate([
      { $match: match },
      {
        $facet: ranges.reduce((acc, { range, min, max }) => {
          acc[range] = [
            { $match: { price: { $gte: min, $lte: max } } },
            { $count: "count" },
          ];
          return acc;
        }, {}),
      },
      {
        $project: ranges.reduce((acc, { range }) => {
          acc[range] = {
            $ifNull: [{ $arrayElemAt: [`$${range}.count`, 0] }, 0],
          };
          return acc;
        }, {}),
      },
    ]);

    res.json(barChart[0]);
  } catch (err) {
    console.log("Error fetching bar chart data:", err);
    res.status(500).send("Error fetching bar chart data");
  }
});

//API to get piechart data
app.get("/piechart", async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).send("Month is required");
  }

  const monthIndex = new Date(Date.parse(month + " 1, 2023")).getMonth() + 1;

  const match = {
    $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] },
  };

  try {
    const pieChart = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$category",
          itemCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          itemCount: 1,
        },
      },
    ]);

    res.json(pieChart);
  } catch (err) {
    console.log("Error fetching pie chart data:", err);
    res.status(500).send("Error fetching pie chart data");
  }
});

//API to get all three API's data and send it together
app.get("/combined", async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).send("Month is required");
  }

  try {
    const [statisticsResponse, barChartResponse, pieChartResponse] =
      await Promise.all([
        axios.get(`http://localhost:4000/statistics?month=${month}`),
        axios.get(`http://localhost:4000/barchart?month=${month}`),
        axios.get(`http://localhost:4000/piechart?month=${month}`),
      ]);

    res.json({
      statistics: statisticsResponse.data,
      barChart: barChartResponse.data,
      pieChart: pieChartResponse.data,
    });
  } catch (error) {
    console.error("Error fetching combined data:", error);
    res.status(500).send("Error fetching combined data");
  }
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
