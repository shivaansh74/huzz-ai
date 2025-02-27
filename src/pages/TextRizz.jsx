import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import ToneSlider from '../components/ToneSlider'
import { generateTextResponse } from '../api/geminiApi'
import Tesseract from 'tesseract.js'

const TextRizz = () => {
  const [conversation, setConversation] = useState('')
  const [tone, setTone] = useState(2)
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [extractingText, setExtractingText] = useState(false)
  const [extractedText, setExtractedText] = useState('')
  const responseRef = useRef(null)
  const fileInputRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setCopied(false)
    
    const textToProcess = extractedText || conversation
    
    if (!textToProcess.trim()) {
      setError('Please enter some conversation text or upload an image')
      return
    }
    
    setLoading(true)
    try {
      const result = await generateTextResponse(textToProcess, tone)
      setResponse(result)
      
      // Scroll to response
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      
    } catch (err) {
      console.error('Error generating response:', err)
      setError('Failed to generate a response. Please try again.')
    }
    setLoading(false)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.match('image.*')) {
      setError('Please select an image file (PNG, JPG, JPEG)')
      return
    }
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
    }
    reader.readAsDataURL(file)
    
    // Extract text from image
    setExtractingText(true)
    try {
      setError(null)
      
      const { data } = await Tesseract.recognize(
        file,
        'eng',
        { logger: m => console.log(m) }
      )
      
      // Store the extracted text separately, don't show to user
      setExtractedText(data.text)
      setExtractingText(false)
    } catch (err) {
      console.error('Error extracting text from image:', err)
      setError('Failed to extract text from image. Please try again or enter text manually.')
      setExtractingText(false)
    }
  }
  
  const clearImage = () => {
    setImagePreview(null)
    setExtractedText('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(err => console.error('Failed to copy text:', err))
  }
  
  const exampleConversations = [
    "Would you rather live in a place where it snowed all the time or a place that was super hot?",
    "Hey, I noticed you like hiking. What's your favorite trail?",
    "I've been ghosted for 3 days, need to restart the conversation",
    "They asked what I do for work, how do I make my job sound interesting?",
    "Asked them out but they said they're busy this weekend"
  ]
  
  const useExample = (example) => {
    setConversation(example)
    setExtractedText('')
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-3xl mx-auto px-4 sm:px-6"
    >
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Text Rizz Generator</h1>
      <p className="text-gray-400 mb-6 md:mb-8 text-sm md:text-base">
        Paste your conversation, upload a screenshot, or describe the situation to get the perfect response.
      </p>
      
      <div className="mb-6 md:mb-8">
        <h2 className="font-medium mb-2 md:mb-3 text-sm md:text-base">Try these examples:</h2>
        <div className="flex overflow-x-auto pb-2 md:flex-wrap gap-2 scrollbar-hide">
          {exampleConversations.map((example, index) => (
            <button
              key={index}
              onClick={() => useExample(example)}
              className="bg-gray-800 hover:bg-gray-700 text-sm py-1 px-3 rounded-lg transition duration-200 whitespace-nowrap md:whitespace-normal flex-shrink-0"
            >
              {example.length > (window.innerWidth < 640 ? 20 : 30) 
                ? `${example.substring(0, window.innerWidth < 640 ? 20 : 30)}...` 
                : example
              }
            </button>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="card mb-6 md:mb-8">
        <div className="mb-4 md:mb-6">
          <label className="block mb-2 font-medium text-sm md:text-base">
            Upload a conversation screenshot
          </label>
          
          {!imagePreview ? (
            <div 
              className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center cursor-pointer hover:border-rizz-cyan transition-colors min-h-[120px] flex items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <div className="flex flex-col items-center py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mb-3">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <p className="text-sm text-gray-400">Tap to upload a screenshot</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="rounded-lg max-h-60 mx-auto"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                {extractingText ? (
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full border-t-4 border-rizz-cyan border-solid h-8 w-8 mb-2"></div>
                    <p className="text-sm text-white">Reading text...</p>
                  </div>
                ) : (
                  <div className="flex space-x-3">
                    <button 
                      type="button"
                      className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm"
                      onClick={clearImage}
                    >
                      Remove Image
                    </button>
                    {extractedText && (
                      <button
                        type="submit"
                        className="bg-rizz-cyan hover:bg-cyan-600 text-white px-3 py-2 rounded-md text-sm"
                      >
                        Generate Response
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="conversation" className="block mb-2 font-medium">
            Or type/paste your conversation:
          </label>
          <textarea
            id="conversation"
            value={conversation}
            onChange={(e) => setConversation(e.target.value)}
            className="input w-full h-32"
            placeholder="Paste the last few messages of your conversation or describe the situation you need help with..."
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 font-medium">Adjust tone</label>
          <ToneSlider onChange={setTone} defaultValue={tone} />
        </div>
        
        <button 
          type="submit" 
          disabled={loading || extractingText} 
          className="button-primary w-full flex justify-center items-center h-12 md:h-auto"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Response...
            </>
          ) : extractingText ? "Extracting Text..." : "Generate Response"}
        </button>
      </form>
      
      {error && (
        <div className="bg-red-900 bg-opacity-30 border border-red-700 text-white rounded-lg p-4 mb-6">
          {error}
        </div>
      )}
      
      {response && (
        <motion.div 
          ref={responseRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card border-rizz-cyan mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-lg">Your Response</h3>
            <button 
              onClick={copyToClipboard}
              className={`text-sm px-3 py-1 rounded-md flex items-center gap-1 transition-colors ${
                copied ? 'bg-green-800 text-white' : 'text-rizz-cyan hover:bg-gray-800'
              }`}
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-white">{response}</p>
          </div>
          <div className="mt-4 text-center">
            <button 
              onClick={handleSubmit} 
              className="button-secondary"
            >
              Regenerate Response
            </button>
          </div>
        </motion.div>
      )}
      
      <div className="bg-gray-900 rounded-lg p-4">
        <h3 className="text-lg font-medium mb-2">Text Rizz Tips</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-400 text-sm">
          <li>Ask open-ended questions that can't be answered with just "yes" or "no"</li>
          <li>Show genuine interest by responding to details they share</li>
          <li>Add some personality with light humor or emojis when appropriate</li>
          <li>Keep messages concise - avoid walls of text</li>
          <li>End messages with something that makes it easy for them to respond</li>
          <li>Match their energy and communication style</li>
        </ul>
      </div>
    </motion.div>
  )
}

export default TextRizz
