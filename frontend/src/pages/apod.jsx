import { useEffect,useState } from "react";

const Apod =() => {

  const [NasaData,setNasaData] =useState(null);
  const [searchDate,setsearchDate]=useState(null);

  useEffect(()=> {
  
    const fetchdata = async ()=> {
    try {
    const res =await fetch('http://localhost:3000/api/apod',{mode:"cors"});
    const data =await res.json();
    setNasaData(data);}
    catch(error){
      console.error(error)}

  }
  fetchdata();
},[]);

const userSearch =(event) => {
  setsearchDate(event.target.value)
}

const submitSearch =async () => {
  const response = await fetch('http://localhost:3000/api/usersearch', 
                    {headers: { 'Content-Type': 'application/json' },
                    body:JSON.stringify({searchDate})}
  )

  const data =await response.json();
  setNasaData(data)

}



  return (
    <div className="bg-black min-h-screen text-white p-8 ">
    <div className="max-w-4xl mx-auto space-y-6 flex flex-col">

      <h2 className="text-4xl font-bold text-center ">Astronomy Picture of the Day Apod</h2>
      <label className="">
      <input  value={searchDate} onChange={userSearch()} className="border-white bg-white text-black" type ="search" name="search" placeholder="input a date"/>
      <button onClick={submitSearch()} type="submit">Search</button>
      </label>

 
    <main className="">
     <div className="text-center">
      <p>{NasaData?.title}</p>
      <img className="max-h-[450px] w-auto object-contain mx-auto"src={NasaData?.url} alt="image" />
     </div>
      <p>{NasaData?.explanation}</p>


    </main>
    </div>
    </div>
  );
};


export default Apod;
