import { createContext, Context } from 'react'

// Define the shape of the context value
interface MessagesContextType {
  messages: string[]
  addMessage: (message: string) => void
  clearMessages: () => void
}

// Create a default value for the context (could be empty or with default functions)
const defaultContextValue: MessagesContextType = {
  messages: [],
  addMessage: () => {},
  clearMessages: () => {}
}

// Create the context with the default value
const MessagesContext: Context<MessagesContextType> =
  createContext(defaultContextValue)

export default MessagesContext
