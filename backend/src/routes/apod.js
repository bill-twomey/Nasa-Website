const express = require('express')
const router = require('express').Router();
const apikey = process.env.NASA_API_KEY
require('dotenv').config();


const axios = require('axios');


//response .data as per axios docs response schema
// async required 
router.get('/apod',async (req,res) => {
  const response =await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${apikey}`);
  res.json(response.data)
})

// user searchdate request

    let storedSearchDate =null 
    router.post('/apod/getSearchDate',(req,res) =>{
      storedSearchDate=req.body.searchDate
      res.json({ message: " success" });

    })
     



// apod search with user input

router.get('/apod/SearchDate',async (req,res) => {
  try {
  const response =await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${apikey}&date=${storedSearchDate}`);
  res.json(response.data)
  }
  catch (error) {
    if (error.response) {
    console.log(error.response.status)
    console.log("Error data:", error.response.data);
    res.status(error.response.status).json({
      status: error.response.status,
      message: error.response.data?.msg || "Nasa api error"
    })
    } else if (error.request) {
      console.log(error.request)
      res.status(503).json({
       message: "No response from Nasa. Try again Later"

    }) }
    else {
      console.log(error.message)
      res.status(500).json({ message: "Internal server error" });
    }

  }
})

module.exports = router;