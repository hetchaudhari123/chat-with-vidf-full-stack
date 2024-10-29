import React, { useContext, useEffect, useState } from 'react';
import { FaHome, FaCommentDots, FaCog } from 'react-icons/fa';
import ToggleButton from '../ToggleButton/ToggleButton';
import './Sidebar.css';
import ButtonWithModal from './StyledButton';
import { curr_context } from '../../contexts/Central';
import UserProfileModal from '../ChatHeader/UserProfile';
import { GiCharacter } from "react-icons/gi";
import CharacterModal from '../ChatHeader/CharacterModal';
import { useAuth0 } from '@auth0/auth0-react';
import { IoMdPersonAdd } from "react-icons/io";
import { IoMdPerson } from "react-icons/io";
import { SiGooglegemini } from "react-icons/si";
import { useCharacter } from '../../contexts/CharacterContext';
import 'simplebar-react/dist/simplebar.min.css';
import SimpleBar from 'simplebar-react';
import { FaPlus } from 'react-icons/fa';
import styled from 'styled-components';
import { IoMdClose } from 'react-icons/io';
const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const SidebarButton = styled.button`
  padding: 12px 24px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }
`;
const Sidebar = ({ theme, setIsDarkTheme, isDarkTheme, handleSend }) => {
  const { user } = useAuth0()
  const { tables, setSelectedCollection, isMySQL, sqlObj, mongodbObj, setBeforeCall } = useContext(curr_context);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [characterList, setCharacterList] = useState([])
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [characterName, setCharacterName] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');
  const { selectedCharacter, setSelectedCharacter, fileName, setFileName } = useCharacter()
  useEffect(() => {
    // console.log("User...........",user)
    // Fetch all characters from MongoDB when the component mounts
    if (user) {


      const fetchCharacters = async () => {
        try {
          // const response = await fetch("http://127.0.0.1:5000/character/list", {
          const response = await fetch("https://chat-with-vidf.onrender.com/character/list", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user?.email
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setCharacterList(data.characters); // Assumes response contains { characters: [...] }
          } else {
            console.error("Failed to fetch characters:", await response.text());
          }
        } catch (error) {
          console.error("Error fetching characters:", error);
        }
      };
      const fetchFileContent = async () => {
        try {
          // const response = await fetch("http://127.0.0.1:5000/get-file-name", {
          const response = await fetch("https://chat-with-vidf.onrender.com/get-file-name", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user?.email
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setFileName(data.file_name); // Assumes response contains { characters: [...] }
          } else {
            console.error("Failed to fetch the file name:", await response.text());
          }
        } catch (error) {
          console.error("Error fetching file name:", error);
        }
      }
      fetchCharacters();
      fetchFileContent();
    }
  }, [user]);
  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };
  const [Toggle, setToggle] = useState(false);

  const openCharacterModal = () => {
    setIsCharacterModalOpen(true);
  };

  // Function to close all modals
  const closeModal = () => {
    setIsSettingsModalOpen(false);
    setIsCharacterModalOpen(false);
  };

  const openModal = () => {
    // console.log('hi');
    setToggle(true);
  };

  // const handleCharacterSubmit = () => {
  //   if (characterName && characterDescription) {
  //     console.log('Character Data:', { name: characterName, description: characterDescription });
  //     // You can add API call here to save the character data to the backend

  //     // Clear the form and close modal
  //     setCharacterName('');
  //     setCharacterDescription('');
  //     closeModal();
  //   } else {
  //     alert('Please fill in both fields.');
  //   }
  // };

  const handleDropdownItemClick = async (table) => {
    // setSelectedCollection(table);
    setIsDropdownVisible(false);
    setSelectedCollection(table);
    // setColl(table);
    // print(table)

    const url = isMySQL ? 'http://127.0.0.1:5000/mysql/connect' : 'http://127.0.0.1:5000/connect';
    // const url = isMySQL ? 'https://chat-with-database-api.vercel.app/mysql/connect' : 'https://chat-with-database-api.vercel.app/connect';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...sqlObj,
          mongo_url: mongodbObj.url,
          db_name: mongodbObj.database,
          collection_name: table,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        handleSend('You can now chat with your database.', false);
        setBeforeCall(true);
        console.log('Connection successful and data fetched', data);
      } else {
        const errorData = await response.json();
        handleSend(errorData.response, false);
        console.error('Error:', errorData.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };




  const removeCharacter = async (character) => {
    try {
        // Assuming you have access to the user's email, you can pass it here
        const userEmail = user.email; // Replace this with the actual email variable

        // Prepare the request payload with email and character ID
        const payload = {
            email: userEmail,
            character_id: character.character_id, // Assuming character.id corresponds to the character ID
        };

        // Sending a DELETE request to remove the character
        if(selectedCharacter?.character_id === character?.character_id) setSelectedCharacter(null)
          setCharacterList((prevList) => 
            prevList.filter((item) => item.character_id !== character.character_id) // Adjust this according to your data structure
        );
        // const response = await fetch(`http://127.0.0.1:5000/character/remove`, {
        const response = await fetch(`https://chat-with-vidf.onrender.com/character/remove`, {
            method: 'POST', // Use DELETE method to remove the character
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload), // Include the payload in the request body
        });

        if (!response.ok) {
            throw new Error('Failed to remove character');
        }

        // Update your local state to remove the character
    

        // Display a success message or handle additional logic
        console.log(`${character.character_name} has been removed successfully.`);
    } catch (error) {
        console.error('Error removing character:', error);
        // Optionally, you can handle error states or display an error message
    }
};

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: theme.sidebarBackground,
      }}
    >
      <div className="sidebar">
        <ToggleButton onClick={() => setIsDarkTheme((prev) => !prev)} />

        {/* <div className="sidebar-item" onClick={openModal}>
          <FaCog className="sidebar-icon" />
          Settings
        </div> */}
        <div className="sidebar-item" onClick={openCharacterModal}>
          {/* <FaCog className="sidebar-icon" /> */}
          {/* <IoMdPersonAdd className="sidebar-icon " />
          Add a Character */}
          <SidebarButton
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}
            onClick={openCharacterModal}
          >
              <IoMdPersonAdd className="sidebar-icon " />
          Add a Character
          </SidebarButton>
        </div>
        <div className="sidebar-item" >
          {/* <FaCog className="sidebar-icon" /> */}
          <SiGooglegemini className="sidebar-icon" />
          <div className={`sidebar-item ${!selectedCharacter ? 'gradient-text-sm' : ''}`}
            onClick={() => {
              setSelectedCharacter(null)
            }}>
            <h4 className=''>Gemini</h4>
          </div>
        </div>

        <SimpleBar style={{ maxHeight: '20rem' }} className=" overflow-y-auto w-full">
          <div className="flex flex-col w-full ">
            {characterList?.length > 0 && characterList.map((character, index) => (
              <div
                key={index}
                className={`sidebar-item  ${ selectedCharacter?.character_id === character.character_id ? 'gradient-text-sm' : ''}`}
                onClick={() => {
                  setSelectedCharacter({ character_name: character.character_name, character_info: character.character_info,character_id:character.character_id });
                }}
              >
                <IoMdPerson className="sidebar-icon" />
                <div className="flex justify-between w-full  sidebar-item character-details">
                  <h4 className=' w-[80%] '>{character.character_name}</h4>
                  <IoMdClose 
                            className=" text-red-500 cursor-pointer" // Style the close icon
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the parent div's onClick
                                removeCharacter(character); // Call the remove function
                            }} 
                        />
                </div>
              </div>
            ))}
          </div>
          </SimpleBar>
        {/* </div> */}

      </div>
      <ButtonWithModal theme={theme} isDarkTheme={isDarkTheme} handleSend={handleSend} />
      {Toggle && <UserProfileModal isOpen={Toggle} onClose={closeModal} />}
      {isCharacterModalOpen && <CharacterModal
        theme={theme}
        characters={characterList}
        setCharacters={setCharacterList}
        isOpen={isCharacterModalOpen}
        setIsOpen={setIsCharacterModalOpen}
        onClose={closeModal}
      />}
    </div>
  );
};

export default Sidebar;
