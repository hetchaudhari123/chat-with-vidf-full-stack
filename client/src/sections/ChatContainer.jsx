import React, { useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
// import ReactMarkdown from 'react-markdown';
// import ReactMarkdown from 'react-markdown';

import { FaUserCircle, FaSignOutAlt, FaCaretDown } from 'react-icons/fa';
import {
  ChatHeader,
  Logo,
  DropdownMenu,
  DropdownItem,
  LogoutItem,
  MessagesContainer,
  Message,
  InputContainer,
  Input,
  Button,
} from './ChatStyles.jsx';
import { useCharacter } from '../contexts/CharacterContext.jsx';
import { useAuth0 } from '@auth0/auth0-react';
import ReactMarkdown from 'react-markdown';
const ChatContainer = () => {
  const { user, logout } = useAuth0();
  const [selectedCharacter, setSelectedCharacter] = useCharacter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  useEffect(() => {
    if (user) {
      const fetchChatHistory = async () => {
        try {
          const response = await fetch('/get-chat-history', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: user.email }) // Assuming user.email is available
          });
          const data = await response.json();
          if (data.history) {
            const pastMessages = data.history.map((entry) => ({
              id: uuidv4(),
              text: entry.question,
              isUser: true
            })).concat(data.history.map((entry) => ({
              id: uuidv4(),
              text: entry.response,
              isUser: false
            })));
            setMessages(pastMessages);
            console.log("Chat history fetched.....", pastMessages)
          }
        } catch (error) {
          console.error('Error fetching chat history:', error);
        }
      };
      fetchChatHistory();
    }
  }, [user]);
  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Add user message to messages
    const newMessage = {
      id: uuidv4(),
      text: trimmedInput,
      isUser: true,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Clear input field
    setInput('');

    // Call ask method with question and update with bot response
    try {
      const response = await ask(trimmedInput);
      const botResponse = {
        id: uuidv4(),
        text: response,
        isUser: false,
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("Error in ask function:", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <ChatContainerStyled>
      <ChatHeader>
        <div></div>
        <Logo onClick={toggleDropdown}>
          {user && user.picture ? (
            <img
              src={user.picture}
              alt="Logo"
              style={{ width: '30px', height: '30px', borderRadius: '50%' }}
            />
          ) : (
            <FaUserCircle size={30} />
          )}
          <FaCaretDown />
          {dropdownOpen && (
            <DropdownMenu>
              <DropdownItem>
                <FaUserCircle /> Profile
              </DropdownItem>
              <LogoutItem
                onClick={async () => {
                  try {
                    // await logout({ returnTo: "http://localhost:5173/" });
                    await logout({ returnTo: "https://chat-with-vidf-fdahoxcca-hetchaudhari123s-projects.vercel.app" });
                  } catch (error) {
                    console.error('Logout error:', error);
                    alert('Oops! Something went wrong while logging out. Please try again.');
                  }
                }}
              >
                <FaSignOutAlt /> Logout
              </LogoutItem>
            </DropdownMenu>
          )}
        </Logo>
      </ChatHeader>
      <MessagesContainer>
        {messages.map((message) => (
          <Message key={message.id} isUser={message.isUser}>
            {message.text}
          </Message>
        ))}
      </MessagesContainer>
      <InputContainer>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <Button onClick={handleSend} >Send</Button>
      </InputContainer>
    </ChatContainerStyled>
  );
};

export default ChatContainer;

const ChatContainerStyled = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.chatBackground};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;
