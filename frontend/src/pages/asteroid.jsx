import { useEffect,useState } from "react";
import earth from '../assets/earth.jpg';
import asteroid from '../assets/asteroid.png';

const Asteroid=() => {

    const [AsteroidData,setAsteroidData] =useState([])
    const [highlight,setHighlight]=useState(null)
    // const [highlightAst,setHighlightAst]=useState(null)
  
    

    useEffect (() => {

        const fetchdata = async ()=> {
            try {
                const res=await fetch('http://localhost:3000/api/asteroid',{mode:"cors"});
                const data =await res.json();
                setAsteroidData(data);
                
            }
            catch(error) {
                console.error(error)
            }
        }
        fetchdata();
    },[]
    )
    //    const highlightdata = () => {
    //       setHighlight(true)

    //    }
    
    return (

        <div className="bg-black min-h-screen text-white p-8 ">
        <main className="max-w-4xl mx-auto space-y-6 flex flex-col">
        <h2 className="font-bold ">Asteroids</h2>

        <div className="relative h-[300px]">
            <img className="absolute left-0 top-1/2 -translate-y-1/2 max-h-[150px] max-w-[150px]"src={earth} alt="earth"/>

             {AsteroidData.length>0 && AsteroidData.map((values,index) => {
                const scaled=(Math.round(values.distance*0.0001))
                return (
                <img key={index}
                    className = {` absolute left-0 top-1/2 -translate-y-1/2 object-contain  ${highlight===index ? "scale-120":""}`}
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
        
        {/* { AsteroidData.length>0 && AsteroidData.map((values,index)=>
        <p key={index}> {values.name} {values.distance}</p> */}
        <table>
            <tbody>
                { AsteroidData.length>0 && AsteroidData.map((values,index)=>
                <tr key={index} 
                    className={highlight === index ?"bg-white":""} 
                    onMouseOver={()=>setHighlight(index)} 
                    onMouseLeave={()=>setHighlight(null)}
                >  
                  <td className={highlight === index ?"text-black":""} > {values.name} </td>
                  <td className={highlight === index ?"text-black":""} > {values.distance} </td>
                </tr>
            )}
            </tbody>
        </table>
        
        </div>
       
        </main>
        </div>

       

    );

};

export default Asteroid