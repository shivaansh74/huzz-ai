import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-background border-t border-gray-800 py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <Link to="/" className="text-xl font-bold">
              Huzz<span className="text-rizz-cyan">AI</span>
            </Link>
            <p className="text-sm text-gray-400 mt-1">
              The Ultimate AI-Powered Rizz Coach
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-6 md:mb-0">
            <Link to="/" className="text-gray-400 hover:text-white transition px-2 py-1">Home</Link>
            <Link to="/text-rizz" className="text-gray-400 hover:text-white transition px-2 py-1">Text Rizz</Link>
            <Link to="/image-rizz" className="text-gray-400 hover:text-white transition px-2 py-1">Image Rizz</Link>
            <Link to="/pickup-lines" className="text-gray-400 hover:text-white transition px-2 py-1">Pickup Lines</Link>
            <Link to="/ai-chat" className="text-gray-400 hover:text-white transition px-2 py-1">AI Chat</Link>
          </div>
          
          <div className="text-center md:text-right">
            <div className="text-xs text-gray-500">
              Powered by Google Gemini API
            </div>
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-500 mt-8">
          &copy; {new Date().getFullYear()} HuzzAI. All rights reserved. For entertainment purposes only.
        </div>
      </div>
    </footer>
  )
}

export default Footer
