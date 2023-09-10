// Leaderboard.js
import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom'
import '../css/Leaderboard.css';
import { db } from '../firebase';
import {collection, query, orderBy, onSnapshot, addDoc, doc, setDoc} from 'firebase/firestore'
import { useAuth } from './auth/AuthContext';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  //Pop up states
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const {authUser} = useAuth();


  useEffect(() => {
    const playersRef = collection(db, 'players');

    const q = query(playersRef, orderBy('score', 'desc'));

    onSnapshot(q, (snapshot) => {
      const newLeaderboard = []; // Create a new array to accumulate data

      snapshot.docs.forEach((doc) => {
        newLeaderboard.push({
          ...doc.data()
        });
      });
      console.log(newLeaderboard)
      setLeaderboard(newLeaderboard); // Update the state once after the loop is complete
    });
  }, []); // Empty dependency array to run the effect once

  const showPopup = (message) => {
    setPopupMessage(message);
    setPopupVisible(true);
    setTimeout(() => {
      setPopupVisible(false);
    }, 4000); // Hide the pop-up after 4 seconds
  };

  const handlePlayer = (name) => {

    const emailExistsInLeaderboard = leaderboard.some((entry) => entry.user === authUser.email);

    if (emailExistsInLeaderboard) {
      showPopup('You\'ve already signed up!');
      return;
    }

    const playersRef = collection(db, 'players');
    const newPlayer = {
      name: name.trim(),
      score: 0,
      user: authUser.email
    };
    // Get a reference to the "players" collection

    //addDoc(playersRef,newPlayer)

    setDoc(doc(db, 'players', authUser.email), newPlayer)
      .then((docRef) => {
        console.log('Player added with email:', docRef.id);
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
          showPopup('Please Enter Your Desired Display Name!');
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
      {popupVisible && <div className="popup">{popupMessage}</div>}
    </div>
    </div>
  );
};

export default Leaderboard;