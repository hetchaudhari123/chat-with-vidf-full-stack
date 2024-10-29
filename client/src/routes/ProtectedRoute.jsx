import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
// import { useYoutube } from 'context/YoutubeContext';
import { useCharacter } from '../contexts/CharacterContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth0(); // Added isLoading to check loading state
//   const { youtubeId, setYoutubeId, playlistId, setPlaylistId, videoIds, setVideoIds, currentYoutubeId, setCurrentYoutubeId } = useYoutube();
  
  // Check if Auth0 is still loading the user data
  if (isLoading) {
    return(   <div class="loader-container fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div class="lds-hourglass"></div>
    </div>)
  }

  // console.log("From private route....", user);

  // If the user is authenticated, render the child components
  if (isAuthenticated && user) {
    return children;
  }

  // Otherwise, redirect to the home page
  return <Navigate to="/" />;
};

export default PrivateRoute;
