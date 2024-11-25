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
                <div className="podcast-genres">
                  {podcast.genres && podcast.genres.length > 0 ? (
                  podcast.genres.map((genreId) => {
                    // Map genreId to genre name based on the readme
                    const genreNames = {
                      1: "Personal Growth",
                      2: "Investigative Journalism",
                      3: "History",
                      4: "Comedy",
                      5: "Entertainment",
                      6: "Business",
                      7: "Fiction",
                      8: "News",
                      9: "Kids and Family"
                    };

                    return (
                      <span key={genreId} className="podcast-genre">
                        {genreNames[genreId] || "Unknown Genre"}
                      </span>
                    );
                  })
                ) : (
                  <span>No genres available</span>
                )}
              </div>
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
