import React, {useState} from 'react';
import './App.css'

function Navbar({ podcasts, podcastGenres, setFilteredPodcasts}) {
//State to store the selected genre
const [selectedGenre, setSelectedGenre] = useState('')

  // List of static genre names
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

//Handle genre selection
const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    filterPodcastsByGenre(genre);
};

//Filter podcasts based on the selected genre
const filterPodcastsByGenre = (genre) => {
    if (!podcastGenres) {
        console.error("podcastGenres is not defined!");
        return;
      }
    if (genre) {
        //make sure ID is a number
        const genreNumber = parseInt(genre);
        //get all podcast ids whose genres include the selected genre
        const filteredPodcastIds = Object.keys(podcastGenres).filter(podcastId => {
            return podcastGenres[podcastId].includes(genreNumber);
        });
        //Now, filter the podcasts based on these IDs
        const filtered = podcasts.filter(podcast =>
            filteredPodcastIds.includes(podcast.id.toString())
    );
    setFilteredPodcasts(filtered);
    } else {
    //reset filtering if no genre selected
    setFilteredPodcasts(podcasts);
    }
};

return (
    <div>
        <h1>NavBar</h1>
        <div className="genre-buttons">
            <button
            // Highlight the "All Genres" button
        className={`genre-button ${selectedGenre === '' ? 'active' : ''}`} 
        onClick={() => handleGenreSelect('')}
      >
        All Genres
      </button>
      {Object.keys(genreNames).map((genreId) => (
        <button
          key={genreId}
          // Highlight the selected genre button
          className={`genre-button ${selectedGenre === genreId ? 'active' : ''}`} 
          onClick={() => handleGenreSelect(genreId)}
        >
          {genreNames[genreId]}
        </button>
      ))}
        </div>
    </div>
);
}



export default Navbar;