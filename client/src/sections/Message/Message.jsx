import React from 'react';
import './Message.css';
import ReactMarkdown from 'react-markdown';

const Message = ({ message, theme }) => {
  return (
    <div
      className="message"
      style={{
        backgroundColor: message.isUser ? theme.userMessageBackground : theme.responseMessageBackground,
        alignSelf: message.isUser ? 'flex-end' : 'flex-start',

      }}
    >
      <ReactMarkdown>{message.text}</ReactMarkdown>
      {/* {message.text} */}
    </div>
  );
};

export default Message;
