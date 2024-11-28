import React from 'react';

function Favourites({ favourites }) {
  if (favourites.length === 0) {
    return <p>No favourites added yet.</p>;
  }

  return (
    <div className="favourites-container">
      <h2>Your Favourites</h2>
      <ul>
        {favourites.map((fav, index) => (
          <li key={index}>
            <h3>{fav.podcastName} - {fav.season}</h3>
            <p>Episode {fav.episode.episode}: {fav.episode.title}</p>
            <p>Favourite Added: {fav.timestamp}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Favourites;