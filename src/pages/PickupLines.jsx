import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ToneSlider from '../components/ToneSlider'
import { generatePickupLine, testApiConnection } from '../api/geminiApi'
// Import direct API as fallback
import directGeminiApi from '../utils/directGeminiApi'

// The rest of the component remains mostly the same, but we'll add a fallback pickup lines database
const FALLBACK_PICKUP_LINES = [
  { text: "Are you a Wi-Fi signal? Because I'm feeling a strong connection and want to see if we can Netflix and chill... responsibly. 😉", tone: 3 },
  { text: "Is your name Google? Because you have everything I've been searching for.", tone: 2 },
  { text: "Do you have a map? Because I just got lost in your eyes and need to find my way back to reality.", tone: 2 },
  { text: "Are you made of copper and tellurium? Because you're Cu-Te.", tone: 1 },
  { text: "If you were a vegetable, you'd be a cute-cumber.", tone: 1 },
  { text: "I must be a snowflake, because I've fallen for you.", tone: 0 },
  { text: "Are you a camera? Because every time I look at you, I smile.", tone: 0 },
  { text: "If I could rearrange the alphabet, I'd put 'U' and 'I' together.", tone: 1 },
  { text: "Do you believe in love at first sight, or should I walk by again?", tone: 2 },
  { text: "I'm not a photographer, but I can picture us together.", tone: 2 },
  { text: "Feel my shirt... know what it's made of? Boyfriend/girlfriend material.", tone: 3 },
  { text: "Are you French? Because Eiffel for you.", tone: 1 },
  { text: "I must be in a museum, because you're a work of art.", tone: 2 },
  { text: "Is it hot in here or is it just you?", tone: 3 },
  { text: "Your lips look lonely... would they like to meet mine?", tone: 4 },
  { text: "If you were a fruit, you'd be a fine-apple.", tone: 1 },
  { text: "Are you an interior decorator? Because when I saw you, the entire room became beautiful.", tone: 2 },
  { text: "I was going to say something really sweet about you, but I got lost in your eyes.", tone: 2 },
  { text: "Do you have a name or can I call you mine?", tone: 3 },
  { text: "I'm not a mathematician, but I'm pretty good with numbers. For example, I know yours is missing from my phone.", tone: 2 }
];

const PickupLines = () => {
  // Add API connection state with model info
  const [apiStatus, setApiStatus] = useState({ 
    loading: true, 
    connected: false, 
    error: null,
    model: null,
    useDirect: false
  });
  const [scenario, setScenario] = useState('')
  const [tone, setTone] = useState(1)
  const [pickupLine, setPickupLine] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  
  // Test both API connection methods when component mounts
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        // Try regular API first
        console.log("Trying regular API connection...");
        const result = await testApiConnection();
        
        if (result.success) {
          setApiStatus({
            loading: false,
            connected: true,
            error: null,
            model: result.model,
            useDirect: false
          });
          return;
        }
        
        // If regular API fails, try direct API
        console.log("Regular API failed, trying direct API...");
        const directResult = await directGeminiApi.testConnection();
        
        setApiStatus({
          loading: false,
          connected: directResult.success,
          error: directResult.success ? null : directResult.error,
          model: directResult.model,
          useDirect: directResult.success
        });
      } catch (err) {
        console.error("Both API connection methods failed:", err);
        setApiStatus({
          loading: false,
          connected: false,
          error: err.message,
          model: null,
          useDirect: false
        });
      }
    };
    
    checkApiConnection();
  }, []);
  
  // Load history from local storage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('pickupLineHistory')
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error('Failed to parse pickup line history:', e)
      }
    }
  }, [])
  
  // Save history to local storage when it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('pickupLineHistory', JSON.stringify(history))
    }
  }, [history])
  
  const exampleScenarios = [
    'At a coffee shop',
    'Gym rizz',
    'Bookstore encounter',
    'Dating app opener',
    'At a concert',
    'Study buddies'
  ]
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!apiStatus.connected) {
      setError("API connection failed. Please check your API key and try again.");
      return;
    }
    
    if (!scenario.trim()) {
      setError('Please enter a scenario for your pickup line')
      return
    }
    
    setLoading(true);
    try {
      let line;
      
      // Use the appropriate API method based on connection test
      if (apiStatus.useDirect) {
        const prompt = `Generate a creative pickup line for this scenario: "${scenario}" The tone should be ${
          tone === 0 ? "ultra casual, respectful, and subtle with a hint of interest" :
          tone === 1 ? "casual and playful with light flirtation" :
          tone === 2 ? "moderately flirty, teasing, and confident" :
          tone === 3 ? "bold, suggestive, and very flirtatious" :
          "extremely spicy, bold, and confident with straight W-rizz"
        }. Give me just the pickup line, nothing else.`;
        
        line = await directGeminiApi.generateContent(prompt);
      } else {
        line = await generatePickupLine(scenario, tone);
      }
      
      // If there's an error or the line is too short, use a fallback
      if (!line || line.includes("Sorry") || line.length < 10) {
        const filteredLines = FALLBACK_PICKUP_LINES.filter(l => l.tone === tone);
        if (filteredLines.length > 0) {
          line = filteredLines[Math.floor(Math.random() * filteredLines.length)].text;
        }
      }
      
      setPickupLine(line);
      setHistory(prev => [{ scenario, line, tone, timestamp: Date.now() }, ...prev].slice(0, 10));
    } catch (err) {
      setError('Failed to generate a pickup line. Please try again.');
      console.error(err);
    }
    setLoading(false);
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert('Copied to clipboard!'))
      .catch(err => console.error('Failed to copy text:', err))
  }
  
  const useExampleScenario = (example) => {
    setScenario(example)
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-6">Pick-Up Line Generator</h1>
      
      {/* API Status indicator */}
      {apiStatus.loading ? (
        <div className="p-4 bg-gray-800 rounded-lg mb-6 text-center">
          <p className="text-gray-300">Checking API connection...</p>
        </div>
      ) : apiStatus.connected ? (
        <div className="p-4 bg-green-900 bg-opacity-20 border border-green-800 rounded-lg mb-6 text-center">
          <p className="text-green-300">API connected successfully</p>
          <p className="text-xs text-gray-300 mt-1">
            Using model: {apiStatus.model} 
            {apiStatus.useDirect && " (Direct API mode)"}
          </p>
        </div>
      ) : (
        <div className="p-4 bg-red-900 bg-opacity-20 border border-red-800 rounded-lg mb-6">
          <p className="text-red-300 font-medium">API connection failed</p>
          <p className="text-gray-300 mt-2 text-sm">Error: {apiStatus.error}</p>
          {apiStatus.model && (
            <p className="text-gray-300 mt-1 text-sm">Model attempted: {apiStatus.model}</p>
          )}
          <p className="text-gray-300 mt-2 text-sm">
            Please check your API key and ensure you have access to the Gemini API.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 bg-rizz-red px-4 py-2 rounded text-sm"
          >
            Retry Connection
          </button>
        </div>
      )}

      <p className="text-gray-400 mb-8">
        Generate creative, customized pickup lines for any scenario.
      </p>
      
      <div className="mb-8">
        <h2 className="font-medium mb-3">Try these scenarios:</h2>
        <div className="flex flex-wrap gap-2">
          {exampleScenarios.map((example, index) => (
            <button
              key={index}
              onClick={() => useExampleScenario(example)}
              className="bg-gray-800 hover:bg-gray-700 text-sm py-1 px-3 rounded-lg transition duration-200"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="card mb-8">
        <div className="mb-6">
          <label htmlFor="scenario" className="block mb-2 font-medium">
            Describe your scenario
          </label>
          <input
            id="scenario"
            type="text"
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            className="input w-full"
            placeholder="At a coffee shop, gym, bookstore, etc..."
          />
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 font-medium">Adjust tone</label>
          <ToneSlider onChange={setTone} defaultValue={tone} />
        </div>
        
        <button 
          type="submit" 
          disabled={loading} 
          className="button-primary w-full flex justify-center items-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : "Generate Pickup Line"}
        </button>
      </form>
      
      {error && (
        <div className="bg-red-900 bg-opacity-30 border border-red-700 text-white rounded-lg p-4 mb-6">
          {error}
        </div>
      )}
      
      {pickupLine && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card border-rizz-cyan mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-lg">Your Pickup Line</h3>
            <button 
              onClick={() => copyToClipboard(pickupLine)}
              className="text-rizz-cyan hover:text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
            </svg>
            Copy
          </button>
        </div>
        <p className="text-white bg-gray-800 p-4 rounded-lg text-center italic text-lg">{pickupLine}</p>
        <div className="mt-4 text-center">
          <button 
            onClick={handleSubmit} 
            className="button-secondary"
          >
            Generate Another Line
          </button>
        </div>
      </motion.div>
      )}
      
      {history.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-4">Your Recent Lines</h3>
          <div className="space-y-4">
            {history.map((item, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">{item.scenario}</span>
                  <button 
                    onClick={() => copyToClipboard(item.line)}
                    className="text-rizz-cyan hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                    </svg>
                  </button>
                </div>
                <p className="italic">{item.line}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default PickupLines
