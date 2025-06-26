
import { useEffect,useState } from "react";
import earth from '../assets/earth.jpg';
import asteroid from '../assets/asteroid.png';
const api_route=import.meta.env.VITE_API_URL


const Asteroid=() => {

    const [AsteroidData,setAsteroidData] =useState([])
    const [highlight,setHighlight]=useState(null)
    const [loading,setLoading] = useState(false)
    // default option
    const [asteroidFilter,setasteroidFilter] =useState("closest")
     const [errorMessage,seterrorMessage] =useState("")
  
    
   // fetch asteroid data
    useEffect (() => {
        // const params={asteroidFilter}
        const fetchdata = async ()=> {
            setLoading(true)
           
            try {
                
               const res=await fetch(`${api_route}/api/asteroid?filter=${asteroidFilter}`, { mode:"cors"});
                console.log({asteroidFilter})
                if (!res.ok) {
                    throw new Error(`Server responded with ${res.status} ${res.statusText}`)
                }
                const data =await res.json();
                setAsteroidData(data);
                setLoading(false);
                
            }
            catch(error) {
                console.error(error)
                seterrorMessage(error)
            }
            finally {
                setLoading(false)
            }
        }
        fetchdata();
    },[asteroidFilter]
    )
    // send asteroid filter to backend
       const filterData = (event) => {
          setasteroidFilter(event.target.value)

       }

       const distances = AsteroidData.map(a => a.distance);
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
  if (max === min) return (minLeft + maxLeft) / 2; // fallback if all distances equal
  return minLeft + ((distance - min) / (max - min)) * (maxLeft - minLeft);
};

    if (loading) {
            return (
  <div className="flex justify-center items-center min-h-screen bg-black text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>
    )
    }
    if (errorMessage) {
        return <p>{errorMessage.message}</p>
    }
 
    
    return (

        <div className="bg-black min-h-screen text-white p-8 pt-2 ">
        <main className="max-w-6xl mx-auto space-y-6 flex flex-col">
        <h2 className="text-3xl font-bold text-center">Near-Earth Asteroids</h2>
        <p className="text-center">Selected asteroids from NASA Near Earth Object Api for the next 7 days. Hover to highlight</p>
        

        <div className="relative h-[180px]">
            <img className="absolute left-0 top-1/2 -translate-y-1/2 max-h-[150px] max-w-[150px]"src={earth} alt="earth"/>

             {AsteroidData.length>0 && AsteroidData.map((values,index) => {
                // const scaled=(Math.round(values.distance*0.0001))
                // const minLeft = 200;
                // const maxLeft = 1000; 
                // const original = Math.round(values.distance * 0.0001);
                const safevalues = getClampedPosition(values.distance);

                
                return (
                <img key={index}
                    className = { `absolute left-0 top-1/2 -translate-y-1/2 object-contain  ${highlight===index ? "scale-125":""}`}
                    onMouseOver={()=>setHighlight(index)} 
                    onMouseLeave={()=>setHighlight(null)}
                    src={asteroid} 
                    alt="asteroid" 
                    style={{ left: `${safevalues}px` }}
                 />
                  )
              }) }
        </div>

        <div>
            <p className="block mb-1">
                Filter asteroids:
            </p>
            <p>Select asteroids based on either closest to earth, size and whether hazardous for the next 7 days.</p>
                <select className="bg-white text-black "
                        onChange={filterData}
                        value={asteroidFilter}>
                    <option value="closest">closest</option>
                    <option value="largest">largest</option>
                    <option value="hazardous">hazardous</option>
                </select>
            
        </div>

        <div className="flex flex-row  gap-4 ">
        { AsteroidData.length>0 && AsteroidData.map((values,index)=>(
        
        <div key={index} 
        className={`flex flex-col border border-slate-200 rounded-lg  w-full max-w-md  ${highlight === index ?"scale-110":""}`}
                        onMouseOver={()=>setHighlight(index)} 
                    onMouseLeave={()=>setHighlight(null)}
        >
            <div className="bg-blue-900 text-center py-2 rounded-t"  >
                <p>{values.name}</p>
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
     
       
        </main>
        </div>


    );
    
};

export default Asteroid