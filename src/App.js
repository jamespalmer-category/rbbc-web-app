// App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Leaderboard from './components/Leaderboard';
import Feed from './components/Feed';
import Home from './components/Home';
import Player from './components/Player';
import LoginPage from './components/LoginPage';
import AuthDetails from './components/auth/AuthDetails';


const App = () => {
  return (
    <BrowserRouter>
      <div>
        <nav className="navbar">
          <div className="navbar-links">
              <Link to="/">Home</Link> 
              <Link to="/Leaderboard">Leaderboard</Link> 
              <Link to="/Feed">Feed</Link> 
              <Link to="/Player">Report Event</Link>
          </div>
          <div class="auth-details">
              <AuthDetails/>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/Leaderboard" element={<Leaderboard/>}/>
          <Route path="/Feed" element={<Feed/>}/>
          <Route path="/Player" element={<Player/>}/>
          <Route path="/LoginPage" element={<LoginPage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
    
  );


};

export default App;