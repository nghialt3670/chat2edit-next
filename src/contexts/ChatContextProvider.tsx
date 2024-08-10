import React, { ReactNode, useState } from "react";
import MessagesContext from "./MessagesContext";

interface ChatContextProviderProps {
  children: ReactNode;
}

const ChatContextProvider: React.FC<ChatContextProviderProps> = ({
  children,
}) => {
  // Define the state and methods you want to provide here
  const [messages, setMessages] = useState<string[]>([]);

  // Example function to add a message
  const addMessage = (message: string) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  // Example function to clear all messages
  const clearMessages = () => {
    setMessages([]);
  };

  // Provide context value
  const contextValue = {
    messages,
    addMessage,
    clearMessages,
  };

  return (
    <MessagesContext.Provider value={contextValue}>
      {children}
    </MessagesContext.Provider>
  );
};

export default ChatContextProvider;
