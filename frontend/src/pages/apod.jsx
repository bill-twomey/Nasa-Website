//Component: apod
// Shows the astronomy picture of the day 
// Also allows users to select past picture of the day

import { useEffect, useState } from "react";
const api_route = import.meta.env.VITE_API_URL;



const Apod = () => {
  // sets apod data received from backend
  const [nasaData, setNasaData] = useState(null);
  
  const [searchDate, setSearchDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  // used to delay loading until image is ready
  const [nextData, setNextData] = useState(null);

  const [searchInputError, setSearchInputError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [timeoutReached, setTimeoutReached] = useState(false);


  // Fetch Nasa Apod of the day 
  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true);
      setTimeoutReached(false);
      
      // Abort request after 12 seconds
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      try {
        const res = await fetch(`${api_route}/api/apod`, {
          mode: "cors",
          signal: controller.signal,
        });
        const data = await res.json();
        clearTimeout(timeout);
        setNasaData(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setTimeoutReached(true);
        setLoading(false)
      }
    };
    fetchdata();
  }, []);

  // Set user search input for Apod
  const userSearch = (event) => {
    setSearchDate(event.target.value);
  };

  // Connect to the backend with user search date and fetch apod for that date
  const submitSearch = async () => {
    if (!searchDate) {
      setSearchInputError("Please enter a search date");
      return;
    }
    setSearchInputError("");
    setErrorMessage("");
    setSearching(true);

    try {
      // Send selected date to backend
      console.log("searchDate being sent:", searchDate);
      console.log("Calling:", `${api_route}/api/apod/SearchDate?date=${searchDate}`);
      const res = await fetch(`${api_route}/api/apod/SearchDate?date=${searchDate}`, {
        mode: "cors"

      });


        if (!res.ok) {
          let errorMessage = "something went wrong";
          setSearching(false);

          try {
            const errordata = await res.json();
            errorMessage = `Error  - ${errordata.message}`;
          } catch {
            errorMessage = `Server returned ${res.status}`;
          }
          throw new Error(errorMessage);
        }
        const data = await res.json();
        setNextData(data);
      
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message);
      setSearching(false)
    }
  };


  // Show timeout message
  if (timeoutReached) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <p className="text-red-500">
          This is taking longer than expected. Please try again later.
        </p>
      </div>
    );
  }
  // Display spinner if page is in loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  } else {
    // Main page layout 
    return (
      <div className="bg-black min-h-[100vh] text-white px-4 sm:px-4 md:px-6 lg:px-8 pt-4 pb-8 ">
        <div className="max-w-7xl mx-auto space-y-6 ">
          <h2 className="text-3xl font-bold text-center ">
            Astronomy Picture of the Day{" "}
          </h2>
          
          {/* Input for search date */}
          <div className="text-center space-y-2 mb-8">
            <p>Search for past images. Enter a date below:</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <input
                  value={searchDate}
                  onChange={userSearch}
                  className="border-white bg-white text-black p-1 rounded"
                  type="date"
                  name="search"
                  placeholder="input a date"
                />
                <button
                  className="ml-3 bg-blue-900 hover:bg-blue-700 rounded p-1 px-2"
                  onClick={submitSearch}
                  type="submit"
                >
                  Search
                </button>
              </div>
              {searching && (
                <div className="text-center">
                  <span className="text-sm sm:ml-4">Searching.... </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Search date input error */}
          {searchInputError && (
            <div className="text-center">
              <p>{searchInputError}</p>
            </div>
          )}
          {/* Show error message */}
          {errorMessage && (
            <div className="text-center">
              <p>{errorMessage}</p>
            </div>
          )}

          <main className="">
            {/* Delay load until all elements ready */}
            {nextData && (
              <img
                src={nextData?.url}
                alt=""
                style={{ display: "none" }}
                onLoad={() => {
                  setSearching(false);
                  setNasaData(nextData);
                  setNextData(null);
                }}
              />
            )}
            
            {/* Display search image and explanation */}
            {nasaData && (
              <div className="flex flex-col lg:flex-row gap-5 items-stretch">
                <div className="text-center lg:w-[60%] w-full flex justify-center h-full">
                  <div className="w-full h-full">
                    <h3 className="font-semibold mb-2">{nasaData?.title}</h3>
                    <img
                      className="max-h-[60vh] w-full object-contain mx-auto rounded shadow-lg"
                      src={nasaData?.url}
                      alt="image"
                    />
                  </div>
                </div>

                <div className="w-full text-left lg:w-[40%] h-full  ">
                  <div className="bg-neutral-850 rounded-lg p-4 shadow-md">
                    <p className="leading-relaxed">{nasaData?.explanation}</p>
                  </div>
                </div>
              </div>
            )}
            
          </main>
        </div>
      </div>
    );
  }
};

export default Apod;
