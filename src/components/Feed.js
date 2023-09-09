import React, { useState, useEffect, Fragment } from 'react';
import '../css/Feed.css';
import { db } from '../firebase';
import {collection, query, orderBy, onSnapshot} from 'firebase/firestore'
import { useAuth } from './auth/AuthContext';

const FeedPage = () => {
  const [feedData, setFeedData] = useState([]);
  const {authUser} = useAuth();

    const loadImage = (imageUrl) => {
      return import(`./images/${imageUrl}`).then((imageModule) => imageModule.default);
    };

    useEffect(() => {
      const feedRef = collection(db, 'feed');
  
      const q = query(feedRef, orderBy('time', 'desc'))
  
      onSnapshot(q, (snapshot) => {
        let feed = []
        snapshot.docs.forEach((doc) => {
          feed.push({
            ...doc.data()
          })
          setFeedData(feed)
        })
      })
    }, []);
    // console.log('feedData[0]')
    // console.log(feedData[0]);
  
  const ImageLoader = ({ imageUrl, alt }) => {
    const [image, setImage] = useState(null);

    useEffect(() => {
      loadImage(imageUrl)
        .then((loadedImage) => {
          setImage(loadedImage);
        })
        .catch((error) => {
          console.error('Error loading image:', error);
        });
    }, [imageUrl]);

  return (
    <Fragment>
      {image && <img src={image} alt={alt} />}
    </Fragment>
  );
};
  
if (!authUser) {
  return (
    <div className="event-button-container">
      <p>Please log in to access this feature.</p>
    </div>
  );
}

  return (
    <div className="feed-container">
      <h1>Latest Events...</h1>
      <div className="feed-list">
        {feedData.map((entry) => (
          <div key={entry.id} className="feed-entry">
            <h3>{entry.eventName}</h3>
            {/* <p>{entry.time.toDate()}</p>  */}
            <p><b>{entry.playerName}</b> {entry.eventString}</p>
            <div className="feed-content">
              <p>Event Score: {entry.eventScore}</p>
              {entry.eventImageUrl && (
                <ImageLoader imageUrl={entry.eventImageUrl} alt={entry.eventName} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default FeedPage;