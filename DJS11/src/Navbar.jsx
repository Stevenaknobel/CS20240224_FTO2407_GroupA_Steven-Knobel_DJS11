import React, {useEffect, useState} from 'react';
import './App.css';
import Fuse from 'fuse.js';
import { Link } from 'react-router-dom';

function Navbar({ podcasts, podcastGenres, setFilteredPodcasts, clearFavourites}) {
//State to store the selected genre
const [selectedGenre, setSelectedGenre] = useState('');
const [searchQuery, setSearchQuery] = useState('');
const [sortOption, setSortOption] = useState('a-z');

const handleDeleteFavouritesClick = () => {
    // Display a confirmation dialog before proceeding
    const isConfirmed = window.confirm("Are you sure you want to delete all favourites?");
    if (isConfirmed) {
      // If confirmed, call the clearFavourites function
      clearFavourites();
    }
  };

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
    //call filter with genre
    filterPodcasts(genre, searchQuery, sortOption);
};

//Handle search query change
const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    //call filter with search query
    filterPodcasts(selectedGenre, query, sortOption)
};

//Handle sort option change
const handleSortChange = (event) => {
    const option = event.target.value;
    setSortOption(option);
    //call filter with sort option
    filterPodcasts(selectedGenre, searchQuery, option);
};

//Filter podcasts based on the selected genre
const filterPodcasts = (genre, searchQuery, sortOption) => {
    let filtered = [...podcasts];

      //apply genre filter
    if (genre) {
        //make sure ID is a number
        const genreNumber = parseInt(genre);
        //get all podcast ids whose genres include the selected genre
        const filteredPodcastIds = Object.keys(podcastGenres).filter(podcastId => {
            return podcastGenres[podcastId].includes(genreNumber);
        });
        //Now, filter the podcasts based on these IDs
        filtered = filtered.filter(podcast =>
            filteredPodcastIds.includes(podcast.id.toString())
    );
}

    //apply search filter
    if (searchQuery.trim() !== '') {
        const fuse = new Fuse(filtered, { keys: ['title'], threshold: 0.3});
        filtered = fuse.search(searchQuery).map(result => result.item);
    }

    //apply sorting
    if (sortOption === 'a-z') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'z-a') {
        filtered.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortOption === 'newest') {
        filtered.sort((a, b) => new Date(b.updated) - new Date(a.updated));
    } else if (sortOption === 'oldest') {
    filtered.sort((a, b) => new Date(a.updated) - new Date(b.updated));
    }

    //Update the filtered podcasts
    setFilteredPodcasts(filtered);
};


    useEffect(() => {
        // Initial filter when podcasts are loaded
        filterPodcasts(selectedGenre, searchQuery, sortOption);
          // Re-run the filter whenever podcasts or genres change
    }, [podcasts, podcastGenres, selectedGenre, searchQuery, sortOption]);

return (
    <div className="navbar-genre-container">
        <div className="navbar-container">
        <h1 className="navbar-title">The Podcast Hotspot</h1>
        <div className="search-sort-container">
        <Link to="/">
        <button className="home-button">Home</button>
        </Link>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search podcasts..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />

        {/* Sorting Dropdown */}
        <select value={sortOption} onChange={handleSortChange} className="sort-dropdown">
          <option value="a-z">A-Z</option>
          <option value="z-a">Z-A</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
      <div className="navbar-buttons">

      <Link to="/favourites">
        <button className="favourite-button">Click To View My Favourites</button>
        </Link>
        <button onClick={handleDeleteFavouritesClick} className="delete-favourite-button">Delete Favourites</button>
      </div>
      </div>
        {/* Genre buttons*/}
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