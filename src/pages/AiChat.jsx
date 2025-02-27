import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { generateChatResponse, testApiConnection } from '../api/geminiApi'

const AiChat = () => {
  const [apiStatus, setApiStatus] = useState({ 
    loading: true, 
    connected: false, 
    error: null,
    model: null 
  });
  
  const [messages, setMessages] = useState([
    { id: 1, sender: 'match', text: "Hey there! How's it going? 👋", timestamp: Date.now() }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [difficulty, setDifficulty] = useState('medium')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null) // Add ref for input element
  
  // Test API connection when component mounts
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const result = await testApiConnection();
        setApiStatus({
          loading: false,
          connected: result.success,
          error: result.success ? null : result.error,
          model: result.model
        });
      } catch (err) {
        setApiStatus({
          loading: false,
          connected: false,
          error: err.message,
          model: null
        });
      }
    };
    
    checkApiConnection();
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  const handleSendMessage = async (e) => {
    e?.preventDefault()
    
    if (!inputMessage.trim()) return
    
    if (!apiStatus.connected) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'system',
          text: 'Sorry, API connection failed. Please check your API key and try again.',
          timestamp: Date.now()
        }
      ]);
      return;
    }
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputMessage,
      timestamp: Date.now()
    }
    
    setMessages(prevMessages => [...prevMessages, userMessage])
    setInputMessage('')
    setLoading(true)
    
    try {
      // Get AI response - simplified to just return text
      const responseText = await generateChatResponse(
        [...messages, userMessage], 
        difficulty
      )
      
      // Add AI message - simplified with just the text
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'match',
        text: responseText,
        timestamp: Date.now()
      }
      
      setMessages(prevMessages => [...prevMessages, aiMessage])
    } catch (error) {
      console.error('Error getting chat response:', error)
      
      // Add simplified error message
      setMessages(prevMessages => [
        ...prevMessages, 
        {
          id: Date.now() + 1,
          sender: 'system',
          text: "Sorry, I'm having trouble responding right now.",
          timestamp: Date.now()
        }
      ])
    }
    
    setLoading(false)
    
    // Add focus back to the input field after sending
    setTimeout(() => {
      inputRef.current?.focus()
    }, 50)
  }
  
  const startNewChat = () => {
    if (confirm('Start a new chat? This will clear the current conversation.')) {
      setMessages([
        { id: 1, sender: 'match', text: "Hey there! How's it going? 👋", timestamp: Date.now() }
      ])
    }
  }
  
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI Chat Practice</h1>
        <div className="flex items-center gap-4">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm"
          >
            <option value="easy">Easy Match</option>
            <option value="medium">Medium Match</option>
            <option value="hard">Hard Match</option>
          </select>
          <button 
            onClick={startNewChat}
            className="text-sm button-secondary py-1 px-3"
          >
            New Chat
          </button>
        </div>
      </div>
      
      {/* Only show API status while loading or if there's an error */}
      {(apiStatus.loading || !apiStatus.connected) && (
        <div className={`p-4 rounded-lg mb-6 ${
          apiStatus.loading ? "bg-gray-800 text-center" : 
          "bg-red-900 bg-opacity-20 border border-red-800"
        }`}>
          {apiStatus.loading ? (
            <p className="text-gray-300">Connecting to AI...</p>
          ) : (
            <>
              <p className="text-red-300 font-medium">API connection failed</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-3 bg-rizz-red px-4 py-2 rounded text-sm"
              >
                Retry
              </button>
            </>
          )}
        </div>
      )}
      
      <p className="text-gray-400 mb-4">
        Practice your flirting skills with AI before texting IRL.
      </p>
      
      <div className="card mb-4 h-96 overflow-y-auto flex flex-col">
        <div className="flex-grow space-y-4 p-2">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user' 
                    ? 'bg-rizz-red text-white rounded-tr-none' 
                    : message.sender === 'system'
                    ? 'bg-gray-800 text-gray-300'
                    : 'bg-gray-700 text-white rounded-tl-none'
                }`}
              >
                <p>{message.text}</p>
                <p className="text-xs opacity-70 text-right mt-1">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          ref={inputRef} // Add ref to input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={loading || !apiStatus.connected}
          className="input flex-grow"
          autoFocus // Add autoFocus
        />
        <button 
          type="submit" 
          disabled={loading || !inputMessage.trim() || !apiStatus.connected}
          className="button-primary flex items-center justify-center min-w-[60px]"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          )}
        </button>
      </form>
    </motion.div>
  )
}

export default AiChat
