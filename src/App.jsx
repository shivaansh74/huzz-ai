import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import TextRizz from './pages/TextRizz';
import ImageRizz from './pages/ImageRizz';
import PickupLines from './pages/PickupLines';
import AIChat from './pages/AIChat';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-deep-black">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/text-rizz" element={<TextRizz />} />
              <Route path="/image-rizz" element={<ImageRizz />} />
              <Route path="/pickup-lines" element={<PickupLines />} />
              <Route path="/ai-chat" element={<AIChat />} />
            </Routes>
          </AnimatePresence>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

export default App;
