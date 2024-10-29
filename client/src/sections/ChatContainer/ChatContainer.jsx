import React from 'react';
import ChatHeader from '../ChatHeader/ChatHeader';
import MessagesContainer from '../MessageContainer/MessageContainer';
import InputContainer from '../InputContainer/InputContainer';
import './ChatContainer.css';
import { useCharacter } from '../../contexts/CharacterContext';
// import ReactMarkdown from 'react-markdown';

const ChatContainer = ({ loaderForGenerating,setLoaderForGenerating,theme, input, setInput, handleSend }) => {
  const {history,setHistory} = useCharacter()
  return (
    <div className="chat-container" style={{ backgroundColor: theme.chatBackground }}>
      <ChatHeader theme={theme} />
      <MessagesContainer loaderForGenerating={loaderForGenerating} setLoaderForGenerating={setLoaderForGenerating} theme={theme} />
      <InputContainer input={input} setInput={setInput} handleSend={handleSend} theme={theme} />
    </div>
  );
};

export default ChatContainer;
