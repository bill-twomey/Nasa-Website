// App js
// Handles routing and 
// Hides header on home page


import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useLocation,
} from "react-router-dom";
import Apod from "./pages/apod";
import Asteroid from "./pages/asteroid";
import Header from "./components/header";
import Home from "./pages/home";

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      {!isHomePage && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apod" element={<Apod />} />
        <Route path="/asteroid" element={<Asteroid />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
export default App;
