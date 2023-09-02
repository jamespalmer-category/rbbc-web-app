// App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Leaderboard from './components/Leaderboard';
import Feed from './components/Feed';
import Home from './components/Home';
import Player from './components/Player';
import Login from './components/Login';


const App = () => {
  return (
    <BrowserRouter>
      <div>
        <nav className="navbar">
              <Link to="/">Home</Link> 
              <Link to="/Leaderboard">Leaderboard</Link> 
              <Link to="/Feed">Feed</Link> 
              <Link to="/Player">Report Event</Link>
              {/* <Link to="/Login">Login</Link> */}
        </nav>

        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/Leaderboard" element={<Leaderboard/>}/>
          <Route path="/Feed" element={<Feed/>}/>
          <Route path="/Player"element={<Player/>}/>
          {/* <Route path="/Login"element={<Login/>} /> */}
        </Routes>
      </div>
    </BrowserRouter>
    
  );


};

export default App;