// Component: Asteroid
// Visualizes near-Earth asteroid data from NASA's NEO API.
// Allows users to filter asteroids based on closest, size and hazardous
// and view Groq AI explanations
// for "What is a hazardous asteroid?" and "Why track distant ones?

import { useEffect, useState } from "react";
import earth from "../assets/earth.jpg";
import asteroid from "../assets/asteroid.png";

const api_route = import.meta.env.VITE_API_URL;

const Asteroid = () => {
  // set information retrieved - asteroid data
  const [asteroidData, setAsteroidData] = useState([]);

  const [highlight, setHighlight] = useState(null);
  const [loading, setLoading] = useState(false);

  // user filter for asteroids closest largest hazardous
  const [asteroidFilter, setAsteroidFilter] = useState("closest");
  const [errorMessage, setErrorMessage] = useState("");

  // Groq AI response for two questions to provide background information
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");

  // toogle display of Groq Ai response
  const [showAnswer1, setShowAnswer1] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);

  // fetch asteroid data with filter option
  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `${api_route}/api/asteroid?filter=${asteroidFilter}`,
          { mode: "cors" }
        );
        console.log({ asteroidFilter });
        if (!res.ok) {
          throw new Error(
            `Server responded with ${res.status} ${res.statusText}`
          );
        }
        const data = await res.json();
        setAsteroidData(data);
        // setLoading(false);
      } catch (error) {
        console.error(error);
        setErrorMessage(error);
      } finally {
        setLoading(false);
      }
    };
    fetchdata();
  }, [asteroidFilter]);
 
  // fetch groq ai responses 
  useEffect(() => {
    const getAIInfo = async () => {
      try {
        const res = await fetch(`${api_route}/api/ai_info`, { mode: "cors" });
        if (!res.ok) {
          throw new Error(
            `Server responded with ${res.status} ${res.statusText}`
          );
        }
        const data = await res.json();
        setAnswer1(data.answer1);
        setAnswer2(data.answer2);
      } catch (error) {
        console.error(error);
      }
    };
    getAIInfo();
  }, []);

  // Set asteroid filter
  const filterData = (event) => {
    setAsteroidFilter(event.target.value);
  };
  
  // create ranges for display of asteroid images depending on filter
  const distances = asteroidData.map((a) => a.distance);
  const min = Math.min(...distances);
  const max = Math.max(...distances);

  let minLeft, maxLeft;

  if (asteroidFilter === "closest") {
    minLeft = 200;
    maxLeft = 450;
  } else {
    minLeft = 480;
    maxLeft = 1000;
  }

  // Normalize each asteroid’s distance into the selected range
  const getClampedPosition = (distance) => {
    if (max === min) return (minLeft + maxLeft) / 2;
    return minLeft + ((distance - min) / (max - min)) * (maxLeft - minLeft);
  };
  
  // display loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }
  
  // show error message 
  if (errorMessage) {
    return <p>{errorMessage.message}</p>;
  }
  
  // main page layout
  return (
    <div className="bg-black min-h-screen text-white p-8 pt-2 ">
      <main className="max-w-6xl mx-auto space-y-6 flex flex-col">

        {/* Page header */}
        <h2 className="text-3xl font-bold text-center mb-1 mt-1">
          Near-Earth Asteroids
        </h2>
        <p className="text-center">
          Selected asteroids from NASA Near Earth Object Api for the next 7
          days. Hover to highlight
        </p>
        
        {/* Display earth and asteroid images and highlight logic  hide on smaller screens*/}
        <div className="relative h-[180px] mb-10 mt-10 hidden md:block">
          <img
            className="absolute left-0 top-1/2 -translate-y-1/2 max-h-[150px] max-w-[150px]"
            src={earth}
            alt="earth"
          />

          {asteroidData.length > 0 &&
            asteroidData.map((values, index) => {
              const safevalues = getClampedPosition(values.distance);

              return (
                <img
                  key={index}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 object-contain  ${
                    highlight === index ? "scale-125" : ""
                  }`}
                  onMouseOver={() => setHighlight(index)}
                  onMouseLeave={() => setHighlight(null)}
                  src={asteroid}
                  alt="asteroid"
                  style={{ left: `${safevalues}px` }}
                />
              );
            })}
        </div>
        
        {/* display asteroid cards with information */}
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-6 ">
          {asteroidData.length > 0 &&
            asteroidData.map((values, index) => (
              <div
                key={index}
                className={`flex flex-col border border-slate-200 rounded-lg  w-auto max-w-md  ${
                  highlight === index ? "scale-110" : ""
                }`}
                onMouseOver={() => setHighlight(index)}
                onMouseLeave={() => setHighlight(null)}
              >
                <div className="bg-blue-900 text-center py-2 rounded-t">
                  <p>Asteroid name: {values.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-2 p-4 text-sm">
                  <span className="text-gray-400">Miss distance:</span>
                  <span>{Number(values.distance).toLocaleString()}km</span>

                  <span className="text-gray-400">Miss date:</span>
                  <span>{values.missdate}</span>

                  <span className="text-gray-400">Hazardous:</span>
                  <span>{values.hazardous.toString()}</span>

                  <span className="text-gray-400">Min diameter:</span>
                  <span>{values.minDiameter}</span>

                  <span className="text-gray-400">Max diameter:</span>
                  <span>{values.maxDiameter}</span>
                </div>
              </div>
            ))}
        </div>
        
        {/* filter option for asteroids */}
        <div className="bg-blue-900 text-white shadow-lg rounded-xl p-4 border border-gray-200 max-w-3xl mx-auto space-y-4">
          <p className="block font-semibold">Filter asteroids:</p>
          <p className="mb-2 text-sm text-grey">
            Select asteroids based on size, distance from earth and whether
            hazardous.
          </p>
          <select
            className="bg-white text-black rounded px-3 py-1 border border-grey-300"
            onChange={filterData}
            value={asteroidFilter}
          >
            <option value="closest">closest</option>
            <option value="largest">largest</option>
            <option value="hazardous">hazardous</option>
          </select>
        </div>
        
        {/* AI responses buttons with show on or off on click*/}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-6">
          <button
            onClick={() => setShowAnswer1(!showAnswer1)}
            className="bg-blue-900 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
          >
            {showAnswer1 ? "Hide" : "Show"} AI:What is a hazardous Asteroid?
          </button>

          <button
            onClick={() => setShowAnswer2(!showAnswer2)}
            className="bg-blue-900 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
          >
            {showAnswer2 ? "Hide" : "Show"}AI: Why are far-away asteroids
            tracked?
          </button>
        </div>
        
        {/* AI response boxes */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
          <div className="w-full md:w-1/2">
            {showAnswer1 && (
              <div className="bg-gray-900 text-white shadow-lg rounded-xl p-4 border border-gray-200">
                <h3 className="font-bold mb-2">
                  Groq AI: What is a hazardous asteroid:
                </h3>
                <p className="text-sm whitespace-pre-wrap">{answer1}</p>
              </div>
            )}
          </div>
          <div className="w-full md:w-1/2">
            {showAnswer2 && (
              <div className="bg-gray-900 text-white shadow-lg rounded-xl p-4 border border-gray-200">
                <h3 className="font-bold mb-2">
                  Groq AI: Why does Nasa still track far away asteroids:
                </h3>
                <p className="text-sm whitespace-pre-wrap">{answer2}</p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Asteroid;
