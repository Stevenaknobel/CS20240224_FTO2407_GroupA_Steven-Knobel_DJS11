🎧 The Podcast Hotspot | PORTFOLIO PROJECT 🎤

Welcome to the Podcast App, a web-based application designed to mimic a podcast site for podcast enthusiasts to explore, listen, and manage their favorite podcast episodes. This application allows users to browse shows, seasons, and episodes, mark their favorite episodes, and easily access their favorites for later listening.


🚀 Introduction

The Podcast App allows users to:

    Browse podcasts, seasons, and episodes from an API of over 50 different podcasts each with multiple seasons, with the ability to navigate through a modal for each season showing all episodes available.
    Play or pause podcast episodes.
    Add specific episodes to their favorites, which can then be viewed at a later date through the Navbar menu
    Filter podcasts by genres such as Comedy, History, News, and more, as well as filter based on fuzzy text and categorize to the users preference (A-Z, Z-A, Oldest or Newest)
    View a custom audio player to track their listening progress.

This app is built with React and JavaScript, leveraging hooks for managing state, and utilizes multiple external podcast API's to dynamically fetch and display podcast data. The app also includes state management for storing user preferences such as marked favorites.


🛠️ Technology Stack

    React for building the user interface.
    JavaScript and CSS for scripting and styling.
    Fetch API for making requests to the podcast API.
    Local Storage for persisting user favorites across sessions.
    React Router for navigation between pages.
    Netlify for hosting and deployment.


📦 Setup Instructions
1. Clone the repository

git clone https://github.com/Stevenaknobel/CS20240224_FTO2407_GroupA_Steven-Knobel_DJS11.git
cd podcast-app

2. Install dependencies

Once you have cloned the repository, navigate to the project folder and run the following command to install all the necessary dependencies:

npm install

3. Run the project locally

After the installation completes, you can start the development server by running:

npm start

This will open the app in your default browser at http://localhost:3000.
4. Deploying on Netlify

To deploy the app on Netlify, follow these steps:

    Build the app for production: Run the following command to build the app:

    npm run build

    This will create a production-ready version of your app in the build folder.

    Deploy to Netlify:
        If you don't already have an account, sign up at Netlify.
        Click on "New Site from Git" and connect your GitHub repository.
        Follow the prompts to deploy the site.

    Environment Variables (Optional): If your app requires environment variables, such as for API keys or configurations, set these in your Netlify dashboard under Site settings > Build & deploy > Environment.

After deployment, your app will be live on a unique Netlify URL, and you can access it through this URL.

🔧 Usage Examples
1. Browsing Shows

When you first open the app, you'll be able to see a list of podcast shows. The shows are sorted alphabetically by default.

    Each show displays its title, preview image, and the number of seasons available when you hover over the card for the podcast.
    Click on a podcast to view its available seasons, episodes and further details.

2. Playing Episodes

Each episode includes a play button. When you click Play, the episode will start playing in the audio player at the bottom of the screen. If you're already listening, the button will toggle to Pause. Once you start listening you can navigate around the site and the audio will continue and be maintained in the audio player at the bottom

3. Adding Episodes to Favourites

While browsing episodes, you can click add to favourites to mark any episode as a favorite. This will store it in your browser's local storage.

    Once added to favorites, episodes will be listed under the Your Favourites section.
    You can view and manage your favorites anytime, and episodes are grouped by show and season.

4. Filtering Shows by Genre, search of dropdown

The app allows you to filter podcasts by genre (e.g., Comedy, News, History, etc.), typing into the search bar for a specific podcast or adjusting the dropdown to display in your prefered order if that is not alphabetical. You simply select your desired genre with the button toggle below the navbar, or in the navbar itself use the search function or adjust the dropdown menu adjustent to this
🌍 Live Demo

You can check out the live version of the app hosted on Netlify at the following URL:

https://thepodcasthotspot.netlify.app/


⚡ Features

    Persistent Favourites: Your favorite episodes are saved in localStorage, so they persist even after a page refresh.
    Dynamic Data Fetching: All podcast data is dynamically fetched from an external API.


For questions or suggestions, feel free to reach out via email at your-email@example.com.
👨‍💻 Authors

    Steven Knobel - https://github.com/Stevenaknobel