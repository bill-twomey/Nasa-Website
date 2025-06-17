const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
require('dotenv').config();


const axios = require('axios');
const apikey = process.env.NASA_API_KEY


// TEST backend frontend connect
// app.use(cors());
// // res.json recommended - 
// app.get('/api/hello', (req, res) => {
//   res.json({msg:'backend to frontend'})
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

app.use(cors());

//response .data as per axios docs response schema
// async required 
app.get('/api/nasa',async (req,res) => {
  const response =await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${apikey}`);
  res.json(response.data)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})