# NASA API Viewer Project

## Purpose of the Project
Create a website to connect to NASA's open API data and display data such as Astronomy Picture of the Day and Near-Earth Object information.

## Project Features 
- View NASA's Picture of the day. 
- Search past NASA Picture of the day.
- Viusalise Near-Earth Asteroids from NASA Near-Earth Objects API.
- Filter selected Asteroids by miss distance from Earth, their maximum size and whether hazardous.
- Additional information provided by connecting to Groq AI.


## Tech Stack
## Frontend
- React (with Vite)
- Tailwind CSS

## Backend
- Node.js
- Express.js

## Hosting
- Vercel for frontend
- Render for backend

## Live Application Url
The website can be viewed at:
https://nasa-website-five.vercel.app/

## Cloning and running locally
- Clone this repository. 
- Install node and npm. 

## Add Environment Variables
- Create a .env file in the frontend directory
- Add VITE_API_URL= local host

- Create a .env file in the backend directory
- add NASA_API_KEY=your_nasa_api_key
- add GROQ_API_KEY=your_groq_api_key
- See https://console.groq.com/home and https://api.nasa.gov/

## Run the backend 
- cd backend/src
- node index.js

## Run the frontend
- cd frontend 
- npm run dev
