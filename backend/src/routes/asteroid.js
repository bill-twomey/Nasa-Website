// Route to get Nasa Asteroid data
// Route can take in user filter input
// Retrieved data is then organised by the relevant filter 

const express = require("express");
const router = require("express").Router();
const apikey = process.env.NASA_API_KEY;
require("dotenv").config();

const axios = require("axios");
const {
  sortByDistance,
  sortByLargest,
  sortByHazardous,
} = require("../utils/nasaApi");

// Store retrieved asteroid nasa data
let storedData = null;

// Retrieve nasa asteroid data - only run if no stored data
router.get("/asteroid", async (req, res) => {
  const filter = req.query.filter;
  if (!storedData) {
    try {
      const response = await axios.get(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=2025-06-18&end_date=2025-06-25&api_key=${apikey}`
      );

      storedData = response.data.near_earth_objects;
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
      }
    }
  }

  // Flatten object received from nasa api
  const allAsteroids = Object.values(storedData).flat();
  
  // Sort asteroid data based on filter input 
  let sortData = [];

  if (filter === "closest") {
    sortData = sortByDistance(allAsteroids);
  } else if (filter === "largest") {
    sortData = sortByLargest(allAsteroids);
  } else if (filter === "hazardous") {
    sortData = sortByHazardous(allAsteroids);
  }
  
  // Select the 3 largest , closest by filter
  const closest = sortData.slice(0, 3).map((a) => ({
    name: a.name.replace(/[()]/g, ""),
    distance: Math.round(a.close_approach_data[0].miss_distance.kilometers),
    missdate: a.close_approach_data[0].close_approach_date,
    hazardous: a.is_potentially_hazardous_asteroid ? "Yes" : "No",
    minDiameter: `${
      Math.round(a.estimated_diameter.meters.estimated_diameter_min * 1000) /
      1000
    } m`,
    maxDiameter: `${
      Math.round(a.estimated_diameter.meters.estimated_diameter_max * 1000) /
      1000
    } m`,
  }));

  res.json(closest);
});

module.exports = router;
