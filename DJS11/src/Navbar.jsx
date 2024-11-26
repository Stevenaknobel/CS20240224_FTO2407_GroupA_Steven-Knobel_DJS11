import React, {useState} from 'react';
import './App.css'

function Navbar({ podcasts, setFilteredPodcasts}) {
//State to store the selected genre
const [seletedGenre, setSelectedGenre] = useState('')
//List of static genre names as these dont change
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
    if (genre) {
        const filtered = podcasts.filter((podcast) =>
        podcast.genres.includes(parseInt(genre))
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
            className="genre-button"
            onClick={() => handleGenreSelect("")}
            >All Genres
            </button>
            <button className="genre-button" onClick={() => handleGenreSelect(1)}>Personal Growth</button>
            <button className="genre-button" onClick={() => handleGenreSelect(2)}>Investigative Journalism</button>
            <button className="genre-button" onClick={() => handleGenreSelect(3)}>History</button>
            <button className="genre-button" onClick={() => handleGenreSelect(4)}>Comedy</button>
            <button className="genre-button" onClick={() => handleGenreSelect(5)}>Entertainment</button>
            <button className="genre-button" onClick={() => handleGenreSelect(6)}>Business</button>
            <button className="genre-button" onClick={() => handleGenreSelect(7)}>Fiction</button>
            <button className="genre-button" onClick={() => handleGenreSelect(8)}>News</button>
            <button className="genre-button" onClick={() => handleGenreSelect(9)}>Kids and Family</button>
        </div>
    </div>
);
}



export default Navbar;