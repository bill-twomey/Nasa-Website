const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
require('dotenv').config();


const axios = require('axios');
const apikey = process.env.NASA_API_KEY


app.use(cors());

//response .data as per axios docs response schema
// async required 
app.get('/api/apod',async (req,res) => {
  const response =await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${apikey}`);
  res.json(response.data)
})

// asteroid request - fixed date range for now
app.get('/api/asteroid',async (req,res) => {
  const response =await axios.get(`https://api.nasa.gov/neo/rest/v1/feed?start_date=2025-06-18&end_date=2025-06-25&api_key=${apikey}`);
  // console.log(response.data.element_count)
  // res.json(response.data)
  const nearEarth= (response.data.near_earth_objects)
  const allAsteroids=Object.values(nearEarth).flat()

  const sortByDistance = allAsteroids.sort((a,b)=> {
    const aDist = parseFloat(a.close_approach_data[0].miss_distance.kilometers);
    const bDist = parseFloat(b.close_approach_data[0].miss_distance.kilometers);
    return aDist-bDist
  });

  const closest = sortByDistance.slice(0,10).map(a=> ({
    name :a.name,
    distance :a.close_approach_data[0].miss_distance.kilometers

  }))
  res.json(closest)

  })


  // user searchdate request

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

