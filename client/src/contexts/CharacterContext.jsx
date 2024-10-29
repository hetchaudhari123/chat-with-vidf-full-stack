import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0 hook

const CharacterContext = createContext();

export const CharacterProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth0(); // Access Auth0 user information
  const [characters, setCharacters] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [fileName,setFileName] = useState(null)
  const [history,setHistory] = useState([])
  const fetchCharacter = async (email) => {
    try {
      // const response = await fetch("http://127.0.0.1:5000/character/list", {
      const response = await fetch("https://chat-with-vidf.onrender.com/character/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setCharacters(data.characters);
        localStorage.setItem("characters", JSON.stringify(data.characters));
      } else {
        console.error("Failed to fetch characters:", data.message);
      }
    } catch (error) {
      console.error("Error fetching characters:", error);
    }
  };

  // Load characters from localStorage or fetch from API
  useEffect(() => {
    console.log("User info from Auth0...........",user)
    const storedCharacters = JSON.parse(localStorage.getItem("characters"));
    if (storedCharacters) {
      setCharacters(storedCharacters);
    } else if (isAuthenticated && user?.email) {
      fetchCharacter(user.email);
    }
  }, [isAuthenticated, user]);

  return (
    <CharacterContext.Provider
      value={{
        selectedCharacter,
        setSelectedCharacter,
        fileName,
        setFileName,
        history,
        setHistory
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  return useContext(CharacterContext);
};
