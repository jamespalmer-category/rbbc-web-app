// Leaderboard.js
import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom'
import '../css/Leaderboard.css';
import { db } from '../firebase';
import {collection, query, orderBy, onSnapshot, setDoc, doc} from 'firebase/firestore'
import { useAuth } from './auth/AuthContext';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  //Pop up states
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const {authUser} = useAuth();


  //real time data collection
  useEffect(() => {
    const playersRef = collection(db, 'players');

    const q = query(playersRef, orderBy('score', 'desc'))

    onSnapshot(q, (snapshot) => {
      let leaderboard = []
      snapshot.docs.forEach((doc) => {
        leaderboard.push({
          ...doc.data()
        })
        setLeaderboard(leaderboard)
      })
    })
  }, []);

  const showPopup = (message) => {
    setPopupMessage(message);
    setPopupVisible(true);
    setTimeout(() => {
      setPopupVisible(false);
    }, 4000); // Hide the pop-up after 4 seconds
  };

  const handlePlayer = (name) => {
    const playersRef = collection(db, 'players'); 
    // Add a function where it'll check if the name is unique on the leaderboard, with a pop-up that says what the issue is.
    // const q = query(playersRef, where("name", "==", name))
    // console.log("query result:", q)
    // console.log(!q)
    // if (!q) {
    //   showPopup('Name already entered!');
    //   return;
    // }
    const newPlayer = {
      id: leaderboard.length+1,
      name: name.trim(),
      score: 0
    };
    // Get a reference to the "players" collection
    
    setDoc(doc(playersRef, String(newPlayer.id)),newPlayer)
      .then((docRef) => {
        console.log('Player added with ID:', docRef.id);
      })
      .catch((error) => {
        console.error('Error adding player:', error);
      });
    };

    if (!authUser) {
      return (
        <div className="event-button-container">
          <p>Please log in to access this feature.</p>
        </div>
      );
    }

  return (
    <div>
      <div className="leaderboard-container">
        <h2>Leaderboard</h2>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player)=> (
              <tr key={player.index}>
                   <td>{player.name}</td>
                   <td>{player.score}</td>
              </tr>
            )) }
          </tbody>
      </table>
      </div>

    <div className="form-container">
      <h2>Sign Up!</h2>
      <form className="form-section" action="" onSubmit={(e) => {
        e.preventDefault();
        const name = e.target.name.value;
        if (!name.trim()) {
          showPopup('Please Enter Your Name!');
          return;
        }
        handlePlayer(name);
        e.target.reset()}}>
          <div className='mb-3'>
              <label className='mb-3' htmlFor="name"><strong>Name</strong></label>
              <input type="text" placeholder='Enter Name' name='name'/>
          </div>
          <button type='submit' className='leaderboard-button'>JOIN</button>
          <p>Click here to join the RUDDLES BEST BITTER CHALLENGE</p>
          <Link to='../Player'>Report progress here!</Link>
      </form>
      {/* Conditional rendering for the pop-up */}
      {popupVisible && <div className="popup">{popupMessage}</div>}
    </div>
    </div>
  );
};

export default Leaderboard;