import { useEffect,useState } from "react";
import earth from '../assets/earth.jpg';
import asteroid from '../assets/asteroid.png';

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
                
                const res=await fetch(`http://localhost:3000/api/asteroid?filter=${asteroidFilter}`, { mode:"cors"});
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

    if (loading) {
        return <p>loading...</p>
    }
    if (errorMessage) {
        return <p>{errorMessage.message}</p>
    }
 
    
    return (

        <div className="bg-black min-h-screen text-white p-8 ">
        <main className="max-w-6xl mx-auto space-y-6 flex flex-col">
        <h2 className="font-bold ">Asteroids</h2>

        <div className="relative h-[300px]">
            <img className="absolute left-0 top-1/2 -translate-y-1/2 max-h-[150px] max-w-[150px]"src={earth} alt="earth"/>

             {AsteroidData.length>0 && AsteroidData.map((values,index) => {
                const scaled=(Math.round(values.distance*0.0001))
                return (
                <img key={index}
                    className = {` absolute left-0 top-1/2 -translate-y-1/2 object-contain  ${highlight===index ? "scale-125":""}`}
                    onMouseOver={()=>setHighlight(index)} 
                    onMouseLeave={()=>setHighlight(null)}
                    src={asteroid} 
                    alt="asteroid" 
                    style={{ left: `${scaled + 200}px` }}
                 />
                  )
              }) }
        </div>

        <div>
            <label className="block mb-2">
                Filter asteroids:
            </label>
                <select className="bg-white text-black "
                        onChange={filterData}>
                    <option value="closest">closest</option>
                    <option value="largest">largest</option>
                    <option value="hazardous">hazardous</option>
                </select>
            
        </div>

        <div className="flex flex-row gap-4">
        { AsteroidData.length>0 && AsteroidData.map((values,index)=>(
        
        <div key={index} className={`flex flex-col border border-slate-200 rounded-lg  w-full max-w-md  ${highlight === index ?"scale-110":""}`}
                        onMouseOver={()=>setHighlight(index)} 
                    onMouseLeave={()=>setHighlight(null)}
        >
            <div className={`bg-blue-900 text-center rounded-t `} >
                <p>{values.name}</p>
            </div>
            <div className={`space-y-1 p-3`}

            >
                <p >Miss distance:{values.distance}</p>
                <p >Miss date:{values.missdate}</p>
                <p >Potentially hazardous: {values.hazardous}</p>
                <p >Min Est Diameter: {values.minDiameter}</p>
                <p >Max Est Diameter: {values.maxDiameter}</p>
            </div>
        </div>

        
         ))}
        </div>
     
       
        </main>
        </div>

        /* { AsteroidData.length>0 && AsteroidData.map((values,index)=>
        <p key={index}> {values.name} {values.distance}</p> */
        /* <table>
            <thead>
                <tr>
                    <th className="p-1">Name</th>
                    <th className="p-1">Miss distance</th>
                    <th className="p-1">Miss date</th>
                    <th className="p-1">Min Est Diameter</th>
                    <th className="p-1">Max Est Diameter</th>
                    <th className="p-1">Potentially Hazardous</th>
                </tr>
            </thead>
            <tbody>
                { AsteroidData.length>0 && AsteroidData.map((values,index)=>
                <tr key={index} 
                    className={`${highlight === index ?"bg-white":""} `}
                    onMouseOver={()=>setHighlight(index)} 
                    onMouseLeave={()=>setHighlight(null)}
                >  
                  <td className={`p-1 ${highlight === index ?"text-black":""}`} > {values.name} </td>
                  <td className={`p-1 ${highlight === index ?"text-black":""}`}> {values.distance} </td>
                  <td className={`p-1 ${highlight === index ?"text-black":""}`} > {values.missdate} </td>
                  <td className={`p-1 ${highlight === index ?"text-black":""}`} > {values.minDiameter} </td>
                  <td className={`p-1 ${highlight === index ?"text-black":""}`} > {values.maxDiameter} </td>
                  <td className={`p-1 ${highlight === index ?"text-black":""}`} > {values.hazardous} </td>
                </tr>
            )}
            </tbody>
        </table>
         */

    );
    
};



export default Asteroid