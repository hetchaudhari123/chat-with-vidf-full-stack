import React, { useContext, useEffect, useState } from 'react';
import { curr_context } from '../../contexts/Central';
import './UserProfile.css';
import { useAuth0 } from '@auth0/auth0-react';
import { useCharacter } from '../../contexts/CharacterContext';
import styled from 'styled-components';

const ModalBackground = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'show', // Do not forward the 'show' prop
})`
  display: ${(props) => (props.show ? 'flex' : 'none')}; // Use 'show' for styling
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 999;
`;
const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
const ChoiceButton = styled.button`
  padding: 12px 24px;
  margin: 10px;
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
const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;


const StyledInput = styled.input`
  padding: 12px 16px; /* Inner padding for the input */
  margin: 10px 0; /* Margin to space it from other elements */
  border: 1px solid #ccc; /* Light grey border */
  border-radius: 5px; /* Rounded corners */
  font-size: 16px; /* Font size for the input text */
  width: 100%; /* Full width */
  box-sizing: border-box; /* Ensure padding is included in width */

  /* Placeholder styling */
  &::placeholder {
    color: #aaa; /* Light grey color for placeholder text */
    opacity: 1; /* Ensure the placeholder is fully opaque */
  }

  /* Transition effects */
  transition: border-color 0.3s ease;

  /* Hover and focus effects */
  &:hover {
    border-color: #007bff; /* Change border color on hover */
  }

  &:focus {
    border-color: #0056b3; /* Darker blue border when focused */
    outline: none; /* Remove default outline */
    box-shadow: 0 0 5px rgba(0, 86, 179, 0.5); /* Add shadow effect */
  }
`;
const CharacterModal = ({ theme, characters, setCharacters, isOpen, onClose, setIsOpen }) => {
  //   const { user = {}, set_user } = useContext(curr_context);
  const { isAuthenticated, user, isLoading } = useAuth0(); // Added isLoading to check loading state
  const [characterName, setCharacterName] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { selectedCharacter, setSelectedCharacter } = useCharacter()

  const handleSaveClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    try {
      
      // const response = await fetch("http://127.0.0.1:5000/character/add", {
      const response = await fetch("https://chat-with-vidf.onrender.com/character/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
          character_name: characterName,
          character_info: characterDescription,
        }),
      });
      

      if (response.ok) {
        const data = await response.json();
        console.log("Character added successfully:", data);
        setIsOpen(false); // Close the modal after saving
        
        setCharacters((prevList) => [
          ...prevList,  // Spread the existing list of characters
          {
            character_info: characterDescription,
            character_name: characterName,  // New character data
            character_id:data.character_id
          },
        ]);
        
      } else {
        console.error("Error adding character:", await response.text());
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setShowConfirmation(false);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleCancelClick = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      {/* <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="user-profile-edit-form">
          <div className="form-group">
            <label htmlFor="editName">Enter the character name</label>
            <input
              type="text"
              id="editName"
              value={characterName}
              style={{ color: "black" }}
              onChange={(e) => setCharacterName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="editDescription">Set Character Description</label>
            <input
              type="text"
              id="editDescription"
              value={characterDescription}
              style={{ color: "black" }}
              onChange={(e) => setCharacterDescription(e.target.value)}
            />
          </div>
          <button className="save-button" onClick={handleSaveClick}>Save</button>
          <button className="cancel-button" onClick={handleCancelClick}>Cancel</button>
        </div>
      </div>

      {showConfirmation && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to add this character?</p>
          <button onClick={handleConfirm}>Yes</button>
          <button onClick={handleCloseConfirmation}>No</button>
        </div>
      )} */}






      <ModalBackground show={isOpen} onClick={onClose}>
        <ModalContent
          style={{ backgroundColor: theme.sidebarBackground }}
          onClick={(e) => e.stopPropagation()}
        >
          <CloseButton onClick={onClose}>&times;</CloseButton>
          {/* <div className="form-group">
            <label htmlFor="editName"><h2>Enter the character name</h2></label>
            <input
              type="text"
              id="editName"
              value={characterName}
              style={{ color: "black" }}
              onChange={(e) => setCharacterName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="editDescription"><h2>Set Character Description</h2></label>
            <input
              type="text"
              id="editDescription"
              value={characterDescription}
              style={{ color: "black" }}
              onChange={(e) => setCharacterDescription(e.target.value)}
            />
          </div> */}
          <StyledInput
            type="text"
            placeholder="Enter the character name"
            style={{ color: "black" }}

            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
          />
          <StyledInput
            type="text"
            placeholder="Enter the character description"
            style={{ color: "black" }}

            value={characterDescription}
            onChange={(e) => setCharacterDescription(e.target.value)}
          />
          <ChoiceButton onClick={handleConfirm}>Yes</ChoiceButton>
          <ChoiceButton onClick={onClose}>No</ChoiceButton>
          {/* {fileType && (
            <>
              <h3>Upload {fileType}</h3>
              <form onSubmit={handleSubmit}>
                <FileInput
                  type="file"
                  accept={fileType === 'PDF' ? 'application/pdf' : 'video/*'}
                  onChange={handleFileChange}
                  required
                />
                <SubmitButton type="submit" disabled={loading}> 
                  {loading ? 'Submitting...' : 'Submit'}
                </SubmitButton>
              </form>
            </>
          )} */}
        </ModalContent>
      </ModalBackground>
    </div>
  );
};

export default CharacterModal;
