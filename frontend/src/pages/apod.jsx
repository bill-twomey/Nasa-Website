import { useEffect,useState } from "react";
const api_route=import.meta.env.VITE_API_URL

const Apod =() => {


  const [NasaData,setNasaData] =useState(null);
  const [searchDate,setsearchDate]=useState("");
  const [loading,setLoading] =useState(false)
  const [searching,setSearching] =useState(false)
  // const [imageLoaded,setimageLoaded] =useState(false)
  const [nextData, setNextData] = useState(null); 
  const [searchinputerror,setSearchInputError] =useState("");
  const [errorMessage,seterrorMessage] =useState("")
  


  // receive apod from the backend 
  useEffect(()=> {
  
  
    const fetchdata = async ()=> {
      setLoading(true)
    try {
    const res =await fetch(`${api_route}/api/apod`,{mode:"cors"});
    const data =await res.json();
    setNasaData(data)
    setLoading(false)}
    catch(error){
      console.error(error);
    // setSearching(false)
    }

  }
  fetchdata();
},[]);

// set searchDate with user input
const userSearch =(event) => {
  setsearchDate(event.target.value)
}

// connect to the backend with user search date
// no response needed ??? - just sending
const submitSearch =async () => {
  if (!searchDate) {
    setSearchInputError("Please enter a search date")
    return;
  }
  setSearchInputError("")
  seterrorMessage("")
  setSearching(true);


  try {
  const response = await fetch(`${api_route}/api/apod/getSearchDate`, 
                    {method: "POST",
                      headers: { 'Content-Type': 'application/json' },
                    body:JSON.stringify({searchDate})} )
                  const recd =  await response.json()
                if (recd) {
                     
    
    const res =await fetch(`${api_route}/api/apod/SearchDate`,{mode:"cors"});
      if (!res.ok) {
        let errorMessage ="something went wrong"
        setSearching(false)

      try {
    const errordata =await res.json();
    errorMessage=  `Error ${errordata.status} - ${errordata.message}`
    // throw new Error(errordata.message); 
  } catch {
    errorMessage=`Server returned ${res.status}`

  }throw new Error(errorMessage); 
  
}
    const data =await res.json();
    // setNasaData(data);
    setNextData(data) 
  }
}
    catch(error){
      console.error(error.message)
      seterrorMessage(error.message)

  } 
 } 
        
  if (loading) {
    return (
  <div className="flex justify-center items-center min-h-screen bg-black text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>
    )
  }
  else {
  return (
    <div className="bg-black min-h-screen text-white px-4 sm:px-4 md:px-6 lg:px-8 pt-4 pb-8 ">
    <div className="max-w-7xl mx-auto space-y-6 ">

      <h2 className="text-3xl font-bold text-center ">Astronomy Picture of the Day </h2>

      <div className="text-center space-y-2 mb-8">
      <p>Search for past images. Enter a date below:</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
   
        <div className="flex items-center gap-2">
      <input  value={searchDate} onChange={userSearch} className="border-white bg-white text-black p-1 rounded" type ="date" name="search" placeholder="input a date"/>
      <button className="ml-3 bg-blue-900 hover:bg-blue-700 rounded p-1 px-2" onClick={submitSearch} type="submit">Search</button>
      </div>
         {searching && (
        <div className="text-center">
        <span className="text-sm sm:ml-4">Searching.... </span>
        </div>

      )}


       </div>
      </div>
      
 
      {searchinputerror && (
        <div className="text-center">
      <p>{searchinputerror}</p>
      </div>
    )}
      {errorMessage && (
        <div className="text-center">
        <p>{errorMessage}</p>
        </div>
        )}

 
    <main className="">

      {nextData && (
         <img src={nextData?.url} 
         alt="" 
         style={{ display: 'none' }}
         onLoad={()=> {setSearching(false); setNasaData(nextData); setNextData(null)}} />
        
      ) }




      {NasaData &&(
      <div className="flex flex-col lg:flex-row gap-5 items-start" >

     <div className="text-center lg:w-[60%] w-full flex justify-center">
     <div className="w-full">
      <h3 className="font-semibold mb-2">{NasaData?.title}</h3>
      <img className="max-h-[60vh] w-full object-contain mx-auto rounded shadow-lg"src={NasaData?.url} alt="image"  />
      </div>
     </div>
     <div className="w-full text-left lg:w-[40%] max-h-[80vh]  ">
      <div className="bg-neutral-850 rounded-lg p-4 shadow-md">
      <p className="leading-relaxed">{NasaData?.explanation}</p>
      </div>
      </div>

     </div>
     )}
    </main>
    </div>
    </div>
  );
};
}

export default Apod;
