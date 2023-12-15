// ChatApp.tsx

import React, { useState, useEffect } from 'react';
import './ChatApp.css';

interface Message {
  content: string;
  isUser: boolean;
}

const apiUrl = "http://localhost:5001";
let globalIntervalId: any

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userMessage, setUserMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [assistantMessage, setAssistantMessage] = useState<string | undefined>(undefined);

  const addMessage = (content: string, isUser: boolean): void => {
    messages.splice(messages.length, 0, {content, isUser})
  }; 

  const getAssistantMessage = async (): Promise<void> => {
    try {
      // Make a GET request to get the assistant's message
      const response = await fetch(`${apiUrl}/chat/getMessage`);
      console.log('messages', messages)

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('data', data)
      const newAssistantMessage = data.message.lastMessageText;

      // Only update if the assistant's message has changed
      if (newAssistantMessage !== assistantMessage && newAssistantMessage !== "") {
        if(data.message.role === 'assistant'){
          setAssistantMessage(newAssistantMessage);
          clearInterval(globalIntervalId)
        }

        // Display the assistant's message
        if (newAssistantMessage !== undefined && data.message.role === 'assistant') {
          addMessage(newAssistantMessage, false);
        }
      }
    } catch (error) {
      console.error('Error fetching assistant message:', error.message);
      // Handle the error if needed
    } finally {
      // Reset loading to false when the request is complete
      setLoading(false);
    }
  };

  const handleInput = async (event: React.KeyboardEvent<HTMLInputElement>): Promise<void> => {
    if (event.key === 'Enter' && userMessage.trim() !== '') {
      console.log('user pressed enter')
      addMessage(userMessage, true)

      //getAssistantMessage();
      const intervalId = setInterval(() => {
        getAssistantMessage();
        globalIntervalId = intervalId
      }, 5000);


      try {
        // Set loading to true to show a loading indicator  
        //setLoading(true);

        // Make a POST request to send the user's message
        await fetch(`${apiUrl}/chat/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userMessage }),
        });
      } catch (error) {
        console.error('Error making API requests:', error.message);
        // Handle the error if needed
      } finally {
        // Reset loading to false when the request is complete
        // setLoading(false);
      }

      // Clear the input box
      setUserMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="message-container">
        {messages.map((message: Message, index) => (
          <div key={index} className={message.isUser ? 'user-message' : 'assistant-message'}>
            {message.isUser ? <p>User: {message.content}</p> : <p>Assistant: {message.content}</p>} 
          </div>
        ))}
        {loading && <div className="loading-indicator">Loading...</div>}
      </div>
      <input
        type="text"
        placeholder="Type your message..."
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        onKeyDown={handleInput}
      />
    </div>
  );
};

export default ChatApp;
