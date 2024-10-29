import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';
import { useAuth0 } from '@auth0/auth0-react';
import { useCharacter } from '../../contexts/CharacterContext';

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

// const ModalBackground = styled.div`
//   display: ${(props) => (props.show ? 'flex' : 'none')};
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background-color: rgba(0, 0, 0, 0.5);
//   justify-content: center;
//   align-items: center;
//   z-index: 999;
// `;
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

const FileInput = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const SubmitButton = styled.button`
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

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
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

const ButtonWithModal = ({ theme, handleSend }) => {
  const [showModal, setShowModal] = useState(false);
  const [fileType, setFileType] = useState('');

  const [loading, setLoading] = useState(false); // Loading state
  const [file, setFile] = useState(null);
  const { user } = useAuth0()
  const { fileName, setFileName, history, setHistory } = useCharacter()
  const [confirmModal, setConfirmModal] = useState(false)
  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleOpenConfirmModal = () => {
    setConfirmModal(true)
  }
  const handleCloseConfirmModal = () => {
    setConfirmModal(false)
  }
  const handleCloseModal = () => {
    setShowModal(false);
    setFileType('');
    setFile(null);
  };

  const handleChoice = (type) => {
    setFileType(type);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Logic to handle file submission
    if (file && user) {
      console.log(`File uploaded for ${fileType}:`, file.name);
      setLoading(true)
      try {
        // Create a FormData object to hold the file and other data
        const formData = new FormData();
        formData.append('file', file); // Append the file
        formData.append('email', user.email); // Append the user's email
        formData.append('file_type', fileType); // Append the file type

        // Send the file to the server
        // const response = await fetch('http://127.0.0.1:5000/file/upload', {
        const response = await fetch('https://chat-with-vidf.onrender.com/file/upload', {
          method: 'POST',
          body: formData, // Send form data
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log("Successfully sent the file")
          setFileName(file.name)
        } else {
          const errorText = await response.text(); // Get error message from response
          // console.log("Error sending the file")
          // handleSend(`Error uploading file: ${errorText}`, false); // Notify user of the error
        }
      } catch (error) {
        console.error('Error during file upload:', error);
        // handleSend(`Error uploading file: ${error.message}`, false); // Notify user of the error
      }finally {
        setLoading(false); // Set loading to false regardless of success or error
    }
    } else {
      console.log("No file selected or uploaded")
      // handleSend('No file selected for upload.', false); // Notify user if no file is selected
    }

    handleCloseModal(); // Close the modal after processing
    };
    const handleNewConversation = async () => {
      // Optional: Add a confirmation dialog if needed
      // const confirmNewConversation = window.confirm("Are you sure you want to start a new conversation? This will clear the current chat history.");

      // if (!confirmNewConversation) return; // Exit if the user cancels

      // Reset chat messages state
      setHistory([]); // Assuming setMessages is a state setter for your messages

      // Clear input field (if applicable)
      // setInput(''); // Assuming setInput is the state setter for your input field

      // Optional: Reset any other relevant states
      // e.g., clear file name, user data, etc.
      setFileName(''); // Clear the file name if applicable
      // You can reset other states as needed

      // If you need to send a request to the server to notify about the new conversation, you can do that here.
      try {
        // Assuming you have an endpoint to handle the new conversation, e.g., 'http://127.0.0.1:5000/new-conversation'
        // const response = await fetch('http://127.0.0.1:5000/clear-history', {
        const response = await fetch('https://chat-with-vidf.onrender.com/clear-history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: user.email }), // Pass user email if needed
        });

        const data = await response.json();
        console.log("New conversation started:", data);
        // Optionally handle any response from the server
        // setFileName("")

      } catch (error) {
        console.error("Error starting new conversation:", error);
      }
      handleCloseConfirmModal()
    };

    let MAX_LENGTH = 13;
    // console.log("Add PDF/Video".length)
    return (
      <CenteredContainer style={{ backgroundColor: theme.sidebarBackground, height: '7rem' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <SidebarButton
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}
            onClick={handleOpenConfirmModal}
          >
            <>
              <FaPlus /> Start new Conversation
            </>
          </SidebarButton>

          <SidebarButton
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', marginBottom: '30px' }} // Added margin below this button
            onClick={handleOpenModal}
          >
            {fileName ? (
              <>
                <FaPlus />
                {fileName.length > MAX_LENGTH ? `${fileName.slice(0, MAX_LENGTH)}...` : fileName}
              </>
            ) : (
              <>
                <FaPlus /> Add PDF/Video
              </>
            )}
          </SidebarButton>
        </div>
        <ModalBackground show={showModal} onClick={handleCloseModal}>
          <ModalContent
            style={{ backgroundColor: theme.sidebarBackground }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            <h2>Select File Type</h2>
            <ChoiceButton onClick={() => handleChoice('PDF')}>PDF</ChoiceButton>
            <ChoiceButton onClick={() => handleChoice('Video')}>Video</ChoiceButton>
            {fileType && (
              <>
                <h3>Upload {fileType}</h3>
                <form onSubmit={handleSubmit}>
                  <FileInput
                    type="file"
                    accept={fileType === 'PDF' ? 'application/pdf' : 'video/*'}
                    onChange={handleFileChange}
                    required
                  />
                  {/* <SubmitButton type="submit">Submit</SubmitButton> */}
                  <SubmitButton type="submit" disabled={loading}> {/* Disable button while loading */}
                {loading ? 'Submitting...' : 'Submit'}
            </SubmitButton>
                </form>
              </>
            )}
          </ModalContent>
        </ModalBackground>
        <ModalBackground show={confirmModal} onClick={handleCloseConfirmModal}>
          <ModalContent
            style={{ backgroundColor: theme.sidebarBackground }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={handleCloseConfirmModal}>&times;</CloseButton>
            <h2>Are you sure you want to start new conversation? The chat history and file will be removed.</h2>
            <ChoiceButton onClick={handleNewConversation}>Yes</ChoiceButton>
            <ChoiceButton onClick={() => setConfirmModal(false)}>No</ChoiceButton>
           
          </ModalContent>
        </ModalBackground>
      </CenteredContainer>
    );
  };

  export default ButtonWithModal;
