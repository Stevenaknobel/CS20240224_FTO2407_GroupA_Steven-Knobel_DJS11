import { useState, useEffect, useRef } from 'react'
import './App.css'
import Navbar from './Navbar'
import { Routes, Route } from 'react-router-dom';
import Favourites from './Favourites';

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
  //State to store ALL the seasons from the original API request and not the second one
  const [podcastSeasons, setPodcastSeasons] = useState({});
  //State for the currently selected genres based on the open modal
  const [selectedGenres, setSelectedGenres] = useState([]);
  //State to store selected episode for audio player
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  //State for if audio is playing or not
  const [isPlaying, setIsPlaying] = useState(false);
  //State to track which episodes are being previewed
  const [expandedEpisode, setExpandedEpisode] = useState(null);
  //State to store when data is loaded to ensure correct rendering in the dom
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  //Loading state for the initial data fetch
  const [loading, setLoading] = useState(true);
  //Loading state for the second API request when open the modal
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  //State to store filtered podcasts
  const [filteredPodcasts, setFilteredPodcasts] = useState([]);
  //State to store favourited episodes
  const [favourites, setFavourites] = useState(() => {
    // Try to load the favourites from localStorage when the app initializes
    const savedFavourites = localStorage.getItem('favourites');
    return savedFavourites ? JSON.parse(savedFavourites) : [];
  });

  //Function to handle favouriting an episode
  const handleFavouriteClick = (episode) => {
    // Create a unique identifier for each favourite by combining podcast name, season, and episode number
  const favouriteKey = `${selectedPodcast.id}-${selectedSeason}-${episode.episode}-${selectedPodcast.updated}`;

  const isAlreadyFavourited = favourites.some(fav => fav.favouriteKey === favouriteKey);

  let updatedFavourites;

  if (isAlreadyFavourited) {
    // Remove the episode from favourites if it's already favourited
    updatedFavourites = favourites.filter(fav => fav.favouriteKey !== favouriteKey);
  } else {
    // Add the episode to favourites
    updatedFavourites = [
      ...favourites,
      {
        episode,
        podcastName: selectedPodcast.title,
        season: selectedPodcast.seasons[selectedSeason]?.title,
        favouriteKey,
        timestamp: new Date().toLocaleString(),  // When the episode is added to favourites
        updated: selectedPodcast.updated,       // Last updated timestamp
      }
    ];
  }

    // Update state with the new list of favourites
    setFavourites(updatedFavourites);

    // Save the updated favourites to localStorage
    localStorage.setItem('favourites', JSON.stringify(updatedFavourites));
  };

  //Function to clear all favourites
  const clearFavourites = () => {
    setFavourites([]);
    localStorage.setItem('favourites', JSON.stringify([]));
  }
  

  //Create a ref to control the audio element directly
  const audioRef = useRef(null);


    // Fetch the array of podcasts with a useEffect
    useEffect(() => {
      const fetchPreviews = async () => {
        try {
          //console log to check the previews are being pulled
          console.log('Fetching podcast previews...');
          const response = await fetch('https://podcast-api.netlify.app/');
          const data = await response.json();
          //Save the genres and seasons from the first API response by its ID
          const genresMap = {};
          const seasonsMap = {};
          data.forEach(podcast => {
          //Store genres in the map by the podcasts ID
            genresMap[podcast.id] = podcast.genres;
          //Store the seasons if podcast has seasons
          if (typeof podcast.seasons === 'number') {
            seasonsMap[podcast.id] = podcast.seasons;
          }
          });

          //save the genres and seasons to state based on the initial API call
          setPodcastGenres(genresMap);
          setPodcastSeasons(seasonsMap);
          //set the fetched data to state
          setPodcasts(data);
          //Set isDataLoaded to true once the podcast information is fetched
          setIsDataLoaded(true);
          //Set loading data to false after data is fetched
          setLoading(false);
          //initially show all podcasts
          setFilteredPodcasts(data);
          //catch error incase the request fails
        } catch (error) {
          console.error('Error fetching previews:', error);
          setLoading(false);
        }
      };
  //call the fetchPreviews const
      fetchPreviews();
    }, []);  // Empty dependency array means this will run once after the component mounts

  // Handle opening the modal and setting the selected podcast
  const openModal = async (podcast) => {
    //Set loading state to true when the modal is clicked
    setIsFetchingDetails(true);
    setSelectedPodcast(podcast);
    setIsModalOpen(true);
    //use the stored genres from the first API request
    const podcastGenresForSelected = podcastGenres[podcast.id] || [];
    //this ensure that the genres are not pulling from the second API as they are different
    setSelectedGenres(podcastGenresForSelected);
    await fetchPodcastDetails(podcast.id);
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
    } else {
    //Set the selected episode for audio
    setSelectedEpisode(episode);
    //Start playing the audio
    setIsPlaying(true);
    }
  };
//Useeffect to manipulate the audio player around the pause/playing
  useEffect(() => {
    if (selectedEpisode && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, selectedEpisode]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      //ensure that the pop up only applies when the audio is playing
      if (audioRef.current && !audioRef.current.paused) {
        //show custom warning in browsers native confirmation dialog
        event.returnValue = "You have a podcast playing. Are you sure you want to leave?";
      }
    };

    if (isPlaying) {
    //attach the beforeunload event listener
    window.addEventListener('beforeunload', handleBeforeUnload);
    } else {
    //remove the event listener when the component unmounts
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }

      //Cleanup the event listener when the component unmounts
      return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
    //this hook triggers when the isPlaying changes
  }, [isPlaying]);
  

  //Fetch the podcast details (seasons and episodes) based on their ID
  const fetchPodcastDetails = async (podcastId) => {
    try {
      console.log(`Fetching details for podcast ID: ${podcastId}`);
      const response = await fetch(`https://podcast-api.netlify.app/id/${podcastId}`);
      const detailedData = await response.json();
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
      } finally {
        setIsFetchingDetails(false);
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
        <Navbar
        //passing podcasts prop to Navbar
        podcasts={podcasts}
        //passing podcastGenres
        podcastGenres={podcastGenres}
        //passing function to update filtered podcasts
        setFilteredPodcasts={setFilteredPodcasts}
        clearFavourites={clearFavourites}
        />

        <Routes>
          <Route
          path="*"
          element={
        <div className="podcasts-list">
          {loading ? (
            <p className="loading">Loading Podcasts...</p>
          ) : (
          filteredPodcasts.length > 0 ? (
            filteredPodcasts
            //map the podcasts from the array
            .map((podcast) => (
              <div key={podcast.id} className="podcast-card" onClick={() => openModal(podcast)}>
                <div className="podcast-card-inner">
                <div className="podcast-image-container">
                  <img src={podcast.image} alt={podcast.title} className="podcast-image"/>
                </div>
                {isDataLoaded && podcast.title && podcastSeasons[podcast.id] && (
                  <div className="podcast-info">
                  <h3>{podcast.title}</h3>
                  <h4><strong>Seasons: {podcastSeasons[podcast.id] || 0}</strong></h4>
                  <div className="podcast-genres">
                  {podcastGenres[podcast.id] && podcastGenres[podcast.id].length > 0 ? (
                    podcastGenres[podcast.id].map((genreId, index) => {
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

                      const genreName = genreNames[genreId] || "Unknown Genre";

                      return (
                        <div key={genreId || index}>
                          <span className="podcast-genre">{genreName}</span>
                        </div>
                      );
                    })
                  ) : (
                    <span>No genres available</span>
                  )}
              </div>
                </div>
                )}
                </div>
              </div>
          ))
          ) : (
            <h1>No podcasts available</h1>
          )
          )}
        </div>
          }
          />
          
          {/* Route for the Favourites page */}
          <Route 
            path="/favourites" 
            element={<Favourites
                podcasts={podcasts}
                podcastGenres={podcastGenres}
                setFilteredPodcasts={setFilteredPodcasts}
               favourites={favourites}
               selectedEpisode={selectedEpisode}
               isPlaying={isPlaying}
               handlePlayClick={handlePlayClick}
               audioRef={audioRef}
               />} 
          />
        </Routes>
      </div>

      {isModalOpen && selectedPodcast && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {isFetchingDetails ? (
              <p className="loading">Loading podcast details...</p>
            ) : (
              <>
          <h2>{selectedPodcast.title}</h2>
          <p><strong>Description:</strong> {selectedPodcast.description}</p>
                <div className="podcast-genres">
                  {selectedGenres && selectedGenres.length > 0 ? (
                  selectedGenres.map((genreId, index) => {
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
              {selectedPodcast && selectedPodcast.updated && (
                <p><strong>Last Updated:</strong> {selectedPodcast.updated.substring(0,10)}</p>
              )}
              </>
            )}
              <div className="season-select-container">
              <label htmlFor="season-select"><strong>Select Season:</strong></label>
                <select id="season-select" value={selectedSeason} onChange={handleSeasonChange}>
                  {Array.isArray(selectedPodcast?.seasons) && selectedPodcast.seasons.length > 0 ? (
                  selectedPodcast.seasons.map((season, index) => (
                    <option key={season.season || season.id || index} value={index}>
                      {season.title} ({season.episodes?.length || 0} episodes)
                    </option>
                  ))
                  ) : (
                    <option disabled>No seasons available</option>
                  )}
                </select>
                {selectedPodcast?.seasons[selectedSeason]?.image && (
                  <div className="season-image-container">
                    <img
                      src={selectedPodcast.seasons[selectedSeason].image}
                      alt={`Season ${selectedPodcast.seasons[selectedSeason].season}`}
                      className="season-image"
                      />
                      </div>
                )}
                </div>

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

                          {/* Favourite Button */}
                          <button
                            className="favourite-button"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent modal from closing when clicked
                              handleFavouriteClick(episode);
                            }}
                          >
                            {favourites.some(fav => fav.favouriteKey === `${selectedPodcast.id}-${selectedSeason}-${episode.episode}-${selectedPodcast.updated}`) 
                            ? "Click to Unfavourite" 
                            : "Click to Favourite"}
                          </button>

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


        <div className="audio-player">
        {selectedEpisode && (
          <>
          <h3>Now Playing: {selectedEpisode.title}</h3>
          <audio 
          ref={audioRef}
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
          </>

      )}
        </div>
    </>
  );
}

export default App
