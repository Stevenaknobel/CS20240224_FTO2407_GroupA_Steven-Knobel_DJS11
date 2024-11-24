import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
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
<h1>Default text</h1>
      </div>
      
    </>
  )
}

export default App
