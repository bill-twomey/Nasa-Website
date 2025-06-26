
function sortbydistance(allAsteroids) {
    return allAsteroids.sort((a,b)=> {
    const aDist = parseFloat(a.close_approach_data[0].miss_distance.kilometers);
    const bDist = parseFloat(b.close_approach_data[0].miss_distance.kilometers);
    return aDist-bDist
  });
}

function sortbylargest(allAsteroids) {
    return allAsteroids.sort((a,b)=> {
    const aDiameter = parseFloat(a.estimated_diameter.meters.estimated_diameter_max);
    const bDiameter = parseFloat(b.estimated_diameter.meters.estimated_diameter_max);
    return bDiameter-aDiameter
  });
}

function sortbyhazardous(allAsteroids) {
  
  return allAsteroids.filter(a => a.is_potentially_hazardous_asteroid)
    
  }



  module.exports = {
    sortbydistance,
    sortbylargest,
    sortbyhazardous
  }