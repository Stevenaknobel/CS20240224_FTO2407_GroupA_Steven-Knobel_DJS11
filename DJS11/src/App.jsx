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
  //State to track the selected season (default to first season)
  const [selectedSeason, setSelectedSeason] = useState(0);
  //State to store the episode of the selected season
  const [episodes, setEpisodes] = useState([]);
  //State to store ALL the genres from the original API request and not the second one
  const [podcastGenres, setPodcastGenres] = useState({});
  //State for the currently selected genres based on the open modal
  const [selectedGenres, setSelectedGenres] = useState([]);
  //State to store selected episode for audio player
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  //State for if audio is playing or not
  const [isPlaying, setIsPlaying] = useState(false);
  //State to track which episodes are being previewed
  const [expandedEpisode, setExpandedEpisode] = useState(null);
  


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
          //Save the genres from the first API response by its ID
          const genresMap = {};
          data.forEach(podcast => {
            //Store genres in the map by the podcasts ID
            genresMap[podcast.id] = podcast.genres;
          });

          //save the genres to state
          setPodcastGenres(genresMap);
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
    //use the stored genres from the first API request
    const podcastGenresForSelected = podcastGenres[podcast.id] || [];
    //this ensure that the genres are not pulling from the second API as they are different
    setSelectedGenres(podcastGenresForSelected);
    fetchPodcastDetails(podcast.id);
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPodcast(null);
    //Resets the episodes when the modal is closed
    setEpisodes([]);
    //Resets the selected season back to default (which is season 1)
    setSelectedSeason(0);
  };

  //Handle the episode click
  const handleEpisodeClick = (episode) => {
    if (expandedEpisode === episode) {
      //hide the description if already expanded
      setExpandedEpisode(null);
    } else {
    //Show the description of the clicked episode
    setExpandedEpisode(episode);
    }
  };

  //Handle the audio playing
  const handlePlayClick = (episode) => {
    if (selectedEpisode === episode && isPlaying) {
      //pause audio if already playing
      setIsPlaying(false);
    }
    //Set the selected episode for audio
    setSelectedEpisode(episode);
    //Start playing the audio
    setIsPlaying(true);
  };

  //Fetch the podcast details (seasons and episodes) based on their ID
  const fetchPodcastDetails = async (podcastId) => {
    try {
      console.log(`Fetching details for podcast ID: ${podcastId}`);
      const response = await fetch(`https://podcast-api.netlify.app/id/${podcastId}`);
      const detailedData = await response.json();
      //console log for if successful
      console.log('Detailed podcast data:', detailedData);
      //Set the selected podcast with the detailed data
      //validate if seasons is an array
      if (Array.isArray(detailedData.seasons)) {
      setSelectedPodcast(detailedData);
      //Set episodes of the first season as the default
      setEpisodes(detailedData.seasons[0]?.episodes || []);
      } else {
        //add a console error to test if data is not an array
        console.error("Seasons data is not an array")
      }
      //catch error incase the request fails
      } catch (error) {
      console.error('Error fetching detailed data:', error);
      }
    };

  //Handle the season change
  const handleSeasonChange = (event) => {
    const seasonIndex = parseInt(event.target.value);
    if (selectedPodcast?.seasons) {
    setSelectedSeason(seasonIndex);
    setEpisodes(selectedPodcast.seasons[seasonIndex]?.episodes || []);
    }
  };

  //this useEffect ensures the seasons array is available before trying  to render it
  useEffect(() => {
    if (selectedPodcast && Array.isArray(selectedPodcast.seasons)) {
      //If the first season exists, then set the first seasons episodes by default
      setEpisodes(selectedPodcast.seasons[0]?.episodes || []);
    }
    //hook runs whenever selectedPodcast changes
  }, [selectedPodcast]);


  return (
    <>
      <div className="podcasts-container">
        <h1>Podcasts list</h1>
        <div className="podcasts-list">
          {podcasts.length > 0 ? (
            podcasts
            //sort the podcasts alphabetically
            .sort((a, b) => a.title.localeCompare(b.title))
            //map the podcasts from the array
            .map((podcast) => (
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
          <p><strong>Description:</strong> {selectedPodcast.description}</p>
                <div className="podcast-genres">
                  {selectedGenres && selectedGenres.length > 0 ? (
                  selectedGenres.map((genreId, index) => {
                    console.log("Genre ID:", genreId);
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
                    //Get the genre name or fallback to "Unknown"
                    const genreName = genreNames[genreId] || "Unknown Genre";

                    return (
                      <div key={genreId || index}>
                        <strong>Genre: </strong>
                      <span className="podcast-genre">
                        {genreName}
                      </span>
                      </div>
                    );
                  })
                ) : (
                  <span>No genres available</span>
                )}
              </div>
              <label htmlFor="season-select">Select Season:</label>
                <select id="season-select" value={selectedSeason} onChange={handleSeasonChange}>
                  {Array.isArray(selectedPodcast?.seasons) && selectedPodcast.seasons.length > 0 ? (
                  selectedPodcast.seasons.map((season, index) => (
                    <option key={season.season || season.id || index} value={index}>
                      {season.title}
                    </option>
                  ))
                  ) : (
                    <option disable>No seasons available</option>
                  )}
                </select>

                <div className="episodes-list">
                  {episodes.length > 0 ? (
                    episodes.map((episode) => (
                      <div key={episode.episode} className="episode-container">
                        <div className="episode-title-container">
                          <button 
                          className="play-button"
                          onClick={(e) => {
                            //prevent triggering the episode description toggle
                            e.stopPropagation();
                            //Start playing the selected episode
                            handlePlayClick(episode);
                          }}
                          >
                            {isPlaying && selectedEpisode === episode ? "Pause" : "Play"}
                          </button>
                        <h5 
                        onClick={() => handleEpisodeClick(episode)} 
                        className="episode-title"
                        >
                          Episode {episode.episode}: {episode.title}
                          </h5>
                          </div>

                        <div className="episode-description-container">
                      {expandedEpisode === episode && (
                        <p className="episode-description">
                        {episode.description}
                        </p>

                      )}
                         </div>
                      </div>
                    ))
                  ) : (
                    <p>No episodes available for this season</p>
                  )}
                </div>
                <button onClick={closeModal}>Close</button>
            </div>
          </div>
      )}

      {selectedEpisode && (
        <div className="audio-player">
          <h3>Now Playing: {selectedEpisode.title}</h3>
          <audio 
          controls
          autoPlay={isPlaying} 
          //automatically stop the audio player when the episode ends
          onEnded={() => setIsPlaying(false)}
          //re-render the player when the episode is changed
            key={selectedEpisode.episode}
            >
            <source src={selectedEpisode.file} type="audio/mp3"/>
            Your browser does not support that audio element
          </audio>
        </div>
      )}
    </>
  )
}

export default App
