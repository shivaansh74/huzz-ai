import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const features = [
    {
      title: "AI-Generated Rizz Coach",
      description: "Upload conversation screenshots or text snippets and get smooth, well-crafted responses.",
      icon: "💬",
      path: "/text-rizz"
    },
    {
      title: "Image Rizz Analyzer",
      description: "Get feedback on your selfies, outfits, and group photos with AI-powered drip checks.",
      icon: "📸",
      path: "/image-rizz"
    },
    {
      title: "Pick-Up Line Generator",
      description: "Generate creative pickup lines for any scenario with adjustable tone.",
      icon: "🔥",
      path: "/pickup-lines"
    },
    {
      title: "AI Chat Practice",
      description: "Practice your flirting skills with AI before talking to your crush.",
      icon: "🧠",
      path: "/ai-chat"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="text-white">Huzz</span>
          <span className="text-rizz-cyan">AI</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-300">
          No more dry texts. No more Ls. Just straight W-rizz.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/text-rizz" className="button-primary">Get Started</Link>
          <a href="#features" className="button-secondary">Learn More</a>
        </div>
      </div>

      <div id="features" className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {features.map((feature, index) => (
          <Link key={index} to={feature.path}>
            <motion.div 
              whileHover={{ 
                scale: 1.03, 
                boxShadow: '0 0 20px rgba(78, 205, 196, 0.2)' 
              }}
              className="card bg-gray-900 border-gray-800 hover:border-rizz-cyan transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default Home;
