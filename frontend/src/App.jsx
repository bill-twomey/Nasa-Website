import React from 'react';
import { BrowserRouter as Router,Route,Link,Routes} from 'react-router-dom';
import Apod from './pages/apod'
import Asteroid from './pages/asteroid'
import Header from './components/header'
import Home from './pages/home'



const App =() => {
  return (
  <Router>
    <Header/>
    {/* <nav>
      <ul>
        <li> <Link to="/Apod"> Apod page </Link></li>
        <li> <Link to="/Asteroid"> Asteroid page </Link> </li>
      </ul>
    </nav> */}
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/apod" element={<Apod/>}/>
      <Route path="/asteroid" element={<Asteroid/>}/>

    </Routes>

  </Router>
  )
}

export default App;