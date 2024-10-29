import React, { useContext, useEffect, useRef } from 'react';
import Message from '../Message/Message';
import './MessageContainer.css';
import { curr_context } from '../../contexts/Central';
import { useCharacter } from '../../contexts/CharacterContext';
import { useAuth0 } from '@auth0/auth0-react';
import ReactMarkdown from 'react-markdown';

const MessagesContainer = ({  loaderForGenerating,setLoaderForGenerating,theme }) => {
  const messagesEndRef = useRef(null);
  const scrollbarStyle = {
    '--scrollbar-track-color': theme.inputBackground,
    '--scrollbar-thumb-color': theme.inputBorder,
    '--scrollbar-thumb-hover-color': theme.inputBorder,
  };
  // const { user } = useContext(curr_context);
  const {user} = useAuth0()
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const {history,setHistory} = useCharacter()

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  return (
    <div className="messages-container" style={scrollbarStyle}>
      {user && (
        <>
          <div style={{display:"flex",flexDirection:"column",justifyContent:'center',alignItems:"flex-start",textAlign:"left",margin:"auto",marginTop:'4rem',marginBottom:'15rem'}}>
            <h1 className="gradient-text">Hello,{user.name.split(' ')[0]}</h1>
            <h1 style={{ fontSize: '3rem', color: 'lightgray' }}>
              Let's Start Chatting With Your PDFs and Videos.
            </h1>
          </div>
        </>
      )}

      {history.map((message,index) => (
        <Message key={index} message={message} theme={theme} />
      ))}
      {loaderForGenerating && <div className="loading-message gradient-text-sm">Generating response...</div>}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesContainer;
