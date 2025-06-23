import { useEffect,useState } from "react";

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
    const res =await fetch('http://localhost:3000/api/apod',{mode:"cors"});
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
  const response = await fetch('http://localhost:3000/api/getSearchDate', 
                    {method: "POST",
                      headers: { 'Content-Type': 'application/json' },
                    body:JSON.stringify({searchDate})} )
                  const recd =  await response.json()
                if (recd) {
                     
    
    const res =await fetch('http://localhost:3000/api/apodSearchDate',{mode:"cors"});
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
    return <p>loading...</p>
  }
  else {
  return (
    <div className="bg-black min-h-screen text-white p-8 ">
    <div className="max-w-6xl mx-auto space-y-6 flex flex-col">

      <h2 className="text-4xl font-bold text-center ">Astronomy Picture of the Day Apod</h2>
      <label className="">
      <input  value={searchDate} onChange={userSearch} className="border-white bg-white text-black p-1" type ="date" name="search" placeholder="input a date"/>
      <button className="ml-3 bg-blue-900 rounded p-1 px-2" onClick={submitSearch} type="submit">Search</button>
      </label>
      {searching && (
        <span>Searching.... </span>
      )}
      {searchinputerror && <p>{searchinputerror}</p>}
      {errorMessage && <p>{errorMessage}</p>}

 
    <main className="">

      {nextData && (
         <img src={nextData?.url} 
         alt="" 
         style={{ display: 'none' }}
         onLoad={()=> {setSearching(false); setNasaData(nextData); setNextData(null)}} />
        
      ) }




      {NasaData &&(
      <div className="flex flex-row justify-items" >
     <div className="text-center w-2/3">
      <p>{NasaData?.title}</p>
      <img className="max-h-[450px] w-auto object-contain mx-auto"src={NasaData?.url} alt="image"  />
     </div>
     <div className="w-1/3">
      <p>{NasaData?.explanation}</p>
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
