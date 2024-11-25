import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  //State to store the fetched podcasts previews
  const [podcasts, setPodcasts] = useState([]);

    // Fetch the array of podcasts with a useEffect
    useEffect(() => {
      const fetchPreviews = async () => {
        try {
          //console log to check the previews are being pulled
          console.log('Fetching podcast previews...');
          const response = await fetch('https://podcast-api.netlify.app/');
          const data = await response.json();
          //console log for if successful
          console.log('Fetched previews:', data);
          //set the fetched data to state
          setPodcasts(data);
          //catch error incase the request fails
        } catch (error) {
          console.error('Error fetching previews:', error);
        }
      };
  //call the fetchPreviews const
      fetchPreviews();
    }, []);  // Empty dependency array means this will run once after the component mounts

  return (
    <>
      <div>
        <h1>Podcasts list</h1>
        <div>
          {podcasts.length > 0 ? (
            podcasts.map((podcast) => (
              <div key={podcast.id} className="podcast-card">
                <h2>Title: {podcast.title}</h2>
                <img src={podcast.image} alt={podcast.title} className="podcast-image"/>
                <p>Description: {podcast.description}</p>
                <p>Genres: {podcast.genres}</p>
                <p>Seasons: {podcast.seasons}</p>
        </div>
          ))
          ) : (
            <p>loading podcasts...</p>
        )}
      </div>
      </div>
    </>
  )
}

export default App
