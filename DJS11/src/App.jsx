import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  //State to store the fetched podcasts previews
  const [podcasts, setPodcasts] = useState([]);
  //State for the selected podcast for the modal
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  //State to manage the modal's visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Handle opening the modal and setting the selected podcast
  const openModal = (podcast) => {
    setSelectedPodcast(podcast);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPodcast(null);
  };


  return (
    <>
      <div className="podcasts-container">
        <h1>Podcasts list</h1>
        <div className="podcasts-list">
          {podcasts.length > 0 ? (
            podcasts.map((podcast) => (
              <div key={podcast.id} className="podcast-card" onClick={() => openModal(podcast)}>
                <div className="podcast-image-container">
                  <img src={podcast.image} alt={podcast.title} className="podcast-image"/>
                </div>
              </div>
          ))
          ) : (
            <p>loading podcasts...</p>
          )}
        </div>
      </div>

      {isModalOpen && selectedPodcast && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>{selectedPodcast.title}</h2>
          <p>Description: {selectedPodcast.description}</p>
                <div className="podcast-genres">
                  {selectedPodcast.genres && selectedPodcast.genres.length > 0 ? (
                  selectedPodcast.genres.map((genreId) => {
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
                <p>Seasons: {selectedPodcast.seasons}</p>
                <button onClick={closeModal}>Close</button>

          </div>
        </div>
      )}
    </>
  )
}

export default App
