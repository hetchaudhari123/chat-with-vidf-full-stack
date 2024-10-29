import React, { useContext, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { useAuth0 } from '@auth0/auth0-react';
import { v4 as uuidv4 } from 'uuid';
import { curr_context } from './contexts/Central';
import { lightTheme, darkTheme } from './themes';
import AppContainer from './sections/AppContainer/AppContainer';
import Sidebar from './sections/Sidebar/Sidebar';
import ChatContainer from './sections/ChatContainer/ChatContainer';
import { useEffect } from 'react';
import { useCharacter } from './contexts/CharacterContext';
const Chatbot = () => {
  // const [messages, setMessages] = useState([]);
  const [loaderForGenerating,setLoaderForGenerating] = useState(false)
  const [input, setInput] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const {history,setHistory,selectedCharacter,setSelectedCharacter} = useCharacter()
  const { user,logout } = useAuth0();
  useEffect(() => {
    if (user) {
      const fetchChatHistory = async () => {
        try {
          // const response = await fetch('http://127.0.0.1:5000/get-chat-history', { 
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json'
          //   },
          //   body: JSON.stringify({ email: user.email }) // Assuming user.email is available
          // });
          const response = await fetch('https://chat-with-vidf.onrender.com/get-chat-history', { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: user.email }) // Assuming user.email is available
          });
          
          // Check if the response is OK (status 200)
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
  
          const data = await response.json();
          if (data.history) {
            // Assuming data.history is an array of objects with question and response fields
            const pastMessages = [];
  
            // Iterate over the history array and alternate between user and bot messages
            for (let i = 0; i < data.history.length; i++) {
              // Push the user message
              pastMessages.push({
                id: uuidv4(),
                text: data.history[i].question,
                isUser: true,
              });
              // Push the bot response
              pastMessages.push({
                id: uuidv4(),
                text: data.history[i].response,
                isUser: false,
              });
            }
  
            setHistory(pastMessages);
            console.log("Chat history fetched.....", pastMessages);
          }
        } catch (error) {
          console.error('Error fetching chat history:', error);
        }
      };
  
      fetchChatHistory();
    }
  }, [user]);
  const ask = async ({ email, question }) => {
    try {
      setLoaderForGenerating(true);
      console.log("Character............",selectedCharacter)
      console.log("Character Name............",selectedCharacter?.character_name)
      console.log("Character Info............",selectedCharacter?.character_info)
      // const response = await fetch('http://127.0.0.1:5000/user/ask', {
      const response = await fetch('https://chat-with-vidf.onrender.com/user/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          question: question,
          character_name:selectedCharacter?.character_name,
          character_info:selectedCharacter?.character_info
        }),
      })
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data.response; // Assuming your API returns a 'response' field
    } catch (error) {
      console.error('Error in ask function:', error);
      throw error; // Rethrow the error to be caught in handleSend
    }finally {
      setLoaderForGenerating(false); // Reset loading state after response is received
  }
  };
  
  const handleSend = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    if (!input.trim()) return; // Don't submit if the input is empty
  
    // Create a user message object
    const userMessage = {
      id: uuidv4(),
      text: input,
      isUser: true,
    };
  
    // Update the messages state with the user message
    setHistory((prevMessages) => [...prevMessages, userMessage]);
  
    // Optionally, clear the input field after submission
    setInput('');
  
    // Call your ask function or API here to get the bot's response
    try {
      // Ensure user is authenticated and has an email
      if (!user || !user.email) {
        throw new Error('User is not authenticated or email is missing');
      }
  
      // Call the API and pass the user email and input question
      const response = await ask({
        email: user.email,
        question: input,
      }); // Modify the ask function accordingly to accept an object
  
      // Create a bot message object
      const botMessage = {
        id: uuidv4(),
        text: response,
        isUser: false,
      };
  
      // Update the messages state with the bot response
      setHistory((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Optionally handle the error by showing a message in the chat
      const errorMessage = {
        id: uuidv4(),
        text: 'Error: Unable to send message.',
        isUser: false,
      };
      setHistory((prevMessages) => [...prevMessages, errorMessage]);
    }
  };
  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <AppContainer theme={isDarkTheme ? darkTheme : lightTheme}>
        <Sidebar
          theme={isDarkTheme ? darkTheme : lightTheme}
          setIsDarkTheme={setIsDarkTheme}
          handleSend={handleSend}
        />

        <ChatContainer
          theme={isDarkTheme ? darkTheme : lightTheme}
          // messages={messages}
          // setMessages={setMessages}
          loaderForGenerating = {loaderForGenerating}
          setLoaderForGenerating = {setLoaderForGenerating}
          input={input}
          setInput={setInput}
          handleSend={handleSend}
        />
      </AppContainer>
    </ThemeProvider>
  );
};

export default Chatbot;
