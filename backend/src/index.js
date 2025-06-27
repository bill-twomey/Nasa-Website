const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')
require('dotenv').config();

app.use(cors());
app.use(express.json());

const asteroidRoutes = require('./routes/asteroid');
app.use('/api',asteroidRoutes);

const apodRoutes =require('./routes/apod');
app.use('/api',apodRoutes);

const getAIRoutes = require('./routes/getai');
app.use('/api',getAIRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})