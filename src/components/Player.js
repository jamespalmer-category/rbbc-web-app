// Your React component file (e.g., EventButton.js)
import React, { useState, useEffect } from 'react';
import '../css/Player.css';
import { db } from '../firebase';
import {collection,doc,onSnapshot, 
  addDoc, updateDoc, getDoc, getCountFromServer} from 'firebase/firestore'

const EventButton = () => {
  const [events, setEvents] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('{}');
  const [selectedPlayer, setSelectedPlayer] = useState('{}');
  const [popupVisible, setPopupVisible] = useState(false);
  const [feedLen, setFeedLen]=useState(0)
// Load event data from local storage on component mount
useEffect(() => {
  const EventsRef = collection(db, 'events');

  onSnapshot(EventsRef, (snapshot) => {
    let events = []
    snapshot.docs.forEach((doc) => {
      events.push({
        ...doc.data()
      })
      setEvents(events)
    })
  })
}, []);

useEffect(() => {
  const playersRef = collection(db, 'players');

  onSnapshot(playersRef, (snapshot) => {
    let players = []
    snapshot.docs.forEach((doc) => {
      players.push({
        ...doc.data()
      })
      setPlayers(players)
    })
  })
}, []);

// get the feed length
useEffect(() => {
  const feedRef = collection(db, 'feed');
    
    onSnapshot(feedRef,(snapshot) => {
      let feed = []
      snapshot.docs.forEach((doc) => {
        feed.push({
          ...doc.data()
        })
        setFeedLen(feed.length)
      })
    })
  })

  const handleEventReport = (player, event) => {

    if (player && event) {
      // Make sure player and event are valid
      if (!player.id) {
        console.error('Invalid player data');
        return;
      }
  
      // Ensure player has a score property
      if (!player.hasOwnProperty('score')) {
        console.error('Player object is missing the "score" property');
        return;
      }
  
      // Now update the player's score
      player.score += event.score;
      console.log('new score:',player.score);
      //issue on this line
      const playerRef = doc(db, 'players', String(player.id));
      updateDoc(playerRef, {
        score: player.score
      }).then(() => {
        const feedRef = collection(db, 'feed');
        const currentTime = new Date();
        console.log(currentTime)
          const newFeedEntry = {
            time: currentTime,
            id: feedLen,
            eventName: event.name,
            eventScore: event.score,
            playerName: player.name,
            eventImageUrl: event.imageUrl,
            eventString: event.string
          };
          //check right id
          console.log("id:",newFeedEntry);
          console.log("id:",newFeedEntry.id);
        
        addDoc(feedRef, newFeedEntry)
        .then((docRef) => {
          console.log('Event added with ID:', docRef.id);
        })
        .catch((error) => {
          console.error('Error adding player:', error);
        });
        });
      };
  };

  const showPopup = () => {
    setPopupVisible(true);
    setTimeout(() => {
      setPopupVisible(false);
    }, 4000); // Hide the pop-up after 4 seconds
  };

  return (
    <div className="event-button-container">
      <label>
        Select Event: 
        <select
          value={selectedEvent ? selectedEvent.id : ''}
          onChange={(e) => {
            const selectedEventId = parseInt(e.target.value, 10);
            const selectedEventObject = events.find(event => event.id === selectedEventId);
            setSelectedEvent(selectedEventObject);
          }}
        >
          <option value="">Select an event</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Select Player: 
        <select
          value={selectedPlayer ? selectedPlayer.id : ''}
          onChange={(e) => {
            const selectedPlayerId = parseInt(e.target.value, 10);
            const selectedPlayerObject = players.find(player => player.id === selectedPlayerId);
            setSelectedPlayer(selectedPlayerObject);
          }}
        >
          <option value="">Select a player</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      </label>

      <button className="event-button" onClick={() => {
  handleEventReport(selectedPlayer, selectedEvent);
  showPopup();
}}>Report Event</button>

{/* Conditional rendering for the pop-up */}
{popupVisible && <div className="popup">Event reported!</div>}
    </div>
  );
};

export default EventButton;