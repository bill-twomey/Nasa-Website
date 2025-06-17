import { useEffect,useState } from "react";


function App() {

  const [NasaData,setNasaData] =useState(null);

  useEffect(()=> {
  
    const fetchdata = async ()=> {
    try {
    const res =await fetch('http://localhost:3000/api/nasa',{mode:"cors"});
    const data =await res.json();
    setNasaData(data);}
    catch(error){
      console.error(error)}

  }
  fetchdata();
},[]);



  return (
    <div className="bg-black min-h-screen text-white p-8 ">
    <div className="max-w-4xl mx-auto space-y-6 flex flex-col">
    <header className="text-center">
      <h1 className="text-4xl font-bold ">Astronomy Picture of the Day Apod</h1>

    </header>
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


export default App;
