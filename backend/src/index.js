const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
require('dotenv').config();


const axios = require('axios');
const apikey = process.env.NASA_API_KEY

let storedData =null
let filter=""

function sortbydistance(allAsteroids) {
    return allAsteroids.sort((a,b)=> {
    const aDist = parseFloat(a.close_approach_data[0].miss_distance.kilometers);
    const bDist = parseFloat(b.close_approach_data[0].miss_distance.kilometers);
    return aDist-bDist
  });
}

function sortbylargest(allAsteroids) {
    return allAsteroids.sort((a,b)=> {
    const aDiameter = parseFloat(a.estimated_diameter.meters.estimated_diameter_max);
    const bDiameter = parseFloat(b.estimated_diameter.meters.estimated_diameter_max);
    return bDiameter-aDiameter
  });
}

function sortbyhazardous(allAsteroids) {
  
  return hazardous = allAsteroids.filter(a => a.is_potentially_hazardous_asteroid)
    
  }



app.use(cors());

//response .data as per axios docs response schema
// async required 
app.get('/api/apod',async (req,res) => {
  const response =await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${apikey}`);
  res.json(response.data)
})


// asteroid request - fixed date range for now
app.get('/api/asteroid',async (req,res) => {
  filter =req.query.filter
  if (!storedData) {

  try {
  const response =await axios.get(`https://api.nasa.gov/neo/rest/v1/feed?start_date=2025-06-18&end_date=2025-06-25&api_key=${apikey}`);
  // console.log(response.data.element_count)
  // res.json(response.data)
   
   storedData= (response.data.near_earth_objects)
  }
// catch (error) {
//   console.log(error.status)
// }

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
    }

  



  }


  }
  const allAsteroids=Object.values(storedData).flat()

  let sortData=[]

  if (filter==="closest") {

  // const sortData = allAsteroids.sort((a,b)=> {
  //   const aDist = parseFloat(a.close_approach_data[0].miss_distance.kilometers);
  //   const bDist = parseFloat(b.close_approach_data[0].miss_distance.kilometers);
  //   return aDist-bDist
  // });
   sortData = sortbydistance(allAsteroids)
}
else if (filter==="largest") {
  //   const sortData = allAsteroids.sort((a,b)=> {
  //   const aDist = parseFloat(a.estimated_diameter.meters.estimated_diameter_max);
  //   const bDist = parseFloat(b.estimated_diameter.meters.estimated_diameter_max);
  //   return aDist-bDist
  // });
   sortData =sortbylargest(allAsteroids)
}
else if (filter==="hazardous") {
   sortData =sortbyhazardous(allAsteroids)
}

  const closest = sortData.slice(0,5).map(a=> ({
    name :a.name.replace(/[()]/g,""),
    distance :Math.round(a.close_approach_data[0].miss_distance.kilometers),
    missdate :a.close_approach_data[0].close_approach_date,
    hazardous: (a.is_potentially_hazardous_asteroid.toString()),
    minDiameter:Math.round(a.estimated_diameter.meters.estimated_diameter_min*1000)/1000,
    maxDiameter:Math.round(a.estimated_diameter.meters.estimated_diameter_max*1000)/1000,

  }))

  
  res.json(closest)
  // console.log(closest)



  })


  // user searchdate request

    let storedSearchDate =null 
    app.post('/api/getSearchDate',express.json(),(req,res) =>{
      storedSearchDate=req.body.searchDate
      res.json({ message: " success" });

    })
     



// apod search with user input

app.get('/api/apodSearchDate',async (req,res) => {
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
    }

  }
})





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

