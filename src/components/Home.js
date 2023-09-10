// HomePage.js
import React, { useState, useEffect } from 'react';
import mrRuddles from './images/Mr_Ruddles.jpg'; // Replace with the actual path to your image file
import {db, auth} from '../firebase';
import {collection, onSnapshot} from 'firebase/firestore';


const HomePage = () => {
  const [feedData, setFeedData] = useState([])
  const [feedCount, setFeedCount] = useState({})

  useEffect(() => {
    const feedRef = collection(db, 'feed');

    const calculateEventCounts = (data) => {
      const eventNameCount = {};
      for (const classObj of data) {
        const { eventName } = classObj;
        if (eventName in eventNameCount) {
          eventNameCount[eventName]++;
        } else {
          eventNameCount[eventName] = 1;
        }
      }
      setFeedCount(eventNameCount);
    };

    onSnapshot(feedRef, (snapshot) => {
      let feed = [];
      snapshot.docs.forEach((doc) => {
        feed.push({
          ...doc.data(),
        });
      });
      setFeedData(feed);
      calculateEventCounts(feed); // Call the function here with updated feedData
    });
  }, []);

  return (
    <div>
    <div>
      <h1>Welcome to THE RUDDLES BEST BITTER CHALLENGE 2023</h1>
      <img src={mrRuddles} alt="Home" width="100" height="100"/>
      <p><a href='https://www.gofundme.com/f/joels-dash-to-cambridge'>Please Support Joel's mad dash to Cambridge!</a></p>

    </div>

    <div>
    <h2>Event Count</h2>
    <table>
      <tbody>
        {Object.entries(feedCount).map(([eventName, count]) => (
          <tr key={eventName}>
            <td>{eventName}</td>
            <td>{count}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    </div>
  );
};

export default HomePage;
