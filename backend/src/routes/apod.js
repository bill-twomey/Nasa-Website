// Routes to connect to Nasa Apod
// First route gets image of the day , second allows user input to search previous images


const express = require("express");
const router = require("express").Router();
const apikey = process.env.NASA_API_KEY;
require("dotenv").config();

const axios = require("axios");

// Use axios to fetch apod data from nasa api
router.get("/apod", async (req, res) => {
  const response = await axios.get(
    `https://api.nasa.gov/planetary/apod?api_key=${apikey}`
  );
  res.json(response.data);
});

//Use axios to fetch apod data for specific date
router.get("/apod/SearchDate", async (req, res) => {
  const searchDate = req.query.date;
  try {
    const response = await axios.get(
      `https://api.nasa.gov/planetary/apod?api_key=${apikey}&date=${searchDate}`
    );
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log("Error data:", error.response.data);
      res.status(error.response.status).json({
        status: error.response.status,
        message: error.response.data?.msg || "Nasa api error",
      });
    } else if (error.request) {
      console.log(error.request);
      res.status(503).json({
        message: "No response from Nasa. Try again Later",
      });
    } else {
      console.log(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

module.exports = router;
