import React, { useState, useEffect } from 'react';
// For accessing the filter params passed from Navbar
import { useLocation } from 'react-router-dom';
import './App.css'


function Favourites({ favourites, selectedEpisode, isPlaying, handlePlayClick }) {
  if (favourites.length === 0) {
    return <h1>No favourites added yet.</h1>;
  }

  const location = useLocation();
  // Default to empty if no state passed
  const { selectedGenre, searchQuery, sortOption } = location.state || {};  

  const [filteredFavourites, setFilteredFavourites] = useState(favourites);

  useEffect(() => {
    // Whenever filter parameters or favourites change, apply the filtering logic
    filterFavourites(searchQuery, sortOption);
  }, [searchQuery, sortOption, favourites]);

  const filterFavourites = (searchQuery, sortOption) => {
    //copy of the favourites array
    let filtered = [...favourites];

    // Apply search filter (based on podcast title)
    if (searchQuery && searchQuery.trim() !== '') {
      filtered = filtered.filter(fav =>
        fav.podcastName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        fav.episode.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting based on the 'updated' field of the podcast
    if (sortOption === 'a-z') {
        filtered.sort((a, b) => a.podcastName.localeCompare(b.podcastName));
      } else if (sortOption === 'z-a') {
        filtered.sort((a, b) => b.podcastName.localeCompare(a.podcastName));
      } else if (sortOption === 'newest') {
        // Sort based on the 'updated' field of the podcast (most recent first)
        filtered.sort((a, b) => new Date(b.updated) - new Date(a.updated));
      } else if (sortOption === 'oldest') {
        // Sort based on the 'updated' field of the podcast (oldest first)
        filtered.sort((a, b) => new Date(a.updated) - new Date(b.updated));
      }
  
      setFilteredFavourites(filtered);
    };

  if (filteredFavourites.length === 0) {
    return <h1>No favourites found for the given filters.</h1>;
  }

  console.log (favourites)

  return (
    <div className="favourites-container">
      <h2>Your Favourites</h2>
      <div className="favourites-styling">
      <ul>
        {filteredFavourites.map((fav, index) => (
          <li key={index}>
            <h3>{fav.podcastName} - {fav.season}</h3>
            <h3>Episode {fav.episode.episode}: {fav.episode.title}</h3>

            <p>Favourite Added: {fav.timestamp}</p>
             {/* Play/Pause button */}
             <div className="play-button-favourites">
             <button 
              onClick={() => handlePlayClick(fav.episode)}
              className="play-button"
            >
              {isPlaying && selectedEpisode === fav.episode ? "Pause" : "Play"}
            </button>
            </div>
          </li>
        ))}
        </ul>
        </div>
        </div>
  );
}


export default Favourites;