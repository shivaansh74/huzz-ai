import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { analyzeImage } from '../api/geminiApi'

const ImageRizz = () => {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const fileInputRef = useRef(null)
  
  // Function to handle image upload and immediate analysis
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setError(null);
    
    if (!file.type.match('image.*')) {
      setError('Please select an image file (PNG, JPG, JPEG)');
      return;
    }
    
    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    // Start loading state 
    setLoading(true);
    
    // Process image for analysis
    const base64Reader = new FileReader();
    base64Reader.onload = async (e) => {
      const base64String = e.target.result.split(',')[1];
      
      // Save image data and start analysis immediately
      setImage(base64String);
      
      try {
        console.log("Auto-analyzing uploaded image...");
        const analysisResult = await analyzeImage(base64String);
        setResult(analysisResult);
      } catch (err) {
        console.error('Error analyzing image:', err);
        setError('Failed to analyze image. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    base64Reader.onerror = () => {
      setError('Failed to process image. Please try another one.');
      setLoading(false);
    };
    base64Reader.readAsDataURL(file);
  };
  
  const resetForm = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-6">Image Rizz Analyzer</h1>
      <p className="text-gray-400 mb-8">
        Upload your selfie, outfit pic, or potential profile photo and get personalized feedback, vibe check, and caption suggestions.
      </p>
      
      <div className="card mb-8">
        <div className="mb-6">
          <label htmlFor="image-upload" className="block mb-2 font-medium">
            Upload your image
          </label>
          
          {!preview ? (
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-rizz-cyan transition-colors"
                 onClick={() => fileInputRef.current?.click()}>
              <input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mb-4">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <p className="text-sm text-gray-400">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG (max 5MB)</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <img 
                src={preview} 
                alt="Preview" 
                className="rounded-lg max-h-80 mx-auto"
              />
              <button
                onClick={resetForm}
                className="absolute top-2 right-2 bg-gray-900 p-1 rounded-full hover:bg-gray-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-red-900 bg-opacity-30 border border-red-700 text-white rounded-lg p-4 mb-6">
            {error}
          </div>
        )}
      </div>
      
      {loading && (
        <div className="text-center mb-8 p-8">
          <div className="inline-block animate-spin rounded-full border-t-4 border-rizz-cyan border-solid h-12 w-12 mr-2"></div>
          <p className="text-gray-400 mt-4">Analyzing your image...</p>
        </div>
      )}
      
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card border-rizz-cyan mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Analysis Results</h2>
              <div className={`px-3 py-1 rounded ${
                result.vibe === 'W' ? 'bg-green-900 bg-opacity-20 text-green-400' :
                result.vibe === 'L' ? 'bg-red-900 bg-opacity-20 text-red-400' :
                'bg-gray-700 text-gray-300'
              }`}>
                {result.vibe} Rizz
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Overall Score</span>
                <span className="font-medium">{result.score}/10</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-rizz-cyan to-rizz-red h-2.5 rounded-full" 
                  style={{ width: `${result.score * 10}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Feedback</h3>
              <p className="text-gray-300">{result.feedback}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Suggested Captions</h3>
              <div className="space-y-2">
                {result.caption_suggestions.map((caption, index) => (
                  <div key={index} className="bg-gray-800 p-3 rounded-lg flex justify-between">
                    <span className="italic text-gray-300">"{caption}"</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(caption)}
                      className="text-rizz-cyan hover:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Would They Swipe?</h3>
              <p className="text-xl font-bold text-center py-2 bg-gray-800 rounded-lg">
                {result.would_swipe}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Improvement Tips</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-300">
                {result.improvements.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
            
            <button
              onClick={resetForm}
              className="mt-6 button-primary w-full"
            >
              Analyze Another Image
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ImageRizz
